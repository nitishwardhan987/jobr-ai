'use client';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
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
    <div style={{ background: '#060B18', minHeight: '100vh' }}>

      {/* HERO */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '100px 24px 80px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)',
          borderRadius: 99, padding: '6px 16px', marginBottom: 32,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#38BDF8', display: 'inline-block', animation: 'pulse-dot 2s infinite' }} />
          <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.12em', color: '#38BDF8', textTransform: 'uppercase' }}>
            Neural Impact Engine v3
          </span>
        </div>

        <h1 style={{ fontSize: 'clamp(40px, 7vw, 72px)', fontWeight: 800, lineHeight: 1.06, letterSpacing: '-0.04em', color: '#F8FAFC', marginBottom: 20 }}>
          Own the{' '}
          <span style={{ color: '#38BDF8', textShadow: '0 0 40px rgba(56,189,248,0.3)' }}>Shortlist.</span>
        </h1>

        <p style={{ fontSize: 18, color: '#94A3B8', lineHeight: 1.65, maxWidth: 520, margin: '0 auto 40px' }}>
          AI-powered CV optimisation, custom merch, and mentor sourcing. Built for India's tech elite.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={isLoggedIn ? '/dashboard' : '/auth'} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#38BDF8', color: '#0F172A', fontWeight: 700, fontSize: 15,
            padding: '13px 28px', borderRadius: 10, textDecoration: 'none',
            boxShadow: '0 4px 24px rgba(56,189,248,0.30)',
          }}>
            {isLoggedIn ? 'Go to Dashboard →' : "Get Started — It's Free"}
          </a>
          <a href="/merch" style={{
            display: 'inline-flex', alignItems: 'center',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
            color: '#94A3B8', fontWeight: 500, fontSize: 15,
            padding: '13px 28px', borderRadius: 10, textDecoration: 'none',
          }}>
            Explore Merch
          </a>
        </div>
      </section>

      {/* PRODUCT CARDS */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px 80px' }}>
        <p style={{ textAlign: 'center', fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.16em', color: '#334155', marginBottom: 32, textTransform: 'uppercase' }}>
          Everything you need · one platform
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>

          <div style={{
            background: 'linear-gradient(135deg, rgba(56,189,248,0.06) 0%, rgba(14,165,233,0.02) 100%)',
            border: '1.5px solid rgba(56,189,248,0.25)', borderRadius: 16, padding: '28px 24px',
            display: 'flex', flexDirection: 'column', gap: 14, position: 'relative',
            boxShadow: '0 4px 32px rgba(56,189,248,0.07)',
          }}>
            <div style={{ position: 'absolute', top: 0, right: 20, background: '#38BDF8', color: '#0F172A', fontSize: 9, fontWeight: 800, fontFamily: 'monospace', padding: '3px 10px', borderRadius: '0 0 8px 8px', letterSpacing: '0.1em' }}>FEATURED</div>
            <div style={{ fontSize: 32 }}>📄</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#F8FAFC', letterSpacing: '-0.02em' }}>CV Optimizer</h3>
              <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(16,185,129,0.15)', color: '#10B981', padding: '2px 8px', borderRadius: 99, fontFamily: 'monospace' }}>LIVE</span>
            </div>
            <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.6, flex: 1 }}>
              Land more interviews with AI-powered resumes. Paste your CV and JD — get a perfectly tailored application in 30 seconds using Google's XYZ formula.
            </p>
            <a href={isLoggedIn ? '/dashboard' : '/auth'} style={{
              display: 'block', textAlign: 'center', background: '#38BDF8', color: '#0F172A',
              fontWeight: 700, fontSize: 14, padding: '11px', borderRadius: 10, textDecoration: 'none',
              boxShadow: '0 2px 12px rgba(56,189,248,0.25)',
            }}>Start Optimizing →</a>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontSize: 32 }}>👕</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#F8FAFC', letterSpacing: '-0.02em' }}>Merch Store</h3>
              <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(16,185,129,0.15)', color: '#10B981', padding: '2px 8px', borderRadius: 99, fontFamily: 'monospace' }}>LIVE</span>
            </div>
            <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.6, flex: 1 }}>
              Custom-printed apparel, accessories and more. Upload your design, pick a product, order in minutes. Bulk orders from 10 units.
            </p>
            <a href="/merch" style={{ display: 'block', textAlign: 'center', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: '#94A3B8', fontWeight: 500, fontSize: 14, padding: '11px', borderRadius: 10, textDecoration: 'none' }}>
              Browse Catalogue →
            </a>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 14, opacity: 0.6 }}>
            <div style={{ fontSize: 32 }}>🎓</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#F8FAFC', letterSpacing: '-0.02em' }}>MentorLink</h3>
              <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(245,158,11,0.15)', color: '#F59E0B', padding: '2px 8px', borderRadius: 99, fontFamily: 'monospace' }}>SOON</span>
            </div>
            <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.6, flex: 1 }}>
              Plug-and-go mentor sourcing for edtech companies. Browse verified mentors worldwide, filter by rates and expertise, hire instantly.
            </p>
            <a href="#waitlist" style={{ display: 'block', textAlign: 'center', background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: '#475569', fontWeight: 500, fontSize: 14, padding: '11px', borderRadius: 10, textDecoration: 'none' }}>
              Join Waitlist
            </a>
          </div>
        </div>
      </section>

      {/* WHY JOBR */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '48px 40px' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 8, letterSpacing: '-0.02em' }}>Why Jobr?</h2>
          <p style={{ textAlign: 'center', color: '#64748B', marginBottom: 40, fontSize: 15 }}>Three things we never compromise on.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
            {[
              { icon: '🔒', title: 'Privacy First', desc: 'Your data never leaves your device — ever. No CV stored, no data sold, no exceptions.' },
              { icon: '⚡', title: 'XYZ Formula', desc: "Every bullet rewritten using Google's proven hiring formula — quantified, impactful, ATS-ready." },
              { icon: '👁️', title: 'Live Preview', desc: 'See your transformed CV instantly before you apply. What you see is exactly what recruiters get.' },
            ].map(f => (
              <div key={f.title} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ width: 44, height: 44, background: 'rgba(56,189,248,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{f.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WAITLIST */}
      <section id="waitlist" style={{ maxWidth: 560, margin: '0 auto', padding: '0 24px 100px', textAlign: 'center' }}>
        <div style={{ background: 'rgba(56,189,248,0.04)', border: '1px solid rgba(56,189,248,0.15)', borderRadius: 20, padding: '48px 32px' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🎓</div>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em' }}>MentorLink is coming</h2>
          <p style={{ color: '#64748B', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>Plug-and-go mentor sourcing for edtech companies. Be first in line.</p>
          <WaitlistForm />
        </div>
      </section>

      <style jsx global>{`@keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  );
}

function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  if (submitted) return (
    <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, padding: '14px 20px', fontSize: 14, color: '#10B981', fontWeight: 500 }}>
      ✓ You're on the list! We'll reach out when MentorLink launches.
    </div>
  );
  return (
    <form onSubmit={e => { e.preventDefault(); if (email.trim()) setSubmitted(true); }} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required
        style={{ flex: 1, minWidth: 200, padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#E2E8F0', fontSize: 14, outline: 'none' }} />
      <button type="submit" style={{ background: '#38BDF8', color: '#0F172A', fontWeight: 700, fontSize: 13, padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer' }}>
        Join Waitlist
      </button>
    </form>
  );
}