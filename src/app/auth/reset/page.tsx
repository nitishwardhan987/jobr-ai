'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

function ResetForm() {
  const router = useRouter();
  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [showPw,    setShowPw]    = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [done,      setDone]      = useState(false);
  const [ready,     setReady]     = useState(false);

  useEffect(() => {
    // Supabase exchanges the token from the URL hash automatically via onAuthStateChange
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async () => {
    if (!password || password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setError(''); setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
      setTimeout(() => router.push('/dashboard'), 2500);
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Request a new reset link.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ background: '#F8F5F0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, paddingTop: 80 }}>
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(249,115,22,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
            <div style={{ width: 40, height: 40, background: '#18181B', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: '#F97316', fontFamily: 'var(--font-display)' }}>J</div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: '#18181B', letterSpacing: '-0.03em' }}>Jobr</span>
          </a>
          <p style={{ fontSize: 14, color: '#71717A', marginTop: 12 }}>Set a new password for your account.</p>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #E7E5E4', borderRadius: 24, padding: 28, boxShadow: '0 8px 32px rgba(24,24,27,0.08)' }}>
          {done ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <CheckCircle2 size={44} color="#16A34A" style={{ marginBottom: 14 }} />
              <div style={{ fontSize: 17, fontWeight: 700, color: '#18181B', fontFamily: 'var(--font-display)', marginBottom: 6 }}>Password updated!</div>
              <div style={{ fontSize: 13, color: '#71717A' }}>Redirecting you to your dashboard…</div>
            </div>
          ) : !ready ? (
            <div style={{ textAlign: 'center', padding: '30px 0' }}>
              <Loader2 size={28} color="#F97316" style={{ animation: 'spin 1s linear infinite', marginBottom: 12 }} />
              <div style={{ fontSize: 13, color: '#71717A' }}>Verifying your reset link…</div>
              <div style={{ fontSize: 12, color: '#A1A1AA', marginTop: 8 }}>
                If nothing happens, <a href="/auth" style={{ color: '#F97316' }}>request a new link</a>.
              </div>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#18181B', fontFamily: 'var(--font-display)', marginBottom: 18 }}>Choose a new password</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ position: 'relative' }}>
                  <Lock size={14} color="#A1A1AA" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                  <input className="input" type={showPw ? 'text' : 'password'} placeholder="New password (min 6 chars)" value={password} onChange={e => setPassword(e.target.value)} style={{ paddingLeft: 36, paddingRight: 40, fontSize: 14 }} />
                  <button onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#A1A1AA', cursor: 'pointer', padding: 0 }}>
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={14} color="#A1A1AA" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                  <input className="input" type={showPw ? 'text' : 'password'} placeholder="Confirm new password" value={confirm} onChange={e => setConfirm(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleReset()} style={{ paddingLeft: 36, fontSize: 14 }} />
                </div>
              </div>
              {error && <div style={{ marginTop: 12, padding: '10px 14px', background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: 10, fontSize: 13, color: '#DC2626' }}>{error}</div>}
              <button onClick={handleReset} disabled={loading || !password || !confirm} style={{
                marginTop: 16, width: '100%',
                background: loading || !password || !confirm ? '#E7E5E4' : '#F97316',
                color: loading || !password || !confirm ? '#A1A1AA' : '#fff',
                border: 'none', borderRadius: 12, padding: '13px',
                fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-display)',
                cursor: loading || !password || !confirm ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.2s',
                boxShadow: loading || !password || !confirm ? 'none' : '0 4px 16px rgba(249,115,22,0.28)',
              }}>
                {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Updating...</> : 'Update Password'}
              </button>
            </>
          )}
        </div>
      </div>
      <style jsx global>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function ResetPage() {
  return <Suspense fallback={<div style={{ background: '#F8F5F0', minHeight: '100vh' }} />}><ResetForm /></Suspense>;
}
