import type { Metadata } from 'next';
import './globals.css';
import { Header, Footer } from '@/components/Navigation';
import BugWidget from '@/components/BugWidget';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Jobr — Career Operating System for Students',
  description: 'Prepare for interviews, improve your resume, connect with mentors, and grow your career — all from one platform.',
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: 'Jobr — Career Operating System for Students',
    description: 'Everything You Need To Become Job Ready.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <BugWidget />
      </body>
    </html>
  );
}
