PRAGMA foreign_keys = OFF;

-- Czyszczenie tabel w odpowiedniej kolejności (z zachowaniem kluczy obcych)
DELETE FROM Main_view;
DELETE FROM Formularz;
DELETE FROM Odjazd;
DELETE FROM Uzytkownik;
DELETE FROM Linia;
DELETE FROM Przystanek;

PRAGMA foreign_keys = ON;

-- ================================================
-- Linia
-- ================================================
INSERT INTO Linia (nazwa_krotka, nazwa_dluga) VALUES
('A', 'Linia A - Centrum'),
('B', 'Linia B - Lotnisko'),
('C', 'Linia C - Dworzec'),
('D', 'Linia D - Stadion'),
('E', 'Linia E - Uniwersytet');

-- ================================================
-- Przystanki
-- ================================================
INSERT INTO Przystanek (kod_przystanku, nazwa_przystanku, szerokosc_geo, dlugosc_geo) VALUES
(101, 'Dworzec Główny', 50.061, 19.938),
(102, 'Centrum', 50.065, 19.945),
(103, 'Uniwersytet', 50.067, 19.950),
(104, 'Lotnisko', 50.080, 19.785),
(105, 'Stadion', 50.045, 19.970),
(106, 'Nowa Huta', 50.070, 20.040),
(107, 'Kazimierz', 50.050, 19.945),
(108, 'Podgórze', 50.040, 19.940),
(109, 'Bonarka', 50.030, 19.960),
(110, 'Plac Inwalidów', 50.080, 19.920);

-- ================================================
-- Użytkownicy (bez kolumny linia_id)
-- ================================================
INSERT INTO Uzytkownik (imie, nazwisko, haslo, rola, as_score) VALUES
('Jan', 'Kowalski', 'pass123', 'admin', 1),
('Anna', 'Nowak', 'pass123', 'uzytkownik', 0),
('Tomasz', 'Wiśniewski', 'pass123', 'uzytkownik', 0),
('Karolina', 'Zielińska', 'pass123', 'moderator', 1),
('Piotr', 'Mazur', 'pass123', 'uzytkownik', 0),
('Magda', 'Sikora', 'pass123', 'uzytkownik', 0),
('Paweł', 'Krawczyk', 'pass123', 'uzytkownik', 0),
('Ewa', 'Lis', 'pass123', 'uzytkownik', 0),
('Marek', 'Lewandowski', 'pass123', 'uzytkownik', 0),
('Julia', 'Baran', 'pass123', 'uzytkownik', 0);

-- ================================================
-- Odjazdy
-- ================================================
INSERT INTO Odjazd (linia_id, przystanek_id, planowana_godzina_przyjazdu, planowana_godzina_odjazdu, rzeczywista_godzina_przyjazdu, rzeczywista_godzina_odjazdu)
VALUES
(1,1,'2025-10-04 06:00','2025-10-04 06:05','2025-10-04 06:02','2025-10-04 06:06'),
(2,2,'2025-10-04 07:00','2025-10-04 07:05','2025-10-04 07:02','2025-10-04 07:06'),
(3,3,'2025-10-04 08:00','2025-10-04 08:05','2025-10-04 08:03','2025-10-04 08:06'),
(4,4,'2025-10-04 09:00','2025-10-04 09:05','2025-10-04 09:00','2025-10-04 09:05'),
(5,5,'2025-10-04 10:00','2025-10-04 10:05','2025-10-04 10:02','2025-10-04 10:07');

-- ================================================
-- Formularze
-- ================================================
INSERT INTO Formularz (czas_zgloszenia, przystanek_id, kategoria, linia_id, opoznienie)
VALUES
('2025-10-04 10:00',1,'Opóźnienie',1,5),
('2025-10-04 10:05',2,'Awaria',2,10),
('2025-10-04 10:15',3,'Inne',3,2),
('2025-10-04 10:30',4,'Opóźnienie',4,15),
('2025-10-04 10:45',5,'Awaria',5,8);

-- ================================================
-- Main_view (ok. 100 rekordów)
-- ================================================
WITH RECURSIVE seq(x) AS (
  SELECT 1
  UNION ALL
  SELECT x+1 FROM seq WHERE x < 100
)
INSERT INTO Main_view (uzytkownik_id, odjazd_id, formularz_id, as_score, potwierdzone_przez_admina, like_total, dislike_total)
SELECT
  (ABS(random()) % 10) + 1,  -- losowy użytkownik
  (ABS(random()) % 5) + 1,   -- losowy odjazd
  (ABS(random()) % 5) + 1,   -- losowy formularz
  (ABS(random()) % 2),       -- losowy as_score
  (ABS(random()) % 2),       -- potwierdzone przez admina (0/1)
  (ABS(random()) % 50),      -- like_total
  (ABS(random()) % 10)       -- dislike_total
FROM seq;

-- ================================================
-- Podsumowanie
-- ================================================
SELECT COUNT(*) AS liczba_wierszy FROM Main_view;
