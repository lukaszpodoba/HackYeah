from fastapi import FastAPI
from src.app.routes import reports  # przykładowy router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[""],  # Or ["http://localhost:4200/"] for stricter control
    allow_credentials=True,
    allow_methods=[""],
    allow_headers=["*"],
)

app.include_router(reports.router, prefix="/reports", tags=["forms"])