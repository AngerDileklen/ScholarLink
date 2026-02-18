import { createClient } from '@supabase/supabase-js';

// Supabase credentials from user
const supabaseUrl = 'https://fvowxohpqgouthykqbkn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2b3d4b2hwcWdvdXRoeWtxYmtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMzk4MDYsImV4cCI6MjA4NjgxNTgwNn0.GOQfWm7sgtW4h2MQpPbXgw18WHn0ezIqDoIgy4bxVQA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types based on our schema
export interface DatabaseProfile {
  id: string;
  email: string;
  name: string;
  title: string | null;
  bio: string | null;
  avatar_url: string | null;
  university_name: string | null;
  location_city: string | null;
  location_country: string | null;
  research_interests: string[] | null;
  accepting_students: boolean;
  funding_available: boolean;
  open_to_industry: boolean;
  verified: boolean;
  h_index: number;
  citation_count: number;
  role: 'student' | 'professor' | 'corporate';
  created_at: string;
}

export interface DatabasePost {
  id: string;
  author_id: string;
  content: string;
  link_url: string | null;
  link_title: string | null;
  post_type: 'research' | 'question' | 'opportunity' | 'update';
  likes_count: number;
  comments_count: number;
  created_at: string;
}

export interface DatabaseConference {
  id: string;
  name: string;
  date: string;
  location: string;
  website_url: string | null;
  topics: string[] | null;
  description: string | null;
  created_by: string | null;
  created_at: string;
}

export interface DatabaseGrant {
  id: string;
  title: string;
  organization_name: string;
  amount: string;
  deadline: string;
  description: string | null;
  apply_link: string | null;
  tags: string[] | null;
  created_by: string | null;
  created_at: string;
}

export interface DatabaseApplication {
  id: string;
  scholar_id: string;
  professor_id: string;
  position_title: string | null;
  status: 'pending' | 'interviewing' | 'accepted' | 'rejected';
  match_score: number | null;
  message: string | null;
  cv_link: string | null;
  created_at: string;
}
