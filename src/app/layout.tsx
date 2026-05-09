import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'Jobr — AI Tools for Career Growth',
  description: 'AI-powered CV optimisation, custom merch, and mentor sourcing.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}