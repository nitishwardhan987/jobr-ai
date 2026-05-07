'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Rocket, ShieldCheck, Zap, ShoppingBag } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="bg-[#0a0f1e] text-slate-200 flex flex-col">
      
      {/* GLOWING HERO */}
      <section className="relative pt-24 pb-20 px-6 overflow-hidden flex flex-col items-center justify-center text-center">
        {/* Multi-tone Soothing Glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/5 border border-cyan-500/20 text-cyan-400 text-[9px] font-black uppercase tracking-[0.3em] mb-8">
            <Zap size={12} fill="currentColor" /> Neural Impact Engine v3
          </span>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-white">
            Own the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400">Shortlist.</span>
          </h1>
          
          <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12">
            Automated CV rewriting using the Google XYZ formula.
            Soothing, powerful, and built for 0-to-1 impact.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Link href="/auth" className="w-full md:w-auto px-12 py-5 bg-white text-[#0a0f1e] font-black rounded-full hover:shadow-cyan-500/20 shadow-2xl transition-all">
              GET STARTED
            </Link>
            <Link href="/merch" className="w-full md:w-auto px-12 py-5 bg-slate-900/50 border border-white/10 text-white font-black rounded-full hover:bg-slate-800 transition-all flex items-center gap-3">
              <ShoppingBag size={18} className="text-cyan-400" /> EXPLORE MERCH
            </Link>
          </div>
        </motion.div>
      </section>

      {/* VIBRANT BENTO BOXES */}
      <section className="max-w-6xl mx-auto py-20 px-10 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {[
          { title: "Privacy First", icon: ShieldCheck, color: "text-cyan-400", bg: "bg-cyan-500/5" },
          { title: "XYZ Impact", icon: Rocket, color: "text-indigo-400", bg: "bg-indigo-500/5" },
          { title: "Live Preview", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/5" }
        ].map((f, i) => (
          <div key={i} className={`p-10 ${f.bg} border border-white/5 rounded-[40px] hover:border-white/10 transition-all group`}>
            <f.icon className={`${f.color} mb-6 group-hover:scale-110 transition-transform`} size={32} />
            <h3 className="text-sm font-black mb-4 uppercase tracking-widest text-white">{f.title}</h3>
            <p className="text-slate-500 text-xs leading-relaxed font-medium">Built for the Bangalore Tech Elite.</p>
          </div>
        ))}
      </section>
    </div>
  );
}