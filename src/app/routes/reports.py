import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from src.app.db.dependencies import get_db
from src.app.models.items import Form
from src.app.schemas.form import FormCreate
from src.app.schemas.form import FormResponse
from datetime import datetime, timezone

router = APIRouter()


# Getting all forms for specific user
@router.get("/forms/{user_id}", response_model=List[FormResponse])
def get_reports(user_id: int, db: Session = Depends(get_db)):
    reports = db.query(Form).filter(Form.user_id == user_id).all()
    if not reports:
        raise HTTPException(status_code=404, detail="Reports not found for this user")
    return reports


# Return concrete form
@router.get("/reports/{report_id}")
def get_single_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(Form).filter(Form.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report


# Creating form
@router.post("/forms/", response_model=FormResponse)
def create_form(
    payload: FormCreate,
    db: Session = Depends(get_db)
):
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


