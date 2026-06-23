import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Alyssa's natal chart — Oct 17, 1989, 8:12 PM, Ridgewood NJ
const CHART = {
  sun: "Libra",
  venus: "Sagittarius", // wardrobe ruler
  mars: "Gemini",       // makeup ruler
  palette: "True Autumn",
  hair: "auburn/red",
};

function getLunarPhase(date: Date): { phase: string; emoji: string; cycleDay: number } {
  const knownNewMoon = new Date("2000-01-06T18:14:00Z");
  const synodicPeriod = 29.53058867;
  const diffDays = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  const cycleDay = ((diffDays % synodicPeriod) + synodicPeriod) % synodicPeriod;

  if (cycleDay < 1.85)  return { phase: "New Moon",        emoji: "🌑", cycleDay };
  if (cycleDay < 7.38)  return { phase: "Waxing Crescent", emoji: "🌒", cycleDay };
  if (cycleDay < 9.22)  return { phase: "First Quarter",   emoji: "🌓", cycleDay };
  if (cycleDay < 14.77) return { phase: "Waxing Gibbous",  emoji: "🌔", cycleDay };
  if (cycleDay < 16.61) return { phase: "Full Moon",        emoji: "🌕", cycleDay };
  if (cycleDay < 22.15) return { phase: "Waning Gibbous",  emoji: "🌖", cycleDay };
  if (cycleDay < 23.99) return { phase: "Last Quarter",    emoji: "🌗", cycleDay };
  return                       { phase: "Waning Crescent", emoji: "🌘", cycleDay };
}

function getSeason(date: Date): string {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  if ((m === 3 && d >= 20) || m === 4 || m === 5 || (m === 6 && d < 21)) return "Spring";
  if ((m === 6 && d >= 21) || m === 7 || m === 8 || (m === 9 && d < 22)) return "Summer";
  if ((m === 9 && d >= 22) || m === 10 || m === 11 || (m === 12 && d < 21)) return "Autumn";
  return "Winter";
}

export async function GET() {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "GEMINI_API_KEY not set" }, { status: 503 });
  }

  const today = new Date();
  const dayOfWeek = today.toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = today.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const { phase, emoji, cycleDay } = getLunarPhase(today);
  const season = getSeason(today);
  const lunarIntensity = cycleDay < 14.77 ? "building" : "releasing";

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `You are Alyssa's personal astrologer and stylist. Create her daily lookbook.

ASTROLOGICAL PROFILE:
- Sun: ${CHART.sun} — aesthetic, balance, harmony, beauty, social grace
- Venus: ${CHART.venus} (wardrobe ruler) — magnetic, deep, transformative, sensual, quality > quantity, nothing basic, always a hint of mystery
- Mars: ${CHART.mars} (makeup ruler) — refined, symmetrical, balanced glamour, soft power, never harsh
- Hair: ${CHART.hair}
- Color Palette: ${CHART.palette} — rich, warm, muted earth tones ONLY

TRUE AUTUMN PALETTE — use ONLY these tones:
Wearable: rust (#B5451B), terracotta (#C4704A), warm brown (#7A4828), chocolate (#3D1F10), camel (#C49A6C), mustard gold (#C4982A), olive (#6B7C3A), forest green (#2D4A28), burgundy (#6B1E2A), warm teal (#2A5A54), burnt orange (#D4621A), warm cream (#F0E0CC)
NEVER suggest: black, white, grey, navy, pastels, cool tones, neons, silver

TODAY:
- Date: ${dateStr} (${dayOfWeek})
- Season: ${season}
- Moon: ${emoji} ${phase} (day ${Math.round(cycleDay)} of cycle — energy is ${lunarIntensity})

${phase === "New Moon" ? "New Moon energy: dark, potent, initiating. Lean into deep tones, set intentions." : ""}
${phase === "Full Moon" ? "Full Moon energy: peak luminosity, dramatic, expressive. Go bold within her palette." : ""}
${phase.includes("Waxing") ? "Waxing energy: building, growing, reaching outward. Slightly bolder than usual." : ""}
${phase.includes("Waning") ? "Waning energy: releasing, introspective, cocooning. Softer and more comforting." : ""}

Return ONLY valid JSON — no explanation:
{
  "energy": "2-3 word poetic theme for today",
  "workout": {
    "title": "evocative outfit name (3-5 words)",
    "description": "2-3 sentences. Specific pieces, how to style them, True Autumn colors. Scorpio Venus means even her gym look has intention — quality fabrics, nothing sloppy, an aesthetic even at 6am.",
    "colors": ["#hexcode1", "#hexcode2", "#hexcode3"],
    "colorNames": ["name1", "name2", "name3"],
    "keyPieces": ["specific piece 1", "specific piece 2", "specific piece 3"]
  },
  "work": {
    "title": "evocative outfit name",
    "description": "2-3 sentences. Scorpio Venus at work: polished, magnetic, quietly powerful. Not trying to impress — already there.",
    "colors": ["#hexcode1", "#hexcode2", "#hexcode3"],
    "colorNames": ["name1", "name2", "name3"],
    "keyPieces": ["specific piece 1", "specific piece 2", "specific piece 3"]
  },
  "lounge": {
    "title": "evocative outfit name",
    "description": "2-3 sentences. Scorpio Venus doesn't do frumpy even at home. Cozy with character.",
    "colors": ["#hexcode1", "#hexcode2", "#hexcode3"],
    "colorNames": ["name1", "name2", "name3"],
    "keyPieces": ["specific piece 1", "specific piece 2", "specific piece 3"]
  },
  "makeup": {
    "title": "look name",
    "description": "2-3 sentences. Mars in Libra: symmetry, softness, effortless balance. Complement auburn hair — warm tawny shadows, peachy-nude or berry lips, golden skin. Adjust intensity to the lunar phase.",
    "steps": ["skin/base (be specific)", "eyes (be specific)", "cheeks (be specific)", "lips + finish (be specific)"],
    "vibe": "one word"
  },
  "mantra": "A specific, potent daily mantra for a Libra sun with Scorpio depth. Reflect the ${phase} and ${season}. Personal, not generic. 1-2 sentences."
}`;

  try {
    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");
    const data = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      ...data,
      date: dateStr,
      dayOfWeek,
      lunarPhase: phase,
      lunarEmoji: emoji,
      season,
      chart: CHART,
    });
  } catch (err) {
    console.error("Lookbook generation error:", err);
    return NextResponse.json({ error: "Failed to generate lookbook", detail: String(err) }, { status: 500 });
  }
}
