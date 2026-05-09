'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Cpu, Send, FileText, LayoutPanelTop, Printer, Key, ExternalLink } from 'lucide-react';

export default function JobrDashboard() {
  const [apiKey, setApiKey] = useState('');
  const [cvText, setCvText] = useState('');
  const [jdText, setJdText] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'engine'|'document'>('engine');
  const [userName, setUserName] = useState('User');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem('jobr_session');
    const user    = localStorage.getItem('jobr_user');
    if (!session && !user) { router.push('/auth'); return; }
    try {
      const parsed = JSON.parse(session || user || '{}');
      setUserName(parsed.name || parsed.email?.split('@')[0] || 'User');
    } catch {}
    const savedKey = localStorage.getItem('jobr_gemini_key');
    const savedCv  = localStorage.getItem('jobr_last_cv');
    const savedJd  = localStorage.getItem('jobr_last_jd');
    if (savedKey) setApiKey(savedKey);
    if (savedCv)  setCvText(savedCv);
    if (savedJd)  setJdText(savedJd);
    const lastResult = localStorage.getItem('last_optimized_cv');
    if (lastResult) { try { setPreviewData(JSON.parse(lastResult)); } catch {} }
  }, [router]);

  const handleProcess = async () => {
    setError('');
    if (!apiKey.trim()) { setError('Please enter your Gemini API key.'); return; }
    if (!cvText.trim()) { setError('Please paste your CV text.'); return; }
    if (!jdText.trim()) { setError('Please paste the job description.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, cvText, jdText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gemini API error. Check your key.');
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error('Empty response from Gemini. Try again.');
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Could not parse AI response. Try again.');
      const result = JSON.parse(jsonMatch[0]);
      setPreviewData(result);
      localStorage.setItem('last_optimized_cv', JSON.stringify(result));
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const displayName = previewData?.header?.name || userName;

  return (
    <div className="flex flex-col md:flex-row bg-slate-950 text-white" style={{ minHeight: 'calc(100vh - 60px)' }}>

      {/* LEFT */}
      <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
        className="w-full md:w-[380px] md:min-w-[380px] border-r border-white/5 bg-slate-900/50 p-6 overflow-y-auto flex flex-col gap-5">

        <div className="p-5 bg-sky-500/5 border border-sky-500/15 rounded-2xl">
          <h2 className="flex items-center gap-2 text-sky-400 text-[10px] font-black uppercase tracking-[0.3em] mb-3">
            <Cpu size={13} /> Optimization Engine
          </h2>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Your Gemini API Key</label>
          <div className="relative">
            <Key size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
            <input type="password" placeholder="AIzaSy..." value={apiKey}
              onChange={e => { setApiKey(e.target.value); localStorage.setItem('jobr_gemini_key', e.target.value); }}
              className="w-full pl-8 pr-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-sm focus:border-sky-500 outline-none transition-all" />
          </div>
          <p className="mt-2 text-[10px] text-slate-600 leading-relaxed">
            Get a free key at{' '}
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-sky-500 hover:underline inline-flex items-center gap-0.5">
              aistudio.google.com <ExternalLink size={9} />
            </a>
            {' '}· Stays on your device only
          </p>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Your CV</label>
          <textarea placeholder="Paste your full CV text here..."
            className="w-full h-44 p-4 bg-white/[0.02] border border-white/10 rounded-2xl text-sm focus:border-sky-500 outline-none transition-all resize-none leading-relaxed placeholder-slate-700"
            value={cvText} onChange={e => { setCvText(e.target.value); localStorage.setItem('jobr_last_cv', e.target.value); }} />
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Job Description</label>
          <textarea placeholder="Paste the target job description here..."
            className="w-full h-44 p-4 bg-white/[0.02] border border-white/10 rounded-2xl text-sm focus:border-sky-500 outline-none transition-all resize-none leading-relaxed placeholder-slate-700"
            value={jdText} onChange={e => { setJdText(e.target.value); localStorage.setItem('jobr_last_jd', e.target.value); }} />
        </div>

        {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[12px] text-red-400 leading-relaxed">{error}</div>}

        <button onClick={handleProcess} disabled={loading}
          className="w-full py-4 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-black rounded-2xl shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-3 text-sm">
          {loading ? (
            <><div className="w-4 h-4 border-2 border-slate-600 border-t-sky-400 rounded-full animate-spin" /> Processing...</>
          ) : (
            <><Sparkles size={16} /> Generate Impact CV</>
          )}
        </button>
      </motion.div>

      {/* RIGHT */}
      <div className="flex-1 p-6 bg-[#05070a] flex flex-col items-center overflow-y-auto">
        {previewData && (
          <div className="flex gap-1 p-1 bg-white/5 border border-white/10 rounded-full mb-6 sticky top-4 z-10">
            <button onClick={() => setViewMode('engine')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${viewMode === 'engine' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}>
              <LayoutPanelTop size={13} /> Engine View
            </button>
            <button onClick={() => setViewMode('document')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${viewMode === 'document' ? 'bg-white text-slate-950' : 'text-slate-400 hover:text-white'}`}>
              <FileText size={13} /> Document View
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {previewData ? (
            viewMode === 'engine' ? (
              <motion.div key="engine" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}
                className="w-full max-w-2xl bg-white text-slate-900 shadow-2xl p-10 rounded-sm border-t-[10px] border-sky-500 mb-10">
                <div className="flex justify-between items-start mb-6 border-b pb-5">
                  <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight">{displayName}</h1>
                    {previewData.header?.email && (
                      <p className="text-[11px] text-slate-400 mt-1">{[previewData.header.email, previewData.header.location].filter(Boolean).join(' · ')}</p>
                    )}
                  </div>
                  <Link href="/dashboard/send" className="bg-slate-900 text-white px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-sky-600 transition-all flex items-center gap-2">
                    SEND <Send size={11} />
                  </Link>
                </div>
                <div className="space-y-7">
                  {previewData.summary && (
                    <section>
                      <h3 className="text-sky-600 font-black text-[9px] uppercase tracking-widest mb-2">Professional Summary</h3>
                      <p className="text-[13px] leading-relaxed text-slate-600 italic">"{previewData.summary}"</p>
                    </section>
                  )}
                  {previewData.experience?.length > 0 && (
                    <section>
                      <h3 className="text-sky-600 font-black text-[9px] uppercase tracking-widest mb-3">Quantified Experience</h3>
                      {previewData.experience.map((job: any, i: number) => (
                        <div key={i} className="mb-5">
                          <h4 className="font-bold text-xs uppercase">{job.company} — <span className="text-sky-600">{job.role}</span>{job.duration && <span className="text-slate-400 font-normal ml-2">· {job.duration}</span>}</h4>
                          <ul className="mt-2 space-y-1.5">
                            {job.bullets?.map((b: string, j: number) => (
                              <li key={j} className="text-[12px] flex gap-2 text-slate-600"><span className="text-sky-400 shrink-0">/</span> {b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </section>
                  )}
                  {previewData.skills?.length > 0 && (
                    <section>
                      <h3 className="text-sky-600 font-black text-[9px] uppercase tracking-widest mb-2">Skills</h3>
                      <p className="text-[12px] text-slate-600">{previewData.skills.join(' · ')}</p>
                    </section>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div key="document" initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}
                className="w-full max-w-[210mm] bg-white text-black shadow-2xl p-[18mm] min-h-[297mm] font-serif mb-10" id="printable-cv">
                <header className="text-center border-b-2 border-black pb-4 mb-6">
                  <h1 className="text-3xl font-bold uppercase tracking-tight mb-1">{displayName}</h1>
                  {previewData.header && (
                    <p className="text-[10px] text-slate-500 tracking-wide">{[previewData.header.location, previewData.header.email, previewData.header.phone].filter(Boolean).join(' · ')}</p>
                  )}
                </header>
                <div className="space-y-6">
                  {previewData.summary && (
                    <section>
                      <h3 className="text-[9px] font-bold uppercase border-b border-black/10 pb-1 mb-2 tracking-widest">Professional Summary</h3>
                      <p className="text-[10pt] leading-relaxed">{previewData.summary}</p>
                    </section>
                  )}
                  {previewData.experience?.length > 0 && (
                    <section>
                      <h3 className="text-[9px] font-bold uppercase border-b border-black/10 pb-1 mb-3 tracking-widest">Experience</h3>
                      {previewData.experience.map((job: any, i: number) => (
                        <div key={i} className="mb-5 last:mb-0">
                          <div className="flex justify-between font-bold text-[11px]"><span>{job.company}</span><span className="text-slate-400 font-medium">{job.duration}</span></div>
                          <p className="text-[10px] italic text-slate-600 mb-1.5">{job.role}</p>
                          <ul className="list-disc ml-4 space-y-1">
                            {job.bullets?.map((b: string, j: number) => <li key={j} className="text-[10pt] leading-snug pl-1">{b}</li>)}
                          </ul>
                        </div>
                      ))}
                    </section>
                  )}
                  {previewData.skills?.length > 0 && (
                    <section>
                      <h3 className="text-[9px] font-bold uppercase border-b border-black/10 pb-1 mb-2 tracking-widest">Skills</h3>
                      <p className="text-[10pt]">{previewData.skills.join(' · ')}</p>
                    </section>
                  )}
                </div>
                <div className="mt-10 text-center no-print">
                  <button onClick={() => window.print()} className="opacity-40 hover:opacity-100 flex items-center gap-2 mx-auto text-[10px] text-slate-400 uppercase font-bold">
                    <Printer size={12} /> Print / Save as PDF
                  </button>
                </div>
              </motion.div>
            )
          ) : (
            <motion.div key="empty" className="h-full w-full flex flex-col items-center justify-center p-12 min-h-[400px]">
              <div className="w-full max-w-xl space-y-6 opacity-20">
                <div className="h-3 bg-sky-500/30 rounded w-1/3" />
                <div className="h-28 bg-slate-800/40 rounded-2xl border border-white/5" />
                <div className="h-28 bg-slate-800/40 rounded-2xl border border-white/5" />
              </div>
              <div className="mt-10 flex items-center gap-3 bg-white/5 px-5 py-3 rounded-full border border-white/10">
                <div className="w-2 h-2 bg-sky-500 rounded-full animate-ping" />
                <span className="text-[10px] font-mono tracking-[0.4em] text-sky-400 uppercase">Engine Standby · Add key, paste CV + JD to begin</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <style jsx>{`@media print { .no-print { display: none !important; } body { background: white !important; } }`}</style>
    </div>
  );
}