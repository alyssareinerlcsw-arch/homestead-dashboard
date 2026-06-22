# Personal Productivity Dashboard

A full-stack Next.js 14 App Router personal dashboard with:

- ✅ **Tasks** — to-dos with priority, due dates, and filters
- 🔁 **Habits** — daily tracking with completion history
- 📝 **Notes** — two-pane editor with autosave
- 🎯 **Goals** — progress tracking with status management
- 🏋️ **Gym Tracker** — workout logging, body measurements, body recomp goals

**Stack:** Next.js 14 · Neon Postgres · Tailwind CSS · Vercel

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Neon database

1. Go to [console.neon.tech](https://console.neon.tech)
2. Create a new project (free tier is fine)
3. Copy the **Connection string** from the dashboard

### 3. Configure environment

Copy `.env.example` to `.env.local` and paste your connection string:

```bash
cp .env.example .env.local
```

```env
DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The database tables are created automatically on first load via the `/api/init` endpoint.

---

## Deploy to Vercel

### One-click

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push this repo to GitHub
2. Import it in Vercel
3. Add `DATABASE_URL` as an Environment Variable in Project Settings
4. Deploy — done!

### Or via CLI

```bash
npm i -g vercel
vercel --prod
```

When prompted, add `DATABASE_URL` as an environment variable.

---

## Project structure

```
app/
  page.tsx              # Dashboard home
  tasks/page.tsx        # Task manager
  habits/page.tsx       # Habit tracker
  notes/page.tsx        # Notes editor
  goals/page.tsx        # Goals tracker
  gym/page.tsx          # Gym + body recomp
  api/                  # REST API routes
    init/               # DB initialization (runs once)
    tasks/[id]/
    habits/[id]/log/
    notes/[id]/
    goals/[id]/
    gym/sessions/[id]/
    gym/measurements/[id]/
components/
  nav.tsx               # Sidebar navigation
lib/
  db.ts                 # Neon client + schema SQL
```

---

## Database schema

All tables are auto-created on first visit:

| Table | Purpose |
|---|---|
| `tasks` | To-do items with priority + due date |
| `habits` | Repeating habits |
| `habit_logs` | Daily completion records |
| `notes` | Freeform notes |
| `goals` | Goals with progress % |
| `gym_sessions` | Workout logs with exercises (JSONB) |
| `body_measurements` | Weight, BF%, and body measurements |
| `body_goals` | Target body recomp goals |
