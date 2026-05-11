'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, Booking, MentorProfile, creditsToINR } from '@/lib/supabase';

export default function MentorDashboard() {
  const router = useRouter();
  const [mentor,     setMentor]     = useState<MentorProfile | null>(null);
  const [bookings,   setBookings]   = useState<Booking[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [tab,        setTab]        = useState<'active'|'completed'|'wallet'>('active');
  const [proofLink,  setProofLink]  = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);

  useEffect(() => {
    const s = localStorage.getItem('jobr_session') || localStorage.getItem('jobr_user');
    if (!s) { router.push('/mentor/onboard'); return; }
    try {
      const p = JSON.parse(s);
      if (p.role !== 'mentor') { router.push('/mentor/onboard'); return; }
      loadData(p.email);
    } catch { router.push('/mentor/onboard'); }
  }, [router]);

  async function loadData(email: string) {
    const [{ data: m }, { data: b }] = await Promise.all([
      supabase.from('mentor_profiles').select('*').eq('user_email', email).single(),
      supabase.from('bookings').select('*').eq('mentor_email', email).order('created_at', { ascending: false }),
    ]);
    setMentor(m); setBookings(b || []); setLoading(false);
  }

  async function markDelivered(bookingId: string) {
    const link = proofLink[bookingId];
    if (!link) { alert('Please enter a proof link first.'); return; }
    setSubmitting(bookingId);
    const autoRelease = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    await supabase.from('bookings').update({ status: 'delivered', proof_link: link, auto_release_at: autoRelease, updated_at: new Date().toISOString() }).eq('id', bookingId);
    setSubmitting(null);
    loadData(mentor!.user_email);
  }

  async function requestWithdrawal() {
    if (!mentor) return;
    const waText = encodeURIComponent(`Hi Nitish, I'd like to withdraw my Mentor.Jobr earnings.\n\nEmail: ${mentor.user_email}\nCredits: ${mentor.wallet_credits}\nAmount: ₹${creditsToINR(mentor.wallet_credits || 0)}\n\nPlease process my payout. Thanks!`);
    window.open(`https://wa.me/919436781545?text=${waText}`, '_blank');
  }

  if (loading) return <Spinner />;
  if (!mentor) return null;

  const active    = bookings.filter(b => ['frozen','delivered'].includes(b.status));
  const completed = bookings.filter(b => ['released','disputed'].includes(b.status));
  const earned    = bookings.filter(b => b.status === 'released').reduce((s, b) => s + b.credits_mentor, 0);

  return (
    <div style={{ background: '#FAFAF8', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)', padding: '32px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, color: '#fff' }}>
              {mentor.name[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{mentor.name}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{mentor.domain} · {mentor.rate_per_hour} cr/hr</div>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' }}>WALLET</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>{mentor.wallet_credits || 0} <span style={{ fontSize: 13, fontWeight: 400 }}>credits</span></div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>≈ ₹{creditsToINR(mentor.wallet_credits || 0)}</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
            {[
              { label: 'Active Jobs',  value: active.length },
              { label: 'Completed',    value: completed.length },
              { label: 'Total Earned', value: `${earned} cr` },
              { label: 'Rating',       value: mentor.rating ? `${mentor.rating}★` : 'New' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'flex', gap: 0, borderBottom: '1.5px solid rgba(26,26,46,0.08)', marginBottom: 24 }}>
          {(['active','completed','wallet'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '10px 20px', fontSize: 13, fontWeight: 500, border: 'none', background: 'transparent', cursor: 'pointer', borderBottom: tab === t ? '2px solid #7C3AED' : '2px solid transparent', color: tab === t ? '#7C3AED' : '#8A8A9A', textTransform: 'capitalize', marginBottom: '-1.5px' }}>
              {t} {t === 'active' && active.length > 0 && <span style={{ background: '#7C3AED', color: '#fff', borderRadius: 99, padding: '1px 6px', fontSize: 10, marginLeft: 4 }}>{active.length}</span>}
            </button>
          ))}
        </div>

        {tab === 'active' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {active.length === 0 ? <Empty icon="📋" title="No active bookings" desc="When an EdTech books you, it will appear here." /> :
              active.map(b => (
                <div key={b.id} style={{ background: '#fff', border: '1.5px solid rgba(26,26,46,0.08)', borderRadius: 14, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1A2E' }}>{b.session_topic}</div>
                      <div style={{ fontSize: 13, color: '#8A8A9A', marginTop: 2 }}>{b.edtech_company} · {b.session_date} · {b.duration_hours}h</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#7C3AED' }}>{b.credits_mentor} cr</div>
                      <Badge status={b.status} />
                    </div>
                  </div>
                  {b.status === 'frozen' && (
                    <div>
                      <div style={{ fontSize: 12, color: '#4A4A6A', marginBottom: 6, fontWeight: 500 }}>💰 Credits secured. Complete the session then mark as delivered.</div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input type="url" placeholder="Proof link (recording, screenshot URL...)" value={proofLink[b.id!] || ''} onChange={e => setProofLink(p => ({ ...p, [b.id!]: e.target.value }))} className="input" style={{ flex: 1, fontSize: 13 }} />
                        <button onClick={() => markDelivered(b.id!)} disabled={submitting === b.id} style={{ background: '#10B981', color: '#fff', border: 'none', borderRadius: 8, padding: '0 16px', fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          {submitting === b.id ? '...' : 'Mark Delivered ✓'}
                        </button>
                      </div>
                    </div>
                  )}
                  {b.status === 'delivered' && (
                    <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#059669' }}>
                      ✓ Marked as delivered. Credits auto-release in 24 hours.
                      {b.proof_link && <a href={b.proof_link} target="_blank" rel="noreferrer" style={{ color: '#059669', marginLeft: 8 }}>View proof →</a>}
                    </div>
                  )}
                </div>
              ))
            }
          </div>
        )}

        {tab === 'completed' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {completed.length === 0 ? <Empty icon="✅" title="No completed sessions yet" desc="Completed sessions will appear here." /> :
              completed.map(b => (
                <div key={b.id} style={{ background: '#fff', border: '1.5px solid rgba(26,26,46,0.08)', borderRadius: 14, padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1A2E' }}>{b.session_topic}</div>
                    <div style={{ fontSize: 13, color: '#8A8A9A', marginTop: 2 }}>{b.edtech_company} · {b.session_date}</div>
                    {b.dispute_reason && <div style={{ fontSize: 12, color: '#DC2626', marginTop: 4 }}>Dispute: {b.dispute_reason}</div>}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: b.status === 'released' ? '#059669' : '#DC2626' }}>{b.credits_mentor} cr</div>
                    <Badge status={b.status} />
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {tab === 'wallet' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#fff', border: '1.5px solid rgba(124,58,237,0.15)', borderRadius: 14, padding: 24, textAlign: 'center', boxShadow: '0 4px 24px rgba(124,58,237,0.08)' }}>
              <div style={{ fontSize: 13, color: '#8A8A9A', fontFamily: 'monospace', marginBottom: 4 }}>AVAILABLE BALANCE</div>
              <div style={{ fontSize: 48, fontWeight: 800, color: '#7C3AED' }}>{mentor.wallet_credits || 0}</div>
              <div style={{ fontSize: 14, color: '#8A8A9A' }}>credits · ≈ ₹{creditsToINR(mentor.wallet_credits || 0)}</div>
              <button onClick={requestWithdrawal} style={{ marginTop: 20, background: '#F97316', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 32px', fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: '0 2px 8px rgba(249,115,22,0.3)' }}>
                💸 Request Withdrawal via WhatsApp
              </button>
              <div style={{ fontSize: 11, color: '#8A8A9A', marginTop: 10 }}>Payouts processed weekly via UPI/Bank transfer</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Badge({ status }: { status: string }) {
  const map: Record<string, [string, string, string]> = {
    frozen:    ['rgba(124,58,237,0.1)', '#7C3AED', '💰 Funded'],
    delivered: ['rgba(16,185,129,0.1)', '#059669', '✓ Delivered'],
    released:  ['rgba(16,185,129,0.1)', '#059669', '✅ Paid'],
    disputed:  ['rgba(239,68,68,0.1)',  '#DC2626', '⚠ Disputed'],
    pending:   ['rgba(249,115,22,0.1)', '#EA6B0A', 'Pending'],
    cancelled: ['rgba(156,163,175,0.1)','#6B7280', 'Cancelled'],
  };
  const [bg, color, label] = map[status] || map.pending;
  return <span style={{ fontSize: 10, fontWeight: 700, fontFamily: 'monospace', background: bg, color, padding: '3px 8px', borderRadius: 99, display: 'inline-block', marginTop: 4 }}>{label}</span>;
}

function Empty({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 24px', background: '#fff', borderRadius: 14, border: '1.5px solid rgba(26,26,46,0.08)' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1A2E', marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 14, color: '#8A8A9A' }}>{desc}</div>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAF8' }}>
      <div style={{ width: 32, height: 32, border: '3px solid rgba(124,58,237,0.2)', borderTop: '3px solid #7C3AED', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}