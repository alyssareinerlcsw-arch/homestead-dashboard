import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export const sql = neon(process.env.DATABASE_URL);

export const INIT_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    due_date DATE,
    completed BOOLEAN DEFAULT FALSE,
    category TEXT DEFAULT 'personal',
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS habits (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#6B7C5C',
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS habit_logs (
    id SERIAL PRIMARY KEY,
    habit_id INTEGER REFERENCES habits(id) ON DELETE CASCADE,
    logged_date DATE NOT NULL,
    UNIQUE(habit_id, logged_date)
  )`,
  `CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS goals (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    target_date DATE,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS gym_sessions (
    id SERIAL PRIMARY KEY,
    session_date DATE NOT NULL DEFAULT CURRENT_DATE,
    workout_type TEXT NOT NULL,
    duration_minutes INTEGER,
    notes TEXT,
    exercises JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS body_measurements (
    id SERIAL PRIMARY KEY,
    measurement_date DATE NOT NULL DEFAULT CURRENT_DATE,
    weight_lbs DECIMAL(5,1),
    body_fat_pct DECIMAL(4,1),
    chest_in DECIMAL(4,1),
    waist_in DECIMAL(4,1),
    hips_in DECIMAL(4,1),
    arms_in DECIMAL(4,1),
    thighs_in DECIMAL(4,1),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS body_goals (
    id SERIAL PRIMARY KEY,
    target_weight_lbs DECIMAL(5,1),
    target_body_fat_pct DECIMAL(4,1),
    target_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS user_stats (
    id INTEGER PRIMARY KEY DEFAULT 1,
    total_xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    streak_days INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_active_date DATE,
    tasks_completed INTEGER DEFAULT 0,
    habits_logged INTEGER DEFAULT 0,
    workouts_logged INTEGER DEFAULT 0,
    notes_created INTEGER DEFAULT 0,
    goals_updated INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS daily_steps (
    id SERIAL PRIMARY KEY,
    logged_date DATE NOT NULL DEFAULT CURRENT_DATE,
    step_count INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(logged_date)
  )`,
  `CREATE TABLE IF NOT EXISTS gmail_tokens (
    id INTEGER PRIMARY KEY DEFAULT 1,
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    expiry_date BIGINT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS gmail_processed (
    id SERIAL PRIMARY KEY,
    email_id TEXT UNIQUE NOT NULL,
    processed_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `INSERT INTO user_stats (id) VALUES (1) ON CONFLICT (id) DO NOTHING`,
  `CREATE TABLE IF NOT EXISTS xp_log (
    id SERIAL PRIMARY KEY,
    action TEXT NOT NULL,
    xp_gained INTEGER NOT NULL,
    label TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS achievements (
    id SERIAL PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    icon TEXT,
    earned_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS daily_quest_progress (
    id SERIAL PRIMARY KEY,
    quest_key TEXT NOT NULL,
    quest_date DATE NOT NULL DEFAULT CURRENT_DATE,
    progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    UNIQUE(quest_key, quest_date)
  )`,
];
