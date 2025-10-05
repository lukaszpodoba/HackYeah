PRAGMA foreign_keys = ON;

-- clear in FK-safe order
DELETE FROM form;
DELETE FROM departure;
DELETE FROM as_history;
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
-- ================================================
INSERT INTO stop (stop_code, stop_name, latitude, longitude) VALUES
(2001, 'Kraków Lotnisko / Airport', 50.0777, 19.7856),
(2002, 'Kraków Olszanica', 50.0765, 19.9860),
(2003, 'Kraków Zakliki', 50.0735, 19.9800),
(2004, 'Kraków Młynówka', 50.0705, 19.9600),
(2005, 'Kraków Bronowice', 50.0810, 19.8922),
(2006, 'Kraków Łobzów', 50.0815, 19.9212),
(2007, 'Kraków Główny', 50.0665, 19.9469),
(2008, 'Kraków Grzegórzki', 50.0580, 19.9530),
(2009, 'Kraków Zabłocie', 50.0467, 19.9567),
(2010, 'Kraków Płaszów', 50.0370, 19.9808),
(2011, 'Kraków Prokocim', 50.0390, 19.9980),
(2012, 'Kraków Bieżanów', 50.0199, 20.0210),
(2013, 'Kraków Bieżanów Drożdżownia', 50.0185, 20.0200),
(2014, 'Wieliczka Bogucice', 49.9910, 20.0590),
(2015, 'Wieliczka Park', 49.9895, 20.0580),
(2016, 'Wieliczka Rynek-Kopalnia', 49.9871, 20.0603),
(3001, 'Kraków Batowice', 50.0810, 20.0550),
(3002, 'Zastów', 50.1170, 20.1530),
(3003, 'Baranówka', 50.1460, 20.2000),
(3004, 'Łuczyce', 50.1920, 20.2610),
(3005, 'Goszcza', 50.2280, 20.2130),
(3006, 'Niedźwiedź', 50.2440, 20.1750),
(3007, 'Słomniki Miasto', 50.2510, 20.1320),
(3008, 'Słomniki', 50.2540, 20.1250),
(3009, 'Smroków', 50.2670, 20.1100),
(3010, 'Miechów', 50.3560, 20.0190),
(4001, 'Podłęże', 50.0060, 20.1290),
(4002, 'Bochnia', 49.9680, 20.4300),
(4003, 'Tarnów', 50.0130, 20.9860);

-- ================================================
-- user
-- ================================================
INSERT INTO "user" (first_name, last_name, password, role, line_id) VALUES
('Marta', 'Nowak', 'admin123', 'admin', 1),
('Paweł', 'Wiśniewski', 'pass123', 'maszynista', 2),
('Katarzyna', 'Szymańska', 'pass123', 'dyżurny ruchu', 3),
('Tomasz', 'Król', 'pass123', 'uzytkownik', 1),
('Agnieszka', 'Mazur', 'pass123', 'uzytkownik', 1),
('Michał', 'Kowalczyk', 'pass123', 'uzytkownik', 3),
('Dominika', 'Duda', 'pass123', 'moderator', 2),
('Jan', 'Nowicki', 'pass123', 'uzytkownik', 5),
('Ewelina', 'Krawczyk', 'pass123', 'uzytkownik', 4),
('Piotr', 'Baran', 'pass123', 'uzytkownik', 5);

-- ================================================
-- as_history
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
-- ================================================
INSERT INTO departure (line_id, stop_id, planned_arrival_time, planned_departure_time, actual_arrival_time, actual_departure_time) VALUES
(1, 1, '2025-10-04 06:00:00', '2025-10-04 06:05:00', '2025-10-04 06:02:00', '2025-10-04 06:06:00'),
(1, 9, '2025-10-04 06:25:00', '2025-10-04 06:27:00', '2025-10-04 06:30:00', '2025-10-04 06:32:00'),
(2, 1, '2025-10-04 07:15:00', '2025-10-04 07:18:00', '2025-10-04 07:17:00', '2025-10-04 07:20:00'),
(2, 5, '2025-10-04 07:25:00', '2025-10-04 07:30:00', '2025-10-04 07:27:00', '2025-10-04 07:32:00'),
(3, 1, '2025-10-04 08:00:00', '2025-10-04 08:05:00', '2025-10-04 08:02:00', '2025-10-04 08:08:00'),
(3, 4, '2025-10-04 08:20:00', '2025-10-04 08:25:00', '2025-10-04 08:23:00', '2025-10-04 08:28:00'),
(4, 1, '2025-10-04 09:00:00', '2025-10-04 09:03:00', '2025-10-04 09:01:00', '2025-10-04 09:05:00'),
(4, 2, '2025-10-04 09:10:00', '2025-10-04 09:12:00', '2025-10-04 09:13:00', '2025-10-04 09:14:00'),
(5, 1, '2025-10-04 10:00:00', '2025-10-04 10:03:00', '2025-10-04 10:01:00', '2025-10-04 10:05:00'),
(5, 10, '2025-10-04 10:25:00', '2025-10-04 10:30:00', '2025-10-04 10:28:00', '2025-10-04 10:33:00');

-- ================================================
-- form
-- ================================================
INSERT INTO form (
user_id, departure_id, report_time, as_form, confirmed_by_admin, like_total, dislike_total,
stop_id, category, line_id, delay
) VALUES
(1, 1, '2025-10-04 06:40:00', 12, 1, 130, 5, 10, 'Opóźnienie pociągu', 1, 8),
(2, 2, '2025-10-04 07:25:00', 7, 0, 75, 10, 9, 'Awaria sygnalizacji', 2, 15),
(3, 3, '2025-10-04 08:10:00', 22, 1, 98, 4, 7, 'Utrudnienia techniczne', 3, 5),
(4, 4, '2025-10-04 09:10:00', 9, 0, 34, 3, 6, 'Zmiana toru odjazdu', 4, 3),
(5, 5, '2025-10-04 10:20:00', 18, 1, 210, 2, 7, 'Opóźnienie przez mgłę', 5, 12);