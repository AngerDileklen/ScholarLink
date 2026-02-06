import { ScholarProfile, CorporateProfile, GrantOpportunity, Post } from '../types';

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
    bio: 'I am driven by the quest to understand intelligence through the synthesis of artificial neural networks. My lab focuses on bridging the gap between biological constraints and machine learning efficiency.',
    acceptingStudents: true,
    fundingAvailable: true,
    avatarUrl: 'https://picsum.photos/id/1005/200/200',
    citationCount: 15400,
    hIndex: 85,
    verified: true,
    openToIndustry: true,
    activeProjects: ['Consciousness Priors in AI', 'Causal Representation Learning'],
    education: [
      { id: 'e1', degree: 'PhD in Computer Science', institution: 'MIT', yearStart: '1998', yearEnd: '2002' },
      { id: 'e2', degree: 'MSc in Artificial Intelligence', institution: 'University of Toronto', yearStart: '1996', yearEnd: '1998' }
    ],
    papers: [
      { id: 'pa1', title: 'Attention Is All You Need (Revisited)', journal: 'NeurIPS', year: 2023, citations: 450 },
      { id: 'pa2', title: 'Deep Learning in Low-Resource Settings', journal: 'ICML', year: 2022, citations: 120 },
      { id: 'pa3', title: 'Biological Constraints in Neural Networks', journal: 'Nature Machine Intelligence', year: 2021, citations: 89 }
    ]
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
    bio: 'Preserving the past through the lens of modern digital humanities. I specialize in the narrative structures of 14th-century frescos.',
    acceptingStudents: true,
    fundingAvailable: false,
    avatarUrl: 'https://picsum.photos/id/1011/200/200',
    citationCount: 1200,
    hIndex: 24,
    verified: true,
    openToIndustry: false,
    activeProjects: ['Digital Preservation of Gothic Frescos'],
    education: [
      { id: 'e3', degree: 'PhD in Art History', institution: 'École du Louvre', yearStart: '2005', yearEnd: '2009' }
    ],
    papers: [
      { id: 'pa4', title: 'The Painted Word: Medieval Frescos', journal: 'Art History Journal', year: 2018, citations: 45 },
      { id: 'pa5', title: 'Digital Archiving of Fragile Manuscripts', journal: 'Journal of Cultural Heritage', year: 2020, citations: 32 }
    ]
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
    bio: 'Engineering the next generation of gene therapies. We focus on non-liver tissue delivery for CRISPR systems.',
    acceptingStudents: false,
    fundingAvailable: true, // Has funding for postdocs maybe, but not students
    avatarUrl: 'https://picsum.photos/id/1025/200/200',
    citationCount: 8900,
    hIndex: 62,
    verified: true,
    openToIndustry: true,
    activeProjects: ['Lipid Nanoparticle Delivery Systems', 'Cas9 Off-target Detection'],
    education: [
      { id: 'e4', degree: 'PhD in Biochemistry', institution: 'Stanford University', yearStart: '2010', yearEnd: '2014' },
      { id: 'e5', degree: 'BS in Biology', institution: 'UC Berkeley', yearStart: '2006', yearEnd: '2010' }
    ],
    papers: [
      { id: 'pa6', title: 'High-efficiency LNP delivery', journal: 'Nature Biotechnology', year: 2024, citations: 156 },
      { id: 'pa7', title: 'Off-target effects in Cas9', journal: 'Science', year: 2021, citations: 890 }
    ]
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
    verified: false,
    openToIndustry: true,
    activeProjects: ['Spiking Neural Networks for Prosthetics'],
    education: [
       { id: 'e6', degree: 'PhD in Neuroscience', institution: 'University of Oxford', yearStart: '2015', yearEnd: '2019' }
    ],
    papers: [
       { id: 'pa8', title: 'Plasticity in SNNs', journal: 'Neural Computation', year: 2022, citations: 45 }
    ]
  }
];

export const MOCK_CORPORATES: CorporateProfile[] = [
  {
    id: 'c1',
    name: 'DeepMind Research',
    industry: 'Artificial Intelligence',
    description: 'Solving intelligence to advance science and benefit humanity.',
    location: {
      city: 'London',
      country: 'UK'
    },
    websiteUrl: 'https://deepmind.google',
    avatarUrl: 'https://picsum.photos/id/1033/200/200'
  },
  {
    id: 'c2',
    name: 'Pfizer R&D',
    industry: 'Biotechnology & Pharmaceuticals',
    description: 'Delivering breakthroughs that change patients\' lives through science.',
    location: {
      city: 'New York',
      country: 'USA'
    },
    websiteUrl: 'https://www.pfizer.com',
    avatarUrl: 'https://picsum.photos/id/1035/200/200'
  }
];

export const MOCK_GRANTS: GrantOpportunity[] = [
  {
    id: 'g1',
    title: 'AI Safety Research Grant',
    organizationName: 'DeepMind Research',
    description: 'Funding for projects focusing on interpretability and alignment in large language models.',
    amount: '$100,000',
    deadline: '2024-12-31',
    tags: ['AI Safety', 'Machine Learning', 'Ethics'],
    applyLink: '#'
  },
  {
    id: 'g2',
    title: 'Sustainable Energy Fellowship',
    organizationName: 'Tesla',
    description: 'Supporting novel research in battery chemistry and grid storage efficiency.',
    amount: '$75,000',
    deadline: '2024-10-15',
    tags: ['Energy', 'Materials Science', 'Engineering'],
    applyLink: '#'
  },
  {
    id: 'g3',
    title: 'Medieval History Preservation Fund',
    organizationName: 'UNESCO',
    description: 'Grants for the digitalization and conservation of endangered historical manuscripts.',
    amount: '€50,000',
    deadline: '2024-11-30',
    tags: ['History', 'Digital Humanities', 'Conservation'],
    applyLink: '#'
  }
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    author: MOCK_SCHOLARS[0], // Dr. Tremblay
    type: 'paper_share',
    content: "Excited to share our latest preprint on 'System 2 Attention in Large Language Models'. We explore how deliberate reasoning steps can reduce hallucinations in generated text. Feedback welcome!",
    timestamp: "2h ago",
    metrics: { likes: 342, comments: 45, shares: 120 },
    relatedLink: {
      title: "Read the Preprint on arXiv",
      url: "#"
    }
  },
  {
    id: 'p2',
    author: MOCK_CORPORATES[0], // DeepMind
    type: 'grant_post',
    content: "We are launching a new $100k research fund for AI Safety and Alignment. We are looking for academic partners to help us solve the black box problem.",
    timestamp: "5h ago",
    metrics: { likes: 1205, comments: 89, shares: 400 },
    relatedLink: {
      title: "View Application Details",
      url: "#"
    }
  },
  {
    id: 'p3',
    author: MOCK_SCHOLARS[1], // Dr. Laurent
    type: 'project_update',
    content: "Just arrived in Avignon for field work! We will be digitizing the Papal Palace archives using new multispectral imaging techniques. Looking for PhD students interested in Digital Humanities to join us next semester.",
    timestamp: "1d ago",
    metrics: { likes: 89, comments: 12 },
  },
  {
    id: 'p4',
    author: MOCK_SCHOLARS[2], // Dr. Chen
    type: 'paper_share',
    content: "Our work on lipid nanoparticle delivery is finally out in Nature Biotechnology! Huge thanks to the whole team at Rockefeller. This could change how we treat genetic disorders.",
    timestamp: "2d ago",
    metrics: { likes: 890, comments: 156, shares: 310 },
    relatedLink: {
      title: "Nature Biotech: LNP Delivery Mechanisms",
      url: "#"
    }
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