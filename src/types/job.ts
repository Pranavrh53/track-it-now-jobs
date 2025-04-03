
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
