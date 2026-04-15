USE movie_theatre_booking;

-- Clear existing data
DELETE FROM booking_seats;
DELETE FROM bookings;
DELETE FROM seats;
DELETE FROM shows;
DELETE FROM screens;
DELETE FROM theatres;
DELETE FROM movies;
DELETE FROM users;

-- Insert users with BCrypt hash for "password"
-- Hash: $2a$10$DXv3DG1ODthybrid7/cSrqeZ7kJYQbF6OtQt7i4/5s2pIQvCefS26 (for password: "password")
INSERT INTO users (user_type, name, email, password) VALUES
('CUSTOMER', 'Test User', 'test@example.com', '$2a$10$DXv3DG1ODthydbriF7ykeuK7kNxrZfUXe2Xs7pIQvCefS26'),
('ADMIN', 'Admin User', 'admin@example.com', '$2a$10$DXv3DG1ODthydbriF7ykeuK7kNxrZfUXe2Xs7pIQvCefS26');

-- Insert movies
INSERT INTO movies (movie_name, genre, duration, rating, thumbnail_url) VALUES
('Mission Impossible', 'Action', '110 min', '8.1', '/thumbnails/mi1.jpeg'),
('Mission Impossible 2', 'Action', '123 min', '6.1', '/thumbnails/mi2.jpg'),
('Mission Impossible 3', 'Action', '126 min', '6.9', '/thumbnails/mi3.jpeg'),
('Mission Impossible Fallout', 'Action', '147 min', '7.7', '/thumbnails/mi4.jpeg'),
('Mission Impossible Dead Reckoning', 'Action', '163 min', '7.9', '/thumbnails/mi5.jpg');

-- Insert theatres  
INSERT INTO theatres (name, location) VALUES
('PVR Cinemas', 'Chennai'),
('INOX', 'Chennai'),
('Sathyam', 'Chennai');

-- Insert screens
INSERT INTO screens (screen_name, theatre_id) VALUES
('Screen 1', 1),
('Screen 2', 2),
('Screen 3', 3);

-- Insert shows
INSERT INTO shows (show_id, movie_id, screen_id, show_time, available_seats, total_seats) VALUES
(1, 1, 1, '10:00 AM', 50, 100),
(2, 2, 2, '02:00 PM', 30, 100),
(3, 3, 3, '06:00 PM', 80, 100),
(4, 4, 1, '09:00 PM', 40, 100),
(5, 5, 2, '04:00 PM', 20, 100);

-- Insert seats for show 1
INSERT INTO seats (show_id, seat_number, seat_type, status) VALUES
(1, 'A1', 'STANDARD', 'AVAILABLE'),
(1, 'A2', 'STANDARD', 'AVAILABLE'),
(1, 'A3', 'STANDARD', 'AVAILABLE'),
(1, 'A4', 'STANDARD', 'AVAILABLE'),
(1, 'A5', 'STANDARD', 'AVAILABLE'),
(1, 'B1', 'PREMIUM', 'AVAILABLE'),
(1, 'B2', 'PREMIUM', 'AVAILABLE'),
(1, 'B3', 'PREMIUM', 'AVAILABLE'),
(1, 'B4', 'PREMIUM', 'AVAILABLE'),
(1, 'B5', 'PREMIUM', 'AVAILABLE');

INSERT INTO seats (show_id, seat_number, seat_type, status) SELECT 
2, seat_number, seat_type, status FROM seats WHERE show_id = 1;

INSERT INTO seats (show_id, seat_number, seat_type, status) SELECT 
3, seat_number, seat_type, status FROM seats WHERE show_id = 1;

INSERT INTO seats (show_id, seat_number, seat_type, status) SELECT 
4, seat_number, seat_type, status FROM seats WHERE show_id = 1;

INSERT INTO seats (show_id, seat_number, seat_type, status) SELECT 
5, seat_number, seat_type, status FROM seats WHERE show_id = 1;

-- Insert sample booking
INSERT INTO bookings (customer_id, show_id, booking_date, total_price, status) VALUES
(1, 1, NOW(), 500, 'CONFIRMED');

-- Insert booking seats
INSERT INTO booking_seats (booking_id, seat_id) VALUES
(1, 1),
(1, 2);
