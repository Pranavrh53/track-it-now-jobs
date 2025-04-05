
export type JobStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected';

export interface Job {
  id: string;
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
