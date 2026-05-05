'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Send, ArrowLeft, MailCheck, Copy, CheckCircle, FileDown } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function SendEmailPage() {
  const router = useRouter();
  const [optimizedData, setOptimizedData] = useState<any>(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [includeCoverLetter, setIncludeCoverLetter] = useState(false);

  useEffect(() => {
    const lastResult = localStorage.getItem('last_optimized_cv');
    if (!lastResult) return router.push('/dashboard');
    setOptimizedData(JSON.parse(lastResult));
  }, [router]);

  // Refined PDF Generator for a Program Manager Persona[cite: 1, 2]
  const generatePDF = (type: 'CV' | 'CL') => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("NITISH WARDHAN", 20, 25);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text("Bengaluru, India | nitish.wardhan987@gmail.com", 20, 32);
    doc.setDrawColor(200);
    doc.line(20, 36, 190, 36);

    if (type === 'CV') {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 51, 153);
      doc.text("IMPACT SUMMARY", 20, 48);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60);
      const lines = doc.splitTextToSize(optimizedData.summary, 170);
      doc.text(lines, 20, 56);
      
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 51, 153);
      doc.text("EXPERIENCE (GOOGLE XYZ)", 20, 95);
      
      let yPos = 105;
      optimizedData.experience.forEach((job: any) => {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0);
        doc.text(`${job.company.toUpperCase()} - ${job.role}`, 20, yPos);
        yPos += 6;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(80);
        job.bullets.forEach((b: string) => {
          const bLines = doc.splitTextToSize(`• ${b}`, 165);
          doc.text(bLines, 25, yPos);
          yPos += (bLines.length * 5);
        });
        yPos += 5;
      });
    } else {
      doc.setFont("helvetica", "bold");
      doc.text("COVER LETTER", 20, 48);
      doc.setFont("helvetica", "normal");
      const cl = `Dear Hiring Manager,\n\nI am applying for the Program Manager role. My career is defined by driving measurable impact—most recently at ${optimizedData.experience[0].company} where I ${optimizedData.experience[0].bullets[0]}.\n\nThank you for your time.\n\nBest,\nNitish Wardhan`;
      doc.text(doc.splitTextToSize(cl, 170), 20, 60);
    }
    doc.save(`${type}_Nitish_Wardhan.pdf`);
  };

  const handleLaunch = () => {
    if (!recipientEmail) return alert("Please enter the recruiter's email.");
    setIsProcessing(true);

    // 1. Generate & Download PDFs
    generatePDF('CV');
    if (includeCoverLetter) generatePDF('CL');

    // 2. Prepare and Copy Email Body
    const fullBody = `Hi Team,\n\nPlease find my optimized CV attached as a PDF. I have quantified my experience using the Google XYZ formula to highlight my impact as a Program Manager.\n\nCore Impact: ${optimizedData.summary}\n\nLooking forward to connecting.\n\nBest regards,\nNitish Wardhan`;
    navigator.clipboard.writeText(fullBody);

    // 3. Open Gmail with Pre-filled Details
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipientEmail}&su=${encodeURIComponent('Job Application: Nitish Wardhan')}&body=${encodeURIComponent('NOTE: Professional body copied to clipboard. Paste (Ctrl+V) here and attach the downloaded PDFs.')}`;
    
    setTimeout(() => {
      window.open(gmailUrl, '_blank');
      setIsProcessing(false);
    }, 1500);
  };

  if (!optimizedData) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 flex flex-col items-center">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-5xl">
        <button onClick={() => router.back()} className="mb-8 flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">
          <ArrowLeft size={14} /> Back to Studio
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h1 className="text-5xl font-black tracking-tighter leading-none">Automated <br/><span className="text-blue-500">Dispatch.</span></h1>
            
            <div className="space-y-4">
              <div className="p-6 bg-white/[0.03] border border-white/10 rounded-[32px]">
                <label className="block text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3">Recruiter Email</label>
                <input 
                  type="email" 
                  className="w-full bg-transparent border-b border-white/10 pb-2 outline-none focus:border-blue-500 transition-all font-bold text-xl"
                  placeholder="hiring@startup.com"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                />
              </div>

              <button 
                onClick={() => setIncludeCoverLetter(!includeCoverLetter)}
                className={`w-full p-6 rounded-[32px] border-2 transition-all flex items-center justify-between ${includeCoverLetter ? 'border-blue-600 bg-blue-600/10' : 'border-white/5 opacity-50'}`}
              >
                <div className="flex items-center gap-4">
                  <FileDown size={20} className="text-blue-400" />
                  <span className="text-xs font-bold uppercase tracking-widest text-left">Generate Cover Letter PDF</span>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 ${includeCoverLetter ? 'bg-blue-500 border-blue-500' : 'border-slate-700'}`} />
              </button>
            </div>

            <div className="p-6 bg-blue-600/5 border border-blue-500/10 rounded-[32px] flex gap-4">
              <CheckCircle className="text-blue-500 shrink-0" size={20} />
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Clicking launch will download your **Optimized CV PDF** and open Gmail in a new tab with the recruiter's address and subject line ready[cite: 2].
              </p>
            </div>

            <button 
              onClick={handleLaunch}
              disabled={isProcessing}
              className="w-full py-6 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-full shadow-2xl transition-all flex items-center justify-center gap-3 disabled:bg-slate-800"
            >
              {isProcessing ? "PREPARING DISPATCH..." : <><Send size={20} /> LAUNCH VIA GMAIL</>}
            </button>
          </div>

          <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col h-[600px] border-[12px] border-white/5">
            <div className="p-6 bg-slate-50 border-b flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Body Draft</span>
              <Copy size={14} className="text-slate-300" />
            </div>
            <div className="p-10 overflow-y-auto text-sm leading-relaxed text-slate-600 font-medium">
               Hi Team,<br/><br/>
               Please find my optimized CV attached as a PDF. I have quantified my experience using the Google XYZ formula...<br/><br/>
               <span className="text-blue-600 font-bold">Summary: {optimizedData.summary}</span><br/><br/>
               Best regards,<br/>
               Nitish Wardhan
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}