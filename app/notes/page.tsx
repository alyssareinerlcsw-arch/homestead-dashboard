"use client";

import { useEffect, useState, useRef } from "react";
import { Trash2, Plus } from "lucide-react";
import { format } from "date-fns";
import { useXP } from "@/contexts/xp-context";

interface Note { id: number; title: string; content: string; created_at: string; updated_at: string; }

const STICKER_COLORS = [
  { bg: "#FF1493", border: "#FF69B4" },
  { bg: "#8B00FF", border: "#DA70D6" },
  { bg: "#00CED1", border: "#7FFFD4" },
  { bg: "#FF6347", border: "#FFA07A" },
  { bg: "#32CD32", border: "#98FB98" },
  { bg: "#FF8C00", border: "#FFD700" },
  { bg: "#4169E1", border: "#87CEEB" },
  { bg: "#FF00FF", border: "#FFB6C1" },
];

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
    <div style={{ margin: "-24px -24px -24px", minHeight: "100vh", position: "relative", fontFamily: "system-ui, sans-serif" }}>

      <style>{`
        @keyframes lfloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes shimmer-strip {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .note-tab:hover { filter: brightness(1.1); transform: translateX(3px); }
        .lisa-btn:hover { filter: brightness(1.15); transform: scale(1.04); }
      `}</style>

      {/* ── Page background: space scene ── */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: "url('/lisa-frank/download (1).png')",
        backgroundSize: "cover", backgroundPosition: "center",
      }} />
      {/* Dark overlay for readability */}
      <div style={{ position: "fixed", inset: 0, zIndex: 1, background: "rgba(20, 0, 40, 0.55)" }} />

      {/* ── Content ── */}
      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", minHeight: "100vh" }}>

        {/* ── Header: dolphins banner ── */}
        <div style={{ position: "relative", height: 160, overflow: "hidden", flexShrink: 0 }}>
          <img src="/lisa-frank/sticker2.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }} />
          {/* Gradient fade at bottom */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(20,0,40,0.7) 100%)" }} />
          {/* Rainbow shimmer strip at very top */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 5,
            background: "linear-gradient(90deg, #FF1493, #FF6347, #FFD700, #32CD32, #00CED1, #4169E1, #8B00FF, #FF1493)",
            backgroundSize: "200% auto", animation: "shimmer-strip 3s linear infinite",
          }} />
          {/* Title overlaid */}
          <div style={{ position: "absolute", bottom: 14, left: 0, right: 0, textAlign: "center" }}>
            <h1 style={{
              fontSize: 28, fontWeight: 900, letterSpacing: "0.04em",
              background: "linear-gradient(90deg, #FF1493, #FFD700, #00CED1, #FF1493)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              textShadow: "none", margin: 0,
              filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.8))",
            }}>
              ✨ MY TRAPPER KEEPER ✨
            </h1>
          </div>
          {/* Pig sticker - top right corner */}
          <img src="/lisa-frank/sticker4.jpg" alt="" style={{
            position: "absolute", top: -10, right: -10, width: 130, height: 130,
            objectFit: "cover", borderRadius: "50%",
            border: "4px solid rgba(255,255,255,0.4)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            animation: "lfloat 4s ease-in-out infinite",
          }} />
        </div>

        {/* ── Toolbar ── */}
        <div style={{
          background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)",
          borderBottom: "2px solid rgba(255,255,255,0.15)",
          padding: "10px 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", letterSpacing: "0.12em", fontWeight: 700 }}>
            🌈 {notes.length} TOTALLY RAD NOTE{notes.length !== 1 ? "S" : ""}
          </p>
          <button onClick={createNote} className="lisa-btn" style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "linear-gradient(135deg, #FF1493, #8B00FF)",
            border: "2px solid rgba(255,255,255,0.35)",
            borderRadius: 20, padding: "7px 16px",
            color: "#fff", fontSize: 11, fontWeight: 900,
            cursor: "pointer", letterSpacing: "0.08em",
            boxShadow: "0 4px 15px rgba(255,20,147,0.5)",
            transition: "transform 0.15s, filter 0.15s",
          }}>
            <Plus style={{ width: 12, height: 12 }} /> NEW NOTE 🎀
          </button>
        </div>

        {/* ── Main content ── */}
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "300px 1fr", gap: 0, overflow: "hidden" }}>

          {/* ── Left: Note list panel ── */}
          <div style={{
            background: "rgba(20, 0, 50, 0.75)", backdropFilter: "blur(12px)",
            borderRight: "2px solid rgba(255,255,255,0.12)",
            display: "flex", flexDirection: "column", overflow: "hidden",
          }}>
            {/* Aliens car art strip */}
            <div style={{ height: 140, overflow: "hidden", flexShrink: 0, position: "relative" }}>
              <img src="/lisa-frank/3fa2b54c57b2ce40044341098c430b30.webp" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(20,0,50,0.8) 100%)" }} />
            </div>

            {/* Notes list */}
            <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
              {loading ? (
                [1,2,3].map((i) => (
                  <div key={i} style={{ height: 68, borderRadius: 10, background: "rgba(255,255,255,0.1)" }} />
                ))
              ) : notes.length === 0 ? (
                <div style={{ textAlign: "center", padding: "30px 10px" }}>
                  <img src="/lisa-frank/sticker3.webp" alt="" style={{ width: 80, borderRadius: 12, margin: "0 auto 10px", display: "block" }} />
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontStyle: "italic" }}>No notes yet, bestie!</p>
                </div>
              ) : notes.map((note, i) => {
                const color = STICKER_COLORS[i % STICKER_COLORS.length];
                const isSelected = selected?.id === note.id;
                return (
                  <div key={note.id} onClick={() => selectNote(note)} className="note-tab"
                    style={{
                      background: isSelected ? `${color.bg}DD` : "rgba(255,255,255,0.08)",
                      border: `2px solid ${isSelected ? color.border : "rgba(255,255,255,0.15)"}`,
                      borderRadius: 10, padding: "10px 12px", cursor: "pointer",
                      transition: "transform 0.15s, filter 0.15s",
                      boxShadow: isSelected ? `0 0 20px ${color.bg}66` : "none",
                    }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 6 }}>
                      <p style={{
                        fontSize: 12, fontWeight: 700, flex: 1, minWidth: 0,
                        color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                      }}>
                        {note.title || "Untitled"}
                      </p>
                      <button onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                        style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 6, padding: "2px 5px", cursor: "pointer", color: "#fff", flexShrink: 0 }}>
                        <Trash2 style={{ width: 10, height: 10 }} />
                      </button>
                    </div>
                    <p style={{ fontSize: 9, color: "rgba(255,255,255,0.55)", marginTop: 3, letterSpacing: "0.05em" }}>
                      {format(new Date(note.updated_at), "MMM d, h:mm a")}
                    </p>
                    {note.content && (
                      <p style={{
                        fontSize: 10, color: "rgba(255,255,255,0.6)", marginTop: 4, lineHeight: 1.4,
                        overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                      }}>
                        {note.content}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom: seal art strip */}
            <div style={{ height: 120, overflow: "hidden", flexShrink: 0, position: "relative" }}>
              <img src="/lisa-frank/sticker3.webp" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(20,0,50,0.7) 0%, transparent 40%)" }} />
            </div>
          </div>

          {/* ── Right: Notebook paper editor ── */}
          <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {selected ? (
              <div style={{
                flex: 1, background: "rgba(255, 252, 255, 0.97)",
                display: "flex", flexDirection: "column", position: "relative",
              }}>
                {/* Rainbow strip */}
                <div style={{
                  height: 6, flexShrink: 0,
                  background: "linear-gradient(90deg, #FF1493, #FF6347, #FFD700, #32CD32, #00CED1, #4169E1, #8B00FF, #FF00FF)",
                }} />

                <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
                  {/* Hole punches */}
                  <div style={{
                    width: 44, background: "#FFF0F8",
                    borderRight: "3px solid #FF69B866",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", paddingTop: 32, gap: 64, flexShrink: 0,
                  }}>
                    {[0,1,2].map((i) => (
                      <div key={i} style={{
                        width: 20, height: 20, borderRadius: "50%",
                        background: "#fff", border: "2px solid #ddd",
                        boxShadow: "inset 0 1px 4px rgba(0,0,0,0.15)",
                      }} />
                    ))}
                  </div>

                  {/* Writing area */}
                  <div style={{ flex: 1, padding: "18px 22px", position: "relative", overflow: "auto" }}>
                    {/* Notebook lines */}
                    <div style={{
                      position: "absolute", inset: 0,
                      backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #d0e0ff 31px, #d0e0ff 32px)",
                      backgroundPosition: "0 54px", pointerEvents: "none",
                    }} />

                    {/* Save status */}
                    <div style={{ position: "absolute", top: 10, right: 16, zIndex: 2 }}>
                      {saving && <span style={{ fontSize: 9, fontWeight: 900, padding: "3px 8px", borderRadius: 20, background: "#8B00FF", color: "#fff" }}>💾 SAVING...</span>}
                      {!dirty && !saving && selected && <span style={{ fontSize: 9, fontWeight: 900, padding: "3px 8px", borderRadius: 20, background: "#32CD32", color: "#fff" }}>✅ SAVED!</span>}
                    </div>

                    {/* Title */}
                    <input
                      value={editTitle}
                      onChange={(e) => handleEdit(e.target.value, editContent)}
                      style={{
                        width: "100%", border: "none", outline: "none",
                        fontSize: 22, fontWeight: 900, position: "relative", zIndex: 1,
                        marginBottom: 18,
                        background: "linear-gradient(90deg, #FF1493, #8B00FF, #00CED1)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                      } as React.CSSProperties}
                      placeholder="Note title... ✨"
                    />

                    {/* Content */}
                    <textarea
                      value={editContent}
                      onChange={(e) => handleEdit(editTitle, e.target.value)}
                      style={{
                        width: "100%", border: "none", outline: "none", resize: "none",
                        background: "transparent", position: "relative", zIndex: 1,
                        fontSize: 14, color: "#2A0A3A", lineHeight: "32px",
                        minHeight: 400, fontFamily: "Georgia, serif",
                      }}
                      placeholder="Write something totally radical... 🌈"
                    />
                  </div>
                </div>

                {/* Bottom rainbow strip */}
                <div style={{
                  height: 5, flexShrink: 0,
                  background: "linear-gradient(90deg, #FF00FF, #8B00FF, #4169E1, #00CED1, #32CD32, #FFD700, #FF6347, #FF1493)",
                }} />
              </div>
            ) : (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                {/* 70s retro background image */}
                <img src="/lisa-frank/download (4).png" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.4 }} />
                <div style={{ position: "absolute", inset: 0, background: "rgba(20,0,40,0.5)" }} />
                <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: 40 }}>
                  <img src="/lisa-frank/download (3).png" alt="" style={{ width: 160, margin: "0 auto 20px", display: "block", filter: "drop-shadow(0 4px 20px rgba(255,200,0,0.6))" }} />
                  <p style={{
                    fontSize: 18, fontWeight: 900,
                    background: "linear-gradient(90deg, #FF1493, #FFD700, #00CED1)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  }}>
                    Pick a note or make a new one ✨
                  </p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 8, fontStyle: "italic", fontFamily: "Georgia" }}>
                    your thoughts are totally radical 🌈
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Footer image strip ── */}
        <div style={{ height: 80, overflow: "hidden", flexShrink: 0, position: "relative" }}>
          <img src="/lisa-frank/download (2).png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(20,0,40,0.5) 0%, transparent 60%)" }} />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 4,
            background: "linear-gradient(90deg, #FF1493, #FF6347, #FFD700, #32CD32, #00CED1, #4169E1, #8B00FF)",
          }} />
        </div>
      </div>
    </div>
  );
}
