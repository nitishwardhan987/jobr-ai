'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, LayoutDashboard, Sparkles } from 'lucide-react';

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const session = localStorage.getItem('jobr_session');
      setIsLoggedIn(!!session);
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jobr_session');
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50 flex items-center justify-between px-10"
    >
      <div className="flex items-center gap-10">
        <Link href="/" className="group flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white group-hover:rotate-12 transition-transform">J</div>
          <span className="text-2xl font-black text-white tracking-tighter">Jobr<span className="text-blue-500">.co.in</span></span>
        </Link>
      </div>

      <div className="flex items-center gap-6">
        {!isLoggedIn ? (
          <>
            <Link href="/auth" className="text-sm font-bold text-slate-400 hover:text-white transition-all uppercase tracking-widest">Sign In</Link>
            <Link href="/auth" className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-8 py-3 rounded-full transition-all shadow-lg shadow-blue-500/20">
              Start Optimizing
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-all">
              <LayoutDashboard size={16} /> Dashboard
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/20 text-red-400 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all">
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        )}
      </div>
    </motion.header>
  );
}

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/5 py-20 px-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
        <div>
          <h2 className="text-2xl font-black text-white mb-4 tracking-tighter">Jobr.co.in</h2>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Built for the Bangalore Tech Elite</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em]">Privacy First • Google XYZ Powered • 2026</p>
        </div>
      </div>
    </footer>
  );
}