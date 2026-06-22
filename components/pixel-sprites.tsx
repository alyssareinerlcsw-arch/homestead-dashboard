// Stardew Valley-style pixel art sprites rendered as inline SVGs.
// Each pixel = one rect at the given scale. shape-rendering: crispEdges keeps hard edges.

interface SpriteProps {
  size?: number;
  className?: string;
}

const S = 3; // base pixel size (renders 16x16 grid at 48px)

type PixelGrid = string[];
type ColorMap = Record<string, string>;

function Sprite({ grid, colors, size = 48, label }: { grid: PixelGrid; colors: ColorMap; size: number; label: string }) {
  const cols = grid[0].length;
  const rows = grid.length;
  const px = size / Math.max(cols, rows);
  return (
    <svg
      width={size} height={size}
      viewBox={`0 0 ${cols * px} ${rows * px}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ imageRendering: "pixelated" }}
      role="img"
      aria-label={label}
    >
      {grid.map((row, y) =>
        row.split("").map((ch, x) => {
          if (ch === "." || !colors[ch]) return null;
          return (
            <rect
              key={`${x}-${y}`}
              x={x * px} y={y * px}
              width={px} height={px}
              fill={colors[ch]}
              shapeRendering="crispEdges"
            />
          );
        })
      )}
    </svg>
  );
}

// ── Sprout in a pot ──
export function PixelSprout({ size = 48 }: SpriteProps) {
  const grid = [
    "................",
    "......GGG.......",
    ".....GGGG.......",
    "......GGG.......",
    "....gGGGGg......",
    ".....GGGG.......",
    "......GG........",
    "......GG........",
    ".....GGG........",
    "......GG........",
    "....BBBBBB......",
    "...BBBBBBBB.....",
    "...B......B.....",
    "...BBBBBBBB.....",
    "................",
    "................",
  ];
  const colors = { G: "#7AB84A", g: "#5A9A30", B: "#8B6245", b: "#6B4A2A" };
  return <Sprite grid={grid} colors={colors} size={size} label="sprout in a pot" />;
}

// ── Golden Star ──
export function PixelStar({ size = 48 }: SpriteProps) {
  const grid = [
    "................",
    "......YYY.......",
    "......YYY.......",
    "YYYYYYYYYYYYYYY.",
    ".YYYYY.YYY.YYYY.",
    "..YYYYYY.YYYY...",
    "....YYYYYYY.....",
    ".....YYYYY......",
    ".....YYYYY......",
    "....YYYYYYY.....",
    "...YYY...YYY....",
    "..YYY.....YYY...",
    ".YYY.......YYY..",
    "................",
    "................",
    "................",
  ];
  const colors = { Y: "#F0D050", y: "#C8A820" };
  return <Sprite grid={grid} colors={colors} size={size} label="golden star" />;
}

// ── Heart ──
export function PixelHeart({ size = 48, color = "#E8607A" }: SpriteProps & { color?: string }) {
  const grid = [
    "................",
    "..HHH..HHH......",
    ".HHHHHHHHHHH....",
    "HHHHHHHHHHHHHH..",
    "HHHHHHHHHHHHHH..",
    "HHHHHHHHHHHHHH..",
    ".HHHHHHHHHHHH...",
    "..HHHHHHHHHHH...",
    "....HHHHHHH.....",
    ".....HHHHH......",
    "......HHH.......",
    ".......H........",
    "................",
    "................",
    "................",
    "................",
  ];
  const colors = { H: color };
  return <Sprite grid={grid} colors={colors} size={size} label="heart" />;
}

// ── Treasure chest (goals) ──
export function PixelChest({ size = 48 }: SpriteProps) {
  const grid = [
    "................",
    "..BBBBBBBBBB....",
    ".BBBBBBBBBBBBB..",
    ".BGGGGGGGGGGGB..",
    ".BGGGGGGGGGGGB..",
    ".BBBBBBBBBBBBB..",
    ".BBBBBBBBBBBB...",
    ".BB.YYY.YY.BB...",
    ".BB.YYY.YY.BB...",
    ".BBBBBBBBBBBB...",
    ".BBBBBBBBBBBBB..",
    ".B...........B..",
    ".BBBBBBBBBBBBB..",
    "................",
    "................",
    "................",
  ];
  const colors = { B: "#8B6245", G: "#C8A010", Y: "#F0D050" };
  return <Sprite grid={grid} colors={colors} size={size} label="treasure chest" />;
}

// ── Dumbbell / weights ──
export function PixelDumbbell({ size = 48 }: SpriteProps) {
  const grid = [
    "................",
    "....GG....GG....",
    "....GG....GG....",
    "..GGGGGGGGGGGG..",
    "..GGGGGGGGGGGG..",
    "....GG....GG....",
    "....GG....GG....",
    "..GGGGGGGGGGGG..",
    "..GGGGGGGGGGGG..",
    "....GG....GG....",
    "....GG....GG....",
    "................",
    "................",
    "................",
    "................",
    "................",
  ];
  const colors = { G: "#8B8B9A" };
  return <Sprite grid={grid} colors={colors} size={size} label="dumbbell" />;
}

// ── Open book (notes) ──
export function PixelBook({ size = 48 }: SpriteProps) {
  const grid = [
    "................",
    "..BBBBBBBBBBB...",
    ".BBBCCCCbBBBBB..",
    ".BCCCCCCbBBBBB..",
    ".BCCCCCCbBBBBB..",
    ".BCCCCCCbBBBBB..",
    ".BCCCCCCbBBBBB..",
    ".BCCCCCCbBBBBB..",
    ".BCCCCCCbBBBBB..",
    ".BCCCCCCbBBBBB..",
    ".BCCCCCCbBBBBB..",
    ".BBBBBBBBBBBBBB.",
    "..BBBBBBBBBBBBB.",
    "...BBBBBBBBBBB..",
    "................",
    "................",
  ];
  const colors = { B: "#8B7060", C: "#F8F3EA", b: "#7A6050" };
  return <Sprite grid={grid} colors={colors} size={size} label="open book" />;
}

// ── Checklist / scroll (tasks) ──
export function PixelChecklist({ size = 48 }: SpriteProps) {
  const grid = [
    "................",
    "..PPPPPPPPPPP...",
    ".PPPPPPPPPPPPP..",
    ".PP.CCCCCCCCC...",
    ".PP.G.CCCCCCC...",
    ".PP.GG.CCCCCC...",
    ".PP.GGG.CCCCC...",
    ".PP..GG.CCCCC...",
    ".PP...G.CCCCC...",
    ".PP.CCCCCCCCC...",
    ".PP.G.CCCCCCC...",
    ".PP.GG.CCCCCC...",
    ".PPPPPPPPPPPPP..",
    "..PPPPPPPPPPP...",
    "................",
    "................",
  ];
  const colors = { P: "#E8D8B8", C: "#D8C8A0", G: "#5A8240" };
  return <Sprite grid={grid} colors={colors} size={size} label="checklist" />;
}

// ── Target / bullseye (goals) ──
export function PixelTarget({ size = 48 }: SpriteProps) {
  const grid = [
    "................",
    ".....RRRRR......",
    "...RRRRRRRRR....",
    "..RRRWWWWWRRR...",
    ".RRRWWWWWWWRRR..",
    ".RRRWWRRWWWRRR..",
    ".RRRWWRRRWWRRR..",
    ".RRRWWRRWWWRRR..",
    ".RRRWWWWWWWRRR..",
    "..RRRWWWWWRRR...",
    "...RRRRRRRRR....",
    ".....RRRRR......",
    "................",
    "................",
    "................",
    "................",
  ];
  const colors = { R: "#D45050", W: "#F8F3EA", r: "#A83030" };
  return <Sprite grid={grid} colors={colors} size={size} label="target" />;
}

// ── Farm scene banner (for dashboard header) ──
export function FarmBanner({ width = 400, height = 80 }: { width?: number; height?: number }) {
  return (
    <svg
      width={width} height={height}
      viewBox="0 0 100 20"
      xmlns="http://www.w3.org/2000/svg"
      style={{ imageRendering: "pixelated", display: "block", width: "100%", height: "auto" }}
      role="img"
      aria-label="A small pixel art farm scene with a barn, crops, and trees"
    >
      {/* Sky */}
      <rect width="100" height="12" fill="#B8D8F0" />
      {/* Clouds */}
      <rect x="5" y="2" width="8" height="2" fill="#FFFDF6" />
      <rect x="4" y="1" width="10" height="4" rx="1" fill="#FFFDF6" />
      <rect x="22" y="3" width="6" height="2" fill="#FFFDF6" />
      <rect x="21" y="2" width="8" height="3" rx="1" fill="#FFFDF6" />
      <rect x="60" y="1" width="9" height="2" fill="#FFFDF6" />
      <rect x="59" y="0" width="11" height="4" rx="1" fill="#FFFDF6" />
      <rect x="80" y="3" width="7" height="2" fill="#FFFDF6" />
      <rect x="79" y="2" width="9" height="3" rx="1" fill="#FFFDF6" />
      {/* Stars */}
      <rect x="40" y="1" width="1" height="1" fill="#F0D050" />
      <rect x="50" y="2" width="1" height="1" fill="#F0D050" />
      <rect x="70" y="1" width="1" height="1" fill="#F0D050" />
      {/* Hills / ground */}
      <rect x="0" y="11" width="100" height="9" fill="#94C45A" />
      <rect x="0" y="12" width="100" height="8" fill="#7AB84A" />
      <rect x="0" y="14" width="100" height="6" fill="#6AAA3A" />
      {/* Path */}
      <rect x="35" y="14" width="5" height="6" fill="#C8A870" />
      <rect x="36" y="12" width="3" height="2" fill="#C8A870" />
      {/* Barn */}
      <rect x="38" y="6" width="14" height="10" fill="#C05030" />
      <rect x="37" y="5" width="16" height="3" fill="#A03020" />
      <rect x="42" y="10" width="6" height="6" fill="#7A4020" />
      <rect x="43" y="6" width="4" height="4" fill="#F0D050" />
      {/* Barn roof peak */}
      <rect x="40" y="4" width="10" height="2" fill="#A03020" />
      <rect x="43" y="3" width="4" height="2" fill="#A03020" />
      <rect x="45" y="2" width="2" height="2" fill="#A03020" />
      {/* Fence */}
      <rect x="17" y="13" width="1" height="4" fill="#D4B880" />
      <rect x="21" y="13" width="1" height="4" fill="#D4B880" />
      <rect x="25" y="13" width="1" height="4" fill="#D4B880" />
      <rect x="29" y="13" width="1" height="4" fill="#D4B880" />
      <rect x="17" y="14" width="13" height="1" fill="#D4B880" />
      <rect x="17" y="16" width="13" height="1" fill="#D4B880" />
      {/* Crops left */}
      <rect x="19" y="12" width="1" height="2" fill="#4A8A2A" />
      <rect x="18" y="11" width="3" height="2" fill="#7AB84A" />
      <rect x="22" y="12" width="1" height="2" fill="#4A8A2A" />
      <rect x="21" y="11" width="3" height="2" fill="#7AB84A" />
      <rect x="26" y="12" width="1" height="2" fill="#4A8A2A" />
      <rect x="25" y="11" width="3" height="2" fill="#7AB84A" />
      {/* Trees right */}
      <rect x="57" y="10" width="2" height="6" fill="#8B6245" />
      <rect x="54" y="5" width="8" height="6" rx="2" fill="#5A9A30" />
      <rect x="55" y="4" width="6" height="3" rx="1" fill="#4A8A20" />
      <rect x="56" y="3" width="4" height="2" fill="#3A7A10" />
      {/* Flowers */}
      <rect x="52" y="15" width="1" height="1" fill="#E87050" />
      <rect x="55" y="16" width="1" height="1" fill="#E8D050" />
      <rect x="67" y="15" width="1" height="1" fill="#D050E8" />
      <rect x="70" y="16" width="1" height="1" fill="#E87050" />
      <rect x="75" y="15" width="1" height="1" fill="#E8D050" />
      <rect x="85" y="14" width="1" height="1" fill="#70C8E8" />
      {/* Sunflowers */}
      <rect x="72" y="12" width="1" height="4" fill="#4A8A2A" />
      <rect x="71" y="10" width="3" height="3" fill="#F0D050" />
      <rect x="72" y="9" width="1" height="2" fill="#C07818" />
      <rect x="78" y="11" width="1" height="5" fill="#4A8A2A" />
      <rect x="77" y="9" width="3" height="3" fill="#F0D050" />
      <rect x="78" y="8" width="1" height="2" fill="#C07818" />
      {/* Windmill far right */}
      <rect x="88" y="7" width="2" height="9" fill="#D4B880" />
      <rect x="86" y="5" width="6" height="4" fill="#F8F3EA" />
      <rect x="88" y="3" width="2" height="3" fill="#C8A870" />
      <rect x="86" y="8" width="6" height="1" fill="#C8A870" />
      <rect x="89" y="5" width="1" height="5" fill="#C8A870" />
    </svg>
  );
}

// ── Small season icon ──
export function PixelLeaf({ size = 24, color = "#7AB84A" }: SpriteProps & { color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: "pixelated" }} aria-hidden>
      <rect x="3" y="0" width="2" height="1" fill={color} />
      <rect x="2" y="1" width="4" height="1" fill={color} />
      <rect x="1" y="2" width="5" height="1" fill={color} />
      <rect x="0" y="3" width="6" height="1" fill={color} />
      <rect x="1" y="4" width="5" height="1" fill={color} />
      <rect x="2" y="5" width="3" height="1" fill={color} />
      <rect x="3" y="5" width="1" height="3" fill="#8B6245" />
    </svg>
  );
}
