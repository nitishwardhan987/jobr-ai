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
    <div style={{ background: '#1C1C2E', minHeight: '100vh' }}>

      {/* HERO */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '100px 24px 80px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(124,58,237,0.15)',
          border: '1px solid rgba(124,58,237,0.3)',
          borderRadius: 99, padding: '6px 16px', marginBottom: 32,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7C3AED', display: 'inline-block', animation: 'pulse-dot 2s infinite' }} />
          <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.12em', color: '#A78BFA', textTransform: 'uppercase' }}>
            Neural Impact Engine v3
          </span>
        </div>

        <h1 style={{ fontSize: 'clamp(40px, 7vw, 72px)', fontWeight: 800, lineHeight: 1.06, letterSpacing: '-0.04em', color: '#F1F0FF', marginBottom: 20 }}>
          Own the{' '}
          <span style={{ color: '#A78BFA' }}>Shortlist.</span>
        </h1>

        <p style={{ fontSize: 18, color: '#94A3B8', lineHeight: 1.65, maxWidth: 520, margin: '0 auto 40px' }}>
          AI-powered CV optimisation, custom merch, and mentor sourcing. Built for India's tech elite.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={isLoggedIn ? '/dashboard' : '/auth'} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#7C3AED', color: '#fff', fontWeight: 700, fontSize: 15,
            padding: '13px 28px', borderRadius: 10, textDecoration: 'none',
            boxShadow: '0 4px 24px rgba(124,58,237,0.40)',
          }}>
            {isLoggedIn ? 'Go to Dashboard →' : "Get Started — It's Free"}
          </a>
          <a href="/merch" style={{
            display: 'inline-flex', alignItems: 'center',
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
            color: '#94A3B8', fontWeight: 500, fontSize: 15,
            padding: '13px 28px', borderRadius: 10, textDecoration: 'none',
          }}>
            Explore Merch
          </a>
        </div>
      </section>

      {/* PRODUCT CARDS */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px 80px' }}>
        <p style={{ textAlign: 'center', fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.16em', color: '#475569', marginBottom: 32, textTransform: 'uppercase' }}>
          Everything you need · one platform
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>

          {/* CV Optimizer */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(109,40,217,0.06) 100%)',
            border: '1.5px solid rgba(124,58,237,0.35)', borderRadius: 16, padding: '28px 24px',
            display: 'flex', flexDirection: 'column', gap: 14, position: 'relative',
            boxShadow: '0 4px 32px rgba(124,58,237,0.15)',
          }}>
            <div style={{ position: 'absolute', top: 0, right: 20, background: '#7C3AED', color: '#fff', fontSize: 9, fontWeight: 800, fontFamily: 'monospace', padding: '3px 10px', borderRadius: '0 0 8px 8px', letterSpacing: '0.1em' }}>FEATURED</div>
            <div style={{ fontSize: 32 }}>📄</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#F1F0FF', letterSpacing: '-0.02em', margin: 0 }}>CV Optimizer</h3>
              <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(16,185,129,0.2)', color: '#34D399', padding: '2px 8px', borderRadius: 99, fontFamily: 'monospace' }}>LIVE</span>
            </div>
            <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.6, flex: 1, margin: 0 }}>
              Land more interviews with AI-powered resumes. Paste your CV and JD — get a perfectly tailored application in 30 seconds using Google's XYZ formula.
            </p>
            <a href={isLoggedIn ? '/dashboard' : '/auth'} style={{ display: 'block', textAlign: 'center', background: '#7C3AED', color: '#fff', fontWeight: 700, fontSize: 14, padding: '11px', borderRadius: 10, textDecoration: 'none', boxShadow: '0 2px 12px rgba(124,58,237,0.35)' }}>
              Start Optimizing →
            </a>
          </div>

          {/* Merch Store */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontSize: 32 }}>👕</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#F1F0FF', letterSpacing: '-0.02em', margin: 0 }}>Merch Store</h3>
              <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(16,185,129,0.2)', color: '#34D399', padding: '2px 8px', borderRadius: 99, fontFamily: 'monospace' }}>LIVE</span>
            </div>
            <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.6, flex: 1, margin: 0 }}>
              Custom-printed apparel, accessories and more. Upload your design, pick a product, order in minutes. Bulk orders from 10 units.
            </p>
            <a href="/merch" style={{ display: 'block', textAlign: 'center', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#94A3B8', fontWeight: 500, fontSize: 14, padding: '11px', borderRadius: 10, textDecoration: 'none' }}>
              Browse Catalogue →
            </a>
          </div>

          {/* MentorLink */}
          <div style={{ background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.20)', borderRadius: 16, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontSize: 32 }}>🎓</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#F1F0FF', letterSpacing: '-0.02em', margin: 0 }}>MentorLink</h3>
              <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(249,115,22,0.2)', color: '#FB923C', padding: '2px 8px', borderRadius: 99, fontFamily: 'monospace' }}>NEW</span>
            </div>
            <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.6, flex: 1, margin: 0 }}>
              Plug-and-go mentor sourcing for edtech companies. Browse verified mentors worldwide, filter by rates and expertise, hire instantly.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a href="/mentor/onboard" style={{ display: 'block', textAlign: 'center', background: '#F97316', color: '#fff', fontWeight: 700, fontSize: 14, padding: '11px', borderRadius: 10, textDecoration: 'none', boxShadow: '0 2px 12px rgba(249,115,22,0.35)' }}>
                Join as Mentor →
              </a>
              <a href="/mentor/edtech" style={{ display: 'block', textAlign: 'center', background: 'transparent', border: '1px solid rgba(249,115,22,0.25)', color: '#FB923C', fontWeight: 500, fontSize: 13, padding: '9px', borderRadius: 10, textDecoration: 'none' }}>
                I'm an EdTech →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* WHY JOBR */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '48px 40px' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 8, letterSpacing: '-0.02em', color: '#F1F0FF' }}>Why Jobr?</h2>
          <p style={{ textAlign: 'center', color: '#64748B', marginBottom: 40, fontSize: 15 }}>Three things we never compromise on.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
            {[
              { icon: '🔒', title: 'Privacy First', desc: 'Your data never leaves your device — ever. No CV stored, no data sold, no exceptions.' },
              { icon: '⚡', title: 'XYZ Formula', desc: "Every bullet rewritten using Google's proven hiring formula — quantified, impactful, ATS-ready." },
              { icon: '👁️', title: 'Live Preview', desc: 'See your transformed CV instantly before you apply. What you see is exactly what recruiters get.' },
            ].map(f => (
              <div key={f.title} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ width: 44, height: 44, background: 'rgba(124,58,237,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{f.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#F1F0FF', margin: 0 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MENTORLINK CTA */}
      <section style={{ maxWidth: 560, margin: '0 auto', padding: '0 24px 100px', textAlign: 'center' }}>
        <div style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.20)', borderRadius: 20, padding: '48px 32px' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🎓</div>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em', color: '#F1F0FF' }}>MentorLink is live</h2>
          <p style={{ color: '#64748B', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
            Plug-and-go mentor sourcing for edtech companies. Join now as a mentor or EdTech.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/mentor/onboard" style={{ background: '#F97316', color: '#fff', fontWeight: 700, fontSize: 14, padding: '11px 24px', borderRadius: 10, textDecoration: 'none', boxShadow: '0 2px 8px rgba(249,115,22,0.35)' }}>
              Join as Mentor
            </a>
            <a href="/mentor" style={{ background: 'transparent', color: '#FB923C', fontWeight: 600, fontSize: 14, padding: '11px 24px', borderRadius: 10, textDecoration: 'none', border: '1px solid rgba(249,115,22,0.25)' }}>
              Browse Mentors
            </a>
          </div>
        </div>
      </section>

      <style jsx global>{`@keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  );
}