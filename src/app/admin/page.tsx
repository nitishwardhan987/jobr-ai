'use client';
import { useEffect, useState } from 'react';
import {
  Bug, Eye, EyeOff, Shield, CheckCircle2, Clock,
  AlertTriangle, XCircle, RefreshCw, Users, ToggleLeft,
  ToggleRight, Megaphone, LogOut, Lock, BarChart3,
  ChevronDown, ChevronUp, CreditCard, UserCheck, Crown,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const ADMIN_EMAIL = 'nitishwardhan987@gmail.com';
const ADMIN_PIN   = process.env.NEXT_PUBLIC_ADMIN_PIN || '123456';

type BugReport = {
  id: string; type: string; title: string; description: string;
  page_url: string; screenshot_url: string; user_email: string;
  status: string; priority: string; admin_notes: string; created_at: string;
};
type VisItem = {
  id: string; entity_type: string; entity_id: string; entity_label: string;
  is_visible: boolean; hidden_reason: string; banner_message: string;
};

const PRIORITY_COLOR: Record<string, string> = {
  critical: '#EF4444', high: '#F97316', medium: '#F59E0B', low: '#64748B',
};
const STATUS_COLOR: Record<string, string> = {
  open: '#EF4444', in_progress: '#F97316', resolved: '#10B981', closed: '#64748B',
};

export default function AdminPage() {
  const [step,     setStep]     = useState<'email'|'pin'|'dash'>('email');
  const [email,    setEmail]    = useState('');
  const [pin,      setPin]      = useState('');
  const [pinErr,   setPinErr]   = useState('');
  const [tab,      setTab]      = useState<'overview'|'bugs'|'visibility'|'mentors'|'team'|'credits'|'admins'>('overview');
  const [bugs,     setBugs]     = useState<BugReport[]>([]);
  const [vis,      setVis]      = useState<VisItem[]>([]);
  const [mentors,  setMentors]  = useState<any[]>([]);
  const [team,     setTeam]     = useState<any[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [expanded, setExpanded] = useState<string|null>(null);
  const [banners,  setBanners]  = useState<Record<string,string>>({});

  useEffect(() => {
    if (sessionStorage.getItem('jobr_admin_auth') === 'true') { setStep('dash'); loadAll(); }
  }, []);

  const handleEmail = () => {
    if (email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) { setPinErr('Access denied.'); return; }
    setStep('pin'); setPinErr('');
  };

  const handlePin = () => {
    if (pin !== ADMIN_PIN) { setPinErr('Incorrect PIN.'); setPin(''); return; }
    sessionStorage.setItem('jobr_admin_auth', 'true');
    setStep('dash'); setPinErr(''); loadAll();
  };

  const handleLogout = () => {
    sessionStorage.removeItem('jobr_admin_auth');
    setStep('email'); setEmail(''); setPin('');
  };

  async function loadAll() {
    setLoading(true);
    const [{ data: b }, { data: v }, { data: m }, { data: t }] = await Promise.all([
      supabase.from('bug_reports').select('*').order('created_at', { ascending: false }),
      supabase.from('content_visibility').select('*').order('entity_type'),
      supabase.from('mentor_profiles').select('id,user_email,name,domain,is_active,is_verified,rating,total_sessions').order('name'),
      supabase.from('team_members').select('*').order('display_order'),
    ]);
    setBugs(b || []); setVis(v || []); setMentors(m || []); setTeam(t || []);
    const bt: Record<string,string> = {};
    (v || []).filter((i: VisItem) => i.entity_type === 'page_banner').forEach((i: VisItem) => { bt[i.entity_id] = i.banner_message || ''; });
    setBanners(bt);
    setLoading(false);
  }

  async function updateBug(id: string, status: string, notes?: string) {
    await supabase.from('bug_reports').update({ status, admin_notes: notes, updated_at: new Date().toISOString(), ...(status === 'resolved' ? { resolved_at: new Date().toISOString() } : {}) }).eq('id', id);
    loadAll();
  }

  async function toggleVis(entityType: string, entityId: string, current: boolean) {
    await supabase.from('content_visibility').upsert({ entity_type: entityType, entity_id: entityId, is_visible: !current, updated_by: ADMIN_EMAIL, updated_at: new Date().toISOString() }, { onConflict: 'entity_type,entity_id' });
    loadAll();
  }

  async function saveBanner(entityId: string, message: string, visible: boolean) {
    await supabase.from('content_visibility').upsert({ entity_type: 'page_banner', entity_id: entityId, entity_label: `${entityId} Banner`, is_visible: visible, banner_message: message, updated_by: ADMIN_EMAIL, updated_at: new Date().toISOString() }, { onConflict: 'entity_type,entity_id' });
    loadAll();
  }

  async function toggleMentor(userEmail: string, current: boolean) {
    await supabase.from('mentor_profiles').update({ is_active: !current }).eq('user_email', userEmail);
    loadAll();
  }

  // ── AUTH SCREENS ───────────────────────────────────────────────────────────
  const authBox = (child: React.ReactNode) => (
    <div style={{ background: '#1C1C2E', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#24243A', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 20, padding: '36px 32px', width: '100%', maxWidth: 380, textAlign: 'center' }}>
        {child}
      </div>
    </div>
  );

  if (step === 'email') return authBox(<>
    <div style={{ fontSize: 36, marginBottom: 12 }}>🔐</div>
    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, color: '#F1F0FF', marginBottom: 6 }}>Admin Access</h1>
    <p style={{ fontSize: 13, color: '#475569', marginBottom: 24 }}>Jobr.co.in Control Panel</p>
    <input className="input" type="email" placeholder="Admin email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleEmail()} style={{ marginBottom: 10, fontSize: 14 }} />
    {pinErr && <p style={{ fontSize: 12, color: '#EF4444', marginBottom: 8 }}>{pinErr}</p>}
    <button onClick={handleEmail} style={{ width: '100%', background: 'linear-gradient(135deg, #7C3AED, #6D28D9)', color: '#fff', border: 'none', borderRadius: 100, padding: '12px', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>Continue →</button>
  </>);

  if (step === 'pin') return authBox(<>
    <Lock size={32} color="#7C3AED" style={{ marginBottom: 12 }} />
    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, color: '#F1F0FF', marginBottom: 6 }}>Enter PIN</h1>
    <p style={{ fontSize: 13, color: '#475569', marginBottom: 24 }}>6-digit security PIN</p>
    <input className="input" type="password" placeholder="••••••" maxLength={6} value={pin} onChange={e => setPin(e.target.value.replace(/\D/g,''))} onKeyDown={e => e.key === 'Enter' && handlePin()} style={{ marginBottom: 10, fontSize: 24, textAlign: 'center', letterSpacing: '0.3em' }} />
    {pinErr && <p style={{ fontSize: 12, color: '#EF4444', marginBottom: 8 }}>{pinErr}</p>}
    <button onClick={handlePin} style={{ width: '100%', background: 'linear-gradient(135deg, #7C3AED, #6D28D9)', color: '#fff', border: 'none', borderRadius: 100, padding: '12px', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>Unlock →</button>
    <button onClick={() => setStep('email')} style={{ marginTop: 10, background: 'none', border: 'none', color: '#475569', fontSize: 12, cursor: 'pointer' }}>← Back</button>
  </>);

  // ── DASHBOARD ──────────────────────────────────────────────────────────────
  const openBugs     = bugs.filter(b => b.status === 'open').length;
  const criticalBugs = bugs.filter(b => b.priority === 'critical' && b.status === 'open').length;

  const TABS = [
    { id: 'overview',   label: 'Overview',                icon: BarChart3  },
    { id: 'bugs',       label: `Bugs (${openBugs} open)`, icon: Bug        },
    { id: 'visibility', label: 'Page Controls',           icon: Eye        },
    { id: 'mentors',    label: 'Mentors',                 icon: Users      },
    { id: 'team',       label: 'Team Members',            icon: UserCheck  },
    { id: 'credits',    label: 'Credits',                 icon: CreditCard },
    { id: 'admins',     label: 'Admins',                  icon: Crown      },
  ];

  return (
    <div style={{ background: '#0F0F1A', minHeight: '100vh', color: '#F1F0FF' }}>

      {/* Top bar */}
      <div style={{ background: 'rgba(28,28,46,0.98)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60, position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg, #7C3AED, #F97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: '#fff' }}>J</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#F1F0FF', fontFamily: 'var(--font-display)' }}>Jobr Admin</div>
            <div style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace' }}>CONTROL PANEL</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {criticalBugs > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 100 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444', animation: 'pulse-dot 1.5s infinite' }} />
              <span style={{ fontSize: 11, color: '#EF4444', fontWeight: 700, fontFamily: 'monospace' }}>{criticalBugs} CRITICAL</span>
            </div>
          )}
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748B', padding: '6px 12px', borderRadius: 100, fontSize: 12, cursor: 'pointer' }}>
            <LogOut size={13} /> Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 28 }}>
          {[
            { label: 'Open Bugs',      value: openBugs,                                color: '#EF4444' },
            { label: 'Total Reports',  value: bugs.length,                             color: '#F97316' },
            { label: 'Hidden Items',   value: vis.filter(v => !v.is_visible).length,   color: '#A78BFA' },
            { label: 'Live Banners',   value: vis.filter(v => v.entity_type === 'page_banner' && v.is_visible).length, color: '#10B981' },
            { label: 'Active Mentors', value: mentors.filter(m => m.is_active).length, color: '#06B6D4' },
            { label: 'Team Members',   value: team.filter(t => t.is_active).length,    color: '#F59E0B' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '16px 18px' }}>
              <div style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace', marginBottom: 6 }}>{s.label.toUpperCase()}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: s.color, fontFamily: 'var(--font-display)', lineHeight: 1 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 24, overflowX: 'auto' }} className="scrollbar-hide">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id as any)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '11px 16px', background: 'transparent', border: 'none', cursor: 'pointer', borderBottom: tab === t.id ? '2px solid #7C3AED' : '2px solid transparent', color: tab === t.id ? '#A78BFA' : '#475569', fontSize: 12, fontWeight: tab === t.id ? 700 : 500, fontFamily: 'var(--font-display)', whiteSpace: 'nowrap', marginBottom: '-1px', transition: 'all 0.15s' }}>
              <t.icon size={13} />{t.label}
            </button>
          ))}
        </div>

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60, gap: 10 }}>
            <RefreshCw size={18} color="#7C3AED" style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ color: '#475569' }}>Loading...</span>
          </div>
        )}

        {/* OVERVIEW */}
        {!loading && tab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#A78BFA', fontFamily: 'monospace', marginBottom: 14 }}>RECENT REPORTS</div>
              {bugs.slice(0, 5).map(b => (
                <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: PRIORITY_COLOR[b.priority] || '#64748B', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#F1F0FF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</div>
                    <div style={{ fontSize: 11, color: '#475569' }}>{b.type} · {b.user_email || 'Anonymous'} · {new Date(b.created_at).toLocaleDateString('en-IN')}</div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: STATUS_COLOR[b.status], background: `${STATUS_COLOR[b.status]}15`, padding: '2px 8px', borderRadius: 100, fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{b.status?.toUpperCase()}</span>
                </div>
              ))}
              {bugs.length === 0 && <div style={{ fontSize: 13, color: '#334155', textAlign: 'center', padding: 20 }}>No reports yet 🎉</div>}
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#A78BFA', fontFamily: 'monospace', marginBottom: 14 }}>FEATURE TOGGLES</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
                {vis.filter(v => v.entity_type === 'feature').map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', border: `1px solid ${item.is_visible ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}`, borderRadius: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#F1F0FF', fontFamily: 'var(--font-display)' }}>{item.entity_label}</span>
                    <button onClick={() => toggleVis(item.entity_type, item.entity_id, item.is_visible)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      {item.is_visible ? <ToggleRight size={24} color="#10B981" /> : <ToggleLeft size={24} color="#EF4444" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BUGS */}
        {!loading && tab === 'bugs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {bugs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60 }}>
                <Bug size={40} color="#334155" style={{ marginBottom: 12 }} />
                <div style={{ fontSize: 16, color: '#475569' }}>No reports yet 🎉</div>
              </div>
            ) : bugs.map(b => (
              <BugCard key={b.id} bug={b} expanded={expanded === b.id} onExpand={() => setExpanded(expanded === b.id ? null : b.id)} onUpdate={updateBug} />
            ))}
          </div>
        )}

        {/* PAGE CONTROLS */}
        {!loading && tab === 'visibility' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#06B6D4', fontFamily: 'monospace', marginBottom: 14 }}>FEATURE TOGGLES</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {vis.filter(v => v.entity_type === 'feature').map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#F1F0FF', fontFamily: 'var(--font-display)' }}>{item.entity_label}</div>
                      <div style={{ fontSize: 10, color: '#334155', fontFamily: 'monospace' }}>{item.entity_id}</div>
                    </div>
                    <button onClick={() => toggleVis(item.entity_type, item.entity_id, item.is_visible)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: item.is_visible ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${item.is_visible ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`, borderRadius: 100, padding: '7px 14px', cursor: 'pointer', color: item.is_visible ? '#10B981' : '#EF4444', fontSize: 12, fontWeight: 700 }}>
                      {item.is_visible ? <><Eye size={13} /> Visible</> : <><EyeOff size={13} /> Hidden</>}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#F97316', fontFamily: 'monospace', marginBottom: 14 }}>PAGE BANNERS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {vis.filter(v => v.entity_type === 'page_banner').map(item => (
                  <div key={item.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#F1F0FF', fontFamily: 'var(--font-display)' }}>{item.entity_label}</div>
                      <button onClick={() => saveBanner(item.entity_id, banners[item.entity_id] || '', !item.is_visible)} style={{ background: item.is_visible ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)', border: `1px solid ${item.is_visible ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 100, padding: '5px 12px', cursor: 'pointer', color: item.is_visible ? '#10B981' : '#64748B', fontSize: 12, fontWeight: 600 }}>
                        {item.is_visible ? 'LIVE ✓' : 'OFF'}
                      </button>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input className="input" placeholder="Banner message..." value={banners[item.entity_id] || ''} onChange={e => setBanners(b => ({ ...b, [item.entity_id]: e.target.value }))} style={{ fontSize: 13 }} />
                      <button onClick={() => saveBanner(item.entity_id, banners[item.entity_id] || '', item.is_visible)} style={{ background: '#7C3AED', color: '#fff', border: 'none', borderRadius: 8, padding: '0 14px', fontWeight: 700, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>Save</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MENTORS */}
        {!loading && tab === 'mentors' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
              <div style={{ padding: '5px 12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 100, fontSize: 11, color: '#10B981', fontFamily: 'monospace' }}>{mentors.filter(m => m.is_active).length} ACTIVE</div>
              <div style={{ padding: '5px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 100, fontSize: 11, color: '#EF4444', fontFamily: 'monospace' }}>{mentors.filter(m => !m.is_active).length} HIDDEN</div>
            </div>
            {mentors.map(m => (
              <div key={m.user_email} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #F97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900, color: '#fff', flexShrink: 0 }}>
                  {m.name?.[0]?.toUpperCase() || 'M'}
                </div>
                <div style={{ flex: 1, minWidth: 140 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#F1F0FF', fontFamily: 'var(--font-display)' }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: '#475569' }}>{m.domain} · ⭐ {m.rating || 'New'} · {m.total_sessions || 0} sessions</div>
                  <div style={{ fontSize: 10, color: '#334155', fontFamily: 'monospace' }}>{m.user_email}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {m.is_verified && <span style={{ fontSize: 10, color: '#10B981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: '3px 8px', borderRadius: 100, fontFamily: 'monospace' }}>VERIFIED</span>}
                  <button onClick={() => toggleMentor(m.user_email, m.is_active)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: m.is_active ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${m.is_active ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`, borderRadius: 100, padding: '6px 14px', cursor: 'pointer', color: m.is_active ? '#10B981' : '#EF4444', fontSize: 12, fontWeight: 700 }}>
                    {m.is_active ? <><Eye size={12} /> Visible</> : <><EyeOff size={12} /> Hidden</>}
                  </button>
                  <button onClick={async () => { await supabase.from('mentor_profiles').update({ is_verified: !m.is_verified }).eq('user_email', m.user_email); loadAll(); }} style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 100, padding: '6px 14px', cursor: 'pointer', color: '#A78BFA', fontSize: 12, fontWeight: 700 }}>
                    {m.is_verified ? '✓ Verified' : '+ Verify'}
                  </button>
                </div>
              </div>
            ))}
            {mentors.length === 0 && <div style={{ textAlign: 'center', padding: 60, color: '#334155' }}>No mentors yet</div>}
          </div>
        )}

        {/* TEAM MEMBERS */}
        {!loading && tab === 'team' && <TeamTab team={team} onRefresh={loadAll} />}

        {/* CREDITS */}
        {!loading && tab === 'credits' && <CreditsTab />}

        {/* ADMINS */}
        {!loading && tab === 'admins' && <AdminsTab />}

      </div>

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #F1F0FF; padding: 10px 14px; font-family: var(--font-sans, sans-serif); outline: none; box-sizing: border-box; }
        .input:focus { border-color: rgba(124,58,237,0.5); }
      `}</style>
    </div>
  );
}

// ── BUG CARD ──────────────────────────────────────────────────────────────────
function BugCard({ bug: b, expanded, onExpand, onUpdate }: { bug: BugReport; expanded: boolean; onExpand: () => void; onUpdate: (id: string, status: string, notes?: string) => void }) {
  const [notes, setNotes] = useState(b.admin_notes || '');
  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${b.priority === 'critical' ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 14, overflow: 'hidden' }}>
      <div onClick={onExpand} style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: PRIORITY_COLOR[b.priority] || '#64748B', flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#F1F0FF', fontFamily: 'var(--font-display)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</div>
          <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{b.type} · {b.page_url || 'unknown'} · {b.user_email || 'Anonymous'} · {new Date(b.created_at).toLocaleDateString('en-IN')}</div>
        </div>
        <div style={{ display: 'flex', gap: 7, alignItems: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: PRIORITY_COLOR[b.priority], background: `${PRIORITY_COLOR[b.priority]}15`, padding: '2px 7px', borderRadius: 100, fontFamily: 'monospace' }}>{b.priority?.toUpperCase()}</span>
          <span style={{ fontSize: 9, fontWeight: 700, color: STATUS_COLOR[b.status], background: `${STATUS_COLOR[b.status]}15`, padding: '2px 7px', borderRadius: 100, fontFamily: 'monospace' }}>{b.status?.toUpperCase()}</span>
          {expanded ? <ChevronUp size={14} color="#475569" /> : <ChevronDown size={14} color="#475569" />}
        </div>
      </div>
      {expanded && (
        <div style={{ padding: '0 18px 18px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace', marginBottom: 6 }}>DESCRIPTION</div>
              <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>{b.description}</p>
            </div>
            {b.screenshot_url && <a href={b.screenshot_url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#7C3AED' }}>View screenshot →</a>}
            <div>
              <div style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace', marginBottom: 8 }}>UPDATE STATUS</div>
              <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                {(['open','in_progress','resolved','closed'] as const).map(s => (
                  <button key={s} onClick={() => onUpdate(b.id, s, notes)} style={{ padding: '6px 12px', background: b.status === s ? `${STATUS_COLOR[s]}20` : 'rgba(255,255,255,0.04)', border: `1px solid ${b.status === s ? STATUS_COLOR[s] + '40' : 'rgba(255,255,255,0.06)'}`, borderRadius: 100, color: b.status === s ? STATUS_COLOR[s] : '#64748B', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'monospace' }}>
                    {s.replace('_',' ').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace', marginBottom: 6 }}>ADMIN NOTES</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input className="input" placeholder="Internal notes..." value={notes} onChange={e => setNotes(e.target.value)} style={{ fontSize: 13 }} />
                <button onClick={() => onUpdate(b.id, b.status, notes)} style={{ background: '#7C3AED', color: '#fff', border: 'none', borderRadius: 8, padding: '0 14px', fontWeight: 700, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── TEAM TAB ──────────────────────────────────────────────────────────────────
function TeamTab({ team, onRefresh }: { team: any[]; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [adding,   setAdding]   = useState(false);
  const [form, setForm] = useState({ name: '', role: '', bio: '', linkedin_url: '', photo_url: '', email: '', display_order: 1 });

  const handleAdd = async () => {
    if (!form.name || !form.role) return;
    setAdding(true);
    await supabase.from('team_members').insert(form);
    setForm({ name: '', role: '', bio: '', linkedin_url: '', photo_url: '', email: '', display_order: 1 });
    setShowForm(false); setAdding(false);
    onRefresh();
  };

  const handleToggle = async (id: string, current: boolean) => {
    await supabase.from('team_members').update({ is_active: !current }).eq('id', id);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this team member?')) return;
    await supabase.from('team_members').delete().eq('id', id);
    onRefresh();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#A78BFA', fontFamily: 'monospace' }}>TEAM MEMBERS — shown in footer and About page</div>
        <button onClick={() => setShowForm(!showForm)} style={{ background: '#7C3AED', color: '#fff', border: 'none', borderRadius: 100, padding: '8px 20px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
          {showForm ? 'Cancel' : '+ Add Member'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
            {[
              { key: 'name',         label: 'NAME *',       placeholder: 'Full name',                  type: 'text'   },
              { key: 'role',         label: 'ROLE *',       placeholder: 'e.g. Co-founder & CTO',      type: 'text'   },
              { key: 'email',        label: 'EMAIL',        placeholder: 'name@jobr.co.in',             type: 'email'  },
              { key: 'linkedin_url', label: 'LINKEDIN URL', placeholder: 'https://linkedin.com/in/...', type: 'text'   },
              { key: 'photo_url',    label: 'PHOTO URL',    placeholder: 'https://...',                 type: 'text'   },
              { key: 'display_order',label: 'ORDER',        placeholder: '1',                           type: 'number' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace', display: 'block', marginBottom: 4 }}>{f.label}</label>
                <input type={f.type} className="input" placeholder={f.placeholder} value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))} style={{ fontSize: 13 }} />
              </div>
            ))}
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace', display: 'block', marginBottom: 4 }}>BIO</label>
              <textarea className="input" placeholder="Short bio..." value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} style={{ height: 60, resize: 'none', fontSize: 13 }} />
            </div>
          </div>
          <button onClick={handleAdd} disabled={adding || !form.name || !form.role} style={{ background: '#7C3AED', color: '#fff', border: 'none', borderRadius: 100, padding: '10px 24px', fontWeight: 700, fontSize: 13, cursor: 'pointer', opacity: adding ? 0.7 : 1, width: 'fit-content' }}>
            {adding ? 'Adding...' : 'Add to Team'}
          </button>
        </div>
      )}

      {team.map(m => (
        <div key={m.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #F97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, color: '#fff', flexShrink: 0, overflow: 'hidden' }}>
            {m.photo_url ? <img src={m.photo_url} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : m.name?.[0]}
          </div>
          <div style={{ flex: 1, minWidth: 140 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#F1F0FF', fontFamily: 'var(--font-display)' }}>{m.name}</div>
            <div style={{ fontSize: 12, color: '#475569' }}>{m.role}</div>
            {m.linkedin_url && <a href={m.linkedin_url} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: '#A78BFA' }}>LinkedIn →</a>}
          </div>
          <div style={{ fontSize: 10, color: '#334155', fontFamily: 'monospace' }}>#{m.display_order}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => handleToggle(m.id, m.is_active)} style={{ background: m.is_active ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${m.is_active ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`, borderRadius: 100, padding: '6px 14px', cursor: 'pointer', color: m.is_active ? '#10B981' : '#EF4444', fontSize: 12, fontWeight: 700 }}>
              {m.is_active ? '✓ Visible' : '✗ Hidden'}
            </button>
            <button onClick={() => handleDelete(m.id)} style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 100, padding: '6px 14px', cursor: 'pointer', color: '#EF4444', fontSize: 12, fontWeight: 700 }}>Remove</button>
          </div>
        </div>
      ))}
      {team.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: '#334155' }}>No team members yet.</div>}
    </div>
  );
}

// ── CREDITS TAB ───────────────────────────────────────────────────────────────
function CreditsTab() {
  const [searchEmail,  setSearchEmail]  = useState('');
  const [foundUser,    setFoundUser]    = useState<any>(null);
  const [searching,    setSearching]    = useState(false);
  const [amount,       setAmount]       = useState(0);
  const [note,         setNote]         = useState('');
  const [action,       setAction]       = useState<'add'|'deduct'>('add');
  const [processing,   setProcessing]   = useState(false);
  const [recentTx,     setRecentTx]     = useState<any[]>([]);
  const [error,        setError]        = useState('');
  const [success,      setSuccess]      = useState('');

  useEffect(() => { loadRecentTx(); }, []);

  const loadRecentTx = async () => {
    const { data } = await supabase.from('credit_transactions').select('*').order('created_at', { ascending: false }).limit(20);
    setRecentTx(data || []);
  };

  const searchUser = async () => {
    if (!searchEmail.trim()) return;
    setSearching(true); setFoundUser(null); setError('');
    const { data } = await supabase.from('user_profiles').select('*').eq('email', searchEmail.trim().toLowerCase()).single();
    if (data) setFoundUser(data);
    else setError(`No user profile found for ${searchEmail}. They need to sign in once first.`);
    setSearching(false);
  };

  const handleCredit = async () => {
    if (!foundUser || amount < 1) return;
    setProcessing(true); setError(''); setSuccess('');
    try {
      const delta      = action === 'add' ? amount : -amount;
      const newBalance = (foundUser.wallet_credits || 0) + delta;
      if (newBalance < 0) { setError('Cannot deduct more than available credits.'); setProcessing(false); return; }

      await supabase.from('user_profiles').update({ wallet_credits: newBalance, updated_at: new Date().toISOString() }).eq('email', foundUser.email);
      await supabase.from('credit_transactions').insert({
        user_email: foundUser.email,
        type:       action === 'add' ? 'top_up' : 'deduct',
        credits:    amount,
        note:       note || (action === 'add' ? 'Admin credit grant' : 'Admin deduction'),
        created_by: 'admin',
      });

      setFoundUser((u: any) => ({ ...u, wallet_credits: newBalance }));
      setSuccess(`${action === 'add' ? 'Added' : 'Deducted'} ${amount} credits ${action === 'add' ? 'to' : 'from'} ${foundUser.email}. New balance: ${newBalance} credits (= ₹${newBalance * 100}).`);
      setAmount(0); setNote('');
      loadRecentTx();
    } catch (e: any) { setError(e.message); }
    finally { setProcessing(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#A78BFA', fontFamily: 'monospace', marginBottom: 12 }}>FIND USER BY EMAIL</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: error || foundUser ? 12 : 0 }}>
          <input className="input" placeholder="user@email.com" value={searchEmail} onChange={e => setSearchEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && searchUser()} style={{ fontSize: 13 }} />
          <button onClick={searchUser} disabled={searching} style={{ background: '#7C3AED', color: '#fff', border: 'none', borderRadius: 10, padding: '0 20px', fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap', opacity: searching ? 0.7 : 1 }}>
            {searching ? '...' : 'Search'}
          </button>
        </div>

        {error   && <div style={{ fontSize: 13, color: '#EF4444', padding: '8px 12px', background: 'rgba(239,68,68,0.08)', borderRadius: 8, marginBottom: 10 }}>{error}</div>}
        {success && <div style={{ fontSize: 13, color: '#10B981', padding: '8px 12px', background: 'rgba(16,185,129,0.08)', borderRadius: 8, marginBottom: 10 }}>{success}</div>}

        {foundUser && (
          <div style={{ padding: '16px 18px', background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#F1F0FF', fontFamily: 'var(--font-display)' }}>{foundUser.name || foundUser.email}</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>{foundUser.email}</div>
                <span style={{ fontSize: 10, color: '#A78BFA', background: 'rgba(124,58,237,0.1)', padding: '2px 8px', borderRadius: 100, fontFamily: 'monospace', marginTop: 4, display: 'inline-block' }}>{foundUser.role?.toUpperCase()}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 32, fontWeight: 900, color: '#10B981', fontFamily: 'var(--font-display)' }}>{foundUser.wallet_credits}</div>
                <div style={{ fontSize: 11, color: '#475569' }}>credits = ₹{(foundUser.wallet_credits || 0) * 100}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
              {(['add','deduct'] as const).map(a => (
                <button key={a} onClick={() => setAction(a)} style={{ flex: 1, padding: '9px', background: action === a ? (a === 'add' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)') : 'rgba(255,255,255,0.04)', border: `1px solid ${action === a ? (a === 'add' ? 'rgba(16,185,129,0.35)' : 'rgba(239,68,68,0.35)') : 'rgba(255,255,255,0.08)'}`, borderRadius: 9, color: action === a ? (a === 'add' ? '#10B981' : '#EF4444') : '#64748B', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-display)', transition: 'all 0.15s' }}>
                  {a === 'add' ? '+ Add Credits' : '− Deduct Credits'}
                </button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace', display: 'block', marginBottom: 4 }}>CREDITS</label>
                <input type="number" className="input" min={1} value={amount || ''} onChange={e => setAmount(Number(e.target.value))} placeholder="10" style={{ fontSize: 14 }} />
              </div>
              <div>
                <label style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace', display: 'block', marginBottom: 4 }}>NOTE</label>
                <input className="input" placeholder="e.g. UPI ref: TXN123456" value={note} onChange={e => setNote(e.target.value)} style={{ fontSize: 13 }} />
              </div>
            </div>

            {amount > 0 && (
              <div style={{ padding: '8px 12px', background: action === 'add' ? 'rgba(16,185,129,0.07)' : 'rgba(239,68,68,0.07)', border: `1px solid ${action === 'add' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}`, borderRadius: 8, fontSize: 12, color: action === 'add' ? '#10B981' : '#EF4444', marginBottom: 10 }}>
                After this: {foundUser.email} will have {action === 'add' ? (foundUser.wallet_credits || 0) + amount : (foundUser.wallet_credits || 0) - amount} credits
              </div>
            )}

            <button onClick={handleCredit} disabled={processing || amount < 1} style={{ width: '100%', background: action === 'add' ? 'linear-gradient(135deg, #10B981, #059669)' : 'linear-gradient(135deg, #EF4444, #DC2626)', color: '#fff', border: 'none', borderRadius: 100, padding: '11px', fontWeight: 700, fontSize: 14, cursor: processing || amount < 1 ? 'not-allowed' : 'pointer', opacity: processing || amount < 1 ? 0.6 : 1, fontFamily: 'var(--font-display)' }}>
              {processing ? 'Processing...' : action === 'add' ? `+ Add ${amount} Credits` : `− Deduct ${amount} Credits`}
            </button>
          </div>
        )}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#A78BFA', fontFamily: 'monospace', marginBottom: 14 }}>RECENT TRANSACTIONS (ALL USERS)</div>
        {recentTx.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 30, color: '#334155' }}>No transactions yet</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recentTx.map(tx => (
              <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: tx.type === 'top_up' || tx.type === 'refund' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: tx.type === 'top_up' || tx.type === 'refund' ? '#10B981' : '#EF4444', flexShrink: 0 }}>
                  {tx.type === 'top_up' || tx.type === 'refund' ? '+' : '−'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#F1F0FF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.user_email}</div>
                  <div style={{ fontSize: 11, color: '#475569' }}>{tx.note || tx.type}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 900, color: tx.type === 'top_up' || tx.type === 'refund' ? '#10B981' : '#EF4444', fontFamily: 'var(--font-display)' }}>
                    {tx.type === 'top_up' || tx.type === 'refund' ? '+' : '−'}{tx.credits} cr
                  </div>
                  <div style={{ fontSize: 10, color: '#334155', fontFamily: 'monospace' }}>{new Date(tx.created_at).toLocaleDateString('en-IN')}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── ADMINS TAB ────────────────────────────────────────────────────────────────
function AdminsTab() {
  const [admins,   setAdmins]   = useState<any[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [newName,  setNewName]  = useState('');
  const [adding,   setAdding]   = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');

  useEffect(() => { loadAdmins(); }, []);

  const loadAdmins = async () => {
    const { data } = await supabase.from('user_profiles').select('*').eq('role', 'admin').order('created_at');
    setAdmins(data || []);
  };

  const handleAdd = async () => {
    if (!newEmail.trim()) return;
    setAdding(true); setError(''); setSuccess('');
    try {
      const cleanEmail = newEmail.trim().toLowerCase();
      // Upsert into user_profiles with admin role
      const { error: e1 } = await supabase.from('user_profiles').upsert({
        email: cleanEmail,
        name: newName.trim() || cleanEmail.split('@')[0],
        role: 'admin',
        wallet_credits: 0,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' });

      // Also update role if record exists
      await supabase.from('user_profiles').update({ role: 'admin' }).eq('email', cleanEmail);

      if (e1) throw e1;
      setSuccess(`${cleanEmail} granted admin access. They must sign in at /auth to activate.`);
      setNewEmail(''); setNewName('');
      loadAdmins();
    } catch (e: any) { setError(e.message); }
    finally { setAdding(false); }
  };

  const handleRemove = async (adminEmail: string) => {
    if (adminEmail === ADMIN_EMAIL) { alert('Cannot remove the primary admin.'); return; }
    if (!confirm(`Remove admin access for ${adminEmail}? They will become a regular student.`)) return;
    await supabase.from('user_profiles').update({ role: 'student' }).eq('email', adminEmail);
    setAdmins(a => a.filter(x => x.email !== adminEmail));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#F59E0B', fontFamily: 'monospace', marginBottom: 14 }}>ADD NEW ADMIN</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <div>
            <label style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace', display: 'block', marginBottom: 4 }}>EMAIL *</label>
            <input className="input" type="email" placeholder="newadmin@email.com" value={newEmail} onChange={e => setNewEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()} style={{ fontSize: 13 }} />
          </div>
          <div>
            <label style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace', display: 'block', marginBottom: 4 }}>NAME (optional)</label>
            <input className="input" placeholder="Admin Name" value={newName} onChange={e => setNewName(e.target.value)} style={{ fontSize: 13 }} />
          </div>
        </div>
        <div style={{ padding: '10px 14px', background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 8, fontSize: 12, color: '#F59E0B', marginBottom: 12, lineHeight: 1.5 }}>
          ⚠ Admins can add/deduct credits, verify mentors, manage the entire platform. Only add trusted people.
        </div>
        {error   && <div style={{ fontSize: 13, color: '#EF4444', padding: '8px 12px', background: 'rgba(239,68,68,0.08)', borderRadius: 8, marginBottom: 10 }}>{error}</div>}
        {success && <div style={{ fontSize: 13, color: '#10B981', padding: '8px 12px', background: 'rgba(16,185,129,0.08)', borderRadius: 8, marginBottom: 10 }}>{success}</div>}
        <button onClick={handleAdd} disabled={adding || !newEmail.trim()} style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#fff', border: 'none', borderRadius: 100, padding: '10px 24px', fontWeight: 700, fontSize: 13, cursor: adding || !newEmail.trim() ? 'not-allowed' : 'pointer', opacity: adding || !newEmail.trim() ? 0.6 : 1, fontFamily: 'var(--font-display)' }}>
          {adding ? 'Adding...' : '+ Grant Admin Access'}
        </button>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#F59E0B', fontFamily: 'monospace', marginBottom: 14 }}>CURRENT ADMINS ({admins.length})</div>
        {admins.map(a => (
          <div key={a.email} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, marginBottom: 8 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #F59E0B, #D97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900, color: '#fff', flexShrink: 0, overflow: 'hidden' }}>
              {a.photo_url ? <img src={a.photo_url} alt={a.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (a.name?.[0] || 'A')}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#F1F0FF', fontFamily: 'var(--font-display)' }}>{a.name || a.email}</div>
              <div style={{ fontSize: 12, color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.email}</div>
            </div>
            <div style={{ fontSize: 12, color: '#10B981', fontWeight: 600, flexShrink: 0 }}>{a.wallet_credits} cr</div>
            {a.email === ADMIN_EMAIL ? (
              <span style={{ fontSize: 10, color: '#F59E0B', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', padding: '3px 10px', borderRadius: 100, fontFamily: 'monospace' }}>PRIMARY</span>
            ) : (
              <button onClick={() => handleRemove(a.email)} style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 100, padding: '6px 14px', cursor: 'pointer', color: '#EF4444', fontSize: 12, fontWeight: 700 }}>Remove</button>
            )}
          </div>
        ))}
        {admins.length === 0 && <div style={{ textAlign: 'center', padding: 30, color: '#334155' }}>No admins found</div>}
      </div>
    </div>
  );
}