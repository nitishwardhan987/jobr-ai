'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Bug, Send, AlertCircle, CreditCard, Calendar, Mic, User, HelpCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const TYPES = [
  { id: 'bug',          label: 'Bug Report',     icon: Bug,         color: '#EF4444', desc: 'Something is broken' },
  { id: 'payment',      label: 'Payment Issue',   icon: CreditCard,  color: '#F97316', desc: 'Credits or billing' },
  { id: 'booking',      label: 'Booking Dispute', icon: Calendar,    color: '#A78BFA', desc: 'Session issue' },
  { id: 'mentor',       label: 'Mentor Issue',    icon: Mic,         color: '#EC4899', desc: 'Mentor no-show' },
  { id: 'cv_optimizer', label: 'CV Optimizer',    icon: AlertCircle, color: '#06B6D4', desc: 'Not working' },
  { id: 'account',      label: 'Account Issue',   icon: User,        color: '#10B981', desc: 'Login / profile' },
  { id: 'other',        label: 'Other',           icon: HelpCircle,  color: '#64748B', desc: 'Something else' },
];

const PRIORITY_MAP: Record<string, string> = {
  bug: 'high', payment: 'critical', booking: 'high',
  mentor: 'high', cv_optimizer: 'medium', account: 'medium', other: 'low',
};

export default function BugWidget() {
  const [open,        setOpen]        = useState(false);
  const [submitted,   setSubmitted]   = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [type,        setType]        = useState('bug');
  const [title,       setTitle]       = useState('');
  const [description, setDescription] = useState('');
  const [pageUrl,     setPageUrl]     = useState('');
  const [screenshot,  setScreenshot]  = useState('');
  const [userEmail,   setUserEmail]   = useState('');
  const [userName,    setUserName]    = useState('');
  const [error,       setError]       = useState('');
  const [pos,         setPos]         = useState({ x: 0, y: 0 });
  const [dragging,    setDragging]    = useState(false);
  const [hasMoved,    setHasMoved]    = useState(false);
  const [mounted,     setMounted]     = useState(false);
  const dragStart = useRef({ mx: 0, my: 0, bx: 0, by: 0 });

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('jobr_bug_pos');
    if (saved) { try { setPos(JSON.parse(saved)); } catch {} }
    else setPos({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
    const s = localStorage.getItem('jobr_session') || localStorage.getItem('jobr_user');
    if (s) { try { const p = JSON.parse(s); setUserEmail(p.email || ''); setUserName(p.name || ''); } catch {} }
    setPageUrl(window.location.pathname);
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true); setHasMoved(false);
    dragStart.current = { mx: e.clientX, my: e.clientY, bx: pos.x, by: pos.y };
  }, [pos]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setDragging(true); setHasMoved(false);
    const t = e.touches[0];
    dragStart.current = { mx: t.clientX, my: t.clientY, bx: pos.x, by: pos.y };
  }, [pos]);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent | TouchEvent) => {
      const cx = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const cy = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const dx = cx - dragStart.current.mx;
      const dy = cy - dragStart.current.my;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) setHasMoved(true);
      setPos({
        x: Math.max(0, Math.min(window.innerWidth - 56, dragStart.current.bx + dx)),
        y: Math.max(0, Math.min(window.innerHeight - 56, dragStart.current.by + dy)),
      });
    };
    const onUp = () => {
      setDragging(false);
      setPos(prev => {
        const snapX = prev.x < window.innerWidth / 2 ? 16 : window.innerWidth - 72;
        const snapped = { x: snapX, y: Math.max(80, Math.min(window.innerHeight - 80, prev.y)) };
        localStorage.setItem('jobr_bug_pos', JSON.stringify(snapped));
        return snapped;
      });
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove as any);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove as any);
      window.removeEventListener('touchend', onUp);
    };
  }, [dragging]);

  const handleClick = () => { if (!hasMoved) setOpen(true); };

  const handleSubmit = async () => {
    setError('');
    if (!title.trim())       { setError('Please enter a title.'); return; }
    if (!description.trim()) { setError('Please describe the issue.'); return; }
    setLoading(true);
    try {
      const report = {
        type, title: title.trim(), description: description.trim(),
        page_url: pageUrl || window.location.pathname,
        screenshot_url: screenshot.trim() || null,
        user_email: userEmail || null, user_name: userName || null,
        status: 'open', priority: PRIORITY_MAP[type] || 'medium',
      };
      const { error: dbErr } = await supabase.from('bug_reports').insert(report);
      if (dbErr) throw dbErr;
      const t = TYPES.find(t => t.id === type);
      const waText = encodeURIComponent(
        `🚨 New ${t?.label} on Jobr.co.in\n\nType: ${t?.label}\nPriority: ${report.priority?.toUpperCase()}\nPage: ${report.page_url}\nTitle: ${report.title}\nDescription: ${report.description}\nUser: ${report.user_email || 'Anonymous'}\n\nView: jobr.co.in/admin`
      );
      window.open(`https://wa.me/919945900292?text=${waText}`, '_blank');
      setSubmitted(true);
    } catch (e: any) {
      setError(e.message || 'Submission failed.');
    } finally { setLoading(false); }
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => { setSubmitted(false); setTitle(''); setDescription(''); setScreenshot(''); setError(''); setType('bug'); }, 300);
  };

  const selectedType = TYPES.find(t => t.id === type)!;
  if (!mounted) return null;

  return (
    <>
      {/* Floating button */}
      <div
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onClick={handleClick}
        style={{
          position: 'fixed', left: pos.x, top: pos.y, zIndex: 999,
          width: 52, height: 52, borderRadius: '50%',
          background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
          boxShadow: '0 4px 20px rgba(124,58,237,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: dragging ? 'grabbing' : 'grab',
          transition: dragging ? 'none' : 'left 0.3s cubic-bezier(0.34,1.56,0.64,1), top 0.1s',
          userSelect: 'none', touchAction: 'none',
        }}
      >
        <Bug size={20} color="#fff" />
        <div style={{ position: 'absolute', top: -2, right: -2, width: 12, height: 12, borderRadius: '50%', background: '#EF4444', border: '2px solid #1C1C2E', animation: 'pulse-dot 2s infinite' }} />
      </div>

      {/* Backdrop */}
      {open && <div onClick={handleClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000 }} />}

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 'min(420px, 100vw)',
        background: 'rgba(28,28,46,0.98)', backdropFilter: 'blur(20px)',
        borderLeft: '1px solid rgba(255,255,255,0.08)', zIndex: 1001,
        display: 'flex', flexDirection: 'column',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: `${selectedType.color}20`, border: `1px solid ${selectedType.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <selectedType.icon size={16} color={selectedType.color} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: '#F1F0FF', margin: 0 }}>Report an Issue</h2>
            </div>
            <p style={{ fontSize: 12, color: '#475569', margin: 0 }}>Every report goes directly to Nitish.</p>
          </div>
          <button onClick={handleClose} style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={15} />
          </button>
        </div>

        {submitted ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center', gap: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={28} color="#10B981" />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: '#F1F0FF', marginBottom: 8 }}>Report Submitted!</h3>
              <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6 }}>Nitish has been notified on WhatsApp.{userEmail && " We'll update you once resolved."}</p>
            </div>
            {userEmail && (
              <div style={{ padding: '10px 16px', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 10, fontSize: 12, color: '#A78BFA', fontFamily: 'monospace' }}>
                TICKET #{Math.random().toString(36).substr(2, 8).toUpperCase()}
              </div>
            )}
            <button onClick={handleClose} style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)', color: '#fff', border: 'none', borderRadius: 100, padding: '11px 28px', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>Done ✓</button>
          </div>
        ) : (
          <div style={{ flex: 1, padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>
            {/* Type selector */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#475569', fontFamily: 'monospace', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>ISSUE TYPE</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {TYPES.map(t => (
                  <button key={t.id} onClick={() => setType(t.id)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 11px', background: type === t.id ? `${t.color}15` : 'rgba(255,255,255,0.03)', border: `1px solid ${type === t.id ? t.color + '40' : 'rgba(255,255,255,0.06)'}`, borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s' }}>
                    <t.icon size={14} color={type === t.id ? t.color : '#475569'} />
                    <span style={{ fontSize: 12, fontWeight: type === t.id ? 700 : 500, color: type === t.id ? t.color : '#64748B', fontFamily: 'var(--font-display)' }}>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#475569', fontFamily: 'monospace', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>TITLE *</label>
              <input className="input" placeholder="Brief summary of the issue" value={title} onChange={e => setTitle(e.target.value)} style={{ fontSize: 13 }} />
            </div>

            {/* Description */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#475569', fontFamily: 'monospace', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>DESCRIPTION *</label>
              <textarea className="input" placeholder="What happened? What did you expect? Steps to reproduce..." value={description} onChange={e => setDescription(e.target.value)} style={{ fontSize: 13, resize: 'none', height: 90 }} />
            </div>

            {/* Page + Screenshot */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#475569', fontFamily: 'monospace', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>PAGE</label>
                <input className="input" value={pageUrl} onChange={e => setPageUrl(e.target.value)} style={{ fontSize: 12 }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#475569', fontFamily: 'monospace', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>SCREENSHOT URL</label>
                <input className="input" placeholder="imgur.com/..." value={screenshot} onChange={e => setScreenshot(e.target.value)} style={{ fontSize: 12 }} />
              </div>
            </div>

            {/* Email if anonymous */}
            {!userEmail && (
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#475569', fontFamily: 'monospace', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>YOUR EMAIL (optional)</label>
                <input className="input" type="email" placeholder="for status updates" value={userEmail} onChange={e => setUserEmail(e.target.value)} style={{ fontSize: 13 }} />
              </div>
            )}

            {userEmail && (
              <div style={{ padding: '8px 12px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.12)', borderRadius: 8, fontSize: 12, color: '#10B981' }}>
                ✓ Submitting as {userEmail}
              </div>
            )}

            {/* Priority indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: PRIORITY_MAP[type] === 'critical' ? '#EF4444' : PRIORITY_MAP[type] === 'high' ? '#F97316' : PRIORITY_MAP[type] === 'medium' ? '#F59E0B' : '#64748B' }} />
              <span style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace' }}>AUTO-PRIORITY: {PRIORITY_MAP[type]?.toUpperCase()}</span>
            </div>

            {error && <div style={{ padding: '9px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 8, fontSize: 12, color: '#EF4444' }}>{error}</div>}

            <button onClick={handleSubmit} disabled={loading} style={{ background: `linear-gradient(135deg, ${selectedType.color}, ${selectedType.color}cc)`, color: '#fff', border: 'none', borderRadius: 100, padding: '13px', fontWeight: 700, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'var(--font-display)', boxShadow: `0 4px 16px ${selectedType.color}40` }}>
              {loading ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Submitting...</> : <><Send size={15} /> Submit Report</>}
            </button>

            <p style={{ fontSize: 11, color: '#334155', textAlign: 'center', lineHeight: 1.5 }}>Goes to Nitish via WhatsApp + stored in admin panel.</p>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
      `}</style>
    </>
  );
}