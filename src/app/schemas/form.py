from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict


class StopBase(BaseModel):
    id: int
    stop_code: int
    stop_name: str
    latitude: Optional[float]
    longitude: Optional[float]
    model_config = ConfigDict(from_attributes=True)


class FormCreate(BaseModel):
    user_id: int
    departure_id: int
    stop_id: int
    category: str
    line_id: int
    delay: int
    model_config = ConfigDict(from_attributes=True)


class StopBase(BaseModel):
    id: int
    stop_code: int
    stop_name: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    model_config = ConfigDict(from_attributes=True)


class FormResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    departure_id: int
    report_time: Optional[datetime] = None
    confirmed_by_admin: Optional[bool] = None
    as_form: Optional[int] = None
    like_total: Optional[int] = None
    dislike_total: Optional[int] = None
    stop_id: Optional[int] = None
    category: Optional[str] = None
    line_id: Optional[int] = None
    delay: Optional[int] = None
    is_email_sent: Optional[bool] = None
    stop: Optional[StopBase] = None


class GroupedFormsResponse(BaseModel):
    line_id: int
    forms: List[FormResponse]
    model_config = ConfigDict(from_attributes=True)


class RouteStop(BaseModel):
    stop_code: int
    stop_name: str
    line_id_change_here: Optional[int] = None
    model_config = ConfigDict(from_attributes=True)


class RouteSegment(BaseModel):
    line_id: int
    start_stop_code: int
    end_stop_code: int
    distance_km: Optional[float] = None
    model_config = ConfigDict(from_attributes=True)


class RouteResponse(BaseModel):
    total_cost_km: Optional[float]
    stops: list[RouteStop]
    segments: list[RouteSegment]
    model_config = ConfigDict(from_attributes=True)
