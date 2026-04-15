UPDATE users SET password = '$2a$10$slYQmyNdGzin0WbWvvNFhOVxMT0plHmGQKwVuYeYWFVlCU9LDxh4i' WHERE email = 'test@example.com';
UPDATE users SET password = '$2a$10$slYQmyNdGzin0WbWvvNFhOVxMT0plHmGQKwVuYeYWFVlCU9LDxh4i' WHERE email = 'admin@example.com';
SELECT email, password FROM users;
