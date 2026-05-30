'use client';
import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName,   setUserName]   = useState('');
  const [mounted,    setMounted]    = useState(false);

  useEffect(() => {
    setMounted(true);
    const session = localStorage.getItem('jobr_session');
    const user    = localStorage.getItem('jobr_user');
    if (session || user) {
      setIsLoggedIn(true);
      try {
        const parsed = JSON.parse(session || user || '{}');
        setUserName(parsed.name?.split(' ')[0] || parsed.email?.split('@')[0] || '');
      } catch {}
    }
  }, []);

  return (
    <div style={{ background: '#1C1C2E', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* Ambient glows */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-15%', left: '-5%', width: '55vw', height: '55vw', background: 'radial-gradient(circle, rgba(124,58,237,0.10) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '35%', right: '-10%', width: '45vw', height: '45vw', background: 'radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── HERO ── */}
        <section style={{ maxWidth: 1120, margin: '0 auto', padding: 'clamp(70px,10vw,120px) 20px 80px', textAlign: 'center' }}>

          <div className="animate-fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(124,58,237,0.10)', border: '1px solid rgba(124,58,237,0.22)', borderRadius: 100, padding: '7px 18px', marginBottom: 28 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#7C3AED', animation: 'pulse-dot 2s infinite', flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', color: '#A78BFA', textTransform: 'uppercase' }}>
              India's AI Career Platform
            </span>
          </div>

          <h1 className="animate-fade-up-1" style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(52px, 9vw, 104px)',
            fontWeight: 900,
            lineHeight: 1.0,
            letterSpacing: '-0.04em',
            marginBottom: 24,
          }}>
            <span style={{ color: '#F1F0FF', display: 'block' }}>Your Career.</span>
            <span style={{
              background: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 40%, #F97316 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'block',
            }}>Supercharged.</span>
          </h1>

          <p className="animate-fade-up-2" style={{ fontSize: 'clamp(16px, 2.2vw, 20px)', color: '#94A3B8', lineHeight: 1.65, maxWidth: 560, margin: '0 auto 20px', fontWeight: 400 }}>
            Three products. One platform. Built for students chasing offers, mentors building income, and edtech teams scaling fast.
          </p>

          <div className="animate-fade-up-2" style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
            {[
              { label: '🎓 Students',          color: '#A78BFA', bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.25)' },
              { label: '🏢 EdTech Companies',  color: '#FB923C', bg: 'rgba(249,115,22,0.10)',  border: 'rgba(249,115,22,0.22)' },
              { label: '👨‍🏫 Domain Experts',    color: '#34D399', bg: 'rgba(52,211,153,0.10)',  border: 'rgba(52,211,153,0.22)' },
            ].map(p => (
              <span key={p.label} style={{ fontSize: 12, fontWeight: 600, color: p.color, background: p.bg, border: `1px solid ${p.border}`, padding: '5px 14px', borderRadius: 100, fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                {p.label}
              </span>
            ))}
          </div>

          <div className="animate-fade-up-3" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/dashboard" className="btn-primary" style={{ fontSize: 'clamp(14px,2vw,17px)', padding: 'clamp(13px,2vw,16px) clamp(26px,4vw,40px)' }}>
              {isLoggedIn && mounted ? `Welcome back, ${userName} →` : 'Optimize My CV Free ✦'}
            </a>
            <a href="/mentor" className="btn-ghost" style={{ fontSize: 'clamp(14px,2vw,17px)', padding: 'clamp(13px,2vw,16px) clamp(26px,4vw,40px)' }}>
              Browse Mentors
            </a>
          </div>

          <div className="animate-fade-up-4" style={{ marginTop: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 0 }}>
            {[
              { value: '500+', label: 'CVs Optimized' },
              null,
              { value: '8+',   label: 'Verified Mentors' },
              null,
              { value: '₹100', label: 'Per Credit' },
              null,
              { value: '0%',   label: 'Data Stored' },
            ].map((s, i) => s === null ? (
              <div key={i} style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.07)', margin: '0 20px' }} />
            ) : (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(20px,3vw,28px)', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#F1F0FF', letterSpacing: '-0.02em' }}>{s.value}</div>
                <div style={{ fontSize: 11, color: '#475569', fontWeight: 500, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PRODUCT SECTIONS ── */}

        <section style={{ maxWidth: 1120, margin: '0 auto', padding: '0 20px 80px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, color: '#F1F0FF', marginBottom: 12 }}>One Platform. Three Products.</h2>
            <p style={{ fontSize: 16, color: '#64748B', maxWidth: 440, margin: '0 auto' }}>Each tool is purpose-built for a specific need.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Prep.Jobr */}
            <ProductCard
              badge="🎓 FOR STUDENTS & JOB SEEKERS"
              badgeColor="#A78BFA"
              emoji="📄"
              title="Prep.Jobr"
              subtitle="Your complete interview preparation system"
              description="Not just a CV rewriter. Prep.Jobr tracks every job you apply to, schedules your interview prep, runs AI mock interviews tailored to the actual JD, and generates a personalised roadmap if you don't make it. Think of it as a co-pilot for your entire job search."
              features={[
                "AI rewrites every CV bullet using Google's XYZ formula — quantified, impactful, ATS-ready",
                'Track all your applications in one place — Applied → Round 1 → Round 2 → Offer',
                '3 free AI mock interviews per session using your own Gemini key (zero cost)',
                'Skill gap analysis with curated YouTube courses to close the gaps fast',
                'Personalised rejection roadmap when things don\'t go as planned — improve and reapply',
              ]}
              featureColor="#A78BFA"
              ctaLabel="Start Prepping Free →"
              ctaHref="/dashboard"
              ctaStyle={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)', color: '#fff', boxShadow: '0 4px 16px rgba(124,58,237,0.4)' }}
              gradient="linear-gradient(145deg, rgba(124,58,237,0.12) 0%, rgba(109,40,217,0.04) 100%)"
              borderColor="rgba(124,58,237,0.28)"
              glowColor="rgba(124,58,237,0.28)"
              tag={{ label: 'LIVE', color: '#34D399', bg: 'rgba(52,211,153,0.15)' }}
            />

            {/* Mentor.Jobr */}
            <ProductCard
              badge="🏢 FOR EDTECH COMPANIES"
              badgeColor="#FB923C"
              emoji="🎓"
              title="Mentor.Jobr"
              subtitle="Plug-and-play mentor sourcing with built-in payment protection"
              description="Stop chasing freelance mentors on LinkedIn. Browse verified domain experts, book sessions with credits, and pay only after delivery is confirmed. Built-in escrow means your money is always protected. Scale your cohorts without the ops overhead."
              features={[
                'Browse 8+ verified mentors across PM, SWE, Data Science, Design, Finance and more',
                'Credits-based wallet — top up once and use as needed, no long-term subscriptions',
                'Escrow system: credits frozen at booking, released only after you confirm delivery',
                '24-hour auto-release protects mentors from non-payment — fair for everyone',
                'Dispute resolution handled by Jobr — you focus on the learning, we handle the rest',
              ]}
              featureColor="#FB923C"
              ctaLabel="Browse Mentors →"
              ctaHref="/mentor"
              ctaStyle={{ background: 'linear-gradient(135deg, #F97316, #EA6B0A)', color: '#fff', boxShadow: '0 4px 16px rgba(249,115,22,0.4)' }}
              gradient="linear-gradient(145deg, rgba(249,115,22,0.10) 0%, rgba(234,107,10,0.03) 100%)"
              borderColor="rgba(249,115,22,0.22)"
              glowColor="rgba(249,115,22,0.22)"
              tag={{ label: 'NEW', color: '#FB923C', bg: 'rgba(249,115,22,0.15)' }}
              secondaryCta={{ label: 'Join as Mentor', href: '/mentor/onboard' }}
            />

            {/* Merch.Jobr */}
            <ProductCard
              badge="👕 FOR INDIVIDUALS & TEAMS"
              badgeColor="#34D399"
              emoji="👕"
              title="Merch.Jobr"
              subtitle="Custom branded merchandise — no minimums drama"
              description="Whether you're ordering a single tee or 500 cohort kits for your edtech — Merch.Jobr handles it all. Upload your design, pick your product, confirm on WhatsApp. That simple. No complex checkout, no minimum order headaches."
              features={[
                'T-shirts, hoodies, caps, mugs, tote bags and more — quality printing guaranteed',
                'Upload your PNG/JPG design and we handle the rest, end to end',
                'Bulk orders from 10 units for teams, cohorts, and events',
                'WhatsApp-based ordering — no complex checkout flows or accounts needed',
                'EdTech cohort kits, hackathon swag, graduation merch, personal gifts',
              ]}
              featureColor="#34D399"
              ctaLabel="Browse Catalogue →"
              ctaHref="/merch"
              ctaStyle={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff', boxShadow: '0 4px 16px rgba(16,185,129,0.4)' }}
              gradient="linear-gradient(145deg, rgba(52,211,153,0.08) 0%, rgba(16,185,129,0.03) 100%)"
              borderColor="rgba(52,211,153,0.18)"
              glowColor="rgba(52,211,153,0.18)"
              tag={{ label: 'LIVE', color: '#34D399', bg: 'rgba(52,211,153,0.15)' }}
            />
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section style={{ maxWidth: 1120, margin: '0 auto', padding: '0 20px 80px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, color: '#F1F0FF', marginBottom: 12 }}>How It Works</h2>
            <p style={{ fontSize: 16, color: '#64748B' }}>Simple flows. Zero friction. Results fast.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,280px),1fr))', gap: 16 }}>
            {[
              { emoji: '📄', title: 'Prep.Jobr', color: '#A78BFA', steps: ['Paste your CV + the job description', 'Get an AI-optimized, XYZ-formatted CV in 30 seconds', 'Track your application through every round', 'Practice with AI mock interviews tailored to the JD', 'Get a personalised roadmap if rejected — improve and reapply'] },
              { emoji: '🎓', title: 'Mentor.Jobr', color: '#FB923C', steps: ['EdTech registers and tops up credits (₹100 = 1 credit)', 'Browse mentors — filter by domain, rate, rating', 'Book a session — credits frozen in escrow instantly', 'Session happens on Zoom, Meet, or your own LMS', 'Confirm delivery — credits released to mentor'] },
              { emoji: '👕', title: 'Merch.Jobr', color: '#34D399', steps: ['Browse our product catalogue', 'Upload your design (PNG or JPG)', 'Choose quantity, size, and colour', 'WhatsApp us to confirm and place your order', 'We deliver anywhere in India'] },
            ].map(p => (
              <div key={p.title} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <span style={{ fontSize: 28 }}>{p.emoji}</span>
                  <h3 style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-display)', color: p.color, margin: 0 }}>{p.title}</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {p.steps.map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', background: `${p.color}18`, border: `1px solid ${p.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: p.color, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                      <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.5, margin: 0 }}>{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── WHY JOBR ── */}
        <section style={{ maxWidth: 1120, margin: '0 auto', padding: '0 20px 80px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 28, padding: 'clamp(32px,5vw,56px)' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, color: '#F1F0FF', marginBottom: 12 }}>Built Different.</h2>
              <p style={{ color: '#64748B', fontSize: 16, maxWidth: 400, margin: '0 auto' }}>Three commitments we make to every user.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,200px),1fr))', gap: 'clamp(24px,4vw,48px)' }}>
              {[
                { icon: '🔒', title: 'Your data is yours', desc: 'Your CV never touches our servers. You use your own Gemini API key — we literally cannot read your data. No storage. No profiling. No exceptions.', color: '#A78BFA' },
                { icon: '🛡️', title: 'Money moves safely', desc: 'MentorLink credits are frozen before a session starts and released only after you confirm work is done. Disputes are mediated by our team — not left to chance.', color: '#FB923C' },
                { icon: '⚡', title: 'Google-grade quality', desc: "Every CV bullet rewritten using Google's XYZ formula — Accomplished [X] as measured by [Y] by doing [Z]. Quantified, impactful, ATS-ready. Not generic AI fluff.", color: '#34D399' },
              ].map(f => (
                <div key={f.title} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ width: 54, height: 54, background: `${f.color}15`, border: `1px solid ${f.color}28`, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, transition: 'transform 0.2s', cursor: 'default' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.1) rotate(-5deg)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1) rotate(0)'; }}>
                    {f.icon}
                  </div>
                  <h3 style={{ fontSize: 19, fontWeight: 800, fontFamily: 'var(--font-display)', color: '#F1F0FF', margin: 0 }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section style={{ maxWidth: 720, margin: '0 auto', padding: '0 20px 100px', textAlign: 'center' }}>
          <div style={{ background: 'linear-gradient(145deg, rgba(124,58,237,0.12) 0%, rgba(249,115,22,0.08) 100%)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 28, padding: 'clamp(36px,5vw,60px)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.15) 0%, transparent 60%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: 44, marginBottom: 16, animation: 'float 3s ease-in-out infinite' }}>🚀</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,4vw,40px)', fontWeight: 900, color: '#F1F0FF', marginBottom: 14 }}>Ready to get started?</h2>
              <p style={{ color: '#64748B', fontSize: 15, marginBottom: 32, lineHeight: 1.65, maxWidth: 440, margin: '0 auto 32px' }}>
                Whether you're applying for your first job, hiring mentors at scale, or ordering cohort merch — Jobr has you covered.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="/dashboard" className="btn-primary">Optimize My CV Free ✦</a>
                <a href="/mentor/onboard" className="btn-orange">Become a Mentor</a>
              </div>
              <p style={{ fontSize: 12, color: '#334155', marginTop: 16 }}>Free to start · No credit card · No data stored</p>
            </div>
          </div>
        </section>
      </div>

      <style jsx global>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.85)} }
        @media (max-width:768px) { .mobile-menu-btn { display: flex !important; } }
      `}</style>
    </div>
  );
}

function ProductCard({ badge, badgeColor, emoji, title, subtitle, description, features, featureColor, ctaLabel, ctaHref, ctaStyle, gradient, borderColor, glowColor, tag, secondaryCta }: any) {
  return (
    <div style={{ background: gradient, border: `1px solid ${borderColor}`, borderRadius: 24, padding: 'clamp(24px,4vw,40px)', display: 'flex', flexDirection: 'column', gap: 20, position: 'relative', overflow: 'hidden', transition: 'transform 0.3s, box-shadow 0.3s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 60px ${glowColor}`; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
      <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`, borderRadius: '50%', pointerEvents: 'none' }} />
      <div>
        <span style={{ fontSize: 10, fontWeight: 700, color: badgeColor, background: `${badgeColor}15`, border: `1px solid ${badgeColor}28`, padding: '3px 10px', borderRadius: 100, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>{badge}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 36 }}>{emoji}</span>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,3vw,30px)', fontWeight: 900, color: '#F1F0FF', margin: 0, letterSpacing: '-0.02em' }}>{title}</h3>
            <span style={{ fontSize: 10, fontWeight: 700, color: tag.color, background: tag.bg, border: `1px solid ${tag.color}30`, padding: '3px 9px', borderRadius: 100, fontFamily: 'var(--font-mono)' }}>{tag.label}</span>
          </div>
          <div style={{ fontSize: 14, color: '#64748B', marginTop: 2 }}>{subtitle}</div>
        </div>
      </div>
      <p style={{ fontSize: 15, color: '#94A3B8', lineHeight: 1.7, margin: 0 }}>{description}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,280px),1fr))', gap: 8 }}>
        {features.map((f: string, i: number) => (
          <div key={i} style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
            <CheckCircle2 size={14} color={featureColor} style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.5 }}>{f}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <a href={ctaHref} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontWeight: 700, fontSize: 14, padding: '11px 24px', borderRadius: 100, textDecoration: 'none', fontFamily: 'var(--font-display)', transition: 'all 0.2s', ...ctaStyle }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}>
          {ctaLabel}
        </a>
        {secondaryCta && (
          <a href={secondaryCta.href} className="btn-ghost" style={{ fontSize: 14, padding: '11px 22px' }}>{secondaryCta.label}</a>
        )}
      </div>
    </div>
  );
}