"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Check } from "lucide-react";
import { useXP } from "@/contexts/xp-context";
import { IconBadge } from "@/components/decorations";

interface Habit {
  id: number; name: string; description: string | null; color: string;
  completed_today: boolean; streak: number; recent_count: number; created_at: string;
}

const HABIT_COLORS = [
  { value: "#5A8240", label: "Sage" },
  { value: "#7B9E6B", label: "Fern" },
  { value: "#D4A820", label: "Gold" },
  { value: "#8B6245", label: "Brown" },
  { value: "#E8607A", label: "Rose" },
  { value: "#6B8E9E", label: "Blue" },
];

export default function HabitsPage() {
  const { earnXP } = useXP();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", color: "#5A8240" });
  const [saving, setSaving] = useState(false);

  async function loadHabits() {
    const data = await fetch("/api/habits").then((r) => r.json());
    setHabits(data);
    setLoading(false);
  }

  useEffect(() => { loadHabits(); }, []);

  async function addHabit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    await fetch("/api/habits", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm({ name: "", description: "", color: "#5A8240" });
    setShowForm(false);
    await loadHabits();
    setSaving(false);
  }

  async function toggleHabit(habit: Habit, e: React.MouseEvent) {
    const res = await fetch(`/api/habits/${habit.id}/log`, { method: "POST" });
    const data = await res.json();
    setHabits((prev) => prev.map((h) => h.id === habit.id ? { ...h, completed_today: data.action === "logged", streak: data.streak ?? h.streak } : h));
    if (data.action === "logged") earnXP("habit_log", { label: "Habit done", questKey: "log_habits", x: e.clientX, y: e.clientY });
  }

  async function deleteHabit(id: number) {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    await fetch(`/api/habits/${id}`, { method: "DELETE" });
  }

  const completedToday = habits.filter((h) => h.completed_today).length;
  const allDone = habits.length > 0 && completedToday === habits.length;

  return (
    <div className="space-y-6">
      <div className="page-header flex items-start justify-between">
        <div className="flex items-center gap-3">
          <IconBadge emoji="🌱" size={48} bg="rgba(122,158,112,0.13)" border="rgba(122,158,112,0.22)" />
          <div>
            <h1 className="section-title" style={{ fontSize: 24 }}>Daily Habits</h1>
            <p className="section-subtitle">{completedToday}/{habits.length} done today · +5 XP each</p>
          </div>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary"><Plus className="w-4 h-4" />Add habit</button>
      </div>

      {habits.length > 0 && (
        <div className="card" style={{ padding: "12px 16px" }}>
          <div className="flex items-center justify-between mb-2">
            <p style={{ fontSize: 12, fontFamily: "Georgia", color: "#3A2810" }}>
              {allDone ? "All done for today! 🌻" : `${habits.length - completedToday} habit${habits.length - completedToday !== 1 ? "s" : ""} remaining`}
            </p>
            <span style={{ fontSize: 11, color: "#D4A820", fontWeight: 600 }}>{Math.round((completedToday / habits.length) * 100)}%</span>
          </div>
          <div className="xp-bar-track">
            <div className="xp-bar-fill" style={{ width: `${habits.length > 0 ? (completedToday / habits.length) * 100 : 0}%`, background: allDone ? "linear-gradient(90deg, #5A8240, #7AB84A)" : undefined }} />
          </div>
        </div>
      )}

      {showForm && (
        <form onSubmit={addHabit} className="card space-y-3">
          <h3 style={{ fontFamily: "Georgia", fontSize: 14, color: "#3A2810" }}>New habit</h3>
          <div>
            <label className="label">Habit name</label>
            <input className="input" placeholder="e.g. Morning walk, Drink water, Read..." value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} autoFocus />
          </div>
          <div>
            <label className="label">Notes (optional)</label>
            <input className="input" placeholder="Any details..." value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <div>
            <label className="label">Color</label>
            <div className="flex gap-2 mt-1">
              {HABIT_COLORS.map((c) => (
                <button key={c.value} type="button" onClick={() => setForm((f) => ({ ...f, color: c.value }))}
                  title={c.label}
                  style={{ width: 28, height: 28, borderRadius: "50%", background: c.value, border: form.color === c.value ? "3px solid #3A2810" : "2px solid transparent", transition: "border 0.15s" }} />
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="submit" className="btn-primary" disabled={saving || !form.name.trim()}>{saving ? "Adding..." : "Add habit"}</button>
            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-2">{[1,2,3].map((i) => <div key={i} className="rounded-2xl animate-pulse" style={{ height: 80, background: "rgba(117,160,83,0.07)" }} />)}</div>
      ) : habits.length === 0 ? (
        <div className="card text-center py-12">
          <div className="flex justify-center mb-3"><IconBadge emoji="🌱" size={48} bg="rgba(122,158,112,0.13)" border="rgba(122,158,112,0.22)" /></div>
          <p style={{ fontFamily: "Georgia", color: "rgba(122,106,80,0.55)", fontStyle: "italic" }}>No habits yet — start building your routine!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {habits.map((habit) => (
            <div key={habit.id} className="card flex items-center gap-3 py-4"
              style={{ borderLeft: `3px solid ${habit.completed_today ? habit.color : "transparent"}`, opacity: habit.completed_today ? 0.75 : 1 }}>
              <button onClick={(e) => toggleHabit(habit, e)}
                className={`habit-check ${habit.completed_today ? "checked" : ""}`}
                style={{ borderColor: habit.color, background: habit.completed_today ? habit.color : "transparent" }}>
                {habit.completed_today && <Check style={{ width: 13, height: 13, color: "#fff" }} />}
              </button>
              <div className="flex-1">
                <p style={{ fontSize: 14, fontFamily: "Georgia", color: "#3A2810", textDecoration: habit.completed_today ? "line-through" : "none" }}>{habit.name}</p>
                {habit.description && <p style={{ fontSize: 12, color: "rgba(122,106,80,0.6)", marginTop: 2 }}>{habit.description}</p>}
                <div className="flex items-center gap-3 mt-1.5">
                  {habit.streak > 0 && <span style={{ fontSize: 11, color: "#D4A820", fontWeight: 600 }}>🔥 {habit.streak}-day streak</span>}
                  <span style={{ fontSize: 10, color: "rgba(122,106,80,0.45)" }}>{habit.recent_count}× this week</span>
                  {!habit.completed_today && <span style={{ fontSize: 10, color: "rgba(212,168,32,0.7)" }}>+5 XP</span>}
                </div>
              </div>
              <button onClick={() => deleteHabit(habit.id)} className="btn-ghost p-1.5" style={{ color: "rgba(122,106,80,0.35)" }}>
                <Trash2 style={{ width: 13, height: 13 }} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
