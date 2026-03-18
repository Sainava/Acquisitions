# 🔐 Acquisitions API

A **production-ready**, secure Node.js/Express REST API for user authentication, role-based access control, and advanced bot protection. Built with modern DevOps practices: containerized workflows, automated CI/CD pipelines, comprehensive test coverage, and serverless database integration.

**Perfect for**: SaaS platforms, admin dashboards, microservices that need bulletproof auth + security.

---

## ✨ Core Features

### 🔑 **Authentication & Authorization**
- **JWT-based auth** with secure HTTP-only cookies (15-min expiry, SameSite=Strict)
- **Password hashing** via bcrypt (10 rounds)
- **Role-based access control (RBAC)**: Admin, User, Guest
- **Token verification & expiration** handling on protected routes

### 🛡️ **Advanced Security**
- **Arcjet integration**: Multi-layer threat detection
  - Bot detection (blocks non-whitelisted bots; allows Google/Bing crawlers)
  - DDoS shield (SQL injection, XSS, common attack patterns)
  - Sliding-window rate limiting (role-based: 5 req/min for guests, 10 for users, 20 for admins)
- **Helmet.js**: Secure HTTP headers (CSP, HSTS, X-Frame-Options, etc.)
- **CORS**: Strict origin validation
- **Input validation**: Zod schemas on all endpoints (email, password strength, ID validation)

### 📊 **Observability & Logging**
- **Winston**: Structured JSON logging to disk + console
  - Error logs: `logs/error.log`
  - Combined logs: `logs/combined.log`
- **Morgan**: HTTP request/response logging stream → Winston
- **Health check endpoint**: Uptime, status, timestamp

### 🚀 **Modern Stack**
- **Express 5**: Latest features with async/await middleware
- **Drizzle ORM**: Type-safe, edge-friendly database queries
- **Neon PostgreSQL**: Serverless, branch-based development, auto-scaling
- **Node 22**: Native ESM, latest performance improvements

### 📦 **Containerized & Cloud-Ready**
- **Multi-stage Dockerfile**: Optimized prod & dev images (Alpine Linux)
- **Docker Compose**: Dev with Neon Local, Prod with Neon Cloud
- **Docker Hub**: Automated pushes for `main` branch (multi-platform: amd64, arm64)
- **Hot-reload dev environment**: File watching with `--watch` flag

### ✅ **Testing & Quality**
- **Jest** with ESM support (`NODE_OPTIONS='--experimental-vm-modules'`)
- **Supertest**: HTTP assertion library for endpoint testing
- **Coverage reports**: LCOV HTML reports; tracked across runs
- **ESLint + Prettier**: Auto-formatting and linting on every PR

### 🔄 **Automated CI/CD Pipelines**
See [CI/CD Workflows](#ci-cd-workflows) below.

---

## 🛠️ Tech Stack

### Core Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^5.1.0 | HTTP framework |
| `@neondatabase/serverless` | ^1.0.2 | Neon DB client |
| `drizzle-orm` | ^0.44.6 | Type-safe ORM |
| `@arcjet/node` | ^1.0.0-beta.13 | Bot/rate-limit protection |
| `helmet` | ^8.1.0 | HTTP header security |
| `bcrypt` | ^6.0.0 | Password hashing |
| `jsonwebtoken` | ^9.0.2 | JWT signing/verification |
| `zod` | ^4.1.12 | Input schema validation |
| `winston` | ^3.18.3 | Structured logging |
| `morgan` | ^1.10.1 | HTTP request logging |
| `cookie-parser` | ^1.4.7 | Cookie middleware |
| `cors` | ^2.8.5 | CORS middleware |
| `dotenv` | ^17.2.3 | Environment variables |

### Dev Dependencies
- `jest`, `supertest` — Testing framework & HTTP assertions
- `drizzle-kit` — DB migrations & schema generation
- `eslint`, `prettier` — Code quality & formatting

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ (or 22 recommended)
- npm or yarn
- Docker & Docker Compose (for containerized runs)
- PostgreSQL or Neon account (for database)

### 1️⃣ Clone & Install

```bash
git clone https://github.com/Sainava/Acquisitions.git
cd Acquisitions
npm install
```

### 2️⃣ Environment Setup

Create `.env` (or `.env.development`/`.env.production`):

```bash
# Core
PORT=3000
NODE_ENV=development

# Database (Neon Cloud or local Postgres)
DATABASE_URL=postgres://username:password@host:5432/database?sslmode=require

# Security
JWT_SECRET=your-super-secret-key-change-in-production

# Arcjet Bot Protection
ARCJET_KEY=your-arcjet-site-key

# Optional: Neon Local Development
NEON_LOCAL=false
NEON_API_KEY=your-neon-api-key
NEON_PROJECT_ID=your-neon-project-id
```

### 3️⃣ Run Locally (Development Mode)

```bash
# Start dev server with auto-reload
npm run dev

# ✅ Server runs on http://localhost:3000
```

### 4️⃣ Run Tests

```bash
# Run Jest suite + coverage report
npm test

# ✅ Coverage HTML: open coverage/lcov-report/index.html
```

### 5️⃣ Code Quality

```bash
# Lint check
npm run lint

# Auto-fix ESLint & Prettier
npm run lint:fix
npm run format
```

---

## 🐳 Docker Setup

### Development: Local Database with Neon Local

**Benefits**: Ephemeral branches, zero cloud cost, offline-friendly

```bash
npm run dev:docker
```

This runs [scripts/dev.sh](scripts/dev.sh), which:
1. Spins up Neon Local proxy (port 5432)
2. Starts app container with hot-reload
3. Runs schema migrations automatically
4. Streams logs to foreground

**Access**:
- API: http://localhost:3000
- Database: `postgres://neon:npg@localhost:5432/appdb`

**Stop**: `Ctrl+C` or `docker compose -f docker-compose.dev.yml down`

### Production: Neon Cloud Database

**Benefits**: Scalable, secure, managed backups, CI/CD ready

```bash
npm run prod:docker
```

This runs [scripts/prod.sh](scripts/prod.sh), which:
1. Builds optimized production image (no dev deps)
2. Connects to Neon Cloud via `DATABASE_URL`
3. Runs migrations inside container
4. Exposes single container on port 3000

**Customize**: Edit [docker-compose.prod.yml](docker-compose.prod.yml) or pass env vars:

```bash
docker compose -f docker-compose.prod.yml up \
  -e DATABASE_URL="postgres://..." \
  -e JWT_SECRET="..." \
  -e ARCJET_KEY="..."
```

**Deploy to**: AWS ECS, Google Cloud Run, Azure Container Instances, Render, Heroku, Railway, etc.

---

## 📡 API Endpoints

### Health & Status

```http
GET /health
```
Returns: `{ status: "OK", timestamp: "...", uptime: 42.3 }`

```http
GET /api
```
Returns: `{ message: "Acquisitions API is running" }`

### Authentication

#### Sign Up
```http
POST /api/auth/sign-up
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "user"
}
```

**Response (201)**: 
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Set-Cookie**: `token=<jwt>; HttpOnly; Secure; SameSite=Strict; Max-Age=900`

#### Sign In
```http
POST /api/auth/sign-in
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200)**: Same as sign-up + cookie set

#### Sign Out
```http
POST /api/auth/sign-out
Cookie: token=<jwt>
```

**Response (200)**: `{ message: "Sign-out successful" }` + cookie cleared

### User Management (Protected Routes)

**All require**: Valid JWT cookie + `"Authorization: Bearer <token>"` header (or cookie)

#### Get All Users
```http
GET /api/users
Cookie: token=<jwt>
```

**Auth**: Admin only

**Response (200)**:
```json
{
  "message": "Successfully retrieved users",
  "users": [...],
  "count": 5
}
```

#### Get User by ID
```http
GET /api/users/1
Cookie: token=<jwt>
```

**Auth**: Any authenticated user

**Response (200)**: User object with id, name, email, role, createdAt, updatedAt

#### Update User
```http
PUT /api/users/1
Cookie: token=<jwt>
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Auth**: Users can update own profile; admins can update any

**Response (200)**: Updated user object

#### Delete User
```http
DELETE /api/users/2
Cookie: token=<jwt>
```

**Auth**: Admin only (cannot delete own account)

**Response (200)**: Deleted user object

---

## 🔐 Security Details

### Password Storage
- Hashed with **bcrypt** (10 rounds, ~100ms per hash)
- Never stored in plaintext
- Compared securely on sign-in

### JWT Tokens
- **Payload**: `{ id, email, role }`
- **Expiry**: 1 day
- **Secret**: Loaded from `JWT_SECRET` env var
- **Storage**: Secure HTTP-only cookie (can't be accessed by JavaScript)

### Rate Limiting (Arcjet)
| Role | Limit | Window |
|------|-------|--------|
| Guest | 5 req | 1 min |
| User | 10 req | 1 min |
| Admin | 20 req | 1 min |

### Bot Detection (Arcjet)
- ✅ **Whitelisted**: Google, Bing, other search engines
- ❌ **Blocked**: Unknown bots
- 🛡️ **Shield**: Protects against SQL injection, XSS, CSRF

### CORS
- Strict origin validation
- Credentials allowed (cookies)
- Safe methods: GET, HEAD, OPTIONS

---

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Test File Location
- [tests/app.test.js](tests/app.test.js): Endpoint tests (health, API status, 404)

### Coverage
```bash
npm test
# ✅ Generates: coverage/lcov-report/index.html
# Open in browser to view line/branch/function coverage
```

### Test Environment
- `NODE_ENV=test` (Arcjet bypassed for deterministic tests)
- `DATABASE_URL=postgres://testuser:testpass@localhost/testdb` (in-memory or docker-based)

### Add More Tests
```javascript
describe('POST /api/auth/sign-up', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/sign-up')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'TestPass123'
      })
      .expect(201);

    expect(response.body.user.email).toBe('test@example.com');
    expect(response.headers['set-cookie']).toBeDefined(); // JWT cookie
  });
});
```

---

## 🗄️ Database & Migrations

### Schema
Single table: `users`
| Column | Type | Default |
|--------|------|---------|
| id | serial (PK) | auto-increment |
| name | varchar(255) | — |
| email | varchar(255) | — |
| password | varchar(255) | — |
| roll | varchar(50) | 'user' |
| created_at | timestamp | now() |
| updated_at | timestamp | now() |

### Drizzle Migrations

Generate migration from TypeScript schema:
```bash
npm run db:generate
```

Run pending migrations:
```bash
npm run db:migrate
```

Open Drizzle Studio (GUI for DB):
```bash
npm run db:studio
```

### Drizzle Configuration
[drizzle.config.js](drizzle.config.js) points to:
- Schema: `src/models/user.model.js`
- Output: `drizzle/` (migrations + metadata)
- Database: Neon Cloud or Local via `DATABASE_URL`

---

## 🔄 CI/CD Workflows

All pipelines automate on **push to `main` or `staging`** + **pull requests**.

### 1️⃣ Lint & Format ([.github/workflows/lint-and-format.yml](.github/workflows/lint-and-format.yml))

**Triggers**: Every PR + push to main/staging

**Steps**:
1. Checkout code
2. Setup Node.js 20
3. Install dependencies
4. Run ESLint (`npm run lint`)
5. Run Prettier check (`npm run format:check`)
6. **Fail if**: Lint errors or formatting issues

**Annotation**: "Run `npm run lint:fix && npm run format` to fix"

### 2️⃣ Tests ([.github/workflows/tests.yml](.github/workflows/tests.yml))

**Triggers**: Every PR + push to main/staging

**Steps**:
1. Checkout code
2. Setup Node.js 20
3. Install dependencies
4. Set `NODE_ENV=test` + `NODE_OPTIONS='--experimental-vm-modules'`
5. Run Jest suite (`npm test`)
6. Upload coverage reports (30-day retention)
7. Generate test summary in PR
8. **Fail if**: Any test fails

**Artifacts**: Coverage HTML available for 30 days

### 3️⃣ Docker Build & Push ([.github/workflows/docker-build-and-push.yml](.github/workflows/docker-build-and-push.yml))

**Triggers**: Push to `main` only (or manual via `workflow_dispatch`)

**Prerequisites**:
- Docker Hub credentials in GitHub Secrets:
  - `DOCKER_USERNAME`
  - `DOCKER_PASSWORD`

**Steps**:
1. Checkout code
2. Setup Docker Buildx (multi-platform builder)
3. Authenticate to Docker Hub
4. Extract metadata (branch, SHA, latest tag, timestamp)
5. Build & push image
   - **Platforms**: `linux/amd64` (Intel/AMD) + `linux/arm64` (Apple Silicon)
   - **Cache**: GitHub Actions cache for faster rebuilds
6. Publish summary to GitHub

**Image Tags**:
- `tag:main` (branch name)
- `tag:sha-abc123def` (commit SHA, truncated)
- `tag:latest` (stable alias)
- `tag:prod-20260318-140530` (timestamp for audit)

**Push to**: `docker.io/<DOCKER_USERNAME>/acquisitions-app`

**Uses**: `docker/build-push-action@v5`

---

## 📁 Project Structure

```
.
├── src/
│   ├── index.js                 # Entry point (loads .env)
│   ├── server.js               # HTTP server bind
│   ├── app.js                  # Express app + middleware setup
│   ├── config/
│   │   ├── logger.js           # Winston logger config
│   │   ├── database.js         # Drizzle + Neon connection
│   │   ├── arcjet.js           # Arcjet rules (bot, shield, rate-limit)
│   │   └── neon.local.js       # Neon Local dev mode config
│   ├── routes/
│   │   ├── auth.routes.js      # POST /api/auth/sign-{up,in,out}
│   │   └── users.routes.js     # GET/PUT/DELETE /api/users/:id
│   ├── controllers/
│   │   ├── auth.controller.js  # Sign up/in/out logic
│   │   └── users.controller.js # User CRUD handlers
│   ├── services/
│   │   ├── auth.service.js     # Auth business logic (hash, create, verify)
│   │   └── users.service.js    # User DB queries
│   ├── middleware/
│   │   ├── auth.middleware.js  # JWT verify + role checks
│   │   └── security.middleware.js # Arcjet bot/rate/shield
│   ├── models/
│   │   └── user.model.js       # Drizzle schema
│   ├── validations/
│   │   ├── auth.validation.js  # Zod schemas for sign-up/in
│   │   └── users.validation.js # Zod schemas for user operations
│   └── utils/
│       ├── jwt.js              # JWT sign/verify helpers
│       ├── cookies.js          # Cookie set/clear helpers
│       └── format.js           # Validation error formatter
├── tests/
│   └── app.test.js             # Jest endpoint tests
├── drizzle/
│   ├── 0000_aberrant_outlaw_kid.sql # Migration file
│   └── meta/
│       ├── _journal.json       # Migration history
│       └── 0000_snapshot.json  # Schema snapshot
├── scripts/
│   ├── dev.sh                  # Docker dev bootstrap
│   └── prod.sh                 # Docker prod bootstrap
├── .github/workflows/
│   ├── lint-and-format.yml     # ESLint + Prettier CI
│   ├── tests.yml               # Jest CI
│   └── docker-build-and-push.yml # Multi-platform Docker push
├── Dockerfile                  # Multi-stage build (dev + prod)
├── docker-compose.dev.yml      # Dev: Neon Local + app
├── docker-compose.prod.yml     # Prod: app only
├── eslint.config.js            # ESLint rules
├── jest.config.mjs             # Jest config (v30, ESM)
├── drizzle.config.js           # Drizzle migration config
├── package.json                # Scripts + dependencies
├── README.md                   # This file
└── Docker_documentation.md     # Detailed Docker runbook
```

---

## 👨‍💻 Development

### Local Setup & Hot Reload
```bash
npm run dev
# ✅ Auto-restarts on file changes
```

### Linting & Formatting
```bash
# Check code style
npm run lint
npm run format:check

# Auto-fix issues
npm run lint:fix
npm run format
```

### Database Migrations
```bash
# Generate migration from schema changes
npm run db:generate

# Apply migrations
npm run db:migrate

# Open interactive DB studio
npm run db:studio
```

### Environment Variables

Create `.env` in root:
```bash
PORT=3000
NODE_ENV=development
DATABASE_URL=postgres://...
JWT_SECRET=your-secret
ARCJET_KEY=your-key
```

**Never commit** `.env` files; add to `.gitignore`:
```
.env
.env.local
.env.*.local
```

---

## 🚀 Deployment

### Option 1: Docker Hub + Cloud Platform

1. **Build & Push** (automated on `main` via CI/CD):
   ```bash
   # Manual push (if needed):
   docker buildx build --push \
     --platform linux/amd64,linux/arm64 \
     -t docker.io/yourname/acquisitions-app:latest .
   ```

2. **Pull & Deploy** to AWS ECS, Render, Railway, etc.:
   ```bash
   docker pull docker.io/yourname/acquisitions-app:latest
   docker run \
     -e DATABASE_URL="postgres://..." \
     -e JWT_SECRET="..." \
     -e ARCJET_KEY="..." \
     -p 3000:3000 \
     docker.io/yourname/acquisitions-app:latest
   ```

### Option 2: Node.js + Systemd on VPS

```bash
# On remote server
git clone <repo> /opt/acquisitions
cd /opt/acquisitions
npm ci --omit=dev
npm run db:migrate

# Create systemd service
sudo nano /etc/systemd/system/acquisitions.service
```

```ini
[Unit]
Description=Acquisitions API
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/acquisitions
ExecStart=/usr/bin/node src/index.js
Restart=on-failure
User=appuser
Environment="NODE_ENV=production"

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable acquisitions
sudo systemctl start acquisitions
sudo systemctl status acquisitions
```

### Option 3: Heroku / Render / Railway

Connect GitHub repo; platform auto-deploys on push to `main`.

**Set env vars** in platform dashboard:
- `DATABASE_URL` → Neon Cloud connection string
- `JWT_SECRET` → Secure random string
- `ARCJET_KEY` → Your Arcjet key
- `NODE_ENV=production`

---

## 🐛 Troubleshooting

### "Cannot find module '#models/user.model.js'"
- Ensure `package.json` has correct `"imports"` mapping
- Clear cache: `rm -rf node_modules && npm ci`

### Arcjet blocks my Postman requests
- In dev, Arcjet may flag client tools as bots
- Set `ARCJET_MODE=DRY_RUN` temporarily (logs, doesn't block)
- Or: Whitelist your IP in Arcjet dashboard

### Tests fail in CI but pass locally
- Ensure `NODE_ENV=test` and `DATABASE_URL` set in workflow
- Coverage artifacts may reveal missing mocks or edge cases

### Docker build fails: "Database URL required"
- Ensure `.env.development` or `.env.production` exists OR
- Pass via `docker run -e DATABASE_URL="..."`

### Can't connect to Neon Local
- Ensure `NEON_LOCAL=true` in `.env.development`
- Check running containers: `docker ps`
- View container logs: `docker logs neon-local`

---

## 📖 Resources

- [Neon Docs](https://neon.tech/docs)
- [Drizzle ORM Guide](https://orm.drizzle.team)
- [Arcjet Security Docs](https://arcjet.com/docs)
- [Express.js Docs](https://expressjs.com)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8949)

---

## 📝 License

ISC License — See repository for details.

---

**Need help?** Open a GitHub issue or check the [Docker_documentation.md](Docker_documentation.md) for advanced setup.

**Happy building! 🚀**
