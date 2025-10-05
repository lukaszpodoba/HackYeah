from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict


class FormCreate(BaseModel):
    user_id: int
    departure_id: int
    stop_id: int
    category: str
    line_id: int
    delay: int


class StopBase(BaseModel):
    id: int
    stop_code: int
    stop_name: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    class Config:
        orm_mode = True




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
    stop: Optional[StopBase] = None

class RouteStop(BaseModel):
    stop_code: int
    stop_name: str
    line_id_change_here: Optional[int] = None
class RouteSegment(BaseModel):
    line_id: int
    start_stop_code: int
    end_stop_code: int
    distance_km: Optional[float] = None
class RouteResponse(BaseModel):
    total_cost_km: Optional[float]
    stops: list[RouteStop]
    segments: list[RouteSegment]
