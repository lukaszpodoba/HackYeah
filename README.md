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