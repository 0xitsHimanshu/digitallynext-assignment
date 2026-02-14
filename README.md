# Task Board

A full-stack task management application with a drag-and-drop Kanban board, built with **Next.js 16**, **PostgreSQL**, and **Prisma ORM**. Users can sign up, log in, and manage their personal tasks across three columns — **TODO**, **IN PROGRESS**, and **DONE**.

---

## Tech Stack

| Layer          | Technology                                                    |
| -------------- | ------------------------------------------------------------- |
| Framework      | [Next.js 16](https://nextjs.org/) (App Router, Turbopack)    |
| Language       | TypeScript 5.7                                                |
| UI             | Tailwind CSS 3, Radix UI, Lucide Icons, shadcn/ui components |
| Forms          | React Hook Form + Zod validation                             |
| Auth           | JWT (jose) + bcryptjs, stored in httpOnly cookies             |
| Database       | PostgreSQL                                                    |
| ORM            | Prisma 7 (with `@prisma/adapter-pg`)                         |
| Charts         | Recharts                                                      |
| Notifications  | Sonner (toast)                                                |
| Theme          | next-themes (dark mode support)                               |

---

## Authentication Flow

The app uses **stateless JWT-based authentication** with tokens stored in **httpOnly cookies** (secure in production, 7-day expiry).

```
┌──────────┐        POST /api/auth/signup         ┌───────────┐
│  Client   │ ──────────────────────────────────►  │   Server  │
│ (Browser) │  { name, email, password }           │  (API)    │
└──────────┘                                       └───────────┘
                                                        │
                                          1. Validate input (Zod)
                                          2. Check duplicate email
                                          3. Hash password (bcrypt, 10 rounds)
                                          4. Create user in DB (Prisma)
                                          5. Sign JWT (HS256, 7d expiry)
                                          6. Set httpOnly cookie "token"
                                                        │
                                                        ▼
                                                 Return user data
```

### Endpoints

| Endpoint               | Method | Description                                                     |
| ---------------------- | ------ | --------------------------------------------------------------- |
| `/api/auth/signup`     | POST   | Register a new user. Validates with Zod, hashes password, sets JWT cookie. |
| `/api/auth/login`      | POST   | Authenticate user. Verifies password, sets JWT cookie.          |
| `/api/auth/logout`     | POST   | Clears the auth cookie.                                         |
| `/api/auth/me`         | GET    | Returns the current user by verifying the JWT from the cookie.  |

### Frontend Auth Guard

- An `AuthContext` provider wraps the app and calls `/api/auth/me` on mount.
- The dashboard layout redirects unauthenticated users to `/auth/login`.
- All task API routes extract `userId` from the JWT before processing requests.

---

## Database Schema

The app uses **PostgreSQL** with **Prisma ORM**. There are two models with a one-to-many relationship:

```
┌─────────────────────────────┐       ┌─────────────────────────────┐
│            User             │       │            Task             │
├─────────────────────────────┤       ├─────────────────────────────┤
│ id        String (CUID) PK │       │ id        String (CUID) PK │
│ name      String           │       │ title     String           │
│ email     String (unique)  │───┐   │ status    String           │
│ password  String (hashed)  │   │   │           ("TODO" default) │
│ createdAt DateTime         │   │   │ createdAt DateTime         │
│ updatedAt DateTime         │   └──►│ updatedAt DateTime         │
│                             │  1:N  │ userId    String (FK)      │
└─────────────────────────────┘       └─────────────────────────────┘
```

### User

| Field      | Type     | Notes                       |
| ---------- | -------- | --------------------------- |
| `id`       | String   | CUID, primary key           |
| `name`     | String   | 1–100 characters            |
| `email`    | String   | Unique                      |
| `password` | String   | bcrypt-hashed               |
| `createdAt`| DateTime | Auto-set on creation        |
| `updatedAt`| DateTime | Auto-updated                |

### Task

| Field      | Type     | Notes                                     |
| ---------- | -------- | ----------------------------------------- |
| `id`       | String   | CUID, primary key                         |
| `title`    | String   | 1–200 characters                          |
| `status`   | String   | Enum: `TODO`, `IN_PROGRESS`, `DONE`       |
| `createdAt`| DateTime | Auto-set on creation                      |
| `updatedAt`| DateTime | Auto-updated                              |
| `userId`   | String   | Foreign key → User (cascade delete)       |

- **Relationship:** A User has many Tasks. Deleting a user cascades to delete all their tasks.
- **Index:** `userId` is indexed for fast task lookups per user.

---

## API Routes — Tasks

| Endpoint            | Method | Description                                      |
| ------------------- | ------ | ------------------------------------------------ |
| `/api/tasks`        | GET    | Fetch all tasks for the authenticated user (newest first). |
| `/api/tasks`        | POST   | Create a new task (`{ title }`, defaults to `TODO`).       |
| `/api/tasks/[id]`   | PATCH  | Update task status (`{ status: "TODO" | "IN_PROGRESS" | "DONE" }`). Ownership-checked. |

---

## Steps to Run Locally

### Prerequisites

- **Node.js** ≥ 18
- **pnpm** (or npm/yarn)
- **PostgreSQL** database (local or cloud, e.g. Neon, Supabase, Railway)

### 1. Clone the repository

```bash
git clone https://github.com/0xitsHimanshu/digitallynext-assignment
cd digitally-next-assessment
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
JWT_SECRET="your-strong-secret-key-here"
```

| Variable       | Description                                     |
| -------------- | ----------------------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string                    |
| `JWT_SECRET`   | Secret key for signing JWT tokens               |

### 4. Set up the database

```bash
# Generate the Prisma client
npx prisma generate

# Push the schema to the database (creates tables)
npx prisma db push
```

### 5. Run the development server

```bash
pnpm dev
```

The app will be available at **http://localhost:3000**.

### 6. (Optional) View the database

```bash
npx prisma studio
```

This opens a GUI at **http://localhost:5555** to browse and edit your data.

---

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/          # Auth endpoints (signup, login, logout, me)
│   │   └── tasks/         # Task CRUD endpoints
│   ├── auth/              # Login & Signup pages
│   ├── dashboard/         # Protected dashboard (Kanban board)
│   ├── layout.tsx         # Root layout (AuthProvider, fonts)
│   └── page.tsx           # Redirects to /auth/login
├── components/            # Reusable UI components (TaskCard, TaskColumn)
├── contexts/              # React context (AuthContext)
├── lib/
│   ├── auth.ts            # JWT helpers, password hashing, cookie utils
│   ├── prisma.ts          # Prisma client singleton
│   └── validations.ts     # Zod schemas for input validation
├── prisma/
│   └── schema.prisma      # Database schema
├── tailwind.config.ts     # Tailwind CSS configuration
└── package.json
```

---

## Live URL

> **https://digitallynext-assignment.vercel.app/**
>
> Example: `https://task-board.vercel.app`

---
