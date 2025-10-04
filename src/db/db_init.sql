-- ================================================
-- SQLite schema for hvckyeah.db
-- ================================================

PRAGMA foreign_keys = ON;

-- ================================================
-- Tabela: Przystanek
-- ================================================
CREATE TABLE IF NOT EXISTS Przystanek (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kod_przystanku INTEGER NOT NULL UNIQUE,
    nazwa_przystanku TEXT NOT NULL,
    szerokosc_geo REAL,
    dlugosc_geo REAL
);

-- ================================================
-- Tabela: Linia
-- ================================================
DROP TABLE IF EXISTS Linia;
CREATE TABLE IF NOT EXISTS Linia (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nazwa_krotka TEXT NOT NULL UNIQUE,
    nazwa_dluga TEXT
);

-- ================================================
-- Tabela: Uzytkownik
-- ================================================
DROP TABLE IF EXISTS Uzytkownik;
CREATE TABLE IF NOT EXISTS Uzytkownik (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    imie TEXT NOT NULL,
    nazwisko TEXT NOT NULL,
    haslo TEXT NOT NULL,
    rola TEXT,
    as_score INTEGER,
    linia_id INTEGER,
    FOREIGN KEY (linia_id) REFERENCES Linia(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- ================================================
-- Tabela: Odjazd
-- ================================================
DROP TABLE IF EXISTS Odjazd;
CREATE TABLE IF NOT EXISTS Odjazd (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    linia_id INTEGER,
    przystanek_id INTEGER,
    planowana_godzina_przyjazdu TEXT,
    planowana_godzina_odjazdu TEXT,
    rzeczywista_godzina_przyjazdu TEXT,
    rzeczywista_godzina_odjazdu TEXT,
    FOREIGN KEY (linia_id) REFERENCES Linia(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (przystanek_id) REFERENCES Przystanek(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ================================================
-- Tabela: Formularz
-- ================================================
DROP TABLE IF EXISTS Formularz;
CREATE TABLE IF NOT EXISTS Formularz (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    czas_zgloszenia TEXT DEFAULT CURRENT_TIMESTAMP,
    przystanek_id INTEGER,
    kategoria TEXT,
    linia_id INTEGER,
    opoznienie INTEGER,
    FOREIGN KEY (przystanek_id) REFERENCES Przystanek(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    FOREIGN KEY (linia_id) REFERENCES Linia(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- ================================================
-- Tabela: Main_view
-- ================================================
DROP TABLE IF EXISTS Main_view;
CREATE TABLE IF NOT EXISTS Main_view (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uzytkownik_id INTEGER,
    odjazd_id INTEGER,
    formularz_id INTEGER,
    as_score INTEGER,
    potwierdzone_przez_admina BOOLEAN DEFAULT 0,
    like_total INTEGER DEFAULT 0,
    dislike_total INTEGER DEFAULT 0,
    FOREIGN KEY (uzytkownik_id) REFERENCES Uzytkownik(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (odjazd_id) REFERENCES Odjazd(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (formularz_id) REFERENCES Formularz(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
