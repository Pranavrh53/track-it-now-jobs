
import { useJobContext } from '@/contexts/JobContext';
import { Card, CardContent } from '@/components/ui/card';
import { JobStatus, JobType } from '@/types/job';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const JobStats = () => {
  const { jobs, getJobsByStatus, getJobStatistics } = useJobContext();
  const statistics = getJobStatistics();
  
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

  // Prepare data for chart
  const monthlyData = Object.entries(statistics.applicationsByMonth).map(([month, count]) => {
    // Format month from YYYY-MM to Month name
    const date = new Date(`${month}-01`);
    const monthName = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return {
      name: `${monthName} ${year}`,
      value: count
    };
  }).sort((a, b) => {
    // Sort by date
    return new Date(a.name).getTime() - new Date(b.name).getTime();
  });

  return (
    <div className="space-y-6 mb-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
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

      {jobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Average Response Time */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Average Response Time</h3>
              <div className="text-2xl font-bold">
                {statistics.averageResponseTime !== null ? `${statistics.averageResponseTime} days` : 'N/A'}
              </div>
            </CardContent>
          </Card>

          {/* Job Types Distribution */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Top Job Type</h3>
              <div className="text-2xl font-bold">
                {Object.entries(statistics.jobsByType).length > 0 
                  ? Object.entries(statistics.jobsByType)
                      .sort((a, b) => b[1] - a[1])[0][0]
                  : 'N/A'
                }
              </div>
            </CardContent>
          </Card>

          {/* Most Applied Company */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Total Companies</h3>
              <div className="text-2xl font-bold">
                {new Set(jobs.map(job => job.company)).size}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Monthly Application Chart */}
      {monthlyData.length > 1 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium text-sm text-muted-foreground mb-3">Monthly Applications</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JobStats;
