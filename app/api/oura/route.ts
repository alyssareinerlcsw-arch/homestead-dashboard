import { NextResponse } from "next/server";

const BASE = "https://api.ouraring.com/v2/usercollection";

async function ouraFetch(path: string, token: string) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 1800 }, // cache 30 min
  });
  if (!res.ok) throw new Error(`Oura ${path} → ${res.status}`);
  return res.json();
}

export async function GET() {
  const token = process.env.OURA_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "OURA_ACCESS_TOKEN not set" }, { status: 503 });
  }

  // Oura posts previous night's data — look back 3 days to always find latest
  const today = new Date().toISOString().split("T")[0];
  const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0];

  try {
    const [readiness, sleep, activity, cycleData] = await Promise.all([
      ouraFetch(`/daily_readiness?start_date=${threeDaysAgo}&end_date=${today}`, token),
      ouraFetch(`/daily_sleep?start_date=${threeDaysAgo}&end_date=${today}`, token),
      ouraFetch(`/daily_activity?start_date=${threeDaysAgo}&end_date=${today}`, token),
      ouraFetch(`/daily_cycle_phases?start_date=${threeDaysAgo}&end_date=${today}`, token).catch(() => null),
    ]);

    // Take the most recent entry in each
    const r = readiness.data?.[readiness.data.length - 1] ?? null;
    const s = sleep.data?.[sleep.data.length - 1] ?? null;
    const a = activity.data?.[activity.data.length - 1] ?? null;
    const c = cycleData?.data?.[cycleData.data.length - 1] ?? null;

    return NextResponse.json({
      cycle: c ? {
        phase: c.cycle_phase ?? null,
        cycle_day: c.cycle_day ?? null,
        confidence: c.confidence ?? null,
      } : null,
      readiness: r ? {
        score: r.score,
        hrv_balance: r.contributors?.hrv_balance ?? null,
        resting_heart_rate: r.contributors?.resting_heart_rate ?? null,
        sleep_balance: r.contributors?.sleep_balance ?? null,
        activity_balance: r.contributors?.activity_balance ?? null,
        body_temperature: r.contributors?.body_temperature ?? null,
        temperature_deviation: r.temperature_deviation ?? null,
      } : null,
      sleep: s ? {
        score: s.score,
        total_sleep_duration: s.contributors?.total_sleep ?? null,
        rem_sleep: s.contributors?.rem_sleep ?? null,
        deep_sleep: s.contributors?.deep_sleep ?? null,
        efficiency: s.contributors?.efficiency ?? null,
        // total_sleep_duration is in seconds in the full sleep data
        duration_hours: s.total_sleep_duration ? Math.round(s.total_sleep_duration / 360) / 10 : null,
      } : null,
      activity: a ? {
        steps: a.steps ?? null,
        active_calories: a.active_calories ?? null,
        total_calories: a.total_calories ?? null,
        target_calories: a.target_calories ?? null,
        met_minutes: a.met_minutes ?? null,
      } : null,
    });
  } catch (err) {
    console.error("Oura fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch Oura data" }, { status: 502 });
  }
}
