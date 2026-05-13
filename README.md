# Urbanclicks Media — Agency Platform

Full-stack agency platform for **Urbanclicks Media**, a content strategy and social media management agency based in Abu Dhabi and Al Ain, UAE.

Built with **Next.js 16**, **Tailwind CSS v4**, **Better Auth**, and **Prisma 7 + PostgreSQL**.

---

## What's included

### Public website
| Route | Description |
|---|---|
| `/` | Home — hero, services overview, intern CTA |
| `/about` | Agency story and values |
| `/services` | Full services list with deliverables |
| `/intern-program` | Program overview, roles, eligibility, process |
| `/apply` | Intern application form |
| `/contact` | Contact form + location info |

### Admin dashboard (`/dashboard`)
| Route | Description |
|---|---|
| `/dashboard` | Overview with key stats and recent activity |
| `/dashboard/interns` | All intern profiles (admin only) |
| `/dashboard/interns/new` | Add intern + create user account |
| `/dashboard/interns/[id]` | Intern detail: tasks, submissions, feedback |
| `/dashboard/tasks` | Kanban task board (To Do / In Progress / Done) |
| `/dashboard/tasks/new` | Create and assign a new task |
| `/dashboard/calendar` | Weekly calendar + full task list by due date |
| `/dashboard/submissions` | Submission tracker with inline status controls |

**Roles:**
- `ADMIN` — full access to all dashboard features
- `INTERN` — dashboard shows their own tasks and submissions only

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env` to `.env.local` and fill in your values:

```bash
cp .env .env.local
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (e.g. `postgresql://user:pass@localhost:5432/urbancliks`) |
| `BETTER_AUTH_SECRET` | Random 32+ character string for signing sessions |
| `BETTER_AUTH_URL` | Canonical base URL, e.g. `http://localhost:3000` |

### 3. Generate and migrate the database

```bash
# Generate Prisma client
npx prisma generate

# Create and apply all migrations
npx prisma migrate dev --name init
```

### 4. Seed the database

```bash
npx prisma db seed
```

This creates:
- **Admin:** `cedric@urbanclicks.ae` / `admin123456`
- **Intern:** `layla@urbanclicks.ae` / `intern123456` (Content Creator)
- **Intern:** `omar@urbanclicks.ae` / `intern123456` (Social Media Coordinator)
- 5 sample tasks, 2 submissions, feedback entries, and 1 application

> **Note:** The seed uses Node's `crypto.scryptSync` to hash passwords in the same format as Better Auth. If login doesn't work after seeding, sign up via the UI at `/login` and then update the user's role in Prisma Studio.

### 5. Start the dev server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Commands

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run lint         # ESLint
npm run type-check   # TypeScript type check (no emit)

# Prisma
npx prisma generate                    # Regenerate Prisma client
npx prisma migrate dev --name <name>   # Create and apply migration
npx prisma migrate deploy              # Apply migrations in production
npx prisma db push                     # Push schema without migrations (prototyping)
npx prisma studio                      # Open Prisma Studio GUI
npx prisma db seed                     # Run seed file
```

---

## Project structure

```
app/
  (marketing)/         # Public website — Navbar + Footer layout
    about/
    services/
    intern-program/
    apply/
    contact/
  (dashboard)/         # Protected admin/intern portal — Sidebar layout
    dashboard/
      interns/
        new/
        [id]/
      tasks/
        new/
      calendar/
      submissions/
  api/
    auth/[...all]/     # Better Auth handler
    interns/           # CRUD for intern profiles
    tasks/             # CRUD for tasks
    submissions/       # CRUD for submissions
    feedback/          # Leave feedback on submissions
    apply/             # Public application form submission
    contact/           # Public contact form
  login/               # Login page
  page.tsx             # Home page
  layout.tsx           # Root layout (Geist fonts)

components/
  marketing/           # Navbar, Footer, ApplyForm, ContactForm
  dashboard/           # Sidebar, StatsCard, InternCard, TaskCard, SubmissionRow, SubmissionActions
  ui/                  # Badge, Button

prisma/
  schema.prisma        # DB schema (User + Better Auth + intern system)
  seed.ts              # Sample data seeder
```

---

## Design system

- **Font:** Geist (variable)
- **Colors:** `#000000` · `#FFFFFF` · `#F5F5F5` · `#C9A84C` (gold accent)
- **Style:** Ultra-minimal flat design — no shadows, clean borders, black/white dominant
- **Tailwind:** v4 with `@theme` CSS blocks (no `tailwind.config.ts`)

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Styling | Tailwind CSS v4 |
| Auth | Better Auth v1.6 |
| Database | PostgreSQL via Prisma 7 |
| Language | TypeScript |
