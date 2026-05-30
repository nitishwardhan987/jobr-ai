'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, Package, Truck, CheckCircle, BarChart3, Globe, Webhook, Database, Users, GitBranch, Shield } from 'lucide-react';

/* ─── Shared tokens ──────────────────────────────────────────── */
const C = {
  canvas:  '#F8F5F0',
  bg:      '#F5F1EA',
  surface: '#FFFFFF',
  elev:    '#FCFAF7',
  text1:   '#18181B',
  text2:   '#52525B',
  text3:   '#71717A',
  border:  '#E7E5E4',
  bStrong: '#D6D3D1',
  accent:  '#F97316',
  aHover:  '#EA580C',
  aSoft:   '#FFF7ED',
  aBorder: '#FED7AA',
  success: '#16A34A',
  warning: '#D97706',
};

/* ─── Scroll-reveal wrapper ──────────────────────────────────── */
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Animated counter ───────────────────────────────────────── */
function Counter({ to, suffix = '', prefix = '' }: { to: number; suffix?: string; prefix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(ease * to));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to]);

  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

/* ─── Workflow node ──────────────────────────────────────────── */
const WORKFLOW_STEPS = [
  { id: 'trigger',   label: 'Webhook Trigger',     icon: Zap,         color: '#F97316', desc: 'Event received from HRMS/LMS' },
  { id: 'validate',  label: 'Address Validation',  icon: Shield,      color: '#3B82F6', desc: 'Geocode & verify delivery address' },
  { id: 'inventory', label: 'Inventory Allocation', icon: Package,    color: '#8B5CF6', desc: 'Reserve SKUs from warehouse pool' },
  { id: 'print',     label: 'Print Queue',          icon: GitBranch,  color: '#10B981', desc: 'Job dispatched to print partner' },
  { id: 'shipment',  label: 'Shipment Created',     icon: Truck,      color: '#F59E0B', desc: 'Label generated, carrier assigned' },
  { id: 'tracking',  label: 'Tracking Generated',   icon: Globe,      color: '#EC4899', desc: 'AWB synced to tracking portal' },
  { id: 'crm',       label: 'CRM Updated',          icon: Database,   color: '#06B6D4', desc: 'Order record pushed to CRM/LMS' },
];

function WorkflowVisualization() {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inView = useInView(useRef<HTMLDivElement>(null), { once: true });

  const runWorkflow = useCallback(() => {
    if (running) return;
    setRunning(true);
    setActiveIndex(-1);
    let i = 0;
    const advance = () => {
      setActiveIndex(i);
      i++;
      if (i < WORKFLOW_STEPS.length) {
        timerRef.current = setTimeout(advance, 480);
      } else {
        setTimeout(() => {
          setRunning(false);
          setActiveIndex(-1);
        }, 2000);
      }
    };
    timerRef.current = setTimeout(advance, 200);
  }, [running]);

  useEffect(() => {
    const t = setTimeout(runWorkflow, 1200);
    return () => { clearTimeout(t); if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  useEffect(() => {
    if (!running && activeIndex === -1) {
      const t = setTimeout(runWorkflow, 3500);
      return () => clearTimeout(t);
    }
  }, [running, activeIndex, runWorkflow]);

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 28, padding: '32px 28px', boxShadow: '0 24px 48px rgba(24,24,27,0.10)', position: 'relative', overflow: 'hidden' }}>
      {/* Background texture */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, #E7E5E4 1px, transparent 0)', backgroundSize: '24px 24px', opacity: 0.5, pointerEvents: 'none' }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, position: 'relative' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: C.text3, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
            LIVE WORKFLOW · 247ms avg
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: C.text1 }}>
            Onboarding Kit — Batch #4821
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.success, animation: 'pulse-dot 2s infinite' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: C.success, fontWeight: 600 }}>RUNNING</span>
        </div>
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
        {WORKFLOW_STEPS.map((step, i) => {
          const Icon = step.icon;
          const isActive  = activeIndex === i;
          const isDone    = activeIndex > i;
          const isPending = activeIndex < i;
          return (
            <div key={step.id}>
              <motion.div
                animate={isActive ? { x: [0, 2, 0] } : {}}
                transition={{ duration: 0.3 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 14px',
                  borderRadius: 12,
                  background: isActive ? `${step.color}10` : isDone ? `${C.success}08` : 'transparent',
                  border: isActive ? `1px solid ${step.color}30` : isDone ? `1px solid ${C.success}18` : '1px solid transparent',
                  transition: 'all 0.25s ease',
                  position: 'relative',
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: isDone ? `${C.success}15` : isActive ? `${step.color}15` : `rgba(24,24,27,0.05)`,
                  border: `1px solid ${isDone ? `${C.success}25` : isActive ? `${step.color}30` : C.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.25s',
                  animation: isActive ? 'node-glow 1s infinite' : 'none',
                }}>
                  {isDone
                    ? <CheckCircle size={16} color={C.success} />
                    : <Icon size={16} color={isActive ? step.color : C.text3} />
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, color: isDone ? C.text2 : isActive ? C.text1 : C.text3, transition: 'color 0.25s' }}>{step.label}</div>
                  {isActive && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ fontSize: 11, color: step.color, fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                      {step.desc}
                    </motion.div>
                  )}
                </div>
                {isDone && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: C.success, fontWeight: 600 }}>✓</span>
                )}
                {isActive && (
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 0.9 }} style={{ width: 6, height: 6, borderRadius: '50%', background: step.color, flexShrink: 0 }} />
                )}
              </motion.div>

              {/* Connector */}
              {i < WORKFLOW_STEPS.length - 1 && (
                <div style={{ width: 1, height: 8, background: isDone ? `${C.success}40` : C.border, margin: '0 auto 0 31px', transition: 'background 0.3s' }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Replay button */}
      <button
        onClick={runWorkflow}
        disabled={running}
        style={{ marginTop: 20, width: '100%', padding: '10px', background: C.aSoft, border: `1px solid ${C.aBorder}`, borderRadius: 10, fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: C.accent, cursor: running ? 'not-allowed' : 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'all 0.15s', opacity: running ? 0.5 : 1 }}>
        {running ? 'Processing...' : '↺  Replay Workflow'}
      </button>
    </div>
  );
}

/* ─── Bento card ─────────────────────────────────────────────── */
function BentoCard({ title, desc, icon: Icon, color, large = false, children }: { title: string; desc: string; icon: React.ElementType; color: string; large?: boolean; children?: React.ReactNode }) {
  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 24,
      padding: large ? '36px' : '28px',
      gridColumn: large ? 'span 2' : 'span 1',
      transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s',
      cursor: 'default',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 48px rgba(24,24,27,0.10)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}12`, border: `1px solid ${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <Icon size={20} color={color} />
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: C.text1, marginBottom: 6, letterSpacing: '-0.02em' }}>{title}</h3>
      <p style={{ fontSize: 13, color: C.text3, lineHeight: 1.6, margin: 0 }}>{desc}</p>
      {children}
    </div>
  );
}

/* ─── Integration node ───────────────────────────────────────── */
function IntegrationOrb({ label, icon: Icon, color, x, y }: { label: string; icon: React.ElementType; color: string; x: string; y: string }) {
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 2 }}
      style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%, -50%)' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14, background: C.surface,
          border: `1px solid ${C.border}`, boxShadow: '0 4px 16px rgba(24,24,27,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={22} color={color} />
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: C.text2, fontWeight: 600, whiteSpace: 'nowrap' }}>{label}</span>
      </div>
    </motion.div>
  );
}

/* ─── Scale bar ──────────────────────────────────────────────── */
function ScaleBar({ qty, label, delay }: { qty: string; label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: C.text1, minWidth: 88 }}>{qty}</span>
      <div style={{ flex: 1, height: 8, background: C.bg, borderRadius: 999, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: label } : { width: 0 }}
          transition={{ duration: 0.8, delay: delay + 0.2, ease: 'easeOut' }}
          style={{ height: '100%', background: `linear-gradient(90deg, ${C.accent}, ${C.aHover})`, borderRadius: 999 }}
        />
      </div>
      <span style={{ fontSize: 13, color: C.text3, minWidth: 120, fontFamily: 'var(--font-body)' }}>{label.replace('%', ' kits')}</span>
    </motion.div>
  );
}

/* ─── Interactive Workflow Explorer ──────────────────────────── */
const TRIGGER_OPTIONS  = ['Webhook', 'CSV Upload', 'LMS Event', 'HRMS Event'];
const PRODUCT_OPTIONS  = ['T-Shirt Kit', 'Hoodie Bundle', 'Notebook Set', 'Full Onboarding Kit'];
const QTY_OPTIONS      = ['10–50', '50–500', '500–5,000', '5,000+'];
const REGION_OPTIONS   = ['Pan-India', 'Metro Cities', 'Tier 2 & 3', 'International'];

const WORKFLOW_OUTPUTS: Record<string, string[]> = {
  Webhook:    ['Endpoint validated', 'Payload schema verified', 'Auth token confirmed'],
  'CSV Upload': ['File parsed (847 rows)', 'Address columns mapped', 'Duplicates removed: 3'],
  'LMS Event': ['Event: course_completed', 'Learner ID resolved', 'Cohort segment matched'],
  'HRMS Event': ['Event: employee_onboarded', 'Department tag: Engineering', 'Tier: IC-3 mapped'],
};

function WorkflowExplorer() {
  const [trigger,  setTrigger]  = useState('Webhook');
  const [product,  setProduct]  = useState('Full Onboarding Kit');
  const [qty,      setQty]      = useState('50–500');
  const [region,   setRegion]   = useState('Pan-India');
  const [animKey,  setAnimKey]  = useState(0);

  const trigger_ = (v: string, setter: (s: string) => void) => { setter(v); setAnimKey(k => k + 1); };

  const STEPS = [
    { label: 'Address Validation', desc: `${qty} addresses verified via postal DB` },
    { label: 'Inventory Reserved', desc: `${product} — ${qty} units allocated` },
    { label: 'Print Job Created',  desc: `Job #${Math.floor(Math.random() * 9000) + 1000} → print queue` },
    { label: 'Shipment Created',   desc: `${region} shipping matrix applied` },
    { label: 'Tracking Synced',    desc: 'AWB codes generated & emailed' },
    { label: 'Webhook Response',   desc: '200 OK — delivery window: 3–5 days' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,340px),1fr))', gap: 24, alignItems: 'start' }}>

      {/* Left: Controls */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 24, padding: 28 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: C.text3, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 20 }}>
          Configure Workflow
        </div>

        {[
          { label: 'Trigger Source', options: TRIGGER_OPTIONS, value: trigger,  set: (v: string) => trigger_(v, setTrigger) },
          { label: 'Product Type',   options: PRODUCT_OPTIONS, value: product,  set: (v: string) => trigger_(v, setProduct) },
          { label: 'Quantity',       options: QTY_OPTIONS,     value: qty,      set: (v: string) => trigger_(v, setQty) },
          { label: 'Delivery Region',options: REGION_OPTIONS,  value: region,   set: (v: string) => trigger_(v, setRegion) },
        ].map(ctrl => (
          <div key={ctrl.label} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.text2, fontFamily: 'var(--font-display)', marginBottom: 8 }}>{ctrl.label}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {ctrl.options.map(opt => (
                <button key={opt} onClick={() => ctrl.set(opt)} style={{
                  padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                  fontFamily: 'var(--font-mono)', cursor: 'pointer', transition: 'all 0.15s',
                  background: ctrl.value === opt ? C.aSoft : C.bg,
                  border: `1px solid ${ctrl.value === opt ? C.aBorder : C.border}`,
                  color: ctrl.value === opt ? C.accent : C.text2,
                }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Trigger source outputs */}
        <div style={{ marginTop: 8, padding: 16, background: '#18181B', borderRadius: 12, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
          <div style={{ color: '#52525B', marginBottom: 8 }}>// {trigger} payload</div>
          {(WORKFLOW_OUTPUTS[trigger] || []).map((line, i) => (
            <div key={i} style={{ color: '#A1A1AA', marginBottom: 4 }}>→ {line}</div>
          ))}
        </div>
      </div>

      {/* Right: Live workflow output */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 24, padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: C.text3, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Live Execution
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.success, animation: 'pulse-dot 2s infinite' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: C.success }}>ACTIVE</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={animKey} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {STEPS.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}
              >
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: `${C.success}15`, border: `1px solid ${C.success}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <CheckCircle size={11} color={C.success} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, color: C.text1, marginBottom: 1 }}>{step.label}</div>
                  <div style={{ fontSize: 11, color: C.text3, fontFamily: 'var(--font-mono)' }}>{step.desc}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <div style={{ marginTop: 16, padding: '12px 14px', background: `${C.success}08`, border: `1px solid ${C.success}18`, borderRadius: 10 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: C.success, fontWeight: 600 }}>
            ✓ Workflow completed · 247ms · 0 errors
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── PAGE ───────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div style={{ background: C.canvas, minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1440, margin: '0 auto', padding: 'clamp(96px,12vw,160px) 32px clamp(80px,10vw,120px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,480px),1fr))', gap: '64px 80px', alignItems: 'center' }}>

        {/* Left */}
        <div>
          <div className="animate-fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: C.aSoft, border: `1px solid ${C.aBorder}`, borderRadius: 100, padding: '6px 14px', marginBottom: 28 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.accent, animation: 'pulse-dot 2s infinite' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: C.accent, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Merchandise Infrastructure
            </span>
          </div>

          <h1 className="animate-fade-up-1" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(52px, 6.5vw, 88px)', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.04em', color: C.text1, marginBottom: 24 }}>
            Merchandise<br />Operations.<br />
            <span style={{ color: C.accent }}>Automated.</span>
          </h1>

          <p className="animate-fade-up-2" style={{ fontSize: 'clamp(16px,1.5vw,19px)', color: C.text2, lineHeight: 1.7, maxWidth: 480, marginBottom: 36 }}>
            Automate onboarding kits, cohort merchandise, swag fulfillment, and inventory workflows through APIs, webhooks, and intelligent logistics infrastructure.
          </p>

          <div className="animate-fade-up-3" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 52 }}>
            <a href="#cta" className="btn-primary" style={{ fontSize: 16, padding: '15px 36px' }}>
              Book Demo
              <ArrowRight size={16} />
            </a>
            <a href="#workflow" className="btn-ghost" style={{ fontSize: 16, padding: '15px 32px' }}>
              View Live Workflow
            </a>
          </div>

          {/* Stats row */}
          <div className="animate-fade-up-4" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 32px' }}>
            {[
              { value: 250000, suffix: '+', label: 'Kits Fulfilled' },
              { value: 99.9,   suffix: '%', label: 'API Uptime'    },
              { value: 180,    suffix: '+', label: 'Integrations'  },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(22px,2.5vw,30px)', color: C.text1, letterSpacing: '-0.03em', lineHeight: 1 }}>
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <div style={{ fontSize: 12, color: C.text3, marginTop: 3, fontFamily: 'var(--font-mono)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — workflow visualization */}
        <div className="animate-fade-up-2" style={{ minWidth: 0 }}>
          <WorkflowVisualization />
        </div>
      </section>

      {/* ── TRUST BAR ──────────────────────────────────────────── */}
      <section style={{ background: C.surface, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '40px 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: C.text3, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Trusted by India's fastest-growing EdTech & Enterprise teams
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px 24px' }}>
            {['PhysicsWallah', 'upGrad', 'Scaler', 'Newton School', 'Unacademy', 'Masai School', 'Coding Ninjas', 'Internshala'].map(org => (
              <div key={org} style={{ padding: '8px 18px', borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, color: C.text3, whiteSpace: 'nowrap' }}>
                {org}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── METRICS ────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1440, margin: '0 auto', padding: 'clamp(80px,8vw,140px) 32px' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: C.text3, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Operations at Scale
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(32px,4vw,56px)', color: C.text1, marginTop: 12 }}>
              The numbers that matter.
            </h2>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,200px),1fr))', gap: '32px 24px' }}>
          {[
            { value: 250000, suffix: '+', label: 'Orders Fulfilled',      sub: 'Across all channels' },
            { value: 4200000, suffix: '+', label: 'Automations Executed', sub: 'Workflow runs this year' },
            { value: 240000, suffix: '+', label: 'Shipments Delivered',   sub: 'Pan-India & international' },
            { value: 99.9,  suffix: '%',  label: 'API Uptime SLA',        sub: 'Last 12 months' },
            { value: 620,   suffix: '+',  label: 'Active Customers',      sub: 'EdTech, enterprise, D2C' },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div style={{ textAlign: 'center', padding: '28px 20px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(32px,3.5vw,48px)', color: C.text1, letterSpacing: '-0.04em', lineHeight: 1 }}>
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: C.text1, marginTop: 10, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 12, color: C.text3, fontFamily: 'var(--font-mono)' }}>{s.sub}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── WORKFLOW EXPLORER ──────────────────────────────────── */}
      <section id="workflow" style={{ background: C.bg, padding: 'clamp(80px,8vw,140px) 0' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 32px' }}>
          <Reveal>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 56 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: C.text3, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Interactive Platform
              </span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(32px,4vw,56px)', color: C.text1, maxWidth: 600, lineHeight: 1.05 }}>
                Configure a workflow.<br />Watch it run live.
              </h2>
              <p style={{ fontSize: 18, color: C.text2, maxWidth: 520, lineHeight: 1.6 }}>
                Select your trigger, product, quantity, and region. The execution graph updates in real time — every action animated, every step traceable.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <WorkflowExplorer />
          </Reveal>
        </div>
      </section>

      {/* ── PLATFORM DASHBOARD ─────────────────────────────────── */}
      <section id="platform" style={{ maxWidth: 1440, margin: '0 auto', padding: 'clamp(80px,8vw,140px) 32px' }}>
        <Reveal>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 56 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: C.text3, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Operations Dashboard
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(32px,4vw,56px)', color: C.text1, maxWidth: 640, lineHeight: 1.05 }}>
              Everything in one command center.
            </h2>
          </div>
        </Reveal>

        {/* Bento grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,320px),1fr))', gap: 16, gridAutoRows: 'minmax(220px, auto)' }}>
          <Reveal delay={0}><BentoCard title="Inventory Intelligence" desc="Real-time SKU availability, reorder triggers, warehouse allocation, and low-stock alerts across all fulfillment centers." icon={Package} color="#F97316" large>
            <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[['T-Shirts', '4,820 units', C.success], ['Hoodies', '1,240 units', C.warning], ['Notebooks', '8,100 units', C.success], ['Caps', '320 units', '#EF4444']].map(([sku, qty, col]) => (
                <div key={sku as string} style={{ padding: '10px 12px', background: C.bg, borderRadius: 10, border: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 11, color: C.text3, fontFamily: 'var(--font-mono)', marginBottom: 2 }}>{sku as string}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: col as string }}>{qty as string}</div>
                </div>
              ))}
            </div>
          </BentoCard></Reveal>

          <Reveal delay={0.05}><BentoCard title="Shipment Tracking" desc="End-to-end visibility from print job creation to last-mile delivery with carrier-agnostic AWB tracking." icon={Truck} color="#3B82F6" /></Reveal>

          <Reveal delay={0.10}><BentoCard title="Address Verification" desc="Geocoding, postal DB matching, and AI-powered address normalization before dispatch. Zero failed deliveries." icon={Globe} color="#8B5CF6" /></Reveal>

          <Reveal delay={0.15}><BentoCard title="Workflow Monitoring" desc="Real-time execution logs, failure alerts, retry policies, and SLA dashboards for every automation pipeline." icon={BarChart3} color="#10B981" /></Reveal>

          <Reveal delay={0.20}><BentoCard title="API & Webhook Events" desc="REST APIs, GraphQL, and webhooks for every trigger point. Idempotent endpoints, rate-limit headers, signed payloads." icon={Webhook} color="#F59E0B" /></Reveal>

          <Reveal delay={0.25}><BentoCard title="Cohort Management" desc="Batch-process thousands of recipients across cohorts, departments, or geographic segments from a single API call." icon={Users} color="#EC4899" /></Reveal>

          <Reveal delay={0.30}><BentoCard title="Batch Processing" desc="Queue 100,000+ kit orders asynchronously. Priority lanes, backpressure handling, and dead-letter queues included." icon={GitBranch} color="#06B6D4" large /></Reveal>

          <Reveal delay={0.35}><BentoCard title="Analytics" desc="Operational metrics, fulfillment SLAs, per-cohort cost breakdowns, and exportable reports in CSV or JSON." icon={BarChart3} color="#16A34A" /></Reveal>
        </div>
      </section>

      {/* ── INTEGRATIONS ───────────────────────────────────────── */}
      <section id="integrations" style={{ background: C.bg, padding: 'clamp(80px,8vw,140px) 0', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,420px),1fr))', gap: '64px 80px', alignItems: 'center' }}>

            {/* Left */}
            <Reveal>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: C.text3, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Ecosystem
              </span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(32px,4vw,52px)', color: C.text1, marginTop: 12, marginBottom: 20, lineHeight: 1.05 }}>
                Plugs into your<br />existing stack.
              </h2>
              <p style={{ fontSize: 18, color: C.text2, lineHeight: 1.7, marginBottom: 32 }}>
                Jobr connects to your CRM, LMS, HRMS, and internal tools via REST APIs, webhooks, and native integrations — no middleware required.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['Salesforce', 'HubSpot', 'Moodle', 'Canvas LMS', 'Workday', 'Zoho HRMS', 'Zapier', 'n8n', 'Slack', 'Notion'].map(tool => (
                  <span key={tool} style={{ padding: '6px 14px', borderRadius: 8, background: C.surface, border: `1px solid ${C.border}`, fontSize: 12, fontWeight: 600, color: C.text2, fontFamily: 'var(--font-mono)' }}>
                    {tool}
                  </span>
                ))}
              </div>
            </Reveal>

            {/* Right — orbit diagram */}
            <Reveal delay={0.15}>
              <div style={{ position: 'relative', width: '100%', paddingTop: '100%', maxWidth: 420, margin: '0 auto' }}>
                <div style={{ position: 'absolute', inset: 0 }}>
                  {/* Center */}
                  <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 72, height: 72, background: '#18181B', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(24,24,27,0.20)' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22, color: '#F97316' }}>J</span>
                  </div>
                  {/* Connection lines */}
                  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                    {[['50%','8%'],['92%','30%'],['88%','72%'],['50%','92%'],['12%','72%'],['8%','30%']].map(([x, y], i) => (
                      <line key={i} x1="50%" y1="50%" x2={x} y2={y} stroke="#E7E5E4" strokeWidth="1.5" strokeDasharray="4 4" />
                    ))}
                  </svg>
                  {/* Orbs */}
                  <IntegrationOrb label="CRM"      icon={Database} color="#3B82F6" x="50%"  y="8%"  />
                  <IntegrationOrb label="LMS"      icon={Users}    color="#8B5CF6" x="92%"  y="30%" />
                  <IntegrationOrb label="HRMS"     icon={Shield}   color="#10B981" x="88%"  y="72%" />
                  <IntegrationOrb label="Webhooks" icon={Webhook}  color="#F97316" x="50%"  y="92%" />
                  <IntegrationOrb label="Internal" icon={GitBranch}color="#F59E0B" x="12%"  y="72%" />
                  <IntegrationOrb label="Database" icon={Database} color="#EC4899" x="8%"   y="30%" />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── SCALE SECTION ──────────────────────────────────────── */}
      <section style={{ maxWidth: 1440, margin: '0 auto', padding: 'clamp(80px,8vw,140px) 32px' }}>
        <Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,420px),1fr))', gap: '64px 80px', alignItems: 'center' }}>

            {/* Left */}
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: C.text3, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Elastic Scale
              </span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(32px,4vw,52px)', color: C.text1, marginTop: 12, marginBottom: 20, lineHeight: 1.05 }}>
                10 kits or 100,000.<br />Same workflow.
              </h2>
              <p style={{ fontSize: 18, color: C.text2, lineHeight: 1.7 }}>
                The operational pipeline is identical whether you're onboarding a single cohort or scaling across 50 cities simultaneously. Complexity stays with us.
              </p>
            </div>

            {/* Right: scale bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { qty: '10 kits',      pct: '8%',   delay: 0.1  },
                { qty: '100 kits',     pct: '18%',  delay: 0.2  },
                { qty: '1,000 kits',   pct: '36%',  delay: 0.3  },
                { qty: '10,000 kits',  pct: '62%',  delay: 0.4  },
                { qty: '100,000 kits', pct: '100%', delay: 0.5  },
              ].map(s => (
                <ScaleBar key={s.qty} qty={s.qty} label={s.pct} delay={s.delay} />
              ))}
              <p style={{ fontSize: 12, color: C.text3, fontFamily: 'var(--font-mono)', marginTop: 8 }}>
                Bar represents relative batch size. Workflow complexity stays flat.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── CASE STUDIES ───────────────────────────────────────── */}
      <section id="case-studies" style={{ background: C.bg, padding: 'clamp(80px,8vw,140px) 0' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 32px' }}>
          <Reveal>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 56 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: C.text3, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Customer Impact
              </span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(32px,4vw,56px)', color: C.text1, maxWidth: 600, lineHeight: 1.05 }}>
                Operational results.<br />Not marketing copy.
              </h2>
            </div>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,360px),1fr))', gap: 20 }}>
            {[
              {
                org: 'Large EdTech — 120K Learners',
                challenge: 'Manual coordination of welcome kits across 47 cohort batches, requiring 3 ops staff full-time.',
                impl: 'HRMS webhook triggers Jobr workflow on enrollment. Kits shipped within 48 hours of joining.',
                metrics: [['92%', 'Reduction in manual ops'], ['25,000', 'Kits automated quarterly'], ['48h', 'Fulfillment SLA']],
              },
              {
                org: 'Enterprise HR Team — 8K Employees',
                challenge: 'Address errors causing 14% return rate on employee onboarding kits, high reshipment costs.',
                impl: 'Jobr Address Validation API integrated into HRMS at record creation. Invalid addresses flagged before dispatch.',
                metrics: [['87%', 'Fewer address errors'], ['₹12L', 'Annual savings on returns'], ['0.3%', 'Current failure rate']],
              },
              {
                org: 'Coding Bootcamp — 6 Cities',
                challenge: 'Scaling certification merchandise from 200 to 4,000 graduates per quarter with same-size team.',
                impl: 'LMS completion event triggers batch kit order. Automated size/variant mapping from learner profile.',
                metrics: [['20×', 'Scale without headcount'], ['4,000', 'Kits per quarter'], ['99.1%', 'On-time delivery']],
              },
            ].map((cs, i) => (
              <Reveal key={cs.org} delay={i * 0.1}>
                <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 24, padding: 28, height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: C.accent, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
                    {cs.org}
                  </div>

                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.text3, fontFamily: 'var(--font-mono)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Challenge</div>
                    <p style={{ fontSize: 14, color: C.text2, lineHeight: 1.65, margin: 0 }}>{cs.challenge}</p>
                  </div>

                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.text3, fontFamily: 'var(--font-mono)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Implementation</div>
                    <p style={{ fontSize: 14, color: C.text2, lineHeight: 1.65, margin: 0 }}>{cs.impl}</p>
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginTop: 'auto', flexWrap: 'wrap' }}>
                    {cs.metrics.map(([val, label]) => (
                      <div key={label as string} style={{ flex: 1, minWidth: 90, padding: '12px', background: C.bg, borderRadius: 12, border: `1px solid ${C.border}`, textAlign: 'center' }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20, color: C.text1, letterSpacing: '-0.03em' }}>{val}</div>
                        <div style={{ fontSize: 11, color: C.text3, fontFamily: 'var(--font-mono)', marginTop: 2 }}>{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────── */}
      <section id="cta" style={{ padding: 'clamp(80px,8vw,120px) 32px', background: '#18181B' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <Reveal>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#52525B', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Get Started
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(36px,5vw,72px)', color: '#FAFAF9', marginTop: 16, marginBottom: 20, letterSpacing: '-0.04em', lineHeight: 1.0 }}>
              Stop Managing Swag.<br />
              <span style={{ color: C.accent }}>Start Automating<br />Operations.</span>
            </h2>
            <p style={{ fontSize: 18, color: '#71717A', lineHeight: 1.7, maxWidth: 520, margin: '0 auto 40px' }}>
              Join 620+ organizations that use Jobr to run merchandise operations at scale — without the overhead.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
              <a href="mailto:hello@jobr.co.in?subject=Book a Demo" className="btn-primary" style={{ fontSize: 16, padding: '16px 40px' }}>
                Book Demo
                <ArrowRight size={16} />
              </a>
              <a href="mailto:hello@jobr.co.in?subject=Talk to Sales" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'transparent', color: '#A1A1AA',
                fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16,
                padding: '16px 36px', borderRadius: 100,
                border: '1px solid #3F3F46', textDecoration: 'none',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#71717A'; (e.currentTarget as HTMLElement).style.color = '#FAFAF9'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#3F3F46'; (e.currentTarget as HTMLElement).style.color = '#A1A1AA'; }}>
                Talk to Sales
              </a>
            </div>
            <p style={{ fontSize: 12, color: '#3F3F46', fontFamily: 'var(--font-mono)' }}>
              No setup fee · Free pilot for first 500 kits · SLA-backed infrastructure
            </p>
          </Reveal>
        </div>
      </section>

    </div>
  );
}
