'use client';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function CallbackHandler() {
  const router  = useRouter();
  const params  = useSearchParams();
  const redirect = params.get('redirect') || '/dashboard';

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const user = session.user;
        const name  = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '';
        const photo = user.user_metadata?.avatar_url || user.user_metadata?.picture || '';
        // Upsert profile
        await supabase.from('user_profiles').upsert({
          email: user.email,
          name,
          photo_url: photo,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'email', ignoreDuplicates: false });
        // Legacy localStorage
        localStorage.setItem('jobr_session', JSON.stringify({ email: user.email, name, photo }));
        localStorage.setItem('jobr_user',    JSON.stringify({ email: user.email, name, photo }));
        router.push(redirect);
      } else {
        router.push('/auth');
      }
    });
  }, []);

  return (
    <div style={{ background: '#1C1C2E', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 44, height: 44, border: '3px solid rgba(124,58,237,0.3)', borderTopColor: '#7C3AED', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <p style={{ color: '#64748B', fontSize: 14 }}>Completing sign in...</p>
      <style jsx global>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function CallbackPage() {
  return <Suspense fallback={<div style={{ background: '#1C1C2E', minHeight: '100vh' }} />}><CallbackHandler /></Suspense>;
}