from pydantic import BaseModel


class FormCreate(BaseModel):
    user_id: int
    departure_id: int
    stop_id: int
    category: str
    line_id: int
    delay: int
