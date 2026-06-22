"use client";

import { useEffect, useState, useRef } from "react";
import { Plus, X, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { format, parseISO, subDays, isSameDay } from "date-fns";
import { useXP } from "@/contexts/xp-context";

// ── Princess Donut laser celebration ──────────────────────────────────────
function DonutCelebration({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3800);
    return () => clearTimeout(t);
  }, [onDone]);

  // Eyes are at y=162 in a 300px-tall SVG anchored at bottom:0
  // → eyes sit 300-162 = 138px above the bottom of the screen
  const eyeBottom = 148;

  return (
    <>
      <style>{`
        @keyframes donut-rise {
          0%   { transform: translateX(-50%) translateY(105%); }
          18%  { transform: translateX(-50%) translateY(-2%); }
          82%  { transform: translateX(-50%) translateY(0%); }
          100% { transform: translateX(-50%) translateY(108%); }
        }
        @keyframes bubble-pop {
          0%   { transform: translateX(-50%) scale(0);   opacity: 0; }
          25%  { transform: translateX(-50%) scale(1.08); opacity: 1; }
          78%  { transform: translateX(-50%) scale(1);   opacity: 1; }
          100% { transform: translateX(-50%) scale(0.8); opacity: 0; }
        }
        @keyframes laser-left {
          0%   { transform: scaleX(0); opacity: 1; }
          55%  { transform: scaleX(1); opacity: 1; }
          100% { transform: scaleX(1); opacity: 0; }
        }
        @keyframes laser-right {
          0%   { transform: scaleX(0); opacity: 1; }
          55%  { transform: scaleX(1); opacity: 1; }
          100% { transform: scaleX(1); opacity: 0; }
        }
        @keyframes laser-glow-pulse {
          0%, 100% { filter: drop-shadow(0 0 6px #FF2080) drop-shadow(0 0 18px #FF2080); }
          50%       { filter: drop-shadow(0 0 14px #FF80C0) drop-shadow(0 0 40px #FF2080); }
        }
        @keyframes bg-dim {
          0%   { opacity: 0; }
          12%  { opacity: 1; }
          88%  { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes crown-wobble {
          0%, 100% { transform: rotate(-4deg) translateY(0); }
          50%       { transform: rotate(4deg) translateY(-4px); }
        }
      `}</style>

      {/* Overlay */}
      <div style={{ position: "fixed", inset: 0, zIndex: 9990, background: "rgba(0,0,0,0.72)", animation: "bg-dim 3.8s ease forwards", pointerEvents: "none" }} />

      {/* Left laser beam */}
      <div style={{
        position: "fixed", right: "50%", left: 0,
        bottom: eyeBottom, height: 8,
        background: "linear-gradient(to left, #FF2080 0%, #FF60B0 40%, #FF208066 80%, transparent 100%)",
        boxShadow: "0 0 16px #FF2080, 0 0 40px #FF208066",
        transformOrigin: "right center",
        animation: "laser-left 2.4s ease-out 0.55s both",
        zIndex: 9995, pointerEvents: "none",
        borderRadius: "0 4px 4px 0",
      }} />

      {/* Right laser beam */}
      <div style={{
        position: "fixed", left: "50%", right: 0,
        bottom: eyeBottom, height: 8,
        background: "linear-gradient(to right, #FF2080 0%, #FF60B0 40%, #FF208066 80%, transparent 100%)",
        boxShadow: "0 0 16px #FF2080, 0 0 40px #FF208066",
        transformOrigin: "left center",
        animation: "laser-right 2.4s ease-out 0.55s both",
        zIndex: 9995, pointerEvents: "none",
        borderRadius: "4px 0 0 4px",
      }} />

      {/* Speech bubble — positioned above Donut */}
      <div style={{
        position: "fixed", bottom: 310, left: "50%",
        zIndex: 9999, pointerEvents: "none",
        animation: "bubble-pop 3.8s cubic-bezier(0.34,1.4,0.64,1) forwards",
        background: "#FF1E8C",
        color: "#fff",
        fontFamily: "monospace", fontWeight: 900,
        fontSize: 20, letterSpacing: "0.08em",
        padding: "12px 24px", borderRadius: 10,
        whiteSpace: "nowrap",
        boxShadow: "0 0 24px #FF1E8C, 0 0 60px #FF1E8C55",
        textShadow: "0 0 8px rgba(255,255,255,0.4)",
      }}>
        MONGO IS APPALLED!
        <div style={{
          position: "absolute", bottom: -10, left: "50%", transform: "translateX(-50%)",
          width: 0, height: 0,
          borderLeft: "12px solid transparent", borderRight: "12px solid transparent",
          borderTop: "12px solid #FF1E8C",
        }} />
      </div>

      {/* Princess Donut SVG */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%",
        zIndex: 9996, pointerEvents: "none",
        animation: "donut-rise 3.8s cubic-bezier(0.34,1.2,0.64,1) forwards",
      }}>
        <svg width="240" height="300" viewBox="0 0 240 300" style={{ display: "block", overflow: "visible" }}>
          <defs>
            <radialGradient id="furOuter" cx="50%" cy="45%">
              <stop offset="0%" stopColor="#EED8CC" />
              <stop offset="100%" stopColor="#C8A898" />
            </radialGradient>
            <radialGradient id="furInner" cx="50%" cy="40%">
              <stop offset="0%" stopColor="#FFF5F0" />
              <stop offset="70%" stopColor="#F5E0D5" />
              <stop offset="100%" stopColor="#E8CCBC" />
            </radialGradient>
            <radialGradient id="patchOrange" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#E8A060" />
              <stop offset="100%" stopColor="#C07840" />
            </radialGradient>
            <radialGradient id="crownGrad" cx="50%" cy="0%">
              <stop offset="0%" stopColor="#FFE44C" />
              <stop offset="100%" stopColor="#CC9900" />
            </radialGradient>
            <filter id="laserGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="softGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* ── Crown ── */}
          <g style={{ animation: "crown-wobble 0.7s ease-in-out infinite" }}>
            {/* Crown points */}
            <polygon points="80,92 92,58 108,80 120,50 132,80 148,58 160,92" fill="url(#crownGrad)" stroke="#996600" strokeWidth="2" strokeLinejoin="round" />
            {/* Crown band */}
            <rect x="78" y="90" width="84" height="14" rx="3" fill="url(#crownGrad)" stroke="#996600" strokeWidth="1.5" />
            {/* Gems */}
            <circle cx="120" cy="58" r="7" fill="#FF1E8C" stroke="#CC0066" strokeWidth="1.5" />
            <circle cx="97" cy="70" r="5" fill="#CC44FF" stroke="#8800CC" strokeWidth="1.2" />
            <circle cx="143" cy="70" r="5" fill="#00E5D4" stroke="#009988" strokeWidth="1.2" />
            <circle cx="120" cy="97" r="4" fill="#FFD700" stroke="#AA8800" strokeWidth="1" />
            <circle cx="97" cy="97" r="3" fill="#FF2080" stroke="#CC0055" strokeWidth="1" />
            <circle cx="143" cy="97" r="3" fill="#00E5D4" stroke="#009988" strokeWidth="1" />
          </g>

          {/* ── Ears ── */}
          <polygon points="68,128 80,88 108,118" fill="#D8B0A0" stroke="#3A2010" strokeWidth="2.5" strokeLinejoin="round" />
          <polygon points="172,128 160,88 132,118" fill="#D8B0A0" stroke="#3A2010" strokeWidth="2.5" strokeLinejoin="round" />
          {/* Inner ear */}
          <polygon points="76,124 85,98 104,116" fill="#F0A0B8" />
          <polygon points="164,124 155,98 136,116" fill="#F0A0B8" />

          {/* ── Head — fluffy bumps outer ring ── */}
          {[
            [52,148,18,22], [46,172,16,20], [54,197,17,19], [70,215,18,17],
            [188,148,18,22],[194,172,16,20],[186,197,17,19],[170,215,18,17],
            [95,230,20,16],[120,234,22,15],[145,230,20,16],
          ].map(([cx,cy,rx,ry],i) => (
            <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill="#C8A090" stroke="#3A2010" strokeWidth="2" />
          ))}

          {/* Head main circle */}
          <ellipse cx="120" cy="168" rx="82" ry="78" fill="url(#furOuter)" stroke="#3A2010" strokeWidth="2.5" />

          {/* Orange/calico patch top-left */}
          <ellipse cx="82" cy="145" rx="30" ry="28" fill="url(#patchOrange)" opacity="0.7" />
          {/* Gray patch top-right */}
          <ellipse cx="158" cy="148" rx="26" ry="24" fill="#B0A8A0" opacity="0.5" />

          {/* Inner face fur */}
          <ellipse cx="120" cy="176" rx="60" ry="56" fill="url(#furInner)" />

          {/* ── Sunglasses ── */}
          {/* Frame */}
          <ellipse cx="97" cy="166" rx="26" ry="17" fill="#111122" stroke="#FFD700" strokeWidth="2.5" />
          <ellipse cx="143" cy="166" rx="26" ry="17" fill="#111122" stroke="#FFD700" strokeWidth="2.5" />
          {/* Bridge */}
          <path d="M121,166 Q120,162 119,166" stroke="#FFD700" strokeWidth="2.5" fill="none" />
          {/* Side arms */}
          <line x1="71" y1="166" x2="55" y2="168" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="169" y1="166" x2="185" y2="168" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round" />
          {/* Lens shine */}
          <ellipse cx="90" cy="161" rx="7" ry="4" fill="rgba(255,255,255,0.18)" />
          <ellipse cx="136" cy="161" rx="7" ry="4" fill="rgba(255,255,255,0.18)" />
          {/* Laser glow on lenses */}
          <ellipse cx="97" cy="166" rx="26" ry="17" fill="none" stroke="#FF2080" strokeWidth="2" opacity="0.6" filter="url(#softGlow)" />
          <ellipse cx="143" cy="166" rx="26" ry="17" fill="none" stroke="#FF2080" strokeWidth="2" opacity="0.6" filter="url(#softGlow)" />

          {/* ── Nose ── */}
          <polygon points="120,192 114,184 126,184" fill="#FF8899" stroke="#CC4466" strokeWidth="1.2" />

          {/* ── Mouth ── */}
          <path d="M111,197 Q116,203 120,200 Q124,203 129,197" stroke="#3A2010" strokeWidth="1.8" fill="none" strokeLinecap="round" />

          {/* ── Whiskers ── */}
          <line x1="58" y1="186" x2="106" y2="190" stroke="#3A2010" strokeWidth="1.3" strokeLinecap="round" />
          <line x1="55" y1="196" x2="106" y2="196" stroke="#3A2010" strokeWidth="1.3" strokeLinecap="round" />
          <line x1="60" y1="205" x2="106" y2="202" stroke="#3A2010" strokeWidth="1.3" strokeLinecap="round" />
          <line x1="182" y1="186" x2="134" y2="190" stroke="#3A2010" strokeWidth="1.3" strokeLinecap="round" />
          <line x1="185" y1="196" x2="134" y2="196" stroke="#3A2010" strokeWidth="1.3" strokeLinecap="round" />
          <line x1="180" y1="205" x2="134" y2="202" stroke="#3A2010" strokeWidth="1.3" strokeLinecap="round" />

          {/* ── Body / chest ── */}
          <ellipse cx="120" cy="268" rx="88" ry="52" fill="#D0B0A0" stroke="#3A2010" strokeWidth="2.5" />
          <ellipse cx="120" cy="272" rx="72" ry="42" fill="url(#furInner)" />
          {/* Paws */}
          <ellipse cx="78" cy="280" rx="22" ry="14" fill="#E8D0C0" stroke="#3A2010" strokeWidth="2" />
          <ellipse cx="162" cy="280" rx="22" ry="14" fill="#E8D0C0" stroke="#3A2010" strokeWidth="2" />
          {/* Paw toes */}
          {[-7,-1,5].map((dx,i) => <ellipse key={i} cx={78+dx} cy={288} rx={5} ry={4} fill="#D8B8A8" stroke="#3A2010" strokeWidth="1.2" />)}
          {[-5,1,7].map((dx,i) => <ellipse key={i} cx={162+dx} cy={288} rx={5} ry={4} fill="#D8B8A8" stroke="#3A2010" strokeWidth="1.2" />)}

          {/* ── Collar ── */}
          <rect x="66" y="228" width="108" height="18" rx="9" fill="#CC44FF" stroke="#8800CC" strokeWidth="2" />
          <circle cx="120" cy="237" r="7" fill="#FFD700" stroke="#996600" strokeWidth="1.5" />
          <circle cx="88" cy="237" r="4" fill="#FF1E8C" stroke="#CC0055" strokeWidth="1" />
          <circle cx="152" cy="237" r="4" fill="#00E5D4" stroke="#009988" strokeWidth="1" />
        </svg>
      </div>
    </>
  );
}

interface CyclePhaseInfo {
  phase: string | null;
  cycle_day: number | null;
  confidence: string | null;
}

interface OuraData {
  cycle: CyclePhaseInfo | null;
  readiness: { score: number; hrv_balance: number | null; resting_heart_rate: number | null; sleep_balance: number | null; activity_balance: number | null; temperature_deviation: number | null; } | null;
  sleep: { score: number; duration_hours: number | null; rem_sleep: number | null; deep_sleep: number | null; efficiency: number | null; } | null;
  activity: { steps: number | null; active_calories: number | null; } | null;
}

// ── Cycle phase content ────────────────────────────────────────────────────
const CYCLE_PHASES: Record<string, {
  label: string; color: string; emoji: string; days: string;
  intensity: string; workout: string[];  recovery: string[]; nutrition: string[];
  readinessNote: string;
}> = {
  menstrual: {
    label: "Menstrual", color: "#FF1E8C", emoji: "🌑", days: "Days 1–5",
    intensity: "LOW — RESTORE MODE",
    workout: [
      "Gentle Pilates or yoga over intense training",
      "Walking counts — steps are your friend right now",
      "Skip heavy Ascend if cramping is bad; your body is doing work",
      "If you do train, lower weights, higher reps, lots of rest",
    ],
    recovery: [
      "Prioritize 8+ hours of sleep — progesterone is dropping fast",
      "Heat therapy (hot water bottle, sauna) reduces cramps significantly",
      "HRV will likely be lower; don't panic, it's hormonal",
      "RHR typically rises slightly — normal for this phase",
    ],
    nutrition: [
      "Iron-rich foods: red meat, lentils, leafy greens — you're losing iron",
      "Anti-inflammatory: turmeric, ginger, omega-3s to ease cramping",
      "Magnesium glycinate reduces cramp severity (and helps sleep)",
      "Extra hydration — you need more fluid right now",
    ],
    readinessNote: "Oura readiness often dips in menstrual phase. Trust your body over the score.",
  },
  follicular: {
    label: "Follicular", color: "#00E5D4", emoji: "🌒", days: "Days 6–13",
    intensity: "HIGH — BUILD & PR",
    workout: [
      "Best phase for strength gains — estrogen boosts muscle protein synthesis",
      "Go hard on Ascend: heavy lifts, progressive overload, new PRs",
      "Energy and motivation are peaking — capitalize on it",
      "Good time to try new movements or harder progressions",
    ],
    recovery: [
      "Recovery is faster in this phase — shorter rest between sessions is fine",
      "Sleep quality typically improves as estrogen rises",
      "HRV should be trending upward — great sign",
      "Your pain tolerance is higher right now, so push but stay form-focused",
    ],
    nutrition: [
      "Higher carbs support peak performance and glycogen replenishment",
      "Lean protein to support muscle synthesis gains",
      "Estrogen supports fat metabolism — your body burns fat more efficiently",
      "Consistent meals over fasting — you want fuel for intensity",
    ],
    readinessNote: "Follicular = your superpower phase. High readiness scores are common. Use them.",
  },
  ovulatory: {
    label: "Ovulatory", color: "#FFD700", emoji: "🌕", days: "Days 14–17",
    intensity: "PEAK — MAXIMUM OUTPUT",
    workout: [
      "Absolute peak strength and power window — train heavy",
      "Best time for cardio PRs, HIIT, and high-intensity Ascend",
      "Coordination and reaction time are at their best",
      "Abs work especially effective — core strength peaks near ovulation",
    ],
    recovery: [
      "Joint laxity increases around ovulation — warm up thoroughly",
      "Ligament injury risk is slightly elevated: prioritize form over load",
      "Sleep may be lighter; this is normal and temporary",
      "Body temperature rises ~0.5°C at ovulation — you may feel warmer",
    ],
    nutrition: [
      "High protein to support peak muscle output",
      "Antioxidant-rich foods: berries, dark chocolate, cruciferous veggies",
      "Zinc supports healthy ovulation: pumpkin seeds, beef, chickpeas",
      "Stay extra hydrated — thermoregulation is slightly off",
    ],
    readinessNote: "Temp deviation in Oura will tick up at ovulation — totally expected, not illness.",
  },
  luteal: {
    label: "Luteal", color: "#CC44FF", emoji: "🌘", days: "Days 18–28",
    intensity: "MODERATE — SMART WORK",
    workout: [
      "Shift to moderate intensity: strength maintenance, not building",
      "Pilates and Abs shine here — lower intensity, still effective",
      "Your body burns more calories at rest — don't overtrain on top of that",
      "Listen hard to fatigue signals, especially in late luteal (days 24–28)",
    ],
    recovery: [
      "Sleep disruption is common as progesterone spikes then drops",
      "HRV tends to dip in late luteal — prioritize rest days",
      "Magnesium glycinate before bed dramatically improves sleep quality now",
      "PMS symptoms (bloating, mood) are real physiological events — honor them",
    ],
    nutrition: [
      "Complex carbs reduce PMS: sweet potato, oats, brown rice",
      "Magnesium (400mg) reduces PMS symptoms significantly",
      "Reduce caffeine and alcohol — both worsen PMS and disrupt sleep",
      "Cravings are hormonal and real — balanced meals prevent blood sugar swings",
    ],
    readinessNote: "Readiness dip in late luteal is predictable. Adjust expectations, not just effort.",
  },
};

function CyclePanel({ cycle, readiness }: { cycle: CyclePhaseInfo | null; readiness: OuraData["readiness"] }) {
  const [open, setOpen] = useState(true);
  const [manualPhase, setManualPhase] = useState<string | null>(null);

  const ouraPhase = cycle?.phase && cycle.phase !== "not_applicable" && cycle.phase !== "unknown"
    ? cycle.phase : null;
  const activePhase = ouraPhase ?? manualPhase;
  const isManual = !ouraPhase && !!manualPhase;

  const info = activePhase ? CYCLE_PHASES[activePhase] : null;

  const readinessScore = readiness?.score ?? null;
  const adjustedLabel = info && readinessScore
    ? readinessScore >= 85
      ? `${info.intensity} · Readiness confirms: go hard`
      : readinessScore >= 70
      ? `${info.intensity} · Readiness says: train smart`
      : `${info.intensity} · But low readiness — dial it back today`
    : info?.intensity ?? "";

  return (
    <div style={{ marginBottom: 24 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%", background: "none", border: "none", cursor: "pointer",
          padding: 0, marginBottom: open ? 10 : 0,
        }}
      >
        <NeonLabel color={info?.color ?? C.purple}>
          Cycle Intelligence{info ? ` · ${info.days}` : ""}
          {isManual ? " · MANUAL" : ouraPhase ? " · FROM OURA" : ""}
        </NeonLabel>
        <span style={{ fontSize: 9, color: C.muted, fontFamily: "monospace" }}>{open ? "▲ COLLAPSE" : "▼ EXPAND"}</span>
      </button>

      {/* Phase picker — shown when Oura has no data OR as override */}
      {open && !ouraPhase && (
        <div style={{
          background: C.card, border: `1px solid ${C.border}`,
          borderRadius: 6, padding: "14px 16px", marginBottom: 10,
        }}>
          <p style={{ fontSize: 9, color: C.muted, fontFamily: "monospace", marginBottom: 10, letterSpacing: "0.1em" }}>
            OURA CYCLE TRACKING NOT DETECTED · SELECT YOUR CURRENT PHASE
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {Object.entries(CYCLE_PHASES).map(([key, ph]) => (
              <button key={key} onClick={() => setManualPhase(key === manualPhase ? null : key)}
                style={{
                  background: manualPhase === key ? `${ph.color}22` : "transparent",
                  border: `2px solid ${manualPhase === key ? ph.color : C.border}`,
                  borderRadius: 6, padding: "10px 8px", cursor: "pointer",
                  textAlign: "center", transition: "all 0.15s",
                  boxShadow: manualPhase === key ? `0 0 10px ${ph.color}44` : "none",
                }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{ph.emoji}</div>
                <p style={{ fontSize: 9, fontWeight: 900, color: manualPhase === key ? ph.color : C.muted, letterSpacing: "0.08em" }}>
                  {ph.label.toUpperCase()}
                </p>
                <p style={{ fontSize: 8, color: C.muted, marginTop: 2 }}>{ph.days}</p>
              </button>
            ))}
          </div>
          <p style={{ fontSize: 8, color: C.border, marginTop: 10, fontFamily: "monospace" }}>
            TIP: Enable cycle tracking in the Oura app under Health &gt; Women&apos;s Health to get automatic phase detection.
          </p>
        </div>
      )}

      {open && info && (
        <div style={{
          background: C.card, border: `2px solid ${info.color}`,
          borderRadius: 6, overflow: "hidden",
          boxShadow: `0 0 20px ${info.color}22, 0 0 48px ${info.color}0C`,
        }}>
          {/* Phase header */}
          <div style={{
            background: `linear-gradient(135deg, ${info.color}22, ${info.color}08)`,
            borderBottom: `1px solid ${info.color}33`,
            padding: "14px 18px",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 28 }}>{info.emoji}</span>
              <div>
                <p style={{ fontSize: 16, fontWeight: 900, color: info.color, lineHeight: 1, letterSpacing: "0.02em" }}>
                  {info.label.toUpperCase()} PHASE
                </p>
                {cycle?.cycle_day && (
                  <p style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>
                    Cycle Day {cycle.cycle_day}
                    {cycle.confidence && cycle.confidence !== "high" ? ` · ${cycle.confidence} confidence` : ""}
                  </p>
                )}
              </div>
            </div>
            <div style={{
              fontSize: 8, fontWeight: 900, color: info.color,
              background: `${info.color}18`, border: `1px solid ${info.color}44`,
              borderRadius: 4, padding: "5px 10px", letterSpacing: "0.1em",
              textAlign: "center", maxWidth: 180,
            }}>
              {adjustedLabel}
            </div>
          </div>

          {/* Tips grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0 }}>
            {[
              { icon: "💪", title: "TRAINING", tips: info.workout, color: info.color },
              { icon: "🌙", title: "RECOVERY", tips: info.recovery, color: C.purple },
              { icon: "🥗", title: "NUTRITION", tips: info.nutrition, color: C.teal },
            ].map(({ icon, title, tips, color }, idx) => (
              <div key={title} style={{
                padding: "14px 16px",
                borderRight: idx < 2 ? `1px solid ${C.border}` : "none",
              }}>
                <p style={{ fontSize: 9, fontWeight: 900, color, letterSpacing: "0.12em", marginBottom: 10, fontFamily: "monospace" }}>
                  {icon} {title}
                </p>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
                  {tips.map((tip, i) => (
                    <li key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                      <span style={{ color, fontSize: 8, marginTop: 2, flexShrink: 0 }}>▸</span>
                      <span style={{ fontSize: 10, color: C.white, lineHeight: 1.4 }}>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Readiness context */}
          <div style={{
            borderTop: `1px solid ${C.border}`,
            padding: "10px 18px",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontSize: 9, color: info.color }}>⚡</span>
            <p style={{ fontSize: 9, color: C.muted, fontFamily: "monospace", fontStyle: "italic" }}>
              {info.readinessNote}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

interface Session { id: number; session_date: string; workout_type: string; notes: string | null; }
interface Measurement { id: number; measurement_date: string; weight_lbs: number | null; chest_in: number | null; waist_in: number | null; hips_in: number | null; arms_in: number | null; thighs_in: number | null; notes: string | null; }
interface BodyGoal { target_weight_lbs: number | null; target_date: string | null; notes: string | null; }
interface StepEntry { id: number; logged_date: string; step_count: number; }

const C = {
  bg:     "#0A0A14",
  card:   "#12121E",
  card2:  "#1A1A28",
  pink:   "#FF1E8C",
  yellow: "#FFD700",
  teal:   "#00E5D4",
  purple: "#CC44FF",
  white:  "#F0EEF8",
  muted:  "#7A7A99",
  border: "#2A2A3E",
};

const WORKOUT_TYPES = [
  { key: "ascend",  label: "Ascend",  icon: "💀", color: C.pink,   tag: "HOME TEAM"  },
  { key: "flex",    label: "Abs",     icon: "⚡", color: C.teal,   tag: "ABS"        },
  { key: "pilates", label: "Pilates", icon: "👑", color: C.purple, tag: "PILATES"    },
] as const;

const STEP_GOAL = 10000;

function DccCard({ children, color = C.pink, style = {} }: { children: React.ReactNode; color?: string; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: C.card, border: `2px solid ${color}`, borderRadius: 6,
      boxShadow: `0 0 10px ${color}44, 0 0 28px ${color}18`,
      padding: "16px 18px", position: "relative", ...style,
    }}>
      {children}
    </div>
  );
}

function NeonLabel({ children, color = C.muted }: { children: React.ReactNode; color?: string }) {
  return (
    <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase", color, fontFamily: "monospace", marginBottom: 6 }}>
      {children}
    </p>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", background: "#0A0A14", border: `1px solid #2A2A3E`,
  borderRadius: 4, padding: "8px 12px", color: "#F0EEF8", fontSize: 13,
  fontFamily: "monospace", outline: "none", boxSizing: "border-box",
};
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 9, fontWeight: 900, letterSpacing: "0.12em",
  textTransform: "uppercase", color: "#7A7A99", marginBottom: 4, fontFamily: "monospace",
};

export default function GymPage() {
  const { earnXP } = useXP();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [goal, setGoal] = useState<BodyGoal | null>(null);
  const [steps, setSteps] = useState<StepEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [oura, setOura] = useState<OuraData | null>(null);
  const [ouraError, setOuraError] = useState(false);

  const [showMeasForm, setShowMeasForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [expandedMeas, setExpandedMeas] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [todayStepInput, setTodayStepInput] = useState("");
  const [savingSteps, setSavingSteps] = useState(false);
  const [savingWorkout, setSavingWorkout] = useState<string | null>(null);
  const [showDonut, setShowDonut] = useState(false);

  const [measForm, setMeasForm] = useState({
    measurement_date: new Date().toISOString().split("T")[0],
    weight_lbs: "", chest_in: "", waist_in: "", hips_in: "", arms_in: "", thighs_in: "", notes: "",
  });
  const [goalForm, setGoalForm] = useState({ target_weight_lbs: "", target_date: "", notes: "" });

  async function loadData() {
    // Fetch Oura independently so DB errors don't block it
    fetch("/api/oura").then((r) => r.json()).then((ou) => {
      if (ou && !ou.error) setOura(ou);
      else setOuraError(true);
    }).catch(() => setOuraError(true));

    const [s, m, st] = await Promise.all([
      fetch("/api/gym/sessions").then((r) => r.json()),
      fetch("/api/gym/measurements").then((r) => r.json()),
      fetch("/api/gym/steps").then((r) => r.json()),
    ]);
    setSessions(s);
    setMeasurements(m.measurements || []);
    setGoal(m.goal || null);
    setSteps(st);
    // Pre-fill today's steps if already logged
    const today = new Date().toISOString().split("T")[0];
    const todayEntry = st.find((e: StepEntry) => e.logged_date === today);
    if (todayEntry) setTodayStepInput(String(todayEntry.step_count));
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  const today = new Date().toISOString().split("T")[0];

  function isTodayLogged(type: string) {
    return sessions.some((s) => s.session_date === today && s.workout_type === type);
  }

  async function logWorkout(type: string) {
    if (isTodayLogged(type) || savingWorkout) return;
    // Optimistic update — show celebration immediately
    const optimistic: Session = { id: Date.now(), session_date: today, workout_type: type, notes: null };
    setSessions((prev) => [optimistic, ...prev]);
    setShowDonut(true);
    earnXP("workout_log", { label: "Workout logged", questKey: "log_workout" });
    // Save to DB in background
    setSavingWorkout(type);
    try {
      const res = await fetch("/api/gym/sessions", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_date: today, workout_type: type, exercises: [] }),
      });
      const session = await res.json();
      if (session.id) setSessions((prev) => prev.map((s) => s.id === optimistic.id ? session : s));
    } catch { /* optimistic update stands */ }
    setSavingWorkout(null);
  }

  async function deleteSession(id: number) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    await fetch(`/api/gym/sessions/${id}`, { method: "DELETE" });
  }

  async function saveSteps() {
    if (!todayStepInput || savingSteps) return;
    setSavingSteps(true);
    await fetch("/api/gym/steps", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logged_date: today, step_count: Number(todayStepInput) }),
    });
    await loadData();
    setSavingSteps(false);
  }

  async function logMeasurement(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/gym/measurements", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        measurement_date: measForm.measurement_date,
        weight_lbs: measForm.weight_lbs ? Number(measForm.weight_lbs) : null,
        chest_in: measForm.chest_in ? Number(measForm.chest_in) : null,
        waist_in: measForm.waist_in ? Number(measForm.waist_in) : null,
        hips_in: measForm.hips_in ? Number(measForm.hips_in) : null,
        arms_in: measForm.arms_in ? Number(measForm.arms_in) : null,
        thighs_in: measForm.thighs_in ? Number(measForm.thighs_in) : null,
        notes: measForm.notes || null,
      }),
    });
    await loadData();
    setShowMeasForm(false);
    setMeasForm({ measurement_date: today, weight_lbs: "", chest_in: "", waist_in: "", hips_in: "", arms_in: "", thighs_in: "", notes: "" });
    setSaving(false);
    earnXP("measurement_log", { label: "Measurements logged" });
  }

  async function saveGoal(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/gym/measurements", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "goal", target_weight_lbs: goalForm.target_weight_lbs ? Number(goalForm.target_weight_lbs) : null, target_date: goalForm.target_date || null, notes: goalForm.notes }),
    });
    await loadData();
    setShowGoalForm(false);
    setSaving(false);
  }

  // ── Weekly grid: last 7 days ──────────────────────────────────────────────
  const last7 = Array.from({ length: 7 }, (_, i) => subDays(new Date(), 6 - i));

  function getStepsForDate(date: Date) {
    const d = date.toISOString().split("T")[0];
    return steps.find((s) => s.logged_date === d)?.step_count ?? null;
  }

  function getWorkoutsForDate(date: Date) {
    const d = date.toISOString().split("T")[0];
    return sessions.filter((s) => s.session_date === d).map((s) => s.workout_type);
  }

  // Weight progress toward goal
  const latestWeight = measurements.find((m) => m.weight_lbs)?.weight_lbs;
  const goalWeight = goal?.target_weight_lbs;
  const startWeight = measurements.length > 0 ? measurements[measurements.length - 1]?.weight_lbs : null;
  const weightPct = latestWeight && goalWeight && startWeight && startWeight !== goalWeight
    ? Math.min(100, Math.max(0, Math.round(((startWeight - latestWeight) / (startWeight - goalWeight)) * 100)))
    : 0;

  const sessionsThisWeek = last7.filter((d) => getWorkoutsForDate(d).length > 0).length;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", margin: "-24px -24px -24px", padding: "28px 28px 48px", fontFamily: "monospace" }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${C.pink}, ${C.yellow}, ${C.teal}, transparent)`, marginBottom: 20, borderRadius: 1 }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center",
              background: `linear-gradient(135deg, ${C.pink}33, ${C.purple}33)`,
              border: `2px solid ${C.pink}`, borderRadius: 6, fontSize: 26,
              boxShadow: `0 0 12px ${C.pink}55`,
            }}>🩳</div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: C.white, lineHeight: 1.1, letterSpacing: "-0.01em" }}>
                DUNGEON ANARCHIST&apos;S COOKBOOK
              </h1>
              <p style={{ fontSize: 10, color: C.muted, marginTop: 3 }}>
                {sessionsThisWeek} session{sessionsThisWeek !== 1 ? "s" : ""} this week · Team Ascend · +20 XP per encounter
              </p>
            </div>
          </div>
          <div style={{
            fontSize: 10, fontWeight: 900, color: C.yellow,
            background: `${C.yellow}15`, border: `1px solid ${C.yellow}44`,
            borderRadius: 4, padding: "4px 10px", letterSpacing: "0.1em",
            boxShadow: `0 0 6px ${C.yellow}33`,
          }}>
            ★ BEST IN DUNGEON · {sessions.length} TOTAL
          </div>
        </div>
        <div style={{
          marginTop: 14, padding: "10px 16px",
          background: `linear-gradient(135deg, ${C.yellow}12, ${C.pink}08)`,
          border: `1px solid ${C.yellow}33`, borderRadius: 4,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <p style={{ fontSize: 13, fontWeight: 900, color: C.yellow, letterSpacing: "0.05em" }}>
            💀 YOU WILL NOT BREAK ME 💀
          </p>
          <span style={{ fontSize: 10, color: C.muted }}>— Carl, probably, between sets</span>
        </div>
      </div>

      {/* ── Oura Panel ── */}
      {!ouraError && (
        <div style={{ marginBottom: 24 }}>
          <NeonLabel color={C.purple}>Oura · Today&apos;s Recovery</NeonLabel>
          {!oura ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {[1,2,3,4].map((i) => (
                <div key={i} style={{ height: 80, background: `${C.purple}11`, border: `1px solid ${C.border}`, borderRadius: 6 }} />
              ))}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {/* Readiness */}
              {oura.readiness && (() => {
                const s = oura.readiness!.score;
                const color = s >= 85 ? C.teal : s >= 70 ? C.yellow : C.pink;
                const label = s >= 85 ? "PUSH HARD" : s >= 70 ? "TRAIN NORMAL" : "TAKE IT EASY";
                return (
                  <DccCard color={color} style={{ textAlign: "center", padding: "12px 10px" }}>
                    <NeonLabel color={color}>Readiness</NeonLabel>
                    <p style={{ fontSize: 30, fontWeight: 900, color, lineHeight: 1 }}>{s}</p>
                    <p style={{ fontSize: 8, color, marginTop: 4, letterSpacing: "0.1em", fontWeight: 900 }}>{label}</p>
                  </DccCard>
                );
              })()}
              {/* Sleep */}
              {oura.sleep && (() => {
                const s = oura.sleep!.score;
                const color = s >= 85 ? C.teal : s >= 70 ? C.yellow : C.pink;
                return (
                  <DccCard color={color} style={{ textAlign: "center", padding: "12px 10px" }}>
                    <NeonLabel color={color}>Sleep Score</NeonLabel>
                    <p style={{ fontSize: 30, fontWeight: 900, color, lineHeight: 1 }}>{s}</p>
                    {oura.sleep!.duration_hours && (
                      <p style={{ fontSize: 8, color: C.muted, marginTop: 4 }}>{oura.sleep!.duration_hours}h last night</p>
                    )}
                  </DccCard>
                );
              })()}
              {/* HRV */}
              {oura.readiness?.hrv_balance != null && (
                <DccCard color={C.purple} style={{ textAlign: "center", padding: "12px 10px" }}>
                  <NeonLabel color={C.purple}>HRV Balance</NeonLabel>
                  <p style={{ fontSize: 30, fontWeight: 900, color: C.purple, lineHeight: 1 }}>
                    {oura.readiness!.hrv_balance}
                  </p>
                  <p style={{ fontSize: 8, color: C.muted, marginTop: 4 }}>contributor score</p>
                </DccCard>
              )}
              {/* RHR */}
              {oura.readiness?.resting_heart_rate != null && (
                <DccCard color={C.teal} style={{ textAlign: "center", padding: "12px 10px" }}>
                  <NeonLabel color={C.teal}>Resting HR</NeonLabel>
                  <p style={{ fontSize: 30, fontWeight: 900, color: C.teal, lineHeight: 1 }}>
                    {oura.readiness!.resting_heart_rate}
                  </p>
                  <p style={{ fontSize: 8, color: C.muted, marginTop: 4 }}>BPM contributor</p>
                </DccCard>
              )}
              {/* Body temp if available */}
              {oura.readiness?.temperature_deviation != null && (
                <DccCard color={C.yellow} style={{ textAlign: "center", padding: "12px 10px" }}>
                  <NeonLabel color={C.yellow}>Temp Deviation</NeonLabel>
                  <p style={{ fontSize: 26, fontWeight: 900, color: C.yellow, lineHeight: 1 }}>
                    {oura.readiness!.temperature_deviation! > 0 ? "+" : ""}
                    {oura.readiness!.temperature_deviation!.toFixed(1)}°
                  </p>
                  <p style={{ fontSize: 8, color: C.muted, marginTop: 4 }}>from baseline</p>
                </DccCard>
              )}
              {/* Oura steps if available */}
              {oura.activity?.active_calories != null && (
                <DccCard color={C.pink} style={{ textAlign: "center", padding: "12px 10px" }}>
                  <NeonLabel color={C.pink}>Active Cal</NeonLabel>
                  <p style={{ fontSize: 26, fontWeight: 900, color: C.pink, lineHeight: 1 }}>
                    {oura.activity!.active_calories!.toLocaleString()}
                  </p>
                  <p style={{ fontSize: 8, color: C.muted, marginTop: 4 }}>kcal burned</p>
                </DccCard>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Cycle Intelligence Panel ── */}
      {!ouraError && oura !== null && (
        <CyclePanel cycle={oura.cycle} readiness={oura.readiness} />
      )}

      {/* ── TODAY section ── */}
      <div style={{ marginBottom: 24 }}>
        <NeonLabel color={C.teal}>Today&apos;s Log — {format(new Date(), "EEEE, MMM d")}</NeonLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
          {WORKOUT_TYPES.map(({ key, label, icon, color, tag }) => {
            const done = isTodayLogged(key);
            const busy = savingWorkout === key;
            return (
              <button key={key} onClick={() => logWorkout(key)} disabled={done || !!savingWorkout}
                style={{
                  background: done ? `${color}22` : C.card,
                  border: `2px solid ${done ? color : C.border}`,
                  borderRadius: 6, padding: "14px 10px", cursor: done ? "default" : "pointer",
                  textAlign: "center", transition: "all 0.15s",
                  boxShadow: done ? `0 0 12px ${color}55` : "none",
                }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{done ? "✅" : icon}</div>
                <p style={{ fontSize: 11, fontWeight: 900, color: done ? color : C.white, letterSpacing: "0.05em" }}>{label}</p>
                <p style={{ fontSize: 8, color: done ? color : C.muted, letterSpacing: "0.1em", marginTop: 2 }}>
                  {done ? "COMPLETE" : busy ? "LOGGING..." : tag}
                </p>
              </button>
            );
          })}

          {/* Steps card */}
          <div style={{ background: C.card, border: `2px solid ${C.border}`, borderRadius: 6, padding: "14px 10px" }}>
            <div style={{ fontSize: 24, marginBottom: 6, textAlign: "center" }}>👟</div>
            <p style={{ fontSize: 11, fontWeight: 900, color: C.white, letterSpacing: "0.05em", textAlign: "center", marginBottom: 6 }}>Steps</p>
            <div style={{ display: "flex", gap: 4 }}>
              <input
                type="number"
                value={todayStepInput}
                onChange={(e) => setTodayStepInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveSteps()}
                placeholder="8,000"
                style={{ ...inputStyle, fontSize: 11, padding: "5px 8px", flex: 1, minWidth: 0 }}
              />
              <button onClick={saveSteps} disabled={savingSteps || !todayStepInput}
                style={{
                  background: `${C.teal}22`, border: `1px solid ${C.teal}66`,
                  borderRadius: 4, padding: "5px 8px", color: C.teal,
                  fontSize: 10, fontWeight: 900, cursor: "pointer",
                }}>
                {savingSteps ? "…" : "✓"}
              </button>
            </div>
            {todayStepInput && (
              <div style={{ marginTop: 6 }}>
                <div style={{ height: 3, background: C.border, borderRadius: 2 }}>
                  <div style={{
                    height: "100%", borderRadius: 2,
                    width: `${Math.min(100, (Number(todayStepInput) / STEP_GOAL) * 100)}%`,
                    background: Number(todayStepInput) >= STEP_GOAL ? C.teal : C.muted,
                    transition: "width 0.3s",
                  }} />
                </div>
                <p style={{ fontSize: 8, color: C.muted, marginTop: 2, textAlign: "center" }}>
                  {Number(todayStepInput) >= STEP_GOAL ? "GOAL HIT 🎉" : `/ ${STEP_GOAL.toLocaleString()} goal`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Weekly grid ── */}
      <DccCard color={C.teal} style={{ marginBottom: 24 }}>
        <NeonLabel color={C.teal}>This Week</NeonLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
          {last7.map((date, i) => {
            const workouts = getWorkoutsForDate(date);
            const stepCount = getStepsForDate(date);
            const isToday = isSameDay(date, new Date());
            return (
              <div key={i} style={{ textAlign: "center" }}>
                <p style={{ fontSize: 8, color: isToday ? C.teal : C.muted, fontWeight: isToday ? 900 : 400, marginBottom: 4, letterSpacing: "0.08em" }}>
                  {format(date, "EEE").toUpperCase()}
                </p>
                <p style={{ fontSize: 9, color: isToday ? C.white : C.muted, marginBottom: 6 }}>
                  {format(date, "d")}
                </p>
                {/* Workout dots */}
                <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center" }}>
                  {WORKOUT_TYPES.map(({ key, color }) => (
                    <div key={key} style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: workouts.includes(key) ? color : C.border,
                      boxShadow: workouts.includes(key) ? `0 0 4px ${color}` : "none",
                    }} />
                  ))}
                </div>
                {/* Step bar */}
                {stepCount !== null && (
                  <div style={{ marginTop: 5 }}>
                    <div style={{ height: 20, width: 8, background: C.border, borderRadius: 2, margin: "0 auto", position: "relative", overflow: "hidden" }}>
                      <div style={{
                        position: "absolute", bottom: 0, left: 0, right: 0,
                        height: `${Math.min(100, (stepCount / STEP_GOAL) * 100)}%`,
                        background: stepCount >= STEP_GOAL ? C.teal : `${C.teal}66`,
                        borderRadius: 2,
                      }} />
                    </div>
                    <p style={{ fontSize: 7, color: C.muted, marginTop: 2 }}>
                      {stepCount >= 1000 ? `${(stepCount / 1000).toFixed(1)}k` : stepCount}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {/* Legend */}
        <div style={{ display: "flex", gap: 12, marginTop: 12, paddingTop: 10, borderTop: `1px solid ${C.border}`, flexWrap: "wrap" }}>
          {WORKOUT_TYPES.map(({ key, label, color }) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: `0 0 4px ${color}` }} />
              <span style={{ fontSize: 9, color: C.muted }}>{label}</span>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: C.teal }} />
            <span style={{ fontSize: 9, color: C.muted }}>Steps</span>
          </div>
        </div>
      </DccCard>

      {/* ── Body Recomp ── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <NeonLabel color={C.purple}>Body Recomp Progress</NeonLabel>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setShowMeasForm(true)}
              style={{
                background: `${C.pink}22`, border: `1px solid ${C.pink}66`,
                borderRadius: 4, padding: "5px 12px", color: C.pink,
                fontSize: 9, fontWeight: 900, cursor: "pointer", letterSpacing: "0.08em",
              }}>
              + LOG MEASUREMENTS
            </button>
            <button onClick={() => setShowGoalForm(true)}
              style={{
                background: `${C.yellow}15`, border: `1px solid ${C.yellow}44`,
                borderRadius: 4, padding: "5px 12px", color: C.yellow,
                fontSize: 9, fontWeight: 900, cursor: "pointer", letterSpacing: "0.08em",
              }}>
              {goal ? "EDIT GOAL" : "SET GOAL"}
            </button>
          </div>
        </div>

        {/* Goal progress bar */}
        {goal?.target_weight_lbs && latestWeight && (
          <DccCard color={C.purple} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div>
                <NeonLabel color={C.purple}>Mission: Body Recomp</NeonLabel>
                <p style={{ fontSize: 11, color: C.muted }}>
                  {latestWeight} lbs → {goal.target_weight_lbs} lbs
                  {goal.target_date ? ` · Target: ${format(parseISO(goal.target_date), "MMM d, yyyy")}` : ""}
                </p>
              </div>
              <p style={{ fontSize: 22, fontWeight: 900, color: C.purple }}>{weightPct}%</p>
            </div>
            <div style={{ height: 6, background: C.border, borderRadius: 3, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${weightPct}%`,
                background: `linear-gradient(90deg, ${C.purple}, ${C.pink})`,
                borderRadius: 3, transition: "width 0.5s",
                boxShadow: `0 0 8px ${C.purple}66`,
              }} />
            </div>
            <p style={{ fontSize: 9, color: C.muted, marginTop: 4 }}>
              {latestWeight && goal.target_weight_lbs
                ? `${Math.abs(latestWeight - goal.target_weight_lbs).toFixed(1)} lbs to objective`
                : ""}
            </p>
          </DccCard>
        )}

        {/* Measurement form */}
        {showMeasForm && (
          <DccCard color={C.pink} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div>
                <NeonLabel color={C.pink}>Stat Screen Update</NeonLabel>
                <p style={{ fontSize: 14, fontWeight: 900, color: C.white }}>Log Measurements</p>
              </div>
              <button onClick={() => setShowMeasForm(false)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer" }}>
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>
            <form onSubmit={logMeasurement} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={labelStyle}>Date</label>
                <input type="date" style={inputStyle} value={measForm.measurement_date}
                  onChange={(e) => setMeasForm((f) => ({ ...f, measurement_date: e.target.value }))} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={labelStyle}>Weight (lbs)</label>
                  <input type="number" step="0.1" style={inputStyle} placeholder="150.0" value={measForm.weight_lbs}
                    onChange={(e) => setMeasForm((f) => ({ ...f, weight_lbs: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Waist (in)</label>
                  <input type="number" step="0.25" style={inputStyle} placeholder="28.0" value={measForm.waist_in}
                    onChange={(e) => setMeasForm((f) => ({ ...f, waist_in: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Hips (in)</label>
                  <input type="number" step="0.25" style={inputStyle} placeholder="38.0" value={measForm.hips_in}
                    onChange={(e) => setMeasForm((f) => ({ ...f, hips_in: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Chest (in)</label>
                  <input type="number" step="0.25" style={inputStyle} placeholder="34.0" value={measForm.chest_in}
                    onChange={(e) => setMeasForm((f) => ({ ...f, chest_in: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Arms (in)</label>
                  <input type="number" step="0.25" style={inputStyle} placeholder="11.0" value={measForm.arms_in}
                    onChange={(e) => setMeasForm((f) => ({ ...f, arms_in: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Thighs (in)</label>
                  <input type="number" step="0.25" style={inputStyle} placeholder="22.0" value={measForm.thighs_in}
                    onChange={(e) => setMeasForm((f) => ({ ...f, thighs_in: e.target.value }))} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Notes</label>
                <input style={inputStyle} placeholder="Anything to note..." value={measForm.notes}
                  onChange={(e) => setMeasForm((f) => ({ ...f, notes: e.target.value }))} />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button type="submit" disabled={saving} style={{
                  flex: 1, background: `linear-gradient(135deg, ${C.pink}, #CC0066)`,
                  border: "none", borderRadius: 4, padding: "10px 0",
                  color: C.white, fontSize: 11, fontWeight: 900, cursor: "pointer",
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  boxShadow: `0 0 10px ${C.pink}44, 0 2px 0 #880044`,
                }}>
                  {saving ? "Saving..." : "📊 Save Stats"}
                </button>
                <button type="button" onClick={() => setShowMeasForm(false)} style={{
                  background: "none", border: `1px solid ${C.border}`, borderRadius: 4,
                  padding: "10px 14px", color: C.muted, fontSize: 11, fontWeight: 900, cursor: "pointer",
                }}>
                  Flee
                </button>
              </div>
            </form>
          </DccCard>
        )}

        {/* Goal form */}
        {showGoalForm && (
          <DccCard color={C.yellow} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div>
                <NeonLabel color={C.yellow}>Mission Objective</NeonLabel>
                <p style={{ fontSize: 14, fontWeight: 900, color: C.white }}>Set Recomp Goal</p>
              </div>
              <button onClick={() => setShowGoalForm(false)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer" }}>
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>
            <form onSubmit={saveGoal} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={labelStyle}>Target Weight (lbs)</label>
                  <input type="number" step="0.1" style={inputStyle} placeholder="140.0" value={goalForm.target_weight_lbs}
                    onChange={(e) => setGoalForm((f) => ({ ...f, target_weight_lbs: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Target Date</label>
                  <input type="date" style={inputStyle} value={goalForm.target_date}
                    onChange={(e) => setGoalForm((f) => ({ ...f, target_date: e.target.value }))} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Notes / Strategy</label>
                <textarea style={{ ...inputStyle, resize: "vertical" }} rows={2}
                  placeholder="Donut's watching. Make her proud." value={goalForm.notes}
                  onChange={(e) => setGoalForm((f) => ({ ...f, notes: e.target.value }))} />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button type="submit" disabled={saving} style={{
                  flex: 1, background: `linear-gradient(135deg, ${C.yellow}, #CC9900)`,
                  border: "none", borderRadius: 4, padding: "10px 0",
                  color: "#000", fontSize: 11, fontWeight: 900, cursor: "pointer",
                  letterSpacing: "0.08em", textTransform: "uppercase",
                }}>
                  {saving ? "Saving..." : "👑 Lock In Objective"}
                </button>
                <button type="button" onClick={() => setShowGoalForm(false)} style={{
                  background: "none", border: `1px solid ${C.border}`, borderRadius: 4,
                  padding: "10px 14px", color: C.muted, fontSize: 11, fontWeight: 900, cursor: "pointer",
                }}>
                  Cancel
                </button>
              </div>
            </form>
          </DccCard>
        )}

        {/* Measurement history */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[1,2].map((i) => <div key={i} style={{ height: 60, background: `${C.purple}11`, borderRadius: 4, border: `1px solid ${C.border}` }} />)}
          </div>
        ) : measurements.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "28px 0",
            border: `1px dashed ${C.border}`, borderRadius: 6,
          }}>
            <p style={{ fontSize: 13, fontWeight: 900, color: C.white, marginBottom: 4 }}>NO STAT SCREEN DATA</p>
            <p style={{ fontSize: 10, color: C.muted }}>Log your first measurements to start tracking recomp progress.</p>
            <p style={{ fontSize: 9, color: C.purple, marginTop: 6, fontStyle: "italic" }}>
              "Mordecai insists on accurate records, Carl." — Princess Donut
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {measurements.map((m) => {
              const isExpanded = expandedMeas === m.id;
              const hasTape = m.waist_in || m.hips_in || m.chest_in || m.arms_in || m.thighs_in;
              return (
                <div key={m.id} style={{
                  background: C.card, border: `1px solid ${C.border}`,
                  borderRadius: 5, padding: "12px 14px",
                  borderLeft: `3px solid ${C.purple}`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 10, fontWeight: 900, color: C.muted, marginBottom: 4 }}>
                        {format(parseISO(m.measurement_date), "EEEE, MMM d, yyyy")}
                      </p>
                      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                        {m.weight_lbs && (
                          <span style={{ fontSize: 14, fontWeight: 900, color: C.white }}>
                            {m.weight_lbs} <span style={{ fontSize: 9, color: C.muted }}>LBS</span>
                          </span>
                        )}
                        {m.waist_in && (
                          <span style={{ fontSize: 12, color: C.purple }}>
                            W: {m.waist_in}&quot;
                          </span>
                        )}
                        {m.hips_in && (
                          <span style={{ fontSize: 12, color: C.purple }}>
                            H: {m.hips_in}&quot;
                          </span>
                        )}
                        {!hasTape && <span style={{ fontSize: 10, color: C.muted }}>weight only</span>}
                      </div>
                    </div>
                    {hasTape && (
                      <button onClick={() => setExpandedMeas(isExpanded ? null : m.id)}
                        style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", padding: 4 }}>
                        {isExpanded ? <ChevronUp style={{ width: 14, height: 14 }} /> : <ChevronDown style={{ width: 14, height: 14 }} />}
                      </button>
                    )}
                  </div>
                  {isExpanded && hasTape && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.border}`, display: "flex", gap: 16, flexWrap: "wrap" }}>
                      {[
                        { label: "Chest", val: m.chest_in },
                        { label: "Waist", val: m.waist_in },
                        { label: "Hips",  val: m.hips_in  },
                        { label: "Arms",  val: m.arms_in  },
                        { label: "Thighs",val: m.thighs_in},
                      ].filter((x) => x.val).map(({ label, val }) => (
                        <div key={label} style={{ textAlign: "center" }}>
                          <p style={{ fontSize: 8, color: C.muted, letterSpacing: "0.1em", marginBottom: 2 }}>{label.toUpperCase()}</p>
                          <p style={{ fontSize: 13, fontWeight: 900, color: C.purple }}>{val}&quot;</p>
                        </div>
                      ))}
                      {m.notes && <p style={{ fontSize: 10, color: C.muted, fontStyle: "italic", width: "100%" }}>{m.notes}</p>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Recent Sessions log ── */}
      <div>
        <NeonLabel color={C.pink}>Combat Log — Recent Sessions</NeonLabel>
        {sessions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px 0", border: `1px dashed ${C.border}`, borderRadius: 6 }}>
            <p style={{ fontSize: 11, color: C.muted }}>{"No sessions logged yet. The dungeon awaits."}</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {sessions.slice(0, 20).map((session) => {
              const conf = WORKOUT_TYPES.find((w) => w.key === session.workout_type) ?? WORKOUT_TYPES[0];
              return (
                <div key={session.id} style={{
                  background: C.card, border: `1px solid ${C.border}`,
                  borderLeft: `3px solid ${conf.color}`,
                  borderRadius: 5, padding: "10px 14px",
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                  <span style={{ fontSize: 18 }}>{conf.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 11, fontWeight: 900, color: C.white }}>
                      {format(parseISO(session.session_date), "EEE, MMM d")}
                    </p>
                    <span style={{
                      fontSize: 8, fontWeight: 900, color: conf.color,
                      background: `${conf.color}22`, border: `1px solid ${conf.color}44`,
                      borderRadius: 3, padding: "1px 5px", letterSpacing: "0.1em",
                    }}>
                      {conf.tag}
                    </span>
                    {session.notes && <p style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{session.notes}</p>}
                  </div>
                  <button onClick={() => deleteSession(session.id)}
                    style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", padding: 4 }}>
                    <Trash2 style={{ width: 12, height: 12 }} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div style={{ marginTop: 32, paddingTop: 16, borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
        <p style={{ fontSize: 9, color: C.border, letterSpacing: "0.15em" }}>
          SPONSORED BY THE ROYAL COURT OF PRINCESS DONUT · GODDAMMIT DONUT! · YOU WILL NOT BREAK ME
        </p>
      </div>

      {/* ── Princess Donut celebration ── */}
      {showDonut && <DonutCelebration onDone={() => setShowDonut(false)} />}

    </div>
  );
}
