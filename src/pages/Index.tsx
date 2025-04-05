
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useJobContext } from '@/contexts/JobContext';
import { useAuthContext } from '@/contexts/AuthContext';
import JobList from '@/components/JobList';
import JobStats from '@/components/JobStats';
import KanbanBoard from '@/components/KanbanBoard';
import { Button } from '@/components/ui/button';
import { LayoutList, Columns, Search } from 'lucide-react';

const Index = () => {
  const { jobs } = useJobContext();
  const { authState } = useAuthContext();
  const [viewType, setViewType] = useState<'list' | 'kanban'>('list');

  return (
    <div className="container px-4 py-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Job Applications</h1>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-1">
          <p className="text-muted-foreground">
            {authState.user ? (
              <>Hello <span className="font-medium">{authState.user.email}</span>, keep track of your job hunting journey</>
            ) : (
              'Keep track of your job hunting journey'
            )}
          </p>
          
          <div className="flex space-x-2 mt-3 sm:mt-0">
            <Button 
              size="sm" 
              variant={viewType === 'list' ? 'default' : 'outline'} 
              onClick={() => setViewType('list')}
              className="flex items-center gap-1"
            >
              <LayoutList className="h-4 w-4" />
              List
            </Button>
            <Button 
              size="sm" 
              variant={viewType === 'kanban' ? 'default' : 'outline'} 
              onClick={() => setViewType('kanban')}
              className="flex items-center gap-1"
            >
              <Columns className="h-4 w-4" />
              Kanban
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-900/20 dark:border-blue-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start">
            <Search className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-lg">Find new job opportunities</h3>
              <p className="text-sm text-muted-foreground">
                Search and track job listings from Indeed through our integrated job search feature
              </p>
            </div>
          </div>
          <Button asChild>
            <Link to="/search">
              <Search className="h-4 w-4 mr-1" />
              Search Jobs
            </Link>
          </Button>
        </div>
      </div>
      
      <JobStats />
      
      {viewType === 'list' ? (
        <JobList />
      ) : (
        <KanbanBoard />
      )}
    </div>
  );
};

export default Index;
