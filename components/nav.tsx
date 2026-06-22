"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, RefreshCw, FileText, Target, Dumbbell, Menu, X } from "lucide-react";
import { useState } from "react";
import { useXP } from "@/contexts/xp-context";

const NAV_ITEMS = [
  { href: "/",       label: "Dashboard", icon: LayoutDashboard, xpNote: "" },
  { href: "/tasks",  label: "Tasks",     icon: CheckSquare,     xpNote: "+10 XP" },
  { href: "/habits", label: "Habits",    icon: RefreshCw,       xpNote: "+5 XP" },
  { href: "/notes",  label: "Notes",     icon: FileText,        xpNote: "+3 XP" },
  { href: "/goals",  label: "Goals",     icon: Target,          xpNote: "+5 XP" },
  { href: "/gym",    label: "Gym",       icon: Dumbbell,        xpNote: "+20 XP" },
];

const SIDEBAR_BG   = "linear-gradient(175deg, #EDD5C8 0%, #E4C4B4 45%, #D8B8A8 100%)";
const SIDEBAR_BORD = "1.5px solid rgba(180,130,110,0.22)";

export default function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { level, xpInLevel, levelTitle, streak, totalXP } = useXP();

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside
        className="hidden md:flex flex-col w-60 min-h-screen fixed left-0 top-0 z-20"
        style={{ background: SIDEBAR_BG, borderRight: SIDEBAR_BORD }}
      >
        {/* Logo / Header */}
        <div className="px-5 py-5" style={{ borderBottom: "1px solid rgba(180,130,110,0.18)" }}>
          {/* Tiny vine decoration */}
          <div style={{ fontSize: 11, color: "rgba(120,80,60,0.35)", letterSpacing: 2, marginBottom: 8, textAlign: "center" }}>
            ❧ · · · ❧
          </div>
          <div className="flex items-center gap-3 justify-center">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(253,248,242,0.7)",
                border: "1.5px solid rgba(180,130,110,0.25)",
                boxShadow: "0 2px 6px rgba(120,80,60,0.12)",
                fontSize: 18,
              }}
            >
              🌿
            </div>
            <div>
              <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: "#4A3828", letterSpacing: "0.02em" }}>
                Homestead
              </p>
              <p style={{ fontSize: 10, color: "rgba(120,80,60,0.55)", letterSpacing: "0.07em", textTransform: "uppercase" }}>
                your little corner
              </p>
            </div>
          </div>
          <div style={{ fontSize: 11, color: "rgba(120,80,60,0.35)", letterSpacing: 2, marginTop: 8, textAlign: "center" }}>
            ❧ · · · ❧
          </div>
        </div>

        {/* XP & Level */}
        <div className="px-4 py-4" style={{ borderBottom: "1px solid rgba(180,130,110,0.14)" }}>
          {/* OS-window style mini card */}
          <div className="os-window" style={{ borderRadius: 12 }}>
            <div className="os-window-bar" style={{ padding: "6px 10px", borderRadius: "12px 12px 0 0" }}>
              <div className="os-window-dot" style={{ background: "#E8A898" }} />
              <div className="os-window-dot" style={{ background: "#E8C898" }} />
              <div className="os-window-dot" style={{ background: "#A8C898" }} />
              <span style={{ fontSize: 9, color: "rgba(74,56,40,0.45)", marginLeft: 6, fontFamily: "Georgia", letterSpacing: "0.05em" }}>
                stats.exe
              </span>
            </div>
            <div className="os-window-body" style={{ padding: "10px 12px" }}>
              <div className="flex items-center justify-between mb-2">
                <span style={{
                  fontFamily: "Georgia", fontSize: 11, fontWeight: 600,
                  color: "#7A4838",
                  background: "rgba(238,197,184,0.5)",
                  border: "1px solid rgba(200,136,120,0.3)",
                  borderRadius: 20, padding: "2px 9px"
                }}>
                  Lv.{level} · {levelTitle}
                </span>
                {streak > 0 && (
                  <span style={{
                    fontSize: 11, fontWeight: 600, color: "#7A5830",
                    background: "rgba(200,160,96,0.2)",
                    border: "1px solid rgba(200,160,96,0.3)",
                    borderRadius: 20, padding: "2px 8px"
                  }}>
                    🔥 {streak}d
                  </span>
                )}
              </div>
              <div className="xp-bar-track">
                <div className="xp-bar-fill" style={{ width: `${xpInLevel}%` }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "rgba(120,80,60,0.45)", marginTop: 3 }}>
                <span>{totalXP} XP total</span>
                <span>{xpInLevel}/100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-3 space-y-0.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon, xpNote }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-150"
                style={{
                  background: active ? "rgba(253,248,242,0.7)" : "transparent",
                  border: active ? "1.5px solid rgba(180,130,110,0.22)" : "1.5px solid transparent",
                  color: active ? "#4A3828" : "rgba(90,58,40,0.65)",
                  boxShadow: active ? "0 1px 4px rgba(120,80,60,0.08), inset 0 1px 0 rgba(255,255,255,0.5)" : "none",
                }}
              >
                <Icon
                  style={{
                    width: 15, height: 15, flexShrink: 0,
                    color: active ? "#CC8878" : "rgba(150,100,80,0.5)",
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: 13, fontFamily: "Georgia", fontWeight: active ? 600 : 400, color: active ? "#4A3828" : "rgba(90,58,40,0.65)" }}>
                    {label}
                  </p>
                  {xpNote && (
                    <p style={{ fontSize: 9, color: active ? "rgba(200,136,120,0.8)" : "rgba(90,58,40,0.35)", lineHeight: 1.2 }}>
                      {xpNote} each
                    </p>
                  )}
                </div>
                {active && (
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#CC8878", boxShadow: "0 0 4px rgba(204,136,120,0.6)", flexShrink: 0 }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4" style={{ borderTop: "1px solid rgba(180,130,110,0.14)" }}>
          <p style={{ fontSize: 10, color: "rgba(90,58,40,0.4)", textAlign: "center", fontFamily: "Georgia", fontStyle: "italic" }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          {streak >= 3 && (
            <p style={{ fontSize: 10, color: "rgba(200,136,120,0.7)", textAlign: "center", marginTop: 3, fontFamily: "Georgia", fontStyle: "italic" }}>
              {streak} days and counting ✨
            </p>
          )}
          <p style={{ fontSize: 10, color: "rgba(138,174,110,0.6)", textAlign: "center", marginTop: 6, letterSpacing: 3 }}>
            · · ✿ · ·
          </p>
        </div>
      </aside>

      {/* ── Mobile top bar ── */}
      <header
        className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3"
        style={{
          background: "linear-gradient(90deg, #EDD5C8, #E4C4B4)",
          borderBottom: "1px solid rgba(180,130,110,0.22)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <span style={{ fontSize: 16 }}>🌿</span>
          <span style={{ fontFamily: "Georgia, serif", fontSize: 14, color: "#4A3828" }}>Homestead</span>
        </div>
        <div className="flex items-center gap-3">
          <span style={{
            fontSize: 11, fontWeight: 600, color: "#7A4838",
            background: "rgba(238,197,184,0.6)", borderRadius: 20, padding: "2px 8px",
            border: "1px solid rgba(200,136,120,0.3)"
          }}>
            Lv.{level}
          </span>
          {streak > 0 && <span style={{ fontSize: 11, color: "#7A5830" }}>🔥 {streak}</span>}
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ color: "rgba(90,58,40,0.65)", padding: 4 }}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-20 pt-14" onClick={() => setMobileOpen(false)}>
          <div
            className="px-3 py-3 space-y-0.5"
            style={{ background: "#E4C4B4", borderBottom: "1px solid rgba(180,130,110,0.2)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-3 py-2 mb-2">
              <div className="xp-bar-track"><div className="xp-bar-fill" style={{ width: `${xpInLevel}%` }} /></div>
              <p style={{ fontSize: 9, color: "rgba(90,58,40,0.45)", textAlign: "center", marginTop: 3, fontFamily: "Georgia" }}>
                {levelTitle} · {xpInLevel}/100 XP
              </p>
            </div>
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-2xl"
                  style={{
                    background: active ? "rgba(253,248,242,0.6)" : "transparent",
                    color: active ? "#4A3828" : "rgba(90,58,40,0.65)",
                  }}>
                  <Icon style={{ width: 15, height: 15, color: active ? "#CC8878" : "rgba(120,80,60,0.5)" }} />
                  <span style={{ fontSize: 13, fontFamily: "Georgia" }}>{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
