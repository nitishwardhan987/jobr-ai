'use client';

// src/app/page.tsx
// Jobr homepage — 3 products, feature cards, warm light palette

import { useEffect, useState } from 'react';

export default function HomePage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  // Read logged-in user from localStorage (set by auth page on sign-in)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('jobr_user');
      if (stored) setUser(JSON.parse(stored));
    } catch {}
  }, []);

  return (
    <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>

      {/* ── Logged-in welcome strip ── */}
      {user && (
        <div style={{
          margin: '24px 0 0',
          padding: '12px 20px',
          background: 'var(--accent-light)',
          border: '1px solid var(--border-accent)',
          borderRadius: 'var(--radius-md)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--accent)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700,
            }}>
              {user.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>
                Welcome back, {user.name?.split(' ')[0]} 👋
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{user.email}</div>
            </div>
          </div>
          <button
            onClick={() => { localStorage.removeItem('jobr_user'); setUser(null); }}
            style={{
              fontSize: 12, color: 'var(--text-3)', background: 'none',
              border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)',
            }}
          >
            Sign out
          </button>
        </div>
      )}

      {/* ── Hero ── */}
      <section style={{ paddingTop: user ? 48 : 80, paddingBottom: 64, textAlign: 'center' }}>
        <div className="animate-fade-up" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'var(--accent-light)', color: 'var(--accent)',
          borderRadius: 99, padding: '5px 14px', marginBottom: 24,
          fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-mono)',
          letterSpacing: '0.06em',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)',
            display: 'inline-block', animation: 'pulse-dot 2s infinite',
          }} />
          NEURAL IMPACT ENGINE V3
        </div>

        <h1 className="animate-fade-up-1" style={{
          fontSize: 'clamp(36px, 6vw, 64px)',
          fontWeight: 800, lineHeight: 1.08,
          letterSpacing: '-0.03em',
          color: 'var(--text-1)',
          marginBottom: 20,
        }}>
          Own the{' '}
          <span style={{ color: 'var(--accent)' }}>Shortlist.</span>
        </h1>

        <p className="animate-fade-up-2" style={{
          fontSize: 18, color: 'var(--text-2)', lineHeight: 1.6,
          maxWidth: 560, margin: '0 auto 36px',
          fontWeight: 400,
        }}>
          AI-powered tools for career growth — CV optimisation, custom merch, and mentor sourcing.
          Built for India's tech elite.
        </p>

        <div className="animate-fade-up-3" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/auth" className="btn-primary" style={{ fontSize: 15, padding: '12px 28px' }}>
            Get Started — It's Free
          </a>
          <a href="/merch" className="btn-ghost" style={{ fontSize: 15, padding: '12px 28px' }}>
            Explore Merch
          </a>
        </div>
      </section>

      {/* ── 3 Product Cards ── */}
      <section style={{ paddingBottom: 80 }}>
        <p style={{
          textAlign: 'center', fontSize: 12, fontFamily: 'var(--font-mono)',
          letterSpacing: '0.12em', color: 'var(--text-3)', marginBottom: 32,
          textTransform: 'uppercase',
        }}>
          Everything you need · one platform
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 20,
        }}>
          <ProductCard
            icon="📄"
            badge="Live"
            badgeColor="green"
            title="CV Optimizer"
            description="Land more interviews with AI-powered resumes. Paste your CV, paste the JD — get a perfectly tailored application in 30 seconds."
            cta="Start Optimizing"
            href="/auth"
            accent
          />
          <ProductCard
            icon="👕"
            badge="Live"
            badgeColor="green"
            title="Merch Store"
            description="Custom-printed apparel, accessories, and more. Design your own or order from our catalogue. Bulk orders from 10 units."
            cta="Browse Catalogue"
            href="/merch"
          />
          <ProductCard
            icon="🎓"
            badge="Coming Soon"
            badgeColor="amber"
            title="MentorLink"
            description="Plug-and-go mentor sourcing for edtech companies. Browse verified mentors worldwide, filter by rates and expertise, hire instantly."
            cta="Join Waitlist"
            href="#waitlist"
            disabled
          />
        </div>
      </section>

      {/* ── Feature strips ── */}
      <section style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: '48px 40px',
        marginBottom: 80,
      }}>
        <h2 style={{
          fontSize: 28, fontWeight: 700, textAlign: 'center',
          marginBottom: 8, letterSpacing: '-0.02em',
        }}>
          Why Jobr?
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-2)', marginBottom: 40, fontSize: 15 }}>
          Three things we never compromise on.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 24,
        }}>
          <FeatureCard
            icon="🔒"
            title="Privacy First"
            description="Your data never leaves your device — ever. No CV stored, no data sold, no exceptions."
          />
          <FeatureCard
            icon="⚡"
            title="XYZ Formula"
            description="Every bullet rewritten using Google's proven hiring formula — quantified, impactful, ATS-ready."
          />
          <FeatureCard
            icon="👁️"
            title="Live Preview"
            description="See your transformed CV instantly before you apply. What you see is exactly what recruiters get."
          />
        </div>
      </section>

      {/* ── Waitlist section for MentorLink ── */}
      <section id="waitlist" style={{
        textAlign: 'center', paddingBottom: 80,
      }}>
        <div style={{
          display: 'inline-block',
          background: 'var(--accent-light)',
          borderRadius: 'var(--radius-xl)',
          padding: '48px 40px',
          maxWidth: 560, width: '100%',
        }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🎓</div>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em' }}>
            MentorLink is coming
          </h2>
          <p style={{ color: 'var(--text-2)', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
            Join the waitlist and be the first to connect edtech companies with world-class mentors.
          </p>
          <WaitlistForm />
        </div>
      </section>
    </div>
  );
}

/* ── Sub-components ───────────────────────────────────────────────────────── */

function ProductCard({
  icon, badge, badgeColor, title, description, cta, href, accent, disabled,
}: {
  icon: string; badge: string; badgeColor: 'green' | 'amber' | 'purple';
  title: string; description: string; cta: string; href: string;
  accent?: boolean; disabled?: boolean;
}) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: accent ? '2px solid var(--accent)' : '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '28px 24px',
      display: 'flex', flexDirection: 'column', gap: 16,
      boxShadow: accent ? '0 4px 24px rgba(107,78,255,0.12)' : 'var(--shadow-sm)',
      position: 'relative',
      opacity: disabled ? 0.75 : 1,
    }}>
      {accent && (
        <div style={{
          position: 'absolute', top: -1, right: 20,
          background: 'var(--accent)', color: '#fff',
          fontSize: 9, fontWeight: 700, fontFamily: 'var(--font-mono)',
          padding: '3px 10px', borderRadius: '0 0 8px 8px',
          letterSpacing: '0.08em',
        }}>FEATURED</div>
      )}
      <div style={{ fontSize: 36 }}>{icon}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>{title}</h3>
        <span className={`badge badge-${badgeColor}`}>{badge}</span>
      </div>
      <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, margin: 0, flex: 1 }}>
        {description}
      </p>
      <a
        href={disabled ? '#waitlist' : href}
        className={accent ? 'btn-primary' : 'btn-ghost'}
        style={{ textAlign: 'center', fontSize: 14, opacity: disabled ? 0.6 : 1 }}
      >
        {cta} {!disabled && '→'}
      </a>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{
        width: 44, height: 44,
        background: 'var(--accent-light)',
        borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22,
      }}>{icon}</div>
      <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{title}</h3>
      <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>{description}</p>
    </div>
  );
}

function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: wire to backend / email list
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div style={{
        background: '#D1FAE5', borderRadius: 'var(--radius-md)',
        padding: '14px 20px', fontSize: 14, color: '#065F46', fontWeight: 500,
      }}>
        ✓ You're on the list! We'll reach out when MentorLink launches.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="input"
        style={{ flex: 1, minWidth: 200 }}
      />
      <button type="submit" className="btn-primary">
        Join Waitlist
      </button>
    </form>
  );
}