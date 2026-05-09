'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';

const PAGE_LABELS: Record<string, string> = {
  '/':          '',
  '/dashboard': 'Optimizer.Jobr',
  '/merch':     'Merch.Jobr',
  '/mentor':    'Mentor.Jobr',
};

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  const pageLabel = PAGE_LABELS[pathname] ?? '';

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
      background: 'rgba(6,11,24,0.95)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      position: 'sticky', top: 0, zIndex: 50,
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      padding: '0 24px',
      gap: 16,
    }}>

      {/* LEFT — Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
        <div style={{
          width: 28, height: 28, background: '#38BDF8', borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 900, color: '#0F172A', fontFamily: 'monospace',
        }}>J</div>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC', letterSpacing: '-0.02em' }}>
          Jobr<span style={{ color: '#38BDF8' }}>.co.in</span>
        </span>
      </Link>

      {/* CENTER — Current page label */}
      <div style={{ textAlign: 'center' }}>
        {pageLabel ? (
          <span style={{
            fontSize: 13, fontWeight: 700, fontFamily: 'monospace',
            letterSpacing: '0.04em',
            color: '#38BDF8',
            background: 'rgba(56,189,248,0.08)',
            border: '1px solid rgba(56,189,248,0.2)',
            padding: '4px 14px', borderRadius: 99,
          }}>
            {pageLabel}
          </span>
        ) : (
          /* On homepage show the three product links */
          <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <a href="/dashboard" className="nav-link" style={{ fontSize: 13 }}>Optimizer.Jobr</a>
            <a href="/merch"     className="nav-link" style={{ fontSize: 13 }}>Merch.Jobr</a>
            <span className="nav-link" style={{ fontSize: 13, cursor: 'default', opacity: 0.4 }}>
              Mentor.Jobr <span className="nav-badge">SOON</span>
            </span>
          </nav>
        )}
      </div>

      {/* RIGHT — Auth */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
        {!isLoggedIn ? (
          <>
            <a href="/auth" className="nav-link" style={{ fontSize: 13 }}>Sign In</a>
            <a href="/auth?mode=signup" className="cta-btn">Get Started</a>
          </>
        ) : (
          <>
            {userName && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '4px 10px', borderRadius: 8,
                background: 'rgba(56,189,248,0.08)',
                border: '1px solid rgba(56,189,248,0.15)',
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: '#38BDF8', color: '#0F172A',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 900,
                }}>
                  {userName[0].toUpperCase()}
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#94A3B8' }}>{userName}</span>
              </div>
            )}
            <button onClick={handleLogout} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: '#F87171', padding: '6px 12px', borderRadius: 8,
              fontSize: 13, fontWeight: 500, cursor: 'pointer',
            }}>
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
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.06)',
      background: '#060B18', padding: '32px 24px', marginTop: 80,
    }}>
      <div style={{
        maxWidth: 1120, margin: '0 auto',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 22, height: 22, background: '#38BDF8', borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 9, fontWeight: 900, color: '#0F172A', fontFamily: 'monospace',
          }}>J</div>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#F8FAFC' }}>Jobr.co.in</span>
        </div>
        <p style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace', margin: 0, letterSpacing: '0.1em' }}>
          PRIVACY FIRST · GOOGLE XYZ POWERED · 2026
        </p>
      </div>
    </footer>
  );
}