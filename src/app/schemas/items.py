from pydantic import BaseModel


class MainViewResponse(BaseModel):
    id: int
    departure_id: int
    form_id: int
    confirmed_by_admin: bool
    like_total: int
    dislike_total: int

    class Config:
        orm_mode = True
