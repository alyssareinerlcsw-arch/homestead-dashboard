"use client";

import { useEffect, useState, useRef } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { format } from "date-fns";
import { useXP } from "@/contexts/xp-context";
import { IconBadge } from "@/components/decorations";

interface Note { id: number; title: string; content: string; created_at: string; updated_at: string; }

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
    setDirty(false);
    setSaving(false);
  }

  async function createNote() {
    const res = await fetch("/api/notes", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "New note", content: "" }),
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
    <div className="space-y-6">
      <div className="page-header flex items-start justify-between">
        <div className="flex items-center gap-3">
          <IconBadge emoji="📖" size={48} bg="rgba(200,160,96,0.13)" border="rgba(200,160,96,0.2)" />
          <div>
            <h1 className="section-title" style={{ fontSize: 24 }}>My Notes</h1>
            <p className="section-subtitle">{notes.length} {notes.length === 1 ? "entry" : "entries"} · +3 XP per note</p>
          </div>
        </div>
        <button onClick={createNote} className="btn-primary"><Plus className="w-4 h-4" />New note</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ minHeight: 500 }}>
        {/* Note list */}
        <div className="md:col-span-1 space-y-2">
          {loading ? (
            <div className="space-y-2">{[1,2,3].map((i) => <div key={i} className="rounded-2xl animate-pulse" style={{ height: 72, background: "rgba(117,160,83,0.07)" }} />)}</div>
          ) : notes.length === 0 ? (
            <div className="card text-center py-10">
              <div className="flex justify-center mb-2"><IconBadge emoji="📖" size={36} bg="rgba(200,160,96,0.13)" border="rgba(200,160,96,0.2)" /></div>
              <p style={{ fontFamily: "Georgia", color: "rgba(122,106,80,0.55)", fontStyle: "italic", fontSize: 13 }}>Write your first note!</p>
            </div>
          ) : notes.map((note) => (
            <div key={note.id} onClick={() => selectNote(note)} className={`card cursor-pointer py-3 px-4 ${selected?.id === note.id ? "ring-2 ring-sage-400" : ""}`}
              style={{ borderLeft: selected?.id === note.id ? "3px solid #5A8240" : "3px solid transparent" }}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: 13, fontFamily: "Georgia", color: "#3A2810", fontWeight: selected?.id === note.id ? 600 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{note.title || "Untitled"}</p>
                  <p style={{ fontSize: 11, color: "rgba(122,106,80,0.5)", marginTop: 2 }}>{format(new Date(note.updated_at), "MMM d, h:mm a")}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }} className="btn-ghost p-1" style={{ color: "rgba(122,106,80,0.3)", flexShrink: 0 }}>
                  <Trash2 style={{ width: 12, height: 12 }} />
                </button>
              </div>
              {note.content && <p style={{ fontSize: 11, color: "rgba(122,106,80,0.45)", marginTop: 4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{note.content}</p>}
            </div>
          ))}
        </div>

        {/* Editor */}
        <div className="md:col-span-2">
          {selected ? (
            <div className="card h-full flex flex-col" style={{ minHeight: 400 }}>
              <div className="flex items-center gap-3 pb-3" style={{ borderBottom: "1px solid rgba(117,160,83,0.12)" }}>
                <input value={editTitle} onChange={(e) => handleEdit(e.target.value, editContent)}
                  className="flex-1 text-base font-medium bg-transparent outline-none"
                  style={{ fontFamily: "Georgia", color: "#3A2810", border: "none" }}
                  placeholder="Note title..." />
                <div className="flex items-center gap-2 flex-shrink-0">
                  {saving && <span style={{ fontSize: 10, color: "rgba(122,106,80,0.4)" }}>Saving...</span>}
                  {dirty && !saving && <Save style={{ width: 13, height: 13, color: "rgba(122,106,80,0.4)" }} />}
                  {!dirty && !saving && <span style={{ fontSize: 10, color: "rgba(117,160,83,0.6)" }}>Saved</span>}
                </div>
              </div>
              <textarea value={editContent} onChange={(e) => handleEdit(editTitle, e.target.value)}
                className="flex-1 w-full bg-transparent outline-none resize-none mt-3"
                style={{ fontFamily: "Georgia", fontSize: 14, color: "#3A2810", lineHeight: 1.7, border: "none", minHeight: 320 }}
                placeholder="Start writing..." />
            </div>
          ) : (
            <div className="card h-full flex flex-col items-center justify-center text-center" style={{ minHeight: 400 }}>
              <IconBadge emoji="📖" size={56} bg="rgba(200,160,96,0.13)" border="rgba(200,160,96,0.2)" />
              <p style={{ fontFamily: "Georgia", color: "rgba(122,106,80,0.45)", fontStyle: "italic", marginTop: 12, fontSize: 14 }}>Select a note or create a new one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
