# Movie Theatre Booking

Full-stack movie theatre booking application built with Spring Boot (backend), MySQL (database), and React + Vite (frontend).

## Project Structure

- `src/main/java/com/example/OOAD/`
  - `controller/` REST controllers
  - `service/` business logic
  - `repository/` JPA repositories
  - `model/` entities and enums
  - `dto/` request/response DTOs
  - `strategy/` seat allocation strategy
  - `factory/` seat factory
  - `exception/` global exception handling
  - `config/` application configuration (including CORS)
- `src/main/resources/`
  - `application.properties` datasource and JPA config
- `db/`
  - `schema_and_seed.sql` schema-first SQL + seed data
- `frontend/`
  - `src/` React source code
  - `public/thumbnails/` movie poster assets used by UI
  - `package.json` frontend scripts and dependencies

## Prerequisites

- Java 17+ (project currently runs with newer Java too)
- Maven Wrapper (`mvnw`/`mvnw.cmd` already included)
- MySQL 8+
- Node.js 18+

## Database Setup

1. Ensure MySQL is running.
2. Run:

```bash
mysql -u root -p -e "source db/schema_and_seed.sql"
```

This creates all required tables first, then inserts valid sample data.

## Run Backend

```bash
./mvnw spring-boot:run
```

Windows PowerShell:

```powershell
.\mvnw.cmd spring-boot:run
```

Backend URL: `http://localhost:8080`

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173` (or next available port).

## API Endpoints (Core)

- `GET /movies`
- `GET /theatres`
- `GET /seats/{showId}`
- `POST /auth/login` - Login with email and password, returns JWT token
- `POST /auth/register` - Register new user account
- `POST /booking/create`
- `POST /booking/cancel/{bookingId}`

## Authentication & Login System

The application includes a complete authentication system with JWT tokens and password hashing using BCrypt.

### Test Credentials

After running the database setup, use these test accounts:

**Customer Account:**
- Email: `test@example.com`
- Password: `password`

**Admin Account:**
- Email: `admin@example.com`
- Password: `password`

### Features

- **User Registration**: Sign up with email and password (minimum 6 characters)
- **Secure Login**: Password hashing with BCrypt
- **JWT Tokens**: Session management with JWT tokens (24-hour expiration)
- **User State**: Persisted user session in localStorage
- **Protected Routes**: Payment and confirmation pages require login
- **Error Handling**: Comprehensive error messages for failed authentication

### How to Register

1. Click "Register" link on the login page or navigate to `/register`
2. Fill in your details (name, email, password)
3. Confirm your password
4. Click "Register"
5. You'll be redirected to login page after successful registration

### How to Login

1. Navigate to `/login` or click "Login" in the navbar
2. Enter your email and password
3. Click "Login"
4. On success, you'll be redirected to the home page with user info displayed in navbar

## Notes for GitHub Push

The repository is prepared to push only valid project files:

- Java source and resources
- frontend source and public assets
- database script
- Maven/Node manifests

Generated artifacts (`target/`, `node_modules/`, `dist/`) are excluded by `.gitignore`.
