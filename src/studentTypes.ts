export type GradeLevel = 'Grade 9-10' | 'Grade 11-12' | 'Undergraduate' | 'Postgraduate';

export type InterestCategory =
  | 'all'
  | 'academic_ai'
  | 'nature_environment'
  | 'pets_animals'
  | 'motors_cars'
  | 'sports_athletics'
  | 'entertainment_creative'
  | 'social_leadership'
  | 'space_astrophysics'
  | 'quantum_deeptech'
  | 'biotech_neuro'
  | 'fintech_blockchain'
  | 'clean_energy';

export interface LectureItem {
  id: string;
  title: string;
  subject: string;
  gradeLevel: GradeLevel;
  instructor: {
    name: string;
    title: string;
    avatar: string;
    affiliation: string;
    isVerified?: boolean;
  };
  duration: string;
  videoThumbnail: string;
  slidesUrl?: string;
  category: InterestCategory;
  categoryLabel: string;
  chaptersCount: number;
  studentRating: number;
  enrolledCount: number;
  description: string;
}

export interface AssignmentProject {
  id: string;
  title: string;
  category: InterestCategory;
  categoryLabel: string;
  gradeLevel: GradeLevel;
  description: string;
  teamMembers: {
    name: string;
    avatar: string;
    role: string;
  }[];
  slotsOpen: number;
  deadline: string;
  tasksCount: {
    total: number;
    completed: number;
  };
  aiAssistanceNotes?: string;
  status: 'recruiting' | 'in_progress' | 'review';
  tags: string[];
}

export interface AIStudyRecommendation {
  id: string;
  promptType: 'task_match' | 'peer_note' | 'group_study' | 'project_idea';
  headline: string;
  aiRationale: string;
  actionText: string;
  tags: string[];
  interestCategory: InterestCategory;
}

export interface StudentExpert {
  id: string;
  name: string;
  role: string;
  avatar: string;
  university: string;
  category: InterestCategory;
  categoryLabel: string;
  gradeFocus: string;
  availableHours: string;
  bio: string;
  rating: number;
  sessionsCompleted: number;
  tags: string[];
}

export interface UpcomingHackathon {
  id: string;
  title: string;
  organizer: string;
  logo: string;
  category: InterestCategory;
  categoryLabel: string;
  grantPool: string;
  firstPrize: string;
  incubatorPerks: string[];
  participatingSyndicatesCount: number;
  deadline: string;
  daysLeft: number;
  location: string;
  teamRequirements: string;
  description: string;
  partnerIncubator: string;
  tags: string[];
}

export interface CountryRecommendation {
  id: string;
  field: InterestCategory;
  fieldLabel: string;
  topCountry: string;
  countryFlag: string;
  ranking: number;
  whyBest: string;
  topUniversities: string[];
  topIndustryHubs: string[];
  postStudyWorkVisa: string;
  averageAnnualTuition: string;
  scholarshipOpportunities: string;
  studentFriendlyScore: number;
}

export interface CareerPathRecommendation {
  id: string;
  roleTitle: string;
  category: InterestCategory;
  categoryLabel: string;
  averageStartingSalary: string;
  seniorSalary: string;
  growthOutlook: string;
  description: string;
  topEmployers: string[];
  requiredSkills: string[];
  academicMilestones: {
    level: string;
    milestone: string;
  }[];
}

export interface IndustryProfessional {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  category: InterestCategory;
  categoryLabel: string;
  location: string;
  mentorshipOfferings: string[];
  bio: string;
  isVerified: boolean;
  incubatorPartner: boolean;
  availableSlots: number;
  hourlyRate?: string;
  linkedInUrl?: string;
}
