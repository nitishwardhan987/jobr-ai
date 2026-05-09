import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Jobr — AI Tools for Career Growth',
  description: 'AI-powered CV optimisation, custom merch, and mentor sourcing.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "'DM Sans', sans-serif", background: '#F5F4F0', color: '#0D0D0D' }}>

        <header style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: 'rgba(245,244,240,0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(13,13,13,0.08)',
        }}>
          <div style={{
            maxWidth: 1120, margin: '0 auto', padding: '0 24px',
            height: 60, display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', gap: 16,
          }}>
            <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              <div style={{
                width: 30, height: 30, background: '#6B4EFF', borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 900, color: '#fff',
                fontFamily: 'monospace', flexShrink: 0,
              }}>J</div>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#0D0D0D', letterSpacing: '-0.02em' }}>
                Jobr.co.in
              </span>
            </a>

            <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <a href="/merch" className="nav-link">Merch Store</a>
              <a href="/mentor" className="nav-link">
                MentorLink <span className="nav-badge">SOON</span>
              </a>
              <a href="/auth" className="nav-link">Sign In</a>
              <a href="/auth?mode=signup" className="cta-btn">Get Started</a>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer style={{
          borderTop: '1px solid rgba(13,13,13,0.08)',
          background: '#FFFFFF', padding: '32px 24px', marginTop: 80,
        }}>
          <div style={{
            maxWidth: 1120, margin: '0 auto',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 24, height: 24, background: '#6B4EFF', borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 900, color: '#fff', fontFamily: 'monospace',
              }}>J</div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#0D0D0D' }}>Jobr.co.in</span>
            </div>
            <div style={{ display: 'flex', gap: 24 }}>
              <a href="#" className="footer-link">Privacy</a>
              <a href="#" className="footer-link">Terms</a>
              <a href="#" className="footer-link">Contact</a>
            </div>
            <p style={{ fontSize: 12, color: '#8A8A9A', fontFamily: 'monospace', margin: 0 }}>
              © 2026 Jobr · Built for Bangalore Tech Elite
            </p>
          </div>
        </footer>

      </body>
    </html>
  );
}