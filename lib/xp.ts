export const XP_REWARDS = {
  task_complete: 10,
  habit_log: 5,
  workout_log: 20,
  note_create: 3,
  goal_update: 5,
  measurement_log: 8,
} as const;

export type XPAction = keyof typeof XP_REWARDS;

export function levelFromXP(totalXP: number): number {
  return Math.floor(totalXP / 100) + 1;
}

export function xpIntoCurrentLevel(totalXP: number): number {
  return totalXP % 100;
}

export function xpToNextLevel(totalXP: number): number {
  return 100 - xpIntoCurrentLevel(totalXP);
}

export const LEVEL_TITLES: Record<number, string> = {
  1: "Newcomer",
  2: "Newcomer",
  3: "Tiller",
  4: "Tiller",
  5: "Gardener",
  6: "Gardener",
  7: "Cultivator",
  8: "Cultivator",
  9: "Forager",
  10: "Forager",
  11: "Artisan",
  12: "Artisan",
  13: "Rancher",
  14: "Master Farmer",
  15: "Master Farmer",
};

export function getLevelTitle(level: number): string {
  return LEVEL_TITLES[Math.min(level, 15)] || "Master Farmer";
}

export const ACHIEVEMENTS = [
  { key: "first_task",    name: "First Harvest",    description: "Complete your first task",          icon: "🌾" },
  { key: "first_habit",   name: "Early Bird",        description: "Complete all habits in a day",       icon: "🌅" },
  { key: "first_workout", name: "First Steps",       description: "Log your first workout",             icon: "👟" },
  { key: "first_note",    name: "Field Notes",       description: "Write your first note",              icon: "📋" },
  { key: "first_goal",    name: "Big Plans",         description: "Set your first goal",                icon: "🎯" },
  { key: "streak_3",      name: "Consistent",        description: "3-day streak",                       icon: "🔥" },
  { key: "streak_7",      name: "One Week In",       description: "7-day streak",                       icon: "⭐" },
  { key: "streak_30",     name: "Full Season",       description: "30-day streak",                      icon: "🌻" },
  { key: "level_5",       name: "Getting Good",      description: "Reach level 5",                      icon: "🌱" },
  { key: "level_10",      name: "Seasoned",          description: "Reach level 10",                     icon: "🌳" },
  { key: "tasks_10",      name: "Busy Bee",          description: "Complete 10 tasks",                  icon: "🐝" },
  { key: "workouts_5",    name: "Iron Will",         description: "Log 5 workouts",                     icon: "💪" },
  { key: "xp_100",        name: "First Crop",        description: "Earn 100 XP total",                  icon: "🌽" },
  { key: "xp_500",        name: "Abundant Garden",   description: "Earn 500 XP total",                  icon: "🍅" },
];

export const DAILY_QUESTS = [
  { key: "complete_tasks", label: "Complete 3 tasks",      target: 3, xp: 25, icon: "📋" },
  { key: "log_habits",     label: "Check off all habits",  target: 1, xp: 20, icon: "🌿" },
  { key: "log_workout",    label: "Log a workout",         target: 1, xp: 30, icon: "🏋️" },
  { key: "write_note",     label: "Write a note",          target: 1, xp: 15, icon: "✏️" },
  { key: "update_goal",    label: "Update a goal",         target: 1, xp: 15, icon: "🎯" },
];
