'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase, MentorProfile, EdtechProfile, creditsToINR, calcBookingCredits } from '@/lib/supabase';

function Inner() {
  const router = useRouter();
  const params = useSearchParams();
  const mentorEmail = params.get('mentor');
  const [mentor,     setMentor]     = useState<MentorProfile | null>(null);
  const [edtech,     setEdtech]     = useState<EdtechProfile | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState('');
  const [success,    setSuccess]    = useState(false);
  const [form, setForm] = useState({ session_topic: '', session_date: '', duration_hours: 1 });

  useEffect(() => {
    if (!mentorEmail) { router.push('/mentor'); return; }
    const s = localStorage.getItem('jobr_session') || localStorage.getItem('jobr_user');
    if (!s) { router.push('/mentor/edtech?register=1'); return; }
    try {
      const p = JSON.parse(s);
      if (p.role !== 'edtech') { router.push('/mentor/edtech?register=1'); return; }
      Promise.all([
        supabase.from('mentor_profiles').select('*').eq('user_email', mentorEmail).single(),
        supabase.from('edtech_profiles').select('*').eq('user_email', p.email).single(),
      ]).then(([{ data: m }, { data: e }]) => { setMentor(m); setEdtech(e); setLoading(false); });
    } catch { router.push('/mentor/edtech?register=1'); }
  }, [mentorEmail, router]);

  async function handleBook() {
    setError('');
    if (!form.session_topic) { setError('Please enter a session topic.'); return; }
    if (!form.session_date)  { setError('Please select a date.'); return; }
    if (!mentor || !edtech)  return;
    const { total, platform, mentor: mentorCut } = calcBookingCredits(mentor.rate_per_hour, form.duration_hours);
    if (edtech.wallet_credits < total) { setError(`Insufficient credits. You have ${edtech.wallet_credits} but need ${total}.`); return; }
    setSubmitting(true);
    try {
      await supabase.from('edtech_profiles').update({ wallet_credits: edtech.wallet_credits - total }).eq('user_email', edtech.user_email);
      const { error: bookErr } = await supabase.from('bookings').insert({ mentor_email: mentor.user_email, edtech_email: edtech.user_email, mentor_name: mentor.name, edtech_company: edtech.company_name, session_topic: form.session_topic, session_date: form.session_date, duration_hours: form.duration_hours, credits_total: total, credits_platform: platform, credits_mentor: mentorCut, status: 'frozen' });
      if (bookErr) throw bookErr;
      await supabase.from('transactions').insert({ actor_email: edtech.user_email, actor_role: 'edtech', type: 'freeze', credits: total, note: `Booking: ${form.session_topic} with ${mentor.name}` });
      setSuccess(true);
    } catch (e: any) {
      setError(e.message || 'Booking failed.');
      await supabase.from('edtech_profiles').update({ wallet_credits: edtech.wallet_credits }).eq('user_email', edtech.user_email);
    } finally { setSubmitting(false); }
  }

  if (loading) return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 28, height: 28, border: '3px solid rgba(124,58,237,0.2)', borderTop: '3px solid #7C3AED', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;

  if (success) return (
    <div style={{ background: '#FAFAF8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 480, width: '100%', textAlign: 'center', background: '#fff', borderRadius: 20, padding: '48px 32px', border: '1.5px solid rgba(16,185,129,0.2)' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1A1A2E', marginBottom: 8 }}>Booking Confirmed!</h2>
        <p style={{ fontSize: 14, color: '#4A4A6A', lineHeight: 1.6, marginBottom: 20 }}>Credits are frozen and {mentor?.name} has been notified.</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href={`https://wa.me/${mentor?.whatsapp?.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" style={{ flex: 1, background: '#25D366', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 14, padding: '11px', borderRadius: 10, textAlign: 'center' }}>WhatsApp Mentor</a>
          <a href="/mentor/edtech" style={{ flex: 1, background: '#7C3AED', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 14, padding: '11px', borderRadius: 10, textAlign: 'center' }}>My Bookings →</a>
        </div>
      </div>
    </div>
  );

  if (!mentor) return null;
  const { total, platform, mentor: mentorCut } = calcBookingCredits(mentor.rate_per_hour, form.duration_hours);
  const hasEnough = (edtech?.wallet_credits || 0) >= total;

  return (
    <div style={{ background: '#FAFAF8', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <a href="/mentor" style={{ fontSize: 13, color: '#7C3AED', textDecoration: 'none', fontWeight: 500 }}>← Back to Mentors</a>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1A1A2E', marginTop: 20, marginBottom: 24 }}>Book a Session</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div style={{ background: '#fff', border: '1.5px solid rgba(26,26,46,0.08)', borderRadius: 14, padding: 20 }}>
            <div style={{ fontSize: 11, color: '#8A8A9A', fontFamily: 'monospace', marginBottom: 10 }}>MENTOR</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #F97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, color: '#fff' }}>{mentor.name[0]}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A2E' }}>{mentor.name}</div>
                <div style={{ fontSize: 12, color: '#8A8A9A' }}>{mentor.domain}</div>
              </div>
            </div>
            <div style={{ marginTop: 12, fontSize: 13, color: '#7C3AED', fontWeight: 700 }}>{mentor.rate_per_hour} credits/hour</div>
          </div>
          <div style={{ background: hasEnough ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)', border: `1.5px solid ${hasEnough ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`, borderRadius: 14, padding: 20 }}>
            <div style={{ fontSize: 11, color: '#8A8A9A', fontFamily: 'monospace', marginBottom: 10 }}>YOUR WALLET</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: hasEnough ? '#059669' : '#DC2626' }}>{edtech?.wallet_credits || 0}</div>
            <div style={{ fontSize: 12, color: '#8A8A9A' }}>credits available</div>
            {!hasEnough && <a href="/mentor/edtech" style={{ fontSize: 11, color: '#DC2626', display: 'block', marginTop: 6, fontWeight: 600 }}>Top up wallet →</a>}
          </div>
        </div>

        <div style={{ background: '#fff', border: '1.5px solid rgba(26,26,46,0.08)', borderRadius: 14, padding: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#4A4A6A', display: 'block', marginBottom: 6 }}>Session Topic</label>
              <input className="input" type="text" placeholder="e.g. Data Science for cohort 3" value={form.session_topic} onChange={e => setForm(f => ({ ...f, session_topic: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#4A4A6A', display: 'block', marginBottom: 6 }}>Session Date</label>
              <input className="input" type="date" min={new Date().toISOString().split('T')[0]} value={form.session_date} onChange={e => setForm(f => ({ ...f, session_date: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#4A4A6A', display: 'block', marginBottom: 6 }}>Duration</label>
              <select className="input" value={form.duration_hours} onChange={e => setForm(f => ({ ...f, duration_hours: Number(e.target.value) }))}>
                {[0.5,1,1.5,2,3,4].map(h => <option key={h} value={h}>{h} hour{h !== 1 ? 's' : ''}</option>)}
              </select>
            </div>
          </div>

          <div style={{ background: '#FAFAF8', borderRadius: 10, padding: '14px 16px', marginTop: 16, border: '1px solid rgba(26,26,46,0.08)' }}>
            <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#8A8A9A', marginBottom: 10, textTransform: 'uppercase' }}>Cost Breakdown</div>
            {[
              { label: 'Session cost',     value: `${total} credits`,    sub: `₹${creditsToINR(total)}` },
              { label: 'Platform fee 10%', value: `${platform} credits`, sub: `₹${creditsToINR(platform)}` },
              { label: 'Mentor receives',  value: `${mentorCut} credits`,sub: `₹${creditsToINR(mentorCut)}` },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(26,26,46,0.05)' }}>
                <span style={{ fontSize: 13, color: '#4A4A6A' }}>{r.label}</span>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1A2E' }}>{r.value}</span>
                  <div style={{ fontSize: 11, color: '#8A8A9A' }}>{r.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {error && <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, fontSize: 13, color: '#DC2626', marginTop: 12 }}>{error}</div>}

          <button onClick={handleBook} disabled={submitting || !hasEnough} style={{ width: '100%', marginTop: 16, background: hasEnough ? '#7C3AED' : '#E5E5E5', color: hasEnough ? '#fff' : '#8A8A9A', border: 'none', borderRadius: 10, padding: '13px', fontWeight: 700, fontSize: 15, cursor: hasEnough ? 'pointer' : 'not-allowed', opacity: submitting ? 0.7 : 1, boxShadow: hasEnough ? '0 2px 8px rgba(124,58,237,0.25)' : 'none' }}>
            {submitting ? 'Processing...' : hasEnough ? `🔒 Book & Freeze ${total} Credits` : 'Insufficient Credits — Top Up First'}
          </button>
          <p style={{ fontSize: 11, color: '#8A8A9A', textAlign: 'center', marginTop: 10, lineHeight: 1.5 }}>Credits are frozen at booking. Released only after you confirm delivery.</p>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return <Suspense><Inner /></Suspense>;
}