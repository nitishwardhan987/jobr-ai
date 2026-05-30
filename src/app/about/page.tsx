import { CheckCircle2, ExternalLink, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div style={{ background: '#F8F5F0', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(145deg, rgba(249,115,22,0.07) 0%, transparent 60%)', borderBottom: '1px solid #E7E5E4', padding: 'clamp(80px,10vw,120px) 24px clamp(48px,6vw,72px)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 100, padding: '5px 14px', marginBottom: 24 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#EA580C', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>About Jobr</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px,6vw,64px)', fontWeight: 900, color: '#18181B', letterSpacing: '-0.04em', marginBottom: 20, lineHeight: 1.0 }}>
            Built out of frustration.<br />
            <span style={{ color: '#F97316' }}>Driven by purpose.</span>
          </h1>
          <p style={{ fontSize: 'clamp(15px,2vw,18px)', color: '#52525B', lineHeight: 1.75, maxWidth: 580, margin: '0 auto' }}>
            Jobr was born from a simple observation: India has millions of talented students, thousands of domain experts, and a massive gap between them. We're here to close it.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(40px,5vw,72px) 24px' }}>

        {/* Origin story */}
        <div style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 900, color: '#18181B', marginBottom: 24, letterSpacing: '-0.03em' }}>The Origin Story</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              "Nitish Wardhan started Jobr after spending years in India's EdTech and SaaS ecosystem, watching students struggle with the same problems — CVs that didn't pass ATS filters, interview prep that felt disconnected from reality, and no easy way to find an expert who could help them in a specific, targeted way.",
              "At the same time, he saw EdTech companies burning hours coordinating mentor sessions manually — WhatsApp threads, spreadsheets, payments on hold. There was no platform built specifically for this.",
              "Jobr is the answer to both problems. One platform. Three products. Built for the people who actually need it.",
            ].map((p, i) => (
              <p key={i} style={{ fontSize: 16, color: '#52525B', lineHeight: 1.8, margin: 0, paddingLeft: 20, borderLeft: '3px solid #FED7AA' }}>{p}</p>
            ))}
          </div>
        </div>

        {/* What we do */}
        <div style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 900, color: '#18181B', marginBottom: 24, letterSpacing: '-0.03em' }}>What We Do</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,240px), 1fr))', gap: 16 }}>
            {[
              { emoji: '📄', title: 'Jobr Prep',   color: '#F97316', href: '/dashboard', desc: "AI-powered CV optimization using Google's XYZ formula, job application tracking, AI mock interviews, and personalised improvement roadmaps for students." },
              { emoji: '🎓', title: 'Jobr Mentor', color: '#7C3AED', href: '/mentor',    desc: 'A marketplace for 1:1 mentor sessions — domain experts set their own rates, students and edtechs book directly, with full escrow payment protection.' },
              { emoji: '👕', title: 'Jobr Merch',  color: '#16A34A', href: '/merch',     desc: 'Custom merchandise for individuals, teams, and EdTech cohorts. T-shirts, hoodies, caps — no minimum order headaches, WhatsApp-based ordering.' },
            ].map(p => (
              <a key={p.title} href={p.href} style={{ display: 'flex', flexDirection: 'column', background: '#FFFFFF', border: '1px solid #E7E5E4', borderRadius: 20, padding: 24, textDecoration: 'none', transition: 'all 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(24,24,27,0.08)'; (e.currentTarget as HTMLElement).style.borderColor = `${p.color}30`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.borderColor = '#E7E5E4'; }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{p.emoji}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 800, color: p.color, marginBottom: 10, letterSpacing: '-0.02em' }}>{p.title}</h3>
                <p style={{ fontSize: 13, color: '#71717A', lineHeight: 1.65, margin: 0, flex: 1 }}>{p.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 14, fontSize: 12, fontWeight: 700, color: p.color, fontFamily: 'var(--font-display)' }}>
                  Explore <ArrowRight size={12} />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Values */}
        <div style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 900, color: '#18181B', marginBottom: 24, letterSpacing: '-0.03em' }}>What We Stand For</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { title: 'Privacy by design',   desc: "Your CV data never touches our servers. You use your own AI API key — we literally cannot read your documents. This is non-negotiable.", color: '#F97316' },
              { title: 'Transparent pricing', desc: 'Mentors set their own rates. Platform fee is always 10%, shown upfront. No hidden charges, no subscription traps.', color: '#7C3AED' },
              { title: 'Fair for all sides',  desc: 'Students get protected by escrow. Mentors get paid reliably. EdTechs get operational simplicity. Everyone wins.', color: '#16A34A' },
              { title: 'India first',         desc: "We're building for Indian students, Indian EdTechs, and Indian mentors. ₹-first pricing, UPI payments, WhatsApp communication.", color: '#2563EB' },
            ].map(v => (
              <div key={v.title} style={{ display: 'flex', gap: 14, padding: '18px 20px', background: '#FFFFFF', border: '1px solid #E7E5E4', borderRadius: 16 }}>
                <div style={{ width: 20, height: 20, marginTop: 2, flexShrink: 0 }}>
                  <CheckCircle2 size={20} color={v.color} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#18181B', fontFamily: 'var(--font-display)', marginBottom: 4 }}>{v.title}</div>
                  <div style={{ fontSize: 14, color: '#71717A', lineHeight: 1.65 }}>{v.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 900, color: '#18181B', marginBottom: 24, letterSpacing: '-0.03em' }}>The Team</h2>
          <div style={{ background: '#FFFFFF', border: '1px solid #E7E5E4', borderRadius: 24, padding: 28 }}>
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #F97316, #EA580C)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 900, color: '#fff', flexShrink: 0, fontFamily: 'var(--font-display)' }}>N</div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, color: '#18181B', margin: 0, letterSpacing: '-0.03em' }}>Nitish Wardhan</h3>
                  <span style={{ fontSize: 10, color: '#EA580C', background: '#FFF7ED', border: '1px solid #FED7AA', padding: '3px 10px', borderRadius: 100, fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '0.06em' }}>FOUNDER & BUILDER</span>
                </div>
                <p style={{ fontSize: 15, color: '#52525B', lineHeight: 1.75, marginBottom: 16 }}>
                  Built Jobr solo from Bangalore with one goal — make career tools that actually work for India. Years of experience across EdTech and SaaS. Obsessed with honest products that respect user privacy and create real value.
                </p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <a href="https://linkedin.com/in/nitishwardhan" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#2563EB', textDecoration: 'none', padding: '7px 14px', background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.18)', borderRadius: 100, transition: 'all 0.15s' }}>
                    <ExternalLink size={12} /> LinkedIn
                  </a>
                  <a href="mailto:nitish@jobr.co.in" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#F97316', textDecoration: 'none', padding: '7px 14px', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 100 }}>
                    nitish@jobr.co.in
                  </a>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 20, padding: '14px 18px', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#F97316', fontFamily: 'var(--font-display)', marginBottom: 4 }}>We're growing the team</div>
              <p style={{ fontSize: 13, color: '#71717A', margin: 0, lineHeight: 1.6 }}>
                Looking for engineers, designers, and growth folks who care about building honest products for India. Reach out — <a href="mailto:nitish@jobr.co.in" style={{ color: '#F97316', fontWeight: 600 }}>nitish@jobr.co.in</a>
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: 'clamp(32px,5vw,48px)', background: '#18181B', borderRadius: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 900, color: '#FAFAF9', marginBottom: 10, letterSpacing: '-0.03em' }}>Start using Jobr today</h2>
          <p style={{ fontSize: 15, color: '#71717A', marginBottom: 28 }}>Free to start. No credit card. No data stored on our end.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/dashboard" className="btn-primary">Get Started Free <ArrowRight size={15} /></a>
            <a href="/mentor" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '14px 28px', borderRadius: 100, fontSize: 15, fontWeight: 600, color: '#A1A1AA', border: '1px solid #3F3F46', textDecoration: 'none', fontFamily: 'var(--font-display)', transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#FAFAF9'; (e.currentTarget as HTMLElement).style.borderColor = '#71717A'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#A1A1AA'; (e.currentTarget as HTMLElement).style.borderColor = '#3F3F46'; }}>
              Browse Mentors
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
