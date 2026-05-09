'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Send, ArrowLeft, CheckCircle, FileDown, Copy } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function SendEmailPage() {
  const router = useRouter();
  const [optimizedData, setOptimizedData] = useState<any>(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [includeCoverLetter, setIncludeCoverLetter] = useState(false);
  const [copied, setCopied] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userLocation, setUserLocation] = useState('India');

  useEffect(() => {
    const lastResult = localStorage.getItem('last_optimized_cv');
    if (!lastResult) { router.push('/dashboard'); return; }
    const data = JSON.parse(lastResult);
    setOptimizedData(data);
    const session = localStorage.getItem('jobr_session');
    const user    = localStorage.getItem('jobr_user');
    try {
      const parsed = JSON.parse(session || user || '{}');
      setUserName(data?.header?.name || parsed.name || parsed.email?.split('@')[0] || 'Applicant');
      setUserEmail(data?.header?.email || parsed.email || '');
      if (data?.header?.location) setUserLocation(data.header.location);
    } catch {}
  }, [router]);

  const generatePDF = (type: 'CV' | 'CL') => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text(userName.toUpperCase(), 20, 25);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text(`${userLocation} | ${userEmail}`, 20, 32);
    doc.setDrawColor(200);
    doc.line(20, 36, 190, 36);

    if (type === 'CV') {
      doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 100, 180);
      doc.text('IMPACT SUMMARY', 20, 48);
      doc.setFont('helvetica', 'normal'); doc.setTextColor(60);
      doc.text(doc.splitTextToSize(optimizedData.summary || '', 170), 20, 56);
      doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 100, 180);
      doc.text('EXPERIENCE (GOOGLE XYZ)', 20, 95);
      let yPos = 105;
      optimizedData.experience?.forEach((job: any) => {
        doc.setFont('helvetica', 'bold'); doc.setTextColor(0);
        doc.text(`${job.company?.toUpperCase()} - ${job.role}`, 20, yPos); yPos += 6;
        doc.setFont('helvetica', 'normal'); doc.setTextColor(80);
        job.bullets?.forEach((b: string) => {
          if (yPos > 270) { doc.addPage(); yPos = 20; }
          const bLines = doc.splitTextToSize(`• ${b}`, 165);
          doc.text(bLines, 25, yPos); yPos += bLines.length * 5;
        });
        yPos += 5;
      });
      if (optimizedData.skills?.length > 0 && yPos < 260) {
        doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 100, 180);
        doc.text('SKILLS', 20, yPos + 10);
        doc.setFont('helvetica', 'normal'); doc.setTextColor(60);
        doc.text(optimizedData.skills.join(' · '), 20, yPos + 18);
      }
    } else {
      doc.setFont('helvetica', 'bold'); doc.text('COVER LETTER', 20, 48);
      doc.setFont('helvetica', 'normal');
      const cl = `Dear Hiring Manager,\n\nI am excited to apply for this role. My career has been defined by driving measurable impact — most recently at ${optimizedData.experience?.[0]?.company} where ${optimizedData.experience?.[0]?.bullets?.[0]}.\n\n${optimizedData.summary}\n\nI would welcome the opportunity to discuss how my experience aligns with your team's goals.\n\nThank you for your consideration.\n\nBest regards,\n${userName}`;
      doc.text(doc.splitTextToSize(cl, 170), 20, 60);
    }
    doc.save(`${type}_${userName.replace(/\s+/g, '_')}.pdf`);
  };

  const emailBody = `Hi,\n\nPlease find my optimized CV attached. I have quantified my experience using the Google XYZ formula.\n\nSummary: ${optimizedData?.summary || ''}\n\nLooking forward to connecting.\n\nBest regards,\n${userName}`;

  const handleCopy = () => { navigator.clipboard.writeText(emailBody); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const handleLaunch = () => {
    if (!recipientEmail) return alert("Please enter the recruiter's email.");
    setIsProcessing(true);
    generatePDF('CV');
    if (includeCoverLetter) generatePDF('CL');
    navigator.clipboard.writeText(emailBody);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipientEmail)}&su=${encodeURIComponent(`Job Application: ${userName}`)}&body=${encodeURIComponent('Hi,\n\n[Paste email body here]\n[Attach the downloaded PDF]\n\nBest,\n' + userName)}`;
    setTimeout(() => { window.open(gmailUrl, '_blank'); setIsProcessing(false); }, 1200);
  };

  if (!optimizedData) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="w-6 h-6 border-2 border-slate-700 border-t-sky-500 rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 flex flex-col items-center">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-5xl">
        <button onClick={() => router.back()} className="mb-8 flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">
          <ArrowLeft size={14} /> Back to Studio
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h1 className="text-5xl font-black tracking-tighter leading-none">Automated<br /><span className="text-sky-400">Dispatch.</span></h1>

            <div className="p-6 bg-white/[0.03] border border-white/10 rounded-[28px]">
              <label className="block text-[10px] font-black text-sky-400 uppercase tracking-widest mb-3">Recruiter Email</label>
              <input type="email" className="w-full bg-transparent border-b border-white/10 pb-2 outline-none focus:border-sky-500 transition-all font-bold text-xl text-white placeholder-slate-700"
                placeholder="hiring@company.com" value={recipientEmail} onChange={e => setRecipientEmail(e.target.value)} />
            </div>

            <button onClick={() => setIncludeCoverLetter(!includeCoverLetter)}
              className={`w-full p-5 rounded-[28px] border-2 transition-all flex items-center justify-between ${includeCoverLetter ? 'border-sky-500 bg-sky-500/10' : 'border-white/5 opacity-50'}`}>
              <div className="flex items-center gap-3"><FileDown size={18} className="text-sky-400" /><span className="text-xs font-bold uppercase tracking-widest">Include Cover Letter PDF</span></div>
              <div className={`w-5 h-5 rounded-full border-2 transition-all ${includeCoverLetter ? 'bg-sky-500 border-sky-500' : 'border-slate-700'}`} />
            </button>

            <div className="p-5 bg-sky-500/5 border border-sky-500/10 rounded-[28px] flex gap-3">
              <CheckCircle className="text-sky-500 shrink-0 mt-0.5" size={18} />
              <p className="text-xs text-slate-400 leading-relaxed">Clicking launch will <strong className="text-white">download your CV PDF</strong>, copy the email body to your clipboard, and open Gmail pre-filled. Just paste and attach.</p>
            </div>

            <button onClick={handleLaunch} disabled={isProcessing}
              className="w-full py-5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-full shadow-2xl shadow-sky-500/20 transition-all flex items-center justify-center gap-3 disabled:bg-slate-800 disabled:text-slate-600">
              {isProcessing ? 'PREPARING...' : <><Send size={18} /> LAUNCH VIA GMAIL</>}
            </button>
          </div>

          <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col" style={{ height: 520 }}>
            <div className="p-5 bg-slate-50 border-b flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Body Draft</span>
              <button onClick={handleCopy} className="flex items-center gap-1.5 text-[10px] text-slate-400 hover:text-slate-700 font-bold uppercase tracking-wider transition-colors">
                <Copy size={12} /> {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="p-8 overflow-y-auto text-sm leading-relaxed text-slate-600 font-medium whitespace-pre-line flex-1">
              {emailBody}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}