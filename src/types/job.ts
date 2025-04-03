
export type JobStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected';

export interface Job {
  id: string;
  userId: string; // Added userId to associate jobs with users
  title: string;
  company: string;
  applicationDate: string;
  status: JobStatus;
  contactPerson?: string;
  contactEmail?: string;
  notes?: string;
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
}

export interface Company {
  id: string;
  name: string;
}
