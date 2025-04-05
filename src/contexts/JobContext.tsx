
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Job, JobFormData, JobStatus, JobType } from '@/types/job';
import { useAuthContext } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface JobContextType {
  jobs: Job[];
  addJob: (jobData: JobFormData) => string;
  updateJob: (id: string, jobData: JobFormData) => void;
  deleteJob: (id: string) => void;
  getJob: (id: string) => Job | undefined;
  getJobsByStatus: (status: JobStatus | 'All') => Job[];
  getPopularCompanies: () => string[];
  getJobsByType: (jobType: JobType | 'All') => Job[];
  getJobStatistics: () => JobStatistics;
}

interface JobStatistics {
  totalJobs: number;
  jobsByStatus: Record<JobStatus, number>;
  jobsByType: Record<string, number>;
  averageResponseTime: number | null;
  applicationsByMonth: Record<string, number>;
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
  const { authState } = useAuthContext();
  const userId = authState.user?.id || '';
  
  // Load jobs from localStorage on initial render
  useEffect(() => {
    if (!userId) {
      setJobs([]);
      return;
    }
    
    const storedJobs = localStorage.getItem(`jobs_${userId}`);
    if (storedJobs) {
      try {
        setJobs(JSON.parse(storedJobs));
      } catch (error) {
        console.error('Failed to parse jobs from localStorage', error);
        localStorage.removeItem(`jobs_${userId}`);
      }
    }
  }, [userId]);
  
  // Save jobs to localStorage whenever they change
  useEffect(() => {
    if (!userId) return;
    
    localStorage.setItem(`jobs_${userId}`, JSON.stringify(jobs));
  }, [jobs, userId]);
  
  const addJob = (jobData: JobFormData): string => {
    if (!userId) {
      toast.error('You must be logged in to add jobs');
      return '';
    }
    
    const now = new Date().toISOString();
    const newJob: Job = {
      id: crypto.randomUUID(),
      userId,
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

  const getJobsByType = (jobType: JobType | 'All') => {
    if (jobType === 'All') return jobs;
    return jobs.filter(job => job.jobType === jobType);
  };
  
  const getPopularCompanies = () => {
    const companies = jobs.map(job => job.company);
    // Get unique company names
    return [...new Set(companies)];
  };

  const getJobStatistics = () => {
    // Initialize statistics object
    const statistics: JobStatistics = {
      totalJobs: jobs.length,
      jobsByStatus: {
        'Applied': 0,
        'Interview': 0,
        'Offer': 0,
        'Rejected': 0
      },
      jobsByType: {},
      averageResponseTime: null,
      applicationsByMonth: {}
    };

    if (jobs.length === 0) return statistics;

    // Count jobs by status
    jobs.forEach(job => {
      statistics.jobsByStatus[job.status]++;
      
      // Count jobs by type
      if (job.jobType) {
        if (!statistics.jobsByType[job.jobType]) {
          statistics.jobsByType[job.jobType] = 0;
        }
        statistics.jobsByType[job.jobType]++;
      }

      // Group applications by month
      const applicationMonth = job.applicationDate.substring(0, 7); // YYYY-MM
      if (!statistics.applicationsByMonth[applicationMonth]) {
        statistics.applicationsByMonth[applicationMonth] = 0;
      }
      statistics.applicationsByMonth[applicationMonth]++;
    });

    // Calculate average response time for interviews
    const interviewJobs = jobs.filter(job => 
      job.status === 'Interview' || job.status === 'Offer'
    );
    
    if (interviewJobs.length > 0) {
      let totalDays = 0;
      let validResponses = 0;
      
      interviewJobs.forEach(job => {
        const applicationDate = new Date(job.applicationDate);
        const updatedDate = new Date(job.updatedAt);
        const daysDifference = Math.floor((updatedDate.getTime() - applicationDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDifference >= 0) {
          totalDays += daysDifference;
          validResponses++;
        }
      });
      
      if (validResponses > 0) {
        statistics.averageResponseTime = Math.round(totalDays / validResponses);
      }
    }

    return statistics;
  };
  
  return (
    <JobContext.Provider value={{ 
      jobs, 
      addJob, 
      updateJob, 
      deleteJob, 
      getJob,
      getJobsByStatus,
      getPopularCompanies,
      getJobsByType,
      getJobStatistics
    }}>
      {children}
    </JobContext.Provider>
  );
};
