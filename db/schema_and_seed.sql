USE movie_theatre_booking;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS booking_seats;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS seats;
DROP TABLE IF EXISTS shows;
DROP TABLE IF EXISTS screens;
DROP TABLE IF EXISTS theatres;
DROP TABLE IF EXISTS movies;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
    user_id BIGINT NOT NULL AUTO_INCREMENT,
    user_type VARCHAR(31) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id),
    UNIQUE KEY UK_users_email (email),
    CONSTRAINT CHK_users_type CHECK (user_type IN ('ADMIN', 'CUSTOMER'))
) ENGINE=InnoDB;

CREATE TABLE movies (
    movie_id BIGINT NOT NULL AUTO_INCREMENT,
    movie_name VARCHAR(255) NOT NULL,
    genre VARCHAR(255) NOT NULL,
    duration VARCHAR(255) NOT NULL,
    rating VARCHAR(255) NOT NULL,
    thumbnail_url VARCHAR(255) NOT NULL,
    PRIMARY KEY (movie_id)
) ENGINE=InnoDB;

CREATE TABLE theatres (
    theatre_id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    PRIMARY KEY (theatre_id)
) ENGINE=InnoDB;

CREATE TABLE screens (
    screen_id BIGINT NOT NULL AUTO_INCREMENT,
    screen_name VARCHAR(255) NOT NULL,
    theatre_id BIGINT NOT NULL,
    PRIMARY KEY (screen_id),
    CONSTRAINT FK_screens_theatre FOREIGN KEY (theatre_id) REFERENCES theatres(theatre_id)
) ENGINE=InnoDB;

CREATE TABLE shows (
    show_id BIGINT NOT NULL AUTO_INCREMENT,
    movie_name VARCHAR(255) NOT NULL,
    show_time DATETIME(6) NOT NULL,
    screen_id BIGINT NOT NULL,
    PRIMARY KEY (show_id),
    CONSTRAINT FK_shows_screen FOREIGN KEY (screen_id) REFERENCES screens(screen_id)
) ENGINE=InnoDB;

CREATE TABLE seats (
    seat_id BIGINT NOT NULL AUTO_INCREMENT,
    seat_number VARCHAR(255) NOT NULL,
    status ENUM('AVAILABLE','LOCKED','BOOKED','CANCELLED','UNDER_MAINTENANCE') NOT NULL,
    type ENUM('REGULAR','PREMIUM','RECLINER') NOT NULL,
    screen_id BIGINT NOT NULL,
    PRIMARY KEY (seat_id),
    CONSTRAINT FK_seats_screen FOREIGN KEY (screen_id) REFERENCES screens(screen_id)
) ENGINE=InnoDB;

CREATE TABLE bookings (
    booking_id BIGINT NOT NULL AUTO_INCREMENT,
    booking_time DATETIME(6) NOT NULL,
    status ENUM('PENDING','CONFIRMED','FAILED','CANCELLED') NOT NULL,
    user_id BIGINT NOT NULL,
    show_id BIGINT NOT NULL,
    PRIMARY KEY (booking_id),
    CONSTRAINT FK_bookings_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT FK_bookings_show FOREIGN KEY (show_id) REFERENCES shows(show_id)
) ENGINE=InnoDB;

CREATE TABLE booking_seats (
    booking_id BIGINT NOT NULL,
    seat_id BIGINT NOT NULL,
    CONSTRAINT FK_booking_seats_booking FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
    CONSTRAINT FK_booking_seats_seat FOREIGN KEY (seat_id) REFERENCES seats(seat_id)
) ENGINE=InnoDB;

INSERT INTO users (user_type, name, email, password) VALUES
('CUSTOMER', 'Demo User', 'demo@cinebook.com', 'demo123'),
('ADMIN', 'System Admin', 'admin@cinebook.com', 'admin123');

INSERT INTO movies (movie_name, genre, duration, rating, thumbnail_url) VALUES
('Mission Impossible', 'Action', '110 min', '8.1', '/thumbnails/mi1.jpeg'),
('Mission Impossible 2', 'Action', '123 min', '6.1', '/thumbnails/mi2.jpg'),
('Mission Impossible 3', 'Action', '126 min', '6.9', '/thumbnails/mi3.jpeg'),
('Mission Impossible Fallout', 'Action', '147 min', '7.7', '/thumbnails/mi4.jpeg'),
('Mission Impossible Dead Reckoning', 'Action', '163 min', '7.9', '/thumbnails/mi5.jpg');

INSERT INTO theatres (name, location) VALUES
('PVR Cinemas', 'Chennai'),
('INOX', 'Chennai'),
('AGS Cinemas', 'Chennai');

INSERT INTO screens (screen_name, theatre_id) VALUES
('Screen 1', 1),
('Screen 1', 2),
('Screen 1', 3);

INSERT INTO shows (movie_name, show_time, screen_id) VALUES
('Mission Impossible', '2026-04-15 10:00:00', 1),
('Mission Impossible 2', '2026-04-15 14:00:00', 1),
('Mission Impossible 3', '2026-04-15 12:00:00', 2),
('Mission Impossible Fallout', '2026-04-15 18:00:00', 2),
('Mission Impossible Dead Reckoning', '2026-04-15 21:00:00', 3);

INSERT INTO seats (seat_number, status, type, screen_id)
WITH RECURSIVE row_idx AS (
    SELECT 0 AS n
    UNION ALL
    SELECT n + 1 FROM row_idx WHERE n < 9
), col_idx AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM col_idx WHERE n < 10
)
SELECT
    CONCAT(CHAR(65 + row_idx.n), col_idx.n) AS seat_number,
    CASE
        WHEN CONCAT(CHAR(65 + row_idx.n), col_idx.n) IN ('A1','A2','B5','C7','D3') THEN 'BOOKED'
        ELSE 'AVAILABLE'
    END AS status,
    CASE
        WHEN col_idx.n >= 8 THEN 'PREMIUM'
        ELSE 'REGULAR'
    END AS type,
    1 AS screen_id
FROM row_idx CROSS JOIN col_idx;

INSERT INTO seats (seat_number, status, type, screen_id)
WITH RECURSIVE row_idx AS (
    SELECT 0 AS n
    UNION ALL
    SELECT n + 1 FROM row_idx WHERE n < 9
), col_idx AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM col_idx WHERE n < 10
)
SELECT
    CONCAT(CHAR(65 + row_idx.n), col_idx.n) AS seat_number,
    CASE
        WHEN CONCAT(CHAR(65 + row_idx.n), col_idx.n) IN ('A4','B2','E8','F6','J10') THEN 'BOOKED'
        ELSE 'AVAILABLE'
    END AS status,
    CASE
        WHEN col_idx.n >= 8 THEN 'PREMIUM'
        ELSE 'REGULAR'
    END AS type,
    2 AS screen_id
FROM row_idx CROSS JOIN col_idx;

INSERT INTO seats (seat_number, status, type, screen_id)
WITH RECURSIVE row_idx AS (
    SELECT 0 AS n
    UNION ALL
    SELECT n + 1 FROM row_idx WHERE n < 9
), col_idx AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM col_idx WHERE n < 10
)
SELECT
    CONCAT(CHAR(65 + row_idx.n), col_idx.n) AS seat_number,
    CASE
        WHEN CONCAT(CHAR(65 + row_idx.n), col_idx.n) IN ('A3','C4','D9','G1','H8') THEN 'BOOKED'
        ELSE 'AVAILABLE'
    END AS status,
    CASE
        WHEN col_idx.n >= 8 THEN 'PREMIUM'
        ELSE 'REGULAR'
    END AS type,
    3 AS screen_id
FROM row_idx CROSS JOIN col_idx;

INSERT INTO bookings (booking_time, status, user_id, show_id) VALUES
('2026-04-15 09:45:00', 'CONFIRMED', 1, 1);

INSERT INTO booking_seats (booking_id, seat_id)
SELECT 1, seat_id FROM seats WHERE screen_id = 1 AND seat_number IN ('A1', 'A2');

SELECT 'users' AS table_name, COUNT(*) AS rows_count FROM users
UNION ALL SELECT 'movies', COUNT(*) FROM movies
UNION ALL SELECT 'theatres', COUNT(*) FROM theatres
UNION ALL SELECT 'screens', COUNT(*) FROM screens
UNION ALL SELECT 'shows', COUNT(*) FROM shows
UNION ALL SELECT 'seats', COUNT(*) FROM seats
UNION ALL SELECT 'bookings', COUNT(*) FROM bookings
UNION ALL SELECT 'booking_seats', COUNT(*) FROM booking_seats;
