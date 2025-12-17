import { ScholarProfile } from '../types';

// Mock Data as requested in the "Task" description
// 3 Distinct Dummy Scholars: Montreal, Paris, New York

export const MOCK_SCHOLARS: ScholarProfile[] = [
  {
    id: '1',
    name: 'Dr. Yoshua Tremblay',
    title: 'Professor of Computer Science',
    university: { name: 'Mila - Quebec AI Institute' },
    department: 'Computer Science & Operations Research',
    location: {
      city: 'Montreal',
      country: 'Canada',
      coordinates: { lat: 45.5017, lng: -73.5673 }
    },
    researchInterests: ['Deep Learning', 'Generative Models', 'Reinforcement Learning', 'AI Safety'],
    bio: 'Focusing on the intersection of biological inspiration and deep learning architectures.',
    acceptingStudents: true,
    fundingAvailable: true,
    avatarUrl: 'https://picsum.photos/id/1005/200/200',
    citationCount: 15400,
    hIndex: 85,
    verified: true
  },
  {
    id: '2',
    name: 'Dr. Marie Laurent',
    title: 'Associate Professor',
    university: { name: 'Sorbonne Université' },
    department: 'History of Art & Archaeology',
    location: {
      city: 'Paris',
      country: 'France',
      coordinates: { lat: 48.8566, lng: 2.3522 }
    },
    researchInterests: ['Medieval Iconography', 'Curatorial Studies', 'European History', 'Museum Ethics'],
    bio: 'Exploring the narrative structures in 14th-century frescos and their modern preservation.',
    acceptingStudents: true,
    fundingAvailable: false,
    avatarUrl: 'https://picsum.photos/id/1011/200/200',
    citationCount: 1200,
    hIndex: 24,
    verified: true
  },
  {
    id: '3',
    name: 'Dr. James Chen',
    title: 'Principal Investigator',
    university: { name: 'Rockefeller University' },
    department: 'Laboratory of Synthetic Biology',
    location: {
      city: 'New York',
      country: 'USA',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    researchInterests: ['CRISPR', 'Gene Editing', 'Bioinformatics', 'Molecular Biology'],
    bio: 'Developing novel delivery mechanisms for gene therapies in non-liver tissues.',
    acceptingStudents: false,
    fundingAvailable: true, // Has funding for postdocs maybe, but not students
    avatarUrl: 'https://picsum.photos/id/1025/200/200',
    citationCount: 8900,
    hIndex: 62,
    verified: true
  },
  {
    id: '4',
    name: 'Dr. Sarah Connor',
    title: 'Assistant Professor',
    university: { name: 'McGill University' },
    department: 'Neuroscience',
    location: {
      city: 'Montreal',
      country: 'Canada',
      coordinates: { lat: 45.5048, lng: -73.5772 }
    },
    researchInterests: ['Neural Plasticity', 'Deep Learning', 'Brain-Computer Interfaces'],
    bio: 'Investigating how artificial neural networks can model biological plasticity.',
    acceptingStudents: true,
    fundingAvailable: true,
    avatarUrl: 'https://picsum.photos/id/338/200/200',
    citationCount: 540,
    hIndex: 12,
    verified: false
  }
];

// Helper to simulate a "Geocoding" API
export const MOCK_LOCATIONS: Record<string, { lat: number; lng: number }> = {
  'Montreal': { lat: 45.5017, lng: -73.5673 },
  'Paris': { lat: 48.8566, lng: 2.3522 },
  'New York': { lat: 40.7128, lng: -74.0060 },
  'London': { lat: 51.5074, lng: -0.1278 },
  'San Francisco': { lat: 37.7749, lng: -122.4194 }
};
