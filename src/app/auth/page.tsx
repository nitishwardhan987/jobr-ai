'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, Mail, Lock, User, Eye, EyeOff, Sparkles } from 'lucide-react';

function AuthForm() {
  const router      = useRouter();
  const params      = useSearchParams();
  const redirect    = params.get('redirect') || '/dashboard';
  const defaultMode = params.get('mode') === 'signup' ? 'signup' : 'signin';

  const [mode,          setMode]          = useState<'signin'|'signup'|'forgot'>(defaultMode);
  const [email,         setEmail]         = useState('');
  const [password,      setPassword]      = useState('');
  const [name,          setName]          = useState('');
  const [showPw,        setShowPw]        = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error,         setError]         = useState('');
  const [success,       setSuccess]       = useState('');

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await upsertUserProfile(session.user);
        router.push(redirect);
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) router.push(redirect);
    });
    return () => subscription.unsubscribe();
  }, []);

  const upsertUserProfile = async (user: any) => {
    const name  = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '';
    const photo = user.user_metadata?.avatar_url || user.user_metadata?.picture || '';

    // Check if profile already exists so we never overwrite existing credits
    const { data: existing } = await supabase
      .from('user_profiles')
      .select('email')
      .eq('email', user.email)
      .single();

    if (existing) {
      // Returning user — only update mutable fields, leave credits alone
      await supabase.from('user_profiles').update(
        { name, photo_url: photo, updated_at: new Date().toISOString() }
      ).eq('email', user.email);
    } else {
      // New user — grant 5 welcome credits
      await supabase.from('user_profiles').insert({
        email: user.email,
        name,
        photo_url: photo,
        wallet_credits: 5,
        free_cv_used: 0,
        updated_at: new Date().toISOString(),
      });
      await supabase.from('credit_transactions').insert({
        user_email: user.email,
        type: 'top_up',
        credits: 5,
        note: 'Welcome gift — 5 free credits',
        created_by: 'system',
      });
    }

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

  const handleForgotPassword = async () => {
    if (!email) { setError('Enter your email address first.'); return; }
    setError(''); setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset`,
      });
      if (error) throw error;
      setSuccess('Check your inbox — we sent a password reset link.');
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Try again.');
    } finally { setLoading(false); }
  };

  const handleEmailAuth = async () => {
    setError(''); setLoading(true);
    try {
      if (mode === 'signup') {
        if (!name.trim()) { setError('Please enter your name.'); setLoading(false); return; }
        const { data, error } = await supabase.auth.signUp({
          email, password, options: { data: { full_name: name } },
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
        if (data.user) { await upsertUserProfile(data.user); router.push(redirect); }
      }
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ background: '#F8F5F0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, paddingTop: 80 }}>

      {/* Subtle background wash */}
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(249,115,22,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
            <div style={{ width: 40, height: 40, background: '#18181B', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: '#F97316', fontFamily: 'var(--font-display)' }}>J</div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: '#18181B', letterSpacing: '-0.03em' }}>Jobr</span>
          </a>
          <p style={{ fontSize: 14, color: '#71717A', marginTop: 12, fontFamily: 'var(--font-body)' }}>
            {mode === 'signin' ? 'Welcome back. Sign in to continue.' : 'Create your free account.'}
          </p>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #E7E5E4', borderRadius: 24, padding: 28, boxShadow: '0 8px 32px rgba(24,24,27,0.08)' }}>

          {/* Mode toggle — hidden in forgot mode */}
          {mode !== 'forgot' && (
            <div style={{ display: 'flex', background: '#F5F1EA', borderRadius: 12, padding: 4, marginBottom: 24 }}>
              {(['signin','signup'] as const).map(m => (
                <button key={m} onClick={() => { setMode(m); setError(''); setSuccess(''); }} style={{
                  flex: 1, padding: '9px',
                  background: mode === m ? '#FFFFFF' : 'transparent',
                  border: `1px solid ${mode === m ? '#E7E5E4' : 'transparent'}`,
                  borderRadius: 9, cursor: 'pointer',
                  fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: mode === m ? 700 : 500,
                  color: mode === m ? '#18181B' : '#71717A',
                  boxShadow: mode === m ? '0 1px 4px rgba(24,24,27,0.06)' : 'none',
                  transition: 'all 0.15s',
                }}>
                  {m === 'signin' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>
          )}

          {/* ── FORGOT PASSWORD MODE ── */}
          {mode === 'forgot' ? (
            <>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#18181B', fontFamily: 'var(--font-display)', marginBottom: 6 }}>Reset your password</div>
                <div style={{ fontSize: 13, color: '#71717A' }}>Enter your email and we'll send a reset link.</div>
              </div>
              <div style={{ position: 'relative', marginBottom: 4 }}>
                <Mail size={14} color="#A1A1AA" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input className="input" type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleForgotPassword()} style={{ paddingLeft: 36, fontSize: 14 }} />
              </div>
              {error   && <div style={{ marginTop: 10, padding: '10px 14px', background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: 10, fontSize: 13, color: '#DC2626' }}>{error}</div>}
              {success && <div style={{ marginTop: 10, padding: '10px 14px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, fontSize: 13, color: '#16A34A' }}>{success}</div>}
              <button onClick={handleForgotPassword} disabled={loading || !email} style={{
                marginTop: 16, width: '100%',
                background: loading || !email ? '#E7E5E4' : '#F97316',
                color: loading || !email ? '#A1A1AA' : '#fff',
                border: 'none', borderRadius: 12, padding: '13px',
                fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-display)',
                cursor: loading || !email ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.2s',
                boxShadow: loading || !email ? 'none' : '0 4px 16px rgba(249,115,22,0.28)',
              }}>
                {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Sending...</> : 'Send Reset Link'}
              </button>
              <button onClick={() => { setMode('signin'); setError(''); setSuccess(''); }} style={{ marginTop: 12, width: '100%', background: 'none', border: 'none', color: '#71717A', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                ← Back to sign in
              </button>
            </>
          ) : (
            <>
              {/* Google OAuth */}
              <button onClick={handleGoogleSignIn} disabled={googleLoading} style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                padding: '13px', background: '#FFFFFF', border: '1px solid #E7E5E4', borderRadius: 12,
                color: '#18181B', fontSize: 14, fontWeight: 700, cursor: googleLoading ? 'not-allowed' : 'pointer',
                opacity: googleLoading ? 0.7 : 1, fontFamily: 'var(--font-display)', marginBottom: 20,
                transition: 'all 0.2s', boxShadow: '0 1px 4px rgba(24,24,27,0.06)',
              }}
                onMouseEnter={e => { if (!googleLoading) { (e.currentTarget as HTMLElement).style.borderColor = '#D6D3D1'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(24,24,27,0.09)'; } }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E7E5E4'; (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(24,24,27,0.06)'; }}>
                {googleLoading ? <Loader2 size={18} color="#52525B" style={{ animation: 'spin 1s linear infinite' }} /> : (
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
                <div style={{ flex: 1, height: 1, background: '#E7E5E4' }} />
                <span style={{ fontSize: 12, color: '#A1A1AA', fontFamily: 'var(--font-body)' }}>or use email</span>
                <div style={{ flex: 1, height: 1, background: '#E7E5E4' }} />
              </div>

              {/* Email form */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {mode === 'signup' && (
                  <div style={{ position: 'relative' }}>
                    <User size={14} color="#A1A1AA" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                    <input className="input" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} style={{ paddingLeft: 36, fontSize: 14 }} />
                  </div>
                )}
                <div style={{ position: 'relative' }}>
                  <Mail size={14} color="#A1A1AA" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                  <input className="input" type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleEmailAuth()} style={{ paddingLeft: 36, fontSize: 14 }} />
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={14} color="#A1A1AA" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                  <input className="input" type={showPw ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleEmailAuth()} style={{ paddingLeft: 36, paddingRight: 40, fontSize: 14 }} />
                  <button onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#A1A1AA', cursor: 'pointer', padding: 0 }}>
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {mode === 'signin' && (
                  <div style={{ textAlign: 'right' }}>
                    <button onClick={() => { setMode('forgot'); setError(''); setSuccess(''); }} style={{ background: 'none', border: 'none', color: '#F97316', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)', padding: 0 }}>
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>

              {error   && <div style={{ marginTop: 12, padding: '10px 14px', background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: 10, fontSize: 13, color: '#DC2626' }}>{error}</div>}
              {success && <div style={{ marginTop: 12, padding: '10px 14px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, fontSize: 13, color: '#16A34A' }}>{success}</div>}

              <button onClick={handleEmailAuth} disabled={loading || !email || !password} style={{
                marginTop: 16, width: '100%',
                background: loading || !email || !password ? '#E7E5E4' : '#F97316',
                color: loading || !email || !password ? '#A1A1AA' : '#fff',
                border: 'none', borderRadius: 12, padding: '13px',
                fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-display)',
                cursor: loading || !email || !password ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.2s',
                boxShadow: loading || !email || !password ? 'none' : '0 4px 16px rgba(249,115,22,0.28)',
              }}>
                {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> {mode === 'signup' ? 'Creating account...' : 'Signing in...'}</> : mode === 'signup' ? 'Create Account' : 'Sign In'}
              </button>

              <p style={{ textAlign: 'center', fontSize: 12, color: '#A1A1AA', marginTop: 16, lineHeight: 1.5 }}>
                By continuing you agree to our{' '}
                <a href="/terms" style={{ color: '#F97316' }}>Terms</a> and{' '}
                <a href="/privacy" style={{ color: '#F97316' }}>Privacy Policy</a>.
              </p>
            </>
          )}
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#71717A', marginTop: 20 }}>
          {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setSuccess(''); }} style={{ background: 'none', border: 'none', color: '#F97316', fontWeight: 700, cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-display)' }}>
            {mode === 'signin' ? 'Sign up free' : 'Sign in'}
          </button>
        </p>

        {/* Feature strip */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 24 }}>
          {['🔒 Privacy First', '⚡ AI Powered', '🇮🇳 India Built'].map(f => (
            <span key={f} style={{ fontSize: 11, color: '#A1A1AA', fontFamily: 'var(--font-mono)' }}>{f}</span>
          ))}
        </div>
      </div>

      <style jsx global>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function AuthPage() {
  return <Suspense fallback={<div style={{ background: '#F8F5F0', minHeight: '100vh' }} />}><AuthForm /></Suspense>;
}
