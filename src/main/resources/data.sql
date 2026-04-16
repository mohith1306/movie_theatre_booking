INSERT INTO movies (movie_id, movie_name, genre, duration, rating, thumbnail_url) VALUES
(1, 'Mission Impossible', 'Action', '110 min', '8.1', '/thumbnails/mi1.jpeg'),
(2, 'Mission Impossible 2', 'Action', '123 min', '6.1', '/thumbnails/mi2.jpg'),
(3, 'Mission Impossible 3', 'Action', '126 min', '6.9', '/thumbnails/mi3.jpeg'),
(4, 'Mission Impossible Fallout', 'Action', '147 min', '7.7', '/thumbnails/mi4.jpeg'),
(5, 'Mission Impossible Dead Reckoning', 'Action', '163 min', '7.9', '/thumbnails/mi5.jpg');

INSERT INTO theatres (theatre_id, name, location) VALUES
(1, 'PVR Cinemas', 'Chennai'),
(2, 'INOX', 'Chennai'),
(3, 'Sathyam', 'Chennai');

INSERT INTO screens (screen_id, screen_name, theatre_id) VALUES
(1, 'Screen 1', 1),
(2, 'Screen 2', 2),
(3, 'Screen 3', 3);

INSERT INTO shows (show_id, movie_name, show_time, screen_id) VALUES
(1, 'Mission Impossible', TIMESTAMP '2026-04-17 10:00:00', 1),
(2, 'Mission Impossible 2', TIMESTAMP '2026-04-17 14:00:00', 2),
(3, 'Mission Impossible 3', TIMESTAMP '2026-04-17 18:00:00', 3),
(4, 'Mission Impossible Fallout', TIMESTAMP '2026-04-17 20:30:00', 1),
(5, 'Mission Impossible Dead Reckoning', TIMESTAMP '2026-04-17 16:00:00', 2);

INSERT INTO seats (seat_id, seat_number, type, status, screen_id) VALUES
(1, 'A1', 'REGULAR', 'AVAILABLE', 1),
(2, 'A2', 'REGULAR', 'AVAILABLE', 1),
(3, 'A3', 'REGULAR', 'AVAILABLE', 1),
(4, 'A4', 'REGULAR', 'AVAILABLE', 1),
(5, 'A5', 'REGULAR', 'AVAILABLE', 1),
(6, 'B1', 'PREMIUM', 'AVAILABLE', 1),
(7, 'B2', 'PREMIUM', 'AVAILABLE', 1),
(8, 'B3', 'PREMIUM', 'AVAILABLE', 1),
(9, 'B4', 'PREMIUM', 'AVAILABLE', 1),
(10, 'B5', 'PREMIUM', 'AVAILABLE', 1),
(11, 'A1', 'REGULAR', 'AVAILABLE', 2),
(12, 'A2', 'REGULAR', 'AVAILABLE', 2),
(13, 'A3', 'REGULAR', 'AVAILABLE', 2),
(14, 'A4', 'REGULAR', 'AVAILABLE', 2),
(15, 'A5', 'REGULAR', 'AVAILABLE', 2),
(16, 'B1', 'PREMIUM', 'AVAILABLE', 2),
(17, 'B2', 'PREMIUM', 'AVAILABLE', 2),
(18, 'B3', 'PREMIUM', 'AVAILABLE', 2),
(19, 'B4', 'PREMIUM', 'AVAILABLE', 2),
(20, 'B5', 'PREMIUM', 'AVAILABLE', 2),
(21, 'A1', 'REGULAR', 'AVAILABLE', 3),
(22, 'A2', 'REGULAR', 'AVAILABLE', 3),
(23, 'A3', 'REGULAR', 'AVAILABLE', 3),
(24, 'A4', 'REGULAR', 'AVAILABLE', 3),
(25, 'A5', 'REGULAR', 'AVAILABLE', 3),
(26, 'B1', 'PREMIUM', 'AVAILABLE', 3),
(27, 'B2', 'PREMIUM', 'AVAILABLE', 3),
(28, 'B3', 'PREMIUM', 'AVAILABLE', 3),
(29, 'B4', 'PREMIUM', 'AVAILABLE', 3),
(30, 'B5', 'PREMIUM', 'AVAILABLE', 3);

-- Ensure a full A1-J10 layout exists for each seeded screen.
-- Existing rows are preserved; only missing seats are inserted.
INSERT INTO seats (seat_number, type, status, screen_id)
SELECT CONCAT(rows.row_letter, cols.col_no) AS seat_number,
			 CASE WHEN rows.row_letter = 'B' THEN 'PREMIUM' ELSE 'REGULAR' END AS type,
			 'AVAILABLE' AS status,
			 screens.screen_id
FROM (VALUES ('A'), ('B'), ('C'), ('D'), ('E'), ('F'), ('G'), ('H'), ('I'), ('J')) AS rows(row_letter)
CROSS JOIN (VALUES (1), (2), (3), (4), (5), (6), (7), (8), (9), (10)) AS cols(col_no)
CROSS JOIN (VALUES (1), (2), (3)) AS screens(screen_id)
WHERE NOT EXISTS (
		SELECT 1
		FROM seats s
		WHERE s.screen_id = screens.screen_id
			AND s.seat_number = CONCAT(rows.row_letter, cols.col_no)
);

INSERT INTO users (user_type, user_id, name, email, password) VALUES
('CUSTOMER', 1, 'Test User', 'test@example.com', '$2a$10$ui95ze8SiACBxIK90wPqk.bUEmGC6cMlPDNvfkE6bQNoD3.6aiDI2'),
('ADMIN', 2, 'Admin User', 'admin@example.com', '$2a$10$ui95ze8SiACBxIK90wPqk.bUEmGC6cMlPDNvfkE6bQNoD3.6aiDI2');