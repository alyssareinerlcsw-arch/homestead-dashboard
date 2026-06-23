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
  // ── Core milestones ────────────────────────────────────────────────────────
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

  // ── Snarky unlocks ─────────────────────────────────────────────────────────
  { key: "tasks_25",      name: "Technically Productive",            description: "25 tasks done. The list is shorter. Your existential dread is about the same.",                                             icon: "📌" },
  { key: "tasks_50",      name: "I Work For The List Now",           description: "50 tasks. At this point you don't own the to-do list. The to-do list owns you.",                                            icon: "🗂️" },
  { key: "tasks_100",     name: "The System Is Winning",             description: "100 tasks completed. The paperwork is under control. Everything else: pending review.",                                     icon: "🤖" },
  { key: "workouts_10",   name: "Technically An Athlete",            description: "10 workouts logged. You are allowed to mention this casually in conversation now.",                                         icon: "🏅" },
  { key: "workouts_25",   name: "The Machines Remember You",         description: "25 sessions. The equipment has seen your face more than some of your relatives.",                                           icon: "🦾" },
  { key: "workouts_50",   name: "Unsolicited Fitness Advice Incoming", description: "50 workouts. Statistically, you are about to recommend a gym to someone who did not ask.",                              icon: "💀" },
  { key: "habits_30",     name: "Groundhog Day",                     description: "30 habit logs. Wake up. Check boxes. Repeat. Sisyphus would be proud, honestly.",                                          icon: "🔁" },
  { key: "habits_100",    name: "Afraid Of The Red Square",          description: "100 habit logs. We cannot determine if you have great discipline or a crippling fear of incomplete checkboxes.",           icon: "☑️" },
  { key: "notes_5",       name: "Highly Functional Chaos",           description: "5 notes. Your thoughts are technically written down now. What happens next is anyone's guess.",                            icon: "📓" },
  { key: "notes_20",      name: "Future Archaeologist's Problem",    description: "20 notes saved. In six months you will spend 45 minutes searching for one specific thing in here.",                         icon: "🦴" },
  { key: "streak_14",     name: "Stubbornness Disguised As Discipline", description: "14 days straight. At some point the goal stopped mattering and the streak became the whole point.",                    icon: "😤" },
  { key: "streak_21",     name: "Allegedly A Habit Now",             description: "21 days. Scientists disagree on whether this makes a habit. We're giving you a badge regardless.",                         icon: "🧪" },
  { key: "xp_1000",       name: "The Gamification Is Working",       description: "1,000 XP. You are doing tasks specifically because a number went up. We respect this completely.",                         icon: "🎮" },
  { key: "xp_2500",       name: "Concerning Dedication",             description: "2,500 XP. You're doing great. Please also occasionally look up from the screen.",                                          icon: "😵" },
  { key: "level_3",       name: "Out Of Tutorial Zone",              description: "Level 3. You've graduated from 'how does this work' to 'why is this my whole personality.'",                               icon: "🗺️" },
  { key: "level_7",       name: "Mid-Boss Energy",                   description: "Level 7. Past the easy parts. The real enemies are the tasks you keep moving to tomorrow.",                                icon: "⚔️" },
];

export const DAILY_QUESTS = [
  { key: "complete_tasks", label: "Complete 3 tasks",      target: 3, xp: 25, icon: "📋" },
  { key: "log_habits",     label: "Check off all habits",  target: 1, xp: 20, icon: "🌿" },
  { key: "log_workout",    label: "Log a workout",         target: 1, xp: 30, icon: "🏋️" },
  { key: "write_note",     label: "Write a note",          target: 1, xp: 15, icon: "✏️" },
  { key: "update_goal",    label: "Update a goal",         target: 1, xp: 15, icon: "🎯" },
];
