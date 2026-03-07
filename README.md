# Habit Tracker (PERN MVP)

A simple full-stack PERN habit tracker project.

## Mockup

![habit-tracker-mockup](image.png)

## Live Demo

- Frontend: https://jamies-habit-tracker.onrender.com
- Backend API: https://habit-tracker-oucn.onrender.com/api
- Health Check: https://habit-tracker-oucn.onrender.com/api/health

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: PostgreSQL
- Security: Helmet, CORS, environment variables
- Testing: Jest + Supertest (backend), Vitest + Testing Library (frontend)
- Deployment: Render

## Current MVP Scope

### Built

- React frontend connected to Express API
- PostgreSQL persistence with `habits` and `habit_logs`
- Register/login authentication with JWT
- Multi-user habit ownership and route protection
- Create habit, list habits, mark complete for today
- Unmark today's completion
- Edit habit name/description
- Delete habits
- Duplicate completion protection per day
- Streak endpoint with show/hide toggle in UI
- Responsive card-based UI with improved visual design
- Basic security: `helmet`, CORS origin restriction, env vars
- Minimal tests: backend health route + frontend render test

### Not Yet Built

- Full test coverage and CI pipeline
- Per-habit completion history view

## Local Setup

### Prerequisites

- Node.js 18+
- PostgreSQL

### Backend

```bash
cd server
npm install
npm run dev
```

Create `server/.env`:

```env
PORT=4000
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/habit_tracker
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
JWT_SECRET=<long-random-secret>
```

If your local database was created before auth and user ownership, run:

```bash
psql -U postgres -d habit_tracker -f ./server/src/db/migrations/001_add_user_id_to_habits.sql
```

### Frontend

```bash
cd client
npm install
npm run dev
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:4000/api
```

## Tests

### Backend

```bash
cd server
npm test
```

### Frontend

```bash
cd client
npm test -- --run
```

## API Endpoints

### Public

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/health`
- `GET /api/health/db`

### Protected (require `Authorization: Bearer <token>`)

- `GET /api/habits`
- `POST /api/habits`
- `PUT /api/habits/:id`
- `DELETE /api/habits/:id`
- `POST /api/habits/:id/complete`
- `DELETE /api/habits/:id/complete`
- `GET /api/habits/:id/streak`

## Notes

- This is currently an auth-enabled MVP with user-scoped habits.
- Main next step is deeper test coverage and completion history views.
