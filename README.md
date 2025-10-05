## Polish 🇵🇱

Skrypt **automatycznie:** *./scripts/start.sh*
- tworzy środowisko i instaluje wszystkie zależności backendu (Python)
- odbudowuje oraz seeduje bazę SQLite – nic nie musisz robić ręcznie
- buduje oraz uruchamia frontend (Angular)
- odpala backend (FastAPI, Python)
- otwiera aplikację w przeglądarce (frontend)

---

### Wymagania

- **Python 3.12+** (oraz narzędzie `uv`, `sqlite3`)
- **Node.js + npm** (do frontendu)
- **Git Bash/Zsh/Bash** (Linux/macOS lub Windows z Git Bash)

*Jeśli nie masz narzędzi — skrypt w terminalu powie, czego brakuje!*

---

### Technologie

- **Backend:** Python, FastAPI, SQLAlchemy, SQLite
- **Frontend:** Angular (TypeScript)
- **Baza Danych:** SQLite (plik lokalny)
- **Zarządzanie środowiskiem:** pyproject.toml + uv (brak pip req)
- **Start całości:** Bash script
- **Automatyczne uruchomienie w przeglądarce**

---

### Po starcie

- **Frontend:** http://localhost:4200
- **Backend API:** http://localhost:8000
- **Swagger Docs:** http://localhost:8000/docs

---

**Nie wymaga żadnych dodatkowych kroków poza uruchomieniem skryptu.**  
Wszystko dzieje się automatycznie!

---

**Zespół HackYeah**

---

## English 🇬🇧🇺🇸

The script **automatically:** *./scripts/start.sh*
- creates and installs backend (Python) environment and dependencies
- rebuilds and seeds the SQLite database – no manual work required
- builds and starts the frontend (Angular)
- launches the backend (FastAPI, Python)
- opens the frontend in your browser automatically

---

### Requirements

- **Python 3.12+** (with `uv`, `sqlite3`)
- **Node.js + npm** (for frontend)
- **Git Bash/Zsh/Bash** (Linux/macOS or Windows with Git Bash)

*If any tools are missing, the script will tell you in the terminal!*

---

### Technologies

- **Backend:** Python, FastAPI, SQLAlchemy, SQLite
- **Frontend:** Angular (TypeScript)
- **Database:** SQLite (local file)
- **Environment management:** pyproject.toml + uv
- **Start everything:** Bash script
- **Automatic browser launch**

---

### After starting

- **Frontend:** http://localhost:4200
- **Backend API:** http://localhost:8000
- **Swagger Docs:** http://localhost:8000/docs

---

**You only need to run the script; nothing else is required!**  
Everything is automatic.

---

**HackYeah Team**
