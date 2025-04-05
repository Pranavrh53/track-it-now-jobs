
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { searchIndeedJobs } from '@/services/indeedApi';
import { IndeedJobListing, IndeedSearchParams } from '@/types/job';
import { useJobContext } from '@/contexts/JobContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Briefcase, Building, Calendar, ExternalLink, MapPin, Search as SearchIcon } from 'lucide-react';
import { Pagination } from "@/components/ui/pagination";
import { PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const searchFormSchema = z.object({
  keyword: z.string().min(1, 'Please enter a job title or keyword'),
  location: z.string().min(1, 'Please enter a location'),
  radius: z.string().optional(),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

const Search = () => {
  const navigate = useNavigate();
  const { addJob } = useJobContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useState<IndeedSearchParams | null>(null);

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      keyword: '',
      location: '',
      radius: '25',
    },
  });

  const radiusOptions = [
    { value: '5', label: '5 miles' },
    { value: '10', label: '10 miles' },
    { value: '25', label: '25 miles' },
    { value: '50', label: '50 miles' },
    { value: '100', label: '100 miles' },
  ];

  const { data, isLoading, error } = useQuery({
    queryKey: ['indeedJobs', searchParams, currentPage],
    queryFn: () => 
      searchParams 
        ? searchIndeedJobs({
            ...searchParams,
            page: currentPage,
            limit: 10,
          })
        : Promise.resolve({ jobs: [], totalResults: 0, currentPage: 1, totalPages: 1 }),
    enabled: !!searchParams,
  });

  const onSubmit = (values: SearchFormValues) => {
    setCurrentPage(1);
    setSearchParams({
      keyword: values.keyword,
      location: values.location,
      radius: values.radius ? parseInt(values.radius) : undefined,
    });
  };

  const handleTrackJob = (job: IndeedJobListing) => {
    const jobData = {
      title: job.jobTitle,
      company: job.employerName,
      applicationDate: new Date().toISOString().substring(0, 10),
      status: 'Applied' as const,
      location: job.locationName,
      jobType: job.jobType?.[0] as any || undefined,
      notes: `Job Description:\n${job.jobDescription}\n\nApply URL: ${job.applyUrl || 'Not available'}`,
    };

    const jobId = addJob(jobData);
    
    if (jobId) {
      toast.success('Job added to your tracked applications');
      navigate(`/edit/${jobId}`);
    }
  };

  const formatSalary = (job: IndeedJobListing) => {
    if (!job.salary) return 'Not specified';
    
    const { minimum, maximum, currencyCode, timeUnit } = job.salary;
    const formatAmount = (amount: number) => 
      new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode || 'USD' }).format(amount);
      
    if (minimum === maximum) {
      return `${formatAmount(minimum)} / ${timeUnit.toLowerCase()}`;
    }
    
    return `${formatAmount(minimum)} - ${formatAmount(maximum)} / ${timeUnit.toLowerCase()}`;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="container px-4 py-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Search Job Listings</h1>
        <p className="text-muted-foreground mt-1">
          Find and track new job opportunities
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="keyword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title or Keywords</FormLabel>
                      <FormControl>
                        <Input placeholder="Software Developer, Marketing, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="City, State, or Zip Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="radius"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Search Radius</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select radius" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {radiusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="px-6" 
                  disabled={isLoading}
                >
                  <SearchIcon className="h-4 w-4 mr-2" />
                  Search Jobs
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-muted-foreground">Loading job listings...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-red-500">Error loading jobs. Please try again.</p>
          <p className="text-muted-foreground mt-2">{(error as Error).message}</p>
        </div>
      )}

      {!isLoading && !error && data?.jobs.length === 0 && searchParams && (
        <div className="text-center py-12">
          <SearchIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium">No job listings found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or location
          </p>
        </div>
      )}

      {!isLoading && !error && data?.jobs.length > 0 && (
        <>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * 10 + 1}-{Math.min(currentPage * 10, data.totalResults)} of {data.totalResults} results
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-6">
            {data.jobs.map((job) => (
              <Card key={job.jobId} className="overflow-hidden hover:border-primary/50 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <CardTitle className="text-xl">{job.jobTitle}</CardTitle>
                    <Badge variant="outline" className="sm:text-sm text-xs self-start">
                      <Calendar className="mr-1 h-3 w-3" />
                      Posted: {formatDate(job.postingDate)}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-1">
                    <div className="flex items-center text-muted-foreground">
                      <Building className="h-4 w-4 mr-1" />
                      <span>{job.employerName}</span>
                    </div>

                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{job.locationName}</span>
                    </div>

                    {job.jobType && job.jobType.length > 0 && (
                      <div className="flex items-center text-muted-foreground">
                        <Briefcase className="h-4 w-4 mr-1" />
                        <span>{job.jobType.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pb-3">
                  <div className="text-sm opacity-90 line-clamp-3">
                    {job.jobDescription}
                  </div>

                  <div className="mt-2">
                    <span className="text-sm font-medium">Salary: </span>
                    <span className="text-sm">{formatSalary(job)}</span>
                  </div>
                </CardContent>

                <Separator />

                <CardFooter className="flex justify-between pt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleTrackJob(job)}
                  >
                    Track this job
                  </Button>

                  {job.applyUrl && (
                    <Button 
                      size="sm"
                      onClick={() => window.open(job.applyUrl, '_blank')}
                      className="flex items-center gap-1"
                    >
                      Apply Now
                      <ExternalLink className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          <Pagination className="mb-10">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(current => Math.max(current - 1, 1))}
                  disabled={currentPage <= 1} 
                />
              </PaginationItem>
              <PaginationItem>
                Page {currentPage} of {data.totalPages}
              </PaginationItem>
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(current => current < data.totalPages ? current + 1 : current)}
                  disabled={currentPage >= data.totalPages} 
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
    </div>
  );
};

export default Search;
