# Acquisitions API

A secure, modern Node.js backend for user authentication, rate limiting, and bot protection using Arcjet, Drizzle ORM, Neon, and Express 5.

## Features

- User authentication (JWT, bcrypt)
- Rate limiting and bot detection (Arcjet)
- Secure headers (Helmet)
- Logging (Winston, Morgan)
- RESTful API endpoints
- Dockerized for dev/prod
- CI/CD with GitHub Actions
- Test coverage with Jest & Supertest

## Dependencies

- express
- drizzle-orm
- @neondatabase/serverless
- @arcjet/node
- helmet
- cors
- cookie-parser
- winston
- morgan
- jsonwebtoken
- bcrypt
- zod
- dotenv

### Dev Dependencies

- jest
- supertest
- drizzle-kit
- eslint
- prettier

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/Sainava/Acquisitions.git
cd Acquisitions
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env` and fill in your secrets:

```
PORT=3000
NODE_ENV=development
DATABASE_URL=...
ARCJET_KEY=...
```

### 3. Run Locally

```bash
npm run dev
```

### 4. Run Tests

```bash
npm test
```

### 5. Docker

- Development: `docker-compose -f docker-compose.dev.yml up`
- Production: `docker-compose -f docker-compose.prod.yml up`

## API Endpoints

- `GET /health` — Health check
- `GET /api` — API status
- `POST /api/auth/sign-up` — Register
- `POST /api/auth/sign-in` — Login
- `POST /api/auth/sign-out` — Logout
- `GET /api/users` — List users

## Security

- Arcjet middleware protects all endpoints in dev/prod (rate limiting, bot detection, shields)
- In test mode (`NODE_ENV=test`), Arcjet is bypassed for reliable test runs

## CI/CD

- Lint, format, test, and Docker build/push workflows via GitHub Actions
