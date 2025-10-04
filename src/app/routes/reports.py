from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from src.app.db.dependencies import get_db
from src.app.models.items import MainView
from src.app.schemas.items import MainViewResponse

router = APIRouter()


@router.get("/reports/{user_id}", response_model=List[MainViewResponse])
def get_reports(user_id: int, db: Session = Depends(get_db)):
    reports = db.query(MainView).filter(MainView.user_id == user_id).all()
    if not reports:
        raise HTTPException(status_code=404, detail="Reports not found for this user")
    return reports
