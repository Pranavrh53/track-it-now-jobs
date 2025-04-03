
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useJobContext } from '@/contexts/JobContext';
import JobForm from '@/components/JobForm';
import { JobFormData } from '@/types/job';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const EditJob = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getJob, updateJob } = useJobContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const job = id ? getJob(id) : undefined;
  
  useEffect(() => {
    if (!job && id) {
      navigate('/');
    }
  }, [job, id, navigate]);
  
  const handleSubmit = (data: JobFormData) => {
    if (!id) return;
    
    setIsSubmitting(true);
    
    try {
      updateJob(id, data);
      navigate('/');
    } catch (error) {
      console.error('Failed to update job:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!job) {
    return null;
  }
  
  return (
    <div className="container px-4 py-8 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Job Application</h1>
          <p className="text-muted-foreground mt-1">
            Update your job application details
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
        <JobForm 
          initialData={job} 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </div>
    </div>
  );
};

export default EditJob;
