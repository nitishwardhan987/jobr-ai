# Jobr — AI CV Transformer

## Stack
- **Next.js 14** (App Router) on Vercel — free tier
- **Anthropic API** — Claude Sonnet for CV transformation (~$0.03–0.05 per application)
- **Gmail API** — sends directly from user's account via OAuth2
- **jsPDF** — PDF generation in the browser, zero server cost

## Launch in 4 steps

### 1. Clone and install
```bash
git clone https://github.com/yourusername/jobr
cd jobr
npm install
```

### 2. Google Cloud setup (15 min, one-time)
1. Go to console.cloud.google.com → New project → "Jobr"
2. APIs & Services → Enable → search "Gmail API" → Enable
3. OAuth consent screen → External → add scope: `gmail.send`
4. Credentials → Create OAuth Client ID → Web application
5. Authorised redirect URIs: `http://localhost:3000/oauth/callback` + `https://jobr.co.in/oauth/callback`
6. Copy Client ID + Client Secret

### 3. Environment variables
```bash
cp .env.example .env.local
# Fill in ANTHROPIC_API_KEY, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
# Set NEXT_PUBLIC_BASE_URL=http://localhost:3000 for local dev
```

### 4. Deploy to Vercel
```bash
npm install -g vercel
vercel
# Follow prompts — it auto-detects Next.js
# Add env vars in Vercel dashboard → Settings → Environment Variables
```

Then point your custom domain in Vercel dashboard → Settings → Domains → add `jobr.co.in`

## Local development
```bash
npm run dev
# Open http://localhost:3000
```

## Unit economics (per application)
| Item | Cost |
|------|------|
| Claude Sonnet input (~1,800 tokens) | ~$0.0054 |
| Claude Sonnet output (~900 tokens) | ~$0.0135 |
| Gmail API | Free |
| PDF generation | Free (client-side) |
| Vercel hosting | Free (hobby tier) |
| **Total** | **~$0.019–$0.05** |

## Architecture — why no n8n
- n8n adds: Docker, VPS, Postgres, Gotenberg, webhook management, node config
- This stack adds: nothing. One repo. Deploy with `vercel`. Done.
- PDF generation moves to the browser (jsPDF) — zero server memory/cost
- Gmail OAuth token stored in a secure httpOnly cookie per session
- Total infra cost for 100 users: ~$2–5 in Anthropic API calls

## File structure
```
src/
  app/
    page.tsx                  # Main UI — form, preview, send
    layout.tsx                # Fonts, metadata
    globals.css               # Design tokens, animations
    api/
      transform/route.ts      # Claude API — CV transformation
      send-email/route.ts     # Gmail API — send with PDF
    oauth/
      callback/route.ts       # OAuth2 flow (GET=callback, POST=get URL, PUT=check status)
  lib/
    pdf.ts                    # jsPDF client-side CV renderer
```
