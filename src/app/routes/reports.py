from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from src.app.db.dependencies import get_db
from src.app.models.items import Form
from src.app.schemas.items import MainViewResponse

router = APIRouter()


# Getting all forms for specific user
@router.get("/reports/{user_id}", response_model=List[MainViewResponse])
def get_reports(user_id: int, db: Session = Depends(get_db)):
    reports = db.query(Form).filter(Form.user_id == user_id).all()
    if not reports:
        raise HTTPException(status_code=404, detail="Reports not found for this user")
    return reports


# Increasing upvote
@router.put("/reports/{id}/like", response_model=MainViewResponse)
def increment_like(id: int, db: Session = Depends(get_db)):
    db_report = db.query(Form).filter(Form.id == id).first()
    if not db_report:
        raise HTTPException(status_code=404, detail="Report not found")

    db_report.like_total = (db_report.like_total or 0) + 1

    db.commit()
    db.refresh(db_report)
    return db_report


# Increasing downvote
@router.put("/reports/{id}/dislike", response_model=MainViewResponse)
def increment_dislike(id: int, db: Session = Depends(get_db)):
    db_report = db.query(Form).filter(Form.id == id).first()
    if not db_report:
        raise HTTPException(status_code=404, detail="Report not found")

    db_report.dislike_total = (db_report.dislike_total or 0) + 1

    db.commit()
    db.refresh(db_report)
    return db_report


#
