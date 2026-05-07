import './globals.css';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0f1e] text-slate-200 flex flex-col min-h-screen selection:bg-cyan-500/30">
        
        {/* VIBRANT NAV BAR */}
        <nav className="flex justify-between items-center px-10 py-6 border-b border-white/5 bg-[#0a0f1e]/80 backdrop-blur-xl sticky top-0 z-50">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center font-black text-white shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform">J</div>
            <span className="font-bold tracking-tight text-white">Jobr<span className="text-cyan-400">.</span>co.in</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link href="/merch" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-cyan-400 transition-all">
              <ShoppingBag size={14} /> Merch Store
            </Link>
            <Link href="/auth" className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white text-[10px] font-black uppercase rounded-full transition-all shadow-lg shadow-cyan-500/20">
              Start Optimizing
            </Link>
          </div>
        </nav>

        <main className="flex-grow">{children}</main>

        {/* SOOTHING FOOTER */}
        <footer className="border-t border-white/5 py-12 px-10 bg-[#070b14]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-2">
              <h2 className="text-xl font-black text-white italic tracking-tighter">Jobr.co.in</h2>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-500/60">Built for the Bangalore Tech Elite</p>
            </div>
            <div className="flex flex-col items-end gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">
              <div className="flex gap-4">
                <span className="text-cyan-400/80">Privacy First</span>
                <span className="text-indigo-400">Google XYZ Powered</span>
                <span>2026</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}