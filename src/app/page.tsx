'use client';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const session = localStorage.getItem('jobr_session');
    const user = localStorage.getItem('jobr_user');
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
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '30%', right: '-15%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '30%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── HERO ── */}
        <section style={{ maxWidth: 1120, margin: '0 auto', padding: 'clamp(60px,10vw,120px) 20px 80px', textAlign: 'center' }}>

          <div className="animate-fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 100, padding: '8px 20px', marginBottom: 28 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#7C3AED', animation: 'pulse-dot 2s infinite' }} />
            <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', color: '#A78BFA', textTransform: 'uppercase' }}>
              AI Tools for Career Growth
            </span>
          </div>

          <h1 className="animate-fade-up-1" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(48px, 8vw, 96px)', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.04em', marginBottom: 24 }}>
            <span style={{ color: '#F1F0FF', display: 'block' }}>Your Career.</span>
            <span style={{ background: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 40%, #F97316 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', display: 'block' }}>
              Supercharged.
            </span>
          </h1>

          <p className="animate-fade-up-2" style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', color: '#94A3B8', lineHeight: 1.65, maxWidth: 580, margin: '0 auto 16px', fontWeight: 400 }}>
            From landing your first job to building a world-class edtech team —
            Jobr gives students, professionals, and companies the tools they need to grow.
          </p>

          {/* Who it's for pills */}
          <div className="animate-fade-up-2" style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
            {[
              { label: '🎓 For Students', color: '#A78BFA' },
              { label: '💼 For Professionals', color: '#34D399' },
              { label: '🏢 For EdTech Companies', color: '#FB923C' },
            ].map(p => (
              <span key={p.label} style={{ fontSize: 12, fontWeight: 600, color: p.color, background: `${p.color}15`, border: `1px solid ${p.color}30`, padding: '5px 14px', borderRadius: 100, fontFamily: 'var(--font-mono)' }}>
                {p.label}
              </span>
            ))}
          </div>

          <div className="animate-fade-up-3" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/dashboard" className="btn-primary" style={{ fontSize: 'clamp(15px, 2vw, 17px)', padding: 'clamp(14px,2vw,16px) clamp(28px,4vw,40px)' }}>
              {isLoggedIn ? `Welcome back, ${userName} →` : 'Optimize My CV Free ✦'}
            </a>
            <a href="/mentor" className="btn-ghost" style={{ fontSize: 'clamp(15px, 2vw, 17px)', padding: 'clamp(14px,2vw,16px) clamp(28px,4vw,40px)' }}>
              Find a Mentor
            </a>
          </div>

          {/* Stats */}
          <div className="animate-fade-up-4" style={{ marginTop: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
            {[
              { value: '500+', label: 'CVs Optimized' },
              { value: '8+', label: 'Expert Mentors' },
              { value: '₹100', label: 'Per Credit' },
              { value: '0%', label: 'Data Stored' },
            ].map((s, i, arr) => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#F1F0FF', letterSpacing: '-0.02em' }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: '#475569', fontWeight: 500, marginTop: 2 }}>{s.label}</div>
                </div>
                {i < arr.length - 1 && <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.08)' }} />}
              </div>
            ))}
          </div>
        </section>

        {/* ── THREE PRODUCTS ── */}
        <section style={{ maxWidth: 1120, margin: '0 auto', padding: '0 20px 80px' }}>

          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#F1F0FF', marginBottom: 12 }}>
              One Platform. Three Products.
            </h2>
            <p style={{ fontSize: 16, color: '#64748B', maxWidth: 480, margin: '0 auto' }}>
              Each tool is purpose-built for a specific need — pick what matters to you.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 20 }}>

            {/* CV Optimizer */}
            <div style={{ background: 'linear-gradient(145deg, rgba(124,58,237,0.15) 0%, rgba(109,40,217,0.05) 100%)', border: '1px solid rgba(124,58,237,0.30)', borderRadius: 24, padding: 28, display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', overflow: 'hidden', transition: 'transform 0.3s, box-shadow 0.3s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 24px 60px rgba(124,58,237,0.28)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
              <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, background: 'radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', top: 0, right: 20, background: 'linear-gradient(135deg, #7C3AED, #A78BFA)', color: '#fff', fontSize: 9, fontWeight: 800, fontFamily: 'var(--font-mono)', padding: '4px 12px', borderRadius: '0 0 12px 12px', letterSpacing: '0.1em' }}>FEATURED</div>

              {/* For whom */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, width: 'fit-content' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#A78BFA', background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.2)', padding: '3px 10px', borderRadius: 100, fontFamily: 'var(--font-mono)' }}>
                  🎓 STUDENTS & PROFESSIONALS
                </span>
              </div>

              <div style={{ fontSize: 44 }}>📄</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <h3 style={{ fontSize: 'clamp(20px,3vw,26px)', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#F1F0FF', margin: 0 }}>CV Optimizer</h3>
                  <span className="badge badge-green">LIVE</span>
                </div>
                <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.65, margin: 0 }}>
                  Land more interviews with AI-powered resumes. Paste your CV and the job description — get a perfectly tailored, ATS-ready application in 30 seconds using Google's XYZ formula. Bring your own Gemini API key — completely free.
                </p>
              </div>

              {/* Feature bullets */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {['✓ Google XYZ formula applied to every bullet', '✓ ATS keyword matching', '✓ PDF export + email via Gmail', '✓ Your data never stored — ever'].map(f => (
                  <div key={f} style={{ fontSize: 12, color: '#A78BFA', fontWeight: 500 }}>{f}</div>
                ))}
              </div>

              <a href="/dashboard" className="btn-primary" style={{ textAlign: 'center', marginTop: 'auto' }}>
                Optimize My CV Free →
              </a>
            </div>

            {/* Merch Store */}
            <div style={{ background: 'linear-gradient(145deg, rgba(52,211,153,0.08) 0%, rgba(16,185,129,0.03) 100%)', border: '1px solid rgba(52,211,153,0.20)', borderRadius: 24, padding: 28, display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', overflow: 'hidden', transition: 'transform 0.3s, box-shadow 0.3s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 24px 60px rgba(52,211,153,0.15)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
              <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, background: 'radial-gradient(circle, rgba(52,211,153,0.25) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, width: 'fit-content' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#34D399', background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.2)', padding: '3px 10px', borderRadius: 100, fontFamily: 'var(--font-mono)' }}>
                  👕 INDIVIDUALS & EDTECH COMPANIES
                </span>
              </div>

              <div style={{ fontSize: 44 }}>👕</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <h3 style={{ fontSize: 'clamp(20px,3vw,26px)', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#F1F0FF', margin: 0 }}>Merch Store</h3>
                  <span className="badge badge-green">LIVE</span>
                </div>
                <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.65, margin: 0 }}>
                  Custom-printed apparel, accessories and more. Upload your design or use ours — order as an individual or in bulk for your team. EdTechs use us for cohort kits, event merch, and branded swag.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {['✓ Upload PNG/JPG design', '✓ Bulk orders from 10 units', '✓ Hoodies, tees, caps, mugs + more', '✓ WhatsApp order tracking'].map(f => (
                  <div key={f} style={{ fontSize: 12, color: '#34D399', fontWeight: 500 }}>{f}</div>
                ))}
              </div>

              <a href="/merch" className="btn-ghost" style={{ textAlign: 'center', marginTop: 'auto', border: '1px solid rgba(52,211,153,0.25)', color: '#34D399' }}>
                Browse Catalogue →
              </a>
            </div>

            {/* MentorLink */}
            <div style={{ background: 'linear-gradient(145deg, rgba(249,115,22,0.10) 0%, rgba(234,107,10,0.04) 100%)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 24, padding: 28, display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', overflow: 'hidden', transition: 'transform 0.3s, box-shadow 0.3s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 24px 60px rgba(249,115,22,0.22)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
              <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, background: 'radial-gradient(circle, rgba(249,115,22,0.30) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, width: 'fit-content' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#FB923C', background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.2)', padding: '3px 10px', borderRadius: 100, fontFamily: 'var(--font-mono)' }}>
                  🏢 EDTECH COMPANIES
                </span>
              </div>

              <div style={{ fontSize: 44 }}>🎓</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <h3 style={{ fontSize: 'clamp(20px,3vw,26px)', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#F1F0FF', margin: 0 }}>MentorLink</h3>
                  <span className="badge badge-new">NEW ✦</span>
                </div>
                <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.65, margin: 0 }}>
                  Plug-and-go mentor sourcing for edtech companies. Browse verified domain experts worldwide, book a session with credits, and get proof of delivery — all on one platform. No long-term contracts.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {['✓ Credit-based escrow payment', '✓ 24-hour proof of delivery', '✓ Dispute protection built-in', '✓ Bulk mentor hiring for cohorts'].map(f => (
                  <div key={f} style={{ fontSize: 12, color: '#FB923C', fontWeight: 500 }}>{f}</div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 'auto' }}>
                <a href="/mentor/onboard" className="btn-orange" style={{ textAlign: 'center' }}>Join as Mentor →</a>
                <a href="/mentor/edtech" style={{ display: 'block', textAlign: 'center', background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.20)', color: '#FB923C', fontWeight: 600, fontSize: 14, padding: '12px', borderRadius: 100, textDecoration: 'none', transition: 'all 0.2s' }}>I'm an EdTech →</a>
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section style={{ maxWidth: 1120, margin: '0 auto', padding: '0 20px 80px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#F1F0FF', marginBottom: 12 }}>How It Works</h2>
            <p style={{ fontSize: 16, color: '#64748B' }}>Three products. One simple flow each.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 20 }}>
            {[
              {
                title: 'CV Optimizer', color: '#A78BFA', emoji: '📄',
                steps: ['1. Get a free Gemini API key from Google AI Studio', '2. Paste your CV text + Job Description', '3. Get an AI-rewritten, XYZ-formatted CV instantly', '4. Export PDF or send directly via Gmail'],
              },
              {
                title: 'Merch Store', color: '#34D399', emoji: '👕',
                steps: ['1. Browse our product catalogue', '2. Upload your design (PNG/JPG) or pick a template', '3. Choose size, colour, quantity', '4. WhatsApp us to confirm and place order'],
              },
              {
                title: 'MentorLink', color: '#FB923C', emoji: '🎓',
                steps: ['1. EdTech registers and tops up credits', '2. Browse & filter mentors by domain + rate', '3. Book a session — credits frozen in escrow', '4. Mentor delivers → confirm → credits released'],
              },
            ].map(p => (
              <div key={p.title} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <span style={{ fontSize: 28 }}>{p.emoji}</span>
                  <h3 style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-display)', color: p.color, margin: 0 }}>{p.title}</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {p.steps.map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: `${p.color}20`, border: `1px solid ${p.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: p.color, flexShrink: 0, marginTop: 1 }}>
                        {i + 1}
                      </div>
                      <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.5, margin: 0 }}>{step.replace(/^\d+\. /, '')}</p>
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
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, color: '#F1F0FF', marginBottom: 12 }}>Why Jobr?</h2>
              <p style={{ color: '#64748B', fontSize: 16 }}>Three principles we never compromise on.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: 'clamp(24px,4vw,48px)' }}>
              {[
                { icon: '🔒', title: 'Privacy First', desc: 'Your CV data never leaves your device. We use your own API key — we literally cannot see your data. No storage, no exceptions.', color: '#A78BFA' },
                { icon: '⚡', title: 'XYZ Formula', desc: "Google's own hiring formula applied to every CV bullet — Accomplished [X] as measured by [Y] by doing [Z]. Quantified, impactful, ATS-ready.", color: '#34D399' },
                { icon: '🛡️', title: 'Escrow Protection', desc: 'MentorLink credits are frozen before a session starts and only released after you confirm delivery. Built-in dispute protection for both sides.', color: '#FB923C' },
              ].map(f => (
                <div key={f.title} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ width: 56, height: 56, background: `${f.color}18`, border: `1px solid ${f.color}30`, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, transition: 'transform 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.1) rotate(-5deg)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1) rotate(0)'; }}>
                    {f.icon}
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-display)', color: '#F1F0FF', margin: 0 }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MENTOR CTA ── */}
        <section style={{ maxWidth: 680, margin: '0 auto', padding: '0 20px 100px', textAlign: 'center' }}>
          <div style={{ background: 'linear-gradient(145deg, rgba(249,115,22,0.10) 0%, rgba(124,58,237,0.10) 100%)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 28, padding: 'clamp(32px,5vw,56px)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.15) 0%, transparent 60%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: 52, marginBottom: 16, animation: 'float 3s ease-in-out infinite' }}>🎓</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,4vw,40px)', fontWeight: 900, color: '#F1F0FF', marginBottom: 12 }}>Are you a domain expert?</h2>
              <p style={{ color: '#64748B', fontSize: 15, marginBottom: 32, lineHeight: 1.65, maxWidth: 400, margin: '0 auto 32px' }}>
                Join MentorLink, set your own rate, and start earning by teaching what you know. Edtech companies are actively looking for experts like you.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="/mentor/onboard" className="btn-orange">Join as Mentor ✦</a>
                <a href="/mentor" className="btn-ghost">Browse Mentors</a>
              </div>
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