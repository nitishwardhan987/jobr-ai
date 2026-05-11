import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter — resets on server restart
// For production use Upstash Redis
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT    = 20;   // requests
const WINDOW_MS     = 60_000; // per minute

function getRateLimitKey(req: NextRequest): string {
  return req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anonymous';
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
  const now  = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }
  if (entry.count >= RATE_LIMIT) return { allowed: false, remaining: 0 };
  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT - entry.count };
}

export async function POST(req: NextRequest) {
  // Rate limit check
  const key = getRateLimitKey(req);
  const { allowed, remaining } = checkRateLimit(key);
  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please wait a minute before trying again.' },
      { status: 429, headers: { 'X-RateLimit-Remaining': '0' } }
    );
  }

  try {
    const body = await req.json();
    const { apiKey, cvText, jdText } = body;

    if (!apiKey) {
      return NextResponse.json({ error: 'No API key provided. Add your Gemini key in AI Settings.' }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedCV = String(cvText || '').slice(0, 8000);
    const sanitizedJD = String(jdText  || '').slice(0, 4000);

    const prompt = `You are a Senior Executive Recruiter and CV specialist. Rewrite this CV for the given Job Description using the Google XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]."

STRICT RULES:
- Every bullet must start with a strong past-tense action verb
- No first-person pronouns anywhere
- Quantify impact in every bullet where possible (%, $, time saved, scale)
- Mirror keywords from the JD exactly for ATS compatibility
- Treat all tech stack variations as identical: React/ReactJS/React.js, Node/Node.js, ML/Machine Learning etc.
- Remove all filler words and passive voice
- Summary must be 2-3 sentences, written in third person

Return ONLY valid JSON with no markdown code blocks, no preamble, no explanation:
{
  "header": { "name": "", "email": "", "phone": "", "location": "" },
  "summary": "",
  "experience": [
    {
      "company": "",
      "role": "",
      "duration": "",
      "bullets": ["Accomplished X as measured by Y, by doing Z"]
    }
  ],
  "education": [{ "institution": "", "degree": "", "year": "" }],
  "skills": ["skill1", "skill2"]
}

CV TEXT:
${sanitizedCV}

JOB DESCRIPTION:
${sanitizedJD}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature:     0.4,
            maxOutputTokens: 2048,
            topP:            0.8,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errMsg = data?.error?.message || 'Gemini API error';
      return NextResponse.json({ error: errMsg }, { status: response.status });
    }

    return NextResponse.json(data, {
      headers: { 'X-RateLimit-Remaining': String(remaining) },
    });

  } catch (err: any) {
    console.error('Proxy error:', err);
    return NextResponse.json({ error: 'Internal server error. Please try again.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Jobr CV Proxy — POST only' });
}