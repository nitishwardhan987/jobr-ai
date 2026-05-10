'use client';
import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

export type TrackStatus = 'applied' | 'interview_1' | 'interview_2' | 'offer' | 'rejected';

export interface JobTrack {
  id: string;
  user_email: string;
  company: string;
  role: string;
  jd_text: string;
  cv_text: string;
  status: TrackStatus;
  jobr_score: number;
  interview_date?: string;
  interview_notes?: string;
  round: number;
  ai_feedback?: string;
  improvement_roadmap?: string;
  trials_used: number;
  created_at: string;
  updated_at: string;
}

export interface MockMessage {
  role: 'interviewer' | 'candidate';
  content: string;
  timestamp: string;
}

export interface PrepState {
  activeTab: 'cv' | 'tracks' | 'interview' | 'mentor' | 'learn';
  tracks: JobTrack[];
  activeTrackId: string | null;
  tracksLoading: boolean;
  mockSession: MockMessage[];
  mockLoading: boolean;
  mockActive: boolean;
  trialsUsed: number;
  showProModal: boolean;
  userEmail: string;
  userName: string;
  apiKey: string;
}

type PrepAction =
  | { type: 'SET_TAB'; tab: PrepState['activeTab'] }
  | { type: 'SET_TRACKS'; tracks: JobTrack[] }
  | { type: 'SET_ACTIVE_TRACK'; id: string | null }
  | { type: 'ADD_TRACK'; track: JobTrack }
  | { type: 'UPDATE_TRACK'; track: Partial<JobTrack> & { id: string } }
  | { type: 'DELETE_TRACK'; id: string }
  | { type: 'SET_TRACKS_LOADING'; loading: boolean }
  | { type: 'SET_MOCK_SESSION'; messages: MockMessage[] }
  | { type: 'ADD_MOCK_MESSAGE'; message: MockMessage }
  | { type: 'SET_MOCK_LOADING'; loading: boolean }
  | { type: 'SET_MOCK_ACTIVE'; active: boolean }
  | { type: 'INCREMENT_TRIALS' }
  | { type: 'SET_SHOW_PRO_MODAL'; show: boolean }
  | { type: 'SET_USER'; email: string; name: string }
  | { type: 'SET_API_KEY'; key: string }
  | { type: 'RESET_MOCK' };

export const FREE_MOCK_LIMIT = 3;

const initialState: PrepState = {
  activeTab: 'tracks',
  tracks: [],
  activeTrackId: null,
  tracksLoading: false,
  mockSession: [],
  mockLoading: false,
  mockActive: false,
  trialsUsed: 0,
  showProModal: false,
  userEmail: '',
  userName: '',
  apiKey: '',
};

function reducer(state: PrepState, action: PrepAction): PrepState {
  switch (action.type) {
    case 'SET_TAB':
      return { ...state, activeTab: action.tab };
    case 'SET_TRACKS':
      return { ...state, tracks: action.tracks };
    case 'SET_ACTIVE_TRACK':
      return { ...state, activeTrackId: action.id };
    case 'ADD_TRACK':
      return { ...state, tracks: [action.track, ...state.tracks], activeTrackId: action.track.id };
    case 'UPDATE_TRACK':
      return {
        ...state,
        tracks: state.tracks.map(t =>
          t.id === action.track.id ? { ...t, ...action.track, updated_at: new Date().toISOString() } : t
        ),
      };
    case 'DELETE_TRACK':
      return {
        ...state,
        tracks: state.tracks.filter(t => t.id !== action.id),
        activeTrackId: state.activeTrackId === action.id
          ? (state.tracks.filter(t => t.id !== action.id)[0]?.id || null)
          : state.activeTrackId,
      };
    case 'SET_TRACKS_LOADING':
      return { ...state, tracksLoading: action.loading };
    case 'SET_MOCK_SESSION':
      return { ...state, mockSession: action.messages };
    case 'ADD_MOCK_MESSAGE':
      return { ...state, mockSession: [...state.mockSession, action.message] };
    case 'SET_MOCK_LOADING':
      return { ...state, mockLoading: action.loading };
    case 'SET_MOCK_ACTIVE':
      return { ...state, mockActive: action.active };
    case 'INCREMENT_TRIALS':
      return { ...state, trialsUsed: state.trialsUsed + 1 };
    case 'SET_SHOW_PRO_MODAL':
      return { ...state, showProModal: action.show };
    case 'SET_USER':
      return { ...state, userEmail: action.email, userName: action.name };
    case 'SET_API_KEY':
      return { ...state, apiKey: action.key };
    case 'RESET_MOCK':
      return { ...state, mockSession: [], mockActive: false, mockLoading: false };
    default:
      return state;
  }
}

interface PrepContextValue {
  state: PrepState;
  dispatch: React.Dispatch<PrepAction>;
  loadTracks: () => Promise<void>;
  addTrack: (data: { company: string; role: string; jd_text: string; cv_text: string }) => Promise<void>;
  updateTrackStatus: (id: string, status: TrackStatus, extra?: Partial<JobTrack>) => Promise<void>;
  deleteTrack: (id: string) => Promise<void>;
  startMockInterview: (track: JobTrack) => Promise<void>;
  sendMockAnswer: (answer: string, track: JobTrack) => Promise<void>;
  calculateJobrScore: (track: JobTrack) => Promise<void>;
  generateRoadmap: (track: JobTrack) => Promise<void>;
  activeTrack: JobTrack | null;
  FREE_MOCK_LIMIT: number;
}

const PrepContext = createContext<PrepContextValue | null>(null);

export function PrepProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const activeTrack = state.tracks.find(t => t.id === state.activeTrackId) || null;

  useEffect(() => {
    const session = localStorage.getItem('jobr_session') || localStorage.getItem('jobr_user');
    if (session) {
      try {
        const p = JSON.parse(session);
        dispatch({ type: 'SET_USER', email: p.email || '', name: p.name || p.email?.split('@')[0] || '' });
      } catch {}
    }
    const key = localStorage.getItem('jobr_gemini_key') || '';
    if (key) dispatch({ type: 'SET_API_KEY', key });
    const trials = parseInt(localStorage.getItem('jobr_mock_trials') || '0');
    for (let i = 0; i < trials; i++) dispatch({ type: 'INCREMENT_TRIALS' });
  }, []);

  const loadTracks = async () => {
    dispatch({ type: 'SET_TRACKS_LOADING', loading: true });
    try {
      const session = localStorage.getItem('jobr_session') || localStorage.getItem('jobr_user');
      if (!session) {
        const local = localStorage.getItem('jobr_tracks');
        const tracks = local ? JSON.parse(local) : SEED_TRACKS;
        dispatch({ type: 'SET_TRACKS', tracks });
        if (tracks.length > 0) dispatch({ type: 'SET_ACTIVE_TRACK', id: tracks[0].id });
        return;
      }
      const { email } = JSON.parse(session);
      const { data } = await supabase
        .from('job_tracks')
        .select('*')
        .eq('user_email', email)
        .order('created_at', { ascending: false });
      const tracks = data && data.length > 0 ? data : SEED_TRACKS;
      dispatch({ type: 'SET_TRACKS', tracks });
      if (tracks.length > 0) dispatch({ type: 'SET_ACTIVE_TRACK', id: tracks[0].id });
    } catch {
      dispatch({ type: 'SET_TRACKS', tracks: SEED_TRACKS });
      dispatch({ type: 'SET_ACTIVE_TRACK', id: SEED_TRACKS[0].id });
    } finally {
      dispatch({ type: 'SET_TRACKS_LOADING', loading: false });
    }
  };

  const addTrack = async (data: { company: string; role: string; jd_text: string; cv_text: string }) => {
    const newTrack: JobTrack = {
      id: crypto.randomUUID(),
      user_email: state.userEmail,
      company: data.company,
      role: data.role,
      jd_text: data.jd_text,
      cv_text: data.cv_text,
      status: 'applied',
      jobr_score: 0,
      round: 1,
      trials_used: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_TRACK', track: newTrack });
    if (state.userEmail) {
      await supabase.from('job_tracks').insert(newTrack);
    } else {
      const existing = JSON.parse(localStorage.getItem('jobr_tracks') || '[]');
      localStorage.setItem('jobr_tracks', JSON.stringify([newTrack, ...existing]));
    }
  };

  const updateTrackStatus = async (id: string, status: TrackStatus, extra?: Partial<JobTrack>) => {
    const update = { id, status, ...extra, updated_at: new Date().toISOString() };
    dispatch({ type: 'UPDATE_TRACK', track: update });
    if (state.userEmail) {
      await supabase.from('job_tracks').update(update).eq('id', id);
    } else {
      const existing: JobTrack[] = JSON.parse(localStorage.getItem('jobr_tracks') || '[]');
      localStorage.setItem('jobr_tracks', JSON.stringify(
        existing.map(t => t.id === id ? { ...t, ...update } : t)
      ));
    }
  };

  const deleteTrack = async (id: string) => {
    dispatch({ type: 'DELETE_TRACK', id });
    if (state.userEmail) {
      await supabase.from('job_tracks').delete().eq('id', id);
    } else {
      const existing: JobTrack[] = JSON.parse(localStorage.getItem('jobr_tracks') || '[]');
      localStorage.setItem('jobr_tracks', JSON.stringify(existing.filter(t => t.id !== id)));
    }
  };

  const callGemini = async (prompt: string): Promise<string> => {
    const key = state.apiKey;
    if (!key) throw new Error('No Gemini API key. Please add your key in CV.Prep settings.');
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
        }),
      }
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || 'Gemini error');
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  };

  const calculateJobrScore = async (track: JobTrack) => {
    if (!track.jd_text || !track.cv_text) return;
    try {
      const prompt = `You are a technical recruiter. Analyse this CV against this Job Description and return ONLY a JSON object with no markdown:
{"score": <0-100 integer>, "matched_skills": ["skill1","skill2"], "missing_skills": ["skill3","skill4"], "summary": "<2 sentence assessment>"}

CV: ${track.cv_text.slice(0, 2000)}
JD: ${track.jd_text.slice(0, 1500)}`;
      const raw = await callGemini(prompt);
      const json = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] || '{}');
      await updateTrackStatus(track.id, track.status, {
        jobr_score: json.score || 0,
        ai_feedback: JSON.stringify(json),
      });
    } catch {}
  };

  const generateRoadmap = async (track: JobTrack) => {
    try {
      const prompt = `A candidate was rejected from ${track.role} at ${track.company}.
CV: ${track.cv_text?.slice(0, 1500) || 'Not provided'}
JD: ${track.jd_text?.slice(0, 1000) || 'Not provided'}
Interview notes: ${track.interview_notes || 'Not provided'}

Return ONLY this JSON with no markdown:
{
  "root_cause": "<1-2 sentences>",
  "skill_gaps": ["gap1","gap2","gap3"],
  "action_items": [
    {"action":"...","timeline":"1 week","resource":"..."},
    {"action":"...","timeline":"2 weeks","resource":"..."},
    {"action":"...","timeline":"1 month","resource":"..."}
  ],
  "next_target_roles": ["role1","role2"],
  "encouragement": "<1 motivating sentence>"
}`;
      const raw = await callGemini(prompt);
      const json = raw.match(/\{[\s\S]*\}/)?.[0] || '{}';
      await updateTrackStatus(track.id, track.status, { improvement_roadmap: json });
    } catch {}
  };

  const startMockInterview = async (track: JobTrack) => {
    if (state.trialsUsed >= FREE_MOCK_LIMIT) {
      dispatch({ type: 'SET_SHOW_PRO_MODAL', show: true });
      return;
    }
    dispatch({ type: 'RESET_MOCK' });
    dispatch({ type: 'SET_MOCK_ACTIVE', active: true });
    dispatch({ type: 'SET_MOCK_LOADING', loading: true });
    try {
      const prompt = `You are a professional interviewer at ${track.company} conducting a ${track.role} interview.
Candidate CV summary: ${track.cv_text?.slice(0, 800) || 'Not provided'}
Job Description: ${track.jd_text?.slice(0, 600) || 'Not provided'}
Round: ${track.round === 1 ? 'First round - assess basics, motivation, and fit' : 'Advanced round - deep technical and situational questions'}

Begin with a warm professional greeting and ask your first targeted question. Keep it under 80 words. Ask ONE question only.`;
      const response = await callGemini(prompt);
      dispatch({ type: 'ADD_MOCK_MESSAGE', message: { role: 'interviewer', content: response, timestamp: new Date().toISOString() } });
    } catch (e: any) {
      dispatch({ type: 'ADD_MOCK_MESSAGE', message: { role: 'interviewer', content: `Error: ${e.message}. Please check your Gemini API key.`, timestamp: new Date().toISOString() } });
    } finally {
      dispatch({ type: 'SET_MOCK_LOADING', loading: false });
    }
    dispatch({ type: 'INCREMENT_TRIALS' });
    const newTrials = state.trialsUsed + 1;
    localStorage.setItem('jobr_mock_trials', newTrials.toString());
    await updateTrackStatus(track.id, track.status, { trials_used: track.trials_used + 1 });
  };

  const sendMockAnswer = async (answer: string, track: JobTrack) => {
    dispatch({ type: 'ADD_MOCK_MESSAGE', message: { role: 'candidate', content: answer, timestamp: new Date().toISOString() } });
    dispatch({ type: 'SET_MOCK_LOADING', loading: true });
    try {
      const history = state.mockSession
        .map(m => `${m.role === 'interviewer' ? 'Interviewer' : 'Candidate'}: ${m.content}`)
        .join('\n\n');
      const prompt = `You are interviewing a candidate for ${track.role} at ${track.company}.

Interview so far:
${history}

Candidate just answered: "${answer}"

Instructions:
1. Acknowledge their answer briefly (1 sentence, vary your phrasing)
2. If answer was strong → escalate to a harder follow-up question
3. If answer was weak → probe deeper or ask a clarifying follow-up
4. Keep total response under 100 words
5. Ask exactly ONE question`;
      const response = await callGemini(prompt);
      dispatch({ type: 'ADD_MOCK_MESSAGE', message: { role: 'interviewer', content: response, timestamp: new Date().toISOString() } });
    } catch (e: any) {
      dispatch({ type: 'ADD_MOCK_MESSAGE', message: { role: 'interviewer', content: `Connection error: ${e.message}`, timestamp: new Date().toISOString() } });
    } finally {
      dispatch({ type: 'SET_MOCK_LOADING', loading: false });
    }
  };

  return (
    <PrepContext.Provider value={{
      state, dispatch,
      loadTracks, addTrack, updateTrackStatus, deleteTrack,
      startMockInterview, sendMockAnswer, calculateJobrScore, generateRoadmap,
      activeTrack, FREE_MOCK_LIMIT,
    }}>
      {children}
    </PrepContext.Provider>
  );
}

export function usePrep() {
  const ctx = useContext(PrepContext);
  if (!ctx) throw new Error('usePrep must be used inside PrepProvider');
  return ctx;
}

export const SEED_TRACKS: JobTrack[] = [
  {
    id: 'seed-1',
    user_email: 'demo@jobr.co.in',
    company: 'Google',
    role: 'Software Engineer L4',
    jd_text: 'Software Engineer with 3+ years experience. Python/Java/C++ proficiency required. System design, data structures and algorithms essential.',
    cv_text: '',
    status: 'interview_1',
    jobr_score: 82,
    interview_date: '2026-05-20',
    interview_notes: 'First round scheduled. Focus on DSA and system design basics.',
    round: 1,
    trials_used: 2,
    ai_feedback: '{"score":82,"matched_skills":["Python","DSA","System Design"],"missing_skills":["Distributed Systems","Kubernetes"]}',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'seed-2',
    user_email: 'demo@jobr.co.in',
    company: 'Razorpay',
    role: 'Product Manager',
    jd_text: 'PM with 2-4 years fintech experience. Strong analytics, user research, and cross-functional collaboration required.',
    cv_text: '',
    status: 'applied',
    jobr_score: 71,
    round: 1,
    trials_used: 0,
    ai_feedback: '{"score":71,"matched_skills":["Analytics","User Research"],"missing_skills":["Fintech domain","SQL","A/B Testing"]}',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'seed-3',
    user_email: 'demo@jobr.co.in',
    company: 'Swiggy',
    role: 'Senior Data Scientist',
    jd_text: 'Senior Data Scientist for demand forecasting. Python, ML, SQL. Experience with real-time systems preferred.',
    cv_text: '',
    status: 'interview_2',
    jobr_score: 88,
    interview_date: '2026-05-22',
    interview_notes: 'Cleared round 1! Round 2 is deep ML systems.',
    round: 2,
    trials_used: 1,
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'seed-4',
    user_email: 'demo@jobr.co.in',
    company: 'CRED',
    role: 'UX Designer',
    jd_text: 'UX Designer for premium financial products. Figma expertise required. Portfolio of mobile app designs.',
    cv_text: '',
    status: 'offer',
    jobr_score: 94,
    round: 3,
    trials_used: 3,
    interview_notes: '🎉 GOT THE OFFER! ₹28 LPA + ESOPs',
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'seed-5',
    user_email: 'demo@jobr.co.in',
    company: 'Zomato',
    role: 'Backend Engineer',
    jd_text: 'Backend Engineer. Node.js, PostgreSQL, Redis, microservices. 2+ years experience.',
    cv_text: '',
    status: 'rejected',
    jobr_score: 58,
    round: 1,
    trials_used: 1,
    interview_notes: 'Rejected after technical round. Weak on system design.',
    improvement_roadmap: '{"root_cause":"System design and database optimisation gaps were apparent in the technical round.","skill_gaps":["System Design","Redis/Caching","Microservices","Database Optimisation"],"action_items":[{"action":"Complete Grokking the System Design Interview","timeline":"2 weeks","resource":"educative.io"},{"action":"Build a mini Redis cache project","timeline":"1 week","resource":"redis.io/docs"},{"action":"Contribute to open-source Node.js project","timeline":"1 month","resource":"github.com"}],"next_target_roles":["Junior Backend Engineer","Full Stack Developer","API Engineer"],"encouragement":"Every rejection is a detailed roadmap — you now know exactly what to fix."}',
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const COURSE_DATA: Record<string, { title: string; provider: string; url: string; duration: string }[]> = {
  'System Design': [
    { title: 'System Design Interview Crash Course', provider: 'YouTube', url: 'https://youtube.com/watch?v=i53Gi_K3o7I', duration: '3 hrs' },
  ],
  'Distributed Systems': [
    { title: 'System Design Interview Crash Course', provider: 'YouTube', url: 'https://youtube.com/watch?v=i53Gi_K3o7I', duration: '3 hrs' },
  ],
  'DSA': [
    { title: 'Data Structures Easy to Advanced', provider: 'YouTube', url: 'https://youtube.com/watch?v=RBSGKlAvoiM', duration: '8 hrs' },
  ],
  'SQL': [
    { title: 'SQL Full Database Course', provider: 'freeCodeCamp', url: 'https://youtube.com/watch?v=HXV3zeQKqGY', duration: '4 hrs' },
  ],
  'A/B Testing': [
    { title: 'Product Management Full Course', provider: 'YouTube', url: 'https://youtube.com/watch?v=7bJQMb-6GtY', duration: '2 hrs' },
  ],
  'Fintech domain': [
    { title: 'Product Management Full Course', provider: 'YouTube', url: 'https://youtube.com/watch?v=7bJQMb-6GtY', duration: '2 hrs' },
  ],
  'React': [
    { title: 'React Complete Guide 2024', provider: 'YouTube', url: 'https://youtube.com/watch?v=SqcY0GlETPk', duration: '12 hrs' },
  ],
  'Python': [
    { title: 'Python Full Course', provider: 'freeCodeCamp', url: 'https://youtube.com/watch?v=rfscVS0vtbw', duration: '4 hrs' },
  ],
  'Machine Learning': [
    { title: 'ML Crash Course', provider: 'Google', url: 'https://youtube.com/watch?v=NWONeJKn9Hc', duration: '3 hrs' },
  ],
  'Kubernetes': [
    { title: 'DevOps Engineering Course', provider: 'freeCodeCamp', url: 'https://youtube.com/watch?v=j5Zsa_eOXeY', duration: '3 hrs' },
  ],
  'Redis/Caching': [
    { title: 'System Design Interview Crash Course', provider: 'YouTube', url: 'https://youtube.com/watch?v=i53Gi_K3o7I', duration: '3 hrs' },
  ],
  'Microservices': [
    { title: 'DevOps Engineering Course', provider: 'freeCodeCamp', url: 'https://youtube.com/watch?v=j5Zsa_eOXeY', duration: '3 hrs' },
  ],
};