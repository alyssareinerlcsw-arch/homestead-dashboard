"use client";

// ── Peony flower for card corners ──────────────────────────────────────────
export function PeonyCorner({
  size = 52,
  petalColor = "#C8807A",
  leafColor = "#7A9E70",
  style = {},
}: {
  size?: number;
  petalColor?: string;
  leafColor?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 52 52" fill="none"
      style={{ display: "block", ...style }}
    >
      {/* outer petals */}
      {[0, 72, 144, 216, 288].map((a, i) => (
        <ellipse key={`o${i}`} cx="26" cy="10" rx="6" ry="10"
          fill={petalColor} opacity="0.5" transform={`rotate(${a} 26 26)`} />
      ))}
      {/* mid petals */}
      {[36, 108, 180, 252, 324].map((a, i) => (
        <ellipse key={`m${i}`} cx="26" cy="14" rx="4.5" ry="8"
          fill={petalColor} opacity="0.7" transform={`rotate(${a} 26 26)`} />
      ))}
      {/* inner petals */}
      {[18, 90, 162, 234, 306].map((a, i) => (
        <ellipse key={`in${i}`} cx="26" cy="18" rx="3" ry="5.5"
          fill={petalColor} opacity="0.85" transform={`rotate(${a} 26 26)`} />
      ))}
      {/* center */}
      <circle cx="26" cy="26" r="7" fill="#F5D0C0" />
      <circle cx="26" cy="26" r="4" fill={petalColor} opacity="0.9" />
      <circle cx="24.5" cy="24.5" r="1.5" fill="rgba(255,255,255,0.65)" />
      {/* leaves */}
      <ellipse cx="42" cy="42" rx="7" ry="3.5" fill={leafColor} opacity="0.6"
        transform="rotate(-38 42 42)" />
      <ellipse cx="38" cy="46" rx="5.5" ry="2.5" fill={leafColor} opacity="0.45"
        transform="rotate(-15 38 46)" />
      <ellipse cx="46" cy="37" rx="5" ry="2.5" fill={leafColor} opacity="0.5"
        transform="rotate(-55 46 37)" />
    </svg>
  );
}

// ── Small vine sprig ────────────────────────────────────────────────────────
export function VineSprig({ color = "#7A9E70", size = 28, style = {} }: { color?: string; size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" style={style}>
      <path d="M14 26 C 11 20, 8 15, 10 8 C 11 4, 14 3, 14 3"
        stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <ellipse cx="9" cy="10" rx="4.5" ry="2.3" fill={color} opacity="0.55"
        transform="rotate(-32 9 10)" />
      <ellipse cx="8.5" cy="17" rx="4" ry="2.1" fill={color} opacity="0.5"
        transform="rotate(22 8.5 17)" />
      <ellipse cx="11.5" cy="6" rx="3.5" ry="1.8" fill={color} opacity="0.45"
        transform="rotate(-52 11.5 6)" />
    </svg>
  );
}

// ── 4-point sparkle star ────────────────────────────────────────────────────
export function Sparkle({ size = 16, color = "#C8A060", opacity = 0.7 }: { size?: number; color?: string; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" style={{ display: "inline-block", flexShrink: 0 }}>
      <path
        d="M10 1 L11.8 8.2 L19 10 L11.8 11.8 L10 19 L8.2 11.8 L1 10 L8.2 8.2 Z"
        fill={color} opacity={opacity}
      />
    </svg>
  );
}

// ── Tiny diamond sparkle ────────────────────────────────────────────────────
export function DiamondSpark({ color = "#C8A060", size = 10 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" style={{ display: "inline-block" }}>
      <path d="M5 0.5 L5.9 4.1 L9.5 5 L5.9 5.9 L5 9.5 L4.1 5.9 L0.5 5 L4.1 4.1 Z"
        fill={color} opacity="0.6" />
    </svg>
  );
}

// ── Emoji icon badge (replaces pixel art sprites) ───────────────────────────
export function IconBadge({
  emoji,
  size = 52,
  bg = "rgba(200,128,122,0.13)",
  border = "rgba(200,128,122,0.22)",
  radius,
}: {
  emoji: string;
  size?: number;
  bg?: string;
  border?: string;
  radius?: number;
}) {
  return (
    <div
      style={{
        width: size, height: size,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: Math.floor(size * 0.48),
        background: bg,
        border: `1.5px solid ${border}`,
        borderRadius: radius ?? Math.floor(size * 0.32),
        flexShrink: 0,
      }}
    >
      {emoji}
    </div>
  );
}

// ── Window card header bar (retro OS / Friendly Reminder style) ─────────────
export function WindowHeader({
  title,
  color = "rose",
  children,
}: {
  title?: string;
  color?: "rose" | "sage" | "gold" | "blue";
  children?: React.ReactNode;
}) {
  const palettes = {
    rose: { bg: "linear-gradient(135deg, #C8807A 0%, #DDA090 50%, #C07872 100%)", text: "#FBF7F1", dot: "#F0B0A0" },
    sage: { bg: "linear-gradient(135deg, #7A9E70 0%, #96B288 50%, #709060 100%)", text: "#F0F7EC", dot: "#B0D0A0" },
    gold: { bg: "linear-gradient(135deg, #C0904A 0%, #D8AE78 50%, #B88040 100%)", text: "#FBF5E8", dot: "#F0D090" },
    blue: { bg: "linear-gradient(135deg, #8098B0 0%, #9EB4C8 50%, #7090A8 100%)", text: "#EEF4F8", dot: "#B0CCE0" },
  };
  const p = palettes[color];
  return (
    <div
      style={{
        background: p.bg,
        borderRadius: "18px 18px 0 0",
        padding: "10px 16px",
        margin: "-20px -20px 16px",
        display: "flex",
        alignItems: "center",
        gap: 6,
        borderBottom: "1px solid rgba(100,60,40,0.12)",
      }}
    >
      {/* Window dots */}
      <div style={{ display: "flex", gap: 4, marginRight: 4 }}>
        {["rgba(255,255,255,0.5)", "rgba(255,255,255,0.35)", "rgba(255,255,255,0.25)"].map((c, i) => (
          <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: c, border: "1px solid rgba(0,0,0,0.08)" }} />
        ))}
      </div>
      <Sparkle size={10} color={p.dot} opacity={0.7} />
      {title && (
        <span style={{ flex: 1, textAlign: "center", fontFamily: "Georgia", fontSize: 11, color: p.text, opacity: 0.85, letterSpacing: "0.06em" }}>
          {title}
        </span>
      )}
      {children}
      <Sparkle size={10} color={p.dot} opacity={0.7} />
    </div>
  );
}

// ── Illustrated cloud banner (replaces FarmBanner) ─────────────────────────
export function CloudBanner({ height = 140 }: { height?: number }) {
  const h = height;
  return (
    <svg
      viewBox={`0 0 900 ${h}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", display: "block" }}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="cbSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#EEE4D4" />
          <stop offset="100%" stopColor="#E8DDD0" />
        </linearGradient>
        <linearGradient id="cbCL" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B8C8A8" />
          <stop offset="100%" stopColor="#9EB298" />
        </linearGradient>
        <linearGradient id="cbCR" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#B8C8A8" />
          <stop offset="100%" stopColor="#9EB298" />
        </linearGradient>
        <linearGradient id="cbCM" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#AABCA0" />
          <stop offset="100%" stopColor="#96AA8E" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="900" height={h} fill="url(#cbSky)" />

      {/* Stars / sparkles in sky */}
      {[
        [180, 28], [320, 18], [480, 32], [600, 22], [730, 30], [850, 16],
        [90, 42], [260, 38], [540, 44], [680, 36],
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <path d="M0,-4 L1,-1 L4,0 L1,1 L0,4 L-1,1 L-4,0 L-1,-1 Z"
            fill="#C8A060" opacity={i % 3 === 0 ? 0.6 : 0.4} />
        </g>
      ))}

      {/* Left cloud mass */}
      <g opacity="0.88">
        <ellipse cx="10"   cy={h + 10} rx="100" ry="72"  fill="#B2C4A2" />
        <ellipse cx="80"   cy={h}       rx="85"  ry="62"  fill="url(#cbCL)" />
        <ellipse cx="155"  cy={h + 5}   rx="90"  ry="65"  fill="#AABE9C" />
        <ellipse cx="50"   cy={h - 20}  rx="68"  ry="52"  fill="#BED0AE" />
        <ellipse cx="130"  cy={h - 30}  rx="60"  ry="46"  fill="#B4C8A4" />
        <ellipse cx="30"   cy={h - 38}  rx="50"  ry="38"  fill="#C0D2B0" />
        <ellipse cx="100"  cy={h - 50}  rx="52"  ry="40"  fill="#AABE9A" />
        {/* gold outlines */}
        <path d={`M0,${h} C30,${h - 45} 70,${h - 58} 110,${h - 48} S160,${h - 20} 200,${h}`}
          fill="none" stroke="#C8A060" strokeWidth="1.2" opacity="0.3" />
        <path d={`M10,${h - 20} C40,${h - 60} 80,${h - 72} 120,${h - 58} S165,${h - 35} 185,${h - 5}`}
          fill="none" stroke="#C8A060" strokeWidth="0.8" opacity="0.25" />
      </g>

      {/* Right cloud mass */}
      <g opacity="0.88">
        <ellipse cx="890"  cy={h + 10} rx="100" ry="72"  fill="#B2C4A2" />
        <ellipse cx="820"  cy={h}       rx="85"  ry="62"  fill="url(#cbCR)" />
        <ellipse cx="745"  cy={h + 5}   rx="90"  ry="65"  fill="#AABE9C" />
        <ellipse cx="850"  cy={h - 20}  rx="68"  ry="52"  fill="#BED0AE" />
        <ellipse cx="770"  cy={h - 30}  rx="60"  ry="46"  fill="#B4C8A4" />
        <ellipse cx="870"  cy={h - 38}  rx="50"  ry="38"  fill="#C0D2B0" />
        <ellipse cx="800"  cy={h - 50}  rx="52"  ry="40"  fill="#AABE9A" />
        {/* gold outlines */}
        <path d={`M900,${h} C870,${h - 45} 830,${h - 58} 790,${h - 48} S740,${h - 20} 700,${h}`}
          fill="none" stroke="#C8A060" strokeWidth="1.2" opacity="0.3" />
        <path d={`M890,${h - 20} C860,${h - 60} 820,${h - 72} 780,${h - 58} S735,${h - 35} 715,${h - 5}`}
          fill="none" stroke="#C8A060" strokeWidth="0.8" opacity="0.25" />
      </g>

      {/* Center bottom wisps */}
      <ellipse cx="450" cy={h + 20} rx="120" ry="45" fill="#B8CAA8" opacity="0.45" />
      <ellipse cx="390" cy={h + 5}  rx="80"  ry="35" fill="#AABE9A" opacity="0.35" />
      <ellipse cx="510" cy={h + 5}  rx="80"  ry="35" fill="#AABE9A" opacity="0.35" />
    </svg>
  );
}
