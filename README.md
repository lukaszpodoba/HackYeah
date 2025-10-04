# HackYeah - quick start

## Setup
uv sync                 # tworzy .venv i instaluje zależności

## Po zmianach w pyproject.toml
uv lock                 # odśwież lockfile
uv sync                 # zsynchronizuj środowisko

## Aktywacja środowiska (macOS/Linux)
source .venv/bin/activate

## Jakość kodu (Makefile)
make format             # sformatuj i napraw proste problemy \
make check              # lint \
make test               # pytest

## SQLite setup
sudo apt install sqlite3                # Linux (Debian/Ubuntu) \
brew install sqlite                     # macOS \
https://www.sqlite.org/download.html    #windows

### Uwtorz plik bazy
sqlite3 src/app/db/hackyeah.db

### Wczytaj schemat
.read src/app/db/db_init.sql

### Wczytaj dane
.read src/app/db/seed_db.sql

### Lub wywolaj wszystko za jednym razem
sqlite3 src/app/db/hackyeah.db ".read src/app/db/db_init.sql" ".read src/app/db/seed_db.sql"

### Usun baze
rm src/app/db/hackyeah.db   #macOS \
del src\app\db\hackyeah.db  #Windows

### Uruchomienie FastAPI
1. uvicorn src.app.main:app --reload
2. http://127.0.0.1:8000/docs
3. lub użyj terminala: curl http://127.0.0.1:8000/reports/1






