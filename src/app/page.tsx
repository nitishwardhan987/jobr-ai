'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Rocket, ShieldCheck, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="bg-slate-950 text-white min-h-[calc(100vh-80px)] selection:bg-blue-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
              <Zap size={14} fill="currentColor" /> Powered by Gemini 3 Flash Preview
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
              Own the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">Shortlist.</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-2xl font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
              Automated CV rewriting using the Google XYZ formula. Privacy-first, developer-focused, and built for 0-to-1 impact.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col md:flex-row gap-6 justify-center items-center"
          >
            <Link href="/auth" className="w-full md:w-auto px-12 py-5 bg-white text-slate-950 font-black rounded-full hover:scale-105 transition-transform shadow-2xl shadow-white/10">
              CREATE YOUR ACCOUNT
            </Link>
            <Link href="/auth" className="w-full md:w-auto px-12 py-5 bg-white/5 border border-white/10 text-white font-bold rounded-full hover:bg-white/10 transition-all">
              SIGN IN
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="max-w-7xl mx-auto py-20 px-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Privacy Guaranteed", icon: ShieldCheck, desc: "Your CV and API keys never touch our servers. BYOK model." },
          { title: "Google XYZ Formula", icon: Rocket, desc: "Every bullet point is structured for maximum impact and recruiter clarity." },
          { title: "Live Transformation", icon: Zap, desc: "See your resume transform in real-time with side-by-side AI preview." }
        ].map((feature, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="p-10 bg-white/5 border border-white/10 rounded-[40px] hover:border-blue-500/50 transition-all"
          >
            <feature.icon className="text-blue-500 mb-6" size={32} />
            <h3 className="text-xl font-black mb-4 uppercase tracking-tight">{feature.title}</h3>
            <p className="text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
}