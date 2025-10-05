from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.app.routes import reports  # lub inne Twoje routery

app = FastAPI()

# 👇 pozwól na połączenie z frontendu Angulara
origins = [
    "http://localhost:4200",   # Angular dev server
    "http://127.0.0.1:4200",   # alternatywny adres
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT, DELETE, OPTIONS
    allow_headers=["*"],  # np. Content-Type, Authorization itd.
)

# ✅ zarejestruj router
app.include_router(reports.router)
