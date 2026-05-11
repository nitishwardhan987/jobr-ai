export default function PrivacyPage() {
  const lastUpdated = 'May 11, 2026';
  return (
    <div style={{ background: '#1C1C2E', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(145deg, rgba(124,58,237,0.08) 0%, transparent 50%)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: 'clamp(48px,6vw,80px) 20px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 100, padding: '5px 14px', marginBottom: 20 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#10B981', fontFamily: 'monospace' }}>🔒 PRIVACY FIRST</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,5vw,52px)', fontWeight: 900, color: '#F1F0FF', letterSpacing: '-0.03em', marginBottom: 12 }}>Privacy Policy</h1>
          <p style={{ fontSize: 14, color: '#475569' }}>Last updated: {lastUpdated}</p>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(32px,5vw,60px) 20px' }}>
        {[
          {
            title: '1. The short version',
            content: 'Jobr is built privacy-first. Your CV data never touches our servers — you use your own AI API key (Gemini, OpenAI, or Anthropic) and all processing happens directly between your browser and the AI provider. We store only what\'s necessary to run the platform: your account, job tracks, bookings, and mentor profiles.',
          },
          {
            title: '2. What we collect',
            items: [
              'Account information: email address and display name when you sign up',
              'Job tracks: companies, roles, application status, and notes you enter',
              'Booking data: session type, date, time, and payment reference when you book a mentor',
              'Mentor profiles: name, bio, domain, and availability for mentors who onboard',
              'Bug reports: issue descriptions and page URLs submitted via the bug widget',
              'Usage data: basic analytics on which pages are visited (no personal tracking)',
            ],
          },
          {
            title: '3. What we never collect',
            items: [
              'Your CV text — this goes directly from your browser to the AI API you choose. Jobr never sees it.',
              'Your AI API keys — stored only in your browser\'s localStorage, never sent to our servers',
              'Payment card details — UPI transactions go directly to the payment provider',
              'WhatsApp or phone numbers — we only share your meeting link post-booking, never personal contacts',
            ],
          },
          {
            title: '4. How we use your data',
            content: 'We use your data solely to operate Jobr — to show you your job tracks, process bookings, display mentor profiles, and send you booking confirmations. We never sell your data, never use it for advertising, and never share it with third parties except where legally required.',
          },
          {
            title: '5. Data storage and security',
            content: 'Your data is stored in Supabase (hosted in AWS, secured with Row Level Security). All data in transit is encrypted via TLS. We use Anthropic-grade security practices for all API integrations.',
          },
          {
            title: '6. Your rights',
            items: [
              'Access: request a copy of all data we hold about you',
              'Deletion: request complete deletion of your account and all associated data',
              'Correction: update or correct any information in your account',
              'Portability: export your job tracks and booking history at any time',
            ],
            footer: 'To exercise any of these rights, email nitish@jobr.co.in with the subject "Privacy Request".',
          },
          {
            title: '7. Cookies',
            content: 'Jobr uses no third-party tracking cookies. We use only essential session cookies required to keep you logged in. No Google Analytics, no Facebook Pixel, no advertising trackers.',
          },
          {
            title: '8. Contact',
            content: 'For any privacy concerns, email nitish@jobr.co.in. We respond within 48 hours.',
          },
        ].map(section => (
          <div key={section.title} style={{ marginBottom: 36 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: '#F1F0FF', marginBottom: 12 }}>{section.title}</h2>
            {section.content && <p style={{ fontSize: 15, color: '#94A3B8', lineHeight: 1.75, margin: 0 }}>{section.content}</p>}
            {section.items && (
              <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
                {section.items.map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                    <span style={{ color: '#7C3AED', flexShrink: 0, marginTop: 3 }}>✓</span>
                    <span style={{ fontSize: 15, color: '#94A3B8', lineHeight: 1.65 }}>{item}</span>
                  </li>
                ))}
              </ul>
            )}
            {section.footer && <p style={{ fontSize: 14, color: '#64748B', marginTop: 12, padding: '10px 14px', background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.1)', borderRadius: 8 }}>{section.footer}</p>}
          </div>
        ))}

        <div style={{ padding: '20px 24px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#10B981', fontFamily: 'var(--font-display)', marginBottom: 6 }}>🔒 Privacy is not a feature. It's the foundation.</div>
          <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.65, margin: 0 }}>Jobr was architected with privacy as a core constraint, not an afterthought. Your CV data never hits our servers. Your API keys stay in your browser. That's a promise, not a policy.</p>
        </div>
      </div>
    </div>
  );
}