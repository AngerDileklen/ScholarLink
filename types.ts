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
}

export interface SearchFilters {
  topic: string;
  locationName: string;
  coordinates: Coordinates | null;
  radiusKm: number;
  onlyAcceptingStudents: boolean;
}

export type UserRole = 'professor' | 'student';

export interface DashboardStat {
  label: string;
  value: string | number;
  trend?: string;
  icon?: any;
}