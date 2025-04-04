
import { useJobContext } from '@/contexts/JobContext';
import JobList from '@/components/JobList';
import JobStats from '@/components/JobStats';

const Index = () => {
  const { jobs } = useJobContext();

  return (
    <div className="container px-4 py-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Job Applications</h1>
        <p className="text-muted-foreground mt-1">
          Keep track of your job hunting journey
        </p>
      </div>
      
      <JobStats />
      <JobList />
    </div>
  );
};

export default Index;
