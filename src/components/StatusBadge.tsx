
import { Badge } from "@/components/ui/badge";
import { JobStatus } from "@/types/job";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: JobStatus;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'Interview':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'Offer':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <Badge 
      className={cn(
        "font-medium",
        getStatusColor(status),
        className
      )}
      variant="outline"
    >
      {status}
    </Badge>
  );
};

export default StatusBadge;
