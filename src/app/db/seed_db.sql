PRAGMA foreign_keys = ON;

-- clear in FK-safe order
DELETE FROM form;
DELETE FROM departure;
DELETE FROM as_history;
DELETE FROM user_line;
DELETE FROM "user";
DELETE FROM line;
DELETE FROM stop;

-- ================================================
-- line
-- ================================================
INSERT INTO line (short_name, long_name) VALUES
('SKA1', 'SKA1 – Kraków Główny ↔ Wieliczka Rynek-Kopalnia'),
('SKA2', 'SKA2 – Sędziszów ↔ Kraków Główny ↔ Podbory Skawińskie'),
('SKA3', 'SKA3 – Kraków Główny ↔ Tarnów'),
('SKA4', 'SKA4 – Kraków Główny ↔ Miechów'),
('SKA5', 'SKA5 – Kraków Główny ↔ Lotnisko Balice');

-- ================================================
-- stop
--  (kolejność wstawiania => stop_id)
--  1:2001, 6:2006, 7:2007, 17:3001, 26:3010
-- ================================================
INSERT INTO stop (stop_code, stop_name, latitude, longitude) VALUES
(2001, 'Kraków Lotnisko / Airport', 50.0777, 19.7856),   -- id=1
(2002, 'Kraków Olszanica', 50.0765, 19.9860),            -- id=2
(2003, 'Kraków Zakliki', 50.0735, 19.9800),              -- id=3
(2004, 'Kraków Młynówka', 50.0705, 19.9600),             -- id=4
(2005, 'Kraków Bronowice', 50.0810, 19.8922),            -- id=5
(2006, 'Kraków Łobzów', 50.0815, 19.9212),               -- id=6
(2007, 'Kraków Główny', 50.0665, 19.9469),               -- id=7
(2008, 'Kraków Grzegórzki', 50.0580, 19.9530),           -- id=8
(2009, 'Kraków Zabłocie', 50.0467, 19.9567),             -- id=9
(2010, 'Kraków Płaszów', 50.0370, 19.9808),              -- id=10
(2011, 'Kraków Prokocim', 50.0390, 19.9980),             -- id=11
(2012, 'Kraków Bieżanów', 50.0199, 20.0210),             -- id=12
(2013, 'Kraków Bieżanów Drożdżownia', 50.0185, 20.0200), -- id=13
(2014, 'Wieliczka Bogucice', 49.9910, 20.0590),          -- id=14
(2015, 'Wieliczka Park', 49.9895, 20.0580),              -- id=15
(2016, 'Wieliczka Rynek-Kopalnia', 49.9871, 20.0603),    -- id=16
(3001, 'Kraków Batowice', 50.0810, 20.0550),             -- id=17
(3002, 'Zastów', 50.1170, 20.1530),                      -- id=18
(3003, 'Baranówka', 50.1460, 20.2000),                   -- id=19
(3004, 'Łuczyce', 50.1920, 20.2610),                     -- id=20
(3005, 'Goszcza', 50.2280, 20.2130),                     -- id=21
(3006, 'Niedźwiedź', 50.2440, 20.1750),                  -- id=22
(3007, 'Słomniki Miasto', 50.2510, 20.1320),             -- id=23
(3008, 'Słomniki', 50.2540, 20.1250),                    -- id=24
(3009, 'Smroków', 50.2670, 20.1100),                     -- id=25
(3010, 'Miechów', 50.3560, 20.0190),                     -- id=26
(4001, 'Podłęże', 50.0060, 20.1290),                     -- id=27
(4002, 'Bochnia', 49.9680, 20.4300),                     -- id=28
(4003, 'Tarnów', 50.0130, 20.9860);                      -- id=29

-- ================================================
-- user (bez line_id)
-- ================================================
-- ================================================
-- user (tylko 'admin' lub 'user' jako role!)
-- ================================================
INSERT INTO "user" (first_name, last_name, password, role, email) VALUES
('Marta', 'Nowak', 'admin123', 'admin', 'martademianiuk7@gmail.com'),
('Paweł', 'Wiśniewski', 'pass123', 'user', 's27735@pjwstk.edu.pl'),
('Katarzyna', 'Szymańska', 'pass123', 'user', 's27471@pjwstk.edu.pl'),
('Tomasz', 'Król', 'pass123', 'user', 's27478@pjwstk.edu.pl'),
('Agnieszka', 'Mazur', 'pass123', 'user', 'martademianiuk7@gmail.com'),
('Michał', 'Kowalczyk', 'pass123', 'user', 's27735@pjwstk.edu.pl'),
('Dominika', 'Duda', 'pass123', 'user', 's27471@pjwstk.edu.pl'),
('Jan', 'Nowicki', 'pass123', 'user', 's27478@pjwstk.edu.pl'),
('Ewelina', 'Krawczyk', 'pass123', 'user', 'martademianiuk7@gmail.com'),
('Piotr', 'Baran', 'pass123', 'user', 's27471@pjwstk.edu.pl');

-- ================================================
-- user_line (relacja wiele-do-wielu)
--  dopasowane do SKA4 i SKA5, żeby ktoś „śledził” te linie
-- ================================================
INSERT INTO user_line (user_id, line_id) VALUES
(8, 5),  -- Jan → SKA5
(9, 4),  -- Ewelina → SKA4
(1, 1),
(2, 2),
(3, 3),
(4, 1),
(5, 1),
(6, 3),
(7, 2),
(10, 5);

-- ================================================
-- as_history (dowolne, spójne z user_id)
-- ================================================
INSERT INTO as_history (as_user, user_id) VALUES
(10, 1), (25, 1),
(40, 2),
(5, 3), (15, 3),
(0, 4), (30, 4),
(8, 5), (12, 5),
(7, 6),
(18, 7),
(22, 8), (35, 8),
(5, 9), (27, 9),
(13, 10), (31, 10);

-- ================================================
-- departure
--  Minimalny i spójny zestaw pod trasę z przesiadką:
--  SKA5: 2001 -> 2006 -> 2007
--  SKA4: 2007 -> 3001 -> 3010
--  (Uwaga: stop_id to kolejność z tabeli stop)
-- ================================================
INSERT INTO departure
(line_id, stop_id, planned_arrival_time, planned_departure_time, actual_arrival_time, actual_departure_time) VALUES
-- SKA5 (line_id=5): Lotnisko (id=1) -> Łobzów (id=6) -> Kraków Główny (id=7)
(5, 1,  '2025-10-04 10:00:00', '2025-10-04 10:02:00', '2025-10-04 10:01:00', '2025-10-04 10:03:00'),
(5, 6,  '2025-10-04 10:15:00', '2025-10-04 10:17:00', '2025-10-04 10:16:00', '2025-10-04 10:18:00'),
(5, 7,  '2025-10-04 10:25:00', '2025-10-04 10:27:00', '2025-10-04 10:26:00', '2025-10-04 10:28:00'),

-- SKA4 (line_id=4): Kraków Główny (id=7) -> Batowice (id=17) -> Miechów (id=26)
(4, 7,  '2025-10-04 10:40:00', '2025-10-04 10:42:00', '2025-10-04 10:41:00', '2025-10-04 10:43:00'),
(4, 17, '2025-10-04 11:05:00', '2025-10-04 11:07:00', '2025-10-04 11:06:00', '2025-10-04 11:08:00'),
(4, 26, '2025-10-04 11:35:00', '2025-10-04 11:37:00', '2025-10-04 11:36:00', '2025-10-04 11:38:00');

-- ================================================
-- form
--  Spójne z departure_id (1..6), line_id i stop_id
-- ================================================
INSERT INTO form (
  user_id, departure_id, report_time, as_form, confirmed_by_admin, like_total, dislike_total,
  stop_id, category, line_id, delay, is_email_sent
) VALUES
-- zgłoszenie na SKA5, Lotnisko (stop_id=1), departure_id=1, line_id=5
(8, 1, '2025-10-05 10:05:00', 15, 1, 5, 0, 1, 'VEHICLE_FAILURE', 5, 4, 0),
-- zgłoszenie na SKA4, Kraków Główny (stop_id=7), departure_id=4, line_id=4
(9, 4, '2025-10-05 10:45:00', 22, 1, 7, 1, 7, 'VEHICLE_FAILURE', 4, 2, 0),

-- Dodatkowe zgłoszenia dla SKA5 (user_id=8 i 10 mają przypisaną linię 5)
(10, 2, '2025-10-05 10:20:00', 8, 0, 12, 2, 6, 'ACCIDENT', 5, 8, 0),
(8, 3, '2025-10-05 10:30:00', 18, 1, 15, 1, 7, 'ACCIDENT', 5, 6, 0),

-- Dodatkowe zgłoszenia dla SKA4 (user_id=9 ma przypisaną linię 4)
(9, 5, '2025-10-05 11:10:00', 12, 0, 8, 3, 17, 'ROADWORKS', 4, 5, 0),
(9, 6, '2025-10-05 11:40:00', 25, 1, 20, 0, 26, 'ROADWORKS', 4, 12, 0),

-- Zgłoszenia dla SKA1 (user_id=1, 4, 5 mają przypisaną linię 1)
(9, 1, '2025-10-05 09:15:00', 30, 1, 25, 2, 1, 'OTHER', 1, 10, 1),
(9, 2, '2025-10-05 09:30:00', 5, 0, 6, 8, 6, 'OTHER', 1, 3, 0),
(9, 3, '2025-10-05 09:45:00', 14, 0, 11, 4, 7, 'OTHER', 1, 2, 0),

-- Zgłoszenia dla SKA2 (user_id=2, 7 mają przypisaną linię 2)
(2, 4, '2025-10-05 08:20:00', 19, 1, 18, 1, 7, 'VEHICLE_FAILURE', 2, 7, 0),
(7, 5, '2025-10-05 08:45:00', 9, 0, 5, 6, 17, 'VEHICLE_FAILURE', 2, 4, 0),

-- Zgłoszenia dla SKA3 (user_id=3, 6 mają przypisaną linię 3)
(3, 6, '2025-10-05 12:15:00', 16, 0, 13, 3, 26, 'ACCIDENT', 3, 9, 0),
(6, 1, '2025-10-05 12:30:00', 7, 0, 4, 5, 1, 'ACCIDENT', 3, 2, 0),

-- Dodatkowe zgłoszenia od admina (user_id=1)
(1, 2, '2025-10-05 13:00:00', 21, 1, 30, 0, 6, 'ROADWORKS', 5, 1, 1),
(1, 4, '2025-10-05 13:15:00', 28, 1, 35, 1, 7, 'ROADWORKS', 4, 0, 1);