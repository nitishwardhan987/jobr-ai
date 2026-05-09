'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, Booking, creditsToINR, ADMIN_EMAIL, CREDIT_TO_INR } from '@/lib/supabase';

const ADMIN_EMAILS = [ADMIN_EMAIL, 'nitishwardhan987@gmail.com'];

export default function AdminPanel() {
  const router = useRouter();
  const [authed,   setAuthed]   = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState<'disputes'|'orders'|'bookings'>('disputes');
  const [creditForm, setCreditForm] = useState({ email: '', credits: 10, upi_ref: '' });
  const [addingCredits, setAddingCredits] = useState(false);

  useEffect(() => {
    const s = localStorage.getItem('jobr_session') || localStorage.getItem('jobr_user');
    if (!s) { router.push('/auth'); return; }
    try {
      const p = JSON.parse(s);
      if (!ADMIN_EMAILS.includes(p.email)) { router.push('/'); return; }
      setAuthed(true); loadAll();
    } catch { router.push('/'); }
  }, [router]);

  async function loadAll() {
    const [{ data: b }, { data: d }] = await Promise.all([
      supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(50),
      supabase.from('disputes').select('*').order('created_at', { ascending: false }),
    ]);
    setBookings(b || []); setDisputes(d || []); setLoading(false);
  }

  async function addCredits() {
    if (!creditForm.email || !creditForm.credits) return;
    setAddingCredits(true);
    try {
      const { data: edtech } = await supabase.from('edtech_profiles').select('wallet_credits').eq('user_email', creditForm.email).single();
      if (edtech) {
        await supabase.from('edtech_profiles').update({ wallet_credits: edtech.wallet_credits + creditForm.credits }).eq('user_email', creditForm.email);
        await supabase.from('transactions').insert({ actor_email: creditForm.email, actor_role: 'edtech', type: 'top_up', credits: creditForm.credits, note: `Manual top-up. UPI: ${creditForm.upi_ref}` });
        alert(`✓ Added ${creditForm.credits} credits to EdTech ${creditForm.email}`);
        setCreditForm({ email: '', credits: 10, upi_ref: '' }); return;
      }
      const { data: mentor } = await supabase.from('mentor_profiles').select('wallet_credits').eq('user_email', creditForm.email).single();
      if (mentor) {
        await supabase.from('mentor_profiles').update({ wallet_credits: (mentor.wallet_credits || 0) + creditForm.credits }).eq('user_email', creditForm.email);
        alert(`✓ Added ${creditForm.credits} credits to Mentor ${creditForm.email}`);
        setCreditForm({ email: '', credits: 10, upi_ref: '' }); return;
      }
      alert('Email not found.');
    } catch (e: any) { alert('Error: ' + e.message); }
    finally { setAddingCredits(false); }
  }

  async function resolveDispute(disputeId: string, bookingId: string, resolution: 'mentor'|'edtech') {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;
    if (resolution === 'mentor') {
      await supabase.from('bookings').update({ status: 'released' }).eq('id', bookingId);
      const { data: m } = await supabase.from('mentor_profiles').select('wallet_credits').eq('user_email', booking.mentor_email).single();
      if (m) await supabase.from('mentor_profiles').update({ wallet_credits: (m.wallet_credits || 0) + booking.credits_mentor }).eq('user_email', booking.mentor_email);
    } else {
      await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', bookingId);
      const { data: e } = await supabase.from('edtech_profiles').select('wallet_credits').eq('user_email', booking.edtech_email).single();
      if (e) await supabase.from('edtech_profiles').update({ wallet_credits: e.wallet_credits + booking.credits_total }).eq('user_email', booking.edtech_email);
    }
    await supabase.from('disputes').update({ status: `resolved_${resolution}`, resolved_by: ADMIN_EMAIL, resolution: resolution === 'mentor' ? 'Credits released to mentor' : 'Credits refunded to EdTech', resolved_at: new Date().toISOString() }).eq('id', disputeId);
    loadAll();
  }

  if (!authed || loading) return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 28, height: 28, border: '3px solid rgba(124,58,237,0.2)', borderTop: '3px solid #7C3AED', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;

  const openDisputes = disputes.filter(d => d.status === 'open');

  return (
    <div style={{ background: '#FAFAF8', minHeight: '100vh' }}>
      <div style={{ background: '#1A1A2E', padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>MENTOR.JOBR</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>Admin Panel</div>
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'rgba(255,255,255,0.6)', flexWrap: 'wrap' }}>
            <span>Bookings: {bookings.length}</span>
            <span style={{ color: openDisputes.length > 0 ? '#F87171' : 'rgba(255,255,255,0.6)' }}>Open disputes: {openDisputes.length}</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px' }}>
        <div style={{ background: '#fff', border: '1.5px solid rgba(124,58,237,0.15)', borderRadius: 14, padding: 20, marginBottom: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A2E', marginBottom: 14 }}>➕ Add Credits</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input className="input" type="email" placeholder="user@email.com" value={creditForm.email} onChange={e => setCreditForm(f => ({ ...f, email: e.target.value }))} style={{ flex: 2, minWidth: 200, fontSize: 13 }} />
            <input className="input" type="number" min={1} placeholder="Credits" value={creditForm.credits} onChange={e => setCreditForm(f => ({ ...f, credits: Number(e.target.value) }))} style={{ flex: 1, minWidth: 80, fontSize: 13 }} />
            <input className="input" type="text" placeholder="UPI Ref" value={creditForm.upi_ref} onChange={e => setCreditForm(f => ({ ...f, upi_ref: e.target.value }))} style={{ flex: 2, minWidth: 140, fontSize: 13 }} />
            <button onClick={addCredits} disabled={addingCredits} style={{ background: '#7C3AED', color: '#fff', border: 'none', borderRadius: 8, padding: '0 20px', fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {addingCredits ? '...' : 'Add Credits'}
            </button>
          </div>
          <p style={{ fontSize: 11, color: '#8A8A9A', marginTop: 8 }}>{creditForm.credits} credits = ₹{(creditForm.credits * CREDIT_TO_INR).toLocaleString('en-IN')}</p>
        </div>

        <div style={{ display: 'flex', gap: 0, borderBottom: '1.5px solid rgba(26,26,46,0.08)', marginBottom: 20 }}>
          {(['disputes','bookings'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '10px 20px', fontSize: 13, fontWeight: 500, border: 'none', background: 'transparent', cursor: 'pointer', borderBottom: tab === t ? '2px solid #7C3AED' : '2px solid transparent', color: tab === t ? '#7C3AED' : '#8A8A9A', marginBottom: '-1.5px' }}>
              {t === 'disputes' ? `Disputes (${openDisputes.length} open)` : `All Bookings (${bookings.length})`}
            </button>
          ))}
        </div>

        {tab === 'disputes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {disputes.length === 0 ? <div style={{ textAlign: 'center', padding: 40, color: '#8A8A9A' }}>No disputes 🎉</div> :
              disputes.map(d => {
                const booking = bookings.find(b => b.id === d.booking_id);
                return (
                  <div key={d.id} style={{ background: '#fff', border: `1.5px solid ${d.status === 'open' ? 'rgba(239,68,68,0.25)' : 'rgba(26,26,46,0.08)'}`, borderRadius: 12, padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A2E' }}>{booking?.session_topic || 'Unknown'}</div>
                        <div style={{ fontSize: 12, color: '#8A8A9A', marginTop: 2 }}>{booking?.mentor_name} ↔ {booking?.edtech_company} · {booking?.credits_total} cr</div>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, background: d.status === 'open' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: d.status === 'open' ? '#DC2626' : '#059669', padding: '3px 8px', borderRadius: 99, fontFamily: 'monospace', alignSelf: 'flex-start' }}>
                        {d.status.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: '#4A4A6A', background: '#FAFAF8', borderRadius: 8, padding: '8px 12px', marginBottom: d.status === 'open' ? 12 : 0 }}>
                      <strong>Reason:</strong> {d.reason}
                    </div>
                    {d.status === 'open' && booking && (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => resolveDispute(d.id, d.booking_id, 'mentor')} style={{ flex: 1, background: '#10B981', color: '#fff', border: 'none', borderRadius: 8, padding: '9px', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>✓ Release to Mentor</button>
                        <button onClick={() => resolveDispute(d.id, d.booking_id, 'edtech')} style={{ flex: 1, background: '#7C3AED', color: '#fff', border: 'none', borderRadius: 8, padding: '9px', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>↩ Refund to EdTech</button>
                      </div>
                    )}
                    {d.resolution && <div style={{ fontSize: 12, color: '#059669', marginTop: 8 }}>✓ {d.resolution}</div>}
                  </div>
                );
              })
            }
          </div>
        )}

        {tab === 'bookings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {bookings.map(b => (
              <div key={b.id} style={{ background: '#fff', border: '1.5px solid rgba(26,26,46,0.08)', borderRadius: 12, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E' }}>{b.session_topic}</div>
                  <div style={{ fontSize: 12, color: '#8A8A9A' }}>{b.mentor_name} ↔ {b.edtech_company} · {b.session_date}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A2E' }}>{b.credits_total} cr</div>
                  <span style={{ fontSize: 10, fontWeight: 700, fontFamily: 'monospace', background: 'rgba(124,58,237,0.08)', color: '#7C3AED', padding: '2px 6px', borderRadius: 99 }}>{b.status.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}