
export type JobStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected';
export type JobType = 'Full-time' | 'Part-time' | 'Internship' | 'Remote' | 'Contract';
export type ApplicationMethod = 'Company Website' | 'LinkedIn' | 'Indeed' | 'Referral' | 'Email' | 'Other';

export interface Job {
  id: string;
  userId: string;
  title: string;
  company: string;
  applicationDate: string;
  status: JobStatus;
  contactPerson?: string;
  contactEmail?: string;
  notes?: string;
  location?: string;
  salary?: string;
  jobType?: JobType;
  applicationMethod?: ApplicationMethod;
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobFormData {
  title: string;
  company: string;
  applicationDate: string;
  status: JobStatus;
  contactPerson?: string;
  contactEmail?: string;
  notes?: string;
  location?: string;
  salary?: string;
  jobType?: JobType;
  applicationMethod?: ApplicationMethod;
  followUpDate?: string;
}

export interface Company {
  id: string;
  name: string;
}

// Indeed API Integration Types
export interface IndeedJobListing {
  jobId: string;
  employerName: string;
  jobTitle: string;
  locationName: string;
  jobDescription: string;
  postingDate: string;
  salary?: {
    minimum: number;
    maximum: number;
    currencyCode: string;
    timeUnit: string;
  };
  jobType?: string[];
  applyUrl?: string;
}

export interface IndeedSearchParams {
  keyword: string;
  location: string;
  radius?: number;
  page?: number;
  limit?: number;
}

export interface IndeedSearchResponse {
  jobs: IndeedJobListing[];
  totalResults: number;
  currentPage: number;
  totalPages: number;
}
