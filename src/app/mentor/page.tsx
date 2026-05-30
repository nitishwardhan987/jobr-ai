'use client';
import { useEffect, useState } from 'react';
import { Search, Star, CheckCircle2, Clock, ArrowRight, Plus, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const DOMAINS = ['All', 'Software Engineering', 'Product Management', 'Data Science', 'Design', 'Finance', 'Marketing', 'Other'];

const SESSION_TYPE_COLORS: Record<string, string> = {
  'Assignment Help': '#06B6D4',
  'Career Guidance': '#7C3AED',
  'Mock Interview':  '#F97316',
  'Project Review':  '#8B5CF6',
  'Resume Review':   '#16A34A',
  'Doubt Solving':   '#D97706',
  'Custom':          '#71717A',
};

const SEED_MENTORS = [
  {
    id: 'seed-1', name: 'Priya Sharma', photo_url: '', bio: 'Ex-Google PM with 8 years experience. IIM-A alumna. Helped 100+ students crack PM roles at top startups.',
    domain: 'Product Management', mentor_role: 'Senior PM', current_company: 'Google', years_experience: 8,
    rating: 4.9, total_sessions: 142, is_verified: true, is_active: true, availability_mode: 'slots',
    session_types: [{ name: 'Mock Interview', price: 800 }, { name: 'Career Guidance', price: 1000 }, { name: 'Resume Review', price: 500 }],
    user_email: 'priya@mentor.jobr', wallet_credits: 0, total_earned: 0,
  },
  {
    id: 'seed-2', name: 'Arjun Mehta', photo_url: '', bio: 'Staff Engineer at Swiggy. DSA coach. Ex-Amazon. Cracked 15+ FAANG interviews. I teach what actually works.',
    domain: 'Software Engineering', mentor_role: 'Staff Engineer', current_company: 'Swiggy', years_experience: 7,
    rating: 4.8, total_sessions: 98, is_verified: true, is_active: true, availability_mode: 'slots',
    session_types: [{ name: 'Mock Interview', price: 600 }, { name: 'Doubt Solving', price: 300 }, { name: 'Project Review', price: 700 }],
    user_email: 'arjun@mentor.jobr', wallet_credits: 0, total_earned: 0,
  },
  {
    id: 'seed-3', name: 'Sneha Iyer', photo_url: '', bio: 'Data Science Lead at ex-Netflix. ML practitioner with focus on real-world deployment. MSc Statistics, IIT Bombay.',
    domain: 'Data Science', mentor_role: 'Data Science Lead', current_company: 'Swiggy', years_experience: 6,
    rating: 4.9, total_sessions: 76, is_verified: true, is_active: true, availability_mode: 'request',
    session_types: [{ name: 'Project Review', price: 800 }, { name: 'Career Guidance', price: 700 }, { name: 'Assignment Help', price: 400 }],
    user_email: 'sneha@mentor.jobr', wallet_credits: 0, total_earned: 0,
  },
  {
    id: 'seed-4', name: 'Rahul Das', photo_url: '', bio: 'Principal Designer at CRED. 10 years in product design. Design systems, Figma expert. Previously Zomato, Razorpay.',
    domain: 'Design', mentor_role: 'Principal Designer', current_company: 'CRED', years_experience: 10,
    rating: 4.7, total_sessions: 54, is_verified: true, is_active: true, availability_mode: 'slots',
    session_types: [{ name: 'Project Review', price: 700 }, { name: 'Career Guidance', price: 600 }, { name: 'Project Review', price: 800 }],
    user_email: 'rahul@mentor.jobr', wallet_credits: 0, total_earned: 0,
  },
  {
    id: 'seed-5', name: 'Kavya Nair', photo_url: '', bio: 'VP Finance at a Series B startup. CA + MBA. Expert in financial modelling, fundraising, and startup finance.',
    domain: 'Finance', mentor_role: 'VP Finance', current_company: 'FinEdge', years_experience: 9,
    rating: 4.8, total_sessions: 41, is_verified: false, is_active: true, availability_mode: 'request',
    session_types: [{ name: 'Career Guidance', price: 1000 }, { name: 'Assignment Help', price: 500 }, { name: 'Mock Interview', price: 900 }],
    user_email: 'kavya@mentor.jobr', wallet_credits: 0, total_earned: 0,
  },
  {
    id: 'seed-6', name: 'Vikram Singh', photo_url: '', bio: 'Growth Marketing Head at PhysicsWallah. Built 0→1 marketing teams. Expert in EdTech growth, SEO, and performance marketing.',
    domain: 'Marketing', mentor_role: 'Head of Growth', current_company: 'PhysicsWallah', years_experience: 6,
    rating: 4.6, total_sessions: 33, is_verified: false, is_active: true, availability_mode: 'slots',
    session_types: [{ name: 'Career Guidance', price: 700 }, { name: 'Project Review', price: 600 }, { name: 'Doubt Solving', price: 400 }],
    user_email: 'vikram@mentor.jobr', wallet_credits: 0, total_earned: 0,
  },
];

type Mentor = typeof SEED_MENTORS[0];

/* ── Domain colour map ────────────────────────────────────────── */
const DOMAIN_COLORS: Record<string, string> = {
  'Product Management':  '#7C3AED',
  'Software Engineering':'#2563EB',
  'Data Science':        '#0D9488',
  'Design':              '#F97316',
  'Finance':             '#D97706',
  'Marketing':           '#16A34A',
  'Other':               '#71717A',
};

export default function MentorDirectory() {
  const [mentors,    setMentors]    = useState<Mentor[]>([]);
  const [filtered,   setFiltered]   = useState<Mentor[]>([]);
  const [domain,     setDomain]     = useState('All');
  const [search,     setSearch]     = useState('');
  const [sortBy,     setSortBy]     = useState<'rating'|'sessions'|'price'>('rating');
  const [loading,    setLoading]    = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const s = localStorage.getItem('jobr_session') || localStorage.getItem('jobr_user');
    if (s) setIsLoggedIn(true);
    loadMentors();
  }, []);

  const loadMentors = async () => {
    try {
      const { data } = await supabase.from('mentor_profiles').select('*').eq('is_active', true).order('rating', { ascending: false });
      const src = data && data.length > 0 ? data : SEED_MENTORS as any;
      setMentors(src); setFiltered(src);
    } catch {
      setMentors(SEED_MENTORS as any); setFiltered(SEED_MENTORS as any);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    let result = [...mentors];
    if (domain !== 'All') result = result.filter(m => m.domain === domain);
    if (search) result = result.filter(m =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.domain.toLowerCase().includes(search.toLowerCase()) ||
      m.bio.toLowerCase().includes(search.toLowerCase())
    );
    if (sortBy === 'rating')   result.sort((a, b) => b.rating - a.rating);
    if (sortBy === 'sessions') result.sort((a, b) => b.total_sessions - a.total_sessions);
    if (sortBy === 'price')    result.sort((a, b) => {
      const aMin = Math.min(...(a.session_types || []).map((s: any) => s.price));
      const bMin = Math.min(...(b.session_types || []).map((s: any) => s.price));
      return aMin - bMin;
    });
    result.sort((a, b) => (b.is_verified ? 1 : 0) - (a.is_verified ? 1 : 0));
    setFiltered(result);
  }, [domain, search, sortBy, mentors]);

  const topMentors = mentors.filter(m => m.is_verified && m.rating >= 4.8).slice(0, 3);

  return (
    <div style={{ background: '#F8F5F0', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(145deg, rgba(124,58,237,0.06) 0%, transparent 60%)', borderBottom: '1px solid #E7E5E4', padding: 'clamp(80px,10vw,120px) 24px clamp(40px,5vw,60px)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.20)', borderRadius: 100, padding: '5px 14px', marginBottom: 20 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#7C3AED', animation: 'pulse-dot 2s infinite' }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#7C3AED', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Mentor.Jobr</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,5vw,60px)', fontWeight: 900, color: '#18181B', letterSpacing: '-0.04em', marginBottom: 14, lineHeight: 1.0 }}>
            Learn from people<br />
            <span style={{ color: '#7C3AED' }}>actually doing the work.</span>
          </h1>
          <p style={{ fontSize: 'clamp(14px,2vw,18px)', color: '#52525B', maxWidth: 500, lineHeight: 1.75, marginBottom: 28 }}>
            Book 1:1 sessions with verified domain experts. Assignment help, career guidance, mock interviews — at rates set by the mentors themselves.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <a href="/mentor/onboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#7C3AED', color: '#fff', textDecoration: 'none', padding: '12px 26px', borderRadius: 100, fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-display)', boxShadow: '0 4px 16px rgba(124,58,237,0.28)', transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#6D28D9'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#7C3AED'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}>
              <Plus size={15} /> Become a Mentor
            </a>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center', padding: '8px 0' }}>
              {[
                { value: `${mentors.length}+`, label: 'Verified Mentors' },
                { value: '6',                  label: 'Domains'          },
                { value: '₹300+',              label: 'Starting from'    },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#7C3AED', fontFamily: 'var(--font-display)', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: '#A1A1AA', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 24px' }}>

        {/* Top mentors */}
        {topMentors.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: '#D97706', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
              ⭐ Top Mentors This Month
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,320px),1fr))', gap: 14 }}>
              {topMentors.map((m, i) => <TopMentorCard key={m.id} mentor={m} rank={i + 1} isLoggedIn={isLoggedIn} />)}
            </div>
          </div>
        )}

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <Search size={14} color="#A1A1AA" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              placeholder="Search by name, domain, or skill..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="input"
              style={{ paddingLeft: 36, fontSize: 13 }}
            />
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {DOMAINS.map(d => (
              <button key={d} onClick={() => setDomain(d)} style={{
                padding: '7px 14px', borderRadius: 100, fontSize: 12, fontWeight: domain === d ? 700 : 500,
                cursor: 'pointer', fontFamily: 'var(--font-display)', whiteSpace: 'nowrap', transition: 'all 0.15s', border: 'none',
                background: domain === d ? 'rgba(124,58,237,0.10)' : '#FFFFFF',
                color: domain === d ? '#7C3AED' : '#71717A',
                outline: domain === d ? '1px solid rgba(124,58,237,0.28)' : '1px solid #E7E5E4',
              }}>
                {d}
              </button>
            ))}
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} style={{
            padding: '9px 12px', background: '#FFFFFF', border: '1px solid #E7E5E4',
            borderRadius: 10, color: '#18181B', fontSize: 12, outline: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontWeight: 600,
          }}>
            <option value="rating">Top Rated</option>
            <option value="sessions">Most Sessions</option>
            <option value="price">Lowest Price</option>
          </select>
        </div>

        {/* Count */}
        <div style={{ fontSize: 12, color: '#A1A1AA', marginBottom: 16, fontFamily: 'var(--font-mono)' }}>
          {filtered.length} mentor{filtered.length !== 1 ? 's' : ''} {domain !== 'All' ? `in ${domain}` : 'available'}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 14 }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ background: '#FFFFFF', border: '1px solid #E7E5E4', borderRadius: 20, height: 200, animation: 'shimmer 1.5s infinite', backgroundImage: 'linear-gradient(90deg, #F5F1EA 25%, #FAF7F2 50%, #F5F1EA 75%)', backgroundSize: '200% 100%' }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,340px),1fr))', gap: 14 }}>
            {filtered.map(m => <MentorCard key={m.id} mentor={m} isLoggedIn={isLoggedIn} />)}
            {filtered.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                <div style={{ fontSize: 16, color: '#52525B', fontWeight: 600, fontFamily: 'var(--font-display)' }}>No mentors found</div>
                <div style={{ fontSize: 13, color: '#A1A1AA', marginTop: 6 }}>Try a different domain or search term</div>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
      `}</style>
    </div>
  );
}

function TopMentorCard({ mentor: m, rank, isLoggedIn }: { mentor: any; rank: number; isLoggedIn: boolean }) {
  const minPrice = m.session_types?.length > 0 ? Math.min(...m.session_types.map((s: any) => s.price)) : 0;
  const domainColor = DOMAIN_COLORS[m.domain] || '#71717A';
  return (
    <a href={`/mentor/${m.id}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 14, padding: 22, background: '#FFFFFF', border: '1px solid #E7E5E4', borderRadius: 20, transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)', position: 'relative', overflow: 'hidden' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 40px rgba(24,24,27,0.10)'; (e.currentTarget as HTMLElement).style.borderColor = `${domainColor}30`; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.borderColor = '#E7E5E4'; }}>
      <div style={{ position: 'absolute', top: 14, right: 14, width: 28, height: 28, borderRadius: '50%', background: '#FEF3C7', border: '1px solid #FDE68A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: '#D97706', fontFamily: 'var(--font-display)' }}>#{rank}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 50, height: 50, borderRadius: '50%', background: `linear-gradient(135deg, ${domainColor}30, ${domainColor}60)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: domainColor, flexShrink: 0, fontFamily: 'var(--font-display)' }}>{m.name[0]}</div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, color: '#18181B' }}>{m.name}</span>
            {m.is_verified && <CheckCircle2 size={13} color="#16A34A" />}
          </div>
          <div style={{ fontSize: 12, color: '#71717A' }}>{m.mentor_role} · {m.current_company}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
            <Star size={11} color="#F97316" fill="#F97316" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#F97316' }}>{m.rating}</span>
            <span style={{ fontSize: 11, color: '#A1A1AA' }}>· {m.total_sessions} sessions</span>
          </div>
        </div>
      </div>
      <p style={{ fontSize: 13, color: '#71717A', lineHeight: 1.55, margin: 0 }}>{m.bio?.slice(0, 100)}...</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: domainColor }}>From ₹{minPrice}</span>
        <span style={{ fontSize: 12, color: domainColor, fontWeight: 600, fontFamily: 'var(--font-display)' }}>View Profile →</span>
      </div>
    </a>
  );
}

function MentorCard({ mentor: m, isLoggedIn }: { mentor: any; isLoggedIn: boolean }) {
  const minPrice = m.session_types?.length > 0 ? Math.min(...m.session_types.map((s: any) => s.price)) : 0;
  const domainColor = DOMAIN_COLORS[m.domain] || '#71717A';
  const availLabel  = m.availability_mode === 'slots' ? 'Has open slots' : m.availability_mode === 'request' ? 'On request' : 'Slots + Requests';
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E7E5E4', borderRadius: 20, padding: 20, display: 'flex', flexDirection: 'column', gap: 14, transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${domainColor}28`; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(24,24,27,0.08)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E7E5E4'; (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>

      {/* Header */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ width: 46, height: 46, borderRadius: '50%', background: `linear-gradient(135deg, ${domainColor}20, ${domainColor}40)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: domainColor, flexShrink: 0, fontFamily: 'var(--font-display)' }}>{m.name[0]}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: '#18181B', fontFamily: 'var(--font-display)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</span>
            {m.is_verified && <CheckCircle2 size={13} color="#16A34A" />}
          </div>
          <div style={{ fontSize: 12, color: '#71717A' }}>{m.mentor_role} · {m.current_company}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
            <Star size={10} color="#F97316" fill="#F97316" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#F97316' }}>{m.rating}</span>
            <span style={{ fontSize: 11, color: '#D6D3D1' }}>·</span>
            <span style={{ fontSize: 11, color: '#A1A1AA' }}>{m.total_sessions} sessions</span>
            <span style={{ fontSize: 11, color: '#D6D3D1' }}>·</span>
            <span style={{ fontSize: 11, color: '#A1A1AA' }}>{m.years_experience}y exp</span>
          </div>
        </div>
        <span style={{ fontSize: 9, fontWeight: 700, color: domainColor, background: `${domainColor}10`, border: `1px solid ${domainColor}20`, padding: '3px 8px', borderRadius: 100, fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', flexShrink: 0 }}>
          {m.domain.split(' ')[0]}
        </span>
      </div>

      {/* Bio */}
      <p style={{ fontSize: 13, color: '#71717A', lineHeight: 1.55, margin: 0 }}>{m.bio?.slice(0, 110)}{m.bio?.length > 110 ? '...' : ''}</p>

      {/* Session types */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {(m.session_types || []).slice(0, 3).map((s: any) => (
          <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 9px', background: `${SESSION_TYPE_COLORS[s.name] || '#71717A'}08`, border: `1px solid ${SESSION_TYPE_COLORS[s.name] || '#71717A'}20`, borderRadius: 100 }}>
            <span style={{ fontSize: 11, color: SESSION_TYPE_COLORS[s.name] || '#71717A', fontWeight: 600, fontFamily: 'var(--font-display)' }}>{s.name}</span>
            <span style={{ fontSize: 10, color: '#A1A1AA', fontFamily: 'var(--font-mono)' }}>₹{s.price}</span>
          </div>
        ))}
        {m.session_types?.length > 3 && <span style={{ fontSize: 11, color: '#A1A1AA', padding: '4px 6px' }}>+{m.session_types.length - 3} more</span>}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid #F0EDEA' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 16, color: domainColor }}>{minPrice > 0 ? `From ₹${minPrice}` : 'Free'}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <Clock size={10} color="#A1A1AA" />
            <span style={{ fontSize: 10, color: '#A1A1AA', fontFamily: 'var(--font-mono)' }}>{availLabel}</span>
          </div>
        </div>
        <a href={`/mentor/${m.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: domainColor, color: '#fff', textDecoration: 'none', padding: '9px 18px', borderRadius: 100, fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-display)', boxShadow: `0 3px 12px ${domainColor}28`, transition: 'all 0.2s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; }}>
          {isLoggedIn ? 'Book Session' : 'View Profile'} <ArrowRight size={13} />
        </a>
      </div>
    </div>
  );
}
