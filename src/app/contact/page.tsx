'use client';
import { useState } from 'react';
import { Mail, MessageCircle, MapPin, Clock, Send, Loader2, CheckCircle2 } from 'lucide-react';
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
      const waText = encodeURIComponent(`📩 New Contact Form Submission on Jobr!\n\nFrom: ${form.name} (${form.email})\nSubject: ${form.subject || 'General'}\n\nMessage:\n${form.message}`);
      window.open(`https://wa.me/919436781545?text=${waText}`, '_blank');
      setSubmitted(true);
    } catch (e: any) { setError('Failed to send. Email us directly at nitish@jobr.co.in'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ background: '#1C1C2E', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(145deg, rgba(124,58,237,0.08) 0%, transparent 50%)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: 'clamp(48px,6vw,80px) 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,5vw,52px)', fontWeight: 900, color: '#F1F0FF', letterSpacing: '-0.03em', marginBottom: 14 }}>Get in Touch</h1>
          <p style={{ fontSize: 16, color: '#64748B', lineHeight: 1.65 }}>Questions, partnerships, disputes, or just want to say hi — we respond to everything.</p>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: 'clamp(32px,5vw,60px) 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,300px), 1fr))', gap: 32, alignItems: 'start' }}>

        {/* Left — Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: '#F1F0FF', marginBottom: 8 }}>Contact Details</h2>

          {[
            { icon: Mail, label: 'Email', value: 'nitish@jobr.co.in', href: 'mailto:nitish@jobr.co.in', color: '#7C3AED' },
            { icon: MessageCircle, label: 'WhatsApp', value: '+91 94367 81545', href: 'https://wa.me/919436781545', color: '#10B981' },
            { icon: MapPin, label: 'Location', value: 'Bangalore, Karnataka, India', href: null, color: '#F97316' },
            { icon: Clock, label: 'Response Time', value: 'Within 24 hours on working days', href: null, color: '#4F46E5' },
          ].map(c => (
            <div key={c.label} style={{ display: 'flex', gap: 14, padding: '14px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `${c.color}15`, border: `1px solid ${c.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <c.icon size={17} color={c.color} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace', marginBottom: 3 }}>{c.label.toUpperCase()}</div>
                {c.href ? (
                  <a href={c.href} target="_blank" rel="noreferrer" style={{ fontSize: 14, fontWeight: 600, color: c.color, textDecoration: 'none' }}>{c.value}</a>
                ) : (
                  <div style={{ fontSize: 14, color: '#94A3B8' }}>{c.value}</div>
                )}
              </div>
            </div>
          ))}

          {/* Common topics */}
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: 12 }}>COMMON TOPICS</div>
            {[
              { subject: 'Partnership inquiry', href: 'mailto:nitish@jobr.co.in?subject=Partnership Inquiry' },
              { subject: 'EdTech onboarding', href: 'mailto:nitish@jobr.co.in?subject=EdTech Onboarding' },
              { subject: 'Mentor withdrawal', href: 'mailto:nitish@jobr.co.in?subject=Withdrawal Request' },
              { subject: 'Dispute resolution', href: 'mailto:nitish@jobr.co.in?subject=Dispute Resolution' },
              { subject: 'Press and media', href: 'mailto:nitish@jobr.co.in?subject=Press Inquiry' },
            ].map(t => (
              <a key={t.subject} href={t.href} style={{ display: 'block', fontSize: 13, color: '#64748B', textDecoration: 'none', marginBottom: 8, padding: '8px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, transition: 'all 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#F1F0FF'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.25)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#64748B'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; }}>
                {t.subject} →
              </a>
            ))}
          </div>
        </div>

        {/* Right — Form */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 28 }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <CheckCircle2 size={28} color="#10B981" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: '#F1F0FF', marginBottom: 8 }}>Message Sent!</h3>
              <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6 }}>Nitish has been notified on WhatsApp. We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: '#F1F0FF', marginBottom: 4 }}>Send a Message</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace', display: 'block', marginBottom: 5 }}>NAME *</label>
                  <input className="input" placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{ fontSize: 13 }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace', display: 'block', marginBottom: 5 }}>EMAIL *</label>
                  <input className="input" type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={{ fontSize: 13 }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace', display: 'block', marginBottom: 5 }}>SUBJECT</label>
                <input className="input" placeholder="What's this about?" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} style={{ fontSize: 13 }} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace', display: 'block', marginBottom: 5 }}>MESSAGE *</label>
                <textarea className="input" placeholder="Tell us how we can help..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} style={{ height: 120, resize: 'none', fontSize: 13 }} />
              </div>
              {error && <div style={{ padding: '9px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, fontSize: 12, color: '#EF4444' }}>{error}</div>}
              <button onClick={handleSubmit} disabled={loading} style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)', color: '#fff', border: 'none', borderRadius: 100, padding: '12px', fontWeight: 700, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'var(--font-display)', boxShadow: '0 3px 12px rgba(124,58,237,0.4)', opacity: loading ? 0.7 : 1 }}>
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