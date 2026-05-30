'use client';
import { useEffect, useState, useRef } from 'react';
import {
  FileText, Briefcase, Mic, Users, BookOpen, Settings,
  Plus, Trash2, Send, Key, Trophy, AlertCircle,
  Clock, CheckCircle2, Zap, ExternalLink,
  Calendar, RefreshCw, X, Sparkles, Lock,
  MessageSquare, LogIn, Download, Save,
} from 'lucide-react';
import {
  PrepProvider, usePrep, JobTrack, TrackStatus,
  SEED_TRACKS, COURSE_DATA,
} from '@/context/PrepContext';
import { supabase } from '@/lib/supabase';

const TABS = [
  { id: 'cv',        label: 'CV.Prep',        icon: FileText,  color: '#7C3AED' },
  { id: 'tracks',    label: 'Track.Prep',     icon: Briefcase, color: '#06B6D4' },
  { id: 'interview', label: 'Interview.Prep', icon: Mic,       color: '#F97316' },
  { id: 'mentor',    label: 'Mentor.Prep',    icon: Users,     color: '#4F46E5' },
  { id: 'learn',     label: 'Learn.Prep',     icon: BookOpen,  color: '#10B981' },
  { id: 'settings',  label: 'Settings',       icon: Settings,  color: '#64748B' },
] as const;

const STATUS_CONFIG: Record<TrackStatus, { label: string; color: string; bg: string; icon: any; step: number }> = {
  applied:     { label: 'Applied',  color: '#06B6D4', bg: 'rgba(6,182,212,0.12)',   icon: Clock,         step: 1 },
  interview_1: { label: 'Round 1',  color: '#F97316', bg: 'rgba(249,115,22,0.12)',  icon: MessageSquare, step: 2 },
  interview_2: { label: 'Round 2',  color: '#A78BFA', bg: 'rgba(167,139,250,0.12)', icon: Zap,           step: 3 },
  offer:       { label: 'Offer 🎉', color: '#10B981', bg: 'rgba(16,185,129,0.12)',  icon: Trophy,        step: 4 },
  rejected:    { label: 'Rejected', color: '#EF4444', bg: 'rgba(239,68,68,0.12)',   icon: AlertCircle,   step: 0 },
};

const FREE_MOCK_LIMIT = 3;

export default function PrepDashboard() {
  return <PrepProvider><PrepInner /></PrepProvider>;
}

function PrepInner() {
  const { state, dispatch, loadTracks, authLoading } = usePrep();
  const [demoMode, setDemoMode] = useState(false);
  const toolRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (authLoading) return;
    if (state.userEmail) {
      setDemoMode(false);
      loadTracks();
    } else {
      setDemoMode(true);
      dispatch({ type: 'SET_TRACKS', tracks: SEED_TRACKS as any });
      dispatch({ type: 'SET_ACTIVE_TRACK', id: SEED_TRACKS[0].id });
    }
  }, [authLoading, state.userEmail]);

  if (authLoading) {
    return (
      <div style={{ background: '#1C1C2E', minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14 }}>
        <div style={{ width: 40, height: 40, border: '3px solid rgba(124,58,237,0.2)', borderTopColor: '#7C3AED', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ fontSize: 13, color: '#475569' }}>Loading your workspace...</p>
        <style jsx global>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ background: '#1C1C2E', minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>

      {/* ── HERO ── */}
      <div style={{ background: 'linear-gradient(145deg, rgba(124,58,237,0.13) 0%, rgba(124,58,237,0.04) 40%, transparent 70%)', borderBottom: '1px solid rgba(124,58,237,0.12)', padding: 'clamp(52px,8vw,96px) 24px clamp(44px,7vw,80px)', minHeight: '82vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.22)', borderRadius: 100, padding: '5px 14px', marginBottom: 24 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#7C3AED', animation: 'pulse-dot 2s infinite' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#A78BFA', fontFamily: 'monospace', letterSpacing: '0.1em' }}>PREP.JOBR</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px,6vw,72px)', fontWeight: 900, color: '#F1F0FF', letterSpacing: '-0.03em', lineHeight: 1.02, marginBottom: 20, maxWidth: 720 }}>
            Your next offer<br />
            <span style={{ background: 'linear-gradient(135deg, #A78BFA, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>starts here.</span>
          </h1>
          <p style={{ fontSize: 'clamp(15px,2vw,19px)', color: '#64748B', maxWidth: 520, lineHeight: 1.65, marginBottom: 36 }}>
            AI CV optimizer · Job tracker · Mock interviews · Skill gap analysis. Free to start with your own Gemini key.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 52 }}>
            <button onClick={() => toolRef.current?.scrollIntoView({ behavior: 'smooth' })} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'linear-gradient(135deg, #7C3AED, #6D28D9)', color: '#fff', border: 'none', borderRadius: 100, padding: '14px 32px', fontWeight: 700, fontSize: 16, cursor: 'pointer', fontFamily: 'var(--font-display)', boxShadow: '0 4px 20px rgba(124,58,237,0.4)' }}>
              <Sparkles size={17} /> Start Optimizing Free
            </button>
            {!demoMode ? (
              <button onClick={() => { dispatch({ type: 'SET_TAB', tab: 'tracks' }); toolRef.current?.scrollIntoView({ behavior: 'smooth' }); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.06)', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100, padding: '14px 28px', fontWeight: 600, fontSize: 15, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
                <Briefcase size={15} /> My Applications
              </button>
            ) : (
              <a href="/auth?mode=signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.06)', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100, padding: '14px 28px', fontWeight: 600, fontSize: 15, textDecoration: 'none', fontFamily: 'var(--font-display)' }}>
                Create free account →
              </a>
            )}
          </div>
          <div style={{ display: 'flex', gap: 'clamp(24px,4vw,48px)', flexWrap: 'wrap' }}>
            {[{value:'500+',label:'CVs optimized'},{value:'3',label:'Free mock interviews'},{value:'0%',label:'CV data stored'},{value:'XYZ',label:'Google formula'}].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 'clamp(20px,2.5vw,28px)', fontWeight: 900, color: '#A78BFA', fontFamily: 'var(--font-display)', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 'auto', paddingTop: 40 }}>
          <button onClick={() => toolRef.current?.scrollIntoView({ behavior: 'smooth' })} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: '#334155' }}>
            <span style={{ fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.1em' }}>SCROLL TO START</span>
            <div style={{ width: 1, height: 28, background: 'linear-gradient(to bottom, #334155, transparent)' }} />
          </button>
        </div>
      </div>

      {/* ── TOOL ── */}
      <div ref={toolRef}>
        {demoMode && (
          <div style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(249,115,22,0.10))', borderBottom: '1px solid rgba(124,58,237,0.25)', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#A78BFA', animation: 'pulse-dot 2s infinite' }} />
              <span style={{ fontSize: 13, color: '#C4B5FD', fontWeight: 600, fontFamily: 'var(--font-display)' }}>You're viewing a demo — sign up to track your own applications</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <a href="/auth?mode=signup" style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#7C3AED', color: '#fff', textDecoration: 'none', padding: '6px 16px', borderRadius: 100, fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-display)' }}><Sparkles size={12} /> Sign up free</a>
              <a href="/auth" style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.08)', color: '#C4B5FD', textDecoration: 'none', padding: '6px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600 }}><LogIn size={12} /> Sign in</a>
            </div>
          </div>
        )}

        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(20,20,36,0.95)', backdropFilter: 'blur(12px)', padding: '0 20px', display: 'flex', alignItems: 'center', overflowX: 'auto', flexShrink: 0, position: 'sticky', top: 64, zIndex: 50 }} className="scrollbar-hide">
          {demoMode && (
            <span style={{ fontSize: 9, fontWeight: 700, color: '#A78BFA', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)', padding: '3px 8px', borderRadius: 99, fontFamily: 'monospace', marginRight: 8, flexShrink: 0 }}>DEMO</span>
          )}
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => dispatch({ type: 'SET_TAB', tab: tab.id as any })} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '16px 14px', background: 'transparent', border: 'none', cursor: 'pointer', borderBottom: state.activeTab === tab.id ? `2px solid ${tab.color}` : '2px solid transparent', color: state.activeTab === tab.id ? tab.color : '#64748B', fontSize: 13, fontWeight: state.activeTab === tab.id ? 700 : 500, fontFamily: 'var(--font-display)', whiteSpace: 'nowrap', transition: 'all 0.15s', marginBottom: '-1px' }}>
              <tab.icon size={14} />{tab.label}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, paddingLeft: 12 }}>
            {!demoMode && (
              <button onClick={() => dispatch({ type: 'SET_TAB', tab: 'settings' })} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 100, background: state.apiKey ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.08)', border: `1px solid ${state.apiKey ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`, cursor: 'pointer' }}>
                <Key size={10} color={state.apiKey ? '#10B981' : '#EF4444'} />
                <span style={{ fontSize: 10, fontWeight: 700, color: state.apiKey ? '#10B981' : '#EF4444', fontFamily: 'monospace' }}>{state.apiKey ? 'KEY ✓' : 'ADD KEY'}</span>
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', minHeight: '100vh' }}>
          {['cv','tracks','interview','mentor','learn'].includes(state.activeTab) && <TrackRail demoMode={demoMode} />}
          <div style={{ flex: 1, overflow: 'auto', minWidth: 0 }} className="scrollbar-hide">
            {state.activeTab === 'cv'        && <CVPrepTab demoMode={demoMode} />}
            {state.activeTab === 'tracks'    && <TrackWorkspace demoMode={demoMode} />}
            {state.activeTab === 'interview' && <InterviewTab demoMode={demoMode} />}
            {state.activeTab === 'mentor'    && <MentorTab demoMode={demoMode} />}
            {state.activeTab === 'learn'     && <LearnTab />}
            {state.activeTab === 'settings'  && <SettingsTab demoMode={demoMode} />}
          </div>
        </div>
      </div>

      {state.showProModal && <ProModal />}
      <style jsx global>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>
    </div>
  );
}

function AuthGate({ action }: { action: string }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(28,28,46,0.85)', backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24, textAlign: 'center', zIndex: 10 }}>
      <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(124,58,237,0.15)', border: '2px solid rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Lock size={22} color="#A78BFA" /></div>
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#F1F0FF', fontFamily: 'var(--font-display)', marginBottom: 6 }}>Sign in to {action}</div>
        <div style={{ fontSize: 13, color: '#64748B', maxWidth: 260 }}>Free account. Takes 30 seconds.</div>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        <a href="/auth?mode=signup" style={{ background: '#7C3AED', color: '#fff', textDecoration: 'none', padding: '9px 20px', borderRadius: 100, fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-display)' }}>Sign up free ✦</a>
        <a href="/auth" style={{ background: 'rgba(255,255,255,0.06)', color: '#94A3B8', textDecoration: 'none', padding: '9px 18px', borderRadius: 100, fontSize: 13, fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)' }}>Sign in</a>
      </div>
    </div>
  );
}

function TrackRail({ demoMode }: { demoMode: boolean }) {
  const { state, dispatch, addTrack } = usePrep();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ company: '', role: '', jd_text: '' });
  const handleAdd = async () => {
    if (!form.company || !form.role) return;
    await addTrack({ ...form, cv_text: '' });
    setShowAdd(false); setForm({ company: '', role: '', jd_text: '' });
  };
  return (
    <div style={{ width: 256, minWidth: 256, borderRight: '1px solid rgba(255,255,255,0.06)', background: 'rgba(16,16,28,0.6)', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#06B6D4', fontFamily: 'monospace', letterSpacing: '0.1em' }}>JOB TRACKS</div>
          <div style={{ fontSize: 11, color: '#334155', marginTop: 1 }}>{state.tracks.length} applications{demoMode ? ' (demo)' : ''}</div>
        </div>
        <button onClick={() => !demoMode && setShowAdd(!showAdd)} style={{ width: 26, height: 26, borderRadius: 7, background: demoMode ? 'rgba(255,255,255,0.03)' : 'rgba(6,182,212,0.1)', border: `1px solid ${demoMode ? 'rgba(255,255,255,0.06)' : 'rgba(6,182,212,0.2)'}`, color: demoMode ? '#334155' : '#06B6D4', cursor: demoMode ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {demoMode ? <Lock size={11} /> : <Plus size={13} />}
        </button>
      </div>
      {showAdd && !demoMode && (
        <div style={{ padding: 12, borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(6,182,212,0.04)' }}>
          <input className="input" placeholder="Company" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} style={{ marginBottom: 6, fontSize: 12, padding: '7px 10px' }} />
          <input className="input" placeholder="Role" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} style={{ marginBottom: 6, fontSize: 12, padding: '7px 10px' }} />
          <textarea className="input" placeholder="Paste JD (optional)" value={form.jd_text} onChange={e => setForm(f => ({ ...f, jd_text: e.target.value }))} style={{ fontSize: 11, padding: '7px 10px', resize: 'none', height: 56 }} />
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            <button onClick={handleAdd} style={{ flex: 1, background: '#06B6D4', color: '#fff', border: 'none', borderRadius: 7, padding: '7px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Add</button>
            <button onClick={() => setShowAdd(false)} style={{ padding: '7px 10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, color: '#64748B', fontSize: 12, cursor: 'pointer' }}>✕</button>
          </div>
        </div>
      )}
      <div style={{ flex: 1, overflowY: 'auto' }} className="scrollbar-hide">
        {state.tracks.map(track => {
          const cfg = STATUS_CONFIG[track.status];
          const isActive = state.activeTrackId === track.id;
          return (
            <button key={track.id} onClick={() => dispatch({ type: 'SET_ACTIVE_TRACK', id: track.id })} style={{ width: '100%', padding: '11px 14px', background: isActive ? 'rgba(255,255,255,0.04)' : 'transparent', border: 'none', borderLeft: `3px solid ${isActive ? cfg.color : 'transparent'}`, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', display: 'flex', flexDirection: 'column', gap: 5 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#F1F0FF', fontFamily: 'var(--font-display)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{track.company}</div>
                  <div style={{ fontSize: 11, color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1 }}>{track.role}</div>
                </div>
                <span style={{ fontSize: 9, fontWeight: 700, color: cfg.color, background: cfg.bg, padding: '2px 6px', borderRadius: 99, fontFamily: 'monospace', whiteSpace: 'nowrap', marginLeft: 6, flexShrink: 0 }}>{cfg.label}</span>
              </div>
              {track.jobr_score > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ flex: 1, height: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 99 }}>
                    <div style={{ width: `${track.jobr_score}%`, height: '100%', background: track.jobr_score >= 80 ? '#10B981' : track.jobr_score >= 60 ? '#F97316' : '#EF4444', borderRadius: 99 }} />
                  </div>
                  <span style={{ fontSize: 9, color: '#475569', fontFamily: 'monospace' }}>{track.jobr_score}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TrackWorkspace({ demoMode }: { demoMode: boolean }) {
  const { activeTrack, updateTrackStatus, deleteTrack, calculateJobrScore, generateRoadmap, dispatch } = usePrep();
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewNotes, setInterviewNotes] = useState('');
  const [scoringLoading, setScoringLoading] = useState(false);
  const [roadmapLoading, setRoadmapLoading] = useState(false);

  if (!activeTrack) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: 48, minHeight: 400, textAlign: 'center' }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(6,182,212,0.1)', border: '2px solid rgba(6,182,212,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Briefcase size={28} color="#06B6D4" />
      </div>
      <div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#F1F0FF', fontFamily: 'var(--font-display)', marginBottom: 6 }}>Track your first application</div>
        <div style={{ fontSize: 14, color: '#475569', maxWidth: 300, lineHeight: 1.6 }}>Add a job to start tracking rounds, running mock interviews, and generating your Jobr Score.</div>
      </div>
      <div style={{ fontSize: 12, color: '#334155', display: 'flex', alignItems: 'center', gap: 6 }}>
        <Plus size={13} color="#06B6D4" /> Click the <span style={{ color: '#06B6D4', fontWeight: 600 }}>+</span> button in the left panel to add your first job
      </div>
    </div>
  );

  const cfg = STATUS_CONFIG[activeTrack.status];
  const aiFeedback = (() => { try { return activeTrack.ai_feedback ? JSON.parse(activeTrack.ai_feedback) : null; } catch { return null; } })();
  const roadmap    = (() => { try { return activeTrack.improvement_roadmap ? JSON.parse(activeTrack.improvement_roadmap) : null; } catch { return null; } })();

  return (
    <div style={{ padding: 24, maxWidth: 860, margin: '0 auto', position: 'relative' }}>
      {demoMode && (
        <div style={{ position: 'fixed', bottom: 80, right: 24, zIndex: 20 }}>
          <a href="/auth?mode=signup" style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #7C3AED, #6D28D9)', color: '#fff', textDecoration: 'none', padding: '12px 20px', borderRadius: 100, fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-display)', boxShadow: '0 4px 20px rgba(124,58,237,0.5)', animation: 'float 3s ease-in-out infinite' }}>
            <Sparkles size={14} /> Sign up to track your own applications →
          </a>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 900, color: '#F1F0FF', letterSpacing: '-0.03em', margin: 0 }}>{activeTrack.company}</h1>
            <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color, background: cfg.bg, padding: '4px 12px', borderRadius: 100, fontFamily: 'monospace', border: `1px solid ${cfg.color}30` }}>{cfg.label}</span>
            {demoMode && <span style={{ fontSize: 9, color: '#475569', fontFamily: 'monospace', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 99 }}>DEMO</span>}
          </div>
          <div style={{ fontSize: 15, color: '#94A3B8' }}>{activeTrack.role}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => dispatch({ type: 'SET_TAB', tab: 'interview' })} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', color: '#F97316', padding: '8px 16px', borderRadius: 100, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
            <Mic size={13} /> Mock Interview
          </button>
          {!demoMode && (
            <button onClick={() => deleteTrack(activeTrack.id)} style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8, color: '#EF4444', cursor: 'pointer' }}>
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28, overflowX: 'auto', paddingBottom: 4 }} className="scrollbar-hide">
        {(['applied','interview_1','interview_2','offer'] as TrackStatus[]).map((s, i, arr) => {
          const c = STATUS_CONFIG[s];
          const isActive = activeTrack.status === s;
          const isPast = c.step < cfg.step && activeTrack.status !== 'rejected';
          return (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: isActive ? c.color : isPast ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)', border: `2px solid ${isActive ? c.color : isPast ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isPast ? <CheckCircle2 size={14} color="#10B981" /> : <c.icon size={13} color={isActive ? '#fff' : '#334155'} />}
                </div>
                <span style={{ fontSize: 10, color: isActive ? c.color : '#334155', fontWeight: isActive ? 700 : 400, whiteSpace: 'nowrap' }}>{c.label}</span>
              </div>
              {i < arr.length - 1 && <div style={{ width: 36, height: 2, background: isPast ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)', margin: '0 4px', marginBottom: 20 }} />}
            </div>
          );
        })}
        {activeTrack.status === 'rejected' && <div style={{ marginLeft: 16, display: 'flex', alignItems: 'center', gap: 6 }}><AlertCircle size={14} color="#EF4444" /><span style={{ fontSize: 12, color: '#EF4444', fontWeight: 600 }}>Not selected this time</span></div>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'JOBR SCORE', value: activeTrack.jobr_score > 0 ? activeTrack.jobr_score : '—', color: activeTrack.jobr_score >= 80 ? '#10B981' : activeTrack.jobr_score >= 60 ? '#F97316' : activeTrack.jobr_score > 0 ? '#EF4444' : '#334155', sub: activeTrack.jobr_score >= 80 ? 'Great fit!' : activeTrack.jobr_score >= 60 ? 'Good match' : activeTrack.jobr_score > 0 ? 'Needs work' : 'Not scored', showBtn: true },
          { label: 'ROUND', value: activeTrack.round, color: '#F1F0FF', sub: 'of 3 rounds', showBtn: false },
          { label: 'MOCK SESSIONS', value: activeTrack.trials_used, color: '#F97316', sub: 'done', showBtn: false },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '14px 18px' }}>
            <div style={{ fontSize: 10, color: '#334155', fontFamily: 'monospace', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 30, fontWeight: 900, color: s.color, fontFamily: 'var(--font-display)', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#334155', marginTop: 2 }}>{s.sub}</div>
            {s.showBtn && activeTrack.jd_text && !demoMode && (
              <button onClick={async () => { setScoringLoading(true); await calculateJobrScore(activeTrack); setScoringLoading(false); }} disabled={scoringLoading} style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 100, padding: '4px 9px', color: '#475569', fontSize: 10, cursor: 'pointer', fontWeight: 600 }}>
                <RefreshCw size={9} style={scoringLoading ? { animation: 'spin 1s linear infinite' } : {}} />
                {scoringLoading ? 'Scoring...' : 'Score me'}
              </button>
            )}
          </div>
        ))}
      </div>

      {aiFeedback && (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 18, marginBottom: 18 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#06B6D4', fontFamily: 'monospace', marginBottom: 12 }}>JD SKILL ANALYSIS</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ fontSize: 10, color: '#10B981', marginBottom: 7, fontWeight: 600, fontFamily: 'monospace' }}>✓ MATCHED</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>{(aiFeedback.matched_skills || []).map((s: string) => <span key={s} style={{ fontSize: 11, color: '#10B981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: '3px 8px', borderRadius: 99 }}>{s}</span>)}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: '#EF4444', marginBottom: 7, fontWeight: 600, fontFamily: 'monospace' }}>✗ GAPS</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>{(aiFeedback.missing_skills || []).map((s: string) => <span key={s} style={{ fontSize: 11, color: '#EF4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', padding: '3px 8px', borderRadius: 99 }}>{s}</span>)}</div>
            </div>
          </div>
        </div>
      )}

      {activeTrack.status === 'applied' && (
        <div style={{ position: 'relative' }}>
          <div style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)', borderRadius: 16, padding: 20, ...(demoMode ? { filter: 'blur(2px)', pointerEvents: 'none' } : {}) }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#06B6D4', fontFamily: 'monospace', marginBottom: 12 }}>📋 SCHEDULE YOUR INTERVIEW</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
              <input type="date" value={interviewDate} onChange={e => setInterviewDate(e.target.value)} className="input" style={{ flex: 1, minWidth: 150, fontSize: 13 }} />
              <input placeholder="Notes (optional)" value={interviewNotes} onChange={e => setInterviewNotes(e.target.value)} className="input" style={{ flex: 2, minWidth: 180, fontSize: 13 }} />
            </div>
            <button onClick={async () => { if (!interviewDate) return; await updateTrackStatus(activeTrack.id, 'interview_1', { interview_date: interviewDate, interview_notes: interviewNotes }); setInterviewDate(''); setInterviewNotes(''); }} disabled={!interviewDate} style={{ background: '#06B6D4', color: '#fff', border: 'none', borderRadius: 100, padding: '10px 24px', fontWeight: 700, fontSize: 13, cursor: interviewDate ? 'pointer' : 'not-allowed', opacity: interviewDate ? 1 : 0.5, fontFamily: 'var(--font-display)' }}>
              🎯 Interview Scheduled → Unlock Prep Kit
            </button>
          </div>
          {demoMode && <AuthGate action="schedule your interview" />}
        </div>
      )}

      {(activeTrack.status === 'interview_1' || activeTrack.status === 'interview_2') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'relative' }}>
          {activeTrack.interview_date && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.18)', borderRadius: 10 }}>
              <Calendar size={13} color="#F97316" />
              <span style={{ fontSize: 13, color: '#F97316', fontWeight: 600 }}>Interview: {activeTrack.interview_date}</span>
            </div>
          )}
          <div style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.15)', borderRadius: 16, padding: 20, ...(demoMode ? { filter: 'blur(1px)' } : {}) }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#F97316', fontFamily: 'monospace', marginBottom: 14 }}>🎯 {activeTrack.status === 'interview_1' ? 'ROUND 1' : 'ROUND 2'} PREP KIT</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
              {[
                { icon: Mic, label: 'AI Mock Interview', desc: `${3 - activeTrack.trials_used} free left`, color: '#F97316', tab: 'interview' },
                { icon: BookOpen, label: 'Bite-sized Notes', desc: 'Last-minute cheat sheet', color: '#10B981', tab: 'learn' },
                { icon: Users, label: 'Book a Mentor', desc: '1:1 expert coaching', color: '#4F46E5', tab: 'mentor' },
              ].map(item => (
                <button key={item.label} onClick={() => dispatch({ type: 'SET_TAB', tab: item.tab as any })} style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 14, background: `${item.color}0e`, border: `1px solid ${item.color}22`, borderRadius: 12, cursor: 'pointer', textAlign: 'left', transition: 'transform 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}>
                  <item.icon size={18} color={item.color} />
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#F1F0FF', fontFamily: 'var(--font-display)' }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: '#475569' }}>{item.desc}</div>
                </button>
              ))}
            </div>
          </div>
          <div style={{ background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.15)', borderRadius: 16, padding: 20, ...(demoMode ? { filter: 'blur(1px)' } : {}) }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#A78BFA', fontFamily: 'monospace', marginBottom: 10 }}>📊 HOW DID IT GO?</div>
            <p style={{ fontSize: 13, color: '#64748B', marginBottom: 12 }}>Log your result after the interview.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={async () => { const next: TrackStatus = activeTrack.status === 'interview_1' ? 'interview_2' : 'offer'; await updateTrackStatus(activeTrack.id, next, { round: activeTrack.round + 1 }); }} style={{ flex: 1, padding: '11px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.22)', borderRadius: 10, color: '#10B981', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>✓ I Was Selected!</button>
              <button onClick={async () => { await updateTrackStatus(activeTrack.id, 'rejected'); if (activeTrack.jd_text) { setRoadmapLoading(true); await generateRoadmap(activeTrack); setRoadmapLoading(false); } }} style={{ flex: 1, padding: '11px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 10, color: '#EF4444', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>✗ Not This Time</button>
            </div>
          </div>
          {demoMode && <AuthGate action="access your prep kit" />}
        </div>
      )}

      {activeTrack.status === 'offer' && (
        <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.10), rgba(6,182,212,0.06))', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 20, padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>🎉</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 900, color: '#10B981', marginBottom: 8 }}>{demoMode ? 'This student got the offer!' : 'You got the offer!'}</h2>
          <p style={{ fontSize: 14, color: '#94A3B8' }}>{activeTrack.interview_notes || `${activeTrack.role} at ${activeTrack.company}`}</p>
          {demoMode && <a href="/auth?mode=signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#10B981', color: '#fff', textDecoration: 'none', padding: '11px 24px', borderRadius: 100, fontWeight: 700, fontSize: 14, marginTop: 16, fontFamily: 'var(--font-display)' }}><Sparkles size={14} /> Get your own offer track →</a>}
        </div>
      )}

      {activeTrack.status === 'rejected' && !roadmap && (
        <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 16, padding: 20, position: 'relative' }}>
          <div style={{ ...(demoMode ? { filter: 'blur(2px)' } : {}) }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#EF4444', fontFamily: 'monospace', marginBottom: 10 }}>📈 GENERATE IMPROVEMENT ROADMAP</div>
            <button onClick={async () => { setRoadmapLoading(true); await generateRoadmap(activeTrack); setRoadmapLoading(false); }} disabled={roadmapLoading} style={{ background: '#EF4444', color: '#fff', border: 'none', borderRadius: 100, padding: '10px 24px', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}>
              {roadmapLoading ? <><RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} /> Generating...</> : <><Sparkles size={13} /> Generate My Roadmap</>}
            </button>
          </div>
          {demoMode && <AuthGate action="generate your roadmap" />}
        </div>
      )}

      {activeTrack.status === 'rejected' && roadmap && (
        <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 16, padding: 22 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#EF4444', fontFamily: 'monospace', marginBottom: 14 }}>📈 IMPROVEMENT ROADMAP</div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 10, padding: '11px 14px', marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: '#EF4444', fontWeight: 600, marginBottom: 4, fontFamily: 'monospace' }}>ROOT CAUSE</div>
            <p style={{ fontSize: 13, color: '#94A3B8', margin: 0, lineHeight: 1.6 }}>{roadmap.root_cause}</p>
          </div>
          {roadmap.skill_gaps?.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace', marginBottom: 7 }}>SKILL GAPS</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{roadmap.skill_gaps.map((s: string) => <span key={s} style={{ fontSize: 11, color: '#EF4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', padding: '3px 9px', borderRadius: 100 }}>{s}</span>)}</div>
            </div>
          )}
          {roadmap.action_items?.map((item: any, i: number) => (
            <div key={i} style={{ display: 'flex', gap: 11, marginBottom: 10, alignItems: 'flex-start' }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: '#EF4444', flexShrink: 0 }}>{i + 1}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#F1F0FF' }}>{item.action}</div>
                <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{item.timeline} · {item.resource}</div>
              </div>
            </div>
          ))}
          {roadmap.encouragement && <div style={{ padding: '10px 13px', background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.14)', borderRadius: 9, fontSize: 13, color: '#10B981', fontStyle: 'italic', marginTop: 8 }}>💪 {roadmap.encouragement}</div>}
        </div>
      )}
    </div>
  );
}

function CVPrepTab({ demoMode }: { demoMode: boolean }) {
  const { state, dispatch } = usePrep();
  const [apiKey,     setApiKeyLocal] = useState(state.apiKey);
  const [cvText,     setCvText]      = useState('');
  const [jdText,     setJdText]      = useState('');
  const [loading,    setLoading]     = useState(false);
  const [keyTesting, setKeyTesting]  = useState(false);
  const [keyValid,   setKeyValid]    = useState<boolean | null>(null);
  const [result,     setResult]      = useState<any>(null);
  const [error,      setError]       = useState('');
  const [cvMeta,     setCvMeta]      = useState<{ mode?: string; freeUsed?: number; freeLimit?: number; creditsRemaining?: number } | null>(null);

  useEffect(() => {
    setCvText(localStorage.getItem('jobr_last_cv') || '');
    setJdText(localStorage.getItem('jobr_last_jd') || '');
    const saved = localStorage.getItem('last_optimized_cv');
    if (saved) { try { setResult(JSON.parse(saved)); } catch {} }
  }, []);

  const saveKey = async () => {
    if (!apiKey.trim()) return;
    setKeyTesting(true); setKeyValid(null);
    try {
      const res = await fetch('/api/proxy', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userApiKey: apiKey, cvText: 'Test CV', jdText: 'Test JD' }),
      });
      if (res.ok) {
        dispatch({ type: 'SET_API_KEY', key: apiKey });
        localStorage.setItem('jobr_gemini_key', apiKey);
        setKeyValid(true);
      } else {
        const data = await res.json();
        setKeyValid(false);
        setError(data?.error || 'Invalid key');
      }
    } catch { setKeyValid(false); }
    finally { setKeyTesting(false); }
  };

  const handleOptimize = async () => {
    if (demoMode) return;
    setError(''); setLoading(true); setCvMeta(null);
    try {
      const res = await fetch('/api/proxy', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userApiKey: (apiKey || state.apiKey) || undefined,
          userEmail:  state.userEmail || undefined,
          cvText,
          jdText,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const err: any = new Error(data.error);
        err.requiresCredits = data.requiresCredits;
        err.requiresAuth    = data.requiresAuth;
        throw err;
      }
      const raw  = data.candidates?.[0]?.content?.parts?.[0]?.text;
      const json = JSON.parse(raw?.match(/\{[\s\S]*\}/)?.[0] || '{}');
      setResult(json);
      if (data.meta) setCvMeta(data.meta);
      localStorage.setItem('last_optimized_cv', JSON.stringify(json));
      localStorage.setItem('jobr_last_cv', cvText);
      localStorage.setItem('jobr_last_jd', jdText);
    } catch (e: any) {
      if (e.requiresCredits) {
        setError(`Free optimizations used up. Top up credits at jobr.co.in/profile — or add your own API key in Settings (free with Gemini).`);
      } else if (e.requiresAuth) {
        setError('Sign in to use Jobr credits, or add your own API key in Settings.');
      } else {
        setError(e.message);
      }
    } finally { setLoading(false); }
  };

  const handleDownloadPDF = () => {
    if (!result) return;
    const pw = window.open('', '_blank');
    if (!pw) return;
    pw.document.write(`<!DOCTYPE html><html><head><title>${result.header?.name || 'CV'} — Jobr</title><style>
      *{margin:0;padding:0;box-sizing:border-box}body{font-family:Georgia,serif;color:#111;padding:40px;max-width:800px;margin:0 auto}
      h1{font-size:28px;font-weight:900;text-transform:uppercase;letter-spacing:-0.02em;margin-bottom:4px}
      .contact{font-size:12px;color:#666;margin-bottom:24px}.label{font-size:9px;font-weight:900;letter-spacing:0.2em;color:#7C3AED;text-transform:uppercase;margin:20px 0 8px;border-bottom:2px solid #7C3AED;padding-bottom:4px}
      .title{font-weight:700;font-size:14px;margin-bottom:2px}.sub{font-size:12px;color:#888;margin-bottom:6px}
      ul{padding-left:16px}li{font-size:13px;color:#333;margin-bottom:5px;line-height:1.5}
      .summary{font-size:14px;line-height:1.7;color:#333}.skills{font-size:13px;color:#444;line-height:1.8}
      .bar{border-top:8px solid #7C3AED;padding-top:20px}.footer{margin-top:40px;font-size:10px;color:#ccc;text-align:center}
      @media print{body{padding:20px}}
    </style></head><body><div class="bar">
      <h1>${result.header?.name || 'Your Name'}</h1>
      <p class="contact">${[result.header?.email, result.header?.phone, result.header?.location].filter(Boolean).join(' · ')}</p>
      ${result.summary ? `<p class="label">Professional Summary</p><p class="summary">${result.summary}</p>` : ''}
      ${(result.experience || []).map((j: any) => `<p class="label">Experience</p><p class="title">${j.role || j.title}</p><p class="sub">${j.company}${j.duration ? ' · ' + j.duration : ''}</p><ul>${(j.bullets || []).map((b: string) => `<li>${b}</li>`).join('')}</ul>`).join('')}
      ${(result.education || []).length > 0 ? `<p class="label">Education</p>${(result.education || []).map((e: any) => `<p class="title">${e.institution}</p><p class="sub">${e.degree}${e.year ? ' · ' + e.year : ''}</p>`).join('')}` : ''}
      ${result.skills?.length > 0 ? `<p class="label">Skills</p><p class="skills">${result.skills.join(' · ')}</p>` : ''}
      <p class="footer">Optimized by Jobr.co.in — India's AI Career Platform</p>
    </div></body></html>`);
    pw.document.close(); pw.focus();
    setTimeout(() => { pw.print(); pw.close(); }, 500);
  };

  const freeRemaining = cvMeta?.freeLimit !== undefined ? cvMeta.freeLimit - (cvMeta.freeUsed || 0) : null;

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: 'calc(100vh - 120px)', position: 'relative' }}>
      <div style={{ width: 340, minWidth: 340, borderRight: '1px solid rgba(255,255,255,0.06)', padding: 18, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', ...(demoMode ? { filter: 'blur(2px)', pointerEvents: 'none' } : {}) }} className="scrollbar-hide">

        {/* Usage indicator */}
        {!state.apiKey && !demoMode && (
          <div style={{ padding: '10px 14px', background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.18)', borderRadius: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#A78BFA', fontFamily: 'monospace', marginBottom: 4 }}>JOBR CREDITS</div>
            <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.5 }}>
              3 free optimizations included. After that, 1 credit (₹100) per optimization — or add your own free Gemini key below.
            </div>
            <a href="/profile" style={{ fontSize: 11, color: '#A78BFA', fontWeight: 700, textDecoration: 'none', display: 'block', marginTop: 6 }}>View credits → jobr.co.in/profile</a>
          </div>
        )}

        {/* Success meta */}
        {cvMeta && (
          <div style={{ padding: '9px 12px', background: cvMeta.mode === 'free' ? 'rgba(16,185,129,0.08)' : 'rgba(124,58,237,0.08)', border: `1px solid ${cvMeta.mode === 'free' ? 'rgba(16,185,129,0.2)' : 'rgba(124,58,237,0.2)'}`, borderRadius: 9, fontSize: 12 }}>
            {cvMeta.mode === 'free' && (
              <span style={{ color: '#10B981' }}>✓ Free optimization used — {cvMeta.freeLimit! - cvMeta.freeUsed!} of {cvMeta.freeLimit} remaining</span>
            )}
            {cvMeta.mode === 'credits' && (
              <span style={{ color: '#A78BFA' }}>✓ 1 credit used — {cvMeta.creditsRemaining} credits remaining</span>
            )}
          </div>
        )}

        {/* API Key */}
        <div style={{ padding: 12, background: 'rgba(124,58,237,0.07)', border: `1px solid ${keyValid === true ? 'rgba(16,185,129,0.35)' : keyValid === false ? 'rgba(239,68,68,0.35)' : 'rgba(124,58,237,0.18)'}`, borderRadius: 12, transition: 'border-color 0.2s' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#A78BFA', fontFamily: 'monospace', marginBottom: 7 }}>YOUR API KEY <span style={{ color: '#334155', fontWeight: 400 }}>(optional — use your own key)</span></div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 5 }}>
            <input type="password" placeholder="AIzaSy... / sk-... / sk-ant-..." value={apiKey} onChange={e => { setApiKeyLocal(e.target.value); setKeyValid(null); }} onKeyDown={e => e.key === 'Enter' && saveKey()} className="input" style={{ fontSize: 12, padding: '7px 10px' }} />
            <button onClick={saveKey} disabled={keyTesting || !apiKey.trim()} style={{ background: keyValid === true ? '#10B981' : keyValid === false ? '#EF4444' : '#7C3AED', color: '#fff', border: 'none', borderRadius: 8, padding: '0 11px', fontWeight: 700, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap', minWidth: 54, transition: 'background 0.2s' }}>
              {keyTesting ? '...' : keyValid === true ? '✓ OK' : keyValid === false ? '✗ Bad' : 'Test'}
            </button>
          </div>
          {keyValid === true  && <div style={{ fontSize: 11, color: '#10B981' }}>✓ Key verified — unlimited optimizations</div>}
          {keyValid === false && <div style={{ fontSize: 11, color: '#EF4444' }}>✗ Invalid key. Check and try again.</div>}
          {keyValid === null  && (
            <div style={{ fontSize: 10, color: '#475569' }}>
              Supports Gemini · OpenAI · Anthropic ·{' '}
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ color: '#7C3AED' }}>Get free Gemini key →</a>
            </div>
          )}
        </div>

        <div>
          <label style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace', display: 'block', marginBottom: 5 }}>YOUR CV</label>
          <textarea className="input" placeholder="Paste your CV text here..." value={cvText} onChange={e => { setCvText(e.target.value); localStorage.setItem('jobr_last_cv', e.target.value); }} style={{ height: 150, resize: 'none', fontSize: 12 }} />
        </div>
        <div>
          <label style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace', display: 'block', marginBottom: 5 }}>JOB DESCRIPTION</label>
          <textarea className="input" placeholder="Paste the JD here..." value={jdText} onChange={e => { setJdText(e.target.value); localStorage.setItem('jobr_last_jd', e.target.value); }} style={{ height: 150, resize: 'none', fontSize: 12 }} />
        </div>

        {error && (
          <div style={{ padding: '9px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 9, fontSize: 12, color: '#EF4444', lineHeight: 1.5 }}>
            {error}
            {error.includes('profile') && (
              <a href="/profile" style={{ display: 'block', marginTop: 6, color: '#F97316', fontWeight: 700 }}>Top up credits →</a>
            )}
          </div>
        )}

        <button onClick={handleOptimize} disabled={loading || (!state.apiKey && !state.userEmail)} style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)', color: '#fff', border: 'none', borderRadius: 100, padding: '12px', fontWeight: 700, fontSize: 14, cursor: loading || (!state.apiKey && !state.userEmail) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'var(--font-display)', opacity: loading || (!state.apiKey && !state.userEmail) ? 0.6 : 1 }}>
          {loading ? <><RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> Processing...</> : <><Sparkles size={14} /> Optimize My CV</>}
        </button>

        {result && (
          <button onClick={handleDownloadPDF} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', color: '#A78BFA', borderRadius: 100, padding: '10px', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
            <Download size={14} /> Download as PDF
          </button>
        )}
        {result && (
          <a href="/dashboard/send" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', color: '#06B6D4', borderRadius: 100, padding: '10px', fontWeight: 700, fontSize: 13, textDecoration: 'none', fontFamily: 'var(--font-display)' }}>
            <Send size={13} /> Send via Gmail →
          </a>
        )}
      </div>

      {demoMode && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: 340, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24, textAlign: 'center', zIndex: 10 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(124,58,237,0.15)', border: '2px solid rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Lock size={22} color="#A78BFA" /></div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#F1F0FF', fontFamily: 'var(--font-display)', marginBottom: 6 }}>Free to use — sign up first</div>
            <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6 }}>3 free optimizations included. Works with Gemini (free), OpenAI, or Anthropic.</div>
          </div>
          <a href="/auth?mode=signup" style={{ background: '#7C3AED', color: '#fff', textDecoration: 'none', padding: '10px 24px', borderRadius: 100, fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-display)' }}>Sign up free →</a>
        </div>
      )}

      <div style={{ flex: 1, padding: 24, overflowY: 'auto', background: '#05070A', maxHeight: 'calc(100vh - 130px)' }} className="scrollbar-hide">
        {result ? (
          <div id="cv-preview" style={{ maxWidth: 620, margin: '0 auto', background: '#fff', color: '#111', padding: '40px 36px', borderRadius: 4, borderTop: '10px solid #7C3AED', boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}>
            <h1 style={{ fontSize: 26, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: 4, color: '#111' }}>{result.header?.name || 'Your Name'}</h1>
            {result.header?.email && <p style={{ fontSize: 11, color: '#666', marginBottom: 20 }}>{[result.header.email, result.header.phone, result.header.location].filter(Boolean).join(' · ')}</p>}
            {result.summary && <div style={{ marginBottom: 18 }}><div style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.2em', color: '#7C3AED', textTransform: 'uppercase', marginBottom: 6 }}>PROFESSIONAL SUMMARY</div><p style={{ fontSize: 13, lineHeight: 1.6, color: '#333', margin: 0 }}>{result.summary}</p></div>}
            {result.experience?.map((job: any, i: number) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.2em', color: '#7C3AED', textTransform: 'uppercase', marginBottom: 6 }}>EXPERIENCE</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#111' }}>{job.company} — <span style={{ color: '#7C3AED' }}>{job.role || job.title}</span></div>
                {job.duration && <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{job.duration}</div>}
                <ul style={{ marginTop: 6, paddingLeft: 16 }}>{job.bullets?.map((b: string, j: number) => <li key={j} style={{ fontSize: 12, color: '#444', marginBottom: 4, lineHeight: 1.5 }}>{b}</li>)}</ul>
              </div>
            ))}
            {result.education?.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.2em', color: '#7C3AED', textTransform: 'uppercase', marginBottom: 6 }}>EDUCATION</div>
                {result.education.map((e: any, i: number) => <div key={i} style={{ marginBottom: 6 }}><div style={{ fontWeight: 700, fontSize: 13, color: '#111' }}>{e.institution}</div><div style={{ fontSize: 12, color: '#666' }}>{e.degree}{e.year ? ' · ' + e.year : ''}</div></div>)}
              </div>
            )}
            {result.skills?.length > 0 && <div><div style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.2em', color: '#7C3AED', textTransform: 'uppercase', marginBottom: 6 }}>SKILLS</div><p style={{ fontSize: 12, color: '#444', margin: 0 }}>{result.skills.join(' · ')}</p></div>}
          </div>
        ) : (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, opacity: 0.35 }}>
            <FileText size={44} color="#334155" />
            <div style={{ fontSize: 15, color: '#475569', fontWeight: 600 }}>Your optimized CV will appear here</div>
            <div style={{ fontSize: 13, color: '#334155', textAlign: 'center', maxWidth: 280 }}>Paste your CV + JD and click Optimize</div>
          </div>
        )}
      </div>
    </div>
  );
}
function InterviewTab({ demoMode }: { demoMode: boolean }) {
  const { state, dispatch, startMockInterview, sendMockAnswer, activeTrack } = usePrep();
  const [answer, setAnswer] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [state.mockSession]);
  const handleSend = async () => {
    if (!answer.trim() || !activeTrack) return;
    const a = answer; setAnswer('');
    await sendMockAnswer(a, activeTrack);
  };
  if (demoMode) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, gap: 20, textAlign: 'center', background: '#05070A', minHeight: 'calc(100vh - 160px)' }}>
      <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(249,115,22,0.1)', border: '2px solid rgba(249,115,22,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mic size={30} color="#F97316" /></div>
      <div><h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, color: '#F1F0FF', marginBottom: 8 }}>AI Mock Interview</h2><p style={{ fontSize: 14, color: '#64748B', maxWidth: 360, lineHeight: 1.6 }}>The AI reads the actual JD. 3 free sessions per account.</p></div>
      <a href="/auth?mode=signup" style={{ background: 'linear-gradient(135deg, #F97316, #EA6B0A)', color: '#fff', textDecoration: 'none', borderRadius: 100, padding: '13px 36px', fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 9 }}><Sparkles size={16} /> Sign up for 3 free sessions</a>
    </div>
  );
  const trialsLeft = FREE_MOCK_LIMIT - state.trialsUsed;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 'calc(100vh - 120px)', background: '#05070A' }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(249,115,22,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#F97316', fontFamily: 'var(--font-display)' }}>Interview.Prep {activeTrack ? `— ${activeTrack.company} · ${activeTrack.role}` : ''}</div>
          <div style={{ fontSize: 11, color: '#475569', marginTop: 1 }}>{trialsLeft > 0 ? `${trialsLeft} free sessions remaining` : 'Free limit reached'}</div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 4 }}>{[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: i < state.trialsUsed ? '#F97316' : 'rgba(255,255,255,0.08)' }} />)}</div>
          {state.mockActive && <button onClick={() => dispatch({ type: 'RESET_MOCK' })} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)', color: '#EF4444', padding: '5px 11px', borderRadius: 100, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}><X size={11} /> End</button>}
        </div>
      </div>
      {!state.mockActive ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, gap: 20, textAlign: 'center' }}>
          <div style={{ width: 76, height: 76, borderRadius: '50%', background: 'rgba(249,115,22,0.1)', border: '2px solid rgba(249,115,22,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mic size={30} color="#F97316" /></div>
          <div><h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, color: '#F1F0FF', marginBottom: 8 }}>AI Mock Interview</h2><p style={{ fontSize: 14, color: '#64748B', maxWidth: 360, lineHeight: 1.6 }}>{activeTrack ? `Practice for ${activeTrack.role} at ${activeTrack.company}.` : 'Select a job track to start.'}</p></div>
          {trialsLeft > 0 ? (
            <button onClick={() => activeTrack && startMockInterview(activeTrack)} disabled={!activeTrack} style={{ background: 'linear-gradient(135deg, #F97316, #EA6B0A)', color: '#fff', border: 'none', borderRadius: 100, padding: '13px 36px', fontWeight: 700, fontSize: 15, cursor: activeTrack ? 'pointer' : 'not-allowed', opacity: activeTrack ? 1 : 0.5, fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 9 }}><Mic size={17} /> Start Mock Interview</button>
          ) : (
            <button onClick={() => dispatch({ type: 'SET_SHOW_PRO_MODAL', show: true })} style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)', color: '#fff', border: 'none', borderRadius: 100, padding: '13px 36px', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 9 }}><Lock size={17} /> Unlock Prep Pro</button>
          )}
          <div style={{ fontSize: 11, color: '#334155' }}>{trialsLeft > 0 ? `${trialsLeft} of ${FREE_MOCK_LIMIT} free remaining` : '₹299/month unlimited'}</div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }} className="scrollbar-hide">
            {state.mockSession.map((msg, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexDirection: msg.role === 'interviewer' ? 'row' : 'row-reverse' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: msg.role === 'interviewer' ? 'rgba(249,115,22,0.18)' : 'rgba(124,58,237,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{msg.role === 'interviewer' ? '🤖' : '👤'}</div>
                <div style={{ maxWidth: '74%', padding: '11px 15px', borderRadius: msg.role === 'interviewer' ? '4px 14px 14px 14px' : '14px 4px 14px 14px', background: msg.role === 'interviewer' ? 'rgba(249,115,22,0.07)' : 'rgba(124,58,237,0.07)', border: `1px solid ${msg.role === 'interviewer' ? 'rgba(249,115,22,0.12)' : 'rgba(124,58,237,0.12)'}` }}>
                  <p style={{ fontSize: 14, color: '#E2E8F0', lineHeight: 1.6, margin: 0 }}>{msg.content}</p>
                  <div style={{ fontSize: 9, color: '#334155', marginTop: 5, fontFamily: 'monospace' }}>{new Date(msg.timestamp).toLocaleTimeString()}</div>
                </div>
              </div>
            ))}
            {state.mockLoading && (
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(249,115,22,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🤖</div>
                <div style={{ padding: '11px 15px', borderRadius: '4px 14px 14px 14px', background: 'rgba(249,115,22,0.07)', display: 'flex', gap: 5, alignItems: 'center' }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#F97316', animation: `pulse-dot 1.2s ${i * 0.2}s infinite` }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div style={{ padding: '14px 18px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 10 }}>
            <textarea value={answer} onChange={e => setAnswer(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="Type your answer... (Enter to send)" className="input" style={{ flex: 1, resize: 'none', height: 50, fontSize: 14, paddingTop: 13 }} />
            <button onClick={handleSend} disabled={!answer.trim() || state.mockLoading} style={{ width: 50, height: 50, background: 'linear-gradient(135deg, #F97316, #EA6B0A)', border: 'none', borderRadius: 11, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: (!answer.trim() || state.mockLoading) ? 0.4 : 1 }}><Send size={17} /></button>
          </div>
        </div>
      )}
    </div>
  );
}

function MentorTab({ demoMode }: { demoMode: boolean }) {
  const MENTORS = [
    { name: 'Priya Sharma', role: 'Ex-Google PM · IIM-A',           domain: 'Product Management',  rate: 25, rating: 4.9, sessions: 48, color: '#4F46E5' },
    { name: 'Arjun Mehta',  role: 'Staff Engineer @ Swiggy',        domain: 'Software Engineering', rate: 20, rating: 4.8, sessions: 62, color: '#0D9488' },
    { name: 'Sneha Iyer',   role: 'Data Science Lead · Ex-Netflix', domain: 'Data Science & AI',    rate: 18, rating: 4.7, sessions: 35, color: '#06B6D4' },
  ];
  return (
    <div style={{ padding: 24, maxWidth: 780 }}>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#4F46E5', fontFamily: 'monospace', marginBottom: 5 }}>MENTOR.PREP</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, color: '#F1F0FF', marginBottom: 5 }}>Book a 1:1 Session</h2>
        <p style={{ fontSize: 13, color: '#64748B' }}>Expert mentors. Credits or UPI. No subscription.</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {MENTORS.map(m => (
          <div key={m.name} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', transition: 'all 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${m.color}30`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg, ${m.color}, ${m.color}80)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 900, color: '#fff', flexShrink: 0 }}>{m.name[0]}</div>
            <div style={{ flex: 1, minWidth: 140 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#F1F0FF', fontFamily: 'var(--font-display)' }}>{m.name}</div>
              <div style={{ fontSize: 11, color: '#64748B' }}>{m.role}</div>
              <span style={{ fontSize: 9, color: m.color, background: `${m.color}15`, padding: '2px 7px', borderRadius: 100, fontFamily: 'monospace', marginTop: 3, display: 'inline-block' }}>{m.domain}</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 17, fontWeight: 900, color: m.color, fontFamily: 'var(--font-display)' }}>{m.rate} cr</div>
              <div style={{ fontSize: 10, color: '#475569' }}>per hour</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#F1F0FF' }}>{'★'.repeat(Math.round(m.rating))}</div>
              <div style={{ fontSize: 10, color: '#475569' }}>{m.sessions} sessions</div>
            </div>
            {demoMode ? (
              <a href="/auth?mode=signup" style={{ background: m.color, color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 12, padding: '9px 18px', borderRadius: 100, fontFamily: 'var(--font-display)', whiteSpace: 'nowrap' }}>Sign up to book →</a>
            ) : (
              <a href="/mentor" style={{ background: m.color, color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 12, padding: '9px 18px', borderRadius: 100, fontFamily: 'var(--font-display)', whiteSpace: 'nowrap' }}>Book →</a>
            )}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, padding: '13px 18px', background: 'rgba(79,70,229,0.05)', border: '1px solid rgba(79,70,229,0.12)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
        <ExternalLink size={14} color="#4F46E5" />
        <span style={{ fontSize: 13, color: '#64748B' }}>View all mentors on</span>
        <a href="/mentor" style={{ fontSize: 13, fontWeight: 700, color: '#4F46E5' }}>Mentor.Jobr →</a>
      </div>
    </div>
  );
}

function LearnTab() {
  const { activeTrack } = usePrep();
  const skillGaps: string[] = (() => {
    if (!activeTrack?.ai_feedback) return Object.keys(COURSE_DATA).slice(0, 5);
    try { const f = JSON.parse(activeTrack.ai_feedback); return f.missing_skills?.length > 0 ? f.missing_skills : Object.keys(COURSE_DATA).slice(0, 5); }
    catch { return Object.keys(COURSE_DATA).slice(0, 5); }
  })();
  const courses = skillGaps.flatMap(skill => (COURSE_DATA[skill] || []).map(c => ({ ...c, skill })));
  return (
    <div style={{ padding: 24, maxWidth: 780 }}>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#10B981', fontFamily: 'monospace', marginBottom: 5 }}>LEARN.PREP</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, color: '#F1F0FF', marginBottom: 5 }}>{activeTrack ? `Resources for ${activeTrack.role}` : 'Curated Learning'}</h2>
        <p style={{ fontSize: 13, color: '#64748B' }}>{activeTrack?.ai_feedback ? 'Based on your skill gap analysis.' : 'Top resources for high-demand skills.'}</p>
      </div>
      {courses.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
          {courses.map((c, i) => (
            <a key={i} href={c.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.12)', borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 7, transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(16,185,129,0.3)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(16,185,129,0.12)'; }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 9, color: '#10B981', background: 'rgba(16,185,129,0.1)', padding: '2px 7px', borderRadius: 100, fontFamily: 'monospace' }}>{c.skill}</span>
                <ExternalLink size={11} color="#334155" />
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#F1F0FF', lineHeight: 1.4, fontFamily: 'var(--font-display)' }}>{c.title}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: '#475569' }}>{c.provider}</span>
                <span style={{ fontSize: 10, color: '#334155', fontFamily: 'monospace' }}>{c.duration}</span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: 60, opacity: 0.4 }}>
          <BookOpen size={40} color="#334155" style={{ marginBottom: 10 }} />
          <div style={{ fontSize: 14, color: '#475569' }}>Run Jobr Score to get personalised recommendations</div>
        </div>
      )}
      <div style={{ marginTop: 20, padding: '16px 20px', background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.12)', borderRadius: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#A78BFA', fontFamily: 'monospace', marginBottom: 6 }}>FOR EDTECH COMPANIES</div>
        <p style={{ fontSize: 13, color: '#64748B', marginBottom: 10, lineHeight: 1.5 }}>Feature your courses here — shown to students with matching skill gaps.</p>
        <a href="mailto:nitish@jobr.co.in?subject=EdTech Course Partnership" style={{ fontSize: 13, fontWeight: 700, color: '#A78BFA', textDecoration: 'none' }}>Contact → nitish@jobr.co.in</a>
      </div>
    </div>
  );
}

function SettingsTab({ demoMode }: { demoMode: boolean }) {
  const { state, dispatch } = usePrep();
  const [keys, setKeys] = useState({ gemini: state.providerKeys.gemini, openai: state.providerKeys.openai, anthropic: state.providerKeys.anthropic });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    if (keys.gemini)    localStorage.setItem('jobr_gemini_key', keys.gemini);
    if (keys.openai)    localStorage.setItem('jobr_openai_key', keys.openai);
    if (keys.anthropic) localStorage.setItem('jobr_anthropic_key', keys.anthropic);
    if (keys.gemini)    dispatch({ type: 'SET_PROVIDER_KEY', provider: 'gemini',    key: keys.gemini });
    if (keys.openai)    dispatch({ type: 'SET_PROVIDER_KEY', provider: 'openai',    key: keys.openai });
    if (keys.anthropic) dispatch({ type: 'SET_PROVIDER_KEY', provider: 'anthropic', key: keys.anthropic });
    if (state.userEmail) {
      const { createClient } = await import('@supabase/supabase-js');
      const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
      await sb.from('user_settings').upsert({
        email: state.userEmail,
        gemini_key: keys.gemini || null,
        openai_key: keys.openai || null,
        anthropic_key: keys.anthropic || null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' });
    }
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('jobr_session');
    localStorage.removeItem('jobr_user');
    window.location.href = '/';
  };

  const PROVIDER_CONFIGS = [
    { key: 'gemini' as const,    label: 'Google Gemini',    placeholder: 'AIzaSy...',    url: 'https://aistudio.google.com/app/apikey',          urlLabel: 'aistudio.google.com',    color: '#4285F4', free: true  },
    { key: 'openai' as const,    label: 'OpenAI',           placeholder: 'sk-proj-...',  url: 'https://platform.openai.com/api-keys',            urlLabel: 'platform.openai.com',    color: '#10A37F', free: false },
    { key: 'anthropic' as const, label: 'Anthropic Claude', placeholder: 'sk-ant-...',   url: 'https://console.anthropic.com/settings/keys',     urlLabel: 'console.anthropic.com',  color: '#D97706', free: false },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 680 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#64748B', fontFamily: 'monospace', marginBottom: 5 }}>SETTINGS</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, color: '#F1F0FF', marginBottom: 5 }}>AI Keys & Account</h2>
        <p style={{ fontSize: 13, color: '#64748B' }}>Your keys are stored securely. We never use them for anything except your requests.</p>
      </div>
      {demoMode && (
        <div style={{ padding: '12px 16px', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 12, marginBottom: 20, fontSize: 13, color: '#A78BFA' }}>
          <a href="/auth?mode=signup" style={{ color: '#A78BFA', fontWeight: 700 }}>Sign up</a> to save your API keys across devices.
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
        {PROVIDER_CONFIGS.map(p => (
          <div key={p.key} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${keys[p.key] ? `${p.color}30` : 'rgba(255,255,255,0.07)'}`, borderRadius: 14, padding: '16px 18px', transition: 'border-color 0.2s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: keys[p.key] ? '#10B981' : 'rgba(255,255,255,0.15)' }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#F1F0FF', fontFamily: 'var(--font-display)' }}>{p.label}</span>
                {p.free && <span style={{ fontSize: 9, color: '#10B981', background: 'rgba(16,185,129,0.1)', padding: '2px 6px', borderRadius: 99, fontFamily: 'monospace' }}>FREE TIER</span>}
              </div>
              {keys[p.key] && <span style={{ fontSize: 10, color: '#10B981', fontFamily: 'monospace' }}>✓ SET</span>}
            </div>
            <input type="password" placeholder={p.placeholder} value={keys[p.key]} onChange={e => setKeys(k => ({ ...k, [p.key]: e.target.value }))} className="input" style={{ fontSize: 13, marginBottom: 6 }} />
            <a href={p.url} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: '#475569', textDecoration: 'none' }}>Get key → {p.urlLabel}</a>
          </div>
        ))}
      </div>
      <button onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 8, background: saved ? '#10B981' : '#7C3AED', color: '#fff', border: 'none', borderRadius: 100, padding: '12px 28px', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-display)', transition: 'background 0.2s', marginBottom: 32 }}>
        <Save size={15} />
        {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Keys'}
      </button>
      {!demoMode && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#334155', fontFamily: 'monospace', marginBottom: 14 }}>ACCOUNT</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, padding: '12px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#A78BFA' }}>
              {state.userName?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#F1F0FF' }}>{state.userName}</div>
              <div style={{ fontSize: 12, color: '#475569' }}>{state.userEmail}</div>
            </div>
          </div>
          <button onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)', color: '#EF4444', padding: '9px 18px', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function ProModal() {
  const { dispatch } = usePrep();
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#24243A', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 22, padding: '32px 28px', maxWidth: 420, width: '100%', textAlign: 'center', position: 'relative' }}>
        <button onClick={() => dispatch({ type: 'SET_SHOW_PRO_MODAL', show: false })} style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748B', borderRadius: 7, width: 26, height: 26, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={13} /></button>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #F97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: 22 }}>⚡</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, color: '#F1F0FF', marginBottom: 8 }}>Unlock Prep Pro</h2>
        <p style={{ fontSize: 14, color: '#64748B', marginBottom: 20, lineHeight: 1.6 }}>3 free mock interviews used. Upgrade for unlimited access.</p>
        <div style={{ background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 12, padding: '14px 18px', marginBottom: 18, textAlign: 'left' }}>
          {['Unlimited AI Mock Interviews','Adaptive difficulty engine','Detailed performance scoring','Priority mentor booking'].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}><CheckCircle2 size={13} color="#10B981" /><span style={{ fontSize: 13, color: '#94A3B8' }}>{f}</span></div>
          ))}
        </div>
        <a href={`https://wa.me/919436781545?text=${encodeURIComponent('Hi! I want to upgrade to Jobr Prep Pro. My email: ')}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'linear-gradient(135deg, #7C3AED, #6D28D9)', color: '#fff', textDecoration: 'none', padding: '13px', borderRadius: 100, fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-display)' }}>
          <Sparkles size={15} /> Upgrade via WhatsApp
        </a>
        <div style={{ fontSize: 11, color: '#334155', marginTop: 10 }}>₹299/month · Instant activation</div>
      </div>
    </div>
  );
}