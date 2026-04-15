UPDATE movie_theatre_booking.users 
SET password = '$2a$10$slYQmyNdGzin0WbWvvNFhOVxMT0plHmGQKwVuYeYWFVlCU9LDxh4i' 
WHERE email IN ('test@example.com', 'admin@example.com');

SELECT email, password FROM movie_theatre_booking.users WHERE email IN ('test@example.com', 'admin@example.com');
