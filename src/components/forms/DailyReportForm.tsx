"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, MapPin, ClipboardSignature, CloudSun, Users2, Truck, Package, TrendingUp, AlertTriangle, Camera, PenLine, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { DailyReportFormData, SubmitReportResult } from "@/lib/actions";
import { submitDailyReport } from "@/lib/actions";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/contexts/AppContext";

const formSchema = z.object({
  projectId: z.string().min(3, { message: "Project ID must be at least 3 characters." }),
  gpsLocation: z.string().min(5, { message: "GPS Location is required." }),
  date: z.date({ required_error: "A date for the report is required." }),
  weather: z.string().min(3, { message: "Weather conditions are required." }),
  manpower: z.string().min(10, { message: "Manpower details are required (e.g., 2 foremen, 5 laborers)." }),
  equipmentHours: z.string().min(5, { message: "Equipment hours are required (e.g., Excavator: 8hrs)." }),
  materialsUsed: z.string().min(5, { message: "Materials used are required (e.g., Pipes: 10 units)." }),
  progressUpdates: z.string().min(10, { message: "Progress updates are required." }),
  risksIssues: z.string().min(5, { message: "Describe any risks or issues. Enter 'None' if applicable." }),
  photoDataUri: z.string().optional().refine(val => !val || val.startsWith("data:image/"), {
    message: "Photo must be a valid data URI (e.g., data:image/png;base64,...). This is a placeholder for file upload.",
  }),
  digitalSignature: z.string().min(2, { message: "Foreman's name for signature is required." }),
});

type DailyReportFormValues = z.infer<typeof formSchema>;

interface DailyReportFormProps {
  onFormSubmitSuccess?: (result: SubmitReportResult) => void;
}

export function DailyReportForm({ onFormSubmitSuccess }: DailyReportFormProps) {
  const { toast } = useToast();
  const { setIsLoading, isOffline } = useAppContext();
  const [isSubmitting, setIsSubmittingState] = useState(false);

   const form = useForm<DailyReportFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectId: "",
      gpsLocation: "",
      date: new Date(),
      weather: "",
      manpower: "",
      equipmentHours: "",
      materialsUsed: "",
      progressUpdates: "",
      risksIssues: "",
      photoDataUri: "",
      digitalSignature: "",
    },
  });
  
  // Effect to update context loading state
  useEffect(() => {
    setIsLoading(isSubmitting);
  }, [isSubmitting, setIsLoading]);

  // Handle auto-filling GPS (conceptual, needs browser API permission)
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      // navigator.geolocation.getCurrentPosition(
      //   (position) => {
      //     form.setValue("gpsLocation", `${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`);
      //   },
      //   (error) => {
      //     console.warn("Could not get GPS location:", error.message);
      //     toast({ title: "GPS Info", description: "Could not auto-fetch GPS. Please enter manually.", variant: "default" });
      //   }
      // );
    }
  }, [form, toast]);


  async function onSubmit(values: DailyReportFormValues) {
    setIsSubmittingState(true);

    if (isOffline) {
      // Simulate saving to localStorage for offline use
      const offlineReport = { ...values, date: values.date.toISOString(), timestamp: new Date().toISOString() };
      localStorage.setItem(`offlineReport_${Date.now()}`, JSON.stringify(offlineReport));
      toast({
        title: "Offline Mode",
        description: "Report saved locally. It will be submitted when you're back online.",
        variant: "default",
      });
      setIsSubmittingState(false);
      form.reset(); // Reset form after offline save
      // Potentially call onFormSubmitSuccess with a simulated offline success
      if (onFormSubmitSuccess) {
        onFormSubmitSuccess({
          success: true,
          message: "Report saved offline.",
          submittedData: { ...values, date: values.date.toISOString(), timestamp: new Date().toISOString() }
        });
      }
      return;
    }

    const formDataForAction: DailyReportFormData = {
      ...values,
      date: format(values.date, "yyyy-MM-dd"), // Format date to string for action
      timestamp: new Date().toISOString(),
    };

    try {
      const result = await submitDailyReport(formDataForAction);
      if (result.success) {
        toast({
          title: "Report Submitted!",
          description: result.message,
        });
        form.reset(); // Reset form on successful submission
        if (onFormSubmitSuccess) {
          onFormSubmitSuccess(result);
        }
      } else {
        toast({
          title: "Submission Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      console.error("Submission error:", error);
    } finally {
      setIsSubmittingState(false);
    }
  }

  const formFields = [
    { name: "projectId", label: "Project ID", placeholder: "e.g., PJ-1023-RiverCrossing", icon: ClipboardSignature, description: "Enter the unique identifier for this project." },
    { name: "gpsLocation", label: "GPS Location", placeholder: "e.g., 34.0522° N, 118.2437° W or Site Marker 12B", icon: MapPin, description: "Current GPS coordinates or site location identifier." },
    { name: "date", label: "Date", icon: CalendarIcon, type: "date", description: "Select the date for this report." },
    { name: "weather", label: "Weather Conditions", placeholder: "e.g., Sunny, 25°C, Light Breeze", icon: CloudSun, type: "textarea", description: "Describe the weather throughout the day." },
    { name: "manpower", label: "Manpower Details", placeholder: "e.g., 1 Foreman, 3 Operators, 5 Laborers", icon: Users2, type: "textarea", description: "List the team composition and numbers on site." },
    { name: "equipmentHours", label: "Equipment & Hours", placeholder: "e.g., Excavator D30: 8hrs, Crane M5: 4hrs, Welding Unit: 6hrs", icon: Truck, type: "textarea", description: "List equipment used and total operational hours for each." },
    { name: "materialsUsed", label: "Materials Used", placeholder: "e.g., 36inch Steel Pipe: 120ft, Welding Rods: 50lbs, Gravel: 5 tons", icon: Package, type: "textarea", description: "Quantify materials consumed today." },
    { name: "progressUpdates", label: "Progress Updates", placeholder: "e.g., Laid 100ft of pipe section A. Completed 2 welds. Trenching for section B started.", icon: TrendingUp, type: "textarea", description: "Detail work completed and progress made." },
    { name: "risksIssues", label: "Risks & Issues Encountered", placeholder: "e.g., Minor equipment breakdown (resolved). Unexpected soil type slowed trenching by 1hr. No safety incidents.", icon: AlertTriangle, type: "textarea", description: "Report any identified risks, issues, delays, or safety concerns. State 'None' if none." },
    { name: "photoDataUri", label: "Photo Attachment (Data URI)", placeholder: "data:image/jpeg;base64,... (Optional)", icon: Camera, description: "Paste photo data URI. (This is a placeholder for a real file upload feature)." },
    { name: "digitalSignature", label: "Foreman Signature (Full Name)", placeholder: "Enter your full name", icon: PenLine, description: "Your full name acts as your digital signature for this report." },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formFields.map((fieldInfo) => (
            <FormField
              key={fieldInfo.name}
              control={form.control}
              name={fieldInfo.name as keyof DailyReportFormValues}
              render={({ field }) => (
                <FormItem className={fieldInfo.type === 'textarea' || ['progressUpdates', 'risksIssues', 'materialsUsed'].includes(fieldInfo.name) ? 'md:col-span-2' : ''}>
                  <FormLabel className="flex items-center text-base">
                    <fieldInfo.icon className="mr-2 h-5 w-5 text-primary" />
                    {fieldInfo.label}
                  </FormLabel>
                  <FormControl>
                    {fieldInfo.type === "date" ? (
                       <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value as Date, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value as Date}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    ) : fieldInfo.type === "textarea" ? (
                      <Textarea placeholder={fieldInfo.placeholder} {...field as any} className="min-h-[100px] text-base" />
                    ) : (
                      <Input placeholder={fieldInfo.placeholder} {...field as any} className="text-base" />
                    )}
                  </FormControl>
                  {fieldInfo.description && <FormDescription>{fieldInfo.description}</FormDescription>}
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
        
        <Button type="submit" disabled={isSubmitting} size="lg" className="w-full md:w-auto text-lg py-3 px-6">
          {isSubmitting ? "Submitting..." : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Submit Daily Report
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
