'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText, Briefcase, Mic, Users, BookOpen,
  Plus, Trash2, Send, Key, Trophy, AlertCircle,
  Clock, CheckCircle2, Zap, TrendingUp, Target,
  ExternalLink, Calendar, RefreshCw, X, Sparkles,
  Lock, MessageSquare, ArrowRight,
} from 'lucide-react';
import {
  PrepProvider, usePrep, JobTrack, TrackStatus,
  SEED_TRACKS, COURSE_DATA,
} from '@/context/PrepContext';

const TABS = [
  { id: 'cv',        label: 'CV.Prep',        icon: FileText,   color: '#7C3AED', desc: 'Optimize your CV' },
  { id: 'tracks',    label: 'Track.Prep',     icon: Briefcase,  color: '#06B6D4', desc: 'Application Tracker' },
  { id: 'interview', label: 'Interview.Prep', icon: Mic,        color: '#F97316', desc: 'AI Mock Interview' },
  { id: 'mentor',    label: 'Mentor.Prep',    icon: Users,      color: '#EC4899', desc: 'Book a Mentor' },
  { id: 'learn',     label: 'Learn.Prep',     icon: BookOpen,   color: '#10B981', desc: 'Curated Learning' },
] as const;

const STATUS_CONFIG: Record<TrackStatus, { label: string; color: string; bg: string; icon: any; step: number }> = {
  applied:     { label: 'Applied',    color: '#06B6D4', bg: 'rgba(6,182,212,0.12)',   icon: Clock,         step: 1 },
  interview_1: { label: 'Round 1',   color: '#F97316', bg: 'rgba(249,115,22,0.12)',  icon: MessageSquare, step: 2 },
  interview_2: { label: 'Round 2',   color: '#A78BFA', bg: 'rgba(167,139,250,0.12)', icon: Zap,           step: 3 },
  offer:       { label: 'Offer 🎉',  color: '#10B981', bg: 'rgba(16,185,129,0.12)',  icon: Trophy,        step: 4 },
  rejected:    { label: 'Rejected',  color: '#EF4444', bg: 'rgba(239,68,68,0.12)',   icon: AlertCircle,   step: 0 },
};

export default function PrepDashboard() {
  return (
    <PrepProvider>
      <PrepInner />
    </PrepProvider>
  );
}

function PrepInner() {
  const router = useRouter();
  const { state, dispatch, loadTracks } = usePrep();

  useEffect(() => {
    const session = localStorage.getItem('jobr_session') || localStorage.getItem('jobr_user');
    if (!session) { router.push('/auth'); return; }
    loadTracks();
  }, []);

  return (
    <div style={{ background: '#1C1C2E', minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>

      {/* Top tab bar */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(20,20,36,0.9)', backdropFilter: 'blur(12px)', padding: '0 20px', display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', flexShrink: 0 }} className="scrollbar-hide">

      

        {/* Tabs */}
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => dispatch({ type: 'SET_TAB', tab: tab.id as any })} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '16px 14px', background: 'transparent', border: 'none', cursor: 'pointer', borderBottom: state.activeTab === tab.id ? `2px solid ${tab.color}` : '2px solid transparent', color: state.activeTab === tab.id ? tab.color : '#64748B', fontSize: 13, fontWeight: state.activeTab === tab.id ? 700 : 500, fontFamily: 'var(--font-display)', whiteSpace: 'nowrap', transition: 'all 0.15s', marginBottom: '-1px' }}>
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}

        {/* API key status */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, paddingLeft: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 100, background: state.apiKey ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${state.apiKey ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}` }}>
            <Key size={10} color={state.apiKey ? '#10B981' : '#EF4444'} />
            <span style={{ fontSize: 10, fontWeight: 700, color: state.apiKey ? '#10B981' : '#EF4444', fontFamily: 'monospace' }}>
              {state.apiKey ? 'KEY ✓' : 'NO KEY'}
            </span>
          </div>
          <span style={{ fontSize: 11, color: '#334155', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{state.userName}</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

        {/* Left rail — only on track-based tabs */}
        {['tracks','interview','mentor','learn'].includes(state.activeTab) && <TrackRail />}

        {/* Main workspace */}
        <div style={{ flex: 1, overflow: 'auto', minWidth: 0 }} className="scrollbar-hide">
          {state.activeTab === 'cv'        && <CVPrepTab />}
          {state.activeTab === 'tracks'    && <TrackWorkspace />}
          {state.activeTab === 'interview' && <InterviewTab />}
          {state.activeTab === 'mentor'    && <MentorTab />}
          {state.activeTab === 'learn'     && <LearnTab />}
        </div>
      </div>

      {state.showProModal && <ProModal />}
    </div>
  );
}

// ── Track Rail ─────────────────────────────────────────────────────────────────
function TrackRail() {
  const { state, dispatch, addTrack } = usePrep();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ company: '', role: '', jd_text: '' });

  const handleAdd = async () => {
    if (!form.company || !form.role) return;
    await addTrack({ ...form, cv_text: '' });
    setShowAdd(false);
    setForm({ company: '', role: '', jd_text: '' });
  };

  return (
    <div style={{ width: 256, minWidth: 256, borderRight: '1px solid rgba(255,255,255,0.06)', background: 'rgba(16,16,28,0.6)', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>

      <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#06B6D4', fontFamily: 'monospace', letterSpacing: '0.1em' }}>JOB TRACKS</div>
          <div style={{ fontSize: 11, color: '#334155', marginTop: 1 }}>{state.tracks.length} applications</div>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', color: '#06B6D4', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Plus size={13} />
        </button>
      </div>

      {showAdd && (
        <div style={{ padding: 12, borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(6,182,212,0.04)' }}>
          <input className="input" placeholder="Company" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} style={{ marginBottom: 6, fontSize: 12, padding: '7px 10px' }} />
          <input className="input" placeholder="Role / Position" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} style={{ marginBottom: 6, fontSize: 12, padding: '7px 10px' }} />
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

// ── Track Workspace ────────────────────────────────────────────────────────────
function TrackWorkspace() {
  const { activeTrack, updateTrackStatus, deleteTrack, calculateJobrScore, generateRoadmap, dispatch } = usePrep();
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewNotes, setInterviewNotes] = useState('');
  const [scoringLoading, setScoringLoading] = useState(false);
  const [roadmapLoading, setRoadmapLoading] = useState(false);

  if (!activeTrack) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, padding: 40, opacity: 0.4 }}>
      <Briefcase size={44} color="#334155" />
      <div style={{ fontSize: 15, color: '#475569', fontWeight: 600 }}>Select a track or add a new one</div>
    </div>
  );

  const cfg = STATUS_CONFIG[activeTrack.status];
  const aiFeedback = (() => { try { return activeTrack.ai_feedback ? JSON.parse(activeTrack.ai_feedback) : null; } catch { return null; } })();
  const roadmap = (() => { try { return activeTrack.improvement_roadmap ? JSON.parse(activeTrack.improvement_roadmap) : null; } catch { return null; } })();

  return (
    <div style={{ padding: 24, maxWidth: 860, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 900, color: '#F1F0FF', letterSpacing: '-0.03em', margin: 0 }}>{activeTrack.company}</h1>
            <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color, background: cfg.bg, padding: '4px 12px', borderRadius: 100, fontFamily: 'monospace', border: `1px solid ${cfg.color}30` }}>{cfg.label}</span>
          </div>
          <div style={{ fontSize: 15, color: '#94A3B8' }}>{activeTrack.role}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => dispatch({ type: 'SET_TAB', tab: 'interview' })} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', color: '#F97316', padding: '8px 16px', borderRadius: 100, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
            <Mic size={13} /> Mock Interview
          </button>
          <button onClick={() => deleteTrack(activeTrack.id)} style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8, color: '#EF4444', cursor: 'pointer' }}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 28, overflowX: 'auto', paddingBottom: 4 }} className="scrollbar-hide">
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
        {activeTrack.status === 'rejected' && (
          <div style={{ marginLeft: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertCircle size={14} color="#EF4444" />
            <span style={{ fontSize: 12, color: '#EF4444', fontWeight: 600 }}>Not selected this time</span>
          </div>
        )}
      </div>

      {/* Score cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '14px 18px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 70, height: 70, background: `radial-gradient(circle, ${activeTrack.jobr_score >= 80 ? '#10B981' : activeTrack.jobr_score >= 60 ? '#F97316' : '#EF4444'}25 0%, transparent 70%)`, borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ fontSize: 10, color: '#334155', fontFamily: 'monospace', marginBottom: 6 }}>JOBR SCORE</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: activeTrack.jobr_score >= 80 ? '#10B981' : activeTrack.jobr_score >= 60 ? '#F97316' : activeTrack.jobr_score > 0 ? '#EF4444' : '#334155', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
            {activeTrack.jobr_score > 0 ? activeTrack.jobr_score : '—'}
          </div>
          <div style={{ fontSize: 11, color: '#334155', marginTop: 2, marginBottom: 8 }}>
            {activeTrack.jobr_score >= 80 ? 'Great fit!' : activeTrack.jobr_score >= 60 ? 'Good match' : activeTrack.jobr_score > 0 ? 'Needs work' : 'Not scored'}
          </div>
          {activeTrack.jd_text && (
            <button onClick={async () => { setScoringLoading(true); await calculateJobrScore(activeTrack); setScoringLoading(false); }} disabled={scoringLoading} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 100, padding: '4px 9px', color: '#475569', fontSize: 10, cursor: 'pointer', fontWeight: 600 }}>
              <RefreshCw size={9} style={scoringLoading ? { animation: 'spin 1s linear infinite' } : {}} />
              {scoringLoading ? 'Scoring...' : 'Score me'}
            </button>
          )}
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '14px 18px' }}>
          <div style={{ fontSize: 10, color: '#334155', fontFamily: 'monospace', marginBottom: 6 }}>ROUND</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#F1F0FF', fontFamily: 'var(--font-display)', lineHeight: 1 }}>{activeTrack.round}</div>
          <div style={{ fontSize: 11, color: '#334155', marginTop: 2 }}>of 3 rounds</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '14px 18px' }}>
          <div style={{ fontSize: 10, color: '#334155', fontFamily: 'monospace', marginBottom: 6 }}>MOCK SESSIONS</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#F97316', fontFamily: 'var(--font-display)', lineHeight: 1 }}>{activeTrack.trials_used}</div>
          <div style={{ fontSize: 11, color: '#334155', marginTop: 2 }}>sessions done</div>
        </div>
      </div>

      {/* Skill analysis */}
      {aiFeedback && (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 18, marginBottom: 18 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#06B6D4', fontFamily: 'monospace', marginBottom: 12 }}>JD SKILL ANALYSIS</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ fontSize: 10, color: '#10B981', marginBottom: 7, fontWeight: 600, fontFamily: 'monospace' }}>✓ MATCHED</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {(aiFeedback.matched_skills || []).map((s: string) => (
                  <span key={s} style={{ fontSize: 11, color: '#10B981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: '3px 8px', borderRadius: 99 }}>{s}</span>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: '#EF4444', marginBottom: 7, fontWeight: 600, fontFamily: 'monospace' }}>✗ GAPS</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {(aiFeedback.missing_skills || []).map((s: string) => (
                  <span key={s} style={{ fontSize: 11, color: '#EF4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', padding: '3px 8px', borderRadius: 99 }}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* APPLIED */}
      {activeTrack.status === 'applied' && (
        <div style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)', borderRadius: 16, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#06B6D4', fontFamily: 'monospace', marginBottom: 12 }}>📋 APPLICATION SENT — SCHEDULE YOUR INTERVIEW</div>
          <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 14, lineHeight: 1.6 }}>When you hear back, log the interview date to unlock your full prep toolkit.</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
            <input type="date" value={interviewDate} onChange={e => setInterviewDate(e.target.value)} className="input" style={{ flex: 1, minWidth: 150, fontSize: 13 }} />
            <input placeholder="Notes (e.g. phone screen)" value={interviewNotes} onChange={e => setInterviewNotes(e.target.value)} className="input" style={{ flex: 2, minWidth: 180, fontSize: 13 }} />
          </div>
          <button onClick={async () => { if (!interviewDate) return; await updateTrackStatus(activeTrack.id, 'interview_1', { interview_date: interviewDate, interview_notes: interviewNotes }); setInterviewDate(''); setInterviewNotes(''); }} disabled={!interviewDate} style={{ background: '#06B6D4', color: '#fff', border: 'none', borderRadius: 100, padding: '10px 24px', fontWeight: 700, fontSize: 13, cursor: interviewDate ? 'pointer' : 'not-allowed', opacity: interviewDate ? 1 : 0.5, fontFamily: 'var(--font-display)' }}>
            🎯 Interview Scheduled → Unlock Prep Kit
          </button>
        </div>
      )}

      {/* INTERVIEW */}
      {(activeTrack.status === 'interview_1' || activeTrack.status === 'interview_2') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {activeTrack.interview_date && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.18)', borderRadius: 10 }}>
              <Calendar size={13} color="#F97316" />
              <span style={{ fontSize: 13, color: '#F97316', fontWeight: 600 }}>Interview: {activeTrack.interview_date}</span>
            </div>
          )}

          <div style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.15)', borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#F97316', fontFamily: 'monospace', marginBottom: 14 }}>
              🎯 {activeTrack.status === 'interview_1' ? 'ROUND 1' : 'ROUND 2'} PREP KIT
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
              {[
                { icon: Mic, label: 'AI Mock Interview', desc: `${3 - activeTrack.trials_used} free left`, action: () => dispatch({ type: 'SET_TAB', tab: 'interview' }), color: '#F97316' },
                { icon: BookOpen, label: 'Bite-sized Notes', desc: 'Last-minute cheat sheet', action: () => dispatch({ type: 'SET_TAB', tab: 'learn' }), color: '#10B981' },
                { icon: Users, label: 'Book a Mentor', desc: '1:1 expert coaching', action: () => dispatch({ type: 'SET_TAB', tab: 'mentor' }), color: '#EC4899' },
              ].map(item => (
                <button key={item.label} onClick={item.action} style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 14, background: `${item.color}0e`, border: `1px solid ${item.color}22`, borderRadius: 12, cursor: 'pointer', textAlign: 'left', transition: 'transform 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}>
                  <item.icon size={18} color={item.color} />
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#F1F0FF', fontFamily: 'var(--font-display)' }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: '#475569' }}>{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.15)', borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#A78BFA', fontFamily: 'monospace', marginBottom: 10 }}>📊 HOW DID IT GO?</div>
            <p style={{ fontSize: 13, color: '#64748B', marginBottom: 12 }}>Log your result after the interview to unlock the next phase.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={async () => {
                const nextStatus: TrackStatus = activeTrack.status === 'interview_1' ? 'interview_2' : 'offer';
                await updateTrackStatus(activeTrack.id, nextStatus, { round: activeTrack.round + 1 });
              }} style={{ flex: 1, padding: '11px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.22)', borderRadius: 10, color: '#10B981', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
                ✓ I Was Selected!
              </button>
              <button onClick={async () => {
                await updateTrackStatus(activeTrack.id, 'rejected');
                if (activeTrack.jd_text) { setRoadmapLoading(true); await generateRoadmap(activeTrack); setRoadmapLoading(false); }
              }} style={{ flex: 1, padding: '11px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 10, color: '#EF4444', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
                ✗ Not This Time
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OFFER */}
      {activeTrack.status === 'offer' && (
        <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.10), rgba(6,182,212,0.06))', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 20, padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>🎉</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 900, color: '#10B981', marginBottom: 8 }}>You got the offer!</h2>
          <p style={{ fontSize: 14, color: '#94A3B8', marginBottom: 0 }}>{activeTrack.interview_notes || `Congratulations on landing ${activeTrack.role} at ${activeTrack.company}!`}</p>
        </div>
      )}

      {/* REJECTED */}
      {activeTrack.status === 'rejected' && !roadmap && (
        <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#EF4444', fontFamily: 'monospace', marginBottom: 10 }}>📈 GENERATE IMPROVEMENT ROADMAP</div>
          <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 14, lineHeight: 1.6 }}>AI will analyse your profile vs JD and create a personalised plan to succeed next time.</p>
          <button onClick={async () => { setRoadmapLoading(true); await generateRoadmap(activeTrack); setRoadmapLoading(false); }} disabled={roadmapLoading} style={{ background: '#EF4444', color: '#fff', border: 'none', borderRadius: 100, padding: '10px 24px', fontWeight: 700, fontSize: 13, cursor: 'pointer', opacity: roadmapLoading ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: 7 }}>
            {roadmapLoading ? <><RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} /> Generating...</> : <><Sparkles size={13} /> Generate My Roadmap</>}
          </button>
        </div>
      )}

      {activeTrack.status === 'rejected' && roadmap && (
        <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 16, padding: 22 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#EF4444', fontFamily: 'monospace', marginBottom: 14 }}>📈 YOUR IMPROVEMENT ROADMAP</div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 10, padding: '11px 14px', marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: '#EF4444', fontWeight: 600, marginBottom: 4, fontFamily: 'monospace' }}>ROOT CAUSE</div>
            <p style={{ fontSize: 13, color: '#94A3B8', margin: 0, lineHeight: 1.6 }}>{roadmap.root_cause}</p>
          </div>
          {roadmap.skill_gaps?.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace', marginBottom: 7 }}>SKILL GAPS</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {roadmap.skill_gaps.map((s: string) => <span key={s} style={{ fontSize: 11, color: '#EF4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', padding: '3px 9px', borderRadius: 100 }}>{s}</span>)}
              </div>
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
          {roadmap.encouragement && (
            <div style={{ padding: '10px 13px', background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.14)', borderRadius: 9, fontSize: 13, color: '#10B981', fontStyle: 'italic', marginTop: 8 }}>
              💪 {roadmap.encouragement}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── CV.Prep Tab ────────────────────────────────────────────────────────────────
function CVPrepTab() {
  const { state, dispatch } = usePrep();
  const [apiKey, setApiKeyLocal] = useState(state.apiKey);
  const [cvText, setCvText] = useState('');
  const [jdText, setJdText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setCvText(localStorage.getItem('jobr_last_cv') || '');
    setJdText(localStorage.getItem('jobr_last_jd') || '');
    const saved = localStorage.getItem('last_optimized_cv');
    if (saved) { try { setResult(JSON.parse(saved)); } catch {} }
  }, []);

  const handleOptimize = async () => {
    setError(''); setLoading(true);
    try {
      const res = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey || state.apiKey, cvText, jdText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
      const json = JSON.parse(raw?.match(/\{[\s\S]*\}/)?.[0] || '{}');
      setResult(json);
      localStorage.setItem('last_optimized_cv', JSON.stringify(json));
      localStorage.setItem('jobr_last_cv', cvText);
      localStorage.setItem('jobr_last_jd', jdText);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: 'calc(100vh - 120px)' }}>
      <div style={{ width: 340, minWidth: 340, borderRight: '1px solid rgba(255,255,255,0.06)', padding: 18, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }} className="scrollbar-hide">
        <div style={{ padding: 12, background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.18)', borderRadius: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#A78BFA', fontFamily: 'monospace', marginBottom: 7 }}>GEMINI API KEY</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <input type="password" placeholder="AIzaSy..." value={apiKey} onChange={e => setApiKeyLocal(e.target.value)} className="input" style={{ fontSize: 12, padding: '7px 10px' }} />
            <button onClick={() => { dispatch({ type: 'SET_API_KEY', key: apiKey }); localStorage.setItem('jobr_gemini_key', apiKey); }} style={{ background: '#7C3AED', color: '#fff', border: 'none', borderRadius: 8, padding: '0 11px', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>Save</button>
          </div>
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ fontSize: 10, color: '#7C3AED', display: 'block', marginTop: 5 }}>Get free key → aistudio.google.com</a>
        </div>
        <div>
          <label style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace', display: 'block', marginBottom: 5 }}>YOUR CV</label>
          <textarea className="input" placeholder="Paste your CV text here..." value={cvText} onChange={e => { setCvText(e.target.value); localStorage.setItem('jobr_last_cv', e.target.value); }} style={{ height: 150, resize: 'none', fontSize: 12 }} />
        </div>
        <div>
          <label style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace', display: 'block', marginBottom: 5 }}>JOB DESCRIPTION</label>
          <textarea className="input" placeholder="Paste the JD here..." value={jdText} onChange={e => { setJdText(e.target.value); localStorage.setItem('jobr_last_jd', e.target.value); }} style={{ height: 150, resize: 'none', fontSize: 12 }} />
        </div>
        {error && <div style={{ padding: '9px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 9, fontSize: 12, color: '#EF4444' }}>{error}</div>}
        <button onClick={handleOptimize} disabled={loading} style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)', color: '#fff', border: 'none', borderRadius: 100, padding: '12px', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'var(--font-display)', boxShadow: '0 4px 16px rgba(124,58,237,0.35)', opacity: loading ? 0.7 : 1 }}>
          {loading ? <><RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> Processing...</> : <><Sparkles size={14} /> Optimize My CV</>}
        </button>
        <a href="/dashboard/send" style={{ display: result ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', color: '#06B6D4', borderRadius: 100, padding: '10px', fontWeight: 700, fontSize: 13, textDecoration: 'none', fontFamily: 'var(--font-display)' }}>
          <Send size={13} /> Send via Gmail →
        </a>
      </div>
      <div style={{ flex: 1, padding: 24, overflowY: 'auto', background: '#05070A' }} className="scrollbar-hide">
        {result ? (
          <div style={{ maxWidth: 620, margin: '0 auto', background: '#fff', color: '#111', padding: '40px 36px', borderRadius: 4, borderTop: '10px solid #7C3AED', boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}>
            <h1 style={{ fontSize: 26, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: 4, color: '#111' }}>{result.header?.name || 'Your Name'}</h1>
            {result.header?.email && <p style={{ fontSize: 11, color: '#666', marginBottom: 20 }}>{[result.header.email, result.header.location].filter(Boolean).join(' · ')}</p>}
            {result.summary && <div style={{ marginBottom: 18 }}><div style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.2em', color: '#7C3AED', textTransform: 'uppercase', marginBottom: 6 }}>PROFESSIONAL SUMMARY</div><p style={{ fontSize: 13, lineHeight: 1.6, color: '#333', margin: 0 }}>{result.summary}</p></div>}
            {result.experience?.map((job: any, i: number) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.2em', color: '#7C3AED', textTransform: 'uppercase', marginBottom: 6 }}>EXPERIENCE</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#111' }}>{job.company} — <span style={{ color: '#7C3AED' }}>{job.title || job.role}</span></div>
                <ul style={{ marginTop: 6, paddingLeft: 16 }}>{job.bullets?.map((b: string, j: number) => <li key={j} style={{ fontSize: 12, color: '#444', marginBottom: 4, lineHeight: 1.5 }}>{b}</li>)}</ul>
              </div>
            ))}
            {result.skills?.length > 0 && <div><div style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.2em', color: '#7C3AED', textTransform: 'uppercase', marginBottom: 6 }}>SKILLS</div><p style={{ fontSize: 12, color: '#444', margin: 0 }}>{result.skills.join(' · ')}</p></div>}
          </div>
        ) : (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, opacity: 0.35 }}>
            <FileText size={44} color="#334155" />
            <div style={{ fontSize: 15, color: '#475569', fontWeight: 600 }}>Your optimized CV will appear here</div>
            <div style={{ fontSize: 13, color: '#334155', textAlign: 'center', maxWidth: 280 }}>Paste your CV and a Job Description, then click Optimize</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Interview Tab ──────────────────────────────────────────────────────────────
function InterviewTab() {
  const { state, dispatch, startMockInterview, sendMockAnswer, activeTrack } = usePrep();
  const [answer, setAnswer] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [state.mockSession]);

  const handleSend = async () => {
    if (!answer.trim() || !activeTrack) return;
    const a = answer; setAnswer('');
    await sendMockAnswer(a, activeTrack);
  };

  const trialsLeft = FREE_MOCK_LIMIT - state.trialsUsed;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 'calc(100vh - 120px)', background: '#05070A' }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(249,115,22,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#F97316', fontFamily: 'var(--font-display)' }}>
            Interview.Prep {activeTrack ? `— ${activeTrack.company} · ${activeTrack.role}` : ''}
          </div>
          <div style={{ fontSize: 11, color: '#475569', marginTop: 1 }}>
            {trialsLeft > 0 ? `${trialsLeft} free sessions remaining` : 'Free limit reached'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: i < state.trialsUsed ? '#F97316' : 'rgba(255,255,255,0.08)' }} />)}
          </div>
          {state.mockActive && (
            <button onClick={() => dispatch({ type: 'RESET_MOCK' })} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)', color: '#EF4444', padding: '5px 11px', borderRadius: 100, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
              <X size={11} /> End Session
            </button>
          )}
        </div>
      </div>

      {!state.mockActive ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, gap: 20, textAlign: 'center' }}>
          <div style={{ width: 76, height: 76, borderRadius: '50%', background: 'rgba(249,115,22,0.1)', border: '2px solid rgba(249,115,22,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Mic size={30} color="#F97316" />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, color: '#F1F0FF', marginBottom: 8 }}>AI Mock Interview</h2>
            <p style={{ fontSize: 14, color: '#64748B', maxWidth: 360, lineHeight: 1.6 }}>
              {activeTrack
                ? `Practice for ${activeTrack.role} at ${activeTrack.company}. The AI reads the actual JD and asks hyper-relevant questions.`
                : 'Select a job track from the left to start a contextual interview.'}
            </p>
          </div>
          {trialsLeft > 0 ? (
            <button onClick={() => activeTrack && startMockInterview(activeTrack)} disabled={!activeTrack} style={{ background: 'linear-gradient(135deg, #F97316, #EA6B0A)', color: '#fff', border: 'none', borderRadius: 100, padding: '13px 36px', fontWeight: 700, fontSize: 15, cursor: activeTrack ? 'pointer' : 'not-allowed', opacity: activeTrack ? 1 : 0.5, fontFamily: 'var(--font-display)', boxShadow: '0 4px 20px rgba(249,115,22,0.4)', display: 'flex', alignItems: 'center', gap: 9 }}>
              <Mic size={17} /> Start Mock Interview
            </button>
          ) : (
            <button onClick={() => dispatch({ type: 'SET_SHOW_PRO_MODAL', show: true })} style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)', color: '#fff', border: 'none', borderRadius: 100, padding: '13px 36px', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 9 }}>
              <Lock size={17} /> Unlock Prep Pro
            </button>
          )}
          <div style={{ fontSize: 11, color: '#334155' }}>
            {trialsLeft > 0 ? `${trialsLeft} of ${FREE_MOCK_LIMIT} free sessions remaining` : '₹299/month for unlimited access'}
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }} className="scrollbar-hide">
            {state.mockSession.map((msg, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexDirection: msg.role === 'interviewer' ? 'row' : 'row-reverse' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: msg.role === 'interviewer' ? 'rgba(249,115,22,0.18)' : 'rgba(124,58,237,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0, border: `1.5px solid ${msg.role === 'interviewer' ? 'rgba(249,115,22,0.3)' : 'rgba(124,58,237,0.3)'}` }}>
                  {msg.role === 'interviewer' ? '🤖' : '👤'}
                </div>
                <div style={{ maxWidth: '74%', padding: '11px 15px', borderRadius: msg.role === 'interviewer' ? '4px 14px 14px 14px' : '14px 4px 14px 14px', background: msg.role === 'interviewer' ? 'rgba(249,115,22,0.07)' : 'rgba(124,58,237,0.07)', border: `1px solid ${msg.role === 'interviewer' ? 'rgba(249,115,22,0.12)' : 'rgba(124,58,237,0.12)'}` }}>
                  <p style={{ fontSize: 14, color: '#E2E8F0', lineHeight: 1.6, margin: 0 }}>{msg.content}</p>
                  <div style={{ fontSize: 9, color: '#334155', marginTop: 5, fontFamily: 'monospace' }}>{new Date(msg.timestamp).toLocaleTimeString()}</div>
                </div>
              </div>
            ))}
            {state.mockLoading && (
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(249,115,22,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🤖</div>
                <div style={{ padding: '11px 15px', borderRadius: '4px 14px 14px 14px', background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.12)', display: 'flex', gap: 5, alignItems: 'center' }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#F97316', animation: `pulse-dot 1.2s ${i * 0.2}s infinite` }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div style={{ padding: '14px 18px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 10 }}>
            <textarea value={answer} onChange={e => setAnswer(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="Type your answer... (Enter to send)" className="input" style={{ flex: 1, resize: 'none', height: 50, fontSize: 14, paddingTop: 13 }} />
            <button onClick={handleSend} disabled={!answer.trim() || state.mockLoading} style={{ width: 50, height: 50, background: 'linear-gradient(135deg, #F97316, #EA6B0A)', border: 'none', borderRadius: 11, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: (!answer.trim() || state.mockLoading) ? 0.4 : 1, boxShadow: '0 2px 12px rgba(249,115,22,0.4)' }}>
              <Send size={17} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const FREE_MOCK_LIMIT = 3;

// ── Mentor Tab ─────────────────────────────────────────────────────────────────
function MentorTab() {
  const MENTORS = [
    { name: 'Priya Sharma', role: 'Ex-Google PM · IIM-A', domain: 'Product Management', rate: 25, rating: 4.9, sessions: 48, color: '#EC4899', email: 'priya.sharma@mentor.jobr' },
    { name: 'Arjun Mehta', role: 'Staff Engineer @ Swiggy', domain: 'Software Engineering', rate: 20, rating: 4.8, sessions: 62, color: '#A78BFA', email: 'arjun.mehta@mentor.jobr' },
    { name: 'Sneha Iyer', role: 'Data Science Lead · Ex-Netflix', domain: 'Data Science & AI', rate: 18, rating: 4.7, sessions: 35, color: '#06B6D4', email: 'sneha.iyer@mentor.jobr' },
  ];
  return (
    <div style={{ padding: 24, maxWidth: 780 }}>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#EC4899', fontFamily: 'monospace', marginBottom: 5 }}>MENTOR.PREP</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, color: '#F1F0FF', marginBottom: 5 }}>Book a 1:1 Session</h2>
        <p style={{ fontSize: 13, color: '#64748B' }}>Expert mentors, credits-based, no subscription required.</p>
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
              <span style={{ fontSize: 9, color: m.color, background: `${m.color}15`, border: `1px solid ${m.color}25`, padding: '2px 7px', borderRadius: 100, fontFamily: 'monospace', marginTop: 3, display: 'inline-block' }}>{m.domain}</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 17, fontWeight: 900, color: m.color, fontFamily: 'var(--font-display)' }}>{m.rate} cr</div>
              <div style={{ fontSize: 10, color: '#475569' }}>per hour</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#F1F0FF' }}>{'★'.repeat(Math.round(m.rating))}</div>
              <div style={{ fontSize: 10, color: '#475569' }}>{m.sessions} sessions</div>
            </div>
            <a href={`/mentor/book?mentor=${m.email}`} style={{ background: m.color, color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 12, padding: '9px 18px', borderRadius: 100, fontFamily: 'var(--font-display)', boxShadow: `0 3px 12px ${m.color}40`, whiteSpace: 'nowrap' }}>
              Book →
            </a>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, padding: '13px 18px', background: 'rgba(236,72,153,0.05)', border: '1px solid rgba(236,72,153,0.12)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
        <ExternalLink size={14} color="#EC4899" />
        <span style={{ fontSize: 13, color: '#64748B' }}>View all mentors on</span>
        <a href="/mentor" style={{ fontSize: 13, fontWeight: 700, color: '#EC4899' }}>Mentor.Jobr →</a>
      </div>
    </div>
  );
}

// ── Learn Tab ──────────────────────────────────────────────────────────────────
function LearnTab() {
  const { activeTrack } = usePrep();
  const skillGaps: string[] = (() => {
    if (!activeTrack?.ai_feedback) return Object.keys(COURSE_DATA).slice(0, 5);
    try {
      const f = JSON.parse(activeTrack.ai_feedback);
      return f.missing_skills?.length > 0 ? f.missing_skills : Object.keys(COURSE_DATA).slice(0, 5);
    } catch { return Object.keys(COURSE_DATA).slice(0, 5); }
  })();

  const courses = skillGaps.flatMap(skill => (COURSE_DATA[skill] || []).map(c => ({ ...c, skill })));

  return (
    <div style={{ padding: 24, maxWidth: 780 }}>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#10B981', fontFamily: 'monospace', marginBottom: 5 }}>LEARN.PREP</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, color: '#F1F0FF', marginBottom: 5 }}>
          {activeTrack ? `Resources for ${activeTrack.role} at ${activeTrack.company}` : 'Curated Learning'}
        </h2>
        <p style={{ fontSize: 13, color: '#64748B' }}>{activeTrack?.ai_feedback ? 'Based on your skill gap analysis.' : 'Top resources for high-demand tech skills.'}</p>
      </div>

      {courses.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
          {courses.map((c, i) => (
            <a key={i} href={c.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.12)', borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 7, transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(16,185,129,0.3)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(16,185,129,0.12)'; }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 9, color: '#10B981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.18)', padding: '2px 7px', borderRadius: 100, fontFamily: 'monospace' }}>{c.skill}</span>
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
          <div style={{ fontSize: 14, color: '#475569' }}>Run Jobr Score on a track to get personalised recommendations</div>
        </div>
      )}

      <div style={{ marginTop: 20, padding: '16px 20px', background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.12)', borderRadius: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#A78BFA', fontFamily: 'monospace', marginBottom: 6 }}>FOR EDTECH COMPANIES</div>
        <p style={{ fontSize: 13, color: '#64748B', marginBottom: 10, lineHeight: 1.5 }}>Feature your courses here — shown to students with matching skill gaps. Partnership enquiries welcome.</p>
        <a href="mailto:nitish@jobr.co.in?subject=EdTech Course Partnership" style={{ fontSize: 13, fontWeight: 700, color: '#A78BFA', textDecoration: 'none' }}>Contact us → nitish@jobr.co.in</a>
      </div>
    </div>
  );
}

// ── Pro Modal ──────────────────────────────────────────────────────────────────
function ProModal() {
  const { dispatch } = usePrep();
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#24243A', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 22, padding: '32px 28px', maxWidth: 420, width: '100%', textAlign: 'center', position: 'relative' }}>
        <button onClick={() => dispatch({ type: 'SET_SHOW_PRO_MODAL', show: false })} style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748B', borderRadius: 7, width: 26, height: 26, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X size={13} />
        </button>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #F97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: 22 }}>⚡</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, color: '#F1F0FF', marginBottom: 8 }}>Unlock Prep Pro</h2>
        <p style={{ fontSize: 14, color: '#64748B', marginBottom: 20, lineHeight: 1.6 }}>You've used all 3 free mock interviews. Upgrade for unlimited access.</p>
        <div style={{ background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 12, padding: '14px 18px', marginBottom: 18, textAlign: 'left' }}>
          {['Unlimited AI Mock Interviews', 'Adaptive difficulty engine', 'Detailed performance scoring', 'Priority mentor booking', 'Interview analytics dashboard'].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
              <CheckCircle2 size={13} color="#10B981" />
              <span style={{ fontSize: 13, color: '#94A3B8' }}>{f}</span>
            </div>
          ))}
        </div>
        <a href={`https://wa.me/919945900292?text=${encodeURIComponent('Hi! I want to upgrade to Jobr Prep Pro. My email: ')}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'linear-gradient(135deg, #7C3AED, #6D28D9)', color: '#fff', textDecoration: 'none', padding: '13px', borderRadius: 100, fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-display)', boxShadow: '0 4px 20px rgba(124,58,237,0.4)' }}>
          <Sparkles size={15} /> Upgrade via WhatsApp
        </a>
        <div style={{ fontSize: 11, color: '#334155', marginTop: 10 }}>₹299/month · Instant activation</div>
      </div>
    </div>
  );
}