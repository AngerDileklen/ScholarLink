import { supabase, DatabaseProfile, DatabasePost, DatabaseConference, DatabaseGrant, DatabaseApplication } from './supabase';
import { ScholarProfile, Post, AcademicEvent, GrantOpportunity, Inquiry, ApplicationStatus, PostType } from '../types';

// Fetch all profiles from Supabase
export const fetchProfiles = async (): Promise<ScholarProfile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching profiles:', error);
    return [];
  }

  return data.map(mapDbProfileToScholar);
};

// Fetch single profile by ID
export const fetchProfileById = async (id: string): Promise<ScholarProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return mapDbProfileToScholar(data);
};

// Fetch profiles by role
export const fetchProfilesByRole = async (role: string): Promise<ScholarProfile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', role);

  if (error) {
    console.error('Error fetching profiles by role:', error);
    return [];
  }

  return data.map(mapDbProfileToScholar);
};

// Search profiles
export const searchProfiles = async (query: string): Promise<ScholarProfile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .or(`name.ilike.%${query}%,bio.ilike.%${query}%,university_name.ilike.%${query}%`)
    .limit(20);

  if (error) {
    console.error('Error searching profiles:', error);
    return [];
  }

  return data.map(mapDbProfileToScholar);
};

// Fetch posts
export const fetchPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  const posts = await Promise.all(data.map(async (post) => {
    const author = await fetchProfileById(post.author_id);
    return mapDbPostToPost(post, author);
  }));

  return posts;
};

// Create a post
export const createPost = async (post: Partial<Post>, authorId: string): Promise<Post | null> => {
  const { data, error } = await supabase
    .from('posts')
    .insert({
      author_id: authorId,
      content: post.content,
      link_url: post.relatedLink?.url,
      link_title: post.relatedLink?.title,
      post_type: post.type || 'paper_share',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating post:', error);
    return null;
  }

  const author = await fetchProfileById(authorId);
  return mapDbPostToPost(data, author);
};

// Fetch conferences
export const fetchConferences = async (): Promise<AcademicEvent[]> => {
  const { data, error } = await supabase
    .from('conferences')
    .select('*')
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching conferences:', error);
    return [];
  }

  return data.map(mapDbConferenceToEvent);
};

// Fetch grants
export const fetchGrants = async (): Promise<GrantOpportunity[]> => {
  const { data, error } = await supabase
    .from('grants')
    .select('*')
    .order('deadline', { ascending: true });

  if (error) {
    console.error('Error fetching grants:', error);
    return [];
  }

  return data.map(mapDbGrantToGrant);
};

// Create a grant
export const createGrant = async (grant: Partial<GrantOpportunity>, userId: string): Promise<GrantOpportunity | null> => {
  const { data, error } = await supabase
    .from('grants')
    .insert({
      title: grant.title,
      organization_name: grant.organizationName,
      amount: grant.amount,
      deadline: grant.deadline,
      description: grant.description,
      apply_link: grant.applyLink,
      tags: grant.tags,
      created_by: userId,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating grant:', error);
    return null;
  }

  return mapDbGrantToGrant(data);
};

// Fetch applications for a professor
export const fetchApplications = async (professorId: string): Promise<Inquiry[]> => {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('professor_id', professorId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching applications:', error);
    return [];
  }

  const applications = await Promise.all(data.map(async (app) => {
    const scholar = await fetchProfileById(app.scholar_id);
    return mapDbApplicationToInquiry(app, scholar);
  }));

  return applications;
};

// Update application status
export const updateApplicationStatus = async (applicationId: string, status: ApplicationStatus): Promise<boolean> => {
  const { error } = await supabase
    .from('applications')
    .update({ status })
    .eq('id', applicationId);

  if (error) {
    console.error('Error updating application:', error);
    return false;
  }

  return true;
};

// Create or update user profile
export const upsertProfile = async (profile: Partial<DatabaseProfile>, userId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      email: profile.email,
      name: profile.name,
      title: profile.title,
      bio: profile.bio,
      avatar_url: profile.avatar_url,
      university_name: profile.university_name,
      department: profile.department,
      location_city: profile.location_city,
      location_country: profile.location_country,
      research_interests: profile.research_interests,
      role: profile.role || 'student',
      accepting_students: profile.accepting_students || false,
      funding_available: profile.funding_available || false,
      open_to_industry: profile.open_to_industry || false,
      seeking_supervisor: profile.seeking_supervisor || false,
      github_url: profile.github_url,
      linkedin_url: profile.linkedin_url,
      researchgate_url: profile.researchgate_url,
      orcid_id: profile.orcid_id,
      website_url: profile.website_url,
    });

  if (error) {
    console.error('Error upserting profile:', error);
    return false;
  }

  return true;
};

// ============================================
// MAPPER FUNCTIONS
// ============================================

const mapDbProfileToScholar = (dbProfile: DatabaseProfile): ScholarProfile => ({
  id: dbProfile.id,
  name: dbProfile.name,
  title: dbProfile.title || '',
  bio: dbProfile.bio || '',
  avatarUrl: dbProfile.avatar_url || '',
  university: {
    name: dbProfile.university_name || '',
  },
  department: dbProfile.department || '',
  location: {
    city: dbProfile.location_city || '',
    country: dbProfile.location_country || '',
    coordinates: { lat: 0, lng: 0 },
  },
  researchInterests: dbProfile.research_interests || [],
  acceptingStudents: dbProfile.accepting_students,
  fundingAvailable: dbProfile.funding_available,
  openToIndustry: dbProfile.open_to_industry,
  verified: dbProfile.verified,
  hIndex: dbProfile.h_index,
  citationCount: dbProfile.citation_count,
  role: dbProfile.role,
  activeProjects: [],
  papers: [],
  attendingEvents: [],
});

const FALLBACK_AUTHOR: ScholarProfile = {
  id: 'unknown',
  name: 'Unknown Author',
  title: '',
  bio: '',
  avatarUrl: '',
  university: { name: '' },
  department: '',
  location: { city: '', country: '', coordinates: { lat: 0, lng: 0 } },
  researchInterests: [],
  acceptingStudents: false,
  fundingAvailable: false,
  openToIndustry: false,
  verified: false,
  hIndex: 0,
  citationCount: 0,
  role: 'student',
  activeProjects: [],
  papers: [],
  attendingEvents: [],
};

const DB_TO_POST_TYPE: Record<string, PostType> = {
  research: 'paper_share',
  question: 'paper_share',
  opportunity: 'grant_post',
  update: 'project_update',
  paper_share: 'paper_share',
  project_update: 'project_update',
  grant_post: 'grant_post',
};

const mapDbPostToPost = (dbPost: DatabasePost, author: ScholarProfile | null): Post => ({
  id: dbPost.id,
  author: author || FALLBACK_AUTHOR,
  content: dbPost.content,
  type: DB_TO_POST_TYPE[dbPost.post_type] || 'paper_share',
  timestamp: new Date(dbPost.created_at).toLocaleDateString(),
  relatedLink: dbPost.link_url ? { url: dbPost.link_url, title: dbPost.link_title || '' } : undefined,
  metrics: {
    likes: dbPost.likes_count,
    comments: dbPost.comments_count,
    shares: 0,
  },
});

const mapDbConferenceToEvent = (dbConf: DatabaseConference): AcademicEvent => ({
  id: dbConf.id,
  name: dbConf.name,
  date: dbConf.date,
  location: dbConf.location,
  websiteUrl: dbConf.website_url || '',
  topics: dbConf.topics || [],
  description: dbConf.description || '',
});

const mapDbGrantToGrant = (dbGrant: DatabaseGrant): GrantOpportunity => ({
  id: dbGrant.id,
  title: dbGrant.title,
  organizationName: dbGrant.organization_name,
  amount: dbGrant.amount,
  deadline: dbGrant.deadline,
  description: dbGrant.description || '',
  applyLink: dbGrant.apply_link || '',
  tags: dbGrant.tags || [],
});

const mapDbApplicationToInquiry = (dbApp: DatabaseApplication, scholar: ScholarProfile | null): Inquiry => ({
  id: dbApp.id,
  candidateId: dbApp.scholar_id,
  candidateName: scholar?.name || 'Unknown',
  candidateAvatar: scholar?.avatarUrl || '',
  professorId: dbApp.professor_id,
  targetProfessorId: dbApp.professor_id,
  type: 'phd',
  positionTitle: dbApp.position_title || '',
  status: dbApp.status,
  matchScore: dbApp.match_score || 0,
  message: dbApp.message || '',
  cvLink: dbApp.cv_link || '',
  timestamp: new Date(dbApp.created_at).toLocaleDateString(),
});
