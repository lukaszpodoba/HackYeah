from pydantic import BaseModel
from datetime import datetime


class FormCreate(BaseModel):
    user_id: int
    departure_id: int
    stop_id: int
    category: str
    line_id: int
    delay: int


class FormResponse(BaseModel):
    id: int
    user_id: int
    departure_id: int
    report_time: datetime
    as_form: int
    confirmed_by_admin: bool
    like_total: int
    dislike_total: int
    stop_id: int
    category: str
    line_id: int
    delay: int

    class Config:
        orm_mode = True

