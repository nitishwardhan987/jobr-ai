import { NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")
  const error = req.nextUrl.searchParams.get("error")

  if (error || !code) {
    return NextResponse.redirect(new URL("/?oauth=denied", req.url))
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_BASE_URL}/oauth/callback`
  )

  const { tokens } = await oauth2Client.getToken(code)

  // Store token in a secure httpOnly cookie (expires in 1 hour)
  const res = NextResponse.redirect(new URL("/?oauth=success", req.url))
  res.cookies.set("gmail_token", JSON.stringify(tokens), {
    httpOnly: true,
    secure: true,
    maxAge: 3600,
    path: "/",
    sameSite: "lax",
  })

  return res
}

// Get OAuth URL (called from frontend)
export async function POST(req: NextRequest) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_BASE_URL}/oauth/callback`
  )

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    prompt: "consent",
  })

  return NextResponse.json({ url })
}

// Check if token exists
export async function PUT(req: NextRequest) {
  const token = req.cookies.get("gmail_token")
  if (!token) return NextResponse.json({ connected: false })

  try {
    const tokens = JSON.parse(token.value)
    return NextResponse.json({
      connected: true,
      access_token: tokens.access_token,
    })
  } catch {
    return NextResponse.json({ connected: false })
  }
}
