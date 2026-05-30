'use client';
import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';

export function JobrNav() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const NAV = [
    { label: 'Solutions',     href: '#workflow' },
    { label: 'Platform',      href: '#platform' },
    { label: 'Integrations',  href: '#integrations' },
    { label: 'Resources',     href: '#case-studies' },
  ];

  return (
    <>
      <header style={{
        position:   'fixed',
        top:        0,
        left:       0,
        right:      0,
        zIndex:     200,
        height:     64,
        display:    'flex',
        alignItems: 'center',
        background: scrolled ? 'rgba(248,245,240,0.90)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid #E7E5E4' : '1px solid transparent',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', width: '100%', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>

          {/* Logo */}
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{
              width: 34, height: 34,
              background: '#18181B',
              borderRadius: 9,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontWeight: 900, fontSize: 15, color: '#fff',
              letterSpacing: '-0.04em',
            }}>J</div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: '#18181B', letterSpacing: '-0.03em' }}>
              Jobr
            </span>
          </a>

          {/* Center nav */}
          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {NAV.map(n => (
              <a key={n.label} href={n.href} className="nav-link">{n.label}</a>
            ))}
          </nav>

          {/* Right CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <a href="#cta" className="desktop-nav btn-ghost" style={{ padding: '9px 20px', fontSize: 14 }}>
              Talk to Sales
            </a>
            <a href="#cta" className="btn-primary" style={{ padding: '10px 22px', fontSize: 14 }}>
              Book Demo
            </a>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="mobile-menu-btn"
              style={{ display: 'none', width: 38, height: 38, background: 'transparent', border: '1px solid #E7E5E4', borderRadius: 9, alignItems: 'center', justifyContent: 'center', color: '#52525B', cursor: 'pointer' }}>
              {menuOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 64, left: 0, right: 0,
          background: 'rgba(248,245,240,0.97)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid #E7E5E4',
          zIndex: 199, padding: '20px 24px 28px',
          display: 'flex', flexDirection: 'column', gap: 6,
          animation: 'slide-down-in 0.2s ease both',
        }}>
          {NAV.map(n => (
            <a key={n.label} href={n.href} onClick={() => setMenuOpen(false)} style={{
              fontSize: 16, fontWeight: 600, color: '#18181B',
              padding: '12px 16px', borderRadius: 10,
              textDecoration: 'none', fontFamily: 'var(--font-display)',
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(24,24,27,0.05)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
              {n.label}
            </a>
          ))}
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <a href="#cta" onClick={() => setMenuOpen(false)} className="btn-primary" style={{ justifyContent: 'center' }}>
              Book Demo
            </a>
          </div>
        </div>
      )}
    </>
  );
}

export function JobrFooter() {
  return (
    <footer style={{ background: '#18181B', color: '#A1A1AA' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '72px 32px 48px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '48px 32px', marginBottom: 64 }}>

          {/* Brand */}
          <div style={{ gridColumn: 'span 2', maxWidth: 360 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 34, height: 34, background: '#F97316', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 15, color: '#fff' }}>J</div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: '#FAFAF9', letterSpacing: '-0.03em' }}>Jobr</span>
            </div>
            <p style={{ fontSize: 14, color: '#71717A', lineHeight: 1.7, marginBottom: 20 }}>
              Merchandise operations infrastructure for the world's fastest-growing organizations. APIs, webhooks, and intelligent fulfillment orchestration.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['🇮🇳 Built in India', '🔒 SOC 2 Ready', '⚡ 99.9% Uptime'].map(tag => (
                <span key={tag} style={{ fontSize: 11, color: '#52525B', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', padding: '4px 10px', borderRadius: 100, fontFamily: 'var(--font-mono)' }}>{tag}</span>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#52525B', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', marginBottom: 16, textTransform: 'uppercase' }}>Platform</div>
            {['Workflow Engine', 'Inventory API', 'Fulfillment Hub', 'Analytics', 'Webhooks & Events'].map(l => (
              <a key={l} href="#" style={{ display: 'block', fontSize: 14, color: '#71717A', textDecoration: 'none', marginBottom: 10, transition: 'color 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#FAFAF9'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#71717A'; }}>
                {l}
              </a>
            ))}
          </div>

          {/* Solutions */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#52525B', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', marginBottom: 16, textTransform: 'uppercase' }}>Solutions</div>
            {['Onboarding Kits', 'Cohort Merchandise', 'Event Swag', 'Welcome Kits', 'Certification Merch'].map(l => (
              <a key={l} href="#" style={{ display: 'block', fontSize: 14, color: '#71717A', textDecoration: 'none', marginBottom: 10, transition: 'color 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#FAFAF9'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#71717A'; }}>
                {l}
              </a>
            ))}
          </div>

          {/* Company */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#52525B', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', marginBottom: 16, textTransform: 'uppercase' }}>Company</div>
            {[['About', '/about'], ['Mission', '/mission'], ['Contact', '/contact'], ['Privacy', '/privacy'], ['Terms', '/terms']].map(([l, h]) => (
              <a key={h} href={h} style={{ display: 'block', fontSize: 14, color: '#71717A', textDecoration: 'none', marginBottom: 10, transition: 'color 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#FAFAF9'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#71717A'; }}>
                {l}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div style={{ paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 13, color: '#3F3F46' }}>© 2026 Jobr Technologies · Bangalore, India</span>
          <span style={{ fontSize: 11, color: '#27272A', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Infrastructure · Not Merchandise
          </span>
        </div>
      </div>
    </footer>
  );
}

/* Keep old exports for compatibility with other pages */
export function Header() { return <JobrNav />; }
export function Footer() { return <JobrFooter />; }
