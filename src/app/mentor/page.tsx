'use client';
import { useEffect, useState } from 'react';
import { supabase, MentorProfile, DOMAINS, creditsToINR } from '@/lib/supabase';

export default function MentorDiscovery() {
  const [mentors,   setMentors]   = useState<MentorProfile[]>([]);
  const [filtered,  setFiltered]  = useState<MentorProfile[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [domain,    setDomain]    = useState('All');
  const [search,    setSearch]    = useState('');
  const [sortBy,    setSortBy]    = useState<'rating'|'rate_asc'|'rate_desc'|'sessions'>('rating');
  const [userRole,  setUserRole]  = useState<string|null>(null);

  useEffect(() => {
    const s = localStorage.getItem('jobr_session') || localStorage.getItem('jobr_user');
    if (s) { try { const p = JSON.parse(s); setUserRole(p.role || null); } catch {} }
    fetchMentors();
  }, []);

  async function fetchMentors() {
    const { data } = await supabase.from('mentor_profiles').select('*').eq('is_active', true).order('rating', { ascending: false });
    setMentors(data || []);
    setFiltered(data || []);
    setLoading(false);
  }

  useEffect(() => {
    let list = [...mentors];
    if (domain !== 'All') list = list.filter(m => m.domain === domain);
    if (search) list = list.filter(m =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.domain.toLowerCase().includes(search.toLowerCase()) ||
      (m.tagline || '').toLowerCase().includes(search.toLowerCase())
    );
    if (sortBy === 'rating')    list.sort((a,b) => (b.rating||0) - (a.rating||0));
    if (sortBy === 'rate_asc')  list.sort((a,b) => a.rate_per_hour - b.rate_per_hour);
    if (sortBy === 'rate_desc') list.sort((a,b) => b.rate_per_hour - a.rate_per_hour);
    if (sortBy === 'sessions')  list.sort((a,b) => (b.total_sessions||0) - (a.total_sessions||0));
    setFiltered(list);
  }, [domain, search, sortBy, mentors]);

  return (
    <div style={{ background: '#FAFAF8', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)', padding: '60px 24px 80px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.15)', borderRadius: 99, padding: '4px 14px', marginBottom: 20 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', display: 'inline-block' }} />
          <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.12em', color: '#fff', textTransform: 'uppercase' }}>Mentor.Jobr</span>
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 12 }}>
          Find Expert Mentors
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', maxWidth: 480, margin: '0 auto 32px' }}>
          Plug-and-go mentor sourcing for edtech companies. Pay per session, no long-term contracts.
        </p>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <input type="text" placeholder="Search by name, domain, skill..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '14px 20px', background: '#fff', border: 'none', borderRadius: 12, fontSize: 15, outline: 'none', color: '#1A1A2E', boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }} />
        </div>
        {!userRole && (
          <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/mentor/onboard" style={{ background: '#F97316', color: '#fff', fontWeight: 700, fontSize: 14, padding: '10px 24px', borderRadius: 10, textDecoration: 'none', boxShadow: '0 2px 12px rgba(249,115,22,0.4)' }}>Join as Mentor</a>
            <a href="/mentor/edtech" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 600, fontSize: 14, padding: '10px 24px', borderRadius: 10, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)' }}>I'm an EdTech →</a>
          </div>
        )}
      </div>

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24, alignItems: 'center' }}>
          <select value={domain} onChange={e => setDomain(e.target.value)} style={{ padding: '8px 14px', borderRadius: 8, fontSize: 13, border: '1.5px solid rgba(26,26,46,0.12)', background: '#fff', color: '#1A1A2E', outline: 'none', fontFamily: 'inherit' }}>
            <option value="All">All Domains</option>
            {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} style={{ padding: '8px 14px', borderRadius: 8, fontSize: 13, border: '1.5px solid rgba(26,26,46,0.12)', background: '#fff', color: '#1A1A2E', outline: 'none', fontFamily: 'inherit' }}>
            <option value="rating">Top Rated</option>
            <option value="sessions">Most Sessions</option>
            <option value="rate_asc">Price: Low to High</option>
            <option value="rate_desc">Price: High to Low</option>
          </select>
          <span style={{ fontSize: 13, color: '#8A8A9A', marginLeft: 'auto' }}>{filtered.length} mentor{filtered.length !== 1 ? 's' : ''} found</span>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ background: '#fff', borderRadius: 16, padding: 24, height: 280, border: '1.5px solid rgba(26,26,46,0.08)' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1A1A2E', marginBottom: 8 }}>No mentors found</h3>
            <p style={{ color: '#8A8A9A', fontSize: 14 }}>Try a different domain or be the first!</p>
            <a href="/mentor/onboard" style={{ display: 'inline-block', marginTop: 20, background: '#7C3AED', color: '#fff', fontWeight: 700, fontSize: 14, padding: '11px 24px', borderRadius: 10, textDecoration: 'none' }}>
              Join as Mentor →
            </a>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {filtered.map(mentor => <MentorCard key={mentor.user_email} mentor={mentor} userRole={userRole} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function MentorCard({ mentor, userRole }: { mentor: MentorProfile; userRole: string | null }) {
  const stars = Math.round(mentor.rating || 0);
  return (
    <div style={{ background: '#fff', border: '1.5px solid rgba(26,26,46,0.08)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 12, boxShadow: '0 1px 4px rgba(26,26,46,0.06)', transition: 'all 0.2s' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #F97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: '#fff', flexShrink: 0 }}>
          {mentor.name[0].toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1A1A2E', margin: 0 }}>{mentor.name}</h3>
            {mentor.is_verified && <span style={{ fontSize: 14 }}>✓</span>}
          </div>
          <p style={{ fontSize: 12, color: '#8A8A9A', margin: '2px 0 0' }}>{mentor.tagline || mentor.domain}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 10, fontWeight: 700, fontFamily: 'monospace', background: 'rgba(124,58,237,0.08)', color: '#7C3AED', padding: '3px 8px', borderRadius: 99 }}>{mentor.domain}</span>
        <span style={{ fontSize: 10, fontWeight: 600, background: '#F3F3F0', color: '#4A4A6A', padding: '3px 8px', borderRadius: 99 }}>{mentor.experience_years}y exp</span>
      </div>

      {mentor.bio && (
        <p style={{ fontSize: 13, color: '#4A4A6A', lineHeight: 1.5, margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {mentor.bio}
        </p>
      )}

      <div style={{ display: 'flex', gap: 16 }}>
        <div>
          <div style={{ fontSize: 11, color: '#8A8A9A', marginBottom: 2 }}>Rating</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1A2E' }}>
            {'★'.repeat(stars)}{'☆'.repeat(5 - stars)} <span style={{ color: '#8A8A9A', fontWeight: 400 }}>({mentor.total_sessions || 0})</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: '#8A8A9A', marginBottom: 2 }}>Response</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A2E' }}>~{mentor.response_time || '4 hrs'}</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid rgba(26,26,46,0.06)' }}>
        <div>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#7C3AED' }}>{mentor.rate_per_hour}</span>
          <span style={{ fontSize: 12, color: '#8A8A9A' }}> credits/hr</span>
          <div style={{ fontSize: 11, color: '#8A8A9A' }}>= ₹{creditsToINR(mentor.rate_per_hour)}/hr</div>
        </div>
        <a href={userRole === 'edtech' ? `/mentor/book?mentor=${mentor.user_email}` : '/mentor/edtech?register=1'}
          style={{ background: '#7C3AED', color: '#fff', fontWeight: 700, fontSize: 12, padding: '9px 18px', borderRadius: 8, textDecoration: 'none', boxShadow: '0 2px 8px rgba(124,58,237,0.25)' }}>
          {userRole === 'edtech' ? 'Book Session' : 'Get Access →'}
        </a>
      </div>
    </div>
  );
}