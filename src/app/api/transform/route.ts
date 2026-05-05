import Anthropic from "@anthropic-ai/sdk"
import { NextRequest, NextResponse } from "next/server"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are a precision CV transformer. Return ONLY a valid JSON object — no preamble, no markdown fences, no explanation.

PHASE 1 — JD DEEP SCAN (internal, not in output):
- TOP5_SKILLS: five must-have technical or domain skills most weighted in the JD
- PAIN_POINTS: two primary problems this role is hired to solve
- TONE: one of [aggressive-startup | structured-corporate | collaborative-creative | technical-precise]
- KEYWORDS: all ATS-critical terms verbatim from the JD

PHASE 2 — TRANSFORMATION RULES:

RULE 1 — XYZ REWRITE: Every experience bullet follows "Accomplished [X] as measured by [Y], by doing [Z]." Start with an action verb. No first-person pronouns. Max 22 words per bullet.

RULE 2 — GAP BRIDGING: If a TOP5_SKILL has no direct match, rephrase adjacent experience to show transferable competency. Never invent roles or employers.

RULE 3 — KEYWORD INJECTION: Each experience entry contains at least two KEYWORDS verbatim, woven naturally.

RULE 4 — SO WHAT CHECK: Every bullet maps to one outcome: revenue_impact | cost_reduction | time_saved | risk_mitigated | user_growth | quality_improved. Remove bullets that map to nothing.

RULE 5 — ZERO FOOTPRINT: Remove all of: "I have tailored", "based on your interest", "successfully", "effectively", "efficiently", "passionately", "results-driven", "detail-oriented", "synergy", "leverage". No first-person in bullets.

RULE 6 — TONE CALIBRATION (email_draft only):
  aggressive-startup    → short sentences, active verbs (built/shipped/scaled), no pleasantries
  structured-corporate  → formal salutation, cultural-fit paragraph, measured confidence
  collaborative-creative → light narrative opener, team impact, warm close
  technical-precise     → lead with stack match, quantify everything, skip personality

RULE 7 — LENGTH: Summary 3 sentences max. Bullets 2–4 per role. Designed for 1 page (2 max if 8+ years exp).

OUTPUT — return exactly this JSON structure, all fields required:
{
  "header": { "name": "", "email": "", "phone": "", "linkedin": "", "location": "" },
  "summary": "",
  "experience": [{ "company": "", "title": "", "duration": "", "bullets": [""] }],
  "skills": { "matched": [""], "bridged": ["skill (via adjacent)"], "tools": [""] },
  "education": [{ "institution": "", "degree": "", "year": "" }],
  "projects": [{ "name": "", "outcome": "", "stack": [""] }],
  "email_draft": { "subject": "", "body": "" },
  "meta": {
    "ats_score_estimate": 0,
    "tone_detected": "",
    "gaps_bridged": [],
    "outcome_tags": []
  }
}`

// Validation — runs before we return to the client
function validate(cv: Record<string, unknown>): string[] {
  const errors: string[] = []
  const BANNED = [
    "i have tailored", "based on your interest", "successfully",
    "effectively", "efficiently", "passionately", "results-driven",
    "detail-oriented", "synergy", "as an ai",
  ]

  const exp = cv.experience as Array<{ bullets: string[] }> | undefined
  const draft = cv.email_draft as { body?: string; subject?: string } | undefined
  const summary = cv.summary as string | undefined
  const meta = cv.meta as { ats_score_estimate?: number } | undefined

  const allText = [
    summary ?? "",
    ...(exp ?? []).flatMap((e) => e.bullets),
    draft?.body ?? "",
  ].join(" ").toLowerCase()

  BANNED.forEach((p) => { if (allText.includes(p)) errors.push(`Banned phrase: "${p}"`) })

  if ((meta?.ats_score_estimate ?? 0) < 70)
    errors.push(`ATS score ${meta?.ats_score_estimate} is below threshold`)

  ;(exp ?? []).forEach((role, ri) => {
    role.bullets.forEach((b, bi) => {
      const words = b.trim().split(/\s+/).length
      if (words > 28) errors.push(`Role[${ri}] bullet[${bi}] is ${words} words — max 28`)
      if (/\b(i |i'm |i've |my |myself )\b/i.test(b))
        errors.push(`Role[${ri}] bullet[${bi}] contains first-person pronoun`)
    })
  })

  return errors
}

export async function POST(req: NextRequest) {
  try {
    const { cv_text, jd_text, user_name, user_email } = await req.json()

    if (!cv_text || !jd_text) {
      return NextResponse.json({ error: "cv_text and jd_text are required" }, { status: 400 })
    }

    const userMessage = `[RAW_CV]\n${cv_text}\n\n[JD_TEXT]\n${jd_text}\n\n[USER_NAME]\n${user_name || "Job Applicant"}\n\n[USER_EMAIL]\n${user_email || ""}`

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    })

    const rawText = (message.content[0] as { text: string }).text
    const cleaned = rawText.replace(/```json|```/g, "").trim()

    let cv: Record<string, unknown>
    try {
      cv = JSON.parse(cleaned)
    } catch {
      return NextResponse.json(
        { error: "AI returned invalid JSON. Please try again.", raw: rawText.slice(0, 300) },
        { status: 502 }
      )
    }

    const errors = validate(cv)
    if (errors.length > 0) {
      // Retry once with errors fed back
      const retry = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: [
          { role: "user", content: userMessage },
          { role: "assistant", content: cleaned },
          { role: "user", content: `Fix these validation errors and return corrected JSON only:\n${errors.join("\n")}` },
        ],
      })
      const retryText = (retry.content[0] as { text: string }).text
      try {
        cv = JSON.parse(retryText.replace(/```json|```/g, "").trim())
      } catch {
        return NextResponse.json({ error: "Retry also failed.", errors }, { status: 502 })
      }
    }

    return NextResponse.json({ cv, usage: message.usage })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
