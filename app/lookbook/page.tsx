"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

const C = {
  bg:       "#0F0804",
  card:     "#1C1208",
  card2:    "#241A0E",
  border:   "#3A2818",
  rust:     "#B5451B",
  gold:     "#C4982A",
  burgundy: "#8B2635",
  olive:    "#6B7C3A",
  teal:     "#2A7A70",
  cream:    "#F0E0CC",
  muted:    "#8A7060",
  text:     "#E8D8C8",
};

interface OutfitCard {
  title: string;
  description: string;
  colors: string[];
  colorNames: string[];
  keyPieces: string[];
}

interface MakeupCard {
  title: string;
  description: string;
  steps: string[];
  vibe: string;
}

interface LookbookData {
  energy: string;
  date: string;
  dayOfWeek: string;
  lunarPhase: string;
  lunarEmoji: string;
  season: string;
  chart: { sun: string; venus: string; mars: string };
  workout: OutfitCard;
  work: OutfitCard;
  lounge: OutfitCard;
  makeup: MakeupCard;
  mantra: string;
}

function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "6px 0" }}>
      <div style={{ flex: 1, height: 1, background: C.border }} />
      <span style={{ fontSize: 10, color: C.muted }}>✦</span>
      <div style={{ flex: 1, height: 1, background: C.border }} />
    </div>
  );
}

function ColorSwatch({ hex, name }: { hex: string; name: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%",
        background: hex,
        border: `2px solid rgba(255,255,255,0.1)`,
        boxShadow: `0 0 8px ${hex}66`,
      }} />
      <span style={{ fontSize: 8, color: C.muted, textAlign: "center", maxWidth: 44, lineHeight: 1.2 }}>{name}</span>
    </div>
  );
}

function OutfitSection({ data, label, accent, icon }: {
  data: OutfitCard; label: string; accent: string; icon: string;
}) {
  return (
    <div style={{
      background: C.card,
      border: `1.5px solid ${accent}44`,
      borderRadius: 8,
      overflow: "hidden",
      boxShadow: `0 0 20px ${accent}18`,
    }}>
      <div style={{
        background: `linear-gradient(135deg, ${accent}18, ${accent}08)`,
        borderBottom: `1px solid ${accent}33`,
        padding: "12px 16px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>{icon}</span>
          <div>
            <p style={{ fontSize: 8, fontWeight: 900, letterSpacing: "0.14em", color: accent, fontFamily: "monospace" }}>
              {label}
            </p>
            <p style={{ fontSize: 13, fontFamily: "Georgia, serif", color: C.cream, fontStyle: "italic" }}>
              {data.title}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {data.colors.map((hex, i) => (
            <ColorSwatch key={i} hex={hex} name={data.colorNames?.[i] ?? ""} />
          ))}
        </div>
      </div>

      <div style={{ padding: "14px 16px" }}>
        <p style={{ fontSize: 12, color: C.text, lineHeight: 1.65, fontFamily: "Georgia, serif", marginBottom: 12 }}>
          {data.description}
        </p>
        <Divider />
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 5 }}>
          {data.keyPieces.map((piece, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ color: accent, fontSize: 9, marginTop: 2, flexShrink: 0 }}>▸</span>
              <span style={{ fontSize: 11, color: C.text, fontFamily: "Georgia, serif" }}>{piece}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SkeletonCard({ height = 200 }: { height?: number }) {
  return (
    <div style={{
      height, background: `${C.card}`,
      border: `1.5px solid ${C.border}`,
      borderRadius: 8,
      overflow: "hidden",
      position: "relative",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(90deg, transparent 0%, ${C.card2}88 50%, transparent 100%)`,
        animation: "shimmer 1.8s infinite",
      }} />
      <style>{`@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }`}</style>
    </div>
  );
}

export default function LookbookPage() {
  const [data, setData] = useState<LookbookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const CACHE_KEY = `lookbook_${today}`;

  async function fetchLookbook(force = false) {
    if (!force) {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        setData(JSON.parse(cached));
        setLoading(false);
        return;
      }
    }

    try {
      const res = await fetch("/api/lookbook");
      if (!res.ok) throw new Error("Failed");
      const d = await res.json();
      localStorage.setItem(CACHE_KEY, JSON.stringify(d));
      setData(d);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
      setRegenerating(false);
    }
  }

  function regenerate() {
    setRegenerating(true);
    localStorage.removeItem(CACHE_KEY);
    fetchLookbook(true);
  }

  useEffect(() => { fetchLookbook(); }, []);

  return (
    <div style={{
      background: C.bg, minHeight: "100vh",
      margin: "-24px -24px -24px", padding: "28px 28px 48px",
      fontFamily: "monospace",
    }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.rust}, ${C.gold}, ${C.burgundy}, transparent)`, marginBottom: 20 }} />
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          <div>
            <p style={{ fontSize: 9, letterSpacing: "0.2em", color: C.muted, fontFamily: "monospace", marginBottom: 4 }}>
              ✦ DAILY EDITORIAL
            </p>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 400, color: C.cream, letterSpacing: "0.02em", lineHeight: 1.1 }}>
              The Lookbook
            </h1>
            {data && (
              <p style={{ fontSize: 11, color: C.muted, marginTop: 6, fontFamily: "Georgia, serif", fontStyle: "italic" }}>
                {data.dayOfWeek}, {data.date} · {data.lunarEmoji} {data.lunarPhase} · {data.season}
              </p>
            )}
          </div>
          <button
            onClick={regenerate}
            disabled={regenerating || loading}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: `${C.rust}18`, border: `1px solid ${C.rust}44`,
              borderRadius: 6, padding: "8px 14px", color: C.rust,
              fontSize: 9, fontWeight: 900, letterSpacing: "0.1em",
              cursor: regenerating ? "wait" : "pointer", flexShrink: 0,
            }}
          >
            <RefreshCw style={{ width: 11, height: 11, animation: regenerating ? "spin 1s linear infinite" : "none" }} />
            {regenerating ? "CHANNELING..." : "NEW READING"}
          </button>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

        {/* Chart context */}
        {data && (
          <div style={{
            marginTop: 14, padding: "10px 16px",
            background: `linear-gradient(135deg, ${C.gold}10, ${C.rust}08)`,
            border: `1px solid ${C.gold}28`, borderRadius: 6,
            display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap",
          }}>
            <div>
              <p style={{ fontSize: 8, color: C.muted, letterSpacing: "0.12em" }}>SUN</p>
              <p style={{ fontSize: 12, color: C.gold, fontFamily: "Georgia, serif" }}>♎ {data.chart.sun}</p>
            </div>
            <div>
              <p style={{ fontSize: 8, color: C.muted, letterSpacing: "0.12em" }}>VENUS · WARDROBE</p>
              <p style={{ fontSize: 12, color: C.rust, fontFamily: "Georgia, serif" }}>♐ {data.chart.venus}</p>
            </div>
            <div>
              <p style={{ fontSize: 8, color: C.muted, letterSpacing: "0.12em" }}>MARS · MAKEUP</p>
              <p style={{ fontSize: 12, color: C.burgundy, fontFamily: "Georgia, serif" }}>♊ {data.chart.mars}</p>
            </div>
            <div>
              <p style={{ fontSize: 8, color: C.muted, letterSpacing: "0.12em" }}>TODAY'S ENERGY</p>
              <p style={{ fontSize: 12, color: C.cream, fontFamily: "Georgia, serif", fontStyle: "italic" }}>{data.energy}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Outfit Cards ── */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
          <SkeletonCard height={220} />
          <SkeletonCard height={220} />
          <SkeletonCard height={220} />
        </div>
      ) : error ? (
        <div style={{ textAlign: "center", padding: "40px 0", border: `1px dashed ${C.border}`, borderRadius: 8 }}>
          <p style={{ color: C.muted, fontFamily: "Georgia, serif" }}>The stars are quiet today. Try regenerating.</p>
        </div>
      ) : data ? (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
            <OutfitSection data={data.workout} label="WORKOUT" accent={C.rust}    icon="🩳" />
            <OutfitSection data={data.work}    label="WORK"    accent={C.gold}    icon="💼" />
            <OutfitSection data={data.lounge}  label="LOUNGE"  accent={C.olive}   icon="🕯️" />
          </div>

          {/* ── Makeup ── */}
          <div style={{
            background: C.card, border: `1.5px solid ${C.burgundy}44`,
            borderRadius: 8, overflow: "hidden", marginBottom: 14,
            boxShadow: `0 0 20px ${C.burgundy}18`,
          }}>
            <div style={{
              background: `linear-gradient(135deg, ${C.burgundy}18, ${C.burgundy}08)`,
              borderBottom: `1px solid ${C.burgundy}33`,
              padding: "12px 16px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>💄</span>
                <div>
                  <p style={{ fontSize: 8, fontWeight: 900, letterSpacing: "0.14em", color: C.burgundy, fontFamily: "monospace" }}>
                    MAKEUP · MARS IN {data.chart.mars.toUpperCase()}
                  </p>
                  <p style={{ fontSize: 13, fontFamily: "Georgia, serif", color: C.cream, fontStyle: "italic" }}>
                    {data.makeup.title}
                  </p>
                </div>
              </div>
              <div style={{
                fontSize: 9, fontWeight: 900, color: C.burgundy,
                background: `${C.burgundy}18`, border: `1px solid ${C.burgundy}44`,
                borderRadius: 20, padding: "3px 10px", letterSpacing: "0.1em",
              }}>
                {data.makeup.vibe.toUpperCase()}
              </div>
            </div>
            <div style={{ padding: "14px 16px" }}>
              <p style={{ fontSize: 12, color: C.text, lineHeight: 1.65, fontFamily: "Georgia, serif", marginBottom: 12 }}>
                {data.makeup.description}
              </p>
              <Divider />
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                {data.makeup.steps.map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{
                      fontSize: 8, color: C.burgundy, background: `${C.burgundy}18`,
                      border: `1px solid ${C.burgundy}44`, borderRadius: "50%",
                      width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, fontWeight: 900, marginTop: 1,
                    }}>
                      {i + 1}
                    </span>
                    <span style={{ fontSize: 11, color: C.text, fontFamily: "Georgia, serif", lineHeight: 1.5 }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Mantra ── */}
          <div style={{
            background: `linear-gradient(135deg, ${C.gold}12, ${C.rust}08)`,
            border: `1.5px solid ${C.gold}33`,
            borderRadius: 8, padding: "20px 24px",
            textAlign: "center",
            boxShadow: `0 0 30px ${C.gold}10`,
          }}>
            <p style={{ fontSize: 8, color: C.gold, letterSpacing: "0.2em", marginBottom: 12, fontFamily: "monospace" }}>
              ✦ TODAY'S MANTRA ✦
            </p>
            <p style={{
              fontFamily: "Georgia, serif", fontSize: 15, color: C.cream,
              lineHeight: 1.75, fontStyle: "italic", maxWidth: 520, margin: "0 auto",
            }}>
              "{data.mantra}"
            </p>
          </div>
        </>
      ) : null}

      {/* Footer */}
      <div style={{ marginTop: 28, textAlign: "center" }}>
        <p style={{ fontSize: 9, color: C.border, letterSpacing: "0.15em", fontFamily: "monospace" }}>
          ✦ · TRUE AUTUMN · SAGITTARIUS VENUS · GEMINI MARS · ✦
        </p>
      </div>
    </div>
  );
}
