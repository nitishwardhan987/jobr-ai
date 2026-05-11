import { CheckCircle2, ExternalLink } from 'lucide-react';

export default function AboutPage() {
  return (
    <div style={{ background: '#1C1C2E', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(145deg, rgba(124,58,237,0.12) 0%, transparent 60%)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: 'clamp(60px,8vw,100px) 20px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.22)', borderRadius: 100, padding: '6px 16px', marginBottom: 24 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#A78BFA', fontFamily: 'monospace', letterSpacing: '0.1em' }}>ABOUT JOBR</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px,6vw,64px)', fontWeight: 900, color: '#F1F0FF', letterSpacing: '-0.03em', marginBottom: 20, lineHeight: 1.05 }}>
            Built out of frustration.<br />
            <span style={{ background: 'linear-gradient(135deg, #A78BFA, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Driven by purpose.</span>
          </h1>
          <p style={{ fontSize: 'clamp(15px,2vw,18px)', color: '#94A3B8', lineHeight: 1.7, maxWidth: 600, margin: '0 auto' }}>
            Jobr was born from a simple observation: India has millions of talented students, thousands of domain experts, and a massive gap between them. We're here to close it.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(40px,5vw,72px) 20px' }}>

        {/* Origin story */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, color: '#F1F0FF', marginBottom: 20 }}>The Origin Story</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              "Nitish Wardhan started Jobr after spending years in India's EdTech and SaaS ecosystem, watching students struggle with the same problems — CVs that didn't pass ATS filters, interview prep that felt disconnected from reality, and no easy way to find an expert who could help them in a specific, targeted way.",
              "At the same time, he saw EdTech companies burning hours coordinating mentor sessions manually — WhatsApp threads, spreadsheets, payments on hold. There was no platform built specifically for this.",
              "Jobr is the answer to both problems. One platform. Three products. Built for the people who actually need it.",
            ].map((p, i) => (
              <p key={i} style={{ fontSize: 16, color: '#94A3B8', lineHeight: 1.75, margin: 0, paddingLeft: 20, borderLeft: '3px solid rgba(124,58,237,0.3)' }}>{p}</p>
            ))}
          </div>
        </div>

        {/* What we do */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, color: '#F1F0FF', marginBottom: 24 }}>What We Do</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,240px), 1fr))', gap: 16 }}>
            {[
              { emoji: '📄', title: 'Prep.Jobr', color: '#7C3AED', desc: "AI-powered CV optimization using Google's XYZ formula, job application tracking, AI mock interviews, and personalised improvement roadmaps for students." },
              { emoji: '🎓', title: 'Mentor.Jobr', color: '#4F46E5', desc: 'A marketplace for 1:1 mentor sessions — domain experts set their own rates, students and edtechs book directly, with full escrow payment protection.' },
              { emoji: '👕', title: 'Merch.Jobr', color: '#10B981', desc: 'Custom merchandise for individuals, teams, and EdTech cohorts. T-shirts, hoodies, caps — no minimum order headaches, WhatsApp-based ordering.' },
            ].map(p => (
              <div key={p.title} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24 }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{p.emoji}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: p.color, marginBottom: 10 }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.65, margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, color: '#F1F0FF', marginBottom: 24 }}>What We Stand For</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { title: 'Privacy by design', desc: "Your CV data never touches our servers. You use your own AI API key — we literally cannot read your documents. This is non-negotiable.", color: '#7C3AED' },
              { title: 'Transparent pricing', desc: 'Mentors set their own rates. Platform fee is always 10%, shown upfront. No hidden charges, no subscription traps.', color: '#4F46E5' },
              { title: 'Fair for all sides', desc: 'Students get protected by escrow. Mentors get paid reliably. EdTechs get operational simplicity. Everyone wins.', color: '#10B981' },
              { title: 'India first', desc: "We're building for Indian students, Indian EdTechs, and Indian mentors. ₹-first pricing, UPI payments, WhatsApp communication.", color: '#F97316' },
            ].map(v => (
              <div key={v.title} style={{ display: 'flex', gap: 14, padding: '16px 20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14 }}>
                <CheckCircle2 size={20} color={v.color} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#F1F0FF', fontFamily: 'var(--font-display)', marginBottom: 4 }}>{v.title}</div>
                  <div style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6 }}>{v.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, color: '#F1F0FF', marginBottom: 24 }}>The Team</h2>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 28 }}>
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #F97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 900, color: '#fff', flexShrink: 0 }}>N</div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, color: '#F1F0FF', margin: 0 }}>Nitish Wardhan</h3>
                  <span style={{ fontSize: 11, color: '#A78BFA', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', padding: '3px 10px', borderRadius: 100, fontFamily: 'monospace' }}>FOUNDER & BUILDER</span>
                </div>
                <p style={{ fontSize: 15, color: '#94A3B8', lineHeight: 1.7, marginBottom: 14 }}>
                  Built Jobr solo from Bangalore with one goal — make career tools that actually work for India. Years of experience across EdTech and SaaS. Obsessed with honest products that respect user privacy and create real value.
                </p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <a href="https://linkedin.com/in/nitishwardhan" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#4F46E5', textDecoration: 'none', padding: '6px 14px', background: 'rgba(79,70,229,0.1)', border: '1px solid rgba(79,70,229,0.2)', borderRadius: 100 }}>
                    <ExternalLink size={12} /> LinkedIn
                  </a>
                  <a href="mailto:nitish@jobr.co.in" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#A78BFA', textDecoration: 'none', padding: '6px 14px', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 100 }}>
                    nitish@jobr.co.in
                  </a>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 20, padding: '14px 18px', background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.12)', borderRadius: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#A78BFA', fontFamily: 'var(--font-display)', marginBottom: 4 }}>✦ We're growing the team</div>
              <p style={{ fontSize: 13, color: '#64748B', margin: 0, lineHeight: 1.6 }}>Looking for engineers, designers, and growth folks who care about building honest products for India. Reach out — <a href="mailto:nitish@jobr.co.in" style={{ color: '#A78BFA' }}>nitish@jobr.co.in</a></p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: 'clamp(32px,5vw,48px)', background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.12)', borderRadius: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 900, color: '#F1F0FF', marginBottom: 12 }}>Start using Jobr today</h2>
          <p style={{ fontSize: 15, color: '#64748B', marginBottom: 24 }}>Free to start. No credit card. No data stored on our end.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/dashboard" className="btn-primary">Optimize My CV Free ✦</a>
            <a href="/mentor" className="btn-ghost">Browse Mentors</a>
          </div>
        </div>
      </div>
    </div>
  );
}