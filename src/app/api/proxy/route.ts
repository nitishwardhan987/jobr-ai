import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { apiKey, cvText, jdText } = await req.json();

    if (!apiKey) return NextResponse.json({ error: 'Gemini API key is required. Get one free at aistudio.google.com' }, { status: 400 });
    if (!cvText) return NextResponse.json({ error: 'CV text is required' }, { status: 400 });
    if (!jdText) return NextResponse.json({ error: 'Job description is required' }, { status: 400 });

    const systemPrompt = `You are a Senior Executive Recruiter. Rewrite the CV for the given Job Description using the Google XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]."

RULES:
- Every bullet starts with a strong action verb
- No first-person pronouns (no I, my, me)
- Quantify impact wherever possible
- Mirror keywords from the JD for ATS
- Remove filler: "successfully", "effectively", "passionate", "results-driven"
- Summary: 2-3 sentences max, third-person

Return ONLY valid JSON, no markdown, no explanation:
{
  "header": { "name": "", "email": "", "phone": "", "location": "", "linkedin": "" },
  "summary": "",
  "experience": [{ "company": "", "role": "", "duration": "", "bullets": [""] }],
  "skills": [""]
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\n[CV TEXT]\n${cvText}\n\n[JOB DESCRIPTION]\n${jdText}` }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 2048 },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const msg = data?.error?.message || 'Gemini API error';
      if (msg.includes('API_KEY_INVALID') || msg.includes('API key not valid'))
        return NextResponse.json({ error: 'Invalid API key. Check it at aistudio.google.com' }, { status: 401 });
      if (msg.includes('QUOTA_EXCEEDED') || msg.includes('quota'))
        return NextResponse.json({ error: 'Gemini quota exceeded. Try again in a minute.' }, { status: 429 });
      return NextResponse.json({ error: msg }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}