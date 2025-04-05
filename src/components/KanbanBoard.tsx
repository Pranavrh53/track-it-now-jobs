
import { useState } from 'react';
import { useJobContext } from '@/contexts/JobContext';
import { Card } from '@/components/ui/card';
import JobCard from '@/components/JobCard';
import { JobStatus } from '@/types/job';

const KanbanBoard = () => {
  const { getJobsByStatus } = useJobContext();
  const statuses: JobStatus[] = ['Applied', 'Interview', 'Offer', 'Rejected'];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statuses.map((status) => {
        const statusJobs = getJobsByStatus(status);
        
        return (
          <div key={status} className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">{status}</h3>
              <span className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                {statusJobs.length}
              </span>
            </div>
            
            <Card className="flex-1 overflow-y-auto p-2 max-h-[calc(100vh-220px)] bg-gray-50 dark:bg-gray-800/50">
              {statusJobs.length > 0 ? (
                <div className="space-y-3">
                  {statusJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-center text-muted-foreground">
                  <p>No jobs in this status</p>
                </div>
              )}
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
