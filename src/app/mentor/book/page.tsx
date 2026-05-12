'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Shield, CheckCircle2, CreditCard, Smartphone, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

function BookingForm() {
  const params      = useSearchParams();
  const router      = useRouter();
  const mentorId    = params.get('mentor');
  const sessionName = params.get('session') || '';
  const sessionPrice = Number(params.get('price') || 0);

  const [mentor,       setMentor]       = useState<any>(null);
  const [loading,      setLoading]      = useState(true);
  const [submitting,   setSubmitting]   = useState(false);
  const [done,         setDone]         = useState(false);
  const [error,        setError]        = useState('');
  const [userEmail,    setUserEmail]    = useState('');
  const [userName,     setUserName]     = useState('');
  const [walletCredits, setWalletCredits] = useState(0);

  const [form, setForm] = useState({
    slot_date: '',
    slot_time: '',
    notes: '',
    paymentMethod: 'credits' as 'credits' | 'upi',
    upi_ref: '',
  });

  const platformFee  = Math.round(sessionPrice * 0.1);
  const total        = sessionPrice + platformFee;
  const creditsNeeded = Math.ceil(total / 100);

  useEffect(() => {
    const s = localStorage.getItem('jobr_session') || localStorage.getItem('jobr_user');
    if (!s) { router.push('/auth?redirect=' + encodeURIComponent(window.location.pathname + window.location.search)); return; }
    const parsed = JSON.parse(s);
    setUserEmail(parsed.email);
    setUserName(parsed.name || parsed.email?.split('@')[0] || '');
    loadData(parsed.email);
  }, []);

  const loadData = async (email: string) => {
    try {
      // Load mentor
      if (mentorId) {
        const { data: m } = await supabase.from('mentor_profiles').select('*').eq('id', mentorId).single();
        if (m) {
          setMentor({
            ...m,
            session_types: typeof m.session_types === 'string' ? JSON.parse(m.session_types || '[]') : m.session_types || [],
            availability:  typeof m.availability  === 'string' ? JSON.parse(m.availability  || '{}') : m.availability  || {},
          });
        }
      }

      // ── CRITICAL FIX: Read credits from user_profiles (single source of truth) ──
      const { data: up } = await supabase.from('user_profiles').select('wallet_credits').eq('email', email).single();
      if (up) {
        setWalletCredits(up.wallet_credits || 0);
      } else {
        // Fallback to edtech_profiles for edtech users
        const { data: ep } = await supabase.from('edtech_profiles').select('wallet_credits').eq('user_email', email).single();
        setWalletCredits(ep?.wallet_credits || 0);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!form.slot_date || !form.slot_time) { setError('Please select a date and time.'); return; }
    if (form.paymentMethod === 'upi' && !form.upi_ref) { setError('Please enter your UPI transaction reference.'); return; }
    if (form.paymentMethod === 'credits' && walletCredits < creditsNeeded) { setError(`Insufficient credits. You need ${creditsNeeded} but have ${walletCredits}.`); return; }

    setSubmitting(true); setError('');
    try {
      // Insert booking
      const { error: dbErr } = await supabase.from('bookings').insert({
        edtech_email:          userEmail,
        mentor_email:          mentor?.user_email || '',
        student_email:         userEmail,
        student_name:          userName,
        session_type:          sessionName,
        session_price_credits: creditsNeeded,
        payment_method:        form.paymentMethod,
        upi_ref:               form.upi_ref || null,
        slot_date:             form.slot_date,
        slot_time:             form.slot_time,
        completion_notes:      form.notes,
        status:                'pending_confirmation',
        credits_held:          creditsNeeded,
        mentor_id:             mentorId,
      });
      if (dbErr) throw dbErr;

      // Deduct credits if paying with credits
      if (form.paymentMethod === 'credits') {
        const newBalance = walletCredits - creditsNeeded;
        await supabase.from('user_profiles')
          .update({ wallet_credits: newBalance, updated_at: new Date().toISOString() })
          .eq('email', userEmail);

        await supabase.from('credit_transactions').insert({
          user_email: userEmail,
          type:       'booking',
          credits:    creditsNeeded,
          note:       `Booking: ${sessionName} with ${mentor?.name || 'mentor'}`,
          created_by: 'system',
        });
        setWalletCredits(newBalance);
      }

      // WhatsApp notify admin
      const waText = encodeURIComponent(
        `📅 New Booking Request!\n\nMentor: ${mentor?.name}\nSession: ${sessionName}\nStudent: ${userName} (${userEmail})\nDate: ${form.slot_date} at ${form.slot_time}\nAmount: ₹${total}\nPayment: ${form.paymentMethod.toUpperCase()}\n\nApprove at: jobr.co.in/admin`
      );
      window.open(`https://wa.me/919436781545?text=${waText}`, '_blank');
      setDone(true);
    } catch (e: any) { setError(e.message || 'Booking failed. Please try again.'); }
    finally { setSubmitting(false); }
  };

  if (loading) return (
    <div style={{ background: '#1C1C2E', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 36, height: 36, border: '3px solid rgba(79,70,229,0.3)', borderTopColor: '#4F46E5', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style jsx global>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (done) return (
    <div style={{ background: '#1C1C2E', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ maxWidth: 480, width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(79,70,229,0.25)', borderRadius: 24, padding: 36, textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(79,70,229,0.15)', border: '2px solid rgba(79,70,229,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <CheckCircle2 size={32} color="#4F46E5" />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 900, color: '#F1F0FF', marginBottom: 10 }}>Booking Requested!</h2>
        <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.65, marginBottom: 24 }}>
          Your request has been sent to {mentor?.name}. Once confirmed, you'll receive the meeting link. Payment is held in escrow until session completion.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/profile" style={{ background: 'linear-gradient(135deg, #4F46E5, #4338CA)', color: '#fff', textDecoration: 'none', padding: '11px 24px', borderRadius: 100, fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-display)' }}>
            View in Profile →
          </a>
          <a href="/mentor" style={{ background: 'rgba(255,255,255,0.06)', color: '#94A3B8', textDecoration: 'none', padding: '11px 20px', borderRadius: 100, fontWeight: 600, fontSize: 14, border: '1px solid rgba(255,255,255,0.1)' }}>
            Back to Directory
          </a>
        </div>
      </div>
      <style jsx global>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ background: '#1C1C2E', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#4F46E5', fontFamily: 'monospace', marginBottom: 6 }}>BOOKING</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 900, color: '#F1F0FF', marginBottom: 4 }}>Book a Session</h1>
          <div style={{ fontSize: 14, color: '#94A3B8' }}>with {mentor?.name} {mentor?.is_verified && <span style={{ fontSize: 12, color: '#4F46E5', marginLeft: 6 }}>✓ Verified</span>}</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Selected session */}
            <div style={{ padding: '14px 18px', background: 'rgba(79,70,229,0.07)', border: '1px solid rgba(79,70,229,0.2)', borderRadius: 14 }}>
              <div style={{ fontSize: 11, color: '#4F46E5', fontFamily: 'monospace', marginBottom: 4 }}>SELECTED SESSION</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#F1F0FF', fontFamily: 'var(--font-display)' }}>{sessionName}</span>
                <span style={{ fontSize: 18, fontWeight: 900, color: '#4F46E5', fontFamily: 'var(--font-display)' }}>₹{sessionPrice}</span>
              </div>
            </div>

            {/* Schedule */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 18 }}>
              <div style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace', marginBottom: 12 }}>PREFERRED SCHEDULE</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 11, color: '#475569', display: 'block', marginBottom: 5 }}>DATE</label>
                  <input type="date" className="input" value={form.slot_date} onChange={e => setForm(f => ({ ...f, slot_date: e.target.value }))} style={{ fontSize: 13 }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#475569', display: 'block', marginBottom: 5 }}>TIME</label>
                  <input type="time" className="input" value={form.slot_time} onChange={e => setForm(f => ({ ...f, slot_time: e.target.value }))} style={{ fontSize: 13 }} />
                </div>
              </div>
              {mentor?.availability?.slots?.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ fontSize: 10, color: '#334155', marginBottom: 6, fontFamily: 'monospace' }}>MENTOR'S AVAILABLE SLOTS — click to use</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {mentor.availability.slots.map((s: any, i: number) => (
                      <button key={i} onClick={() => setForm(f => ({ ...f, slot_time: s.from }))} style={{ padding: '4px 10px', background: 'rgba(79,70,229,0.08)', border: '1px solid rgba(79,70,229,0.15)', borderRadius: 100, fontSize: 11, color: '#4F46E5', cursor: 'pointer' }}>
                        {s.day} {s.from}–{s.to}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace', display: 'block', marginBottom: 6 }}>WHAT DO YOU NEED HELP WITH?</label>
              <textarea className="input" placeholder="Describe what you want to cover..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} style={{ height: 80, resize: 'none', fontSize: 13 }} />
            </div>

            {/* Payment */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 18 }}>
              <div style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace', marginBottom: 12 }}>PAYMENT METHOD</div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                {[
                  { id: 'credits', label: 'Jobr Credits', icon: CreditCard, desc: `You have ${walletCredits} credits` },
                  { id: 'upi',     label: 'UPI / Direct', icon: Smartphone, desc: 'Pay and share ref'              },
                ].map(method => (
                  <button key={method.id} onClick={() => setForm(f => ({ ...f, paymentMethod: method.id as any }))} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5, padding: '12px 14px', background: form.paymentMethod === method.id ? 'rgba(79,70,229,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${form.paymentMethod === method.id ? 'rgba(79,70,229,0.35)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 12, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                    <method.icon size={16} color={form.paymentMethod === method.id ? '#4F46E5' : '#475569'} />
                    <div style={{ fontSize: 13, fontWeight: 700, color: form.paymentMethod === method.id ? '#4F46E5' : '#94A3B8', fontFamily: 'var(--font-display)' }}>{method.label}</div>
                    <div style={{ fontSize: 11, color: '#475569' }}>{method.desc}</div>
                  </button>
                ))}
              </div>

              {form.paymentMethod === 'credits' && walletCredits < creditsNeeded && (
                <div style={{ padding: '10px 14px', background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 10, fontSize: 13, color: '#F97316', marginBottom: 10 }}>
                  ⚠ You need {creditsNeeded} credits but have {walletCredits}.{' '}
                  <a href={`https://wa.me/919436781545?text=${encodeURIComponent(`Hi! I'd like to top up my Jobr credits.\nEmail: ${userEmail}`)}`} target="_blank" rel="noreferrer" style={{ color: '#F97316', fontWeight: 700 }}>
                    Request top-up →
                  </a>
                </div>
              )}

              {form.paymentMethod === 'upi' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10 }}>
                    <div style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace', marginBottom: 4 }}>PAY TO UPI ID</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#4F46E5', fontFamily: 'monospace' }}>jobr@ybl</div>
                    <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>Amount: ₹{total}</div>
                  </div>
                  <input className="input" placeholder="Enter UPI transaction reference ID" value={form.upi_ref} onChange={e => setForm(f => ({ ...f, upi_ref: e.target.value }))} style={{ fontSize: 13 }} />
                </div>
              )}
            </div>

            {error && <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, fontSize: 13, color: '#EF4444' }}>{error}</div>}

            <button
              onClick={handleSubmit}
              disabled={submitting || !form.slot_date || !form.slot_time || (form.paymentMethod === 'upi' && !form.upi_ref) || (form.paymentMethod === 'credits' && walletCredits < creditsNeeded)}
              style={{ background: 'linear-gradient(135deg, #4F46E5, #4338CA)', color: '#fff', border: 'none', borderRadius: 100, padding: '14px', fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'var(--font-display)', boxShadow: '0 4px 16px rgba(79,70,229,0.4)', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Sending Request...</> : <>🔒 Confirm Booking — ₹{total}</>}
            </button>
          </div>

          {/* Right — Order summary */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20, position: 'sticky', top: 80 }}>
            <div style={{ fontSize: 11, color: '#4F46E5', fontFamily: 'monospace', marginBottom: 14 }}>ORDER SUMMARY</div>
            {[['Session fee', `₹${sessionPrice}`], ['Platform fee (10%)', `₹${platformFee}`]].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: '#64748B' }}>{k}</span>
                <span style={{ fontSize: 13, color: '#94A3B8' }}>{v}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10, marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#F1F0FF' }}>Total</span>
              <span style={{ fontSize: 18, fontWeight: 900, color: '#4F46E5', fontFamily: 'var(--font-display)' }}>₹{total}</span>
            </div>
            {form.paymentMethod === 'credits' && (
              <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(79,70,229,0.07)', border: '1px solid rgba(79,70,229,0.12)', borderRadius: 8, fontSize: 12, color: '#4F46E5' }}>
                = {creditsNeeded} credits · Your balance: {walletCredits} cr
              </div>
            )}
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <Shield size={13} color="#4F46E5" style={{ flexShrink: 0, marginTop: 2 }} />
              <span style={{ fontSize: 11, color: '#475569', lineHeight: 1.5 }}>Jobr Escrow. Payment released only after you confirm session completion.</span>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function BookPage() {
  return <Suspense fallback={<div style={{ background: '#1C1C2E', minHeight: '100vh' }} />}><BookingForm /></Suspense>;
}