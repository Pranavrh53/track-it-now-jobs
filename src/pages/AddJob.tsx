
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobContext } from '@/contexts/JobContext';
import JobForm from '@/components/JobForm';
import { JobFormData } from '@/types/job';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const AddJob = () => {
  const navigate = useNavigate();
  const { addJob } = useJobContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (data: JobFormData) => {
    setIsSubmitting(true);
    
    try {
      const jobId = addJob(data);
      navigate('/');
    } catch (error) {
      console.error('Failed to add job:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container px-4 py-8 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Job Application</h1>
          <p className="text-muted-foreground mt-1">
            Track a new job you've applied for
          </p>
        </div>
        
        <Button 
          onClick={() => navigate('/')} 
          variant="outline" 
          className="self-start"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to List
        </Button>
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <JobForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};

export default AddJob;
