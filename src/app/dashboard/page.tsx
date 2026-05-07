'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Shield, Cpu, Copy, CheckCircle, Send } from 'lucide-react';
import { transformCV } from '@/lib/ai-service';

export default function JobrDashboard() {
  const [apiKey, setApiKey] = useState('');
  const [cvText, setCvText] = useState('');
  const [jdText, setJdText] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem('jobr_session');
    if (!session) router.push('/auth');
  }, [router]);

  const handleProcess = async () => {
    if (!apiKey) return alert("Initialization failed: Missing Gemini Key");
    setLoading(true);
    try {
      const result = await transformCV(apiKey, 'google', cvText, jdText);
      setPreviewData(result);
      
      // Save for the Outreach page
      localStorage.setItem('last_optimized_cv', JSON.stringify(result));
      
    } catch (e: any) {
      alert(e.message);
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(previewData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)] bg-slate-950 text-white overflow-hidden">
      
      {/* LEFT: INPUT BENTO (THE SIDEBAR) */}
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-full md:w-1/3 border-r border-white/5 bg-slate-900/50 p-8 overflow-y-auto space-y-6"
      >
        <div className="p-6 bg-blue-600/5 border border-blue-500/20 rounded-[32px]">
          <h2 className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            <Cpu size={14} /> Optimization Engine
          </h2>
          <input 
            type="password" 
            placeholder="Gemini API Key..." 
            className="w-full p-4 bg-slate-950 border border-white/10 rounded-2xl text-sm focus:border-blue-500 outline-none transition-all placeholder:text-slate-700"
            value={apiKey} onChange={(e) => setApiKey(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <div className="group relative">
            <textarea 
              placeholder="Paste Source CV Content..." 
              className="w-full h-48 p-5 bg-white/[0.02] border border-white/10 rounded-[32px] text-sm focus:border-blue-500 outline-none transition-all resize-none scrollbar-hide placeholder:text-slate-700"
              value={cvText} onChange={(e) => setCvText(e.target.value)}
            />
          </div>
          <div className="group relative">
            <textarea 
              placeholder="Target Job Description..." 
              className="w-full h-48 p-5 bg-white/[0.02] border border-white/10 rounded-[32px] text-sm focus:border-blue-500 outline-none transition-all resize-none scrollbar-hide placeholder:text-slate-700"
              value={jdText} onChange={(e) => setJdText(e.target.value)}
            />
          </div>
        </div>

        <button 
          onClick={handleProcess} 
          disabled={loading}
          className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-full shadow-2xl shadow-blue-600/20 transition-all flex items-center justify-center gap-3 disabled:bg-slate-800"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              OPTIMIZING...
            </div>
          ) : (
            <><Sparkles size={18} /> GENERATE IMPACT CV</>
          )}
        </button>
      </motion.div>

      {/* RIGHT: PREVIEW & NEURAL ENGINE */}
      <div className="w-full md:w-2/3 p-12 bg-[#05070a] flex flex-col items-center overflow-y-auto relative border-l border-white/5">
        <AnimatePresence mode="wait">
          {previewData ? (
            /* STATE: GENERATED CONTENT (The Paper Preview) */
            <motion.div 
              key="result"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-2xl bg-white text-slate-900 shadow-2xl p-16 rounded-sm border-t-[12px] border-blue-600 relative"
            >
              <div className="flex justify-between items-center mb-8 border-b pb-6">
                <div>
                   <h1 className="text-4xl font-black uppercase tracking-tighter">Nitish Wardhan</h1>
                   <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">Bengaluru, India</p>
                </div>
                <Link 
                  href="/dashboard/send" 
                  className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg"
                >
                  Proceed to Outreach <Send size={14} />
                </Link>
              </div>

              <div className="space-y-10">
                <section>
                  <h3 className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] mb-4">Professional Narrative</h3>
                  <p className="text-[15px] leading-relaxed font-medium text-slate-700 italic">"{previewData.summary}"</p>
                </section>

                <section>
                  <h3 className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] mb-6">Quantified Impact (Google XYZ)</h3>
                  {previewData.experience?.map((job: any, i: number) => (
                    <div key={i} className="mb-8">
                      <h4 className="font-black text-xs uppercase mb-1">{job.company} — <span className="text-blue-600">{job.role}</span></h4>
                      <ul className="space-y-2">
                        {job.bullets?.map((b: string, j: number) => (
                          <li key={j} className="text-[13px] flex gap-3 text-slate-600 leading-snug">
                            <span className="text-blue-400 font-black">/</span> {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </section>
              </div>
            </motion.div>
          ) : (
            /* STATE: IDLE / ENGINE STANDBY (The Neural Skeleton) */
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full w-full flex flex-col items-center justify-center p-12 relative overflow-hidden"
            >
              <div className="w-full max-w-xl space-y-10 opacity-20 animate-pulse">
                <div className="h-6 bg-blue-500/30 rounded-full w-1/3" />
                <div className="space-y-4">
                  <div className="h-3 bg-slate-700 rounded-full w-full" />
                  <div className="h-3 bg-slate-700 rounded-full w-4/5" />
                </div>
                <div className="grid grid-cols-2 gap-6 mt-16">
                  <div className="h-32 bg-slate-800/40 rounded-3xl border border-white/5" />
                  <div className="h-32 bg-slate-800/40 rounded-3xl border border-white/5" />
                </div>
              </div>
              
              <div className="absolute bottom-12 flex items-center gap-4 bg-white/5 px-6 py-3 rounded-full border border-white/10">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                <span className="text-[10px] font-mono tracking-[0.5em] text-blue-400 uppercase">
                  Engine Standby
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}