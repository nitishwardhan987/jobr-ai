'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, CheckCircle2, Clock, Calendar, ArrowRight, ExternalLink, Shield } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const SESSION_TYPE_COLORS: Record<string, string> = {
  'Assignment Help': '#06B6D4', 'Career Guidance': '#0D9488',
  'Mock Interview': '#F97316', 'Project Review': '#A78BFA',
  'Resume Review': '#10B981', 'Doubt Solving': '#F59E0B',
};

export default function MentorProfile() {
  const { id } = useParams();
  const router = useRouter();
  const [mentor, setMentor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);

  useEffect(() => {
    const s = localStorage.getItem('jobr_session') || localStorage.getItem('jobr_user');
    if (s) setIsLoggedIn(true);
    loadMentor();
  }, [id]);

  const loadMentor = async () => {
    try {
      const { data } = await supabase.from('mentor_profiles').select('*').eq('id', id).single();
      if (data) { setMentor(data); if (data.session_types?.[0]) setSelectedSession(data.session_types[0]); }
      else {
  router.push('/mentor');
            }
    } catch { router.push('/mentor'); }
    finally { setLoading(false); }
  };

  const handleBook = () => {
    if (!isLoggedIn) { router.push('/auth?redirect=/mentor/' + id); return; }
    if (!selectedSession) return;
    router.push(`/mentor/book?mentor=${id}&session=${encodeURIComponent(selectedSession.name)}&price=${selectedSession.price}`);
  };

  if (loading) return (
    <div style={{ background: '#1C1C2E', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(13,148,136,0.3)', borderTopColor: '#0D9488', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  if (!mentor) return null;

  const availLabel = mentor.availability_mode === 'slots' ? 'Has fixed weekly slots' : mentor.availability_mode === 'request' ? 'Books on request' : 'Fixed slots + on request';
  const slots = mentor.availability?.slots || [];

  return (
    <div style={{ background: '#1C1C2E', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(145deg, rgba(13,148,136,0.12) 0%, transparent 70%)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '40px 20px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'linear-gradient(135deg, #0D9488, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 900, color: '#fff', flexShrink: 0, border: '3px solid rgba(13,148,136,0.3)' }}>
            {mentor.photo_url ? <img src={mentor.photo_url} alt={mentor.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : mentor.name[0]}
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,4vw,32px)', fontWeight: 900, color: '#F1F0FF', margin: 0 }}>{mentor.name}</h1>
              {mentor.is_verified && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(13,148,136,0.12)', border: '1px solid rgba(13,148,136,0.25)', borderRadius: 100, padding: '3px 10px' }}>
                  <CheckCircle2 size={12} color="#0D9488" />
                  <span style={{ fontSize: 11, color: '#0D9488', fontWeight: 700, fontFamily: 'monospace' }}>VERIFIED</span>
                </div>
              )}
            </div>
            <div style={{ fontSize: 15, color: '#94A3B8', marginBottom: 8 }}>{mentor.mentor_role} · {mentor.current_company} · {mentor.years_experience}y exp</div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Star size={14} color="#F59E0B" fill="#F59E0B" />
                <span style={{ fontSize: 14, color: '#F59E0B', fontWeight: 700 }}>{mentor.rating || 'New'}</span>
              </div>
              <span style={{ fontSize: 13, color: '#475569' }}>{mentor.total_sessions} sessions</span>
              <span style={{ fontSize: 13, color: '#0D9488' }}>{mentor.domain}</span>
              {mentor.linkedin_url && (
                <a href={mentor.linkedin_url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#475569', textDecoration: 'none' }}>
                  <ExternalLink size={12} /> LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>

        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 22 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#0D9488', fontFamily: 'monospace', marginBottom: 10 }}>ABOUT</div>
            <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.7, margin: 0 }}>{mentor.bio}</p>
          </div>

          {/* Session types */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 22 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#0D9488', fontFamily: 'monospace', marginBottom: 14 }}>SESSION TYPES & RATES</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(mentor.session_types || []).map((s: any) => (
                <div key={s.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: SESSION_TYPE_COLORS[s.name] || '#64748B' }} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#F1F0FF', fontFamily: 'var(--font-display)' }}>{s.name}</span>
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 900, color: '#0D9488', fontFamily: 'var(--font-display)' }}>₹{s.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 22 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#0D9488', fontFamily: 'monospace', marginBottom: 14 }}>AVAILABILITY</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
              <Clock size={14} color="#0D9488" />
              <span style={{ fontSize: 13, color: '#94A3B8' }}>{availLabel}</span>
            </div>
            {slots.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {slots.map((slot: any, i: number) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'rgba(13,148,136,0.06)', border: '1px solid rgba(13,148,136,0.12)', borderRadius: 8 }}>
                    <Calendar size={12} color="#0D9488" />
                    <span style={{ fontSize: 13, color: '#94A3B8' }}>{slot.day} · {slot.from} – {slot.to}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Trust */}
          <div style={{ padding: '14px 18px', background: 'rgba(13,148,136,0.05)', border: '1px solid rgba(13,148,136,0.12)', borderRadius: 12, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <Shield size={16} color="#0D9488" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.55 }}>
              <strong style={{ color: '#0D9488' }}>Jobr Escrow Protection</strong> — your payment is frozen until the session is confirmed complete. If anything goes wrong, Jobr mediates the dispute.
            </div>
          </div>
        </div>

        {/* Right — Booking card */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(13,148,136,0.2)', borderRadius: 20, padding: 22, position: 'sticky', top: 80 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0D9488', fontFamily: 'monospace', marginBottom: 14 }}>BOOK A SESSION</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {(mentor.session_types || []).map((s: any) => (
              <button key={s.name} onClick={() => setSelectedSession(s)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px', background: selectedSession?.name === s.name ? 'rgba(13,148,136,0.12)' : 'rgba(255,255,255,0.03)', border: `1px solid ${selectedSession?.name === s.name ? 'rgba(13,148,136,0.4)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: selectedSession?.name === s.name ? '#0D9488' : '#94A3B8', fontFamily: 'var(--font-display)' }}>{s.name}</span>
                <span style={{ fontSize: 14, fontWeight: 900, color: '#0D9488', fontFamily: 'var(--font-display)' }}>₹{s.price}</span>
              </button>
            ))}
          </div>

          {selectedSession && (
            <div style={{ padding: '12px 14px', background: 'rgba(13,148,136,0.06)', border: '1px solid rgba(13,148,136,0.15)', borderRadius: 10, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: '#94A3B8' }}>{selectedSession.name}</span>
                <span style={{ fontSize: 13, color: '#F1F0FF', fontWeight: 700 }}>₹{selectedSession.price}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#475569' }}>Jobr platform fee</span>
                <span style={{ fontSize: 12, color: '#475569' }}>₹{Math.round(selectedSession.price * 0.1)}</span>
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#F1F0FF' }}>Total</span>
                <span style={{ fontSize: 14, fontWeight: 900, color: '#0D9488', fontFamily: 'var(--font-display)' }}>₹{selectedSession.price + Math.round(selectedSession.price * 0.1)}</span>
              </div>
            </div>
          )}

          <button onClick={handleBook} style={{ width: '100%', background: 'linear-gradient(135deg, #0D9488, #0891B2)', color: '#fff', border: 'none', borderRadius: 100, padding: '13px', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'var(--font-display)', boxShadow: '0 4px 16px rgba(13,148,136,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {isLoggedIn ? 'Book Session' : 'Sign in to Book'} <ArrowRight size={16} />
          </button>
          <p style={{ fontSize: 11, color: '#334155', textAlign: 'center', marginTop: 10, lineHeight: 1.5 }}>
            Pay via credits or UPI · Protected by Jobr Escrow
          </p>
        </div>
      </div>
      <style jsx global>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}