import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { apiKey, cvText, jdText } = await req.json();
    const systemPrompt = `ROLE: Senior Executive Recruiter. TASK: Rewrite CV for this JD using Google XYZ formula. OUTPUT: Return ONLY a valid JSON object. { "summary": "...", "experience": [{"company": "...", "role": "...", "duration": "...", "bullets": []}], "skills": [] }`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${systemPrompt}\n\nCV: ${cvText}\n\nJD: ${jdText}` }] }]
      })
    });

    const data = await response.json();
    if (!response.ok) return NextResponse.json({ error: data.error?.message || "Gemini Error" }, { status: response.status });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Proxy Server Error" }, { status: 500 });
  }
}