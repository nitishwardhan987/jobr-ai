'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Cpu, Send, GraduationCap, Code2, FileText, LayoutPanelTop, Printer } from 'lucide-react';
import { transformCV } from '@/lib/ai-service';

export default function JobrDashboard() {
  const [apiKey, setApiKey] = useState('');
  const [cvText, setCvText] = useState('');
  const [jdText, setJdText] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'engine' | 'document'>('engine');
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem('jobr_session');
    if (!session) router.push('/auth');
  }, [router]);

  const handleProcess = async () => {
    if (!apiKey) return alert("Missing Gemini Key");
    setLoading(true);
    try {
      const result = await transformCV(apiKey, 'google', cvText, jdText);
      setPreviewData(result);
      localStorage.setItem('last_optimized_cv', JSON.stringify(result));
    } catch (e: any) {
      alert(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)] bg-slate-950 text-white overflow-hidden">
      
      {/* LEFT: INPUT BENTO */}
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
            className="w-full p-4 bg-slate-950 border border-white/10 rounded-2xl text-sm focus:border-blue-500 outline-none transition-all"
            value={apiKey} onChange={(e) => setApiKey(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <textarea 
            placeholder="Paste Source CV Content..." 
            className="w-full h-48 p-5 bg-white/[0.02] border border-white/10 rounded-[32px] text-sm focus:border-blue-500 outline-none transition-all resize-none"
            value={cvText} onChange={(e) => setCvText(e.target.value)}
          />
          <textarea 
            placeholder="Target Job Description..." 
            className="w-full h-48 p-5 bg-white/[0.02] border border-white/10 rounded-[32px] text-sm focus:border-blue-500 outline-none transition-all resize-none"
            value={jdText} onChange={(e) => setJdText(e.target.value)}
          />
        </div>

        <button 
          onClick={handleProcess} 
          disabled={loading}
          className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-full shadow-2xl transition-all flex items-center justify-center gap-3 disabled:bg-slate-800"
        >
          {loading ? "PROCESSING..." : <><Sparkles size={18} /> GENERATE IMPACT CV</>}
        </button>
      </motion.div>

      {/* RIGHT: PREVIEW & IMPACT ENGINE */}
      <div className="w-full md:w-2/3 p-8 bg-[#05070a] flex flex-col items-center overflow-y-auto relative border-l border-white/5 scrollbar-hide">
        
        {/* VIEW TOGGLE BUTTONS */}
        {previewData && (
          <div className="flex gap-1 p-1 bg-white/5 border border-white/10 rounded-full mb-8 z-50">
            <button 
              onClick={() => setViewMode('engine')}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-black uppercase transition-all ${viewMode === 'engine' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <LayoutPanelTop size={14} /> Engine View
            </button>
            <button 
              onClick={() => setViewMode('document')}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-black uppercase transition-all ${viewMode === 'document' ? 'bg-white text-slate-950' : 'text-slate-400 hover:text-white'}`}
            >
              <FileText size={14} /> Document View
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {previewData ? (
            viewMode === 'engine' ? (
              /* --- ENGINE VIEW --- */
              <motion.div 
                key="engine" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}
                className="w-full max-w-2xl bg-white text-slate-900 shadow-2xl p-12 rounded-sm border-t-[12px] border-blue-600 relative mb-10"
              >
                <div className="flex justify-between items-start mb-8 border-b pb-6">
                  <h1 className="text-4xl font-black uppercase tracking-tighter">Nitish Wardhan</h1>
                  <Link href="/dashboard/send" className="bg-slate-900 text-white px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2">
                    PROCEED <Send size={12} />
                  </Link>
                </div>
                <div className="space-y-8">
                  <section>
                    <h3 className="text-blue-600 font-black text-[9px] uppercase tracking-widest mb-3">Professional Narrative</h3>
                    <p className="text-[14px] leading-relaxed italic text-slate-600">"{previewData.summary}"</p>
                  </section>
                  <section>
                    <h3 className="text-blue-600 font-black text-[9px] uppercase tracking-widest mb-4">Quantified Experience</h3>
                    {previewData.experience?.map((job: any, i: number) => (
                      <div key={i} className="mb-6">
                        <h4 className="font-bold text-xs uppercase">{job.company} — <span className="text-blue-600">{job.role}</span></h4>
                        <ul className="mt-2 space-y-2">
                          {job.bullets?.map((b: string, j: number) => (
                            <li key={j} className="text-[12px] flex gap-2 text-slate-600">
                              <span className="text-blue-400">/</span> {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </section>
                </div>
              </motion.div>
            ) : (
              /* --- DOCUMENT VIEW (ATS FRIENDLY) --- */
              <motion.div 
                key="document" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}
                className="w-full max-w-[210mm] bg-white text-black shadow-2xl p-[20mm] min-h-[297mm] font-serif"
                id="printable-cv"
              >
                <header className="text-center border-b-2 border-black pb-4 mb-8">
                  <h1 className="text-4xl font-bold uppercase tracking-tight mb-1">Nitish Wardhan</h1>
                  <p className="text-sm font-medium text-slate-600 tracking-wide uppercase italic">Program Manager | Bengaluru, India</p>
                </header>

                <div className="space-y-8">
                  <section>
                    <h3 className="text-xs font-bold uppercase border-b border-black/10 pb-1 mb-3">Professional Summary</h3>
                    <p className="text-[10pt] leading-relaxed text-black/80">{previewData.summary}</p>
                  </section>

                  <section>
                    <h3 className="text-xs font-bold uppercase border-b border-black/10 pb-1 mb-4">Experience</h3>
                    {previewData.experience?.map((job: any, i: number) => (
                      <div key={i} className="mb-6 last:mb-0">
                        <div className="flex justify-between font-bold text-sm">
                          <span>{job.company}</span>
                          <span className="text-slate-500 font-medium">20XX - Present</span>
                        </div>
                        <p className="text-xs font-semibold italic text-slate-700 mb-2">{job.role}</p>
                        <ul className="list-disc ml-5 space-y-1.5 text-[10pt] text-black/80">
                          {job.bullets?.map((b: string, j: number) => (
                            <li key={j} className="pl-1 leading-tight">{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </section>

                  {previewData.skills && (
                    <section>
                      <h3 className="text-xs font-bold uppercase border-b border-black/10 pb-1 mb-3">Skills & Expertise</h3>
                      <p className="text-[10pt] leading-relaxed text-black/80">{previewData.skills.join(' • ')}</p>
                    </section>
                  )}
                </div>
                <div className="mt-12 text-center">
                   <button onClick={() => window.print()} className="no-print opacity-0 hover:opacity-100 flex items-center gap-2 mx-auto text-[10px] text-slate-400 uppercase font-black">
                     <Printer size={12} /> Print to PDF
                   </button>
                </div>
              </motion.div>
            )
          ) : (
            /* --- IDLE STATE --- */
            <motion.div key="empty" className="h-full w-full flex flex-col items-center justify-center p-12">
              <div className="w-full max-w-xl space-y-10 opacity-20 animate-pulse">
                <div className="h-4 bg-blue-500/30 rounded w-1/4" />
                <div className="h-32 bg-slate-800/40 rounded-3xl border border-white/5" />
                <div className="h-32 bg-slate-800/40 rounded-3xl border border-white/5" />
              </div>
              <div className="absolute bottom-12 flex items-center gap-4 bg-white/5 px-6 py-3 rounded-full border border-white/10">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                <span className="text-[10px] font-mono tracking-[0.5em] text-blue-400 uppercase text-center">Engine Standby</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <style jsx>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .min-h-\[calc\(100vh-80px\)\] { height: auto !important; min-height: 0 !important; }
        }
      `}</style>
    </div>
  );
}