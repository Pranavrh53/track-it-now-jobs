
import { useJobContext } from '@/contexts/JobContext';
import { Card, CardContent } from '@/components/ui/card';
import { JobStatus } from '@/types/job';

const JobStats = () => {
  const { jobs, getJobsByStatus } = useJobContext();
  
  const statusCounts = {
    All: jobs.length,
    Applied: getJobsByStatus('Applied').length,
    Interview: getJobsByStatus('Interview').length,
    Offer: getJobsByStatus('Offer').length,
    Rejected: getJobsByStatus('Rejected').length,
  };

  const getStatusColor = (status: JobStatus | 'All') => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-500';
      case 'Interview':
        return 'bg-amber-500';
      case 'Offer':
        return 'bg-green-500';
      case 'Rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
      {(Object.entries(statusCounts) as [JobStatus | 'All', number][]).map(([status, count]) => (
        <Card key={status} className="overflow-hidden border">
          <div className={`h-1 ${getStatusColor(status)}`} />
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{count}</div>
            <div className="text-sm text-muted-foreground">{status}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default JobStats;
