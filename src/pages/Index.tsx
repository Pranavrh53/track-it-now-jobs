
import { useState } from 'react';
import { useJobContext } from '@/contexts/JobContext';
import { useAuthContext } from '@/contexts/AuthContext';
import JobList from '@/components/JobList';
import JobStats from '@/components/JobStats';
import KanbanBoard from '@/components/KanbanBoard';
import { Button } from '@/components/ui/button';
import { LayoutList, Columns } from 'lucide-react';

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
