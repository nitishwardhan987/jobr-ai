'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, CheckCircle2, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const DOMAINS = ['Software Engineering','Product Management','Data Science','Design','Finance','Marketing','Other'];
const DEFAULT_SESSION_TYPES = [
  { name: 'Assignment Help',  price: 400, enabled: false },
  { name: 'Career Guidance',  price: 800, enabled: false },
  { name: 'Mock Interview',   price: 700, enabled: false },
  { name: 'Project Review',   price: 600, enabled: false },
  { name: 'Resume Review',    price: 500, enabled: false },
  { name: 'Doubt Solving',    price: 300, enabled: false },
];
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export default function MentorOnboard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '', email: '', bio: '', domain: '',
    mentor_role: '', current_company: '',
    years_experience: 1, linkedin_url: '',
    photo_url: '', meet_link: '',
  });

  const [sessionTypes, setSessionTypes] = useState(DEFAULT_SESSION_TYPES.map(s => ({ ...s })));
  const [customSession, setCustomSession] = useState({ name: '', price: 0 });

  const [availMode, setAvailMode] = useState<'slots' | 'request' | 'both'>('slots');
  const [slots, setSlots] = useState<{ day: string; from: string; to: string }[]>([
    { day: 'Mon', from: '18:00', to: '20:00' }
  ]);

  const TOTAL_STEPS = 4;

  const updateForm = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const toggleSession = (i: number) => setSessionTypes(s => s.map((t, j) => j === i ? { ...t, enabled: !t.enabled } : t));
  const updatePrice = (i: number, price: number) => setSessionTypes(s => s.map((t, j) => j === i ? { ...t, price } : t));

  const addSlot = () => setSlots(s => [...s, { day: 'Mon', from: '18:00', to: '20:00' }]);
  const removeSlot = (i: number) => setSlots(s => s.filter((_, j) => j !== i));
  const updateSlot = (i: number, k: string, v: string) => setSlots(s => s.map((t, j) => j === i ? { ...t, [k]: v } : t));

  const addCustomSession = () => {
    if (!customSession.name || !customSession.price) return;
    setSessionTypes(s => [...s, { name: customSession.name, price: customSession.price, enabled: true }]);
    setCustomSession({ name: '', price: 0 });
  };

  const canProceed = () => {
    if (step === 1) return form.name && form.email && form.bio && form.domain && form.mentor_role && form.current_company;
    if (step === 2) return sessionTypes.some(s => s.enabled);
    if (step === 3) return availMode === 'request' || slots.length > 0;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true); setError('');
    try {
      const payload = {
        user_email: form.email,
        name: form.name,
        bio: form.bio,
        domain: form.domain,
        mentor_role: form.mentor_role,
        current_company: form.current_company,
        years_experience: form.years_experience,
        linkedin_url: form.linkedin_url,
        photo_url: form.photo_url,
        meet_link: form.meet_link,
        session_types: sessionTypes.filter(s => s.enabled).map(s => ({ name: s.name, price: s.price })),
        availability_mode: availMode,
        availability: availMode !== 'request' ? { slots } : {},
        is_active: true,
        is_verified: false,
        rating: 0,
        total_sessions: 0,
        wallet_credits: 0,
        total_earned: 0,
      };
      const { error: dbErr } = await supabase.from('mentor_profiles').upsert(payload, { onConflict: 'user_email' });
      if (dbErr) throw dbErr;

      // WhatsApp notification to admin
      const waText = encodeURIComponent(`🎓 New Mentor Onboarded on Jobr!\n\nName: ${form.name}\nEmail: ${form.email}\nDomain: ${form.domain}\nRole: ${form.mentor_role} @ ${form.current_company}\n\nReview at: jobr.co.in/admin`);
      window.open(`https://wa.me/919436781545?text=${waText}`, '_blank');

      setStep(5); // success
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  const inputStyle = { fontSize: 14, padding: '11px 14px' };

  return (
    <div style={{ background: '#1C1C2E', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 580 }}>

        {/* Progress */}
        {step < 5 && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: '#475569', fontFamily: 'monospace' }}>Step {step} of {TOTAL_STEPS}</span>
              <span style={{ fontSize: 12, color: '#0D9488', fontFamily: 'monospace' }}>{Math.round((step/TOTAL_STEPS)*100)}%</span>
            </div>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99 }}>
              <div style={{ height: '100%', width: `${(step/TOTAL_STEPS)*100}%`, background: 'linear-gradient(90deg, #0D9488, #06B6D4)', borderRadius: 99, transition: 'width 0.4s' }} />
            </div>
          </div>
        )}

        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: 'clamp(24px,4vw,36px)' }}>

          {/* STEP 1 — Profile */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#0D9488', fontFamily: 'monospace', marginBottom: 6 }}>STEP 1 — YOUR PROFILE</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 900, color: '#F1F0FF', marginBottom: 4 }}>Tell us about yourself</h2>
                <p style={{ fontSize: 13, color: '#64748B' }}>This is what students see when they browse mentors.</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace', display: 'block', marginBottom: 5 }}>FULL NAME *</label>
                  <input className="input" placeholder="Priya Sharma" value={form.name} onChange={e => updateForm('name', e.target.value)} style={inputStyle} />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace', display: 'block', marginBottom: 5 }}>EMAIL *</label>
                  <input className="input" type="email" placeholder="you@email.com" value={form.email} onChange={e => updateForm('email', e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace', display: 'block', marginBottom: 5 }}>CURRENT ROLE *</label>
                  <input className="input" placeholder="Senior PM" value={form.mentor_role} onChange={e => updateForm('mentor_role', e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace', display: 'block', marginBottom: 5 }}>COMPANY *</label>
                  <input className="input" placeholder="Google" value={form.current_company} onChange={e => updateForm('current_company', e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace', display: 'block', marginBottom: 5 }}>DOMAIN *</label>
                  <select className="input" value={form.domain} onChange={e => updateForm('domain', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="">Select domain</option>
                    {DOMAINS.map(d => <option key={d} value={d} style={{ background: '#1C1C2E' }}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace', display: 'block', marginBottom: 5 }}>YEARS OF EXPERIENCE *</label>
                  <input className="input" type="number" min={1} max={40} value={form.years_experience} onChange={e => updateForm('years_experience', Number(e.target.value))} style={inputStyle} />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace', display: 'block', marginBottom: 5 }}>BIO * <span style={{ color: '#334155' }}>(3-4 lines — what makes you the right mentor?)</span></label>
                  <textarea className="input" placeholder="Ex-Google PM with 8 years experience. IIM-A alumna. Helped 100+ students crack PM roles at top startups..." value={form.bio} onChange={e => updateForm('bio', e.target.value)} style={{ ...inputStyle, height: 100, resize: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace', display: 'block', marginBottom: 5 }}>LINKEDIN URL</label>
                  <input className="input" placeholder="linkedin.com/in/..." value={form.linkedin_url} onChange={e => updateForm('linkedin_url', e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace', display: 'block', marginBottom: 5 }}>PHOTO URL (optional)</label>
                  <input className="input" placeholder="https://..." value={form.photo_url} onChange={e => updateForm('photo_url', e.target.value)} style={inputStyle} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — Session types + rates */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#0D9488', fontFamily: 'monospace', marginBottom: 6 }}>STEP 2 — SESSION TYPES & RATES</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 900, color: '#F1F0FF', marginBottom: 4 }}>What do you offer?</h2>
                <p style={{ fontSize: 13, color: '#64748B' }}>Select session types and set your own price for each. You're in full control.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {sessionTypes.map((s, i) => (
                  <div key={s.name} onClick={() => toggleSession(i)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: s.enabled ? 'rgba(13,148,136,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${s.enabled ? 'rgba(13,148,136,0.3)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 12, cursor: 'pointer', transition: 'all 0.15s' }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: s.enabled ? '#0D9488' : 'rgba(255,255,255,0.08)', border: `2px solid ${s.enabled ? '#0D9488' : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                      {s.enabled && <CheckCircle2 size={11} color="#fff" />}
                    </div>
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: s.enabled ? '#F1F0FF' : '#64748B', fontFamily: 'var(--font-display)' }}>{s.name}</span>
                    <div onClick={e => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: 13, color: '#475569' }}>₹</span>
                      <input type="number" value={s.price} onChange={e => updatePrice(i, Number(e.target.value))} onClick={e => { e.stopPropagation(); if (!s.enabled) toggleSession(i); }} style={{ width: 70, padding: '5px 8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#F1F0FF', fontSize: 13, outline: 'none', textAlign: 'right' }} />
                      <span style={{ fontSize: 11, color: '#334155' }}>/ session</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Custom session */}
              <div style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 12 }}>
                <div style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace', marginBottom: 8 }}>ADD CUSTOM SESSION TYPE</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input className="input" placeholder="Session name" value={customSession.name} onChange={e => setCustomSession(c => ({ ...c, name: e.target.value }))} style={{ flex: 1, fontSize: 13 }} />
                  <input type="number" className="input" placeholder="₹price" value={customSession.price || ''} onChange={e => setCustomSession(c => ({ ...c, price: Number(e.target.value) }))} style={{ width: 90, fontSize: 13 }} />
                  <button onClick={addCustomSession} style={{ background: '#0D9488', color: '#fff', border: 'none', borderRadius: 8, padding: '0 14px', fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>+ Add</button>
                </div>
              </div>

              <div style={{ padding: '10px 14px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 10, fontSize: 12, color: '#F59E0B', lineHeight: 1.5 }}>
                💡 Tip: You can always update your rates later from your dashboard.
              </div>
            </div>
          )}

          {/* STEP 3 — Availability */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#0D9488', fontFamily: 'monospace', marginBottom: 6 }}>STEP 3 — AVAILABILITY</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 900, color: '#F1F0FF', marginBottom: 4 }}>When are you available?</h2>
                <p style={{ fontSize: 13, color: '#64748B' }}>Set your preferred schedule. Students book within your available slots.</p>
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[
                  { id: 'slots', label: 'Fixed Weekly Slots', desc: 'Set recurring available times' },
                  { id: 'request', label: 'On Request Only', desc: 'Students request, you respond' },
                  { id: 'both', label: 'Both', desc: 'Slots + accept requests' },
                ].map(m => (
                  <button key={m.id} onClick={() => setAvailMode(m.id as any)} style={{ flex: 1, minWidth: 140, padding: '12px 14px', background: availMode === m.id ? 'rgba(13,148,136,0.1)' : 'rgba(255,255,255,0.02)', border: `1px solid ${availMode === m.id ? 'rgba(13,148,136,0.35)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 12, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: availMode === m.id ? '#0D9488' : '#94A3B8', fontFamily: 'var(--font-display)', marginBottom: 2 }}>{m.label}</div>
                    <div style={{ fontSize: 11, color: '#475569' }}>{m.desc}</div>
                  </button>
                ))}
              </div>

              {(availMode === 'slots' || availMode === 'both') && (
                <div>
                  <div style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace', marginBottom: 10 }}>WEEKLY SLOTS</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {slots.map((slot, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <select value={slot.day} onChange={e => updateSlot(i, 'day', e.target.value)} className="input" style={{ width: 80, fontSize: 13, padding: '9px 10px' }}>
                          {DAYS.map(d => <option key={d} value={d} style={{ background: '#1C1C2E' }}>{d}</option>)}
                        </select>
                        <input type="time" value={slot.from} onChange={e => updateSlot(i, 'from', e.target.value)} className="input" style={{ flex: 1, fontSize: 13 }} />
                        <span style={{ color: '#475569', fontSize: 13 }}>to</span>
                        <input type="time" value={slot.to} onChange={e => updateSlot(i, 'to', e.target.value)} className="input" style={{ flex: 1, fontSize: 13 }} />
                        <button onClick={() => removeSlot(i)} style={{ width: 30, height: 30, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 7, color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                    <button onClick={addSlot} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(13,148,136,0.08)', border: '1px dashed rgba(13,148,136,0.25)', borderRadius: 10, padding: '9px 14px', color: '#0D9488', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                      <Plus size={13} /> Add another slot
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4 — Meeting link */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#0D9488', fontFamily: 'monospace', marginBottom: 6 }}>STEP 4 — MEETING SETUP</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 900, color: '#F1F0FF', marginBottom: 4 }}>Where will sessions happen?</h2>
                <p style={{ fontSize: 13, color: '#64748B' }}>Your meeting link is shared with students only after you confirm a booking.</p>
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace', display: 'block', marginBottom: 5 }}>ZOOM / MEET / TEAMS LINK</label>
                <input className="input" placeholder="https://zoom.us/j/..." value={form.meet_link} onChange={e => updateForm('meet_link', e.target.value)} style={inputStyle} />
                <div style={{ fontSize: 11, color: '#334155', marginTop: 6 }}>You can use a personal meeting room link — it's never shown publicly.</div>
              </div>
              <div style={{ padding: 16, background: 'rgba(13,148,136,0.06)', border: '1px solid rgba(13,148,136,0.15)', borderRadius: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#0D9488', fontFamily: 'monospace', marginBottom: 10 }}>YOUR PROFILE PREVIEW</div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #0D9488, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: '#fff', flexShrink: 0 }}>{form.name[0] || '?'}</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#F1F0FF', fontFamily: 'var(--font-display)' }}>{form.name || 'Your Name'}</div>
                    <div style={{ fontSize: 12, color: '#64748B' }}>{form.mentor_role} · {form.current_company}</div>
                    <div style={{ fontSize: 12, color: '#0D9488', marginTop: 4 }}>{form.domain} · {form.years_experience}y exp</div>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.5, margin: '10px 0 0' }}>{form.bio?.slice(0, 120) || 'Your bio...'}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                  {sessionTypes.filter(s => s.enabled).map(s => (
                    <span key={s.name} style={{ fontSize: 11, color: '#0D9488', background: 'rgba(13,148,136,0.1)', border: '1px solid rgba(13,148,136,0.2)', padding: '3px 9px', borderRadius: 100 }}>{s.name} · ₹{s.price}</span>
                  ))}
                </div>
              </div>
              {error && <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, fontSize: 13, color: '#EF4444' }}>{error}</div>}
            </div>
          )}

          {/* SUCCESS */}
          {step === 5 && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(13,148,136,0.15)', border: '2px solid rgba(13,148,136,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <CheckCircle2 size={32} color="#0D9488" />
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 900, color: '#F1F0FF', marginBottom: 10 }}>You're live on Mentor.Jobr!</h2>
              <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.65, marginBottom: 28 }}>
                Your profile is now visible to students and edtech companies. We'll notify you on WhatsApp when you get your first booking request.
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="/mentor" style={{ background: 'linear-gradient(135deg, #0D9488, #0891B2)', color: '#fff', textDecoration: 'none', padding: '12px 28px', borderRadius: 100, fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-display)' }}>View Directory →</a>
                <a href="/mentor/dashboard" style={{ background: 'rgba(255,255,255,0.06)', color: '#94A3B8', textDecoration: 'none', padding: '12px 22px', borderRadius: 100, fontWeight: 600, fontSize: 14, border: '1px solid rgba(255,255,255,0.1)' }}>My Dashboard</a>
              </div>
            </div>
          )}

          {/* Nav buttons */}
          {step < 5 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, gap: 10 }}>
              {step > 1 ? (
                <button onClick={() => setStep(s => s - 1)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#94A3B8', padding: '11px 20px', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  <ArrowLeft size={14} /> Back
                </button>
              ) : <div />}
              {step < 4 ? (
                <button onClick={() => setStep(s => s + 1)} disabled={!canProceed()} style={{ display: 'flex', alignItems: 'center', gap: 6, background: canProceed() ? 'linear-gradient(135deg, #0D9488, #0891B2)' : 'rgba(255,255,255,0.06)', color: '#fff', border: 'none', padding: '11px 24px', borderRadius: 100, fontSize: 13, fontWeight: 700, cursor: canProceed() ? 'pointer' : 'not-allowed', opacity: canProceed() ? 1 : 0.5, fontFamily: 'var(--font-display)', boxShadow: canProceed() ? '0 3px 12px rgba(13,148,136,0.4)' : 'none' }}>
                  Continue <ArrowRight size={14} />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg, #0D9488, #0891B2)', color: '#fff', border: 'none', padding: '11px 28px', borderRadius: 100, fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'var(--font-display)' }}>
                  {loading ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Publishing...</> : <>🚀 Go Live!</>}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}