'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, DOMAINS, MentorProfile } from '@/lib/supabase';

const STEPS = ['Account', 'Profile', 'Rates', 'Preview'];

export default function MentorOnboard() {
  const router = useRouter();
  const [step, setStep]       = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [form, setForm] = useState({
    name: '', email: '', whatsapp: '',
    tagline: '', domain: DOMAINS[0],
    experience_years: 1, bio: '', demo_link: '',
    rate_per_hour: 20, response_time: '4 hours',
  });
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  async function handleSubmit() {
    setError(''); setLoading(true);
    try {
      const { data: existing } = await supabase.from('mentor_profiles').select('user_email').eq('user_email', form.email).single();
      if (existing) { setError('Account already exists with this email.'); setLoading(false); return; }
      const { error: dbErr } = await supabase.from('mentor_profiles').insert({
        user_email: form.email, name: form.name, tagline: form.tagline,
        domain: form.domain, experience_years: form.experience_years,
        bio: form.bio, demo_link: form.demo_link, whatsapp: form.whatsapp,
        rate_per_hour: form.rate_per_hour, response_time: form.response_time,
        wallet_credits: 0, is_active: true, is_verified: false,
      });
      if (dbErr) throw dbErr;
      const session = { name: form.name, email: form.email, role: 'mentor' };
      localStorage.setItem('jobr_session', JSON.stringify(session));
      localStorage.setItem('jobr_user', JSON.stringify(session));
      window.dispatchEvent(new Event('storage'));
      router.push('/mentor/dashboard');
    } catch (e: any) {
      setError(e.message || 'Something went wrong.');
    } finally { setLoading(false); }
  }

  return (
    <div style={{ background: '#FAFAF8', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <a href="/mentor" style={{ fontSize: 13, color: '#7C3AED', textDecoration: 'none', fontWeight: 500 }}>← Back to Mentor.Jobr</a>
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎓</div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1A1A2E' }}>Join as a Mentor</h1>
            <p style={{ fontSize: 14, color: '#8A8A9A', marginTop: 4 }}>Set up your profile and start earning</p>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 24 }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ flex: 1 }}>
                <div style={{ height: 4, borderRadius: 99, background: i <= step ? '#7C3AED' : '#E5E5E5', transition: 'background 0.3s' }} />
                <div style={{ fontSize: 10, fontWeight: 600, color: i <= step ? '#7C3AED' : '#8A8A9A', marginTop: 4, textAlign: 'center' }}>{s}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#fff', border: '1.5px solid rgba(26,26,46,0.10)', borderRadius: 16, padding: '28px 24px', boxShadow: '0 4px 24px rgba(26,26,46,0.06)' }}>

          {step === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1A1A2E' }}>Create your account</h2>
              {[
                { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Ravi Kumar' },
                { label: 'Email Address', key: 'email', type: 'email', placeholder: 'ravi@example.com' },
                { label: 'WhatsApp Number', key: 'whatsapp', type: 'tel', placeholder: '+91 98765 43210', hint: 'EdTechs will use this to connect' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: '#4A4A6A', display: 'block', marginBottom: 6 }}>{f.label}</label>
                  {f.hint && <p style={{ fontSize: 11, color: '#8A8A9A', marginBottom: 6 }}>{f.hint}</p>}
                  <input className="input" type={f.type} placeholder={f.placeholder} value={(form as any)[f.key]} onChange={e => set(f.key, e.target.value)} />
                </div>
              ))}
            </div>
          )}

          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1A1A2E' }}>Build your profile</h2>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#4A4A6A', display: 'block', marginBottom: 6 }}>Tagline</label>
                <input className="input" type="text" placeholder="Ex-Google PM | 6 years in AI products" value={form.tagline} onChange={e => set('tagline', e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#4A4A6A', display: 'block', marginBottom: 6 }}>Primary Domain</label>
                <select className="input" value={form.domain} onChange={e => set('domain', e.target.value)}>
                  {DOMAINS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#4A4A6A', display: 'block', marginBottom: 6 }}>Years of Experience</label>
                <input className="input" type="number" min={1} max={40} value={form.experience_years} onChange={e => set('experience_years', Number(e.target.value))} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#4A4A6A', display: 'block', marginBottom: 6 }}>Bio</label>
                <textarea className="input" rows={4} placeholder="Tell EdTechs what makes you the right mentor..." value={form.bio} onChange={e => set('bio', e.target.value)} style={{ resize: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#4A4A6A', display: 'block', marginBottom: 6 }}>Teaching Demo Link (optional)</label>
                <input className="input" type="url" placeholder="https://youtube.com/..." value={form.demo_link} onChange={e => set('demo_link', e.target.value)} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1A1A2E' }}>Set your rates</h2>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#4A4A6A', display: 'block', marginBottom: 4 }}>Rate per hour (Credits)</label>
                <p style={{ fontSize: 11, color: '#8A8A9A', marginBottom: 6 }}>1 credit = ₹100 · You keep 90% after platform fee</p>
                <input className="input" type="number" min={5} max={500} value={form.rate_per_hour} onChange={e => set('rate_per_hour', Number(e.target.value))} />
              </div>
              <div style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, fontFamily: 'monospace', color: '#7C3AED', letterSpacing: '0.08em', marginBottom: 10, textTransform: 'uppercase' }}>Earnings preview (1 hour)</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, textAlign: 'center' }}>
                  {[
                    { label: 'EdTech pays', value: `${form.rate_per_hour} cr`, sub: `₹${(form.rate_per_hour * 100).toLocaleString('en-IN')}` },
                    { label: 'Platform 10%', value: `${Math.round(form.rate_per_hour * 0.1)} cr`, sub: '' },
                    { label: 'You earn', value: `${Math.round(form.rate_per_hour * 0.9)} cr`, sub: `₹${(Math.round(form.rate_per_hour * 0.9) * 100).toLocaleString('en-IN')}` },
                  ].map(r => (
                    <div key={r.label}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#1A1A2E' }}>{r.value}</div>
                      {r.sub && <div style={{ fontSize: 10, color: '#8A8A9A' }}>{r.sub}</div>}
                      <div style={{ fontSize: 10, color: '#4A4A6A', fontWeight: 500, marginTop: 2 }}>{r.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#4A4A6A', display: 'block', marginBottom: 6 }}>Response Time</label>
                <select className="input" value={form.response_time} onChange={e => set('response_time', e.target.value)}>
                  {['1 hour','2 hours','4 hours','8 hours','24 hours'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1A1A2E' }}>Preview your profile</h2>
              <div style={{ background: '#FAFAF8', borderRadius: 12, padding: 20, border: '1.5px solid rgba(26,26,46,0.08)' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #F97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: '#fff' }}>
                    {form.name[0]?.toUpperCase() || 'M'}
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1A2E' }}>{form.name || 'Your Name'}</div>
                    <div style={{ fontSize: 12, color: '#8A8A9A' }}>{form.tagline || form.domain}</div>
                  </div>
                </div>
                {form.bio && <p style={{ fontSize: 13, color: '#4A4A6A', lineHeight: 1.5, marginBottom: 12 }}>{form.bio}</p>}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, background: 'rgba(124,58,237,0.08)', color: '#7C3AED', padding: '3px 8px', borderRadius: 99, fontWeight: 700, fontFamily: 'monospace' }}>{form.domain}</span>
                  <span style={{ fontSize: 11, background: '#F3F3F0', color: '#4A4A6A', padding: '3px 8px', borderRadius: 99 }}>{form.experience_years}y exp</span>
                  <span style={{ fontSize: 11, background: '#F3F3F0', color: '#4A4A6A', padding: '3px 8px', borderRadius: 99 }}>{form.rate_per_hour} cr/hr</span>
                </div>
              </div>
              {error && <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 10, fontSize: 13, color: '#DC2626' }}>{error}</div>}
              <div style={{ fontSize: 12, color: '#8A8A9A', lineHeight: 1.5, background: '#F3F3F0', borderRadius: 8, padding: '10px 14px' }}>
                ✓ Your profile will be reviewed within 24 hours before going live.
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1.5px solid rgba(26,26,46,0.12)', borderRadius: 10, fontSize: 14, fontWeight: 600, color: '#4A4A6A', cursor: 'pointer' }}>
                ← Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button onClick={() => {
                if (step === 0 && (!form.name || !form.email || !form.whatsapp)) { setError('Please fill all fields.'); return; }
                setError(''); setStep(s => s + 1);
              }} style={{ flex: 1, padding: '12px', background: '#7C3AED', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, color: '#fff', cursor: 'pointer', boxShadow: '0 2px 8px rgba(124,58,237,0.25)' }}>
                Continue →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading} style={{ flex: 1, padding: '12px', background: '#F97316', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '0 2px 8px rgba(249,115,22,0.3)' }}>
                {loading ? 'Creating profile...' : '🚀 Go Live as Mentor'}
              </button>
            )}
          </div>
          {error && step < 3 && <p style={{ textAlign: 'center', marginTop: 8, fontSize: 12, color: '#DC2626' }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}