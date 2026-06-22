"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { format, parseISO, differenceInDays } from "date-fns";
import { useXP } from "@/contexts/xp-context";
import { IconBadge } from "@/components/decorations";

interface Goal {
  id: number; title: string; description: string | null; category: string;
  target_date: string | null; progress: number; status: string; created_at: string;
}

const CATEGORIES = ["health", "fitness", "career", "personal", "financial", "creative", "learning", "other"];
const CAT_COLORS: Record<string, string> = {
  health: "#E8607A", fitness: "#5A8240", career: "#6B8E9E", personal: "#D4A820",
  financial: "#7B9E6B", creative: "#8B6245", learning: "#9E7BAF", other: "#A08060",
};

export default function GoalsPage() {
  const { earnXP } = useXP();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", description: "", category: "personal", target_date: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/goals").then((r) => r.json()).then(setGoals).finally(() => setLoading(false));
  }, []);

  async function addGoal(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    const res = await fetch("/api/goals", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const goal = await res.json();
    setGoals((prev) => [goal, ...prev]);
    setForm({ title: "", description: "", category: "personal", target_date: "" });
    setShowForm(false);
    setSaving(false);
    earnXP("goal_update", { label: "Goal set", questKey: "update_goal" });
  }

  async function updateProgress(id: number, progress: number) {
    setGoals((prev) => prev.map((g) => g.id === id ? { ...g, progress } : g));
    await fetch(`/api/goals/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ progress }) });
    earnXP("goal_update", { label: "Progress updated", questKey: "update_goal" });
  }

  async function updateStatus(id: number, status: string) {
    setGoals((prev) => prev.map((g) => g.id === id ? { ...g, status } : g));
    await fetch(`/api/goals/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
  }

  async function deleteGoal(id: number) {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    await fetch(`/api/goals/${id}`, { method: "DELETE" });
  }

  const activeGoals = goals.filter((g) => g.status === "active");
  const completedGoals = goals.filter((g) => g.status === "completed");

  return (
    <div className="space-y-6">
      <div className="page-header flex items-start justify-between">
        <div className="flex items-center gap-3">
          <IconBadge emoji="🎯" size={48} bg="rgba(128,152,176,0.13)" border="rgba(128,152,176,0.2)" />
          <div>
            <h1 className="section-title" style={{ fontSize: 24 }}>My Goals</h1>
            <p className="section-subtitle">{activeGoals.length} active · {completedGoals.length} completed · +5 XP per update</p>
          </div>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary"><Plus className="w-4 h-4" />Add goal</button>
      </div>

      {showForm && (
        <form onSubmit={addGoal} className="card space-y-3">
          <h3 style={{ fontFamily: "Georgia", fontSize: 14, color: "#3A2810" }}>New goal</h3>
          <div>
            <label className="label">Goal</label>
            <input className="input" placeholder="What do you want to achieve?" value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} autoFocus />
          </div>
          <div>
            <label className="label">Details (optional)</label>
            <textarea className="input" rows={2} placeholder="Why does this matter to you?"
              value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Category</label>
              <select className="input" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Target date (optional)</label>
              <input type="date" className="input" value={form.target_date} onChange={(e) => setForm((f) => ({ ...f, target_date: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="submit" className="btn-primary" disabled={saving || !form.title.trim()}>{saving ? "Saving..." : "Add goal"}</button>
            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-3">{[1,2].map((i) => <div key={i} className="rounded-2xl animate-pulse" style={{ height: 120, background: "rgba(117,160,83,0.07)" }} />)}</div>
      ) : goals.length === 0 ? (
        <div className="card text-center py-12">
          <div className="flex justify-center mb-3"><IconBadge emoji="🎯" size={48} bg="rgba(128,152,176,0.13)" border="rgba(128,152,176,0.2)" /></div>
          <p style={{ fontFamily: "Georgia", color: "rgba(122,106,80,0.55)", fontStyle: "italic" }}>No goals yet — what do you want to achieve?</p>
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => {
            const color = CAT_COLORS[goal.category] || "#A08060";
            const daysLeft = goal.target_date ? differenceInDays(parseISO(goal.target_date), new Date()) : null;
            const isExpanded = expanded === goal.id;
            return (
              <div key={goal.id} className="card" style={{ borderLeft: `3px solid ${color}` }}>
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span style={{ fontSize: 10, fontWeight: 600, color, textTransform: "capitalize", background: `${color}18`, borderRadius: 4, padding: "2px 6px" }}>{goal.category}</span>
                      <span style={{ fontSize: 10, color: goal.status === "completed" ? "#5A8240" : "rgba(122,106,80,0.45)", fontWeight: goal.status === "completed" ? 600 : 400 }}>
                        {goal.status === "completed" ? "✓ Completed" : goal.status}
                      </span>
                      {daysLeft !== null && goal.status === "active" && (
                        <span style={{ fontSize: 10, color: daysLeft < 0 ? "#8B3A2A" : daysLeft < 7 ? "#D4A820" : "rgba(122,106,80,0.45)" }}>
                          {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? "Due today" : `${daysLeft}d left`}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 14, fontFamily: "Georgia", color: "#3A2810" }}>{goal.title}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="hp-bar-track flex-1" style={{ background: "rgba(0,0,0,0.07)" }}>
                        <div className="hp-bar-fill" style={{ width: `${goal.progress}%`, background: `linear-gradient(90deg, ${color}, ${color}AA)` }} />
                      </div>
                      <span style={{ fontSize: 11, color, fontWeight: 600, minWidth: 32 }}>{goal.progress}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => setExpanded(isExpanded ? null : goal.id)} className="btn-ghost p-1.5" style={{ color: "rgba(122,106,80,0.4)" }}>
                      {isExpanded ? <ChevronUp style={{ width: 14, height: 14 }} /> : <ChevronDown style={{ width: 14, height: 14 }} />}
                    </button>
                    <button onClick={() => deleteGoal(goal.id)} className="btn-ghost p-1.5" style={{ color: "rgba(122,106,80,0.35)" }}>
                      <Trash2 style={{ width: 13, height: 13 }} />
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 space-y-3" style={{ borderTop: "1px solid rgba(117,160,83,0.12)" }}>
                    {goal.description && <p style={{ fontSize: 13, color: "rgba(122,106,80,0.7)", fontFamily: "Georgia", fontStyle: "italic" }}>{goal.description}</p>}
                    <div>
                      <label className="label">Progress: {goal.progress}%</label>
                      <input type="range" min={0} max={100} value={goal.progress}
                        onChange={(e) => updateProgress(goal.id, Number(e.target.value))}
                        className="w-full mt-1" style={{ accentColor: color }} />
                      <div className="flex justify-between mt-1">
                        {[0, 25, 50, 75, 100].map((v) => (
                          <button key={v} onClick={() => updateProgress(goal.id, v)}
                            style={{ fontSize: 10, color: goal.progress === v ? color : "rgba(122,106,80,0.4)", fontWeight: goal.progress === v ? 700 : 400 }}>{v}%</button>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {["active", "paused", "completed"].map((s) => (
                        <button key={s} onClick={() => updateStatus(goal.id, s)}
                          className={goal.status === s ? "btn-primary" : "btn-secondary"}
                          style={{ fontSize: 11, padding: "4px 10px", ...(goal.status === s ? { background: color, boxShadow: `0 2px 0 ${color}88` } : {}) }}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                      ))}
                    </div>
                    {goal.target_date && (
                      <p style={{ fontSize: 11, color: "rgba(122,106,80,0.5)" }}>Target: {format(parseISO(goal.target_date), "MMMM d, yyyy")}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
