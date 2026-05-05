import { NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"

export async function POST(req: NextRequest) {
  try {
    const { access_token, to, subject, body, pdf_base64, candidate_name } = await req.json()

    if (!access_token || !to || !subject || !body) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    )
    oauth2Client.setCredentials({ access_token })

    const gmail = google.gmail({ version: "v1", auth: oauth2Client })

    // Build MIME message with optional PDF attachment
    const boundary = "jobr_boundary_" + Date.now()
    let rawEmail: string

    if (pdf_base64) {
      const filename = `${(candidate_name || "CV").replace(/\s+/g, "_")}_CV.pdf`
      rawEmail = [
        `MIME-Version: 1.0`,
        `To: ${to}`,
        `Subject: ${subject}`,
        `Content-Type: multipart/mixed; boundary="${boundary}"`,
        ``,
        `--${boundary}`,
        `Content-Type: text/plain; charset="UTF-8"`,
        `Content-Transfer-Encoding: quoted-printable`,
        ``,
        body,
        ``,
        `--${boundary}`,
        `Content-Type: application/pdf; name="${filename}"`,
        `Content-Disposition: attachment; filename="${filename}"`,
        `Content-Transfer-Encoding: base64`,
        ``,
        pdf_base64,
        `--${boundary}--`,
      ].join("\r\n")
    } else {
      rawEmail = [
        `MIME-Version: 1.0`,
        `To: ${to}`,
        `Subject: ${subject}`,
        `Content-Type: text/plain; charset="UTF-8"`,
        ``,
        body,
      ].join("\r\n")
    }

    const encoded = Buffer.from(rawEmail)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "")

    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: encoded },
    })

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    console.error("Gmail send error:", err)
    const msg = err instanceof Error ? err.message : "Failed to send email"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
