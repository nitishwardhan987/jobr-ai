export default function MissionPage() {
  return (
    <div style={{ background: '#1C1C2E', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(145deg, rgba(124,58,237,0.10) 0%, transparent 60%)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: 'clamp(60px,8vw,100px) 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>🎯</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,5vw,56px)', fontWeight: 900, color: '#F1F0FF', letterSpacing: '-0.03em', marginBottom: 20, lineHeight: 1.1 }}>Our Mission</h1>
          <p style={{ fontSize: 'clamp(18px,2.5vw,24px)', color: '#A78BFA', fontFamily: 'var(--font-display)', fontWeight: 700, lineHeight: 1.5, marginBottom: 20 }}>
            "To make career growth accessible, transparent, and fair for every student and professional in India."
          </p>
          <p style={{ fontSize: 16, color: '#64748B', lineHeight: 1.7 }}>
            And to make it dead simple for edtech companies to find, book, and pay great mentors — without the operational headache.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(40px,5vw,72px) 20px' }}>

        {/* The problem */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, color: '#F1F0FF', marginBottom: 20 }}>The Problem We're Solving</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,260px), 1fr))', gap: 14 }}>
            {[
              { emoji: '📄', problem: 'Students spend hours writing CVs that get rejected in seconds by ATS systems — not because they lack skills, but because they don\'t know how to frame them.' },
              { emoji: '🎓', problem: 'There\'s no easy way for a student to find and book a domain expert for 1 hour of targeted help — assignment help, mock interview, or career guidance.' },
              { emoji: '🏢', problem: 'EdTech companies coordinate mentor sessions on WhatsApp with spreadsheets, chasing payments manually, losing hours to ops that should be automated.' },
            ].map((p, i) => (
              <div key={i} style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.12)', borderRadius: 16, padding: 20 }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{p.emoji}</div>
                <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.65, margin: 0 }}>{p.problem}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our answer */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, color: '#F1F0FF', marginBottom: 20 }}>Our Answer</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { num: '01', title: 'AI tools built for Indian students', desc: 'Prep.Jobr uses Google\'s XYZ formula to rewrite CVs the way top recruiters want to see them. Mock interviews that read the actual JD. Roadmaps that turn rejection into a plan.', color: '#7C3AED' },
              { num: '02', title: 'A mentor marketplace with real protection', desc: 'Mentor.Jobr connects students and edtechs with verified domain experts. Credits-based, escrow-protected, dispute-mediated. No one loses money when something goes wrong.', color: '#4F46E5' },
              { num: '03', title: 'Merch for teams that learn together', desc: 'Merch.Jobr makes it easy for cohorts, hackathon teams, and EdTech companies to get branded merchandise — no minimums, WhatsApp ordering, delivered across India.', color: '#10B981' },
            ].map(a => (
              <div key={a.num} style={{ display: 'flex', gap: 20, padding: '20px 24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, alignItems: 'flex-start' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: a.color, fontFamily: 'var(--font-display)', lineHeight: 1, flexShrink: 0, opacity: 0.5 }}>{a.num}</div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: a.color, marginBottom: 8 }}>{a.title}</h3>
                  <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.65, margin: 0 }}>{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* North star */}
        <div style={{ padding: 'clamp(28px,4vw,40px)', background: 'linear-gradient(145deg, rgba(124,58,237,0.10), rgba(79,70,229,0.06))', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 16 }}>⭐</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 900, color: '#F1F0FF', marginBottom: 12 }}>Our North Star</h2>
          <p style={{ fontSize: 16, color: '#94A3B8', lineHeight: 1.7, maxWidth: 560, margin: '0 auto 24px' }}>
            Every product decision at Jobr is measured against one question: <strong style={{ color: '#F1F0FF' }}>does this make career growth more accessible and fair for someone in India?</strong> If yes, we build it. If not, we don't.
          </p>
          <a href="/about" className="btn-primary">Meet the Team →</a>
        </div>
      </div>
    </div>
  );
}