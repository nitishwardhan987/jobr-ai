'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type TeamMember = {
  id: string; name: string; role: string; bio: string;
  linkedin_url: string; photo_url: string; email: string;
};

export function Header() {
  const pathname  = usePathname();
  const router    = useRouter();
  const [user,     setUser]     = useState<any>(null);
  const [mounted,  setMounted]  = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const s = localStorage.getItem('jobr_session') || localStorage.getItem('jobr_user');
    if (s) { try { setUser(JSON.parse(s)); } catch {} }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('jobr_session');
    localStorage.removeItem('jobr_user');
    setUser(null);
    router.push('/');
  };

  const pageLabel: Record<string, string> = {
    '/dashboard': 'Prep.Jobr',
    '/merch':     'Merch.Jobr',
    '/mentor':    'Mentor.Jobr',
  };
  const currentLabel = Object.entries(pageLabel).find(([path]) => pathname.startsWith(path))?.[1];
  const isHome = pathname === '/';

  const NAV_LINKS = [
    { label: 'Prep.Jobr',   href: '/dashboard', color: '#7C3AED' },
    { label: 'Merch.Jobr',  href: '/merch',     color: '#10B981' },
    { label: 'Mentor.Jobr', href: '/mentor',     color: '#4F46E5' },
  ];

  return (
    <>
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(28,28,46,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)', height: 64, display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 16 }}>

          {/* Left — Logo */}
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #7C3AED, #F97316)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 16, color: '#fff', transition: 'transform 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'rotate(-8deg) scale(1.05)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'rotate(0) scale(1)'; }}>
              J
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: '#F1F0FF', letterSpacing: '-0.02em' }}>
              Jobr<span style={{ color: '#7C3AED' }}>.co.in</span>
            </span>
          </a>

          {/* Center */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {isHome ? (
              <div className="desktop-nav" style={{ display: 'flex', gap: 4 }}>
                {NAV_LINKS.map(link => (
                  <a key={link.href} href={link.href} style={{ fontSize: 13, fontWeight: 700, color: link.color, padding: '6px 14px', borderRadius: 100, background: `${link.color}12`, border: `1px solid ${link.color}25`, textDecoration: 'none', fontFamily: 'var(--font-display)', transition: 'all 0.15s', whiteSpace: 'nowrap' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${link.color}22`; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${link.color}12`; }}>
                    {link.label}
                  </a>
                ))}
              </div>
            ) : currentLabel ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: NAV_LINKS.find(l => l.label === currentLabel)?.color || '#7C3AED', animation: 'pulse-dot 2s infinite' }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#F1F0FF', fontFamily: 'var(--font-display)' }}>{currentLabel}</span>
              </div>
            ) : null}
          </div>

          {/* Right — Auth */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>
            {mounted && user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #F97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: '#fff' }}>
                    {(user.name || user.email || 'U')[0].toUpperCase()}
                  </div>
                  <span style={{ fontSize: 13, color: '#94A3B8', fontFamily: 'monospace', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name || user.email?.split('@')[0]}
                  </span>
                </div>
                <button onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 100, color: '#EF4444', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
                  Sign Out
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <a href="/auth" style={{ padding: '8px 18px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 100, color: '#94A3B8', fontSize: 13, fontWeight: 600, textDecoration: 'none', fontFamily: 'var(--font-display)', transition: 'all 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.25)'; (e.currentTarget as HTMLElement).style.color = '#F1F0FF'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLElement).style.color = '#94A3B8'; }}>
                  Sign In
                </a>
                <a href="/auth?mode=signup" style={{ padding: '8px 20px', background: 'linear-gradient(135deg, #7C3AED, #6D28D9)', border: 'none', borderRadius: 100, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none', fontFamily: 'var(--font-display)', boxShadow: '0 2px 10px rgba(124,58,237,0.4)' }}>
                  Get Started ✦
                </a>
              </div>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-menu-btn" style={{ display: 'none', width: 36, height: 36, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, alignItems: 'center', justifyContent: 'center', color: '#94A3B8', cursor: 'pointer' }}>
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ position: 'fixed', top: 64, left: 0, right: 0, background: 'rgba(28,28,46,0.98)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)', zIndex: 99, padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {NAV_LINKS.map(link => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{ fontSize: 16, fontWeight: 700, color: link.color, padding: '12px 16px', borderRadius: 12, background: `${link.color}10`, textDecoration: 'none', fontFamily: 'var(--font-display)' }}>
              {link.label}
            </a>
          ))}
          {!user && (
            <>
              <a href="/auth" onClick={() => setMenuOpen(false)} style={{ fontSize: 15, fontWeight: 600, color: '#94A3B8', padding: '12px 16px', textDecoration: 'none' }}>Sign In</a>
              <a href="/auth?mode=signup" onClick={() => setMenuOpen(false)} style={{ fontSize: 15, fontWeight: 700, color: '#fff', padding: '12px 16px', background: 'linear-gradient(135deg, #7C3AED, #6D28D9)', borderRadius: 12, textDecoration: 'none', textAlign: 'center', fontFamily: 'var(--font-display)' }}>Get Started ✦</a>
            </>
          )}
        </div>
      )}

      <style jsx global>{`
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
        @media (max-width: 768px) { .mobile-menu-btn { display: flex !important; } .desktop-nav { display: none !important; } }
        .input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #F1F0FF; padding: 10px 14px; font-family: var(--font-sans); outline: none; box-sizing: border-box; transition: border-color 0.15s; }
        .input:focus { border-color: rgba(124,58,237,0.5); }
        .btn-primary { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #7C3AED, #6D28D9); color: #fff; font-weight: 700; padding: 13px 32px; border-radius: 100px; text-decoration: none; font-family: var(--font-display); box-shadow: 0 4px 16px rgba(124,58,237,0.4); transition: transform 0.2s; }
        .btn-primary:hover { transform: translateY(-2px); }
        .btn-ghost { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.06); color: #94A3B8; font-weight: 600; padding: 13px 28px; border-radius: 100px; text-decoration: none; border: 1px solid rgba(255,255,255,0.1); transition: all 0.2s; }
        .btn-ghost:hover { background: rgba(255,255,255,0.1); color: #F1F0FF; }
        .btn-orange { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #F97316, #EA6B0A); color: #fff; font-weight: 700; padding: 13px 32px; border-radius: 100px; text-decoration: none; font-family: var(--font-display); box-shadow: 0 4px 16px rgba(249,115,22,0.4); transition: transform 0.2s; }
        .btn-orange:hover { transform: translateY(-2px); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
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
    <footer style={{ background: '#12121E', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(40px,5vw,64px) 20px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,180px), 1fr))', gap: 'clamp(28px,4vw,48px)' }}>

          {/* Brand */}
          <div style={{ gridColumn: 'span 1' }}>
            <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #7C3AED, #F97316)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 16, color: '#fff' }}>J</div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: '#F1F0FF', letterSpacing: '-0.02em' }}>Jobr.co.in</span>
            </a>
            <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.65, marginBottom: 16, maxWidth: 220 }}>
              India's AI career platform for students, edtech companies, and domain experts.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, color: '#475569', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', padding: '4px 10px', borderRadius: 100 }}>🇮🇳 Made in India</span>
              <span style={{ fontSize: 11, color: '#475569', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', padding: '4px 10px', borderRadius: 100 }}>🔒 Privacy First</span>
            </div>
          </div>

          {/* Products */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', fontFamily: 'monospace', letterSpacing: '0.12em', marginBottom: 16 }}>PRODUCTS</div>
            {[
              { label: 'Prep.Jobr',   sub: 'AI Career Insider',    href: '/dashboard', color: '#7C3AED' },
              { label: 'Merch.Jobr',  sub: 'Custom Merchandise',   href: '/merch',     color: '#10B981' },
              { label: 'Mentor.Jobr', sub: 'Mentor Sourcing',      href: '/mentor',    color: '#4F46E5' },
            ].map(p => (
              <div key={p.href} style={{ marginBottom: 14 }}>
                <a href={p.href} style={{ fontSize: 14, fontWeight: 700, color: p.color, textDecoration: 'none', fontFamily: 'var(--font-display)', display: 'block', marginBottom: 2 }}>{p.label}</a>
                <div style={{ fontSize: 12, color: '#334155' }}>{p.sub}</div>
              </div>
            ))}
          </div>

          {/* Company */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', fontFamily: 'monospace', letterSpacing: '0.12em', marginBottom: 16 }}>COMPANY</div>
            {[
              { label: 'About Jobr',      href: '/about' },
              { label: 'Our Mission',     href: '/mission' },
              { label: 'Privacy Policy',  href: '/privacy' },
              { label: 'Terms of Service',href: '/terms' },
              { label: 'Contact Us',      href: '/contact' },
            ].map(l => (
              <a key={l.href} href={l.href} style={{ display: 'block', fontSize: 13, color: '#64748B', textDecoration: 'none', marginBottom: 10, transition: 'color 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#F1F0FF'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#64748B'; }}>
                {l.label}
              </a>
            ))}
          </div>

          {/* Team */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', fontFamily: 'monospace', letterSpacing: '0.12em', marginBottom: 16 }}>TEAM</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {team.map(member => (
                <div key={member.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #F97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: '#fff', flexShrink: 0, overflow: 'hidden' }}>
                    {member.photo_url ? <img src={member.photo_url} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : member.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#F1F0FF', fontFamily: 'var(--font-display)' }}>{member.name}</div>
                    <div style={{ fontSize: 11, color: '#475569', marginBottom: 4 }}>{member.role}</div>
                    {member.linkedin_url && (
                      <a href={member.linkedin_url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#4F46E5', textDecoration: 'none' }}>
                        <ExternalLink size={10} /> LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20, padding: '12px 14px', background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.14)', borderRadius: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#A78BFA', marginBottom: 4, fontFamily: 'var(--font-display)' }}>✦ We're Hiring!</div>
              <div style={{ fontSize: 12, color: '#475569', marginBottom: 6, lineHeight: 1.5 }}>Engineers, designers, and growth folks.</div>
              <a href="mailto:nitish@jobr.co.in?subject=I want to join Jobr" style={{ fontSize: 12, fontWeight: 700, color: '#A78BFA', textDecoration: 'none' }}>nitish@jobr.co.in →</a>
            </div>
          </div>

          {/* For EdTechs */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', fontFamily: 'monospace', letterSpacing: '0.12em', marginBottom: 16 }}>FOR EDTECHS</div>
            {[
              { label: 'Browse Mentors',      href: '/mentor' },
              { label: 'Register as EdTech',  href: '/mentor/edtech' },
              { label: 'Bulk Merch Orders',   href: '/merch' },
              { label: 'MentorLink Credits',  href: '/mentor/edtech#credits' },
              { label: 'Dispute Resolution',  href: '/contact#dispute' },
            ].map(l => (
              <a key={l.href} href={l.href} style={{ display: 'block', fontSize: 13, color: '#64748B', textDecoration: 'none', marginBottom: 10, transition: 'color 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#F1F0FF'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#64748B'; }}>
                {l.label}
              </a>
            ))}
          </div>
        </div>

        {/* Mission strip */}
        <div style={{ marginTop: 40, padding: 'clamp(16px,3vw,24px)', background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.1)', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 22 }}>🎯</span>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#A78BFA', fontFamily: 'monospace', marginBottom: 4 }}>OUR MISSION</div>
            <p style={{ fontSize: 14, color: '#64748B', margin: 0, lineHeight: 1.6 }}>
              To make career growth accessible, transparent, and fair for every student and professional in India — and to make it dead simple for edtech companies to find and pay great mentors.
            </p>
          </div>
          <a href="/mission" style={{ fontSize: 13, fontWeight: 700, color: '#A78BFA', textDecoration: 'none', whiteSpace: 'nowrap' }}>Read more →</a>
        </div>

        {/* Bottom bar */}
        <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <span style={{ fontSize: 12, color: '#334155' }}>© 2026 Jobr.co.in · Bangalore, India</span>
          <div style={{ display: 'flex', gap: 20 }}>
            {[['Privacy', '/privacy'], ['Terms', '/terms'], ['Contact', '/contact']].map(([l, h]) => (
              <a key={h} href={h} style={{ fontSize: 12, color: '#334155', textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
          <span style={{ fontSize: 11, color: '#1E1E30', fontFamily: 'monospace', letterSpacing: '0.1em' }}>PRIVACY FIRST · INDIA BUILT</span>
        </div>
      </div>
    </footer>
  );
}