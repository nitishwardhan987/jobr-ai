'use client';
import { createContext, useContext, useReducer, useEffect, useState, ReactNode } from 'react';
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

export type AIProvider = 'gemini-flash' | 'gemini-pro' | 'gpt-4o' | 'gpt-3.5' | 'claude-sonnet' | 'claude-haiku';

export interface AIProviderConfig {
  id: AIProvider;
  label: string;
  model: string;
  provider: 'gemini' | 'openai' | 'anthropic';
  free: boolean;
  costNote: string;
  keyLabel: string;
  keyPlaceholder: string;
  keyUrl: string;
  keyUrlLabel: string;
  color: string;
  logo: string;
}

export const AI_PROVIDERS: AIProviderConfig[] = [
  {
    id: 'gemini-flash',
    label: 'Gemini 1.5 Flash',
    model: 'gemini-2.0-flash',
    provider: 'gemini',
    free: true,
    costNote: 'Free tier · No billing required',
    keyLabel: 'Google AI Studio API Key',
    keyPlaceholder: 'AIzaSy...',
    keyUrl: 'https://aistudio.google.com/app/apikey',
    keyUrlLabel: 'aistudio.google.com',
    color: '#4285F4',
    logo: '🔵',
  },
  {
    id: 'gemini-pro',
    label: 'Gemini 1.5 Pro',
    model: 'gemini-2.0-flash-lite',
    provider: 'gemini',
    free: false,
    costNote: 'Paid · ~$0.0035 per 1K tokens',
    keyLabel: 'Google AI Studio API Key',
    keyPlaceholder: 'AIzaSy...',
    keyUrl: 'https://aistudio.google.com/app/apikey',
    keyUrlLabel: 'aistudio.google.com',
    color: '#34A853',
    logo: '🟢',
  },
  {
    id: 'gpt-4o',
    label: 'GPT-4o',
    model: 'gpt-4o',
    provider: 'openai',
    free: false,
    costNote: 'Paid · ~$0.005 per 1K tokens',
    keyLabel: 'OpenAI API Key',
    keyPlaceholder: 'sk-proj-...',
    keyUrl: 'https://platform.openai.com/api-keys',
    keyUrlLabel: 'platform.openai.com',
    color: '#10A37F',
    logo: '⚫',
  },
  {
    id: 'gpt-3.5',
    label: 'GPT-3.5 Turbo',
    model: 'gpt-3.5-turbo',
    provider: 'openai',
    free: false,
    costNote: 'Paid · ~$0.0005 per 1K tokens',
    keyLabel: 'OpenAI API Key',
    keyPlaceholder: 'sk-proj-...',
    keyUrl: 'https://platform.openai.com/api-keys',
    keyUrlLabel: 'platform.openai.com',
    color: '#10A37F',
    logo: '⚫',
  },
  {
    id: 'claude-sonnet',
    label: 'Claude Sonnet 4',
    model: 'claude-sonnet-4-5',
    provider: 'anthropic',
    free: false,
    costNote: 'Paid · ~$0.003 per 1K tokens',
    keyLabel: 'Anthropic API Key',
    keyPlaceholder: 'sk-ant-...',
    keyUrl: 'https://console.anthropic.com/settings/keys',
    keyUrlLabel: 'console.anthropic.com',
    color: '#D97706',
    logo: '🟠',
  },
  {
    id: 'claude-haiku',
    label: 'Claude Haiku',
    model: 'claude-haiku-4-5-20251001',
    provider: 'anthropic',
    free: false,
    costNote: 'Paid · ~$0.00025 per 1K tokens',
    keyLabel: 'Anthropic API Key',
    keyPlaceholder: 'sk-ant-...',
    keyUrl: 'https://console.anthropic.com/settings/keys',
    keyUrlLabel: 'console.anthropic.com',
    color: '#D97706',
    logo: '🟠',
  },
];

export type ProviderKeys = {
  gemini: string;
  openai: string;
  anthropic: string;
};

export type FeatureProviders = {
  cv: AIProvider;
  interview: AIProvider;
  score: AIProvider;
  roadmap: AIProvider;
};

export interface PrepState {
  activeTab: 'cv' | 'tracks' | 'interview' | 'mentor' | 'learn' | 'settings';
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
  providerKeys: ProviderKeys;
  featureProviders: FeatureProviders;
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
  | { type: 'SET_TRIALS'; count: number }
  | { type: 'SET_SHOW_PRO_MODAL'; show: boolean }
  | { type: 'SET_USER'; email: string; name: string }
  | { type: 'SET_API_KEY'; key: string }
  | { type: 'SET_PROVIDER_KEY'; provider: keyof ProviderKeys; key: string }
  | { type: 'SET_FEATURE_PROVIDER'; feature: keyof FeatureProviders; provider: AIProvider }
  | { type: 'RESET_MOCK' };

export const FREE_MOCK_LIMIT = 3;

const DEFAULT_FEATURE_PROVIDERS: FeatureProviders = {
  cv: 'gemini-flash',
  interview: 'gemini-flash',
  score: 'gemini-flash',
  roadmap: 'gemini-flash',
};

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
  providerKeys: { gemini: '', openai: '', anthropic: '' },
  featureProviders: DEFAULT_FEATURE_PROVIDERS,
  apiKey: '',
};

function reducer(state: PrepState, action: PrepAction): PrepState {
  switch (action.type) {
    case 'SET_TAB': return { ...state, activeTab: action.tab };
    case 'SET_TRACKS': return { ...state, tracks: action.tracks };
    case 'SET_ACTIVE_TRACK': return { ...state, activeTrackId: action.id };
    case 'ADD_TRACK': return { ...state, tracks: [action.track, ...state.tracks], activeTrackId: action.track.id };
    case 'UPDATE_TRACK':
      return { ...state, tracks: state.tracks.map(t => t.id === action.track.id ? { ...t, ...action.track, updated_at: new Date().toISOString() } : t) };
    case 'DELETE_TRACK':
      return {
        ...state,
        tracks: state.tracks.filter(t => t.id !== action.id),
        activeTrackId: state.activeTrackId === action.id
          ? (state.tracks.filter(t => t.id !== action.id)[0]?.id || null)
          : state.activeTrackId,
      };
    case 'SET_TRACKS_LOADING': return { ...state, tracksLoading: action.loading };
    case 'SET_MOCK_SESSION': return { ...state, mockSession: action.messages };
    case 'ADD_MOCK_MESSAGE': return { ...state, mockSession: [...state.mockSession, action.message] };
    case 'SET_MOCK_LOADING': return { ...state, mockLoading: action.loading };
    case 'SET_MOCK_ACTIVE': return { ...state, mockActive: action.active };
    case 'INCREMENT_TRIALS': return { ...state, trialsUsed: state.trialsUsed + 1 };
    case 'SET_TRIALS': return { ...state, trialsUsed: action.count };
    case 'SET_SHOW_PRO_MODAL': return { ...state, showProModal: action.show };
    case 'SET_USER': return { ...state, userEmail: action.email, userName: action.name };
    case 'SET_API_KEY':
      return { ...state, apiKey: action.key, providerKeys: { ...state.providerKeys, gemini: action.key } };
    case 'SET_PROVIDER_KEY':
      return {
        ...state,
        providerKeys: { ...state.providerKeys, [action.provider]: action.key },
        apiKey: action.provider === 'gemini' ? action.key : state.apiKey,
      };
    case 'SET_FEATURE_PROVIDER':
      return { ...state, featureProviders: { ...state.featureProviders, [action.feature]: action.provider } };
    case 'RESET_MOCK': return { ...state, mockSession: [], mockActive: false, mockLoading: false };
    default: return state;
  }
}

interface PrepContextValue {
  state: PrepState;
  dispatch: React.Dispatch<PrepAction>;
  authLoading: boolean;
  loadTracks: () => Promise<void>;
  addTrack: (data: { company: string; role: string; jd_text: string; cv_text: string }) => Promise<void>;
  updateTrackStatus: (id: string, status: TrackStatus, extra?: Partial<JobTrack>) => Promise<void>;
  deleteTrack: (id: string) => Promise<void>;
  startMockInterview: (track: JobTrack) => Promise<void>;
  sendMockAnswer: (answer: string, track: JobTrack) => Promise<void>;
  calculateJobrScore: (track: JobTrack) => Promise<void>;
  generateRoadmap: (track: JobTrack) => Promise<void>;
  callAI: (prompt: string, feature: keyof FeatureProviders, overrideProvider?: AIProvider) => Promise<string>;
  getActiveKey: (feature: keyof FeatureProviders) => string;
  getActiveProvider: (feature: keyof FeatureProviders) => AIProviderConfig;
  activeTrack: JobTrack | null;
  FREE_MOCK_LIMIT: number;
}

const PrepContext = createContext<PrepContextValue | null>(null);

export function PrepProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [authLoading, setAuthLoading] = useState(true);
  const activeTrack = state.tracks.find(t => t.id === state.activeTrackId) || null;

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user?.email) {
        const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0] || '';
        dispatch({ type: 'SET_USER', email: user.email, name });

        const { data: settings } = await supabase
          .from('user_settings')
          .select('mock_trials_used, gemini_key, openai_key, anthropic_key')
          .eq('email', user.email)
          .single();

        if (settings) {
          if (settings.mock_trials_used) dispatch({ type: 'SET_TRIALS', count: settings.mock_trials_used });
          if (settings.gemini_key)    dispatch({ type: 'SET_PROVIDER_KEY', provider: 'gemini',    key: settings.gemini_key });
          if (settings.openai_key)    dispatch({ type: 'SET_PROVIDER_KEY', provider: 'openai',    key: settings.openai_key });
          if (settings.anthropic_key) dispatch({ type: 'SET_PROVIDER_KEY', provider: 'anthropic', key: settings.anthropic_key });
        } else {
          // Fallback to localStorage for existing users
          const geminiKey    = localStorage.getItem('jobr_gemini_key') || '';
          const openaiKey    = localStorage.getItem('jobr_openai_key') || '';
          const anthropicKey = localStorage.getItem('jobr_anthropic_key') || '';
          if (geminiKey)    dispatch({ type: 'SET_PROVIDER_KEY', provider: 'gemini',    key: geminiKey });
          if (openaiKey)    dispatch({ type: 'SET_PROVIDER_KEY', provider: 'openai',    key: openaiKey });
          if (anthropicKey) dispatch({ type: 'SET_PROVIDER_KEY', provider: 'anthropic', key: anthropicKey });
          const trials = parseInt(localStorage.getItem('jobr_mock_trials') || '0');
          if (trials > 0) dispatch({ type: 'SET_TRIALS', count: trials });
        }
      } else {
        // Guest: load keys from localStorage only
        const geminiKey    = localStorage.getItem('jobr_gemini_key') || '';
        const openaiKey    = localStorage.getItem('jobr_openai_key') || '';
        const anthropicKey = localStorage.getItem('jobr_anthropic_key') || '';
        if (geminiKey)    dispatch({ type: 'SET_PROVIDER_KEY', provider: 'gemini',    key: geminiKey });
        if (openaiKey)    dispatch({ type: 'SET_PROVIDER_KEY', provider: 'openai',    key: openaiKey });
        if (anthropicKey) dispatch({ type: 'SET_PROVIDER_KEY', provider: 'anthropic', key: anthropicKey });
        const trials = parseInt(localStorage.getItem('jobr_mock_trials') || '0');
        if (trials > 0) dispatch({ type: 'SET_TRIALS', count: trials });
      }

      const saved = localStorage.getItem('jobr_feature_providers');
      if (saved) {
        try {
          const fp = JSON.parse(saved);
          Object.keys(fp).forEach(feature => {
            dispatch({ type: 'SET_FEATURE_PROVIDER', feature: feature as keyof FeatureProviders, provider: fp[feature] });
          });
        } catch {}
      }

      setAuthLoading(false);
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        dispatch({ type: 'SET_USER', email: '', name: '' });
        dispatch({ type: 'SET_TRACKS', tracks: [] });
      }
      if (event === 'SIGNED_IN' && session?.user) {
        const u = session.user;
        const name = u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || '';
        dispatch({ type: 'SET_USER', email: u.email || '', name });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const getActiveProvider = (feature: keyof FeatureProviders): AIProviderConfig => {
    const providerId = state.featureProviders[feature];
    return AI_PROVIDERS.find(p => p.id === providerId) || AI_PROVIDERS[0];
  };

  const getActiveKey = (feature: keyof FeatureProviders): string => {
    const provider = getActiveProvider(feature);
    return state.providerKeys[provider.provider] || '';
  };

  const callAI = async (prompt: string, feature: keyof FeatureProviders, overrideProvider?: AIProvider): Promise<string> => {
    const providerId = overrideProvider || state.featureProviders[feature];
    const providerCfg = AI_PROVIDERS.find(p => p.id === providerId) || AI_PROVIDERS[0];
    const key = state.providerKeys[providerCfg.provider];

    if (!key) throw new Error(`No API key set for ${providerCfg.label}. Go to Settings to add your key.`);

    if (providerCfg.provider === 'gemini') {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${providerCfg.model}:generateContent?key=${key}`,
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
      if (!res.ok) throw new Error(data?.error?.message || 'Gemini API error');
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }

    if (providerCfg.provider === 'openai') {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
        body: JSON.stringify({
          model: providerCfg.model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1024,
          temperature: 0.7,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || 'OpenAI API error');
      return data.choices?.[0]?.message?.content || '';
    }

    if (providerCfg.provider === 'anthropic') {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: providerCfg.model,
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || 'Anthropic API error');
      return data.content?.[0]?.text || '';
    }

    throw new Error('Unknown provider');
  };

  const loadTracks = async () => {
    dispatch({ type: 'SET_TRACKS_LOADING', loading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const email = user?.email || state.userEmail;
      if (!email) {
        const local = localStorage.getItem('jobr_tracks');
        const tracks = local ? JSON.parse(local) : SEED_TRACKS;
        dispatch({ type: 'SET_TRACKS', tracks });
        if (tracks.length > 0) dispatch({ type: 'SET_ACTIVE_TRACK', id: tracks[0].id });
        return;
      }
      const { data } = await supabase
        .from('job_tracks')
        .select('*')
        .eq('user_email', email)
        .order('created_at', { ascending: false });
      const tracks = data && data.length > 0 ? data : [];
      dispatch({ type: 'SET_TRACKS', tracks });
      if (tracks.length > 0) dispatch({ type: 'SET_ACTIVE_TRACK', id: tracks[0].id });
    } catch {
      dispatch({ type: 'SET_TRACKS', tracks: [] });
    } finally {
      dispatch({ type: 'SET_TRACKS_LOADING', loading: false });
    }
  };

  const addTrack = async (data: { company: string; role: string; jd_text: string; cv_text: string }) => {
    const newTrack: JobTrack = {
      id: crypto.randomUUID(),
      user_email: state.userEmail,
      company: data.company, role: data.role,
      jd_text: data.jd_text, cv_text: data.cv_text,
      status: 'applied', jobr_score: 0, round: 1, trials_used: 0,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
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
      localStorage.setItem('jobr_tracks', JSON.stringify(existing.map(t => t.id === id ? { ...t, ...update } : t)));
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

  const calculateJobrScore = async (track: JobTrack) => {
    if (!track.jd_text && !track.cv_text) return;
    try {
      const prompt = `You are a technical recruiter. Analyse this CV against this Job Description and return ONLY a JSON object with no markdown:
{"score": <0-100 integer>, "matched_skills": ["skill1","skill2"], "missing_skills": ["skill3","skill4"], "summary": "<2 sentence assessment>"}

CV: ${track.cv_text?.slice(0, 2000) || 'Not provided'}
JD: ${track.jd_text?.slice(0, 1500) || 'Not provided'}`;
      const raw  = await callAI(prompt, 'score');
      const json = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] || '{}');
      await updateTrackStatus(track.id, track.status, { jobr_score: json.score || 0, ai_feedback: JSON.stringify(json) });
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
      const raw  = await callAI(prompt, 'roadmap');
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
      const response = await callAI(prompt, 'interview');
      dispatch({ type: 'ADD_MOCK_MESSAGE', message: { role: 'interviewer', content: response, timestamp: new Date().toISOString() } });
    } catch (e: any) {
      dispatch({ type: 'ADD_MOCK_MESSAGE', message: { role: 'interviewer', content: `Error: ${e.message}`, timestamp: new Date().toISOString() } });
    } finally {
      dispatch({ type: 'SET_MOCK_LOADING', loading: false });
    }
    dispatch({ type: 'INCREMENT_TRIALS' });
    const newTrialCount = state.trialsUsed + 1;
    localStorage.setItem('jobr_mock_trials', newTrialCount.toString());
    if (state.userEmail) {
      await supabase.from('user_settings').upsert({
        email: state.userEmail,
        mock_trials_used: newTrialCount,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' });
    }
    await updateTrackStatus(track.id, track.status, { trials_used: track.trials_used + 1 });
  };

  const sendMockAnswer = async (answer: string, track: JobTrack) => {
    dispatch({ type: 'ADD_MOCK_MESSAGE', message: { role: 'candidate', content: answer, timestamp: new Date().toISOString() } });
    dispatch({ type: 'SET_MOCK_LOADING', loading: true });
    try {
      const history = state.mockSession.map(m => `${m.role === 'interviewer' ? 'Interviewer' : 'Candidate'}: ${m.content}`).join('\n\n');
      const prompt = `You are interviewing for ${track.role} at ${track.company}.

Interview so far:
${history}

Candidate just answered: "${answer}"

Instructions:
1. Acknowledge briefly (1 sentence)
2. If strong answer → escalate difficulty
3. If weak → probe deeper
4. Keep total under 100 words
5. Ask exactly ONE question`;
      const response = await callAI(prompt, 'interview');
      dispatch({ type: 'ADD_MOCK_MESSAGE', message: { role: 'interviewer', content: response, timestamp: new Date().toISOString() } });
    } catch (e: any) {
      dispatch({ type: 'ADD_MOCK_MESSAGE', message: { role: 'interviewer', content: `Error: ${e.message}`, timestamp: new Date().toISOString() } });
    } finally {
      dispatch({ type: 'SET_MOCK_LOADING', loading: false });
    }
  };

  return (
    <PrepContext.Provider value={{
      state, dispatch,
      authLoading,
      loadTracks, addTrack, updateTrackStatus, deleteTrack,
      startMockInterview, sendMockAnswer, calculateJobrScore, generateRoadmap,
      callAI, getActiveKey, getActiveProvider,
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
    id: 'seed-1', user_email: 'demo@jobr.co.in',
    company: 'Google', role: 'Software Engineer L4',
    jd_text: 'Software Engineer with 3+ years experience. Python/Java/C++ proficiency required. System design, data structures and algorithms essential.',
    cv_text: '', status: 'interview_1', jobr_score: 82,
    interview_date: '2026-05-20', interview_notes: 'First round scheduled. Focus on DSA and system design.',
    round: 1, trials_used: 2,
    ai_feedback: '{"score":82,"matched_skills":["Python","DSA","System Design"],"missing_skills":["Distributed Systems","Kubernetes"]}',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'seed-2', user_email: 'demo@jobr.co.in',
    company: 'Razorpay', role: 'Product Manager',
    jd_text: 'PM with 2-4 years fintech experience. Strong analytics, user research required.',
    cv_text: '', status: 'applied', jobr_score: 71, round: 1, trials_used: 0,
    ai_feedback: '{"score":71,"matched_skills":["Analytics","User Research"],"missing_skills":["Fintech domain","SQL","A/B Testing"]}',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'seed-3', user_email: 'demo@jobr.co.in',
    company: 'Swiggy', role: 'Senior Data Scientist',
    jd_text: 'Senior Data Scientist for demand forecasting. Python, ML, SQL required.',
    cv_text: '', status: 'interview_2', jobr_score: 88,
    interview_date: '2026-05-22', interview_notes: 'Cleared round 1! Round 2 is deep ML systems.',
    round: 2, trials_used: 1,
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'seed-4', user_email: 'demo@jobr.co.in',
    company: 'CRED', role: 'UX Designer',
    jd_text: 'UX Designer for premium financial products. Figma expertise required.',
    cv_text: '', status: 'offer', jobr_score: 94, round: 3, trials_used: 3,
    interview_notes: '🎉 GOT THE OFFER! ₹28 LPA + ESOPs',
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'seed-5', user_email: 'demo@jobr.co.in',
    company: 'Zomato', role: 'Backend Engineer',
    jd_text: 'Backend Engineer. Node.js, PostgreSQL, Redis, microservices. 2+ years.',
    cv_text: '', status: 'rejected', jobr_score: 58, round: 1, trials_used: 1,
    interview_notes: 'Rejected after technical round.',
    improvement_roadmap: '{"root_cause":"System design and caching knowledge gaps.","skill_gaps":["System Design","Redis","Microservices","DB Optimisation"],"action_items":[{"action":"Complete Grokking System Design","timeline":"2 weeks","resource":"educative.io"},{"action":"Build Redis cache project","timeline":"1 week","resource":"redis.io"},{"action":"Contribute to open-source Node.js","timeline":"1 month","resource":"github.com"}],"next_target_roles":["Junior Backend","Full Stack","API Engineer"],"encouragement":"Every rejection is a roadmap — you now know exactly what to fix."}',
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(), updated_at: new Date().toISOString(),
  },
];

export const COURSE_DATA: Record<string, { title: string; provider: string; url: string; duration: string }[]> = {
  'System Design':       [{ title: 'System Design Interview Crash Course', provider: 'YouTube', url: 'https://youtube.com/watch?v=i53Gi_K3o7I', duration: '3 hrs' }],
  'Distributed Systems': [{ title: 'System Design Interview Crash Course', provider: 'YouTube', url: 'https://youtube.com/watch?v=i53Gi_K3o7I', duration: '3 hrs' }],
  'DSA':                 [{ title: 'Data Structures Easy to Advanced', provider: 'YouTube', url: 'https://youtube.com/watch?v=RBSGKlAvoiM', duration: '8 hrs' }],
  'SQL':                 [{ title: 'SQL Full Database Course', provider: 'freeCodeCamp', url: 'https://youtube.com/watch?v=HXV3zeQKqGY', duration: '4 hrs' }],
  'A/B Testing':         [{ title: 'Product Management Full Course', provider: 'YouTube', url: 'https://youtube.com/watch?v=7bJQMb-6GtY', duration: '2 hrs' }],
  'Fintech domain':      [{ title: 'Product Management Full Course', provider: 'YouTube', url: 'https://youtube.com/watch?v=7bJQMb-6GtY', duration: '2 hrs' }],
  'React':               [{ title: 'React Complete Guide 2024', provider: 'YouTube', url: 'https://youtube.com/watch?v=SqcY0GlETPk', duration: '12 hrs' }],
  'Python':              [{ title: 'Python Full Course', provider: 'freeCodeCamp', url: 'https://youtube.com/watch?v=rfscVS0vtbw', duration: '4 hrs' }],
  'Machine Learning':    [{ title: 'ML Crash Course', provider: 'Google', url: 'https://youtube.com/watch?v=NWONeJKn9Hc', duration: '3 hrs' }],
  'Kubernetes':          [{ title: 'DevOps Engineering Course', provider: 'freeCodeCamp', url: 'https://youtube.com/watch?v=j5Zsa_eOXeY', duration: '3 hrs' }],
  'Redis/Caching':       [{ title: 'System Design Interview Crash Course', provider: 'YouTube', url: 'https://youtube.com/watch?v=i53Gi_K3o7I', duration: '3 hrs' }],
  'Microservices':       [{ title: 'DevOps Engineering Course', provider: 'freeCodeCamp', url: 'https://youtube.com/watch?v=j5Zsa_eOXeY', duration: '3 hrs' }],
};