
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Job, JobFormData, JobStatus } from '@/types/job';
import { toast } from 'sonner';

interface JobContextType {
  jobs: Job[];
  addJob: (jobData: JobFormData) => string;
  updateJob: (id: string, jobData: JobFormData) => void;
  deleteJob: (id: string) => void;
  getJob: (id: string) => Job | undefined;
  getJobsByStatus: (status: JobStatus | 'All') => Job[];
}

const JobContext = createContext<JobContextType | null>(null);

export const useJobContext = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobContext must be used within a JobProvider');
  }
  return context;
};

export const JobProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  
  // Load jobs from localStorage on initial render
  useEffect(() => {
    const storedJobs = localStorage.getItem('jobs');
    if (storedJobs) {
      try {
        setJobs(JSON.parse(storedJobs));
      } catch (error) {
        console.error('Failed to parse jobs from localStorage', error);
        localStorage.removeItem('jobs');
      }
    }
  }, []);
  
  // Save jobs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('jobs', JSON.stringify(jobs));
  }, [jobs]);
  
  const addJob = (jobData: JobFormData): string => {
    const now = new Date().toISOString();
    const newJob: Job = {
      id: crypto.randomUUID(),
      ...jobData,
      createdAt: now,
      updatedAt: now
    };
    
    setJobs(prevJobs => [newJob, ...prevJobs]);
    toast.success('Job application added successfully');
    return newJob.id;
  };
  
  const updateJob = (id: string, jobData: JobFormData) => {
    setJobs(prevJobs => 
      prevJobs.map(job => 
        job.id === id 
        ? { ...job, ...jobData, updatedAt: new Date().toISOString() } 
        : job
      )
    );
    toast.success('Job application updated successfully');
  };
  
  const deleteJob = (id: string) => {
    setJobs(prevJobs => prevJobs.filter(job => job.id !== id));
    toast.success('Job application deleted successfully');
  };
  
  const getJob = (id: string) => {
    return jobs.find(job => job.id === id);
  };
  
  const getJobsByStatus = (status: JobStatus | 'All') => {
    if (status === 'All') return jobs;
    return jobs.filter(job => job.status === status);
  };
  
  return (
    <JobContext.Provider value={{ 
      jobs, 
      addJob, 
      updateJob, 
      deleteJob, 
      getJob,
      getJobsByStatus
    }}>
      {children}
    </JobContext.Provider>
  );
};
