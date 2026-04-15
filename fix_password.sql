UPDATE users SET password = '\$2a\$10\$ui95ze8SiACBxIK90wPqk.bUEmGC6cMlPDNvfkE6bQNoD3.6aiDI2' WHERE email = 'test@example.com';
UPDATE users SET password = '\$2a\$10\$ui95ze8SiACBxIK90wPqk.bUEmGC6cMlPDNvfkE6bQNoD3.6aiDI2' WHERE email = 'admin@example.com';
SELECT email, password FROM users;
