from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from src.app.db.dependencies import get_db
from src.app.models.items import Form
from src.app.schemas.form import FormCreate
from src.app.schemas.form import FormResponse
from datetime import datetime, timezone
from src.app.services.email_service import send_email
from fastapi import BackgroundTasks
from src.app.models.items import Form, User, Departure, Stop, Line
from src.app.schemas.form import FormCreate, FormResponse
from src.app.services.scoring_db_core import (
    create_form_with_initial_score,
    refresh_form_score,
    apply_like_dislike,
    daily_update_user_as,
)

router = APIRouter()


# Getting all forms
@router.get("/forms/", response_model=List[FormResponse])
def get_all_forms(
    db: Session = Depends(get_db),
    limit: int = 100,
    offset: int = 0,
):
    # Enforce a reasonable maximum limit
    max_limit = 1000
    if limit > max_limit:
        limit = max_limit
    forms = db.query(Form).offset(offset).limit(limit).all()
    return forms


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
def create_report(payload: FormCreate, db: Session = Depends(get_db)):
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
            confirmed_by_admin=False,
        )
        return form
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{id}/like", response_model=FormResponse)
def increment_like(id: int, db: Session = Depends(get_db)):
    """+1 like and refresh authenticity."""
    try:
        form = apply_like_dislike(db, form_id=id, like_delta=1)
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

# send email
@router.post("/send_email")
async def send_email_endpoint(background_tasks: BackgroundTasks):
    subject = "Dziękujemy za zgłoszenie"
    body = """
        <h3>Cześć Marta,</h3>
        <p>Dziękujemy za przesłanie formularza.</p>
        <p>Twój formularz został zapisany w systemie i oczekuje na weryfikację.</p>
        <br>
        <small>Zespół HackYeah Rail App 🚆</small>
    """
    background_tasks.add_task(send_email, subject, ["martademianiuk7@gmail.com"], body)
    return {"message": "Email został wysłany w tle"}