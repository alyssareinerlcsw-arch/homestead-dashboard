"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { levelFromXP, xpIntoCurrentLevel, getLevelTitle, ACHIEVEMENTS } from "@/lib/xp";

interface Toast { id: number; amount: number; x: number; y: number; }
interface AchievementAlert { id: number; key: string; }

interface XPState {
  totalXP: number; level: number; xpInLevel: number;
  levelTitle: string; streak: number; achievements: string[];
  toasts: Toast[]; achievementAlerts: AchievementAlert[];
  earnXP: (action: string, opts?: { label?: string; questKey?: string; x?: number; y?: number }) => Promise<void>;
  refreshStats: () => Promise<void>;
}

const XPContext = createContext<XPState | null>(null);
let toastId = 0;
let alertId = 0;

export function XPProvider({ children }: { children: React.ReactNode }) {
  const [totalXP, setTotalXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [xpInLevel, setXpInLevel] = useState(0);
  const [streak, setStreak] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [achievementAlerts, setAchievementAlerts] = useState<AchievementAlert[]>([]);
  const [levelTitle, setLevelTitle] = useState("Newcomer");

  async function refreshStats() {
    try {
      const res = await fetch("/api/xp");
      if (!res.ok) return;
      const { stats, achievements: earned } = await res.json();
      if (stats) {
        setTotalXP(stats.total_xp || 0);
        const lvl = levelFromXP(stats.total_xp || 0);
        setLevel(lvl);
        setXpInLevel(xpIntoCurrentLevel(stats.total_xp || 0));
        setLevelTitle(getLevelTitle(lvl));
        setStreak(stats.streak_days || 0);
      }
      if (earned) setAchievements(earned.map((a: { key: string }) => a.key));
    } catch { /* silent */ }
  }

  useEffect(() => { refreshStats(); }, []);

  const earnXP = useCallback(async (action: string, opts?: { label?: string; questKey?: string; x?: number; y?: number }) => {
    const xpAmounts: Record<string, number> = {
      task_complete: 10, habit_log: 5, workout_log: 20,
      note_create: 3, goal_update: 5, measurement_log: 8,
    };
    const amount = xpAmounts[action] || 5;
    const x = opts?.x ?? window.innerWidth / 2;
    const y = opts?.y ?? window.innerHeight / 2;

    const tid = ++toastId;
    setToasts((prev) => [...prev, { id: tid, amount, x, y }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== tid)), 1500);

    try {
      const res = await fetch("/api/xp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, label: opts?.label, questKey: opts?.questKey }),
      });
      const data = await res.json();
      if (data.newTotalXP !== undefined) {
        const lvl = levelFromXP(data.newTotalXP);
        setTotalXP(data.newTotalXP);
        setLevel(lvl);
        setXpInLevel(xpIntoCurrentLevel(data.newTotalXP));
        setLevelTitle(getLevelTitle(lvl));
        setStreak(data.streak);
      }
      if (data.newAchievements?.length > 0) {
        setAchievements((prev) => [...prev, ...data.newAchievements]);
        data.newAchievements.forEach((key: string) => {
          const aid = ++alertId;
          setAchievementAlerts((prev) => [...prev, { id: aid, key }]);
          setTimeout(() => setAchievementAlerts((prev) => prev.filter((a) => a.id !== aid)), 4500);
        });
      }
    } catch { /* silent */ }
  }, []);

  return (
    <XPContext.Provider value={{ totalXP, level, xpInLevel, levelTitle, streak, achievements, toasts, achievementAlerts, earnXP, refreshStats }}>
      {children}

      {/* XP toasts */}
      {toasts.map((t) => (
        <div key={t.id} className="xp-toast" style={{ left: t.x - 20, top: t.y - 20 }}>
          +{t.amount} XP
        </div>
      ))}

      {/* Achievement alerts */}
      {achievementAlerts.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 space-y-2 pointer-events-none">
          {achievementAlerts.map((alert) => {
            const def = ACHIEVEMENTS.find((a) => a.key === alert.key);
            if (!def) return null;
            return (
              <div
                key={alert.id}
                className="achievement-alert flex items-center gap-3 px-4 py-3 rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, #4D6E3A, #5A8240)",
                  border: "1.5px solid rgba(200,232,120,0.35)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.2), 0 0 0 1px rgba(200,232,120,0.1)",
                  color: "#F8F3EA", minWidth: 240,
                }}
              >
                <span style={{ fontSize: 26, flexShrink: 0 }}>{def.icon}</span>
                <div>
                  <p style={{ fontSize: 10, color: "#C8E878", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "Georgia" }}>Achievement Unlocked</p>
                  <p style={{ fontWeight: 600, color: "#F8F3EA", fontFamily: "Georgia" }}>{def.name}</p>
                  <p style={{ fontSize: 11, color: "rgba(248,243,234,0.6)" }}>{def.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </XPContext.Provider>
  );
}

export function useXP() {
  const ctx = useContext(XPContext);
  if (!ctx) throw new Error("useXP must be inside XPProvider");
  return ctx;
}
