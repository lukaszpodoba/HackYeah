from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from sqlalchemy import select
from src.app.db.dependencies import get_db
from src.app.services.email_service import send_email
from fastapi import BackgroundTasks
from src.app.models.items import Form, User, Departure, Stop, Line, user_line
from src.app.schemas.form import FormCreate, FormResponse, GroupedFormsResponse
from src.app.services.scoring_db_core import (
    create_form_with_initial_score,
    refresh_form_score,
    apply_like_dislike,
    daily_update_user_as,
)

from src.app.schemas.form import RouteResponse
from src.app.services.route_service import find_route

router = APIRouter()


@router.get("/users/{user_id}/lines/reports", response_model=List[GroupedFormsResponse])
def get_user_lines_reports(user_id: int, db: Session = Depends(get_db)):
    line_ids = db.execute(
        select(user_line.c.line_id).where(user_line.c.user_id == user_id)
    ).scalars().all()
    if not line_ids:
        raise HTTPException(status_code=404, detail="User not assigned to any line")

    result = []
    for line_id in line_ids:
        forms = db.query(Form)\
            .options(joinedload(Form.stop))\
            .filter(Form.line_id == line_id)\
            .all()
        forms_sorted = sorted(
            forms,
            key=lambda f: (f.as_form is not None, f.as_form),  # None na koniec
            reverse=True
        )
        forms_response = [FormResponse.model_validate(form) for form in forms_sorted]
        result.append(GroupedFormsResponse(line_id=line_id, forms=forms_response))
    return result


# Getting all forms
@router.get("/forms/", response_model=List[FormResponse])
def get_all_forms(db: Session = Depends(get_db), limit: int = 100, offset: int = 0):
    max_limit = 1000
    if limit > max_limit:
        limit = max_limit
    forms = db.query(Form).options(joinedload(Form.stop)).offset(offset).limit(limit).all()
    return forms


# Getting all forms for specific user
@router.get("/forms/user/{user_id}", response_model=List[FormResponse])
def get_reports(user_id: int, db: Session = Depends(get_db)):
    """List user's reports (Form rows)."""
    reports = db.query(Form).options(joinedload(Form.stop)).filter(Form.user_id == user_id).all()
    if not reports:
        raise HTTPException(status_code=404, detail="Reports not found for this user")
    return reports


@router.get("/forms/{form_id}", response_model=FormResponse)
def get_single_report(form_id: int, db: Session = Depends(get_db)):
    """Return a single report by ID."""
    report = db.query(Form).filter(Form.id == form_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report


@router.post("", response_model=FormResponse)
def create_report(
    payload: FormCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)
):
    """Create report and compute initial authenticity (as_form)."""
    user = db.query(User).filter(User.id == payload.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    departure = db.query(Departure).filter(Departure.id == payload.departure_id).first()
    if not departure:
        raise HTTPException(status_code=404, detail="Departure not found")

    stop = db.query(Stop).filter(Stop.id == payload.stop_id).first()
    if not stop:
        raise HTTPException(status_code=404, detail="Stop not found")

    line = db.query(Line).filter(Line.id == payload.line_id).first()
    if not line:
        raise HTTPException(status_code=404, detail="Line not found")

    if payload.delay < 0:
        raise HTTPException(status_code=400, detail="Delay cannot be negative")

    is_admin = user.role == "admin"

    try:
        form = create_form_with_initial_score(
            db,
            user_id=payload.user_id,
            departure_id=payload.departure_id,
            stop_id=payload.stop_id,
            line_id=payload.line_id,
            category=payload.category,
            reported_delay_min=payload.delay,
            official_delay_min=None,
            confirmed_by_admin=is_admin,
        )
        db.commit()
        db.refresh(form)

        if is_admin and form.confirmed_by_admin and form.as_form > 1 and not form.is_email_sent:
            send_as_notification(form, db, background_tasks)
            db.commit()
            db.refresh(form)

        return form
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{id}/like", response_model=FormResponse)
def increment_like(id: int, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    try:
        form = apply_like_dislike(db, form_id=id, like_delta=1)

        if not form.is_email_sent and (form.as_form > 1 or not form.confirmed_by_admin):
            send_as_notification(form, db, background_tasks)
            db.commit()
            db.refresh(form)

        return form
    except ValueError:
        raise HTTPException(status_code=404, detail="Report not found")


@router.put("/{id}/dislike", response_model=FormResponse)
def increment_dislike(id: int, db: Session = Depends(get_db)):
    """+1 dislike and refresh authenticity."""
    try:
        form = apply_like_dislike(db, form_id=id, dislike_delta=1)
        return form
    except ValueError:
        raise HTTPException(status_code=404, detail="Report not found")


@router.put("/{id}/accept", response_model=FormResponse)
def accept_report(id: int, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    form = db.get(Form, id)
    if not form:
        raise HTTPException(status_code=404, detail="Report not found")
    form.confirmed_by_admin = True
    if not form.is_email_sent and form.as_form > 1:
        send_as_notification(form, db, background_tasks)

    db.commit()
    db.refresh(form)
    return form


@router.post("/{id}/refresh", response_model=FormResponse)
def refresh_report(id: int, db: Session = Depends(get_db)):
    """Recompute authenticity using confirmations, freshness, and time-decay."""
    try:
        form = refresh_form_score(db, form_id=id, official_delay_min=None)
        return form
    except ValueError:
        raise HTTPException(status_code=404, detail="Report not found")


@router.post("/users/{user_id}/as-daily")
def user_as_daily(
    user_id: int,
    declarated_delay_min: Optional[int] = None,
    real_delay_min: Optional[int] = None,
    approved_by_admin: bool = False,
    db: Session = Depends(get_db),
):
    """Append daily trust (As_history.as_user) and return stored value."""
    try:
        val = daily_update_user_as(
            db,
            user_id=user_id,
            declarated_delay_min=declarated_delay_min,
            real_delay_min=real_delay_min,
            approved_by_admin=approved_by_admin,
        )
        return {"user_id": user_id, "stored_as_value": val}
    except ValueError:
        raise HTTPException(status_code=404, detail="User not found")


@router.get("/route/{start_stop_code}/{end_stop_code}", response_model=RouteResponse)
def get_route_by_codes(
    start_stop_code: int,
    end_stop_code: int,
    db: Session = Depends(get_db),
):

    TRANSFER_PENALTY_KM = 2.0

    resp = find_route(
        session=db,
        start_stop_code=start_stop_code,
        end_stop_code=end_stop_code,
        transfer_penalty_km=TRANSFER_PENALTY_KM,
    )
    if resp.total_cost_km is None and not resp.stops:
        raise HTTPException(status_code=404, detail="Route not found")
    return resp


def send_as_notification(form, db, background_tasks):
    users = db.query(User).join(User.lines).filter(Line.id == form.line_id).all()

    subject = f"🚨 Wysoki wskaźnik AS na linii {form.line_id}"
    body = f"""
    <h3>Uwaga!</h3>
    <p>W formularzu o ID <b>{form.id}</b> wystąpił wysoki wskaźnik AS.</p>
    <p><b>Kategoria:</b> {form.category}</p>
    <p><b>AS:</b> {form.as_form}</p>
    <p><b>Linia:</b> {form.line_id}</p>
    <p><b>Opóźnienie:</b> {form.delay} minut</p>
    <br>
    <small>System HackYeah Rail App 🚆</small>
    """

    for user in users:
        if hasattr(user, "email") and user.email:
            background_tasks.add_task(send_email, subject, [user.email], body)
    form.is_email_sent = True
