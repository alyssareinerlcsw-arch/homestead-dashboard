import { NextResponse } from "next/server";
import { google } from "googleapis";

function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/gmail/callback`
  );
}

export async function GET() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return NextResponse.json({ error: "GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET not set" }, { status: 503 });
  }

  const auth = getOAuth2Client();
  const url = auth.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/gmail.readonly"],
    prompt: "consent", // force refresh token every time
  });

  return NextResponse.redirect(url);
}
