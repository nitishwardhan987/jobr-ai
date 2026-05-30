'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  FileText, Users, ShoppingBag, ArrowRight, CheckCircle,
  Star, TrendingUp, Zap, BookOpen, Target, Award, ChevronRight,
  BarChart2, Clock, MessageSquare, Briefcase, Sparkles,
} from 'lucide-react';

/* ─── Palette ─────────────────────────────────────────────────── */
const C = {
  canvas: '#F8F5F0', bg: '#F5F1EA', surface: '#FFFFFF', elev: '#FCFAF7',
  t1: '#18181B', t2: '#52525B', t3: '#71717A', t4: '#A1A1AA',
  border: '#E7E5E4', bStrong: '#D6D3D1',
  orange: '#F97316', oHover: '#EA580C', oSoft: '#FFF7ED', oBorder: '#FED7AA',
  purple: '#7C3AED', pSoft: 'rgba(124,58,237,0.10)',
  green:  '#16A34A', gSoft: '#F0FDF4',
  blue:   '#2563EB', bSoft: 'rgba(37,99,235,0.10)',
};

/* ─── Section wrapper ──────────────────────────────────────────── */
const W = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', ...style }}>{children}</div>
);

/* ─── Scroll reveal ────────────────────────────────────────────── */
function Reveal({ children, delay = 0, y = 28 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

/* ─── Animated counter ─────────────────────────────────────────── */
function Counter({ to, suffix = '', prefix = '' }: { to: number; suffix?: string; prefix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const dur = 1800; const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to]);
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

/* ─── Score ring ───────────────────────────────────────────────── */
function ScoreRing({ score, color, label }: { score: number; color: string; label: string }) {
  const ref = useRef<SVGCircleElement>(null);
  const inView = useInView(ref, { once: true });
  const r = 36; const circ = 2 * Math.PI * r;
  const dash = circ * (1 - score / 100);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ position: 'relative', width: 88, height: 88 }}>
        <svg width="88" height="88" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="44" cy="44" r={r} fill="none" stroke={`${color}18`} strokeWidth="7" />
          <motion.circle ref={ref} cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="7"
            strokeLinecap="round" strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={inView ? { strokeDashoffset: dash } : {}}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18, color: C.t1 }}>{score}</div>
      </div>
      <span style={{ fontSize: 11, color: C.t3, fontFamily: 'var(--font-mono)', textAlign: 'center', lineHeight: 1.3 }}>{label}</span>
    </div>
  );
}

/* ─── Progress bar ─────────────────────────────────────────────── */
function ProgressBar({ label, value, color, delay = 0 }: { label: string; value: number; color: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: C.t2, fontFamily: 'var(--font-display)' }}>{label}</span>
        <span style={{ fontSize: 11, color: C.t3, fontFamily: 'var(--font-mono)' }}>{value}%</span>
      </div>
      <div style={{ height: 6, background: C.bg, borderRadius: 999, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : {}}
          transition={{ duration: 0.9, delay, ease: 'easeOut' }}
          style={{ height: '100%', background: color, borderRadius: 999 }} />
      </div>
    </div>
  );
}

/* ─── Career Dashboard widget ──────────────────────────────────── */
function CareerDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'resume' | 'interviews'>('overview');
  const tabs = [
    { id: 'overview',   label: 'Overview' },
    { id: 'resume',     label: 'Resume' },
    { id: 'interviews', label: 'Interviews' },
  ] as const;

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 24, overflow: 'hidden', boxShadow: '0 32px 64px rgba(24,24,27,0.12)' }}>

      {/* Dashboard header */}
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: C.elev }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: '#18181B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 12, color: '#F97316' }}>J</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: C.t1 }}>Career Dashboard</span>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.green, animation: 'pulse-dot 2s infinite' }} />
          <span style={{ fontSize: 10, color: C.green, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>ACTIVE</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: '12px 20px 0', display: 'flex', gap: 4, borderBottom: `1px solid ${C.border}` }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            padding: '7px 14px', borderRadius: '8px 8px 0 0', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 12,
            background: activeTab === t.id ? C.surface : 'transparent',
            color: activeTab === t.id ? C.t1 : C.t3,
            borderBottom: activeTab === t.id ? `2px solid ${C.orange}` : '2px solid transparent',
            transition: 'all 0.15s',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: 20 }}>
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {/* Score rings */}
              <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 20, padding: '16px 0', background: C.bg, borderRadius: 16 }}>
                <ScoreRing score={84} color={C.orange} label="Resume Score" />
                <ScoreRing score={72} color={C.purple} label="Interview Ready" />
                <ScoreRing score={91} color={C.green}  label="ATS Score" />
              </div>

              {/* Application tracker */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.t3, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Application Tracker</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                  {[
                    { label: 'Applied', count: 12, color: C.blue },
                    { label: 'Screening', count: 5, color: C.orange },
                    { label: 'Interview', count: 3, color: C.purple },
                    { label: 'Offers', count: 1, color: C.green },
                  ].map(s => (
                    <div key={s.label} style={{ padding: '10px 8px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, textAlign: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18, color: s.color }}>{s.count}</div>
                      <div style={{ fontSize: 9, color: C.t3, fontFamily: 'var(--font-mono)', marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next action */}
              <div style={{ padding: '10px 14px', background: C.oSoft, border: `1px solid ${C.oBorder}`, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Target size={14} color={C.orange} />
                <span style={{ fontSize: 12, color: C.oHover, fontFamily: 'var(--font-display)', fontWeight: 600 }}>Next: Practice for Google SWE Mock Interview</span>
              </div>
            </motion.div>
          )}

          {activeTab === 'resume' && (
            <motion.div key="resume" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: C.t1 }}>Resume Analysis</div>
                <span style={{ padding: '3px 10px', background: C.oSoft, border: `1px solid ${C.oBorder}`, borderRadius: 100, fontSize: 10, color: C.orange, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>84/100</span>
              </div>
              <ProgressBar label="Action Verbs"      value={92} color={C.green}  delay={0.0} />
              <ProgressBar label="Quantified Impact" value={74} color={C.orange} delay={0.1} />
              <ProgressBar label="ATS Keywords"      value={88} color={C.blue}   delay={0.2} />
              <ProgressBar label="Formatting"        value={96} color={C.purple} delay={0.3} />
              <div style={{ marginTop: 12, padding: '10px 14px', background: C.bg, borderRadius: 10, fontSize: 12, color: C.t2, lineHeight: 1.5 }}>
                <span style={{ color: C.orange, fontWeight: 700 }}>AI Suggestion: </span>
                Add metrics to your last 2 bullet points. "Led team" → "Led team of 5, reduced deployment time by 40%"
              </div>
            </motion.div>
          )}

          {activeTab === 'interviews' && (
            <motion.div key="interviews" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: C.t1, marginBottom: 14 }}>Mock Interviews</div>
              {[
                { company: 'Google SWE', status: 'Scheduled', time: 'Tomorrow 3pm', color: C.blue },
                { company: 'Swiggy PM', status: 'Completed', time: 'Score: 78/100', color: C.green },
                { company: 'Zomato DS', status: 'In Progress', time: '2 rounds done', color: C.orange },
              ].map(item => (
                <div key={item.company} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: C.bg, borderRadius: 10, marginBottom: 8 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, color: C.t1 }}>{item.company}</div>
                    <div style={{ fontSize: 11, color: C.t3, fontFamily: 'var(--font-mono)', marginTop: 2 }}>{item.time}</div>
                  </div>
                  <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600, background: `${item.color}12`, color: item.color, border: `1px solid ${item.color}22` }}>{item.status}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── Mentor card ──────────────────────────────────────────────── */
function MentorCard({ name, role, company, rating, sessions, tag, tagColor }: { name: string; role: string; company: string; rating: number; sessions: number; tag: string; tagColor: string }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: '16px', transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)', cursor: 'pointer' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(24,24,27,0.10)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
        <div style={{ width: 42, height: 42, borderRadius: '50%', background: `linear-gradient(135deg, ${tagColor}30, ${tagColor}60)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 16, color: tagColor, flexShrink: 0 }}>
          {name[0]}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: C.t1, marginBottom: 1 }}>{name}</div>
          <div style={{ fontSize: 11, color: C.t3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{role} · {company}</div>
        </div>
        <span style={{ padding: '2px 8px', borderRadius: 100, fontSize: 9, fontFamily: 'var(--font-mono)', fontWeight: 600, background: `${tagColor}12`, color: tagColor, border: `1px solid ${tagColor}22`, flexShrink: 0 }}>{tag}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < rating ? '#F97316' : 'none'} color={i < rating ? '#F97316' : C.t4} />)}
          <span style={{ fontSize: 10, color: C.t3, marginLeft: 3, fontFamily: 'var(--font-mono)' }}>{rating}.0</span>
        </div>
        <span style={{ fontSize: 10, color: C.t4 }}>·</span>
        <span style={{ fontSize: 10, color: C.t3, fontFamily: 'var(--font-mono)' }}>{sessions} sessions</span>
      </div>
    </div>
  );
}

/* ─── Journey step ─────────────────────────────────────────────── */
function JourneyStep({ step, label, desc, icon: Icon, active, color }: { step: number; label: string; desc: string; icon: React.ElementType; active?: boolean; color: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, flex: 1 }}>
      <motion.div
        animate={active ? { scale: [1, 1.08, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: 56, height: 56, borderRadius: 16,
          background: active ? color : C.surface,
          border: `2px solid ${active ? color : C.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: active ? `0 8px 24px ${color}25` : 'none',
          transition: 'all 0.3s',
        }}>
        <Icon size={22} color={active ? '#fff' : C.t3} />
      </motion.div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: active ? C.t1 : C.t3, marginBottom: 3 }}>{label}</div>
        <div style={{ fontSize: 11, color: C.t4, lineHeight: 1.4, maxWidth: 90 }}>{desc}</div>
      </div>
    </div>
  );
}

/* ─── Product card ─────────────────────────────────────────────── */
function ProductCard({ title, subtitle, desc, icon: Icon, color, ctaLabel, ctaHref, features, preview }: {
  title: string; subtitle: string; desc: string; icon: React.ElementType;
  color: string; ctaLabel: string; ctaHref: string; features: string[]; preview: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.surface, border: `1px solid ${hovered ? color + '30' : C.border}`,
        borderRadius: 24, overflow: 'hidden',
        boxShadow: hovered ? `0 20px 48px ${color}15` : C.surface,
        transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        transform: hovered ? 'translateY(-6px)' : 'none',
      }}>
      {/* Header */}
      <div style={{ padding: '28px 28px 20px', background: `linear-gradient(145deg, ${color}08, transparent)` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}15`, border: `1px solid ${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={20} color={color} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: C.t1, letterSpacing: '-0.02em' }}>{title}</div>
            <div style={{ fontSize: 12, color: C.t3, fontFamily: 'var(--font-mono)' }}>{subtitle}</div>
          </div>
        </div>
        <p style={{ fontSize: 14, color: C.t2, lineHeight: 1.65, margin: 0 }}>{desc}</p>
      </div>

      {/* Preview */}
      <div style={{ margin: '0 16px', borderRadius: 12, overflow: 'hidden', border: `1px solid ${C.border}`, background: C.bg }}>
        {preview}
      </div>

      {/* Features */}
      <div style={{ padding: '20px 28px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 20 }}>
          {features.map((f, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <CheckCircle size={13} color={color} style={{ flexShrink: 0, marginTop: 2 }} />
              <span style={{ fontSize: 13, color: C.t2, lineHeight: 1.5 }}>{f}</span>
            </div>
          ))}
        </div>
        <a href={ctaHref} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '11px 22px', borderRadius: 100, fontSize: 13, fontWeight: 700,
          fontFamily: 'var(--font-display)', textDecoration: 'none',
          background: color, color: '#fff',
          boxShadow: `0 4px 16px ${color}30`,
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; }}>
          {ctaLabel} <ArrowRight size={13} />
        </a>
      </div>
    </div>
  );
}

/* ─── PREP preview widget ──────────────────────────────────────── */
function PrepPreview() {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: C.t3, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>AI Resume Analysis</div>
      <ProgressBar label="Work Experience Impact" value={88} color={C.orange} delay={0} />
      <ProgressBar label="ATS Compatibility"      value={94} color={C.green}  delay={0.1} />
      <ProgressBar label="Keyword Density"        value={76} color={C.blue}   delay={0.2} />
      <div style={{ marginTop: 8, padding: '8px 12px', background: C.oSoft, border: `1px solid ${C.oBorder}`, borderRadius: 8, fontSize: 11, color: C.oHover, fontFamily: 'var(--font-display)', fontWeight: 600 }}>
        ✦ 3 improvements suggested
      </div>
    </div>
  );
}

/* ─── MENTOR preview widget ────────────────────────────────────── */
function MentorPreview() {
  return (
    <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {[
        { name: 'Rahul S.', role: 'PM', company: 'Google',    rating: 5, sessions: 48, tag: 'PM',  tagColor: C.purple },
        { name: 'Priya K.', role: 'SWE', company: 'Microsoft', rating: 5, sessions: 92, tag: 'SWE', tagColor: C.blue },
      ].map(m => (
        <MentorCard key={m.name} {...m} />
      ))}
    </div>
  );
}

/* ─── MERCH preview widget ─────────────────────────────────────── */
function MerchPreview() {
  return (
    <div style={{ padding: 14 }}>
      <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: C.t3, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cohort Kits</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[
          { label: 'Welcome Kit',       price: '₹850',  tag: 'Best Seller' },
          { label: 'Graduation Bundle', price: '₹1,200', tag: 'Popular' },
          { label: 'Hackathon Set',     price: '₹650',  tag: 'New' },
          { label: 'Cohort Tee',        price: '₹350',  tag: 'Custom' },
        ].map(item => (
          <div key={item.label} style={{ padding: '10px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.t1, fontFamily: 'var(--font-display)', marginBottom: 2 }}>{item.label}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.green, fontFamily: 'var(--font-mono)' }}>{item.price}</span>
              <span style={{ fontSize: 9, color: C.orange, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{item.tag}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── PAGE ────────────────────────────────────────────────────── */
export default function HomePage() {
  const [journeyActive, setJourneyActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setJourneyActive(v => (v + 1) % 6), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ background: C.canvas, minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section style={{ paddingTop: 'clamp(96px,12vw,148px)', paddingBottom: 'clamp(60px,8vw,100px)', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle background wash */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249,115,22,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <W>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,460px),1fr))', gap: '56px 72px', alignItems: 'center' }}>

            {/* Left */}
            <div>
              <div className="animate-fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: C.oSoft, border: `1px solid ${C.oBorder}`, borderRadius: 100, padding: '6px 14px', marginBottom: 24 }}>
                <Sparkles size={12} color={C.orange} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: C.oHover, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                  Career Operating System
                </span>
              </div>

              <h1 className="animate-fade-up-1" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(44px,6vw,80px)', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.04em', marginBottom: 20, color: C.t1 }}>
                Your Career.<br />
                <span style={{ color: C.orange }}>One Operating<br />System.</span>
              </h1>

              <p className="animate-fade-up-2" style={{ fontSize: 'clamp(16px,1.4vw,18px)', color: C.t2, lineHeight: 1.75, maxWidth: 460, marginBottom: 32 }}>
                Prepare for interviews, improve your resume, connect with mentors, and grow your career — all from one platform built for students.
              </p>

              <div className="animate-fade-up-3" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 48 }}>
                <a href="/dashboard" className="btn-primary" style={{ fontSize: 16, padding: '15px 36px' }}>
                  Get Started <ArrowRight size={16} />
                </a>
                <a href="#products" className="btn-ghost" style={{ fontSize: 16, padding: '15px 30px' }}>
                  Explore Features
                </a>
              </div>

              {/* Stats */}
              <div className="animate-fade-up-4" style={{ display: 'flex', flexWrap: 'wrap', gap: '14px 28px' }}>
                {[
                  { to: 500,  suffix: '+',  label: 'Resumes Optimized' },
                  { to: 8,    suffix: '+',  label: 'Verified Mentors'  },
                  { to: 98,   suffix: '%',  label: 'Satisfaction Rate' },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(22px,2.5vw,30px)', color: C.t1, letterSpacing: '-0.03em', lineHeight: 1 }}>
                      <Counter to={s.to} suffix={s.suffix} />
                    </div>
                    <div style={{ fontSize: 12, color: C.t3, marginTop: 3, fontFamily: 'var(--font-mono)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — dashboard */}
            <div className="animate-fade-up-2" style={{ minWidth: 0 }}>
              <CareerDashboard />
            </div>
          </div>
        </W>
      </section>

      {/* ── TRUST BAR ─────────────────────────────────────────── */}
      <section style={{ background: C.surface, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <W style={{ padding: '32px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: C.t4, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Students from India's top colleges & bootcamps
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px 16px' }}>
            {['IIT Bombay', 'NIT Trichy', 'BITS Pilani', 'Masai School', 'Newton School', 'Scaler Academy', 'IIIT Hyderabad', 'VIT Vellore'].map(c => (
              <div key={c} style={{ padding: '7px 16px', borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 12, color: C.t3, whiteSpace: 'nowrap' }}>
                {c}
              </div>
            ))}
          </div>
        </W>
      </section>

      {/* ── CAREER JOURNEY ────────────────────────────────────── */}
      <section style={{ padding: 'clamp(80px,8vw,120px) 0', background: C.bg }}>
        <W>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: C.t3, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Career Journey</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(28px,4vw,48px)', color: C.t1, marginTop: 12, marginBottom: 12 }}>
                Jobr supports every stage.
              </h2>
              <p style={{ fontSize: 17, color: C.t2, maxWidth: 480, margin: '0 auto' }}>
                From first resume to first offer — one platform guides the whole journey.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 24, padding: 'clamp(24px,4vw,40px)', overflow: 'hidden', position: 'relative' }}>
              {/* Connector line */}
              <div style={{ position: 'absolute', top: 76, left: '8%', right: '8%', height: 2, background: `linear-gradient(90deg, ${C.orange}, ${C.purple}, ${C.green})`, opacity: 0.25, borderRadius: 999 }} />

              <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', position: 'relative' }}>
                {[
                  { label: 'Resume',     desc: 'Build & score',   icon: FileText,    color: C.orange },
                  { label: 'Prepare',    desc: 'AI mock tests',   icon: BookOpen,    color: C.blue   },
                  { label: 'Mentor',     desc: 'Expert sessions', icon: Users,       color: C.purple },
                  { label: 'Interview',  desc: 'Crack rounds',    icon: MessageSquare, color: '#D97706' },
                  { label: 'Offer',      desc: 'Land the role',   icon: Award,       color: C.green  },
                  { label: 'Growth',     desc: 'Keep climbing',   icon: TrendingUp,  color: C.orange },
                ].map((s, i) => (
                  <JourneyStep key={s.label} step={i + 1} {...s} active={journeyActive === i} />
                ))}
              </div>

              <div style={{ marginTop: 32, padding: '14px 20px', background: C.bg, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.orange, animation: 'pulse-dot 2s infinite' }} />
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, color: C.t2 }}>
                  Currently highlighted:{' '}
                  <span style={{ color: C.t1 }}>
                    {['Resume Building', 'Interview Preparation', 'Mentor Guidance', 'Interview Rounds', 'Offer Landing', 'Career Growth'][journeyActive]}
                  </span>
                  {' '}— Jobr helps you with this.
                </span>
              </div>
            </div>
          </Reveal>
        </W>
      </section>

      {/* ── PRODUCTS ──────────────────────────────────────────── */}
      <section id="products" style={{ padding: 'clamp(80px,8vw,120px) 0' }}>
        <W>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: C.t3, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Product Ecosystem</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(28px,4vw,52px)', color: C.t1, marginTop: 12, marginBottom: 12 }}>
                Three products.<br />One mission.
              </h2>
              <p style={{ fontSize: 17, color: C.t2, maxWidth: 440, margin: '0 auto' }}>
                Each tool is purpose-built to help you become job-ready, faster.
              </p>
            </div>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,360px),1fr))', gap: 20 }}>
            <Reveal delay={0}>
              <ProductCard
                title="Jobr Prep"
                subtitle="AI Career Preparation"
                desc="Not just a CV rewriter. Prep.Jobr tracks applications, runs AI mock interviews tailored to the JD, and builds your personal career roadmap."
                icon={FileText}
                color={C.orange}
                ctaLabel="Start Prepping Free"
                ctaHref="/dashboard"
                features={[
                  "AI rewrites every bullet with Google's XYZ formula",
                  'Full application tracker across all rounds',
                  'Mock interviews tailored to specific JDs',
                  'Skill gap analysis with curated learning paths',
                ]}
                preview={<PrepPreview />}
              />
            </Reveal>

            <Reveal delay={0.08}>
              <ProductCard
                title="Jobr Mentor"
                subtitle="Expert Guidance"
                desc="Browse verified domain experts across PM, SWE, Data, Design and more. Book sessions with credits. Pay only after delivery is confirmed."
                icon={Users}
                color={C.purple}
                ctaLabel="Browse Mentors"
                ctaHref="/mentor"
                features={[
                  '8+ verified mentors across all top domains',
                  'Escrow system — credits released on delivery',
                  '24h auto-release protects both parties',
                  'Dispute resolution handled by Jobr',
                ]}
                preview={<MentorPreview />}
              />
            </Reveal>

            <Reveal delay={0.16}>
              <ProductCard
                title="Jobr Merch"
                subtitle="Community & Identity"
                desc="Custom cohort merchandise, welcome kits, and graduation bundles. No minimums, WhatsApp ordering, and Pan-India delivery."
                icon={ShoppingBag}
                color={C.green}
                ctaLabel="Browse Catalogue"
                ctaHref="/merch"
                features={[
                  'T-shirts, hoodies, caps, mugs, tote bags & more',
                  'Bulk orders from 10 units — cohort & event ready',
                  'Upload design → WhatsApp confirm → delivered',
                  'Edtech cohort kits, hackathon swag, grad merch',
                ]}
                preview={<MerchPreview />}
              />
            </Reveal>
          </div>
        </W>
      </section>

      {/* ── PREP SHOWCASE ─────────────────────────────────────── */}
      <section style={{ background: C.bg, padding: 'clamp(80px,8vw,120px) 0' }}>
        <W>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,420px),1fr))', gap: '56px 72px', alignItems: 'center' }}>
            <Reveal>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: C.oHover, letterSpacing: '0.1em', textTransform: 'uppercase', background: C.oSoft, border: `1px solid ${C.oBorder}`, padding: '4px 10px', borderRadius: 100, display: 'inline-block', marginBottom: 16 }}>Jobr Prep</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(28px,3.5vw,48px)', color: C.t1, marginBottom: 20, lineHeight: 1.05 }}>
                Your resume, rewritten<br />by AI. Cracked by you.
              </h2>
              <p style={{ fontSize: 17, color: C.t2, lineHeight: 1.75, marginBottom: 28, maxWidth: 440 }}>
                Paste your CV and a job description. In 30 seconds, every bullet is rewritten using Google's XYZ formula — quantified, impactful, ATS-ready.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                {[
                  { icon: Zap,     label: 'Instant AI rewrite', desc: '30-second turnaround, zero data stored' },
                  { icon: Target,  label: 'JD-matched content', desc: 'Keywords extracted from the actual job post' },
                  { icon: BarChart2, label: 'Live score tracking', desc: 'Resume score improves with every edit' },
                ].map(f => (
                  <div key={f.label} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: C.oSoft, border: `1px solid ${C.oBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <f.icon size={15} color={C.orange} />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: C.t1, marginBottom: 1 }}>{f.label}</div>
                      <div style={{ fontSize: 12, color: C.t3 }}>{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <a href="/dashboard" className="btn-primary">Start Prepping Free <ArrowRight size={15} /></a>
            </Reveal>

            {/* Right: Resume scoring mockup */}
            <Reveal delay={0.15}>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 24, padding: 28, boxShadow: '0 20px 48px rgba(24,24,27,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: C.t1 }}>Resume Score</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: C.t3 }}>Nitish_CV_v3.pdf</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 24 }}>
                  <ScoreRing score={84} color={C.orange} label="Overall" />
                  <ScoreRing score={91} color={C.green}  label="ATS" />
                  <ScoreRing score={78} color={C.blue}   label="Impact" />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <ProgressBar label="Work Experience"  value={88} color={C.orange} delay={0} />
                  <ProgressBar label="Skills Section"   value={75} color={C.purple} delay={0.1} />
                  <ProgressBar label="Education"        value={96} color={C.green}  delay={0.2} />
                  <ProgressBar label="Summary"          value={62} color={C.blue}   delay={0.3} />
                </div>
                <div style={{ padding: '12px 14px', background: C.oSoft, border: `1px solid ${C.oBorder}`, borderRadius: 10 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 12, color: C.oHover, marginBottom: 6 }}>✦ Top suggestions</div>
                  {['Add metrics to 2 bullets in experience', 'Include 4 missing keywords from JD', 'Shorten summary to 3 lines'].map((s, i) => (
                    <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start', marginBottom: 4 }}>
                      <span style={{ color: C.orange, fontSize: 11, marginTop: 1 }}>→</span>
                      <span style={{ fontSize: 11, color: C.t2, lineHeight: 1.5 }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </W>
      </section>

      {/* ── MENTOR SHOWCASE ───────────────────────────────────── */}
      <section style={{ padding: 'clamp(80px,8vw,120px) 0' }}>
        <W>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,420px),1fr))', gap: '56px 72px', alignItems: 'center' }}>

            {/* Left: mentor grid */}
            <Reveal>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { name: 'Rahul Sharma',   role: 'Product Manager', company: 'Google',    rating: 5, sessions: 48, tag: 'PM',      tagColor: C.purple },
                  { name: 'Priya Kumar',    role: 'SWE',             company: 'Microsoft', rating: 5, sessions: 92, tag: 'SWE',     tagColor: C.blue   },
                  { name: 'Arjun Mehta',    role: 'Data Scientist',  company: 'Flipkart',  rating: 4, sessions: 34, tag: 'DS',      tagColor: C.green  },
                  { name: 'Sneha Iyer',     role: 'UX Designer',     company: 'Swiggy',    rating: 5, sessions: 61, tag: 'Design',  tagColor: C.orange },
                  { name: 'Vikram Nair',    role: 'Finance',         company: 'Zerodha',   rating: 5, sessions: 27, tag: 'Finance', tagColor: '#D97706'},
                  { name: 'Divya Pillai',   role: 'SWE',             company: 'Razorpay',  rating: 4, sessions: 55, tag: 'SWE',     tagColor: C.blue   },
                ].map(m => <MentorCard key={m.name} {...m} />)}
              </div>
            </Reveal>

            {/* Right */}
            <Reveal delay={0.15}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: C.purple, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.18)', padding: '4px 10px', borderRadius: 100, display: 'inline-block', marginBottom: 16 }}>Jobr Mentor</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(28px,3.5vw,48px)', color: C.t1, marginBottom: 20, lineHeight: 1.05 }}>
                Learn from people<br />already there.
              </h2>
              <p style={{ fontSize: 17, color: C.t2, lineHeight: 1.75, marginBottom: 28, maxWidth: 420 }}>
                Browse verified domain experts across PM, SWE, Data Science, Design, and Finance. Book with credits. Pay only after you're satisfied.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                {[
                  { label: 'Verified experts only',    desc: 'Every mentor is vetted for domain expertise' },
                  { label: 'Credits-based wallet',     desc: 'Top up once, use across any mentor, anytime' },
                  { label: 'Built-in escrow system',   desc: 'Pay only after delivery is confirmed by you' },
                ].map(f => (
                  <div key={f.label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <CheckCircle size={14} color={C.purple} style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: C.t1 }}>{f.label}</span>
                      <span style={{ fontSize: 12, color: C.t3, display: 'block' }}>{f.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <a href="/mentor" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '12px 24px', borderRadius: 100, fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-display)', textDecoration: 'none', background: C.purple, color: '#fff', boxShadow: '0 4px 16px rgba(124,58,237,0.28)', transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; }}>
                  Browse Mentors <ArrowRight size={14} />
                </a>
                <a href="/mentor/onboard" className="btn-ghost" style={{ fontSize: 14, padding: '12px 20px' }}>
                  Become a Mentor
                </a>
              </div>
            </Reveal>
          </div>
        </W>
      </section>

      {/* ── MERCH SHOWCASE ────────────────────────────────────── */}
      <section style={{ background: C.bg, padding: 'clamp(80px,8vw,120px) 0' }}>
        <W>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,420px),1fr))', gap: '56px 72px', alignItems: 'center' }}>
            <Reveal>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: C.green, letterSpacing: '0.1em', textTransform: 'uppercase', background: C.gSoft, border: '1px solid #BBF7D0', padding: '4px 10px', borderRadius: 100, display: 'inline-block', marginBottom: 16 }}>Jobr Merch</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(28px,3.5vw,48px)', color: C.t1, marginBottom: 20, lineHeight: 1.05 }}>
                Wear your cohort.<br />Own your identity.
              </h2>
              <p style={{ fontSize: 17, color: C.t2, lineHeight: 1.75, marginBottom: 28, maxWidth: 440 }}>
                From a single tee to 500 cohort kits — upload your design, pick your product, and confirm on WhatsApp. No complex checkout, no minimum order drama.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
                {[
                  { label: 'Welcome Kits',     icon: '🎁', desc: 'For new joiners & cohort starts' },
                  { label: 'Graduation Merch', icon: '🎓', desc: 'Celebrate every milestone' },
                  { label: 'Hackathon Swag',   icon: '⚡', desc: 'Events that leave an impression' },
                  { label: 'Cohort Tees',      icon: '👕', desc: 'Community & identity in wearable form' },
                ].map(item => (
                  <div key={item.label} style={{ padding: '14px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14 }}>
                    <div style={{ fontSize: 20, marginBottom: 6 }}>{item.icon}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: C.t1, marginBottom: 3 }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: C.t3, lineHeight: 1.4 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
              <a href="/merch" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '12px 24px', borderRadius: 100, fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-display)', textDecoration: 'none', background: C.green, color: '#fff', boxShadow: '0 4px 16px rgba(22,163,74,0.25)', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; }}>
                Browse Catalogue <ArrowRight size={14} />
              </a>
            </Reveal>

            {/* Right: order preview */}
            <Reveal delay={0.15}>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 24, padding: 24, boxShadow: '0 20px 48px rgba(24,24,27,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: C.t1 }}>Cohort Kit Builder</span>
                  <span style={{ fontSize: 10, color: C.green, fontFamily: 'var(--font-mono)', background: C.gSoft, padding: '3px 8px', borderRadius: 100 }}>LIVE</span>
                </div>
                {[
                  { name: 'Premium T-Shirt',     qty: 50,   price: '₹350 × 50', total: '₹17,500' },
                  { name: 'Embroidered Cap',      qty: 50,   price: '₹280 × 50', total: '₹14,000' },
                  { name: 'Notebook Set',         qty: 50,   price: '₹120 × 50', total: '₹6,000' },
                  { name: 'Tote Bag (Printed)',   qty: 50,   price: '₹180 × 50', total: '₹9,000' },
                ].map((item, i) => (
                  <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: i % 2 === 0 ? C.bg : 'transparent', borderRadius: 8, marginBottom: 4 }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 12, color: C.t1 }}>{item.name}</div>
                      <div style={{ fontSize: 10, color: C.t3, fontFamily: 'var(--font-mono)' }}>{item.price}</div>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, color: C.green }}>{item.total}</span>
                  </div>
                ))}
                <div style={{ marginTop: 12, padding: '12px 14px', background: C.gSoft, border: '1px solid #BBF7D0', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: C.green }}>Kit Total</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 16, color: C.green }}>₹46,500</span>
                </div>
                <div style={{ marginTop: 10, fontSize: 11, color: C.t3, textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
                  WhatsApp confirm → 7 day delivery
                </div>
              </div>
            </Reveal>
          </div>
        </W>
      </section>

      {/* ── SUCCESS STORIES ───────────────────────────────────── */}
      <section style={{ padding: 'clamp(80px,8vw,120px) 0' }}>
        <W>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: C.t3, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Success Stories</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(28px,4vw,52px)', color: C.t1, marginTop: 12 }}>
                Real results.<br />Real students.
              </h2>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,340px),1fr))', gap: 20 }}>
            {[
              {
                name: 'Aditya Sharma', role: 'B.Tech CSE · IIT Bombay',
                quote: 'Jobr Prep rewrote my entire CV in under a minute. The AI caught missing metrics I had no idea were important. Got shortlisted at Google two weeks later.',
                result: 'Placed at Google SWE', color: C.orange, rating: 5,
              },
              {
                name: 'Riya Verma', role: 'MBA · IIM Calcutta',
                quote: 'The mentor sessions through Jobr were the most practical advice I have ever received. My mentor caught exactly what was going wrong in my case interviews.',
                result: 'Cracked McKinsey', color: C.purple, rating: 5,
              },
              {
                name: 'Karan Mehta', role: 'EdTech Operations Head',
                quote: 'We ordered welcome kits for 400 students using Jobr Merch. WhatsApp-based ordering, zero headaches, everything delivered within a week.',
                result: '400 kits in 7 days', color: C.green, rating: 5,
              },
            ].map((s, i) => (
              <Reveal key={s.name} delay={i * 0.1}>
                <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24, height: '100%', display: 'flex', flexDirection: 'column', gap: 14, transition: 'all 0.25s', cursor: 'default' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 40px rgba(24,24,27,0.09)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}>
                  {/* Stars */}
                  <div style={{ display: 'flex', gap: 3 }}>
                    {[...Array(s.rating)].map((_, j) => <Star key={j} size={13} fill={s.color} color={s.color} />)}
                  </div>
                  {/* Quote */}
                  <p style={{ fontSize: 14, color: C.t2, lineHeight: 1.7, margin: 0, flex: 1, fontStyle: 'italic' }}>
                    "{s.quote}"
                  </p>
                  {/* Author */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: `${s.color}18`, border: `1px solid ${s.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 14, color: s.color, flexShrink: 0 }}>
                      {s.name[0]}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: C.t1 }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: C.t3 }}>{s.role}</div>
                    </div>
                    <div style={{ marginLeft: 'auto', padding: '4px 10px', borderRadius: 100, background: `${s.color}10`, border: `1px solid ${s.color}20`, fontSize: 10, color: s.color, fontFamily: 'var(--font-mono)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {s.result}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </W>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────── */}
      <section style={{ background: '#18181B', padding: 'clamp(80px,8vw,120px) 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <Reveal>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#3F3F46', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Start Today
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(32px,5vw,64px)', color: '#FAFAF9', marginTop: 16, marginBottom: 16, letterSpacing: '-0.04em', lineHeight: 1.0 }}>
              Everything You Need<br />
              <span style={{ color: C.orange }}>To Become Job Ready.</span>
            </h2>
            <p style={{ fontSize: 17, color: '#71717A', lineHeight: 1.75, maxWidth: 480, margin: '0 auto 36px' }}>
              Preparation, mentorship, and growth — all in one place. No five different platforms. Just Jobr.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
              <a href="/dashboard" className="btn-primary" style={{ fontSize: 16, padding: '16px 40px' }}>
                Start Your Career Journey <ArrowRight size={16} />
              </a>
              <a href="/mentor" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'transparent', color: '#A1A1AA',
                fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16,
                padding: '16px 32px', borderRadius: 100,
                border: '1px solid #3F3F46', textDecoration: 'none',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#71717A'; (e.currentTarget as HTMLElement).style.color = '#FAFAF9'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#3F3F46'; (e.currentTarget as HTMLElement).style.color = '#A1A1AA'; }}>
                Browse Mentors
              </a>
            </div>
            <p style={{ fontSize: 12, color: '#27272A', fontFamily: 'var(--font-mono)' }}>
              Free to start · No credit card · Your data stays private
            </p>
          </Reveal>
        </div>
      </section>

      <style jsx global>{`
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }
      `}</style>
    </div>
  );
}
