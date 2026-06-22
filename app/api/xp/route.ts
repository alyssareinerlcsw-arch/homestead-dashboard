import { sql } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { XP_REWARDS, type XPAction, levelFromXP, ACHIEVEMENTS } from "@/lib/xp";

export async function GET() {
  const [stats] = await sql`SELECT * FROM user_stats WHERE id = 1`;
  const achievements = await sql`SELECT * FROM achievements ORDER BY earned_at ASC`;
  const today = new Date().toISOString().split("T")[0];
  const questProgress = await sql`
    SELECT * FROM daily_quest_progress WHERE quest_date = ${today}
  `;
  return NextResponse.json({ stats, achievements, questProgress });
}

export async function POST(req: NextRequest) {
  const { action, label, questKey } = await req.json();

  const xpAmount = XP_REWARDS[action as XPAction];
  if (!xpAmount) return NextResponse.json({ error: "Unknown action" }, { status: 400 });

  await sql`INSERT INTO xp_log (action, xp_gained, label) VALUES (${action}, ${xpAmount}, ${label || null})`;

  const [stats] = await sql`SELECT * FROM user_stats WHERE id = 1`;
  const newTotalXP = (stats.total_xp || 0) + xpAmount;
  const oldLevel = levelFromXP(stats.total_xp || 0);
  const newLevel = levelFromXP(newTotalXP);

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];
  const lastActive = stats.last_active_date ? new Date(stats.last_active_date).toISOString().split("T")[0] : null;

  let newStreak = stats.streak_days || 0;
  if (lastActive === today) { /* keep */ }
  else if (lastActive === yesterdayStr) { newStreak += 1; }
  else { newStreak = 1; }
  const newLongest = Math.max(stats.longest_streak || 0, newStreak);

  // Update stats with explicit counter increments based on action
  await sql`
    UPDATE user_stats SET
      total_xp = ${newTotalXP},
      level = ${newLevel},
      streak_days = ${newStreak},
      longest_streak = ${newLongest},
      last_active_date = ${today},
      tasks_completed = tasks_completed + ${action === "task_complete" ? 1 : 0},
      habits_logged = habits_logged + ${action === "habit_log" ? 1 : 0},
      workouts_logged = workouts_logged + ${action === "workout_log" ? 1 : 0},
      notes_created = notes_created + ${action === "note_create" ? 1 : 0},
      goals_updated = goals_updated + ${action === "goal_update" ? 1 : 0}
    WHERE id = 1
  `;

  const [newStats] = await sql`SELECT * FROM user_stats WHERE id = 1`;
  const existingAchievements = await sql`SELECT key FROM achievements`;
  const existingKeys = new Set(existingAchievements.map((a) => (a as { key: string }).key));
  const earned: string[] = [];

  async function awardAchievement(key: string) {
    if (existingKeys.has(key)) return;
    const def = ACHIEVEMENTS.find((a) => a.key === key);
    if (!def) return;
    await sql`INSERT INTO achievements (key, name, icon) VALUES (${key}, ${def.name}, ${def.icon}) ON CONFLICT DO NOTHING`;
    existingKeys.add(key);
    earned.push(key);
  }

  const s = newStats;
  if (s.tasks_completed >= 1) await awardAchievement("first_task");
  if (s.workouts_logged >= 1) await awardAchievement("first_workout");
  if (s.notes_created >= 1) await awardAchievement("first_note");
  if (s.goals_updated >= 1) await awardAchievement("first_goal");
  if (s.tasks_completed >= 10) await awardAchievement("tasks_10");
  if (s.workouts_logged >= 5) await awardAchievement("workouts_5");
  if (s.streak_days >= 3) await awardAchievement("streak_3");
  if (s.streak_days >= 7) await awardAchievement("streak_7");
  if (s.streak_days >= 30) await awardAchievement("streak_30");
  if (newTotalXP >= 100) await awardAchievement("xp_100");
  if (newTotalXP >= 500) await awardAchievement("xp_500");
  if (newLevel >= 5) await awardAchievement("level_5");
  if (newLevel >= 10) await awardAchievement("level_10");

  if (questKey) {
    await sql`
      INSERT INTO daily_quest_progress (quest_key, quest_date, progress, completed)
      VALUES (${questKey}, ${today}, 1, false)
      ON CONFLICT (quest_key, quest_date)
      DO UPDATE SET progress = daily_quest_progress.progress + 1
    `;
  }

  return NextResponse.json({ xpGained: xpAmount, newTotalXP, newLevel, leveledUp: newLevel > oldLevel, streak: newStreak, newAchievements: earned });
}
