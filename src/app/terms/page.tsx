export default function TermsPage() {
  return (
    <div style={{ background: '#1C1C2E', minHeight: '100vh' }}>
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: 'clamp(48px,6vw,80px) 20px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,5vw,52px)', fontWeight: 900, color: '#F1F0FF', letterSpacing: '-0.03em', marginBottom: 12 }}>Terms of Service</h1>
          <p style={{ fontSize: 14, color: '#475569' }}>Last updated: May 11, 2026 · Effective immediately</p>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(32px,5vw,60px) 20px' }}>
        <div style={{ padding: '14px 18px', background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.15)', borderRadius: 12, marginBottom: 36 }}>
          <p style={{ fontSize: 14, color: '#F97316', margin: 0, lineHeight: 1.6 }}>
            By using Jobr.co.in, you agree to these terms. These terms apply to all three products: Prep.Jobr, Mentor.Jobr, and Merch.Jobr.
          </p>
        </div>

        {[
          {
            title: '1. Acceptance of Terms',
            content: 'By accessing or using Jobr.co.in and any of its products, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.',
          },
          {
            title: '2. Prep.Jobr — CV Optimizer & Career Tools',
            items: [
              'You are responsible for the accuracy of the CV and job description content you input',
              'AI-generated CV optimization is a suggestion tool — Jobr does not guarantee interview selection or employment',
              'You use your own AI API keys. Jobr is not responsible for API costs you incur with third-party providers',
              'Free mock interview sessions are limited to 3 per account. Paid upgrades are non-refundable once activated',
              'Job track data is stored in your account. You can delete it at any time',
            ],
          },
          {
            title: '3. Mentor.Jobr — Booking & Sessions',
            items: [
              'Bookings are confirmed only after the mentor accepts the request',
              'Payment (credits or UPI) is held in escrow until session completion is confirmed by both parties',
              'Mentor session content is the sole responsibility of the mentor. Jobr does not verify the accuracy of advice given',
              'Disputes must be raised within 48 hours of the session date. Jobr\'s decision on disputes is final',
              'Mentors agree that Jobr retains a 10% platform fee on each completed session',
              'Session meeting links are shared only after booking confirmation. Jobr is not responsible for third-party meeting platform issues',
              'Cancellations by students with less than 12 hours notice may not be eligible for refund',
            ],
          },
          {
            title: '4. Merch.Jobr — Merchandise',
            items: [
              'Orders are confirmed via WhatsApp. A confirmed order cannot be cancelled once in production',
              'Design files submitted must not violate copyright or contain offensive content. Jobr reserves the right to reject any design',
              'Delivery timelines are estimates. Jobr is not liable for courier delays',
              'Bulk orders (10+ units) may have minimum lead times of 7-10 business days',
              'Refunds are only issued for manufacturing defects, not for design errors submitted by the customer',
            ],
          },
          {
            title: '5. User Conduct',
            items: [
              'You may not use Jobr to impersonate others or submit false information',
              'You may not attempt to scrape, reverse engineer, or exploit any part of the platform',
              'Abusive behaviour toward mentors, students, or Jobr staff will result in immediate account termination',
              'You may not use Jobr to facilitate any illegal activity',
            ],
          },
          {
            title: '6. Limitation of Liability',
            content: 'Jobr is a platform that connects users. We are not responsible for the quality of mentor sessions, career outcomes from CV optimization, or business outcomes from merchandise orders. Our maximum liability in any dispute is limited to the amount you paid for the specific service in question.',
          },
          {
            title: '7. Changes to Terms',
            content: 'We may update these terms from time to time. We\'ll notify registered users via email for material changes. Continued use of Jobr after a change constitutes acceptance of the new terms.',
          },
          {
            title: '8. Governing Law',
            content: 'These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Bangalore, Karnataka.',
          },
          {
            title: '9. Contact',
            content: 'For terms-related questions, email nitish@jobr.co.in with the subject "Terms Query".',
          },
        ].map(section => (
          <div key={section.title} style={{ marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: '#F1F0FF', marginBottom: 12 }}>{section.title}</h2>
            {section.content && <p style={{ fontSize: 15, color: '#94A3B8', lineHeight: 1.75, margin: 0 }}>{section.content}</p>}
            {section.items && (
              <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
                {section.items.map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                    <span style={{ color: '#475569', flexShrink: 0, fontSize: 16, marginTop: 1 }}>·</span>
                    <span style={{ fontSize: 15, color: '#94A3B8', lineHeight: 1.65 }}>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}