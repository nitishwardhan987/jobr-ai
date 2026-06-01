import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT    = 20;
const WINDOW_MS     = 60_000;
const FREE_CV_LIMIT = 3;

function getRateLimitKey(req: NextRequest): string {
  return req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anonymous';
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
  const now   = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }
  if (entry.count >= RATE_LIMIT) return { allowed: false, remaining: 0 };
  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT - entry.count };
}

function detectProvider(apiKey: string): 'gemini' | 'openai' | 'anthropic' | 'unknown' {
  if (apiKey.startsWith('AIza'))   return 'gemini';
  if (apiKey.startsWith('sk-ant')) return 'anthropic';
  if (apiKey.startsWith('sk-'))    return 'openai';
  return 'unknown';
}

const CV_PROMPT = (cv: string, jd: string) => `You are a Senior Executive Recruiter and CV specialist. Rewrite this CV for the given Job Description using the Google XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]."

STRICT RULES:
- Every bullet must start with a strong past-tense action verb
- No first-person pronouns anywhere
- Quantify impact in every bullet where possible (%, $, time saved, scale)
- Mirror keywords from the JD exactly for ATS compatibility
- Remove all filler words and passive voice
- Summary must be 2-3 sentences, written in third person

Return ONLY valid JSON with no markdown, no preamble, no explanation:
{
  "header": { "name": "", "email": "", "phone": "", "location": "" },
  "summary": "",
  "experience": [{ "company": "", "role": "", "duration": "", "bullets": [""] }],
  "education": [{ "institution": "", "degree": "", "year": "" }],
  "skills": ["skill1", "skill2"]
}

CV TEXT:
${cv}

JOB DESCRIPTION:
${jd}`;

async function callJobrGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('Add your own free Gemini key in Settings — get one at aistudio.google.com/app/apikey');
  const models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-latest'];
  let lastError = '';
  for (const model of models) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 2048 },
        }),
      }
    );
    const data = await res.json();
    if (res.ok) return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    lastError = data?.error?.message || `Model ${model} failed`;
    const isQuota = res.status === 429 || lastError.toLowerCase().includes('quota') || lastError.toLowerCase().includes('resource_exhausted');
    if (isQuota) throw new Error("Jobr's shared AI quota is full right now. Add your own free Gemini key in Settings — takes 30 seconds at aistudio.google.com/app/apikey");
    if (!lastError.includes('not found') && !lastError.includes('not supported')) break;
  }
  throw new Error(lastError);
}

export async function POST(req: NextRequest) {
  const rlKey = getRateLimitKey(req);
  const { allowed } = checkRateLimit(rlKey);
  if (!allowed) return NextResponse.json({ error: 'Rate limit exceeded. Please wait a minute.' }, { status: 429 });

  try {
    const body = await req.json();
    const { cvText, jdText, userEmail, userApiKey } = body;

    if (!cvText || !jdText) {
      return NextResponse.json({ error: 'CV and Job Description are required.' }, { status: 400 });
    }

    const sanitizedCV = String(cvText).slice(0, 8000);
    const sanitizedJD = String(jdText).slice(0, 4000);
    const prompt      = CV_PROMPT(sanitizedCV, sanitizedJD);

    // ── PATH 1: User brings their own key ─────────────────────────────────────
    if (userApiKey) {
      const provider = detectProvider(userApiKey);

      if (provider === 'gemini') {
        const models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-pro'];
        let lastError = '';
        for (const model of models) {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${userApiKey}`,
            {
              method:  'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.4, maxOutputTokens: 2048 },
              }),
            }
          );
          const data = await res.json();
          if (res.ok) return NextResponse.json(data);
          lastError = data?.error?.message || `Model ${model} failed`;
          if (!lastError.includes('not found') && !lastError.includes('not supported')) break;
        }
        return NextResponse.json({ error: lastError }, { status: 400 });
      }

      if (provider === 'openai') {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userApiKey}` },
          body: JSON.stringify({
            model:       'gpt-4o-mini',
            messages:    [{ role: 'user', content: prompt }],
            max_tokens:  2048,
            temperature: 0.4,
          }),
        });
        const data = await res.json();
        if (!res.ok) return NextResponse.json({ error: data?.error?.message || 'OpenAI error' }, { status: res.status });
        const text = data.choices?.[0]?.message?.content || '';
        return NextResponse.json({ candidates: [{ content: { parts: [{ text }] } }] });
      }

      if (provider === 'anthropic') {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method:  'POST',
          headers: {
            'Content-Type':      'application/json',
            'x-api-key':         userApiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model:      'claude-haiku-4-5-20251001',
            max_tokens: 2048,
            messages:   [{ role: 'user', content: prompt }],
          }),
        });
        const data = await res.json();
        if (!res.ok) return NextResponse.json({ error: data?.error?.message || 'Anthropic error' }, { status: res.status });
        const text = data.content?.[0]?.text || '';
        return NextResponse.json({ candidates: [{ content: { parts: [{ text }] } }] });
      }

      return NextResponse.json({
        error: 'Unknown key format. Use Gemini (AIza...), OpenAI (sk-...), or Anthropic (sk-ant-...) key.',
      }, { status: 400 });
    }

    // ── PATH 2: Use Jobr credits ───────────────────────────────────────────────
    if (!userEmail) {
      return NextResponse.json({
        error: 'Sign in to use Jobr credits, or add your own API key in Settings.',
        requiresAuth: true,
      }, { status: 401 });
    }

    const { data: profile } = await getSupabaseAdmin()
      .from('user_profiles')
      .select('wallet_credits, free_cv_used')
      .eq('email', userEmail)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'User profile not found.' }, { status: 404 });
    }

    const freeUsed      = profile.free_cv_used    || 0;
    const walletCredits = profile.wallet_credits   || 0;

    // Free tier — use Jobr's key, no charge
    if (freeUsed < FREE_CV_LIMIT) {
      const text = await callJobrGemini(prompt);
      await getSupabaseAdmin()
        .from('user_profiles')
        .update({ free_cv_used: freeUsed + 1, updated_at: new Date().toISOString() })
        .eq('email', userEmail);
      return NextResponse.json({
        candidates: [{ content: { parts: [{ text }] } }],
        meta: { mode: 'free', freeUsed: freeUsed + 1, freeLimit: FREE_CV_LIMIT },
      });
    }

    // Free tier used up — check credits
    if (walletCredits < 1) {
      return NextResponse.json({
        error: `You've used all ${FREE_CV_LIMIT} free optimizations. Top up credits at jobr.co.in/profile — or add your own API key in Settings (free with Gemini).`,
        requiresCredits: true,
        freeUsed,
        freeLimit: FREE_CV_LIMIT,
        walletCredits,
      }, { status: 402 });
    }

    // Deduct 1 credit and call Jobr's key
    const text = await callJobrGemini(prompt);

    await getSupabaseAdmin()
      .from('user_profiles')
      .update({ wallet_credits: walletCredits - 1, updated_at: new Date().toISOString() })
      .eq('email', userEmail);

    await getSupabaseAdmin().from('credit_transactions').insert({
      user_email: userEmail,
      type:       'deduct',
      credits:    1,
      note:       'CV Optimization — Prep.Jobr',
      created_by: 'system',
    });

    return NextResponse.json({
      candidates: [{ content: { parts: [{ text }] } }],
      meta: { mode: 'credits', creditsRemaining: walletCredits - 1 },
    });

  } catch (err: any) {
    console.error('Proxy error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Jobr CV Proxy — POST only' });
}