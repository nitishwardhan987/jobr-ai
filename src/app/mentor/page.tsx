'use client';
import { useEffect, useState } from 'react';
import { Search, Star, Users, Filter, ChevronDown, CheckCircle2, Clock, Zap, ArrowRight, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const DOMAINS = ['All', 'Software Engineering', 'Product Management', 'Data Science', 'Design', 'Finance', 'Marketing', 'Other'];

const SESSION_TYPE_COLORS: Record<string, string> = {
  'Assignment Help':  '#06B6D4',
  'Career Guidance':  '#0D9488',
  'Mock Interview':   '#F97316',
  'Project Review':   '#A78BFA',
  'Resume Review':    '#10B981',
  'Doubt Solving':    '#F59E0B',
  'Custom':           '#64748B',
};

const SEED_MENTORS = [
  {
    id: 'seed-1', name: 'Priya Sharma', photo_url: '', bio: 'Ex-Google PM with 8 years experience. IIM-A alumna. Helped 100+ students crack PM roles at top startups.',
    domain: 'Product Management', mentor_role: 'Senior PM', current_company: 'Google', years_experience: 8,
    rating: 4.9, total_sessions: 142, is_verified: true, is_active: true, availability_mode: 'slots',
    session_types: [
      { name: 'Mock Interview', price: 800 }, { name: 'Career Guidance', price: 1000 }, { name: 'Resume Review', price: 500 }
    ],
    user_email: 'priya@mentor.jobr', wallet_credits: 0, total_earned: 0,
  },
  {
    id: 'seed-2', name: 'Arjun Mehta', photo_url: '', bio: 'Staff Engineer at Swiggy. DSA coach. Ex-Amazon. Cracked 15+ FAANG interviews. I teach what actually works.',
    domain: 'Software Engineering', mentor_role: 'Staff Engineer', current_company: 'Swiggy', years_experience: 7,
    rating: 4.8, total_sessions: 98, is_verified: true, is_active: true, availability_mode: 'slots',
    session_types: [
      { name: 'Mock Interview', price: 600 }, { name: 'Doubt Solving', price: 300 }, { name: 'Project Review', price: 700 }
    ],
    user_email: 'arjun@mentor.jobr', wallet_credits: 0, total_earned: 0,
  },
  {
    id: 'seed-3', name: 'Sneha Iyer', photo_url: '', bio: 'Data Science Lead at ex-Netflix. ML practitioner with focus on real-world deployment. MSc Statistics, IIT Bombay.',
    domain: 'Data Science', mentor_role: 'Data Science Lead', current_company: 'Swiggy', years_experience: 6,
    rating: 4.9, total_sessions: 76, is_verified: true, is_active: true, availability_mode: 'request',
    session_types: [
      { name: 'Project Review', price: 800 }, { name: 'Career Guidance', price: 700 }, { name: 'Assignment Help', price: 400 }
    ],
    user_email: 'sneha@mentor.jobr', wallet_credits: 0, total_earned: 0,
  },
  {
    id: 'seed-4', name: 'Rahul Das', photo_url: '', bio: 'Principal Designer at CRED. 10 years in product design. Design systems, Figma expert. Previously Zomato, Razorpay.',
    domain: 'Design', mentor_role: 'Principal Designer', current_company: 'CRED', years_experience: 10,
    rating: 4.7, total_sessions: 54, is_verified: true, is_active: true, availability_mode: 'slots',
    session_types: [
      { name: 'Portfolio Review', price: 700 }, { name: 'Career Guidance', price: 600 }, { name: 'Project Review', price: 800 }
    ],
    user_email: 'rahul@mentor.jobr', wallet_credits: 0, total_earned: 0,
  },
  {
    id: 'seed-5', name: 'Kavya Nair', photo_url: '', bio: 'VP Finance at a Series B startup. CA + MBA. Expert in financial modelling, fundraising, and startup finance.',
    domain: 'Finance', mentor_role: 'VP Finance', current_company: 'FinEdge', years_experience: 9,
    rating: 4.8, total_sessions: 41, is_verified: false, is_active: true, availability_mode: 'request',
    session_types: [
      { name: 'Career Guidance', price: 1000 }, { name: 'Assignment Help', price: 500 }, { name: 'Mock Interview', price: 900 }
    ],
    user_email: 'kavya@mentor.jobr', wallet_credits: 0, total_earned: 0,
  },
  {
    id: 'seed-6', name: 'Vikram Singh', photo_url: '', bio: 'Growth Marketing Head at PhysicsWallah. Built 0→1 marketing teams. Expert in EdTech growth, SEO, and performance marketing.',
    domain: 'Marketing', mentor_role: 'Head of Growth', current_company: 'PhysicsWallah', years_experience: 6,
    rating: 4.6, total_sessions: 33, is_verified: false, is_active: true, availability_mode: 'slots',
    session_types: [
      { name: 'Career Guidance', price: 700 }, { name: 'Project Review', price: 600 }, { name: 'Doubt Solving', price: 400 }
    ],
    user_email: 'vikram@mentor.jobr', wallet_credits: 0, total_earned: 0,
  },
];

type Mentor = typeof SEED_MENTORS[0];

export default function MentorDirectory() {
  const [mentors,       setMentors]       = useState<Mentor[]>([]);
  const [filtered,      setFiltered]      = useState<Mentor[]>([]);
  const [domain,        setDomain]        = useState('All');
  const [search,        setSearch]        = useState('');
  const [sortBy,        setSortBy]        = useState<'rating' | 'sessions' | 'price'>('rating');
  const [loading,       setLoading]       = useState(true);
  const [isLoggedIn,    setIsLoggedIn]    = useState(false);

  useEffect(() => {
    const s = localStorage.getItem('jobr_session') || localStorage.getItem('jobr_user');
    if (s) setIsLoggedIn(true);
    loadMentors();
  }, []);

  const loadMentors = async () => {
    try {
      const { data } = await supabase.from('mentor_profiles').select('*').eq('is_active', true).order('rating', { ascending: false });
      setMentors(data && data.length > 0 ? data : SEED_MENTORS as any);
      setFiltered(data && data.length > 0 ? data : SEED_MENTORS as any);
    } catch {
      setMentors(SEED_MENTORS as any);
      setFiltered(SEED_MENTORS as any);
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
    // Verified mentors always first
    result.sort((a, b) => (b.is_verified ? 1 : 0) - (a.is_verified ? 1 : 0));
    setFiltered(result);
  }, [domain, search, sortBy, mentors]);

  const topMentors = mentors.filter(m => m.is_verified && m.rating >= 4.8).slice(0, 3);

  return (
    <div style={{ background: '#1C1C2E', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(145deg, rgba(13,148,136,0.15) 0%, rgba(28,28,46,0) 60%)', borderBottom: '1px solid rgba(13,148,136,0.15)', padding: 'clamp(40px,6vw,72px) 20px 48px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(13,148,136,0.12)', border: '1px solid rgba(13,148,136,0.25)', borderRadius: 100, padding: '6px 16px', marginBottom: 20 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0D9488', animation: 'pulse-dot 2s infinite' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#0D9488', fontFamily: 'monospace', letterSpacing: '0.1em' }}>MENTOR.JOBR</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,5vw,60px)', fontWeight: 900, color: '#F1F0FF', letterSpacing: '-0.03em', marginBottom: 14, lineHeight: 1.1 }}>
            Learn from people<br />
            <span style={{ background: 'linear-gradient(135deg, #0D9488, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>actually doing the work.</span>
          </h1>
          <p style={{ fontSize: 'clamp(14px,2vw,18px)', color: '#94A3B8', maxWidth: 520, lineHeight: 1.65, marginBottom: 32 }}>
            Book 1:1 sessions with verified domain experts. Assignment help, career guidance, mock interviews — at rates set by the mentors themselves.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a href="/mentor/onboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #0D9488, #0891B2)', color: '#fff', textDecoration: 'none', padding: '12px 28px', borderRadius: 100, fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-display)', boxShadow: '0 4px 16px rgba(13,148,136,0.4)' }}>
              <Plus size={16} /> Become a Mentor
            </a>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '12px 0' }}>
              {[
                { value: `${mentors.length}+`, label: 'Verified Mentors' },
                { value: '6', label: 'Domains' },
                { value: '₹200+', label: 'Starting from' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#0D9488', fontFamily: 'var(--font-display)' }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: '#475569' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '40px 20px' }}>

        {/* Top mentors */}
        {topMentors.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#F59E0B', fontFamily: 'monospace', letterSpacing: '0.1em' }}>⭐ TOP MENTORS THIS MONTH</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,320px),1fr))', gap: 14 }}>
              {topMentors.map((m, i) => (
                <TopMentorCard key={m.id} mentor={m} rank={i + 1} isLoggedIn={isLoggedIn} />
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <Search size={14} color="#475569" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              placeholder="Search by name, domain, or skill..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="input"
              style={{ paddingLeft: 36, fontSize: 13 }}
            />
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {DOMAINS.map(d => (
              <button key={d} onClick={() => setDomain(d)} style={{ padding: '7px 14px', background: domain === d ? 'rgba(13,148,136,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${domain === d ? 'rgba(13,148,136,0.4)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 100, color: domain === d ? '#0D9488' : '#64748B', fontSize: 12, fontWeight: domain === d ? 700 : 500, cursor: 'pointer', fontFamily: 'var(--font-display)', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
                {d}
              </button>
            ))}
          </div>

          <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#F1F0FF', fontSize: 12, outline: 'none', cursor: 'pointer' }}>
            <option value="rating" style={{ background: '#1C1C2E' }}>Sort: Top Rated</option>
            <option value="sessions" style={{ background: '#1C1C2E' }}>Sort: Most Sessions</option>
            <option value="price" style={{ background: '#1C1C2E' }}>Sort: Lowest Price</option>
          </select>
        </div>

        {/* Results count */}
        <div style={{ fontSize: 13, color: '#475569', marginBottom: 16, fontFamily: 'monospace' }}>
          {filtered.length} mentor{filtered.length !== 1 ? 's' : ''} {domain !== 'All' ? `in ${domain}` : 'available'}
        </div>

        {/* Mentor grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 14 }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24, height: 200, animation: 'pulse-dot 1.5s infinite' }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,340px),1fr))', gap: 14 }}>
            {filtered.map(m => <MentorCard key={m.id} mentor={m} isLoggedIn={isLoggedIn} />)}
            {filtered.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60 }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                <div style={{ fontSize: 16, color: '#475569', fontWeight: 600 }}>No mentors found</div>
                <div style={{ fontSize: 13, color: '#334155', marginTop: 6 }}>Try a different domain or search term</div>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
    </div>
  );
}

function TopMentorCard({ mentor: m, rank, isLoggedIn }: { mentor: any; rank: number; isLoggedIn: boolean }) {
  const minPrice = m.session_types?.length > 0 ? Math.min(...m.session_types.map((s: any) => s.price)) : 0;
  return (
    <a href={`/mentor/${m.id}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 14, padding: 20, background: 'linear-gradient(145deg, rgba(13,148,136,0.10) 0%, rgba(6,182,212,0.05) 100%)', border: '1px solid rgba(13,148,136,0.25)', borderRadius: 20, transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(13,148,136,0.2)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
      <div style={{ position: 'absolute', top: 14, right: 14, width: 28, height: 28, borderRadius: '50%', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#F59E0B' }}>#{rank}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, #0D9488, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: '#fff', flexShrink: 0 }}>{m.name[0]}</div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#F1F0FF', fontFamily: 'var(--font-display)' }}>{m.name}</div>
            {m.is_verified && <CheckCircle2 size={14} color="#0D9488" />}
          </div>
          <div style={{ fontSize: 12, color: '#64748B' }}>{m.mentor_role} · {m.current_company}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <Star size={11} color="#F59E0B" fill="#F59E0B" />
            <span style={{ fontSize: 12, color: '#F59E0B', fontWeight: 700 }}>{m.rating}</span>
            <span style={{ fontSize: 11, color: '#334155' }}>· {m.total_sessions} sessions</span>
          </div>
        </div>
      </div>
      <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.5, margin: 0 }}>{m.bio?.slice(0, 100)}...</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, color: '#0D9488', fontWeight: 700 }}>From ₹{minPrice}</div>
        <span style={{ fontSize: 12, color: '#0D9488', fontWeight: 600 }}>View Profile →</span>
      </div>
    </a>
  );
}

function MentorCard({ mentor: m, isLoggedIn }: { mentor: any; isLoggedIn: boolean }) {
  const minPrice = m.session_types?.length > 0 ? Math.min(...m.session_types.map((s: any) => s.price)) : 0;
  const availLabel = m.availability_mode === 'slots' ? 'Has open slots' : m.availability_mode === 'request' ? 'On request' : 'Slots + Requests';
  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 20, display: 'flex', flexDirection: 'column', gap: 14, transition: 'all 0.2s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(13,148,136,0.3)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}>

      {/* Header */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: `linear-gradient(135deg, #0D9488, #06B6D4)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: '#fff', flexShrink: 0 }}>{m.name[0]}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#F1F0FF', fontFamily: 'var(--font-display)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</div>
            {m.is_verified && <CheckCircle2 size={13} color="#0D9488" />}
          </div>
          <div style={{ fontSize: 12, color: '#64748B' }}>{m.mentor_role} · {m.current_company}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Star size={11} color="#F59E0B" fill="#F59E0B" />
              <span style={{ fontSize: 12, color: '#F59E0B', fontWeight: 700 }}>{m.rating}</span>
            </div>
            <span style={{ fontSize: 11, color: '#334155' }}>·</span>
            <span style={{ fontSize: 11, color: '#334155' }}>{m.total_sessions} sessions</span>
            <span style={{ fontSize: 11, color: '#334155' }}>·</span>
            <span style={{ fontSize: 11, color: '#334155' }}>{m.years_experience}y exp</span>
          </div>
        </div>
        <div style={{ fontSize: 9, fontWeight: 700, color: '#0D9488', background: 'rgba(13,148,136,0.1)', border: '1px solid rgba(13,148,136,0.2)', padding: '3px 8px', borderRadius: 100, fontFamily: 'monospace', whiteSpace: 'nowrap', flexShrink: 0 }}>
          {m.domain}
        </div>
      </div>

      {/* Bio */}
      <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.55, margin: 0 }}>{m.bio?.slice(0, 110)}{m.bio?.length > 110 ? '...' : ''}</p>

      {/* Session types */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {(m.session_types || []).slice(0, 3).map((s: any) => (
          <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 9px', background: `${SESSION_TYPE_COLORS[s.name] || '#64748B'}12`, border: `1px solid ${SESSION_TYPE_COLORS[s.name] || '#64748B'}25`, borderRadius: 100 }}>
            <span style={{ fontSize: 11, color: SESSION_TYPE_COLORS[s.name] || '#64748B', fontWeight: 600 }}>{s.name}</span>
            <span style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace' }}>₹{s.price}</span>
          </div>
        ))}
        {m.session_types?.length > 3 && <span style={{ fontSize: 11, color: '#334155', padding: '4px 6px' }}>+{m.session_types.length - 3} more</span>}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#0D9488', fontFamily: 'var(--font-display)' }}>From ₹{minPrice}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <Clock size={10} color="#475569" />
            <span style={{ fontSize: 10, color: '#475569' }}>{availLabel}</span>
          </div>
        </div>
        <a href={`/mentor/${m.id}`} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg, #0D9488, #0891B2)', color: '#fff', textDecoration: 'none', padding: '9px 18px', borderRadius: 100, fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-display)', boxShadow: '0 2px 10px rgba(13,148,136,0.35)', transition: 'all 0.2s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}>
          {isLoggedIn ? 'Book Session' : 'View Profile'} <ArrowRight size={13} />
        </a>
      </div>
    </div>
  );
}