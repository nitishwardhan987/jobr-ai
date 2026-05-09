import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface MentorProfile {
  id?: string;
  user_email: string;
  name: string;
  avatar_url?: string;
  tagline?: string;
  domain: string;
  sub_domains?: string[];
  experience_years: number;
  bio?: string;
  demo_link?: string;
  whatsapp: string;
  rate_per_hour: number;
  response_time?: string;
  rating?: number;
  total_sessions?: number;
  is_verified?: boolean;
  is_active?: boolean;
  wallet_credits?: number;
  created_at?: string;
}

export interface EdtechProfile {
  id?: string;
  user_email: string;
  company_name: string;
  contact_name: string;
  website?: string;
  wallet_credits: number;
  total_spent?: number;
  created_at?: string;
}

export interface Booking {
  id?: string;
  mentor_email: string;
  edtech_email: string;
  mentor_name: string;
  edtech_company: string;
  session_topic: string;
  session_date: string;
  duration_hours: number;
  credits_total: number;
  credits_platform: number;
  credits_mentor: number;
  status: 'pending' | 'frozen' | 'delivered' | 'released' | 'disputed' | 'cancelled';
  proof_link?: string;
  dispute_reason?: string;
  auto_release_at?: string;
  created_at?: string;
  updated_at?: string;
}

export const CREDIT_TO_INR = 100;
export const PLATFORM_COMMISSION = 0.10;
export const CONNECTION_FEE = 50;
export const ADMIN_EMAIL = 'nitishwardhan987@gmail.com';

export function creditsToINR(credits: number) {
  return (credits * CREDIT_TO_INR).toLocaleString('en-IN');
}

export function calcBookingCredits(ratePerHour: number, hours: number) {
  const total = Math.round(ratePerHour * hours);
  const platform = Math.round(total * PLATFORM_COMMISSION);
  const mentor = total - platform;
  return { total, platform, mentor };
}

export const DOMAINS = [
  'Data Science & AI',
  'Product Management',
  'Software Engineering',
  'UI/UX Design',
  'Digital Marketing',
  'Business Strategy',
  'Finance & Accounting',
  'EdTech Operations',
  'Sales & Growth',
  'HR & Talent',
  'Web Development',
  'Mobile Development',
  'DevOps & Cloud',
  'Cybersecurity',
  'Content & Communication',
];