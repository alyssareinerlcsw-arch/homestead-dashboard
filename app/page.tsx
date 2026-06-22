"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useXP } from "@/contexts/xp-context";
import { DAILY_QUESTS, ACHIEVEMENTS } from "@/lib/xp";
import { IconBadge, PeonyCorner, Sparkle, DiamondSpark, WindowHeader, VineSprig } from "@/components/decorations";
import { format } from "date-fns";

interface Stats {
  tasksTotal: number; tasksDueToday: number; tasksCompleted: number;
  habitsTotal: number; habitsCompletedToday: number; notesTotal: number;
  goalsActive: number; goalsAvgProgress: number;
  gymSessionsThisWeek: number; latestWeight: number | null;
}
interface QP { quest_key: string; progress: number; completed: boolean; }

export default function DashboardPage() {
  const { level, xpInLevel, levelTitle, streak, achievements, refreshStats } = useXP();
  const [stats, setStats] = useState<Stats | null>(null);
  const [questProgress, setQuestProgress] = useState<QP[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        await fetch("/api/init", { method: "POST" });
        const [tasks, habits, notes, goals, gymData, xpData] = await Promise.all([
          fetch("/api/tasks").then((r) => r.json()),
          fetch("/api/habits").then((r) => r.json()),
          fetch("/api/notes").then((r) => r.json()),
          fetch("/api/goals").then((r) => r.json()),
          fetch("/api/gym/measurements").then((r) => r.json()),
          fetch("/api/xp").then((r) => r.json()),
        ]);
        setQuestProgress(xpData.questProgress || []);
        const sessions = await fetch("/api/gym/sessions").then((r) => r.json());
        const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
        const today = new Date().toISOString().split("T")[0];
        const active = goals.filter((g: { status: string }) => g.status === "active");
        setStats({
          tasksTotal: tasks.length,
          tasksDueToday: tasks.filter((t: { due_date: string; completed: boolean }) => t.due_date?.split("T")[0] === today && !t.completed).length,
          tasksCompleted: tasks.filter((t: { completed: boolean }) => t.completed).length,
          habitsTotal: habits.length,
          habitsCompletedToday: habits.filter((h: { completed_today: boolean }) => h.completed_today).length,
          notesTotal: notes.length,
          goalsActive: active.length,
          goalsAvgProgress: active.length > 0 ? Math.round(active.reduce((s: number, g: { progress: number }) => s + g.progress, 0) / active.length) : 0,
          gymSessionsThisWeek: sessions.filter((s: { session_date: string }) => new Date(s.session_date) >= weekAgo).length,
          latestWeight: gymData.measurements?.[0]?.weight_lbs ?? null,
        });
      } finally {
        setLoading(false);
        refreshStats();
      }
    }
    load();
  }, [refreshStats]);

  const getQP = (key: string) => questProgress.find((q) => q.quest_key === key)?.progress || 0;
  const questsDone = DAILY_QUESTS.filter((q) => getQP(q.key) >= q.target).length;

  const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-36 rounded-3xl" style={{ background: "rgba(200,160,130,0.12)" }} />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-32 rounded-3xl" style={{ background: "rgba(200,160,130,0.08)" }} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* ── Greeting card with cloud banner ── */}
      <div style={{
        border: "2px solid rgba(160,120,90,0.18)",
        borderRadius: 24,
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(100,60,40,0.09)",
        position: "relative",
      }}>
        {/* Peony corner decorations */}
        <PeonyCorner size={56} style={{ position: "absolute", top: -6, left: -6, zIndex: 2 }} />
        <PeonyCorner size={56} style={{ position: "absolute", top: -6, right: -6, zIndex: 2, transform: "scaleX(-1)" }} />

        {/* Actual sage clouds inspiration image */}
        <img
          src="/304958cf9a546d0a1abf30f9b4c35957.jpg"
          alt=""
          style={{ width: "100%", height: 150, objectFit: "cover", objectPosition: "center 30%", display: "block" }}
        />

        <div style={{ background: "#FBF7F1", padding: "16px 24px 20px", borderTop: "1.5px solid rgba(160,120,90,0.12)" }}>
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <p style={{ fontSize: 10, color: "rgba(120,80,50,0.55)", textTransform: "uppercase", letterSpacing: "0.09em", fontFamily: "Georgia", marginBottom: 4 }}>
                {format(new Date(), "EEEE, MMMM d, yyyy")}
              </p>
              <div className="flex items-center gap-2">
                <Sparkle size={13} color="#C8A060" opacity={0.7} />
                <h1 style={{ fontFamily: "Georgia, serif", fontSize: 22, color: "#3E2E20", fontWeight: "normal" }}>
                  {greeting()}, Alyssa
                </h1>
                <Sparkle size={13} color="#C8A060" opacity={0.7} />
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="level-pill">⭐ Lv.{level} · {levelTitle}</div>
              {streak > 0 && <div className="streak-counter">🔥 {streak}-day streak</div>}
              <span style={{ fontSize: 11, color: "rgba(120,80,50,0.5)", fontFamily: "Georgia", fontStyle: "italic" }}>
                {questsDone}/{DAILY_QUESTS.length} quests today
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Daily Quests ── */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <VineSprig color="#7A9E70" size={20} />
          <h2 style={{ fontFamily: "Georgia", fontSize: 15, color: "#3E2E20", fontWeight: "normal", letterSpacing: "0.02em" }}>
            Daily Quests
          </h2>
          <VineSprig color="#7A9E70" size={20} style={{ transform: "scaleX(-1)" }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {DAILY_QUESTS.map((quest) => {
            const progress = getQP(quest.key);
            const done = progress >= quest.target;
            return (
              <div key={quest.key} className={`quest-card ${done ? "complete" : ""}`}>
                <div className="flex items-start gap-3">
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{quest.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: 13, fontFamily: "Georgia", color: done ? "#4E7040" : "#3E2E20", textDecoration: done ? "line-through" : "none", opacity: done ? 0.7 : 1 }}>
                      {quest.label}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="seg-bar flex-1">
                        {Array.from({ length: quest.target }).map((_, i) => (
                          <div key={i} className={`seg-bar-item ${i < progress ? "filled gold" : ""}`} />
                        ))}
                      </div>
                      <span style={{ fontSize: 10, color: "#C8A060", fontWeight: 700, fontFamily: "Georgia" }}>+{quest.xp} XP</span>
                    </div>
                  </div>
                  {done && <DiamondSpark color="#7A9E70" size={14} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <VineSprig color="#7A9E70" size={20} />
          <h2 style={{ fontFamily: "Georgia", fontSize: 15, color: "#3E2E20", fontWeight: "normal", letterSpacing: "0.02em" }}>
            Your Progress
          </h2>
          <VineSprig color="#7A9E70" size={20} style={{ transform: "scaleX(-1)" }} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard href="/tasks"
            badge={<IconBadge emoji="📋" size={48} bg="rgba(200,128,122,0.12)" border="rgba(200,128,122,0.2)" />}
            label="Tasks" primary={`${stats?.tasksCompleted ?? 0}/${stats?.tasksTotal ?? 0}`} primarySub="done"
            secondary={stats?.tasksDueToday ? `${stats.tasksDueToday} due today` : "All caught up!"} highlight={!!stats?.tasksDueToday}
            barPct={stats && stats.tasksTotal > 0 ? (stats.tasksCompleted / stats.tasksTotal) * 100 : 0} barColor="#C8807A" />
          <StatCard href="/habits"
            badge={<IconBadge emoji="🌱" size={48} bg="rgba(122,158,112,0.13)" border="rgba(122,158,112,0.22)" />}
            label="Habits" primary={`${stats?.habitsCompletedToday ?? 0}/${stats?.habitsTotal ?? 0}`} primarySub="today"
            secondary={stats && stats.habitsTotal > 0 && stats.habitsCompletedToday === stats.habitsTotal ? "All done! 🌸" : `${(stats?.habitsTotal ?? 0) - (stats?.habitsCompletedToday ?? 0)} remaining`}
            highlight={stats?.habitsCompletedToday === stats?.habitsTotal && !!stats?.habitsTotal}
            barPct={stats && stats.habitsTotal > 0 ? (stats.habitsCompletedToday / stats.habitsTotal) * 100 : 0} barColor="#7A9E70" />
          <StatCard href="/notes"
            badge={<IconBadge emoji="📖" size={48} bg="rgba(200,160,96,0.13)" border="rgba(200,160,96,0.2)" />}
            label="Notes" primary={String(stats?.notesTotal ?? 0)} primarySub="entries"
            secondary="Tap to write or browse"
            barPct={Math.min((stats?.notesTotal ?? 0) * 10, 100)} barColor="#C8A060" />
          <StatCard href="/goals"
            badge={<IconBadge emoji="🎯" size={48} bg="rgba(128,152,176,0.13)" border="rgba(128,152,176,0.2)" />}
            label="Goals" primary={String(stats?.goalsActive ?? 0)} primarySub="active"
            secondary={stats?.goalsAvgProgress ? `${stats.goalsAvgProgress}% avg progress` : "Set your first goal"}
            barPct={stats?.goalsAvgProgress ?? 0} barColor="#8098B0" />
          <StatCard href="/gym"
            badge={<IconBadge emoji="💪" size={48} bg="rgba(160,120,90,0.13)" border="rgba(160,120,90,0.2)" />}
            label="Gym" primary={String(stats?.gymSessionsThisWeek ?? 0)} primarySub="this week"
            secondary={stats?.latestWeight ? `${stats.latestWeight} lbs` : "Log your first workout"}
            barPct={Math.min((stats?.gymSessionsThisWeek ?? 0) * 20, 100)} barColor="#A07858" />
          <StreakCard streak={streak} questsDone={questsDone} xpInLevel={xpInLevel} />
        </div>
      </div>

      {/* ── Achievements ── */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <VineSprig color="#7A9E70" size={20} />
          <h2 style={{ fontFamily: "Georgia", fontSize: 15, color: "#3E2E20", fontWeight: "normal", letterSpacing: "0.02em" }}>
            Achievements
          </h2>
          <VineSprig color="#7A9E70" size={20} style={{ transform: "scaleX(-1)" }} />
        </div>
        <div className="card" style={{ overflow: "visible", position: "relative" }}>
          <WindowHeader title="achievements.exe" color="sage" />
          <div className="flex flex-wrap gap-5 mt-1">
            {ACHIEVEMENTS.map((ach) => {
              const earned = achievements.includes(ach.key);
              return (
                <div key={ach.key} title={earned ? ach.description : "???"} className="flex flex-col items-center" style={{ minWidth: 56 }}>
                  <div className={`achievement-icon ${earned ? "earned" : "locked"}`}>{earned ? ach.icon : "?"}</div>
                  <p style={{ fontSize: 9, marginTop: 4, color: earned ? "#7A4838" : "rgba(120,80,50,0.4)", textAlign: "center", maxWidth: 56, lineHeight: 1.3, fontFamily: "Georgia" }}>
                    {earned ? ach.name : "???"}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-2 mt-5 pt-4" style={{ borderTop: "1px solid rgba(200,136,120,0.12)" }}>
            <Sparkle size={14} color="#C8A060" />
            <p style={{ fontSize: 12, color: "rgba(120,80,50,0.55)", fontFamily: "Georgia", fontStyle: "italic" }}>
              {achievements.length}/{ACHIEVEMENTS.length} achievements unlocked
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ href, badge, label, primary, primarySub, secondary, highlight, barPct, barColor }: {
  href: string; badge: React.ReactNode; label: string;
  primary: string; primarySub: string; secondary: string;
  highlight?: boolean; barPct: number; barColor: string;
}) {
  return (
    <Link href={href} className="card card-hover block cursor-pointer" style={{ overflow: "visible" }}>
      <div className="flex items-start justify-between mb-3">
        {badge}
        <ChevronRight style={{ width: 13, height: 13, color: "rgba(160,120,90,0.3)", marginTop: 4 }} />
      </div>
      <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(120,80,50,0.55)", fontFamily: "Georgia", marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 22, fontWeight: 700, fontFamily: "Georgia", color: "#3E2E20", lineHeight: 1 }}>
        {primary}<span style={{ fontSize: 11, fontWeight: 400, color: "rgba(120,80,50,0.6)", marginLeft: 4 }}>{primarySub}</span>
      </p>
      {barPct > 0 && (
        <div className="hp-bar-track mt-2.5">
          <div className="hp-bar-fill" style={{ width: `${barPct}%`, background: `linear-gradient(90deg, ${barColor}, ${barColor}99)` }} />
        </div>
      )}
      <p style={{ fontSize: 11, marginTop: 5, color: highlight ? barColor : "rgba(120,80,50,0.5)", fontWeight: highlight ? 600 : 400, fontFamily: "Georgia" }}>
        {secondary}
      </p>
    </Link>
  );
}

function StreakCard({ streak, questsDone, xpInLevel }: { streak: number; questsDone: number; xpInLevel: number }) {
  return (
    <div className="card" style={{ overflow: "visible" }}>
      <div className="flex items-start justify-between mb-3">
        <IconBadge emoji="🌸" size={48} bg="rgba(200,128,122,0.13)" border="rgba(200,128,122,0.2)" />
      </div>
      <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(120,80,50,0.55)", fontFamily: "Georgia", marginBottom: 4 }}>Streak</p>
      <p style={{ fontSize: 22, fontWeight: 700, fontFamily: "Georgia", color: "#C8A060", lineHeight: 1 }}>
        {streak}<span style={{ fontSize: 11, fontWeight: 400, color: "rgba(120,80,50,0.6)", marginLeft: 4 }}>days</span>
      </p>
      <div className="seg-bar mt-3" style={{ gap: 3 }}>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className={`seg-bar-item ${i < Math.min(streak, 7) ? "filled rose" : ""}`} style={{ height: 7 }} />
        ))}
      </div>
      <p style={{ fontSize: 10, marginTop: 6, color: "rgba(120,80,50,0.45)", fontFamily: "Georgia", fontStyle: "italic" }}>
        {questsDone}/{DAILY_QUESTS.length} quests · {xpInLevel}/100 XP
      </p>
    </div>
  );
}
