"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, Calendar, X, ChevronDown, ChevronUp, Mail, RefreshCw } from "lucide-react";
import { format, isToday, isPast, parseISO, isTomorrow } from "date-fns";
import { useXP } from "@/contexts/xp-context";

// ── Palette ──────────────────────────────────────────────────────────────────
const C = {
  bg:        "#F7F3EE",
  bgDeep:    "#F0EAE0",
  card:      "#FFFCF8",
  gold:      "#C8973A",
  goldLight: "#E8C97A",
  rose:      "#C4788A",
  roseDust:  "#E8B4C0",
  lavender:  "#9B8EC4",
  lavLight:  "#C8C0E8",
  teal:      "#6A9E98",
  sage:      "#7A9E78",
  ink:       "#3A2E28",
  muted:     "#9A8878",
  border:    "#E4D8CC",
  cream:     "#FFF9F2",
};

// ── Life area categories ──────────────────────────────────────────────────────
const CATEGORIES = [
  { key: "all",        label: "All Stars",   icon: "✦",  color: C.gold,     bg: `${C.gold}18`     },
  { key: "lyra",       label: "Lyra",        icon: "🌙",  color: C.lavender, bg: `${C.lavender}18` },
  { key: "jfs",        label: "JFS",         icon: "⭐",  color: C.teal,     bg: `${C.teal}18`     },
  { key: "caregiving", label: "Caregiving",  icon: "🕯️", color: C.rose,     bg: `${C.rose}18`     },
  { key: "kids",       label: "Kids",        icon: "🌟",  color: C.goldLight,bg: `${C.gold}14`     },
  { key: "home",       label: "Home",        icon: "🌿",  color: C.sage,     bg: `${C.sage}18`     },
  { key: "personal",   label: "Personal",    icon: "🌸",  color: C.roseDust, bg: `${C.rose}14`     },
  { key: "sidequests", label: "Side Quests", icon: "🗺️", color: "#C8A060",  bg: "#C8A06014"       },
  { key: "research",   label: "Research",    icon: "🔭",  color: "#8EA8C8",  bg: "#8EA8C814"       },
  { key: "finances",   label: "Finances",    icon: "🌾",  color: C.sage,     bg: `${C.sage}14`     },
] as const;

type CategoryKey = (typeof CATEGORIES)[number]["key"];

const PRIORITY_COLORS: Record<string, string> = {
  high:   C.rose,
  medium: C.gold,
  low:    C.sage,
};

interface Task {
  id: number; title: string; description: string | null;
  priority: "low" | "medium" | "high"; due_date: string | null;
  completed: boolean; category: string; created_at: string;
}

// ── Star checkbox ─────────────────────────────────────────────────────────────
function StarCheck({ checked, onClick, color }: { checked: boolean; onClick: (e: React.MouseEvent) => void; color: string }) {
  return (
    <button onClick={onClick} style={{
      background: "none", border: "none", cursor: "pointer",
      padding: 2, lineHeight: 1, fontSize: 18, transition: "transform 0.15s",
      transform: checked ? "scale(1.15)" : "scale(1)",
    }}>
      {checked
        ? <span style={{ color, filter: `drop-shadow(0 0 4px ${color}88)` }}>★</span>
        : <span style={{ color: C.border }}>☆</span>
      }
    </button>
  );
}

// ── Sparkle burst on complete ─────────────────────────────────────────────────
function Sparkles({ x, y }: { x: number; y: number }) {
  return (
    <>
      <style>{`
        @keyframes sparkle-fly {
          0%   { transform: translate(0,0) scale(1); opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
        }
      `}</style>
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * 360;
        const dist = 28 + Math.random() * 20;
        const dx = Math.cos((angle * Math.PI) / 180) * dist;
        const dy = Math.sin((angle * Math.PI) / 180) * dist;
        const colors = [C.gold, C.rose, C.lavender, C.teal, C.goldLight];
        return (
          <div key={i} style={{
            position: "fixed", left: x - 6, top: y - 6,
            width: 12, height: 12, pointerEvents: "none", zIndex: 9999,
            fontSize: 11, lineHeight: "12px", textAlign: "center",
            // @ts-expect-error css vars
            "--dx": `${dx}px`, "--dy": `${dy}px`,
            animation: `sparkle-fly 0.6s ease-out ${i * 0.04}s both`,
            color: colors[i % colors.length],
          }}>★</div>
        );
      })}
    </>
  );
}

// ── Due date label ────────────────────────────────────────────────────────────
function DueLabel({ due_date, completed }: { due_date: string; completed: boolean }) {
  const d = parseISO(due_date);
  const overdue = !completed && isPast(d) && !isToday(d);
  const today = isToday(d);
  const tomorrow = isTomorrow(d);
  const color = overdue ? C.rose : today ? C.gold : tomorrow ? C.teal : C.muted;
  const label = overdue ? `Overdue · ${format(d, "MMM d")}` : today ? "Due today" : tomorrow ? "Tomorrow" : format(d, "MMM d");
  return (
    <span style={{ fontSize: 10, color, fontWeight: overdue || today ? 700 : 400, display: "flex", alignItems: "center", gap: 3 }}>
      <Calendar style={{ width: 9, height: 9 }} /> {label}
    </span>
  );
}

// ── Category progress moon ─────────────────────────────────────────────────────
function MoonProgress({ total, done, color }: { total: number; done: number; color: string }) {
  if (total === 0) return null;
  const pct = done / total;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ position: "relative", width: 32, height: 32 }}>
        <svg width="32" height="32" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="13" fill="none" stroke={`${color}22`} strokeWidth="3" />
          <circle cx="16" cy="16" r="13" fill="none" stroke={color} strokeWidth="3"
            strokeDasharray={`${2 * Math.PI * 13}`}
            strokeDashoffset={`${2 * Math.PI * 13 * (1 - pct)}`}
            strokeLinecap="round" transform="rotate(-90 16 16)"
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>
        <span style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 9, fontWeight: 700, color,
        }}>{Math.round(pct * 100)}%</span>
      </div>
      <span style={{ fontSize: 10, color: C.muted }}>{done}/{total} done</span>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", background: C.cream, border: `1.5px solid ${C.border}`,
  borderRadius: 8, padding: "9px 12px", color: C.ink, fontSize: 13,
  fontFamily: "Georgia, serif", outline: "none", boxSizing: "border-box",
};
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
  textTransform: "uppercase", color: C.muted, marginBottom: 5,
  fontFamily: "monospace",
};

export default function TasksPage() {
  const { earnXP } = useXP();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<"active" | "all" | "done">("active");
  const [expandedTask, setExpandedTask] = useState<number | null>(null);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", priority: "medium", due_date: "",
    category: "personal" as string,
  });

  // Gmail sync state — show connect banner by default, hide if confirmed connected
  const [gmailConnected, setGmailConnected] = useState<boolean>(false);
  const [gmailChecked, setGmailChecked] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ tasksCreated: number; emailsScanned: number } | null>(null);
  const [gmailToast, setGmailToast] = useState<string | null>(null);

  const loadTasks = useCallback(() => {
    return fetch("/api/tasks").then((r) => r.json()).then((data) => {
      setTasks(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadTasks();
    // Check Gmail connection status
    fetch("/api/gmail/sync").then((r) => r.json()).then((d) => {
      setGmailConnected(d.connected === true);
      setGmailChecked(true);
    }).catch(() => { setGmailConnected(false); setGmailChecked(true); });

    // Show toast from OAuth redirect
    const params = new URLSearchParams(window.location.search);
    const gmailParam = params.get("gmail");
    if (gmailParam === "connected") {
      setGmailConnected(true);
      setGmailToast("Gmail connected! Running first sync...");
      window.history.replaceState({}, "", "/tasks");
      // Auto-run first sync
      setTimeout(() => syncGmail(), 500);
    } else if (gmailParam === "error") {
      setGmailToast(`Gmail connection failed: ${params.get("reason") ?? "unknown error"}`);
      window.history.replaceState({}, "", "/tasks");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function syncGmail() {
    if (syncing) return;
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch("/api/gmail/sync", { method: "POST" });
      const data = await res.json();
      if (data.needsAuth) {
        setGmailConnected(false);
        return;
      }
      setSyncResult({ tasksCreated: data.tasksCreated, emailsScanned: data.emailsScanned });
      if (data.tasksCreated > 0) await loadTasks();
      setGmailToast(data.tasksCreated > 0
        ? `✦ ${data.tasksCreated} new task${data.tasksCreated > 1 ? "s" : ""} pulled from ${data.emailsScanned} emails`
        : `Scanned ${data.emailsScanned} emails — nothing new to action`
      );
      setTimeout(() => setGmailToast(null), 5000);
    } catch {
      setGmailToast("Sync failed — check your connection");
    } finally {
      setSyncing(false);
    }
  }

  useEffect(() => {
    if (activeCategory !== "all") setForm((f) => ({ ...f, category: activeCategory }));
  }, [activeCategory]);

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    const optimistic: Task = {
      id: Date.now(), title: form.title.trim(), description: form.description || null,
      priority: form.priority as Task["priority"], due_date: form.due_date || null,
      completed: false, category: form.category, created_at: new Date().toISOString(),
    };
    setTasks((prev) => [optimistic, ...prev]);
    setShowForm(false);
    setForm((f) => ({ ...f, title: "", description: "", due_date: "" }));
    try {
      const res = await fetch("/api/tasks", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, title: form.title.trim() }),
      });
      const saved = await res.json();
      if (saved.id) setTasks((prev) => prev.map((t) => t.id === optimistic.id ? saved : t));
    } catch { /* optimistic stands */ }
    setSaving(false);
  }

  async function toggleTask(id: number, completed: boolean, e: React.MouseEvent) {
    const updated = !completed;
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, completed: updated } : t));
    if (updated) {
      setSparkles({ id: Date.now(), x: e.clientX, y: e.clientY });
      setTimeout(() => setSparkles(null), 700);
      earnXP("task_complete", { label: "Task complete", questKey: "complete_tasks", x: e.clientX, y: e.clientY });
    }
    fetch(`/api/tasks/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: updated }),
    }).catch(() => {});
  }

  async function deleteTask(id: number) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    fetch(`/api/tasks/${id}`, { method: "DELETE" }).catch(() => {});
  }

  const catTasks = (key: CategoryKey) =>
    tasks.filter((t) => key === "all" || t.category === key);

  const visibleTasks = catTasks(activeCategory).filter((t) =>
    filter === "active" ? !t.completed : filter === "done" ? t.completed : true
  );

  const activeCat = CATEGORIES.find((c) => c.key === activeCategory)!;
  const totalActive = catTasks(activeCategory).filter((t) => !t.completed).length;
  const totalDone = catTasks(activeCategory).filter((t) => t.completed).length;
  const overdueCount = catTasks(activeCategory).filter(
    (t) => !t.completed && t.due_date && isPast(parseISO(t.due_date)) && !isToday(parseISO(t.due_date))
  ).length;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", margin: "-24px -24px -24px", padding: "0 0 48px", fontFamily: "Georgia, serif" }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {sparkles && <Sparkles x={sparkles.x} y={sparkles.y} />}

      {/* ── Hero banner ── */}
      <div style={{
        background: `linear-gradient(160deg, #2A1F3D 0%, #3D2A1F 40%, #1F2A3D 100%)`,
        padding: "32px 28px 24px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Decorative stars */}
        {[
          { top: 12, left: 60, size: 10, op: 0.4 }, { top: 8, left: 200, size: 7, op: 0.3 },
          { top: 20, left: 340, size: 12, op: 0.5 }, { top: 5, left: 480, size: 8, op: 0.25 },
          { top: 30, left: 600, size: 6, op: 0.35 }, { top: 15, left: 700, size: 10, op: 0.4 },
          { top: 45, left: 150, size: 6, op: 0.2 }, { top: 50, left: 520, size: 7, op: 0.3 },
        ].map((s, i) => (
          <div key={i} style={{
            position: "absolute", top: s.top, left: s.left,
            color: C.goldLight, fontSize: s.size, opacity: s.op, pointerEvents: "none",
          }}>★</div>
        ))}
        {/* Hanging moon */}
        <div style={{
          position: "absolute", top: -8, right: 80, width: 2, height: 60,
          background: `linear-gradient(to bottom, transparent, ${C.goldLight}66)`,
        }} />
        <div style={{
          position: "absolute", top: 52, right: 72, fontSize: 20, color: C.goldLight, opacity: 0.6,
        }}>☽</div>

        <div style={{ position: "relative" }}>
          <p style={{ fontSize: 10, color: `${C.goldLight}99`, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6, fontFamily: "monospace" }}>
            ✦ LIFE COMMAND CENTER ✦
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 400, color: "#FFF8EE", lineHeight: 1.2, margin: 0 }}>
            To-Do Constellation
          </h1>
          <p style={{ fontSize: 12, color: `${C.goldLight}88`, marginTop: 6 }}>
            {tasks.filter((t) => !t.completed).length} tasks across all areas of life
            {overdueCount > 0 && <span style={{ color: C.roseDust }}> · {overdueCount} overdue</span>}
          </p>
        </div>
      </div>

      <div style={{ padding: "0 24px" }}>

        {/* ── Gmail toast ── */}
        {gmailToast && (
          <div style={{
            position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
            background: C.ink, color: "#FFF9F2", borderRadius: 10, padding: "10px 20px",
            fontSize: 12, fontFamily: "monospace", zIndex: 9999, whiteSpace: "nowrap",
            boxShadow: "0 4px 20px rgba(58,46,40,0.3)",
          }}>
            {gmailToast}
          </div>
        )}

        {/* ── Gmail connection banner ── */}
        {gmailChecked && !gmailConnected && (
          <div style={{
            marginTop: 16, padding: "12px 16px",
            background: `${C.lavender}14`, border: `1.5px solid ${C.lavender}44`,
            borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Mail style={{ width: 16, height: 16, color: C.lavender }} />
              <p style={{ fontSize: 12, color: C.ink, margin: 0 }}>
                Connect Gmail to pull tasks automatically from your inbox
              </p>
            </div>
            <a href="/api/gmail/auth" style={{
              background: `linear-gradient(135deg, ${C.lavender}, #7A6AAA)`,
              border: "none", borderRadius: 16, padding: "7px 16px",
              color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer",
              fontFamily: "monospace", letterSpacing: "0.06em", textDecoration: "none",
              whiteSpace: "nowrap",
            }}>
              🌙 CONNECT GMAIL
            </a>
          </div>
        )}

        {/* ── Gmail sync bar (when connected) ── */}
        {gmailChecked && gmailConnected && (
          <div style={{
            marginTop: 16, padding: "10px 16px",
            background: `${C.sage}12`, border: `1.5px solid ${C.sage}33`,
            borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Mail style={{ width: 14, height: 14, color: C.sage }} />
              <p style={{ fontSize: 11, color: C.muted, margin: 0, fontFamily: "monospace" }}>
                Gmail connected
                {syncResult && ` · Last sync: ${syncResult.tasksCreated} tasks from ${syncResult.emailsScanned} emails`}
              </p>
            </div>
            <button onClick={syncGmail} disabled={syncing} style={{
              background: "none", border: `1.5px solid ${C.sage}55`,
              borderRadius: 16, padding: "5px 14px", color: C.sage,
              fontSize: 11, fontWeight: 700, cursor: syncing ? "default" : "pointer",
              fontFamily: "monospace", display: "flex", alignItems: "center", gap: 5,
            }}>
              <RefreshCw style={{ width: 11, height: 11, animation: syncing ? "spin 1s linear infinite" : "none" }} />
              {syncing ? "SYNCING..." : "SYNC NOW"}
            </button>
          </div>
        )}

        {/* ── Category tabs ── */}
        <div style={{ marginTop: 20, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
          <div style={{ display: "flex", gap: 8, minWidth: "max-content" }}>
            {CATEGORIES.map((cat) => {
              const catActive = tasks.filter((t) => (cat.key === "all" || t.category === cat.key) && !t.completed).length;
              const isActive = activeCategory === cat.key;
              return (
                <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "8px 14px", borderRadius: 20, cursor: "pointer",
                    border: `1.5px solid ${isActive ? cat.color : C.border}`,
                    background: isActive ? cat.bg : C.card,
                    color: isActive ? cat.color : C.muted,
                    fontSize: 12, fontFamily: "monospace", fontWeight: isActive ? 700 : 400,
                    transition: "all 0.15s",
                    boxShadow: isActive ? `0 2px 12px ${cat.color}22` : "none",
                  }}>
                  <span style={{ fontSize: 14 }}>{cat.icon}</span>
                  {cat.label}
                  {catActive > 0 && (
                    <span style={{
                      fontSize: 9, background: isActive ? cat.color : C.border,
                      color: isActive ? "#fff" : C.muted,
                      borderRadius: 10, padding: "1px 6px", fontWeight: 700,
                    }}>{catActive}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Section header ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 22 }}>{activeCat.icon}</span>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 400, color: C.ink, margin: 0 }}>{activeCat.label}</h2>
              <MoonProgress
                total={catTasks(activeCategory).length}
                done={totalDone}
                color={activeCat.color}
              />
            </div>
          </div>
          <button onClick={() => setShowForm(true)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: `linear-gradient(135deg, ${C.gold}, #A87830)`,
              border: "none", borderRadius: 20, padding: "9px 18px",
              color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer",
              fontFamily: "monospace", letterSpacing: "0.06em",
              boxShadow: `0 2px 12px ${C.gold}44`,
            }}>
            <Plus style={{ width: 13, height: 13 }} />
            ADD TASK
          </button>
        </div>

        {/* ── Add task form ── */}
        {showForm && (
          <div style={{
            background: C.card, border: `1.5px solid ${C.border}`,
            borderRadius: 14, padding: "20px 20px", marginBottom: 20,
            boxShadow: `0 4px 24px rgba(58,46,40,0.08)`,
            position: "relative",
          }}>
            {/* Decorative corner */}
            <div style={{ position: "absolute", top: 12, right: 16, fontSize: 16, color: C.gold, opacity: 0.4 }}>✦</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <p style={{ fontSize: 14, color: C.ink, fontWeight: 400 }}>New constellation point</p>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, padding: 2 }}>
                <X style={{ width: 15, height: 15 }} />
              </button>
            </div>
            <form onSubmit={addTask} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={labelStyle}>Task</label>
                <input autoFocus style={inputStyle} placeholder="What needs doing?" value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle}>Notes (optional)</label>
                <textarea style={{ ...inputStyle, resize: "vertical" }} rows={2}
                  placeholder="Any details, context, or reminders..."
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <div>
                  <label style={labelStyle}>Area</label>
                  <select style={inputStyle} value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.filter((c) => c.key !== "all").map((c) => (
                      <option key={c.key} value={c.key}>{c.icon} {c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Priority</label>
                  <select style={inputStyle} value={form.priority}
                    onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}>
                    <option value="high">⬆ High</option>
                    <option value="medium">→ Medium</option>
                    <option value="low">⬇ Low</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Due date</label>
                  <input type="date" style={inputStyle} value={form.due_date}
                    onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, paddingTop: 4 }}>
                <button type="submit" disabled={saving || !form.title.trim()} style={{
                  flex: 1, background: `linear-gradient(135deg, ${C.gold}, #A87830)`,
                  border: "none", borderRadius: 10, padding: "11px 0",
                  color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer",
                  fontFamily: "monospace", letterSpacing: "0.06em",
                  boxShadow: `0 2px 10px ${C.gold}44`,
                }}>
                  {saving ? "Adding..." : "✦ ADD TO CONSTELLATION"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={{
                  background: "none", border: `1.5px solid ${C.border}`,
                  borderRadius: 10, padding: "11px 16px",
                  color: C.muted, fontSize: 12, cursor: "pointer",
                }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Filter pills ── */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {(["active", "all", "done"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: "5px 14px", borderRadius: 14, fontSize: 11, cursor: "pointer",
                fontFamily: "monospace", fontWeight: filter === f ? 700 : 400,
                border: `1.5px solid ${filter === f ? activeCat.color : C.border}`,
                background: filter === f ? `${activeCat.color}18` : "transparent",
                color: filter === f ? activeCat.color : C.muted,
                transition: "all 0.15s",
              }}>
              {f === "active" ? `☽ Active (${totalActive})` : f === "done" ? `★ Done (${totalDone})` : "✦ All"}
            </button>
          ))}
        </div>

        {/* ── Task list ── */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[1,2,3].map((i) => (
              <div key={i} style={{ height: 68, borderRadius: 12, background: `${C.gold}08`, border: `1px solid ${C.border}`, animation: "pulse 1.5s infinite" }} />
            ))}
          </div>
        ) : visibleTasks.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "48px 20px",
            border: `1.5px dashed ${C.border}`, borderRadius: 14, background: C.card,
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>✦</div>
            <p style={{ fontSize: 14, color: C.ink, marginBottom: 6 }}>
              {filter === "done" ? "No completed tasks yet" : "This area is clear"}
            </p>
            <p style={{ fontSize: 12, color: C.muted, fontStyle: "italic" }}>
              {filter === "active" ? "Add a task to get started" : ""}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {visibleTasks.map((task) => {
              const cat = CATEGORIES.find((c) => c.key === task.category) ?? CATEGORIES[6];
              const isExpanded = expandedTask === task.id;
              const overdue = !task.completed && task.due_date && isPast(parseISO(task.due_date)) && !isToday(parseISO(task.due_date));

              return (
                <div key={task.id} style={{
                  background: task.completed ? `${C.bg}` : C.card,
                  border: `1.5px solid ${overdue ? `${C.rose}55` : task.completed ? C.border : C.border}`,
                  borderLeft: `3.5px solid ${task.completed ? C.sage : cat.color}`,
                  borderRadius: 12, padding: "14px 16px",
                  opacity: task.completed ? 0.65 : 1,
                  transition: "all 0.2s",
                  boxShadow: overdue ? `0 2px 12px ${C.rose}18` : "none",
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <StarCheck
                      checked={task.completed}
                      onClick={(e) => toggleTask(task.id, task.completed, e)}
                      color={cat.color}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: 14, color: task.completed ? C.muted : C.ink, margin: 0,
                        textDecoration: task.completed ? "line-through" : "none",
                        lineHeight: 1.4,
                      }}>{task.title}</p>

                      {/* Meta row */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                        {/* Category badge */}
                        <span style={{
                          fontSize: 9, fontFamily: "monospace", fontWeight: 700,
                          color: cat.color, background: cat.bg,
                          border: `1px solid ${cat.color}33`,
                          borderRadius: 8, padding: "2px 7px", letterSpacing: "0.08em",
                        }}>
                          {cat.icon} {cat.label.toUpperCase()}
                        </span>
                        {/* Priority dot */}
                        <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: PRIORITY_COLORS[task.priority] }}>
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: PRIORITY_COLORS[task.priority], display: "inline-block" }} />
                          {task.priority}
                        </span>
                        {/* Due date */}
                        {task.due_date && <DueLabel due_date={task.due_date} completed={task.completed} />}
                        {/* XP pill */}
                        {!task.completed && (
                          <span style={{ fontSize: 9, color: C.goldLight, fontFamily: "monospace" }}>+10 XP</span>
                        )}
                      </div>

                      {/* Notes (expandable) */}
                      {task.description && (
                        <>
                          {isExpanded && (
                            <p style={{ fontSize: 12, color: C.muted, marginTop: 8, fontStyle: "italic", lineHeight: 1.5 }}>
                              {task.description}
                            </p>
                          )}
                          <button onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                            style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, padding: "4px 0 0", display: "flex", alignItems: "center", gap: 3, fontSize: 10 }}>
                            {isExpanded ? <ChevronUp style={{ width: 10, height: 10 }} /> : <ChevronDown style={{ width: 10, height: 10 }} />}
                            {isExpanded ? "hide notes" : "see notes"}
                          </button>
                        </>
                      )}
                    </div>

                    <button onClick={() => deleteTask(task.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: `${C.muted}55`, padding: 4, flexShrink: 0 }}>
                      <Trash2 style={{ width: 13, height: 13 }} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Overdue callout ── */}
        {overdueCount > 0 && filter === "active" && (
          <div style={{
            marginTop: 20, padding: "12px 16px",
            background: `${C.rose}12`, border: `1.5px solid ${C.rose}44`,
            borderRadius: 10, display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontSize: 16 }}>🕯️</span>
            <p style={{ fontSize: 12, color: C.rose, margin: 0 }}>
              <strong>{overdueCount} overdue {overdueCount === 1 ? "task" : "tasks"}</strong>
              {activeCategory === "all" ? " across your lists" : ` in ${activeCat.label}`}
              {" "}- the stars are waiting.
            </p>
          </div>
        )}

        {/* ── Footer ── */}
        <div style={{ marginTop: 40, textAlign: "center" }}>
          <p style={{ fontSize: 10, color: `${C.muted}66`, letterSpacing: "0.15em", fontFamily: "monospace" }}>
            ✦ · ☽ · ✦ · ☽ · ✦
          </p>
        </div>

      </div>
    </div>
  );
}
