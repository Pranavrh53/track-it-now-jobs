
import { useState } from 'react';
import { useJobContext } from '@/contexts/JobContext';
import JobCard from '@/components/JobCard';
import { JobStatus } from '@/types/job';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Check, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const JobList = () => {
  const { jobs, getJobsByStatus } = useJobContext();
  const [activeStatus, setActiveStatus] = useState<JobStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredJobs = getJobsByStatus(activeStatus).filter(
    job => 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.contactPerson && job.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (job.notes && job.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleStatusChange = (value: string) => {
    setActiveStatus(value as JobStatus | 'All');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Tabs defaultValue="All" className="w-full sm:w-auto" onValueChange={handleStatusChange}>
          <TabsList className="grid grid-cols-3 sm:grid-cols-5 w-full sm:w-auto">
            <TabsTrigger value="All">All</TabsTrigger>
            <TabsTrigger value="Applied">Applied</TabsTrigger>
            <TabsTrigger value="Interview">Interview</TabsTrigger>
            <TabsTrigger value="Offer">Offer</TabsTrigger>
            <TabsTrigger value="Rejected">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          {jobs.length > 0 ? (
            <>
              <Search className="h-12 w-12 text-gray-300 mb-3" />
              <h3 className="text-lg font-medium">No matching jobs found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </>
          ) : (
            <>
              <Check className="h-12 w-12 text-gray-300 mb-3" />
              <h3 className="text-lg font-medium">No job applications yet</h3>
              <p className="text-muted-foreground">
                Add your first job application to get started
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default JobList;
