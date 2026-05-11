'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2, Clock, XCircle, Star, Wallet,
  ExternalLink, RefreshCw, AlertCircle, Loader2,
  TrendingUp, Users, Calendar,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending_confirmation: { label: 'Awaiting Your Confirmation', color: '#F97316', bg: 'rgba(249,115,22,0.12)' },
  confirmed:            { label: 'Confirmed',                  color: '#0D9488', bg: 'rgba(13,148,136,0.12)' },
  completed:            { label: 'Completed',                  color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  disputed:             { label: 'Disputed',                   color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
  cancelled:            { label: 'Cancelled',                  color: '#64748B', bg: 'rgba(100,116,139,0.12)' },
};

export default function MentorDashboard() {
  const router = useRouter();
  const [mentor,    setMentor]    = useState<any>(null);
  const [bookings,  setBookings]  = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [tab,       setTab]       = useState<'bookings'|'wallet'|'profile'>('bookings');
  const [error,     setError]     = useState('');

  // Withdrawal form
  const [withdrawForm, setWithdrawForm] = useState({ upi_id: '', credits: 0 });
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    const s = localStorage.getItem('jobr_session') || localStorage.getItem('jobr_user');
    if (!s) { router.push('/auth'); return; }
    const { email } = JSON.parse(s);
    loadData(email);
  }, []);

  const loadData = async (email: string) => {
    try {
      const [{ data: m }, { data: b }] = await Promise.all([
        supabase.from('mentor_profiles').select('*').eq('user_email', email).single(),
        supabase.from('bookings').select('*').eq('mentor_email', email).order('created_at', { ascending: false }),
      ]);
      if (!m) { router.push('/mentor/onboard'); return; }
      setMentor(m);
      setBookings(b || []);
    } catch { router.push('/mentor/onboard'); }
    finally { setLoading(false); }
  };

  const confirmBooking = async (id: string, meetLink: string) => {
    await supabase.from('bookings').update({ status: 'confirmed', meet_link: meetLink }).eq('id', id);
    setBookings(b => b.map(bk => bk.id === id ? { ...bk, status: 'confirmed', meet_link: meetLink } : bk));
  };

  const markDelivered = async (id: string, notes: string) => {
    await supabase.from('bookings').update({ status: 'completed', completion_notes: notes }).eq('id', id);
    // Add credits to wallet
    const booking = bookings.find(b => b.id === id);
    if (booking && mentor) {
      const earned = booking.session_price_credits - Math.round(booking.session_price_credits * 0.1);
      await supabase.from('mentor_profiles').update({
        wallet_credits: (mentor.wallet_credits || 0) + earned,
        total_earned: (mentor.total_earned || 0) + earned,
        total_sessions: (mentor.total_sessions || 0) + 1,
      }).eq('user_email', mentor.user_email);
      setMentor((m: any) => ({ ...m, wallet_credits: (m.wallet_credits || 0) + earned, total_sessions: (m.total_sessions || 0) + 1 }));
    }
    setBookings(b => b.map(bk => bk.id === id ? { ...bk, status: 'completed' } : bk));
  };

  const requestWithdrawal = async () => {
    if (!withdrawForm.upi_id || withdrawForm.credits < 1) return;
    if (withdrawForm.credits > (mentor?.wallet_credits || 0)) { setError('Insufficient credits'); return; }
    setWithdrawing(true);
    try {
      await supabase.from('withdrawal_requests').insert({
        mentor_email: mentor.user_email,
        mentor_name: mentor.name,
        credits: withdrawForm.credits,
        amount_inr: withdrawForm.credits * 100,
        upi_id: withdrawForm.upi_id,
        status: 'pending',
      });
      const waText = encodeURIComponent(`💰 Withdrawal Request!\n\nMentor: ${mentor.name}\nCredits: ${withdrawForm.credits}\nAmount: ₹${withdrawForm.credits * 100}\nUPI: ${withdrawForm.upi_id}\n\nProcess at: jobr.co.in/admin`);
      window.open(`https://wa.me/919436781545?text=${waText}`, '_blank');
      setWithdrawForm({ upi_id: '', credits: 0 });
      alert('Withdrawal request submitted! We\'ll process within 24 hours.');
    } catch (e: any) { setError(e.message); }
    finally { setWithdrawing(false); }
  };

  if (loading) return (
    <div style={{ background: '#1C1C2E', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 36, height: 36, border: '3px solid rgba(13,148,136,0.3)', borderTopColor: '#0D9488', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  const pending   = bookings.filter(b => b.status === 'pending_confirmation');
  const confirmed = bookings.filter(b => b.status === 'confirmed');
  const completed = bookings.filter(b => b.status === 'completed');

  return (
    <div style={{ background: '#1C1C2E', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(145deg, rgba(13,148,136,0.12) 0%, transparent 60%)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '28px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#0D9488', fontFamily: 'monospace', marginBottom: 4 }}>MENTOR DASHBOARD</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 900, color: '#F1F0FF', margin: 0 }}>Welcome back, {mentor?.name?.split(' ')[0]}</h1>
            <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>{mentor?.domain} · {mentor?.mentor_role} @ {mentor?.current_company}</div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[
              { label: 'Total Sessions', value: mentor?.total_sessions || 0, color: '#0D9488' },
              { label: 'Rating', value: mentor?.rating ? `⭐ ${mentor.rating}` : 'New', color: '#F59E0B' },
              { label: 'Wallet', value: `${mentor?.wallet_credits || 0} cr`, color: '#A78BFA' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center', padding: '10px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12 }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: s.color, fontFamily: 'var(--font-display)' }}>{s.value}</div>
                <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px' }}>

        {/* Pending action banner */}
        {pending.length > 0 && (
          <div style={{ padding: '14px 18px', background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 14, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertCircle size={16} color="#F97316" />
            <span style={{ fontSize: 14, fontWeight: 600, color: '#F97316', fontFamily: 'var(--font-display)' }}>
              {pending.length} booking request{pending.length > 1 ? 's' : ''} waiting for your confirmation
            </span>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 24 }}>
          {[
            { id: 'bookings', label: `Bookings (${bookings.length})` },
            { id: 'wallet',   label: `Wallet — ${mentor?.wallet_credits || 0} credits` },
            { id: 'profile',  label: 'My Profile' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id as any)} style={{ padding: '11px 18px', background: 'transparent', border: 'none', cursor: 'pointer', borderBottom: tab === t.id ? '2px solid #0D9488' : '2px solid transparent', color: tab === t.id ? '#0D9488' : '#475569', fontSize: 13, fontWeight: tab === t.id ? 700 : 500, fontFamily: 'var(--font-display)', whiteSpace: 'nowrap', marginBottom: '-1px', transition: 'all 0.15s' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* BOOKINGS TAB */}
        {tab === 'bookings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60 }}>
                <Calendar size={40} color="#334155" style={{ marginBottom: 12 }} />
                <div style={{ fontSize: 16, color: '#475569', fontWeight: 600 }}>No bookings yet</div>
                <div style={{ fontSize: 13, color: '#334155', marginTop: 6 }}>When students book you, requests appear here</div>
              </div>
            ) : bookings.map(bk => <BookingCard key={bk.id} booking={bk} mentor={mentor} onConfirm={confirmBooking} onDeliver={markDelivered} />)}
          </div>
        )}

        {/* WALLET TAB */}
        {tab === 'wallet' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 8 }}>
              {[
                { label: 'AVAILABLE CREDITS', value: `${mentor?.wallet_credits || 0} cr`, sub: `= ₹${(mentor?.wallet_credits || 0) * 100}`, color: '#0D9488' },
                { label: 'TOTAL EARNED', value: `${mentor?.total_earned || 0} cr`, sub: `= ₹${(mentor?.total_earned || 0) * 100}`, color: '#A78BFA' },
                { label: 'SESSIONS DONE', value: mentor?.total_sessions || 0, sub: 'completed sessions', color: '#F59E0B' },
              ].map(s => (
                <div key={s.label} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '16px 18px' }}>
                  <div style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace', marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: s.color, fontFamily: 'var(--font-display)', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: '#334155', marginTop: 4 }}>{s.sub}</div>
                </div>
              ))}
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 22 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0D9488', fontFamily: 'monospace', marginBottom: 14 }}>REQUEST WITHDRAWAL</div>
              <p style={{ fontSize: 13, color: '#64748B', marginBottom: 16, lineHeight: 1.5 }}>
                We process withdrawals within 24 hours. 1 credit = ₹100.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
                <div style={{ flex: 2, minWidth: 160 }}>
                  <label style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace', display: 'block', marginBottom: 5 }}>UPI ID</label>
                  <input className="input" placeholder="yourname@upi" value={withdrawForm.upi_id} onChange={e => setWithdrawForm(f => ({ ...f, upi_id: e.target.value }))} style={{ fontSize: 13 }} />
                </div>
                <div style={{ flex: 1, minWidth: 100 }}>
                  <label style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace', display: 'block', marginBottom: 5 }}>CREDITS</label>
                  <input type="number" className="input" placeholder="10" min={1} max={mentor?.wallet_credits || 0} value={withdrawForm.credits || ''} onChange={e => setWithdrawForm(f => ({ ...f, credits: Number(e.target.value) }))} style={{ fontSize: 13 }} />
                </div>
              </div>
              {withdrawForm.credits > 0 && (
                <div style={{ padding: '8px 12px', background: 'rgba(13,148,136,0.06)', border: '1px solid rgba(13,148,136,0.12)', borderRadius: 8, fontSize: 12, color: '#0D9488', marginBottom: 12 }}>
                  You'll receive ₹{withdrawForm.credits * 100} to {withdrawForm.upi_id || 'your UPI ID'}
                </div>
              )}
              {error && <div style={{ padding: '8px 12px', background: 'rgba(239,68,68,0.08)', borderRadius: 8, fontSize: 12, color: '#EF4444', marginBottom: 10 }}>{error}</div>}
              <button onClick={requestWithdrawal} disabled={withdrawing || !withdrawForm.upi_id || withdrawForm.credits < 1} style={{ background: 'linear-gradient(135deg, #0D9488, #0891B2)', color: '#fff', border: 'none', borderRadius: 100, padding: '11px 28px', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, opacity: withdrawing ? 0.7 : 1, fontFamily: 'var(--font-display)' }}>
                {withdrawing ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Processing...</> : <><Wallet size={14} /> Request Withdrawal</>}
              </button>
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {tab === 'profile' && (
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 22 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#0D9488', fontFamily: 'monospace', marginBottom: 16 }}>YOUR PUBLIC PROFILE</div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #0D9488, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 900, color: '#fff', flexShrink: 0 }}>{mentor?.name?.[0]}</div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#F1F0FF', fontFamily: 'var(--font-display)' }}>{mentor?.name}</div>
                <div style={{ fontSize: 13, color: '#64748B' }}>{mentor?.mentor_role} · {mentor?.current_company}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                  {mentor?.is_verified && <span style={{ fontSize: 10, color: '#0D9488', background: 'rgba(13,148,136,0.1)', border: '1px solid rgba(13,148,136,0.2)', padding: '2px 8px', borderRadius: 100, fontFamily: 'monospace' }}>VERIFIED</span>}
                  <span style={{ fontSize: 10, color: '#64748B', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: 100, fontFamily: 'monospace' }}>{mentor?.domain}</span>
                </div>
              </div>
            </div>
            <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.65, marginBottom: 20 }}>{mentor?.bio}</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a href={`/mentor/${mentor?.id}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(13,148,136,0.1)', border: '1px solid rgba(13,148,136,0.2)', color: '#0D9488', textDecoration: 'none', padding: '9px 18px', borderRadius: 100, fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                <ExternalLink size={13} /> View My Profile
              </a>
              <a href="/mentor/onboard" style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#94A3B8', textDecoration: 'none', padding: '9px 18px', borderRadius: 100, fontSize: 13, fontWeight: 600 }}>
                Edit Profile
              </a>
            </div>
          </div>
        )}
      </div>
      <style jsx global>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function BookingCard({ booking: b, mentor, onConfirm, onDeliver }: { booking: any; mentor: any; onConfirm: (id: string, link: string) => void; onDeliver: (id: string, notes: string) => void }) {
  const [meetLink, setMeetLink] = useState(mentor?.meet_link || '');
  const [notes, setNotes] = useState('');
  const [expanded, setExpanded] = useState(b.status === 'pending_confirmation');
  const cfg = STATUS_CONFIG[b.status] || STATUS_CONFIG['cancelled'];

  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${b.status === 'pending_confirmation' ? 'rgba(249,115,22,0.25)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 14, overflow: 'hidden' }}>
      <div onClick={() => setExpanded(!expanded)} style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#F1F0FF', fontFamily: 'var(--font-display)' }}>{b.session_type}</div>
          <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>
            {b.student_name || b.student_email} · {b.slot_date} at {b.slot_time} · {b.session_price_credits} credits
          </div>
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, color: cfg.color, background: cfg.bg, padding: '3px 10px', borderRadius: 100, fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{cfg.label}</span>
      </div>

      {expanded && (
        <div style={{ padding: '0 18px 18px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          {b.completion_notes && (
            <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, fontSize: 13, color: '#94A3B8', marginTop: 14, marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace', marginBottom: 4 }}>STUDENT NOTES</div>
              {b.completion_notes}
            </div>
          )}

          {b.status === 'pending_confirmation' && (
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <label style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace', display: 'block', marginBottom: 5 }}>YOUR MEETING LINK (shared with student on confirmation)</label>
                <input className="input" placeholder="https://zoom.us/j/..." value={meetLink} onChange={e => setMeetLink(e.target.value)} style={{ fontSize: 13 }} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => onConfirm(b.id, meetLink)} style={{ flex: 1, background: 'linear-gradient(135deg, #0D9488, #0891B2)', color: '#fff', border: 'none', borderRadius: 100, padding: '10px', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
                  ✓ Confirm Booking
                </button>
                <button onClick={() => onConfirm(b.id, '')} style={{ flex: 1, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)', color: '#EF4444', borderRadius: 100, padding: '10px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  ✗ Decline
                </button>
              </div>
            </div>
          )}

          {b.status === 'confirmed' && (
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {b.meet_link && (
                <a href={b.meet_link} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', background: 'rgba(13,148,136,0.08)', border: '1px solid rgba(13,148,136,0.2)', borderRadius: 10, color: '#0D9488', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
                  <ExternalLink size={13} /> Open Meeting Link
                </a>
              )}
              <div>
                <label style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace', display: 'block', marginBottom: 5 }}>SESSION COMPLETION NOTES (optional)</label>
                <textarea className="input" placeholder="What was covered in the session..." value={notes} onChange={e => setNotes(e.target.value)} style={{ height: 70, resize: 'none', fontSize: 13 }} />
              </div>
              <button onClick={() => onDeliver(b.id, notes)} style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff', border: 'none', borderRadius: 100, padding: '10px', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
                ✓ Mark Session as Delivered — Claim {b.session_price_credits - Math.round(b.session_price_credits * 0.1)} credits
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}