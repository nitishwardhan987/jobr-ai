'use client';
import { useState } from 'react';
import { Mail, MessageCircle, MapPin, Clock, Send, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ContactPage() {
  const [form,      setForm]      = useState({ name: '', email: '', subject: '', message: '' });
  const [loading,   setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error,     setError]     = useState('');

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) { setError('Please fill in all required fields.'); return; }
    setLoading(true); setError('');
    try {
      await supabase.from('bug_reports').insert({
        type: 'other', title: form.subject || 'Contact form submission',
        description: `From: ${form.name} (${form.email})\n\n${form.message}`,
        user_email: form.email, user_name: form.name, status: 'open', priority: 'medium',
      });
      const waText = encodeURIComponent(`📩 New Contact Form on Jobr!\n\nFrom: ${form.name} (${form.email})\nSubject: ${form.subject || 'General'}\n\nMessage:\n${form.message}`);
      window.open(`https://wa.me/919436781545?text=${waText}`, '_blank');
      setSubmitted(true);
    } catch { setError('Failed to send. Email us directly at nitish@jobr.co.in'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ background: '#F8F5F0', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(145deg, rgba(249,115,22,0.06) 0%, transparent 60%)', borderBottom: '1px solid #E7E5E4', padding: 'clamp(80px,10vw,120px) 24px clamp(40px,5vw,64px)', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 100, padding: '5px 14px', marginBottom: 20 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#EA580C', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Contact Us</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,5vw,52px)', fontWeight: 900, color: '#18181B', letterSpacing: '-0.04em', marginBottom: 14, lineHeight: 1.0 }}>Get in Touch</h1>
          <p style={{ fontSize: 16, color: '#71717A', lineHeight: 1.7 }}>Questions, partnerships, disputes, or just want to say hi — we respond to everything.</p>
        </div>
      </div>

      <div style={{ maxWidth: 1040, margin: '0 auto', padding: 'clamp(40px,5vw,72px) 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,300px), 1fr))', gap: 32, alignItems: 'start' }}>

        {/* Left — Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: '#18181B', marginBottom: 4, letterSpacing: '-0.03em' }}>Contact Details</h2>

          {[
            { icon: Mail,           label: 'Email',          value: 'nitish@jobr.co.in',              href: 'mailto:nitish@jobr.co.in',          color: '#F97316' },
            { icon: MessageCircle,  label: 'WhatsApp',       value: '+91 94367 81545',                href: 'https://wa.me/919436781545',        color: '#16A34A' },
            { icon: MapPin,         label: 'Location',       value: 'Bangalore, Karnataka, India',    href: null,                                color: '#2563EB' },
            { icon: Clock,          label: 'Response Time',  value: 'Within 24 hours on working days',href: null,                                color: '#7C3AED' },
          ].map(c => (
            <div key={c.label} style={{ display: 'flex', gap: 14, padding: '14px 16px', background: '#FFFFFF', border: '1px solid #E7E5E4', borderRadius: 14 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `${c.color}10`, border: `1px solid ${c.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <c.icon size={16} color={c.color} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#A1A1AA', fontFamily: 'var(--font-mono)', marginBottom: 3, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{c.label}</div>
                {c.href ? (
                  <a href={c.href} target="_blank" rel="noreferrer" style={{ fontSize: 14, fontWeight: 600, color: c.color, textDecoration: 'none' }}>{c.value}</a>
                ) : (
                  <div style={{ fontSize: 14, color: '#52525B' }}>{c.value}</div>
                )}
              </div>
            </div>
          ))}

          {/* Common topics */}
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#A1A1AA', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Common Topics</div>
            {[
              { subject: 'Partnership inquiry',  href: 'mailto:nitish@jobr.co.in?subject=Partnership%20Inquiry' },
              { subject: 'EdTech onboarding',    href: 'mailto:nitish@jobr.co.in?subject=EdTech%20Onboarding'  },
              { subject: 'Mentor withdrawal',    href: 'mailto:nitish@jobr.co.in?subject=Withdrawal%20Request' },
              { subject: 'Dispute resolution',   href: 'mailto:nitish@jobr.co.in?subject=Dispute%20Resolution' },
              { subject: 'Press and media',      href: 'mailto:nitish@jobr.co.in?subject=Press%20Inquiry'      },
            ].map(t => (
              <a key={t.subject} href={t.href} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, color: '#52525B', textDecoration: 'none', marginBottom: 6, padding: '9px 14px', background: '#FFFFFF', border: '1px solid #E7E5E4', borderRadius: 10, transition: 'all 0.15s', fontFamily: 'var(--font-body)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#FED7AA'; (e.currentTarget as HTMLElement).style.color = '#18181B'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E7E5E4'; (e.currentTarget as HTMLElement).style.color = '#52525B'; }}>
                {t.subject}
                <ArrowRight size={12} color="#A1A1AA" />
              </a>
            ))}
          </div>
        </div>

        {/* Right — Form */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E7E5E4', borderRadius: 24, padding: 28, boxShadow: '0 4px 24px rgba(24,24,27,0.06)' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#F0FDF4', border: '2px solid #BBF7D0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <CheckCircle2 size={28} color="#16A34A" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: '#18181B', marginBottom: 8, letterSpacing: '-0.03em' }}>Message Sent!</h3>
              <p style={{ fontSize: 14, color: '#71717A', lineHeight: 1.65 }}>Nitish has been notified on WhatsApp. We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: '#18181B', marginBottom: 4, letterSpacing: '-0.03em' }}>Send a Message</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { key: 'name',  label: 'NAME *',   placeholder: 'Your name',    type: 'text'  },
                  { key: 'email', label: 'EMAIL *',   placeholder: 'you@email.com', type: 'email' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: 10, color: '#A1A1AA', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 5, letterSpacing: '0.08em' }}>{f.label}</label>
                    <input className="input" type={f.type} placeholder={f.placeholder} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={{ fontSize: 13 }} />
                  </div>
                ))}
              </div>
              <div>
                <label style={{ fontSize: 10, color: '#A1A1AA', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 5, letterSpacing: '0.08em' }}>SUBJECT</label>
                <input className="input" placeholder="What's this about?" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} style={{ fontSize: 13 }} />
              </div>
              <div>
                <label style={{ fontSize: 10, color: '#A1A1AA', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 5, letterSpacing: '0.08em' }}>MESSAGE *</label>
                <textarea className="input" placeholder="Tell us how we can help..." value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} style={{ height: 120, resize: 'none', fontSize: 13 }} />
              </div>
              {error && (
                <div style={{ padding: '9px 12px', background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: 8, fontSize: 12, color: '#DC2626' }}>{error}</div>
              )}
              <button onClick={handleSubmit} disabled={loading} style={{
                background: '#F97316', color: '#fff', border: 'none', borderRadius: 100,
                padding: '13px', fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-display)',
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 4px 16px rgba(249,115,22,0.28)', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = '#EA580C'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#F97316'; }}>
                {loading ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Sending...</> : <><Send size={15} /> Send Message</>}
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
