import type { Metadata } from 'next';
import './globals.css';
import { Header, Footer } from '@/components/Navigation';
import BugWidget from '@/components/BugWidget';

export const metadata: Metadata = {
  title: 'Jobr — India\'s AI Career Platform',
  description: 'Optimize your CV with AI, source verified mentors for your edtech, or order custom merch.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800,900&display=swap" rel="stylesheet" />
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