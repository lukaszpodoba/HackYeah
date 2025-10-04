-- ================================================
-- SQLite schema for hvckyeah.db (updated with as_history)
-- ================================================

PRAGMA foreign_keys = ON;

-- ================================================
-- Tabela: stop
-- ================================================
DROP TABLE IF EXISTS stop;
CREATE TABLE IF NOT EXISTS stop (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stop_code INTEGER UNIQUE,
    stop_name TEXT NOT NULL,
    latitude REAL,
    longitude REAL
);

-- ================================================
-- Tabela: line
-- ================================================
DROP TABLE IF EXISTS line;
CREATE TABLE IF NOT EXISTS line (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    short_name TEXT,
    long_name TEXT
);

-- ================================================
-- Tabela: as_history
-- ================================================
DROP TABLE IF EXISTS as_history;
CREATE TABLE IF NOT EXISTS as_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    as_field INTEGER,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES user(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ================================================
-- Tabela: user
-- ================================================
DROP TABLE IF EXISTS user;
CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    password TEXT NOT NULL,
    role TEXT,
    line_id INTEGER,
    FOREIGN KEY (line_id) REFERENCES line(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- ================================================
-- Tabela: departure
-- ================================================
DROP TABLE IF EXISTS departure;
CREATE TABLE IF NOT EXISTS departure (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    line_id INTEGER,
    stop_id INTEGER,
    planned_arrival_time TEXT,
    planned_departure_time TEXT,
    actual_arrival_time TEXT,
    actual_departure_time TEXT,
    FOREIGN KEY (line_id) REFERENCES line(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (stop_id) REFERENCES stop(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ================================================
-- Tabela: form
-- ================================================
DROP TABLE IF EXISTS form;
CREATE TABLE IF NOT EXISTS form (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_time TEXT DEFAULT CURRENT_TIMESTAMP,
    stop_id INTEGER,
    category TEXT,
    line_id INTEGER,
    delay INTEGER,
    FOREIGN KEY (stop_id) REFERENCES stop(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    FOREIGN KEY (line_id) REFERENCES line(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- ================================================
-- Tabela: main_view
-- ================================================
DROP TABLE IF EXISTS main_view;
CREATE TABLE IF NOT EXISTS main_view (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    departure_id INTEGER,
    form_id INTEGER,
    as_field INTEGER,
    confirmed_by_admin BOOLEAN DEFAULT 0,
    like_total INTEGER DEFAULT 0,
    dislike_total INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES user(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (departure_id) REFERENCES departure(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (form_id) REFERENCES form(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
