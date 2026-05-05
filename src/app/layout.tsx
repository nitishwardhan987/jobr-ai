import type { Metadata } from "next";
import { Header, Footer } from '@/components/Navigation';
import "./globals.css";

export const metadata: Metadata = {
  title: "Jobr.co.in | AI Career Co-Pilot",
  description: "Optimize your CV using the Google XYZ formula",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50">
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}