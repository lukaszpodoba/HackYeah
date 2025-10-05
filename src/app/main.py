from fastapi import FastAPI
from src.app.routes import reports

app = FastAPI()

app.include_router(reports.router, prefix="/reports", tags=["forms"])
# app.include_router(users.router, prefix="/users", tags=["users"])
