'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';

const PAGE_LABELS: Record<string, string> = {
  '/':                  '',
  '/dashboard':         'Optimizer.Jobr',
  '/merch':             'Merch.Jobr',
  '/mentor':            'Mentor.Jobr',
  '/mentor/onboard':    'Mentor.Jobr',
  '/mentor/dashboard':  'Mentor.Jobr',
  '/mentor/edtech':     'Mentor.Jobr',
  '/mentor/book':       'Mentor.Jobr',
  '/mentor/admin':      'Mentor.Jobr',
};

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName,   setUserName]   = useState('');
  const router   = useRouter();
  const pathname = usePathname();
  const pageLabel = PAGE_LABELS[pathname] || (pathname?.startsWith('/mentor') ? 'Mentor.Jobr' : '');

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
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jobr_session');
    localStorage.removeItem('jobr_user');
    setIsLoggedIn(false);
    setUserName('');
    router.push('/');
  };

  return (
    <header style={{
      height: 60,
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(28,28,46,0.95)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      position: 'sticky', top: 0, zIndex: 50,
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      padding: '0 24px',
      gap: 16,
    }}>

      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
        <div style={{ width: 28, height: 28, background: '#7C3AED', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff', fontFamily: 'monospace' }}>J</div>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#F1F0FF', letterSpacing: '-0.02em' }}>
          Jobr<span style={{ color: '#A78BFA' }}>.co.in</span>
        </span>
      </Link>

      {/* Center */}
      <div style={{ textAlign: 'center' }}>
        {pageLabel ? (
          <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.04em', color: '#A78BFA', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)', padding: '4px 14px', borderRadius: 99 }}>
            {pageLabel}
          </span>
        ) : (
          <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {[
              { href: '/dashboard', label: 'Optimizer.Jobr' },
              { href: '/merch',     label: 'Merch.Jobr' },
              { href: '/mentor',    label: 'Mentor.Jobr' },
            ].map(l => (
              <a key={l.href} href={l.href} style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 12px', fontSize: 13, fontWeight: 500, color: '#94A3B8', borderRadius: 8, textDecoration: 'none', transition: 'color 0.15s, background 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#F1F0FF'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#94A3B8'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                {l.label}
              </a>
            ))}
          </nav>
        )}
      </div>

      {/* Auth */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
        {!isLoggedIn ? (
          <>
            <a href="/auth" style={{ padding: '6px 12px', fontSize: 13, fontWeight: 500, color: '#94A3B8', borderRadius: 8, textDecoration: 'none' }}>Sign In</a>
            <a href="/auth?mode=signup" style={{ display: 'inline-flex', alignItems: 'center', background: '#7C3AED', color: '#fff', fontWeight: 700, fontSize: 13, padding: '8px 18px', borderRadius: 8, textDecoration: 'none', boxShadow: '0 2px 12px rgba(124,58,237,0.35)' }}>
              Get Started
            </a>
          </>
        ) : (
          <>
            {userName && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 8, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.20)' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#7C3AED', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900 }}>
                  {userName[0].toUpperCase()}
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#C4B5FD' }}>{userName}</span>
              </div>
            )}
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.20)', color: '#F87171', padding: '6px 12px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
              <LogOut size={13} /> Sign Out
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: '#1C1C2E', padding: '32px 24px', marginTop: 80 }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 22, height: 22, background: '#7C3AED', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 900, color: '#fff', fontFamily: 'monospace' }}>J</div>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#F1F0FF' }}>Jobr.co.in</span>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {[{ label: 'Optimizer.Jobr', href: '/dashboard' }, { label: 'Merch.Jobr', href: '/merch' }, { label: 'Mentor.Jobr', href: '/mentor' }].map(l => (
            <a key={l.label} href={l.href} style={{ fontSize: 12, color: '#475569', textDecoration: 'none' }}>{l.label}</a>
          ))}
        </div>
        <p style={{ fontSize: 11, color: '#334155', fontFamily: 'monospace', margin: 0, letterSpacing: '0.1em' }}>
          PRIVACY FIRST · XYZ POWERED · 2026
        </p>
      </div>
    </footer>
  );
}