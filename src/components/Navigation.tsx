'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ExternalLink, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type TeamMember = {
  id: string; name: string; role: string; bio: string;
  linkedin_url: string; photo_url: string; email: string;
};

const NAV_LINKS = [
  { label: 'Prep.Jobr',   href: '/dashboard', color: '#F97316', desc: 'AI Career Preparation' },
  { label: 'Mentor.Jobr', href: '/mentor',     color: '#7C3AED', desc: 'Expert Guidance'      },
  { label: 'Merch.Jobr',  href: '/merch',      color: '#16A34A', desc: 'Community & Identity' },
];

export function Header() {
  const pathname  = usePathname();
  const router    = useRouter();
  const [user,     setUser]     = useState<any>(null);
  const [mounted,  setMounted]  = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUser({
        email: user.email,
        name:  user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '',
        photo: user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
      });
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = session.user;
        setUser({
          email: u.email,
          name:  u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || '',
          photo: u.user_metadata?.avatar_url || u.user_metadata?.picture || '',
        });
      } else { setUser(null); }
    });

    return () => { subscription.unsubscribe(); window.removeEventListener('scroll', onScroll); };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('jobr_session');
    localStorage.removeItem('jobr_user');
    setUser(null);
    router.push('/');
  };

  const pageLabel = Object.fromEntries(NAV_LINKS.map(l => [l.href, l.label]));
  const currentLabel = Object.entries(pageLabel).find(([path]) => pathname.startsWith(path))?.[1];
  const isHome = pathname === '/';

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        height: 64, display: 'flex', alignItems: 'center',
        background: scrolled ? 'rgba(248,245,240,0.92)' : 'rgba(248,245,240,0.70)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid #E7E5E4' : '1px solid transparent',
        transition: 'all 0.3s',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>

          {/* Logo */}
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: 32, height: 32, background: '#18181B', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 14, color: '#F97316', letterSpacing: '-0.04em', transition: 'transform 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'rotate(-6deg) scale(1.05)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; }}>
              J
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: '#18181B', letterSpacing: '-0.03em' }}>Jobr</span>
          </a>

          {/* Center nav */}
          <nav className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {NAV_LINKS.map(link => (
              <a key={link.href} href={link.href} className="nav-link" style={{ color: pathname.startsWith(link.href) ? link.color : undefined }}>
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {mounted && user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <a href="/profile" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 100, textDecoration: 'none', transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#F97316'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg, #F97316, #EA580C)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: '#fff', overflow: 'hidden', flexShrink: 0 }}>
                    {user.photo ? <img src={user.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (user.name || 'U')[0].toUpperCase()}
                  </div>
                  <span style={{ fontSize: 13, color: 'var(--text-2)', fontFamily: 'var(--font-display)', fontWeight: 600, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name || user.email?.split('@')[0]}
                  </span>
                </a>
                <button onClick={handleSignOut} style={{ padding: '7px 14px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 100, color: 'var(--text-3)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-display)', transition: 'all 0.15s' }}>
                  Sign Out
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <a href="/auth" className="desktop-only btn-ghost" style={{ padding: '9px 20px', fontSize: 14 }}>Sign In</a>
                <a href="/auth?mode=signup" className="btn-primary" style={{ padding: '10px 22px', fontSize: 14 }}>
                  Get Started
                </a>
              </div>
            )}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="mobile-menu-btn"
              style={{ display: 'none', width: 38, height: 38, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 9, alignItems: 'center', justifyContent: 'center', color: 'var(--text-2)', cursor: 'pointer' }}>
              {menuOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 64, left: 0, right: 0, zIndex: 199,
          background: 'rgba(248,245,240,0.98)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)', padding: '16px 20px 24px',
          display: 'flex', flexDirection: 'column', gap: 4,
          animation: 'slideDown 0.2s ease both',
        }}>
          {NAV_LINKS.map(link => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 16px', borderRadius: 12, textDecoration: 'none',
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(24,24,27,0.05)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#18181B', fontFamily: 'var(--font-display)' }}>{link.label}</span>
              <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{link.desc}</span>
            </a>
          ))}
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {!user && <>
              <a href="/auth?mode=signup" className="btn-primary" style={{ justifyContent: 'center' }}>Get Started</a>
              <a href="/auth" className="btn-ghost" style={{ justifyContent: 'center' }}>Sign In</a>
            </>}
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        @media (max-width: 768px) { .mobile-menu-btn { display: flex !important; } }
      `}</style>
    </>
  );
}

export function Footer() {
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    supabase.from('team_members').select('*').eq('is_active', true).order('display_order').then(({ data }) => {
      if (data && data.length > 0) setTeam(data);
      else setTeam([{
        id: '1', name: 'Nitish Wardhan', role: 'Founder & Builder',
        bio: 'Building Jobr to make career growth accessible for every student in India.',
        linkedin_url: 'https://linkedin.com/in/nitishwardhan',
        photo_url: '', email: 'nitish@jobr.co.in',
      }]);
    });
  }, []);

  return (
    <footer style={{ background: '#18181B', color: '#71717A' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 24px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: '48px 32px', marginBottom: 56 }}>

          {/* Brand */}
          <div style={{ gridColumn: 'span 2', maxWidth: 340 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, background: '#F97316', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 14, color: '#fff' }}>J</div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: '#FAFAF9', letterSpacing: '-0.03em' }}>Jobr</span>
            </div>
            <p style={{ fontSize: 14, color: '#52525B', lineHeight: 1.7, marginBottom: 20 }}>
              The career operating system for students. Preparation, mentorship, and growth — all in one place.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['🇮🇳 Made in India', '🔒 Privacy First', '⚡ AI Powered'].map(tag => (
                <span key={tag} style={{ fontSize: 11, color: '#3F3F46', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', padding: '4px 10px', borderRadius: 100, fontFamily: 'var(--font-mono)' }}>{tag}</span>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#3F3F46', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Products</div>
            {NAV_LINKS.map(l => (
              <div key={l.href} style={{ marginBottom: 12 }}>
                <a href={l.href} style={{ display: 'block', fontSize: 14, fontWeight: 700, color: l.color, textDecoration: 'none', fontFamily: 'var(--font-display)', marginBottom: 2 }}>{l.label}</a>
                <div style={{ fontSize: 12, color: '#3F3F46' }}>{l.desc}</div>
              </div>
            ))}
          </div>

          {/* Company */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#3F3F46', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Company</div>
            {[['About', '/about'], ['Mission', '/mission'], ['Privacy', '/privacy'], ['Terms', '/terms'], ['Contact', '/contact']].map(([l, h]) => (
              <a key={h} href={h} style={{ display: 'block', fontSize: 13, color: '#52525B', textDecoration: 'none', marginBottom: 10, transition: 'color 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#FAFAF9'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#52525B'; }}>{l}</a>
            ))}
          </div>

          {/* Team */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#3F3F46', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Team</div>
            {team.map(member => (
              <div key={member.id} style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #F97316, #EA580C)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#fff', flexShrink: 0, overflow: 'hidden' }}>
                  {member.photo_url ? <img src={member.photo_url} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : member.name[0]}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#FAFAF9', fontFamily: 'var(--font-display)' }}>{member.name}</div>
                  <div style={{ fontSize: 11, color: '#3F3F46', marginBottom: 4 }}>{member.role}</div>
                  {member.linkedin_url && (
                    <a href={member.linkedin_url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#F97316', textDecoration: 'none' }}>
                      <ExternalLink size={10} /> LinkedIn
                    </a>
                  )}
                </div>
              </div>
            ))}
            <div style={{ padding: '12px 14px', background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.15)', borderRadius: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#F97316', marginBottom: 4, fontFamily: 'var(--font-display)' }}>We're Hiring!</div>
              <div style={{ fontSize: 12, color: '#52525B', marginBottom: 6 }}>Engineers, designers, and growth folks.</div>
              <a href="mailto:nitish@jobr.co.in?subject=I want to join Jobr" style={{ fontSize: 12, fontWeight: 700, color: '#F97316', textDecoration: 'none' }}>nitish@jobr.co.in →</a>
            </div>
          </div>

        </div>

        <div style={{ paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 13, color: '#27272A' }}>© 2026 Jobr · Bangalore, India</span>
          <span style={{ fontSize: 11, color: '#1C1C1E', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Career OS · Privacy First</span>
        </div>
      </div>
    </footer>
  );
}
