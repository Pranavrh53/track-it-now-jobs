
import { Link } from "react-router-dom";
import { Calendar, Building, User, Edit, Trash2, MapPin, DollarSign, Briefcase, Mail } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import { Job } from "@/types/job";
import { useJobContext } from "@/contexts/JobContext";
import { format } from "date-fns";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
  const { deleteJob } = useJobContext();
  
  const formattedDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  // Check if today is past the follow-up date
  const isFollowUpOverdue = () => {
    if (!job.followUpDate) return false;
    const followUpDate = new Date(job.followUpDate);
    const today = new Date();
    return followUpDate < today;
  };

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-md animate-slide-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold line-clamp-1">{job.title}</CardTitle>
          <StatusBadge status={job.status} />
        </div>
        <div className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
          <Building className="h-3.5 w-3.5" />
          <span className="line-clamp-1">{job.company}</span>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="grid gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Applied: {formattedDate(job.applicationDate)}</span>
          </div>
          
          {job.contactPerson && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{job.contactPerson}</span>
            </div>
          )}

          {job.location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-1">
            {job.jobType && (
              <Badge variant="outline" className="text-xs">
                <Briefcase className="h-3 w-3 mr-1" />
                {job.jobType}
              </Badge>
            )}
            
            {job.salary && (
              <Badge variant="outline" className="text-xs">
                <DollarSign className="h-3 w-3 mr-1" />
                {job.salary}
              </Badge>
            )}
            
            {job.applicationMethod && (
              <Badge variant="outline" className="text-xs">
                <Mail className="h-3 w-3 mr-1" />
                {job.applicationMethod}
              </Badge>
            )}
          </div>

          {job.followUpDate && (
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                variant={isFollowUpOverdue() ? "destructive" : "secondary"}
                className="text-xs"
              >
                Follow-up: {formattedDate(job.followUpDate)}
                {isFollowUpOverdue() && " (Overdue)"}
              </Badge>
            </div>
          )}
          
          {job.notes && (
            <div className="mt-2 text-sm line-clamp-2 text-gray-600">
              {job.notes}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          asChild
        >
          <Link to={`/edit/${job.id}`}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Link>
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the job application
                for <span className="font-semibold">{job.title}</span> at <span className="font-semibold">{job.company}</span>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={() => deleteJob(job.id)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
