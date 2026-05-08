// ─────────────────────────────────────────────────────────────────────────────
// src/app/merch/layout.tsx
//
// Metadata for the /merch route.
// The actual page UI is in page.tsx (client component).
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Merch Store — Jobr.co.in',
  description:
    'Custom-printed apparel, hoodies, accessories and more. Built for the Bangalore Tech Elite. Bulk orders from 10 units.',
  openGraph: {
    title: 'Jobr Merch Store',
    description: 'Custom merch for Bangalore tech people.',
    url: 'https://jobr.co.in/merch',
  },
};

export default function MerchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}