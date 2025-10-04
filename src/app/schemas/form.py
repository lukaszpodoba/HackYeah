from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class FormCreate(BaseModel):
    user_id: int
    departure_id: int
    stop_id: int
    category: str
    line_id: int
    delay: int

class FormResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    departure_id: int
    report_time: Optional[datetime] = None
    as_form: Optional[int] = None
    confirmed_by_admin: Optional[bool] = None
    like_total: Optional[int] = None
    dislike_total: Optional[int] = None
    stop_id: Optional[int] = None
    category: Optional[str] = None
    line_id: Optional[int] = None
    delay: Optional[int] = None
