'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('jobr_session', 'active');
      window.dispatchEvent(new Event('storage'));
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <div className="bg-slate-950 min-h-[calc(100vh-80px)] flex items-center justify-center p-6 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 blur-[100px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/[0.03] border border-white/10 backdrop-blur-2xl rounded-[48px] p-12 relative z-10"
      >
        <div className="text-center mb-10 font-black tracking-tighter">
          <h1 className="text-4xl text-white">Jobr<span className="text-blue-500">.co.in</span></h1>
          <p className="text-slate-500 text-xs mt-4 uppercase tracking-[0.2em] font-bold">
            {isLogin ? "Authenticate to Continue" : "Initialize New Profile"}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Work Email" 
            className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-blue-500 outline-none transition-all placeholder:text-slate-600"
            required 
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-blue-500 outline-none transition-all placeholder:text-slate-600"
            required 
          />
          <button 
            type="submit"
            className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-600/20"
          >
            {loading ? "INITIALIZING..." : isLogin ? "SIGN IN" : "CREATE ACCOUNT"}
          </button>
        </form>

        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-blue-400 transition-colors"
        >
          {isLogin ? "Switch to Enrollment" : "Return to Login"}
        </button>
      </motion.div>
    </div>
  );
}