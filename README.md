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
sudo apt install sqlite3                # Linux (Debian/Ubuntu)
brew install sqlite                     # macOS
https://www.sqlite.org/download.html    #windows

### Uwtorz plik bazy
sqlite3 src/db/hackyeah.db

### Wczytaj schemat
.read src/db/db_init.sql

### Wczytaj dane
.read src/db/seed_db.sql

