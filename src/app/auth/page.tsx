'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, Mail, Lock, User, Eye, EyeOff, Chrome } from 'lucide-react';

function AuthForm() {
  const router      = useRouter();
  const params      = useSearchParams();
  const redirect    = params.get('redirect') || '/dashboard';
  const defaultMode = params.get('mode') === 'signup' ? 'signup' : 'signin';

  const [mode,     setMode]     = useState<'signin'|'signup'>(defaultMode);
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [name,     setName]     = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');

  // Handle OAuth callback
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await upsertUserProfile(session.user);
        router.push(redirect);
      }
    });
    // Check if already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) router.push(redirect);
    });
    return () => subscription.unsubscribe();
  }, []);

  const upsertUserProfile = async (user: any) => {
    const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '';
    const photo = user.user_metadata?.avatar_url || user.user_metadata?.picture || '';
    // Upsert into user_profiles
    await supabase.from('user_profiles').upsert({
      email: user.email,
      name,
      photo_url: photo,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email', ignoreDuplicates: false });
    // Save to localStorage for legacy compatibility
    localStorage.setItem('jobr_session', JSON.stringify({ email: user.email, name, photo }));
    localStorage.setItem('jobr_user',    JSON.stringify({ email: user.email, name, photo }));
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true); setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    });
    if (error) { setError(error.message); setGoogleLoading(false); }
  };

  const handleEmailAuth = async () => {
    setError(''); setLoading(true);
    try {
      if (mode === 'signup') {
        if (!name.trim()) { setError('Please enter your name.'); setLoading(false); return; }
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: name } },
        });
        if (error) throw error;
        if (data.user) {
          await upsertUserProfile({ ...data.user, user_metadata: { full_name: name } });
          setSuccess('Account created! Check your email to verify, or sign in directly.');
          setMode('signin');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user) {
          await upsertUserProfile(data.user);
          router.push(redirect);
        }
      }
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ background: '#1C1C2E', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>

      {/* Ambient glow */}
      <div style={{ position: 'fixed', top: '20%', left: '30%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(124,58,237,0.10) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #7C3AED, #F97316)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: '#fff' }}>J</div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: '#F1F0FF', letterSpacing: '-0.02em' }}>Jobr<span style={{ color: '#7C3AED' }}>.co.in</span></span>
          </a>
          <p style={{ fontSize: 14, color: '#475569', marginTop: 10 }}>
            {mode === 'signin' ? 'Welcome back! Sign in to continue.' : 'Create your free account.'}
          </p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 28 }}>

          {/* Mode toggle */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 4, marginBottom: 24 }}>
            {(['signin','signup'] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); setSuccess(''); }} style={{ flex: 1, padding: '9px', background: mode === m ? 'rgba(124,58,237,0.2)' : 'transparent', border: `1px solid ${mode === m ? 'rgba(124,58,237,0.4)' : 'transparent'}`, borderRadius: 9, color: mode === m ? '#A78BFA' : '#64748B', fontSize: 13, fontWeight: mode === m ? 700 : 500, cursor: 'pointer', fontFamily: 'var(--font-display)', transition: 'all 0.15s' }}>
                {m === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Google OAuth — PRIMARY */}
          <button onClick={handleGoogleSignIn} disabled={googleLoading} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '13px', background: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, color: '#111', fontSize: 15, fontWeight: 700, cursor: googleLoading ? 'not-allowed' : 'pointer', opacity: googleLoading ? 0.7 : 1, fontFamily: 'var(--font-display)', marginBottom: 20, transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
            onMouseEnter={e => { if (!googleLoading) (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}>
            {googleLoading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : (
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 0 1-7.18-2.52H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
                <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
              </svg>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontSize: 12, color: '#334155' }}>or use email</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* Email form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mode === 'signup' && (
              <div style={{ position: 'relative' }}>
                <User size={15} color="#475569" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input className="input" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} style={{ paddingLeft: 36, fontSize: 14 }} />
              </div>
            )}
            <div style={{ position: 'relative' }}>
              <Mail size={15} color="#475569" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input className="input" type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleEmailAuth()} style={{ paddingLeft: 36, fontSize: 14 }} />
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={15} color="#475569" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input className="input" type={showPw ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleEmailAuth()} style={{ paddingLeft: 36, paddingRight: 40, fontSize: 14 }} />
              <button onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: 0 }}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error   && <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, fontSize: 13, color: '#EF4444' }}>{error}</div>}
          {success && <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, fontSize: 13, color: '#10B981' }}>{success}</div>}

          <button onClick={handleEmailAuth} disabled={loading || !email || !password} style={{ marginTop: 16, width: '100%', background: 'linear-gradient(135deg, #7C3AED, #6D28D9)', color: '#fff', border: 'none', borderRadius: 12, padding: '13px', fontWeight: 700, fontSize: 15, cursor: loading || !email || !password ? 'not-allowed' : 'pointer', opacity: loading || !email || !password ? 0.6 : 1, fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> {mode === 'signup' ? 'Creating account...' : 'Signing in...'}</> : mode === 'signup' ? 'Create Account' : 'Sign In'}
          </button>

          <p style={{ textAlign: 'center', fontSize: 12, color: '#334155', marginTop: 16, lineHeight: 1.5 }}>
            By continuing, you agree to our{' '}
            <a href="/terms" style={{ color: '#7C3AED' }}>Terms</a> and{' '}
            <a href="/privacy" style={{ color: '#7C3AED' }}>Privacy Policy</a>.
          </p>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#475569', marginTop: 20 }}>
          {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setSuccess(''); }} style={{ background: 'none', border: 'none', color: '#7C3AED', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
            {mode === 'signin' ? 'Sign up free' : 'Sign in'}
          </button>
        </p>
      </div>

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default function AuthPage() {
  return <Suspense fallback={<div style={{ background: '#1C1C2E', minHeight: '100vh' }} />}><AuthForm /></Suspense>;
}