'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Camera, Edit3, Save, X, Wallet, Briefcase,
  Mic, Users, Star, TrendingUp, Shield,
  CheckCircle2, Clock, AlertCircle, ExternalLink,
  Plus, Loader2, LogOut, Crown,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Profile = {
  email: string; name: string; photo_url: string;
  phone: string; role: string; wallet_credits: number;
  created_at: string;
};
type Transaction = {
  id: string; type: string; credits: number;
  note: string; ref: string; created_at: string;
};

const TYPE_CONFIG: Record<string, { color: string; sign: string; label: string }> = {
  top_up:     { color: '#10B981', sign: '+', label: 'Credits Added'     },
  deduct:     { color: '#EF4444', sign: '-', label: 'Credits Deducted'  },
  booking:    { color: '#F97316', sign: '-', label: 'Session Booked'    },
  refund:     { color: '#10B981', sign: '+', label: 'Refund'            },
  withdrawal: { color: '#A78BFA', sign: '-', label: 'Withdrawal'        },
};

const ROLE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  admin:   { label: 'ADMIN',   color: '#F59E0B', bg: 'rgba(245,158,11,0.15)'  },
  edtech:  { label: 'EDTECH',  color: '#06B6D4', bg: 'rgba(6,182,212,0.12)'   },
  mentor:  { label: 'MENTOR',  color: '#10B981', bg: 'rgba(16,185,129,0.12)'  },
  student: { label: 'STUDENT', color: '#A78BFA', bg: 'rgba(167,139,250,0.12)' },
};

export default function ProfilePage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [profile,      setProfile]      = useState<Profile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bookings,     setBookings]     = useState<any[]>([]);
  const [jobTracks,    setJobTracks]    = useState<any[]>([]);
  const [mentorData,   setMentorData]   = useState<any>(null);
  const [loading,      setLoading]      = useState(true);
  const [editing,      setEditing]      = useState(false);
  const [uploading,    setUploading]    = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [tab,          setTab]          = useState<'overview'|'wallet'|'activity'|'settings'>('overview');

  const [editForm, setEditForm] = useState({ name: '', phone: '', photo_url: '' });
  const [topUpMsg, setTopUpMsg] = useState('');

  useEffect(() => {
    const s = localStorage.getItem('jobr_session') || localStorage.getItem('jobr_user');
    if (!s) { router.push('/auth'); return; }
    const { email } = JSON.parse(s);
    loadAll(email);
  }, []);

  const loadAll = async (email: string) => {
    setLoading(true);
    try {
      // Load profile
      const { data: p } = await supabase.from('user_profiles').select('*').eq('email', email).single();
      if (!p) {
        // Create profile if doesn't exist
        const s = localStorage.getItem('jobr_session') || localStorage.getItem('jobr_user');
        const parsed = s ? JSON.parse(s) : {};
        const newProfile = { email, name: parsed.name || email.split('@')[0], photo_url: parsed.photo || '', phone: '', role: 'student', wallet_credits: 0 };
        await supabase.from('user_profiles').insert(newProfile);
        setProfile(newProfile as any);
        setEditForm({ name: newProfile.name, phone: '', photo_url: newProfile.photo_url });
      } else {
        setProfile(p);
        setEditForm({ name: p.name || '', phone: p.phone || '', photo_url: p.photo_url || '' });
      }

      // Load transactions
      const { data: tx } = await supabase.from('credit_transactions').select('*').eq('user_email', email).order('created_at', { ascending: false }).limit(20);
      setTransactions(tx || []);

      // Load bookings
      const { data: bk } = await supabase.from('bookings').select('*').eq('student_email', email).order('created_at', { ascending: false }).limit(10);
      setBookings(bk || []);

      // Load job tracks
      const { data: jt } = await supabase.from('job_tracks').select('id,company,role,status,jobr_score,created_at').eq('user_email', email).order('created_at', { ascending: false }).limit(5);
      setJobTracks(jt || []);

      // Check if mentor
      const { data: mentor } = await supabase.from('mentor_profiles').select('*').eq('user_email', email).single();
      setMentorData(mentor);

    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setUploading(true);
    try {
      const ext  = file.name.split('.').pop();
      const path = `${profile.email.replace('@','_').replace('.','_')}_${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
      setEditForm(f => ({ ...f, photo_url: publicUrl }));
    } catch (e: any) { alert('Upload failed: ' + e.message); }
    finally { setUploading(false); }
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await supabase.from('user_profiles').update({
        name: editForm.name,
        phone: editForm.phone,
        photo_url: editForm.photo_url,
        updated_at: new Date().toISOString(),
      }).eq('email', profile.email);
      setProfile(p => p ? { ...p, ...editForm } : p);
      // Update localStorage
      const s = localStorage.getItem('jobr_session') || localStorage.getItem('jobr_user');
      if (s) {
        const parsed = JSON.parse(s);
        const updated = { ...parsed, name: editForm.name, photo: editForm.photo_url };
        localStorage.setItem('jobr_session', JSON.stringify(updated));
        localStorage.setItem('jobr_user',    JSON.stringify(updated));
      }
      setEditing(false);
    } catch (e: any) { alert('Save failed: ' + e.message); }
    finally { setSaving(false); }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('jobr_session');
    localStorage.removeItem('jobr_user');
    router.push('/');
  };

  const handleTopUpRequest = () => {
    const msg = encodeURIComponent(`Hi! I'd like to top up my Jobr credits.\n\nEmail: ${profile?.email}\nRequested credits: ?\n\nPlease share UPI details.`);
    window.open(`https://wa.me/919436781545?text=${msg}`, '_blank');
  };

  if (loading) return (
    <div style={{ background: '#1C1C2E', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <div style={{ width: 36, height: 36, border: '3px solid rgba(124,58,237,0.3)', borderTopColor: '#7C3AED', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <span style={{ color: '#475569', fontSize: 14 }}>Loading your profile...</span>
      <style jsx global>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!profile) return null;

  const roleCfg = ROLE_CONFIG[profile.role] || ROLE_CONFIG.student;
  const tracksByStatus = {
    applied:     jobTracks.filter(t => t.status === 'applied').length,
    interviewing: jobTracks.filter(t => ['interview_1','interview_2'].includes(t.status)).length,
    offer:       jobTracks.filter(t => t.status === 'offer').length,
    rejected:    jobTracks.filter(t => t.status === 'rejected').length,
  };

  return (
    <div style={{ background: '#1C1C2E', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(145deg, rgba(124,58,237,0.12) 0%, transparent 60%)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: 'clamp(24px,4vw,40px) 20px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>

            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #F97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 900, color: '#fff', overflow: 'hidden', border: '3px solid rgba(124,58,237,0.3)' }}>
                {editing && editForm.photo_url ? (
                  <img src={editForm.photo_url} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : profile.photo_url ? (
                  <img src={profile.photo_url} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (profile.name?.[0] || profile.email[0]).toUpperCase()}
              </div>
              {editing && (
                <>
                  <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: '50%', background: '#7C3AED', border: '2px solid #1C1C2E', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    {uploading ? <Loader2 size={13} color="#fff" style={{ animation: 'spin 1s linear infinite' }} /> : <Camera size={13} color="#fff" />}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                </>
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px,4vw,28px)', fontWeight: 900, color: '#F1F0FF', margin: 0 }}>{profile.name || 'Your Name'}</h1>
                <span style={{ fontSize: 10, fontWeight: 700, color: roleCfg.color, background: roleCfg.bg, padding: '3px 10px', borderRadius: 100, fontFamily: 'monospace', border: `1px solid ${roleCfg.color}30` }}>
                  {profile.role === 'admin' && <Crown size={10} style={{ marginRight: 4, display: 'inline' }} />}
                  {roleCfg.label}
                </span>
              </div>
              <div style={{ fontSize: 14, color: '#64748B', marginBottom: 6 }}>{profile.email}</div>
              <div style={{ fontSize: 12, color: '#334155' }}>Member since {new Date(profile.created_at || Date.now()).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</div>

              {mentorData && (
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Star size={12} color="#F59E0B" fill="#F59E0B" />
                  <span style={{ fontSize: 12, color: '#F59E0B', fontWeight: 600 }}>{mentorData.rating || 'New'} · {mentorData.total_sessions || 0} sessions as mentor</span>
                  <a href="/mentor/dashboard" style={{ fontSize: 12, color: '#10B981', textDecoration: 'none', marginLeft: 8 }}>Mentor Dashboard →</a>
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {!editing ? (
                <button onClick={() => setEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8', padding: '8px 16px', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  <Edit3 size={13} /> Edit Profile
                </button>
              ) : (
                <>
                  <button onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#7C3AED', border: 'none', color: '#fff', padding: '8px 18px', borderRadius: 100, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
                    {saving ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={13} />} Save
                  </button>
                  <button onClick={() => { setEditing(false); setEditForm({ name: profile.name || '', phone: profile.phone || '', photo_url: profile.photo_url || '' }); }} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#64748B', padding: '8px 14px', borderRadius: 100, fontSize: 13, cursor: 'pointer' }}>
                    <X size={13} /> Cancel
                  </button>
                </>
              )}
              <button onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#EF4444', padding: '8px 14px', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                <LogOut size={13} /> Sign Out
              </button>
            </div>
          </div>

          {/* Edit form inline */}
          {editing && (
            <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, padding: 20, background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 14 }}>
              <div>
                <label style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace', display: 'block', marginBottom: 5 }}>FULL NAME</label>
                <input className="input" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} style={{ fontSize: 13 }} />
              </div>
              <div>
                <label style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace', display: 'block', marginBottom: 5 }}>PHONE</label>
                <input className="input" placeholder="+91 9876543210" value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} style={{ fontSize: 13 }} />
              </div>
              <div>
                <label style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace', display: 'block', marginBottom: 5 }}>PHOTO URL (or upload above)</label>
                <input className="input" placeholder="https://..." value={editForm.photo_url} onChange={e => setEditForm(f => ({ ...f, photo_url: e.target.value }))} style={{ fontSize: 13 }} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 20px' }}>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 28 }}>
          {[
            { label: 'CREDITS', value: profile.wallet_credits, color: '#10B981', sub: `= ₹${profile.wallet_credits * 100}`, icon: Wallet, action: () => setTab('wallet') },
            { label: 'JOB TRACKS', value: jobTracks.length, color: '#06B6D4', sub: `${tracksByStatus.offer} offers`, icon: Briefcase, action: () => router.push('/dashboard') },
            { label: 'BOOKINGS', value: bookings.length, color: '#4F46E5', sub: 'mentor sessions', icon: Users, action: () => setTab('activity') },
            { label: 'TRANSACTIONS', value: transactions.length, color: '#A78BFA', sub: 'credit history', icon: TrendingUp, action: () => setTab('wallet') },
          ].map(s => (
            <button key={s.label} onClick={s.action} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '16px 18px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${s.color}30`; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace' }}>{s.label}</div>
                <s.icon size={14} color={s.color} />
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: s.color, fontFamily: 'var(--font-display)', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#334155', marginTop: 4 }}>{s.sub}</div>
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 24 }}>
          {[
            { id: 'overview',  label: 'Overview'     },
            { id: 'wallet',    label: 'Wallet'       },
            { id: 'activity',  label: 'Activity'     },
            { id: 'settings',  label: 'Settings'     },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id as any)} style={{ padding: '11px 18px', background: 'transparent', border: 'none', cursor: 'pointer', borderBottom: tab === t.id ? '2px solid #7C3AED' : '2px solid transparent', color: tab === t.id ? '#A78BFA' : '#475569', fontSize: 13, fontWeight: tab === t.id ? 700 : 500, fontFamily: 'var(--font-display)', whiteSpace: 'nowrap', marginBottom: '-1px', transition: 'all 0.15s' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,420px),1fr))', gap: 16 }}>

            {/* Credits summary */}
            <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 16, padding: 22 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#10B981', fontFamily: 'monospace', marginBottom: 14 }}>CREDITS WALLET</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 40, fontWeight: 900, color: '#10B981', fontFamily: 'var(--font-display)', lineHeight: 1 }}>{profile.wallet_credits}</div>
                  <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>credits = ₹{profile.wallet_credits * 100}</div>
                </div>
                <button onClick={handleTopUpRequest} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 100, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
                  <Plus size={13} /> Top Up
                </button>
              </div>
              <div style={{ fontSize: 12, color: '#334155', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                💬 Top-up via UPI → WhatsApp → Credits added within 15 mins
              </div>
            </div>

            {/* Job tracks */}
            <div style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.15)', borderRadius: 16, padding: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#06B6D4', fontFamily: 'monospace' }}>JOB TRACKS</div>
                <a href="/dashboard" style={{ fontSize: 12, color: '#06B6D4', textDecoration: 'none', fontWeight: 600 }}>View all →</a>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { label: 'Applied',      value: tracksByStatus.applied,      color: '#06B6D4' },
                  { label: 'Interviewing', value: tracksByStatus.interviewing,  color: '#F97316' },
                  { label: 'Offers',       value: tracksByStatus.offer,         color: '#10B981' },
                  { label: 'Rejected',     value: tracksByStatus.rejected,      color: '#EF4444' },
                ].map(s => (
                  <div key={s.label} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10 }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: s.color, fontFamily: 'var(--font-display)', lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: '#475569', marginTop: 3 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              {jobTracks.length === 0 && (
                <div style={{ textAlign: 'center', padding: 20 }}>
                  <div style={{ fontSize: 13, color: '#334155' }}>No job tracks yet</div>
                  <a href="/dashboard" style={{ fontSize: 13, color: '#06B6D4', textDecoration: 'none', fontWeight: 700 }}>Start tracking →</a>
                </div>
              )}
            </div>

            {/* Recent bookings */}
            {bookings.length > 0 && (
              <div style={{ background: 'rgba(79,70,229,0.05)', border: '1px solid rgba(79,70,229,0.15)', borderRadius: 16, padding: 22, gridColumn: '1/-1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#4F46E5', fontFamily: 'monospace' }}>RECENT BOOKINGS</div>
                  <button onClick={() => setTab('activity')} style={{ fontSize: 12, color: '#4F46E5', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View all →</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {bookings.slice(0, 3).map(b => (
                    <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#F1F0FF', fontFamily: 'var(--font-display)' }}>{b.session_type}</div>
                        <div style={{ fontSize: 11, color: '#475569' }}>{b.slot_date} · ₹{b.session_price_credits * 100}</div>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: b.status === 'completed' ? '#10B981' : b.status === 'confirmed' ? '#F97316' : '#64748B', background: b.status === 'completed' ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)', padding: '3px 9px', borderRadius: 100, fontFamily: 'monospace' }}>
                        {b.status?.toUpperCase().replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* WALLET */}
        {tab === 'wallet' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Balance card */}
            <div style={{ background: 'linear-gradient(145deg, rgba(16,185,129,0.10), rgba(6,182,212,0.06))', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 20, padding: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#10B981', fontFamily: 'monospace', marginBottom: 8 }}>AVAILABLE BALANCE</div>
                <div style={{ fontSize: 48, fontWeight: 900, color: '#10B981', fontFamily: 'var(--font-display)', lineHeight: 1 }}>{profile.wallet_credits}</div>
                <div style={{ fontSize: 14, color: '#64748B', marginTop: 6 }}>credits · equivalent to ₹{profile.wallet_credits * 100}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button onClick={handleTopUpRequest} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 100, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-display)', boxShadow: '0 4px 14px rgba(16,185,129,0.4)' }}>
                  <Plus size={16} /> Request Top-Up via WhatsApp
                </button>
                <div style={{ fontSize: 11, color: '#475569', textAlign: 'center' }}>Pay UPI → share ref → credits added in 15 mins</div>
              </div>
            </div>

            {/* How credits work */}
            <div style={{ padding: '14px 18px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', fontFamily: 'monospace', marginBottom: 10 }}>HOW CREDITS WORK</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
                {[
                  { icon: '₹', text: '1 credit = ₹100', color: '#10B981' },
                  { icon: '🔒', text: 'Frozen at booking, released after session', color: '#F97316' },
                  { icon: '🛡️', text: 'Jobr Escrow protects every transaction', color: '#4F46E5' },
                  { icon: '↩️', text: 'Disputed sessions refunded within 48hrs', color: '#EF4444' },
                ].map(i => (
                  <div key={i.text} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '8px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: 8 }}>
                    <span style={{ fontSize: 14, flexShrink: 0 }}>{i.icon}</span>
                    <span style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.5 }}>{i.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Transaction history */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 22 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#A78BFA', fontFamily: 'monospace', marginBottom: 16 }}>TRANSACTION HISTORY</div>
              {transactions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: '#334155' }}>No transactions yet</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {transactions.map(tx => {
                    const cfg = TYPE_CONFIG[tx.type] || { color: '#64748B', sign: '·', label: tx.type };
                    return (
                      <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${cfg.color}15`, border: `1px solid ${cfg.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, color: cfg.color, flexShrink: 0, fontFamily: 'var(--font-display)' }}>
                          {cfg.sign}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#F1F0FF', fontFamily: 'var(--font-display)' }}>{cfg.label}</div>
                          <div style={{ fontSize: 11, color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.note || tx.ref || '—'}</div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: 15, fontWeight: 900, color: cfg.color, fontFamily: 'var(--font-display)' }}>
                            {cfg.sign}{tx.credits} cr
                          </div>
                          <div style={{ fontSize: 10, color: '#334155', fontFamily: 'monospace' }}>
                            {new Date(tx.created_at).toLocaleDateString('en-IN')}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ACTIVITY */}
        {tab === 'activity' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Job tracks */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#06B6D4', fontFamily: 'monospace' }}>JOB APPLICATIONS</div>
                <a href="/dashboard" style={{ fontSize: 12, color: '#06B6D4', textDecoration: 'none', fontWeight: 600 }}>Open Tracker →</a>
              </div>
              {jobTracks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 32 }}>
                  <Briefcase size={32} color="#334155" style={{ marginBottom: 10 }} />
                  <div style={{ fontSize: 13, color: '#475569' }}>No job tracks yet</div>
                  <a href="/dashboard" style={{ fontSize: 13, color: '#06B6D4', fontWeight: 700, textDecoration: 'none' }}>Start tracking applications →</a>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {jobTracks.map(t => (
                    <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#F1F0FF', fontFamily: 'var(--font-display)' }}>{t.company}</div>
                        <div style={{ fontSize: 11, color: '#475569' }}>{t.role}</div>
                      </div>
                      {t.jobr_score > 0 && <span style={{ fontSize: 11, color: t.jobr_score >= 80 ? '#10B981' : '#F97316', fontFamily: 'monospace', fontWeight: 700 }}>{t.jobr_score}</span>}
                      <span style={{ fontSize: 10, fontWeight: 700, color: t.status === 'offer' ? '#10B981' : t.status === 'rejected' ? '#EF4444' : '#F97316', background: 'rgba(255,255,255,0.04)', padding: '2px 8px', borderRadius: 100, fontFamily: 'monospace' }}>
                        {t.status?.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bookings */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 22 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#4F46E5', fontFamily: 'monospace', marginBottom: 16 }}>MENTOR BOOKINGS</div>
              {bookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 32 }}>
                  <Users size={32} color="#334155" style={{ marginBottom: 10 }} />
                  <div style={{ fontSize: 13, color: '#475569' }}>No bookings yet</div>
                  <a href="/mentor" style={{ fontSize: 13, color: '#4F46E5', fontWeight: 700, textDecoration: 'none' }}>Browse Mentors →</a>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {bookings.map(b => (
                    <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 150 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#F1F0FF', fontFamily: 'var(--font-display)' }}>{b.session_type}</div>
                        <div style={{ fontSize: 11, color: '#475569' }}>with {b.mentor_email} · {b.slot_date}</div>
                      </div>
                      <div style={{ fontSize: 13, color: '#4F46E5', fontWeight: 700 }}>₹{(b.session_price_credits || 0) * 100}</div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: b.status === 'completed' ? '#10B981' : b.status === 'confirmed' ? '#F97316' : '#64748B', background: 'rgba(255,255,255,0.04)', padding: '3px 9px', borderRadius: 100, fontFamily: 'monospace' }}>
                        {b.status?.toUpperCase().replace('_', ' ')}
                      </span>
                      {b.status === 'completed' && b.meet_link && (
                        <a href={b.meet_link} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#4F46E5', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <ExternalLink size={11} /> Join
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {tab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 560 }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 22 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#A78BFA', fontFamily: 'monospace', marginBottom: 16 }}>ACCOUNT DETAILS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace', display: 'block', marginBottom: 5 }}>FULL NAME</label>
                  <input className="input" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} style={{ fontSize: 14 }} />
                </div>
                <div>
                  <label style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace', display: 'block', marginBottom: 5 }}>EMAIL</label>
                  <input className="input" value={profile.email} disabled style={{ fontSize: 14, opacity: 0.5, cursor: 'not-allowed' }} />
                </div>
                <div>
                  <label style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace', display: 'block', marginBottom: 5 }}>PHONE</label>
                  <input className="input" placeholder="+91 9876543210" value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} style={{ fontSize: 14 }} />
                </div>
                <div>
                  <label style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace', display: 'block', marginBottom: 5 }}>PROFILE PHOTO</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input className="input" placeholder="Paste URL or upload below" value={editForm.photo_url} onChange={e => setEditForm(f => ({ ...f, photo_url: e.target.value }))} style={{ fontSize: 13 }} />
                    <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', color: '#A78BFA', padding: '0 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      {uploading ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Camera size={13} />}
                      {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                  </div>
                </div>
                <button onClick={handleSave} disabled={saving} style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)', color: '#fff', border: 'none', borderRadius: 100, padding: '12px', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'var(--font-display)', marginTop: 4 }}>
                  {saving ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</> : <><Save size={15} /> Save Changes</>}
                </button>
              </div>
            </div>

            {/* Mentor section */}
            {!mentorData && (
              <div style={{ padding: '16px 20px', background: 'rgba(13,148,136,0.06)', border: '1px solid rgba(13,148,136,0.15)', borderRadius: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0D9488', fontFamily: 'var(--font-display)', marginBottom: 6 }}>Become a Mentor</div>
                <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 12px', lineHeight: 1.5 }}>Share your expertise and earn credits. Self-onboard in 4 steps.</p>
                <a href="/mentor/onboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#0D9488', color: '#fff', textDecoration: 'none', padding: '9px 18px', borderRadius: 100, fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-display)' }}>Join as Mentor →</a>
              </div>
            )}

            {/* Danger zone */}
            <div style={{ padding: '16px 20px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#EF4444', fontFamily: 'monospace', marginBottom: 10 }}>DANGER ZONE</div>
              <button onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', padding: '9px 18px', borderRadius: 100, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
                <LogOut size={13} /> Sign Out of All Devices
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}