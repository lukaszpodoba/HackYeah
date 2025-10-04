from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from src.app.db.dependencies import get_db
from src.app.models.items import Form, User, Departure, Stop, Line
from src.app.schemas.form import FormCreate
from src.app.schemas.form import FormResponse
from datetime import datetime, timezone

router = APIRouter()


# Getting all forms for specific user
@router.get("/forms/user/{user_id}", response_model=List[FormResponse])
def get_reports(user_id: int, db: Session = Depends(get_db)):
    reports = db.query(Form).filter(Form.user_id == user_id).all()
    if not reports:
        raise HTTPException(status_code=404, detail="Reports not found for this user")
    return reports


# Return concrete form
@router.get("/forms/{form_id}", response_model=FormResponse)
def get_single_report(form_id: int, db: Session = Depends(get_db)):
    report = db.query(Form).filter(Form.id == form_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report


# Creating form
@router.post("/forms/", response_model=FormResponse)
def create_form(
    payload: FormCreate,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == payload.user_id).first()
    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    departure = db.query(Departure).filter(Departure.id == payload.departure_id).first()
    if not departure:
        raise HTTPException(status_code=400, detail="Departure not found")

    stop = db.query(Stop).filter(Stop.id == payload.stop_id).first()
    if not stop:
        raise HTTPException(status_code=400, detail="Stop not found")

    line = db.query(Line).filter(Line.id == payload.line_id).first()
    if not line:
        raise HTTPException(status_code=400, detail="Line not found")

    if payload.delay < 0:
        raise HTTPException(status_code=400, detail="Delay cannot be negative")

    new_form = Form(
        user_id=payload.user_id,
        departure_id=payload.departure_id,
        report_time=datetime.now(timezone.utc),
        as_form=0,
        confirmed_by_admin=False,
        like_total=0,
        dislike_total=0,
        stop_id=payload.stop_id,
        category=payload.category,
        line_id=payload.line_id,
        delay=payload.delay
    )
    db.add(new_form)
    db.commit()
    db.refresh(new_form)
    return new_form


# Increasing upvote
@router.put("/forms/{id}/like", response_model=FormResponse)
def increment_like(id: int, db: Session = Depends(get_db)):
    db_report = db.query(Form).filter(Form.id == id).first()
    if not db_report:
        raise HTTPException(status_code=404, detail="Report not found")

    db_report.like_total = (db_report.like_total or 0) + 1

    db.commit()
    db.refresh(db_report)
    return db_report


# Increasing downvote
@router.put("/forms/{id}/dislike", response_model=FormResponse)
def increment_dislike(id: int, db: Session = Depends(get_db)):
    db_report = db.query(Form).filter(Form.id == id).first()
    if not db_report:
        raise HTTPException(status_code=404, detail="Report not found")

    db_report.dislike_total = (db_report.dislike_total or 0) + 1

    db.commit()
    db.refresh(db_report)
    return db_report


