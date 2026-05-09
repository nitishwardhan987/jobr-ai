'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase, EdtechProfile, Booking, creditsToINR, CREDIT_TO_INR } from '@/lib/supabase';

function Inner() {
  const router = useRouter();
  const params = useSearchParams();
  const isRegister = params.get('register') === '1';
  const [profile,    setProfile]    = useState<EdtechProfile | null>(null);
  const [bookings,   setBookings]   = useState<Booking[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [tab,        setTab]        = useState<'bookings'|'wallet'|'register'>(isRegister ? 'register' : 'bookings');
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [reg, setReg] = useState({ company_name: '', contact_name: '', email: '', website: '' });

  useEffect(() => {
    const s = localStorage.getItem('jobr_session') || localStorage.getItem('jobr_user');
    if (!s && !isRegister) { setTab('register'); setLoading(false); return; }
    if (s) {
      try {
        const p = JSON.parse(s);
        if (p.role === 'edtech') { loadData(p.email); return; }
      } catch {}
    }
    setLoading(false);
  }, [isRegister]);

  async function loadData(email: string) {
    const [{ data: p }, { data: b }] = await Promise.all([
      supabase.from('edtech_profiles').select('*').eq('user_email', email).single(),
      supabase.from('bookings').select('*').eq('edtech_email', email).order('created_at', { ascending: false }),
    ]);
    setProfile(p); setBookings(b || []); setLoading(false);
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault(); setSubmitting('register');
    try {
      const { error } = await supabase.from('edtech_profiles').insert({ user_email: reg.email, company_name: reg.company_name, contact_name: reg.contact_name, website: reg.website, wallet_credits: 0 });
      if (error) throw error;
      const session = { name: reg.contact_name, email: reg.email, role: 'edtech', company: reg.company_name };
      localStorage.setItem('jobr_session', JSON.stringify(session));
      localStorage.setItem('jobr_user', JSON.stringify(session));
      window.dispatchEvent(new Event('storage'));
      loadData(reg.email); setTab('wallet');
    } catch (e: any) { alert(e.message || 'Registration failed.'); }
    finally { setSubmitting(null); }
  }

  async function confirmSession(bookingId: string) {
    setSubmitting(bookingId);
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;
    await supabase.from('bookings').update({ status: 'released', updated_at: new Date().toISOString() }).eq('id', bookingId);
    const { data: m } = await supabase.from('mentor_profiles').select('wallet_credits').eq('user_email', booking.mentor_email).single();
    if (m) await supabase.from('mentor_profiles').update({ wallet_credits: (m.wallet_credits || 0) + booking.credits_mentor }).eq('user_email', booking.mentor_email);
    await supabase.from('transactions').insert({ actor_email: profile!.user_email, actor_role: 'edtech', type: 'release', credits: booking.credits_total, booking_id: bookingId, note: `Session confirmed: ${booking.session_topic}` });
    setSubmitting(null); loadData(profile!.user_email);
  }

  async function disputeSession(bookingId: string, reason: string) {
    setSubmitting(bookingId);
    await supabase.from('bookings').update({ status: 'disputed', dispute_reason: reason, updated_at: new Date().toISOString() }).eq('id', bookingId);
    await supabase.from('disputes').insert({ booking_id: bookingId, raised_by: profile!.user_email, reason, status: 'open' });
    setSubmitting(null); loadData(profile!.user_email);
  }

  function requestTopUp(credits: number) {
    const waText = encodeURIComponent(`Hi Nitish, I'd like to top up my Mentor.Jobr wallet.\n\nCompany: ${profile?.company_name}\nEmail: ${profile?.user_email}\nCredits: ${credits}\nAmount: ₹${(credits * CREDIT_TO_INR).toLocaleString('en-IN')}\n\nPlease send UPI details. Thanks!`);
    window.open(`https://wa.me/919945900292?text=${waText}`, '_blank');
  }

  if (loading) return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 28, height: 28, border: '3px solid rgba(124,58,237,0.2)', borderTop: '3px solid #7C3AED', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;

  if (tab === 'register' || !profile) return (
    <div style={{ background: '#FAFAF8', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <a href="/mentor" style={{ fontSize: 13, color: '#7C3AED', textDecoration: 'none', fontWeight: 500 }}>← Back</a>
        <div style={{ textAlign: 'center', margin: '24px 0 32px' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🏢</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1A1A2E' }}>Register as EdTech</h1>
          <p style={{ fontSize: 14, color: '#8A8A9A', marginTop: 6 }}>Access verified mentors on demand</p>
        </div>
        <div style={{ background: '#fff', border: '1.5px solid rgba(26,26,46,0.10)', borderRadius: 16, padding: '28px 24px', boxShadow: '0 4px 24px rgba(26,26,46,0.06)' }}>
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'Company Name', key: 'company_name', placeholder: 'Acme EdTech Pvt Ltd', type: 'text' },
              { label: 'Your Name',    key: 'contact_name', placeholder: 'Priya Sharma',       type: 'text' },
              { label: 'Work Email',   key: 'email',        placeholder: 'priya@acme.com',      type: 'email' },
              { label: 'Website',      key: 'website',      placeholder: 'https://acme.com',    type: 'url' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#4A4A6A', display: 'block', marginBottom: 6 }}>{f.label}</label>
                <input className="input" type={f.type} placeholder={f.placeholder} value={(reg as any)[f.key]} onChange={e => setReg(r => ({ ...r, [f.key]: e.target.value }))} required={f.key !== 'website'} />
              </div>
            ))}
            <button type="submit" disabled={submitting === 'register'} style={{ background: '#7C3AED', color: '#fff', border: 'none', borderRadius: 10, padding: '13px', fontWeight: 700, fontSize: 15, cursor: 'pointer', marginTop: 8, opacity: submitting === 'register' ? 0.7 : 1, boxShadow: '0 2px 8px rgba(124,58,237,0.25)' }}>
              {submitting === 'register' ? 'Creating...' : 'Create EdTech Account →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ background: '#FAFAF8', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D1B69 100%)', padding: '32px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{profile.company_name}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{profile.user_email}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>WALLET</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>{profile.wallet_credits} <span style={{ fontSize: 13, fontWeight: 400 }}>credits</span></div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>≈ ₹{creditsToINR(profile.wallet_credits)}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
            <a href="/mentor" style={{ background: '#7C3AED', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 13, padding: '9px 18px', borderRadius: 8 }}>Browse Mentors</a>
            <button onClick={() => setTab('wallet')} style={{ background: '#F97316', color: '#fff', border: 'none', fontWeight: 700, fontSize: 13, padding: '9px 18px', borderRadius: 8, cursor: 'pointer' }}>+ Top Up Credits</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'flex', gap: 0, borderBottom: '1.5px solid rgba(26,26,46,0.08)', marginBottom: 24 }}>
          {(['bookings','wallet'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '10px 20px', fontSize: 13, fontWeight: 500, border: 'none', background: 'transparent', cursor: 'pointer', borderBottom: tab === t ? '2px solid #7C3AED' : '2px solid transparent', color: tab === t ? '#7C3AED' : '#8A8A9A', marginBottom: '-1.5px' }}>
              {t === 'bookings' ? `Bookings (${bookings.length})` : 'Wallet & Top-up'}
            </button>
          ))}
        </div>

        {tab === 'bookings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 24px', background: '#fff', borderRadius: 14, border: '1.5px solid rgba(26,26,46,0.08)' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1A2E', marginBottom: 6 }}>No bookings yet</div>
                <a href="/mentor" style={{ background: '#7C3AED', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 14, padding: '10px 24px', borderRadius: 10, display: 'inline-block', marginTop: 12 }}>Browse Mentors →</a>
              </div>
            ) : bookings.map(b => <BookingCard key={b.id} booking={b} onConfirm={confirmSession} onDispute={disputeSession} submitting={submitting} />)}
          </div>
        )}

        {tab === 'wallet' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#fff', border: '1.5px solid rgba(124,58,237,0.15)', borderRadius: 14, padding: 24, textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: '#8A8A9A', fontFamily: 'monospace', marginBottom: 4 }}>CURRENT BALANCE</div>
              <div style={{ fontSize: 48, fontWeight: 800, color: '#7C3AED' }}>{profile.wallet_credits}</div>
              <div style={{ fontSize: 14, color: '#8A8A9A' }}>credits · ≈ ₹{creditsToINR(profile.wallet_credits)}</div>
            </div>
            <div style={{ background: '#fff', border: '1.5px solid rgba(26,26,46,0.08)', borderRadius: 14, padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A2E', marginBottom: 6 }}>Top Up Credits</h3>
              <p style={{ fontSize: 13, color: '#8A8A9A', marginBottom: 20, lineHeight: 1.5 }}>Select a pack and we'll send you UPI details via WhatsApp. Credits added within 15 minutes.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
                {[
                  { credits: 10,  inr: 1000,  label: 'Starter' },
                  { credits: 25,  inr: 2500,  label: 'Popular', highlight: true },
                  { credits: 50,  inr: 5000,  label: 'Growth' },
                  { credits: 100, inr: 10000, label: 'Scale' },
                ].map(pack => (
                  <button key={pack.credits} onClick={() => requestTopUp(pack.credits)} style={{ background: pack.highlight ? '#7C3AED' : '#FAFAF8', border: pack.highlight ? '2px solid #7C3AED' : '1.5px solid rgba(26,26,46,0.12)', borderRadius: 12, padding: '16px 12px', cursor: 'pointer', textAlign: 'center', position: 'relative' }}>
                    {pack.highlight && <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: '#F97316', color: '#fff', fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 99, whiteSpace: 'nowrap' }}>POPULAR</div>}
                    <div style={{ fontSize: 24, fontWeight: 800, color: pack.highlight ? '#fff' : '#1A1A2E' }}>{pack.credits}</div>
                    <div style={{ fontSize: 12, color: pack.highlight ? 'rgba(255,255,255,0.8)' : '#8A8A9A' }}>credits</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: pack.highlight ? '#fff' : '#7C3AED' }}>₹{pack.inr.toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: 10, color: pack.highlight ? 'rgba(255,255,255,0.7)' : '#8A8A9A' }}>{pack.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function BookingCard({ booking: b, onConfirm, onDispute, submitting }: { booking: Booking; onConfirm: (id: string) => void; onDispute: (id: string, reason: string) => void; submitting: string | null }) {
  const [disputeReason, setDisputeReason] = useState('');
  const [showDispute,   setShowDispute]   = useState(false);
  const map: Record<string, [string, string, string]> = { frozen: ['rgba(124,58,237,0.1)','#7C3AED','💰 Funded'], delivered: ['rgba(16,185,129,0.1)','#059669','✓ Delivered'], released: ['rgba(16,185,129,0.1)','#059669','✅ Paid'], disputed: ['rgba(239,68,68,0.1)','#DC2626','⚠ Disputed'], pending: ['rgba(249,115,22,0.1)','#EA6B0A','Pending'], cancelled: ['rgba(156,163,175,0.1)','#6B7280','Cancelled'] };
  const [bg, color, label] = map[b.status] || map.pending;

  return (
    <div style={{ background: '#fff', border: '1.5px solid rgba(26,26,46,0.08)', borderRadius: 14, padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: b.status === 'delivered' ? 12 : 0 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1A2E' }}>{b.session_topic}</div>
          <div style={{ fontSize: 13, color: '#8A8A9A', marginTop: 2 }}>{b.mentor_name} · {b.session_date} · {b.duration_hours}h</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#1A1A2E' }}>{b.credits_total} cr</div>
          <span style={{ fontSize: 10, fontWeight: 700, fontFamily: 'monospace', background: bg, color, padding: '3px 8px', borderRadius: 99, display: 'inline-block', marginTop: 4 }}>{label}</span>
        </div>
      </div>

      {b.status === 'delivered' && (
        <div>
          <div style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 8, padding: '10px 14px', marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#7C3AED', marginBottom: 4 }}>⏳ Mentor marked this as delivered</div>
            {b.proof_link && <a href={b.proof_link} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#7C3AED' }}>View proof of work →</a>}
            <div style={{ fontSize: 11, color: '#8A8A9A', marginTop: 4 }}>Credits auto-release in 24 hours if no action.</div>
          </div>
          {!showDispute ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => onConfirm(b.id!)} disabled={submitting === b.id} style={{ flex: 1, background: '#10B981', color: '#fff', border: 'none', borderRadius: 8, padding: '10px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                {submitting === b.id ? '...' : '✓ Confirm & Release Payment'}
              </button>
              <button onClick={() => setShowDispute(true)} style={{ padding: '10px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#DC2626', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Dispute</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <textarea placeholder="Describe the issue..." value={disputeReason} onChange={e => setDisputeReason(e.target.value)} className="input" rows={2} style={{ resize: 'none', fontSize: 13 }} />
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => { if (disputeReason.trim()) onDispute(b.id!, disputeReason); }} style={{ flex: 1, background: '#DC2626', color: '#fff', border: 'none', borderRadius: 8, padding: '9px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Submit Dispute</button>
                <button onClick={() => setShowDispute(false)} style={{ padding: '9px 14px', background: 'transparent', border: '1px solid rgba(26,26,46,0.12)', borderRadius: 8, color: '#8A8A9A', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function EdtechDashboard() {
  return <Suspense><Inner /></Suspense>;
}