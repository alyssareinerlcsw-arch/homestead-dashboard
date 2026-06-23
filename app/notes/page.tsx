"use client";

import { useEffect, useState, useRef } from "react";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useXP } from "@/contexts/xp-context";

interface Note { id: number; title: string; content: string; created_at: string; updated_at: string; }

const STICKER_COLORS = [
  { bg: "#FF1493", border: "#FF69B4", text: "#fff" },
  { bg: "#8B00FF", border: "#DA70D6", text: "#fff" },
  { bg: "#00CED1", border: "#7FFFD4", text: "#fff" },
  { bg: "#FF6347", border: "#FFA07A", text: "#fff" },
  { bg: "#32CD32", border: "#98FB98", text: "#fff" },
  { bg: "#FF8C00", border: "#FFD700", text: "#fff" },
  { bg: "#4169E1", border: "#87CEEB", text: "#fff" },
  { bg: "#FF00FF", border: "#FFB6C1", text: "#fff" },
];

const MASCOTS = ["🐱", "👽", "🦄", "🐬", "🌈", "⭐", "🎀", "🦋", "🐾", "💫"];

function FloatingMascot({ emoji, style }: { emoji: string; style: React.CSSProperties }) {
  return (
    <span style={{
      position: "absolute", fontSize: 22, pointerEvents: "none",
      animation: "lfloat 3s ease-in-out infinite",
      ...style,
    }}>
      {emoji}
    </span>
  );
}

export default function NotesPage() {
  const { earnXP } = useXP();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Note | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/notes").then((r) => r.json()).then((data) => { setNotes(data); setLoading(false); });
  }, []);

  function selectNote(note: Note) {
    setSelected(note); setEditTitle(note.title); setEditContent(note.content); setDirty(false);
  }

  function handleEdit(title: string, content: string) {
    setEditTitle(title); setEditContent(content); setDirty(true);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveNote(title, content), 1500);
  }

  async function saveNote(title: string, content: string) {
    if (!selected) return;
    setSaving(true);
    await fetch(`/api/notes/${selected.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, content }),
    });
    setNotes((prev) => prev.map((n) => n.id === selected.id ? { ...n, title, content, updated_at: new Date().toISOString() } : n));
    setDirty(false); setSaving(false);
  }

  async function createNote() {
    const res = await fetch("/api/notes", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "New note ✨", content: "" }),
    });
    const note = await res.json();
    setNotes((prev) => [note, ...prev]);
    selectNote(note);
    earnXP("note_create", { label: "New note", questKey: "write_note" });
  }

  async function deleteNote(id: number) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selected?.id === id) setSelected(null);
    await fetch(`/api/notes/${id}`, { method: "DELETE" });
  }

  return (
    <div style={{ margin: "-24px -24px -24px", minHeight: "100vh", position: "relative", overflow: "hidden" }}>

      <style>{`
        @keyframes lfloat {
          0%, 100% { transform: translateY(0px) rotate(-3deg); }
          50% { transform: translateY(-8px) rotate(3deg); }
        }
        @keyframes rainbow-bg {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes sparkle-spin {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
          50% { transform: scale(1.3) rotate(180deg); opacity: 0.7; }
        }
        @keyframes rainbow-text {
          0%   { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
        .lisa-btn:hover { transform: scale(1.05); filter: brightness(1.1); }
        .note-sticker:hover { transform: scale(1.02) rotate(0.5deg); }
        .hole-punch {
          width: 18px; height: 18px; border-radius: 50%;
          background: white; border: 2px solid #e0e0e0;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.15);
          flex-shrink: 0;
        }
      `}</style>

      {/* Animated rainbow background */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        background: "linear-gradient(-45deg, #FF1493, #8B00FF, #00CED1, #FF6347, #39FF14, #FF00FF, #FFD700, #4169E1)",
        backgroundSize: "400% 400%",
        animation: "rainbow-bg 8s ease infinite",
      }} />

      {/* Sparkle overlay */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }}>
        <FloatingMascot emoji="⭐" style={{ top: "8%", left: "3%", animationDelay: "0s" }} />
        <FloatingMascot emoji="💫" style={{ top: "15%", right: "4%", animationDelay: "0.5s" }} />
        <FloatingMascot emoji="🌈" style={{ top: "5%", left: "45%", animationDelay: "1s", fontSize: 28 }} />
        <FloatingMascot emoji="⭐" style={{ bottom: "12%", left: "6%", animationDelay: "1.5s" }} />
        <FloatingMascot emoji="💫" style={{ bottom: "8%", right: "3%", animationDelay: "2s" }} />
        <FloatingMascot emoji="✨" style={{ top: "40%", right: "1%", animationDelay: "0.8s" }} />
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, padding: "20px 20px 40px" }}>

        {/* ── Trapper Keeper Header ── */}
        <div style={{
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(10px)",
          borderRadius: 16,
          border: "3px solid rgba(255,255,255,0.4)",
          padding: "16px 24px",
          marginBottom: 16,
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Holographic shimmer strip */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 4,
            background: "linear-gradient(90deg, #FF1493, #8B00FF, #00CED1, #FFD700, #FF1493)",
            backgroundSize: "200% auto",
            animation: "shimmer 2s linear infinite",
          }} />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 36, animation: "sparkle-spin 3s ease-in-out infinite" }}>🐱</span>
              <div>
                <h1 style={{
                  fontSize: 26, fontWeight: 900, letterSpacing: "0.02em",
                  background: "linear-gradient(90deg, #FF1493, #8B00FF, #00CED1, #FFD700)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  textShadow: "none",
                  fontFamily: "system-ui, sans-serif",
                }}>
                  ✨ MY TRAPPER KEEPER ✨
                </h1>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.9)", marginTop: 2, letterSpacing: "0.1em", fontWeight: 700 }}>
                  🌈 {notes.length} TOTALLY RAD NOTES 🌈
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 24, animation: "lfloat 2s ease-in-out infinite", animationDelay: "0.3s" }}>👽</span>
              <span style={{ fontSize: 24, animation: "lfloat 2s ease-in-out infinite", animationDelay: "0.6s" }}>🦄</span>
              <span style={{ fontSize: 24, animation: "lfloat 2s ease-in-out infinite", animationDelay: "0.9s" }}>🐬</span>
              <button onClick={createNote} className="lisa-btn" style={{
                marginLeft: 8,
                background: "linear-gradient(135deg, #FF1493, #8B00FF)",
                border: "3px solid rgba(255,255,255,0.5)",
                borderRadius: 12, padding: "8px 18px",
                color: "#fff", fontSize: 12, fontWeight: 900,
                cursor: "pointer", letterSpacing: "0.08em",
                boxShadow: "0 4px 15px rgba(255,20,147,0.4)",
                transition: "transform 0.15s, filter 0.15s",
              }}>
                + NEW NOTE 🎀
              </button>
            </div>
          </div>
        </div>

        {/* ── Main Trapper Keeper Body ── */}
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 16, alignItems: "start" }}>

          {/* ── Left: Sticker Tab List ── */}
          <div style={{
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(12px)",
            borderRadius: 16,
            border: "3px solid rgba(255,255,255,0.35)",
            padding: 12,
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          }}>
            <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.18em", color: "rgba(255,255,255,0.9)", textAlign: "center", marginBottom: 10, fontFamily: "monospace" }}>
              📌 MY NOTES 📌
            </p>

            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[1,2,3].map((i) => (
                  <div key={i} style={{ height: 64, borderRadius: 10, background: "rgba(255,255,255,0.2)", animation: "sparkle-spin 1.5s ease-in-out infinite" }} />
                ))}
              </div>
            ) : notes.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px 10px" }}>
                <span style={{ fontSize: 32 }}>🐾</span>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", marginTop: 8, fontWeight: 700 }}>No notes yet bestie!</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {notes.map((note, i) => {
                  const color = STICKER_COLORS[i % STICKER_COLORS.length];
                  const mascot = MASCOTS[i % MASCOTS.length];
                  const isSelected = selected?.id === note.id;
                  return (
                    <div key={note.id} onClick={() => selectNote(note)} className="note-sticker"
                      style={{
                        background: isSelected ? color.bg : `${color.bg}CC`,
                        border: `3px solid ${isSelected ? "#fff" : color.border}`,
                        borderRadius: 10, padding: "8px 10px", cursor: "pointer",
                        transition: "transform 0.15s",
                        boxShadow: isSelected ? `0 4px 20px ${color.bg}88, 0 0 0 3px rgba(255,255,255,0.4)` : `0 2px 8px ${color.bg}44`,
                      }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0 }}>
                          <span style={{ fontSize: 14, flexShrink: 0 }}>{mascot}</span>
                          <p style={{
                            fontSize: 12, fontWeight: 900, color: color.text,
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                            textShadow: "0 1px 3px rgba(0,0,0,0.3)",
                          }}>
                            {note.title || "Untitled"}
                          </p>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                          style={{ background: "rgba(0,0,0,0.2)", border: "none", borderRadius: 6, padding: "2px 5px", cursor: "pointer", color: "#fff", flexShrink: 0 }}>
                          <Trash2 style={{ width: 10, height: 10 }} />
                        </button>
                      </div>
                      <p style={{ fontSize: 9, color: "rgba(255,255,255,0.8)", marginTop: 3, marginLeft: 20 }}>
                        {format(new Date(note.updated_at), "MMM d, h:mm a")}
                      </p>
                      {note.content && (
                        <p style={{
                          fontSize: 10, color: "rgba(255,255,255,0.75)", marginTop: 4, marginLeft: 20,
                          overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                          lineHeight: 1.4,
                        }}>
                          {note.content}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Right: Notebook Paper Editor ── */}
          <div style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: 16,
            border: "4px solid rgba(255,255,255,0.8)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,1)",
            overflow: "hidden",
            minHeight: 520,
          }}>
            {/* Rainbow top strip */}
            <div style={{
              height: 8,
              background: "linear-gradient(90deg, #FF1493, #FF6347, #FFD700, #32CD32, #00CED1, #4169E1, #8B00FF, #FF00FF)",
            }} />

            {selected ? (
              <div style={{ display: "flex", minHeight: 520 }}>
                {/* Hole punches + margin */}
                <div style={{
                  width: 42, background: "#FFF5F8",
                  borderRight: "3px solid #FF69B488",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", paddingTop: 28, gap: 60,
                  flexShrink: 0,
                }}>
                  {[0,1,2].map((i) => <div key={i} className="hole-punch" />)}
                </div>

                {/* Writing area */}
                <div style={{ flex: 1, padding: "16px 20px", position: "relative" }}>
                  {/* Notebook lines via background */}
                  <div style={{
                    position: "absolute", inset: 0,
                    backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #c8d8ff 31px, #c8d8ff 32px)",
                    backgroundPosition: "0 48px",
                    pointerEvents: "none",
                  }} />

                  {/* Auto-save badge */}
                  <div style={{ position: "absolute", top: 12, right: 16, zIndex: 2 }}>
                    {saving && (
                      <span style={{
                        fontSize: 9, fontWeight: 900, padding: "3px 8px", borderRadius: 20,
                        background: "#8B00FF", color: "#fff", letterSpacing: "0.1em",
                      }}>💾 SAVING...</span>
                    )}
                    {!dirty && !saving && selected && (
                      <span style={{
                        fontSize: 9, fontWeight: 900, padding: "3px 8px", borderRadius: 20,
                        background: "#32CD32", color: "#fff", letterSpacing: "0.1em",
                      }}>✅ SAVED!</span>
                    )}
                  </div>

                  {/* Title input */}
                  <input
                    value={editTitle}
                    onChange={(e) => handleEdit(e.target.value, editContent)}
                    style={{
                      width: "100%", border: "none", outline: "none",
                      fontSize: 20, fontWeight: 900,
                      background: "transparent", position: "relative", zIndex: 1,
                      marginBottom: 16,
                      background: "linear-gradient(90deg, #FF1493, #8B00FF, #00CED1)",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      fontFamily: "system-ui, sans-serif",
                    } as React.CSSProperties}
                    placeholder="Note title... ✨"
                  />

                  {/* Content textarea */}
                  <textarea
                    value={editContent}
                    onChange={(e) => handleEdit(editTitle, e.target.value)}
                    style={{
                      width: "100%", border: "none", outline: "none", resize: "none",
                      background: "transparent", position: "relative", zIndex: 1,
                      fontSize: 14, color: "#333", lineHeight: "32px",
                      minHeight: 400, fontFamily: "Georgia, serif",
                    }}
                    placeholder="Start writing your totally radical thoughts here... 🌈"
                  />
                </div>
              </div>
            ) : (
              <div style={{ minHeight: 520, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 40 }}>
                <div style={{ display: "flex", gap: 12, fontSize: 36 }}>
                  <span style={{ animation: "lfloat 2s ease-in-out infinite", animationDelay: "0s" }}>🐱</span>
                  <span style={{ animation: "lfloat 2s ease-in-out infinite", animationDelay: "0.4s" }}>👽</span>
                  <span style={{ animation: "lfloat 2s ease-in-out infinite", animationDelay: "0.8s" }}>🦄</span>
                </div>
                <p style={{
                  fontSize: 16, fontWeight: 900, fontFamily: "system-ui",
                  background: "linear-gradient(90deg, #FF1493, #8B00FF, #00CED1)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>
                  Pick a note or make a new one! ✨
                </p>
                <p style={{ fontSize: 12, color: "#999", fontFamily: "Georgia, serif", fontStyle: "italic" }}>
                  Your thoughts are totally radical 🌈
                </p>
              </div>
            )}

            {/* Rainbow bottom strip */}
            <div style={{
              height: 6,
              background: "linear-gradient(90deg, #FF00FF, #8B00FF, #4169E1, #00CED1, #32CD32, #FFD700, #FF6347, #FF1493)",
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}
