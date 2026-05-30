import type { Metadata } from 'next';
import './globals.css';
import { JobrNav, JobrFooter } from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'Jobr — Merchandise Operations Infrastructure',
  description: 'Automate onboarding kits, cohort merchandise, swag fulfillment, and inventory workflows through APIs, webhooks, and intelligent logistics infrastructure.',
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: 'Jobr — Merchandise Operations Infrastructure',
    description: 'Stop managing swag. Start automating operations.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body>
        <JobrNav />
        <main>{children}</main>
        <JobrFooter />
      </body>
    </html>
  );
}
