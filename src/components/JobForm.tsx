
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Job, JobFormData, JobStatus, JobType, ApplicationMethod } from "@/types/job";
import { format } from 'date-fns';
import { useJobContext } from "@/contexts/JobContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  applicationDate: z.string().min(1, "Application date is required"),
  status: z.enum(["Applied", "Interview", "Offer", "Rejected"]),
  contactPerson: z.string().optional(),
  contactEmail: z.string().email("Invalid email address").optional().or(z.literal('')),
  notes: z.string().optional(),
  location: z.string().optional(),
  salary: z.string().optional(),
  jobType: z.enum(["Full-time", "Part-time", "Internship", "Remote", "Contract"]).optional(),
  applicationMethod: z.enum(["Company Website", "LinkedIn", "Indeed", "Referral", "Email", "Other"]).optional(),
  followUpDate: z.string().optional(),
});

interface JobFormProps {
  initialData?: Job;
  onSubmit: (data: JobFormData) => void;
  isSubmitting: boolean;
}

const JobForm = ({ initialData, onSubmit, isSubmitting }: JobFormProps) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const { getPopularCompanies } = useJobContext();
  const popularCompanies = getPopularCompanies();
  
  const form = useForm<JobFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      company: initialData.company,
      applicationDate: initialData.applicationDate.substring(0, 10),
      status: initialData.status,
      contactPerson: initialData.contactPerson || '',
      contactEmail: initialData.contactEmail || '',
      notes: initialData.notes || '',
      location: initialData.location || '',
      salary: initialData.salary || '',
      jobType: initialData.jobType || undefined,
      applicationMethod: initialData.applicationMethod || undefined,
      followUpDate: initialData.followUpDate?.substring(0, 10) || '',
    } : {
      title: '',
      company: '',
      applicationDate: today,
      status: 'Applied',
      contactPerson: '',
      contactEmail: '',
      notes: '',
      location: '',
      salary: '',
      jobType: undefined,
      applicationMethod: undefined,
      followUpDate: '',
    },
  });

  const statusOptions: JobStatus[] = ['Applied', 'Interview', 'Offer', 'Rejected'];
  const jobTypeOptions: JobType[] = ['Full-time', 'Part-time', 'Internship', 'Remote', 'Contract'];
  const applicationMethodOptions: ApplicationMethod[] = ['Company Website', 'LinkedIn', 'Indeed', 'Referral', 'Email', 'Other'];

  const handleSubmit = (data: JobFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="details">Additional Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title*</FormLabel>
                    <FormControl>
                      <Input placeholder="Software Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company*</FormLabel>
                    {popularCompanies.length > 0 ? (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select or type a company" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {popularCompanies.map((company) => (
                            <SelectItem key={company} value={company}>
                              {company}
                            </SelectItem>
                          ))}
                          <SelectItem value="other">Other (Type below)</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <FormControl>
                        <Input placeholder="Acme Inc." {...field} />
                      </FormControl>
                    )}
                    {field.value === 'other' && (
                      <FormControl>
                        <Input
                          placeholder="Enter company name"
                          className="mt-2"
                          onChange={(e) => form.setValue('company', e.target.value)}
                        />
                      </FormControl>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="applicationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application Date*</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status*</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="jane.doe@example.com" 
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Location</FormLabel>
                    <FormControl>
                      <Input placeholder="New York, NY" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary</FormLabel>
                    <FormControl>
                      <Input placeholder="$80,000 - $100,000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="jobType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {jobTypeOptions.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="applicationMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application Method</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="How did you apply?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {applicationMethodOptions.map((method) => (
                          <SelectItem key={method} value={method}>
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="followUpDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Follow-Up Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Add any additional information about this application..."
                  className="min-h-24"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : initialData ? "Update Job" : "Add Job"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default JobForm;
