'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, Menu, X, LayoutDashboard, ShoppingBag, GraduationCap, Home } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Optimizer', icon: LayoutDashboard, color: '#A78BFA', desc: 'AI CV Optimizer' },
  { href: '/merch',     label: 'Merch',     icon: ShoppingBag,     color: '#34D399', desc: 'Custom Merchandise' },
  { href: '/mentor',    label: 'Mentor',    icon: GraduationCap,   color: '#FB923C', desc: 'Mentor Sourcing' },
];

const PAGE_LABELS: Record<string, { label: string; color: string }> = {
  '/dashboard':        { label: 'Optimizer.Jobr', color: '#A78BFA' },
  '/merch':            { label: 'Merch.Jobr',     color: '#34D399' },
  '/mentor':           { label: 'Mentor.Jobr',    color: '#FB923C' },
  '/mentor/onboard':   { label: 'Mentor.Jobr',    color: '#FB923C' },
  '/mentor/dashboard': { label: 'Mentor.Jobr',    color: '#FB923C' },
  '/mentor/edtech':    { label: 'Mentor.Jobr',    color: '#FB923C' },
  '/mentor/book':      { label: 'Mentor.Jobr',    color: '#FB923C' },
  '/mentor/admin':     { label: 'Mentor.Jobr',    color: '#FB923C' },
  '/auth':             { label: 'Sign In',         color: '#A78BFA' },
};

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName,   setUserName]   = useState('');
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const router   = useRouter();
  const pathname = usePathname();

  const pageInfo = PAGE_LABELS[pathname] ||
    (pathname?.startsWith('/mentor') ? { label: 'Mentor.Jobr', color: '#FB923C' } : null);

  useEffect(() => {
    const checkAuth = () => {
      const session = localStorage.getItem('jobr_session');
      const user    = localStorage.getItem('jobr_user');
      const loggedIn = !!(session || user);
      setIsLoggedIn(loggedIn);
      if (loggedIn) {
        try {
          const parsed = JSON.parse(session || user || '{}');
          setUserName(parsed.name?.split(' ')[0] || parsed.email?.split('@')[0] || '');
        } catch {}
      }
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('jobr_session');
    localStorage.removeItem('jobr_user');
    setIsLoggedIn(false);
    setUserName('');
    router.push('/');
  };

  return (
    <>
      <header style={{
        height: 64, position: 'sticky', top: 0, zIndex: 50,
        background: scrolled ? 'rgba(28,28,46,0.96)' : 'rgba(28,28,46,0.80)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', height: '100%', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900, color: '#fff', fontFamily: 'var(--font-mono)', boxShadow: '0 4px 12px rgba(124,58,237,0.40)', transition: 'transform 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'rotate(-8deg) scale(1.1)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'rotate(0) scale(1)'; }}>J</div>
            <span style={{ fontSize: 17, fontWeight: 800, color: '#F1F0FF', letterSpacing: '-0.03em', fontFamily: 'var(--font-display)' }}>
              Jobr<span style={{ background: 'linear-gradient(135deg, #A78BFA, #F97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>.co.in</span>
            </span>
          </Link>

          {/* Center */}
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {pageInfo ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 18px', borderRadius: 100, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: pageInfo.color, animation: 'pulse-dot 2s infinite' }} />
                <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.04em', color: pageInfo.color }}>{pageInfo.label}</span>
              </div>
            ) : (
              NAV_ITEMS.map(item => (
                <a key={item.href} href={item.href} className="nav-link" style={{ fontSize: 13 }}>{item.label}.Jobr</a>
              ))
            )}
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {!isLoggedIn ? (
                <>
                  <a href="/auth" style={{ padding: '8px 16px', fontSize: 13, fontWeight: 600, color: '#94A3B8', borderRadius: 100, textDecoration: 'none', fontFamily: 'var(--font-display)', transition: 'color 0.15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#F1F0FF'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#94A3B8'; }}>Sign In</a>
                  <a href="/auth?mode=signup" className="btn-primary" style={{ fontSize: 13, padding: '10px 22px' }}>Get Started ✦</a>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 100, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #F97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff' }}>
                      {userName[0]?.toUpperCase() || 'U'}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#C4B5FD', fontFamily: 'var(--font-display)' }}>{userName}</span>
                  </div>
                  <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.20)', color: '#F87171', padding: '9px 16px', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-display)', transition: 'all 0.15s' }}>
                    <LogOut size={14} /> Sign Out
                  </button>
                </>
              )}
            </div>

            {/* Hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'none', width: 42, height: 42, borderRadius: 12, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#F1F0FF', cursor: 'pointer', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} className="mobile-menu-btn" aria-label="Menu">
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div style={{ position: 'absolute', top: 64, left: 0, right: 0, background: 'rgba(28,28,46,0.99)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '16px 20px 20px', animation: 'slideDown 0.2s ease', zIndex: 49 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {NAV_ITEMS.map(item => (
                <a key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 16, textDecoration: 'none', background: pathname === item.href ? 'rgba(124,58,237,0.12)' : 'rgba(255,255,255,0.02)', border: '1px solid', borderColor: pathname === item.href ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.06)', transition: 'all 0.15s' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: `${item.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <item.icon size={20} color={item.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#F1F0FF', fontFamily: 'var(--font-display)' }}>{item.label}.Jobr</div>
                    <div style={{ fontSize: 12, color: '#64748B' }}>{item.desc}</div>
                  </div>
                </a>
              ))}

              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '6px 0' }} />

              {!isLoggedIn ? (
                <div style={{ display: 'flex', gap: 8 }}>
                  <a href="/auth" className="btn-ghost" style={{ flex: 1, fontSize: 14, padding: '13px', justifyContent: 'center' }}>Sign In</a>
                  <a href="/auth?mode=signup" className="btn-primary" style={{ flex: 1, fontSize: 14, padding: '13px', justifyContent: 'center' }}>Get Started ✦</a>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'rgba(124,58,237,0.08)', borderRadius: 16, border: '1px solid rgba(124,58,237,0.15)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #F97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: '#fff' }}>
                      {userName[0]?.toUpperCase() || 'U'}
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 600, color: '#C4B5FD', fontFamily: 'var(--font-display)' }}>{userName}</span>
                  </div>
                  <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.20)', color: '#F87171', padding: '9px 16px', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="mobile-bottom-nav" style={{ justifyContent: 'space-around', alignItems: 'center' }}>
        <MobileNavItem href="/" label="Home" icon={Home} active={pathname === '/'} color="#A78BFA" />
        {NAV_ITEMS.map(item => (
          <MobileNavItem key={item.href} href={item.href} label={item.label} icon={item.icon}
            active={pathname === item.href || (pathname?.startsWith(item.href) && item.href !== '/')}
            color={item.color} />
        ))}
        {isLoggedIn ? (
          <button onClick={handleLogout} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #F97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff' }}>
              {userName[0]?.toUpperCase() || 'U'}
            </div>
            <span style={{ fontSize: 10, color: '#64748B', fontWeight: 500 }}>You</span>
          </button>
        ) : (
          <a href="/auth" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textDecoration: 'none', padding: '4px 8px' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #7C3AED, #A78BFA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#fff' }}>✦</div>
            <span style={{ fontSize: 10, color: '#7C3AED', fontWeight: 700 }}>Sign In</span>
          </a>
        )}
      </nav>
    </>
  );
}

function MobileNavItem({ href, label, icon: Icon, active, color }: { href: string; label: string; icon: any; active: boolean; color: string }) {
  return (
    <a href={href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textDecoration: 'none', padding: '4px 10px', position: 'relative', minWidth: 52 }}>
      {active && <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', width: 28, height: 3, background: color, borderRadius: 99 }} />}
      <div style={{ width: 28, height: 28, borderRadius: 9, background: active ? `${color}22` : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
        <Icon size={19} color={active ? color : '#64748B'} />
      </div>
      <span style={{ fontSize: 10, color: active ? color : '#64748B', fontWeight: active ? 700 : 500, transition: 'all 0.2s' }}>{label}</span>
    </a>
  );
}

export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(18,18,32,0.95)', padding: '60px 24px 40px', marginTop: 80 }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>

        {/* Top row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, marginBottom: 48 }}>

          {/* Brand */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #7C3AED, #A78BFA)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900, color: '#fff', fontFamily: 'var(--font-mono)' }}>J</div>
              <span style={{ fontSize: 18, fontWeight: 900, color: '#F1F0FF', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>Jobr.co.in</span>
            </div>
            <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.7, marginBottom: 16, maxWidth: 220 }}>
              AI tools for career growth. Built for students, professionals, and edtech companies across India.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {['🇮🇳 Made in India', '🔒 Privacy First'].map(t => (
                <span key={t} style={{ fontSize: 10, color: '#475569', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', padding: '4px 10px', borderRadius: 100, fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Products</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Optimizer.Jobr', href: '/dashboard', desc: 'AI CV Optimizer', color: '#A78BFA' },
                { label: 'Merch.Jobr',     href: '/merch',     desc: 'Custom Merchandise', color: '#34D399' },
                { label: 'Mentor.Jobr',    href: '/mentor',    desc: 'Mentor Sourcing', color: '#FB923C' },
              ].map(l => (
                <a key={l.label} href={l.href} style={{ textDecoration: 'none', transition: 'opacity 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.7'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: l.color, fontFamily: 'var(--font-display)' }}>{l.label}</div>
                  <div style={{ fontSize: 12, color: '#475569' }}>{l.desc}</div>
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Company</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'About Jobr', href: '/about' },
                { label: 'Our Mission', href: '/about#mission' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Contact Us', href: '/contact' },
              ].map(l => (
                <a key={l.label} href={l.href} style={{ fontSize: 14, color: '#64748B', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#A78BFA'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#64748B'; }}>
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          {/* Team */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Team</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Founder */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #F97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: '#fff', flexShrink: 0 }}>N</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#F1F0FF', fontFamily: 'var(--font-display)' }}>Nitish Wardhan</div>
                  <div style={{ fontSize: 11, color: '#475569' }}>Founder & Builder</div>
                </div>
              </div>
              {/* Hiring */}
              <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 12, padding: '12px 14px' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#A78BFA', marginBottom: 4 }}>✦ We're Hiring!</div>
                <div style={{ fontSize: 11, color: '#64748B', lineHeight: 1.5 }}>Looking for engineers, designers, and growth folks.</div>
                <a href="mailto:nitish@jobr.co.in" style={{ fontSize: 11, color: '#A78BFA', display: 'block', marginTop: 6, fontWeight: 600 }}>
                  nitish@jobr.co.in →
                </a>
              </div>
            </div>
          </div>

          {/* For EdTechs */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>For EdTechs</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Browse Mentors', href: '/mentor' },
                { label: 'Register as EdTech', href: '/mentor/edtech' },
                { label: 'Bulk Merch Orders', href: '/merch' },
                { label: 'MentorLink Credits', href: '/mentor/edtech' },
                { label: 'Dispute Resolution', href: '/mentor/edtech' },
              ].map(l => (
                <a key={l.label} href={l.href} style={{ fontSize: 14, color: '#64748B', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#FB923C'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#64748B'; }}>
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Mission strip */}
        <div style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 16, padding: '20px 24px', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 24 }}>🎯</div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#F1F0FF', fontFamily: 'var(--font-display)', marginBottom: 4 }}>Our Mission</div>
            <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5, margin: 0 }}>
              To make career growth accessible, transparent, and fair for every student and professional in India — and to make it dead simple for edtech companies to find and pay great mentors.
            </p>
          </div>
          <a href="/about" style={{ fontSize: 13, fontWeight: 700, color: '#A78BFA', textDecoration: 'none', whiteSpace: 'nowrap', fontFamily: 'var(--font-display)' }}>
            Read more →
          </a>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <p style={{ fontSize: 12, color: '#334155', fontFamily: 'var(--font-mono)', margin: 0 }}>
            © 2026 Jobr.co.in · Bangalore, India
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            {['Privacy', 'Terms', 'Contact'].map(l => (
              <a key={l} href={`/${l.toLowerCase()}`} style={{ fontSize: 12, color: '#334155', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#A78BFA'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#334155'; }}>
                {l}
              </a>
            ))}
          </div>
          <p style={{ fontSize: 12, color: '#334155', fontFamily: 'var(--font-mono)', margin: 0 }}>
            PRIVACY FIRST · XYZ POWERED
          </p>
        </div>
      </div>
    </footer>
  );
}