import React from 'react';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface University {
  name: string;
  logoUrl?: string; // Placeholder for university logo
}

export interface ScholarProfile {
  id: string;
  name: string;
  title: string;
  university: University;
  department: string;
  location: {
    city: string;
    country: string;
    coordinates: Coordinates;
  };
  researchInterests: string[];
  bio: string;
  acceptingStudents: boolean;
  fundingAvailable: boolean;
  avatarUrl: string;
  citationCount: number;
  hIndex: number;
  verified: boolean;
  // Extended fields for Profile View
  email?: string; // Private/Blurred
  recentPublications?: string[];
  // Phase 1 Expansion
  openToIndustry: boolean;
  activeProjects: string[];
}

export interface CorporateProfile {
  id: string;
  name: string;
  industry: string;
  description: string;
  location: {
    city: string;
    country: string;
  };
  websiteUrl: string;
  avatarUrl: string;
}

export interface GrantOpportunity {
  id: string;
  title: string;
  organizationName: string;
  description: string;
  amount: string;
  deadline: string;
  tags: string[];
  applyLink: string;
}

export interface SearchFilters {
  topic: string;
  locationName: string;
  coordinates: Coordinates | null;
  radiusKm: number;
  onlyAcceptingStudents: boolean;
}

export type UserRole = 'professor' | 'student' | 'corporate';

export interface DashboardStat {
  label: string;
  value: string | number;
  trend?: string;
  icon?: React.ElementType;
}

// Phase 4: Social Feed Types
export type PostType = 'paper_share' | 'project_update' | 'grant_post';

export interface Post {
  id: string;
  author: ScholarProfile | CorporateProfile;
  type: PostType;
  content: string;
  timestamp: string;
  metrics: {
    likes: number;
    comments: number;
    shares?: number;
  };
  relatedLink?: {
    title: string;
    url: string;
  };
}