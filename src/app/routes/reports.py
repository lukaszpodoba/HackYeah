from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.app.db.dependencies import get_db
from src.app.models.items import Form
from src.app.schemas.form import FormCreate, FormResponse
from src.app.services.scoring_db_core import (
    create_form_with_initial_score,
    refresh_form_score,
    apply_like_dislike,
    daily_update_user_as,
)

router = APIRouter()


@router.get("/{user_id}", response_model=List[FormResponse])
def get_reports(user_id: int, db: Session = Depends(get_db)):
    """List user's reports (Form rows)."""
    reports = db.query(Form).filter(Form.user_id == user_id).all()
    if not reports:
        raise HTTPException(status_code=404, detail="Reports not found for this user")
    return reports


@router.post("", response_model=FormResponse)
def create_report(payload: FormCreate, db: Session = Depends(get_db)):
    """Create report and compute initial authenticity (as_form)."""
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
