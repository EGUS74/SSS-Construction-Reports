
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CalendarDays, MapPinIcon, CloudSun, Users2, Truck, Package, TrendingUp, AlertTriangle, Camera, PenLine, CheckCircle, XCircle, MessageSquare, FileText, Eye, Send, Timer, ExternalLink } from "lucide-react";
import type { DailyReport } from "@/types";
import { format, parseISO } from "date-fns";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/contexts/AppContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Mock data - in a real app, this would come from an API
const mockReports: DailyReport[] = [
   {
    id: "REP-1678886400000", projectId: "PJ-1023", gpsLocation: "Site A, Coordinates: 34.0522° N, 118.2437° W", date: "2023-03-15T00:00:00.000Z", weather: "Sunny, 20°C, Wind: 5mph E", manpower: "1 Foreman (J. Doe), 2 Operators (A. Smith, B. Jones), 5 Laborers", equipmentHours: "Excavator EX200: 8hrs, Crane TC50: 4hrs", materialsUsed: "36inch Steel Pipe: 50m, Welding Rods E7018: 20kg, Gravel Type A: 10 tons", progressUpdates: "Laid 50m of pipe in Section Alpha. Completed 3 welds. Site clearing ongoing for Section Bravo. Trench depth achieved: 8ft.", risksIssues: "None reported today. All safety checks passed.", photoDataUri: "https://placehold.co/600x400.png", photoFileName: "site_progress_20230315.jpg", digitalSignature: "John Doe", timestamp: "2023-03-15T17:00:00.000Z", status: "Approved", foremanName: "John Doe", generatedReport: "Full AI generated report for REP-1678886400000...", reportSummary: "Key observations: 50m pipe laid, 3 welds completed. No issues.", pmComments: "Good progress, John. Keep up the detailed reporting."
  },
   {
    id: "REP-1678972800000", projectId: "PJ-1024", gpsLocation: "Site B, Near River Crossing Point X", date: "2023-03-16T00:00:00.000Z", weather: "Cloudy, 18°C, Intermittent Drizzle", manpower: "1 Foreman (J. Doe), 1 Operator (C. Brown), 4 Laborers", equipmentHours: "Backhoe BH100: 6hrs, Dewatering Pump DP05: 3hrs", materialsUsed: "24inch HDPE Pipe: 30m, Fusion Couplers: 5 units, Silt Fence: 100ft", progressUpdates: "Installed 2 valves at station 5. Hydrotesting preparation for pipeline segment Alpha completed. Some delays due to muddy conditions from drizzle. Trenching for next segment at 40% completion.", risksIssues: "Minor delay (approx 1.5 hours) due to weather making access difficult. Implemented additional erosion control measures (silt fence).", photoDataUri: "https://placehold.co/600x400.png", photoFileName: "valve_installation_20230316.jpg", digitalSignature: "John Doe", timestamp: "2023-03-16T18:00:00.000Z", status: "Reviewed", foremanName: "John Doe", generatedReport: "Full AI generated report for REP-1678972800000...", reportSummary: "Key observations: 2 valves installed, hydrotesting prep complete. Minor weather delays.", pmComments: ""
  },
  {
    id: "REP-1679059200000", projectId: "PJ-1023", gpsLocation: "Site A", date: "2023-03-17T00:00:00.000Z", weather: "Rainy, 15°C", manpower: "1 Foreman, 3 Laborers", equipmentHours: "Pump: 4hrs", materialsUsed: "Sandbags: 50", progressUpdates: "Work stopped due to heavy rain.", risksIssues: "Work stopped due to heavy rain.", digitalSignature: "Jane Smith", timestamp: "2023-03-17T16:30:00.000Z", status: "Submitted", foremanName: "Jane Smith", generatedReport: "Full AI generated report for REP-1679059200000...", reportSummary: "Key observations: Work stopped due to rain.", pmComments: ""
  },
];

const detailItemsConfig = [
  { label: "Project ID", key: "projectId", icon: FileText },
  // GPS Location will be handled separately for link generation
  { label: "Date", key: "date", icon: CalendarDays, format: (val: string) => format(parseISO(val), "PPP") },
  // Weather will be handled separately
  { label: "Manpower", key: "manpower", icon: Users2, isTextArea: true },
  { label: "Equipment & Hours", key: "equipmentHours", icon: Truck, isTextArea: true },
  { label: "Materials Used", key: "materialsUsed", icon: Package, isTextArea: true },
  { label: "Progress Updates", key: "progressUpdates", icon: TrendingUp, isTextArea: true },
  { label: "Risks & Issues", key: "risksIssues", icon: AlertTriangle, isTextArea: true },
  { label: "Foreman Signature", key: "digitalSignature", icon: PenLine },
  { label: "Submission Time", key: "timestamp", icon: Timer, format: (val: string) => format(parseISO(val), "PPP p") },
];


export default function AdminReportReviewPage() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<DailyReport | null>(null);
  const [pmComments, setPmComments] = useState("");
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);
  const { toast } = useToast();
  const { role, setIsLoading } = useAppContext();

  useEffect(() => {
    if (role && role !== "admin") {
      router.push("/");
    }
  }, [role, router]);

  useEffect(() => {
    if (params.reportId) {
      const foundReport = mockReports.find(r => r.id === params.reportId);
      setReport(foundReport || null);
      if (foundReport?.pmComments) {
        setPmComments(foundReport.pmComments);
      }
    }
  }, [params.reportId]);
  
  useEffect(() => {
    setIsLoading(isSubmittingAction);
  },[isSubmittingAction, setIsLoading]);

  const handleReportAction = async (newStatus: "Approved" | "Rejected" | "Reviewed") => {
    if (!report) return;
    setIsSubmittingAction(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const updatedReport = { ...report, status: newStatus, pmComments: pmComments || report.pmComments };
    const reportIndex = mockReports.findIndex(r => r.id === report.id);
    if (reportIndex !== -1) mockReports[reportIndex] = updatedReport;
    
    setReport(updatedReport);
    setIsSubmittingAction(false);
    toast({
      title: `Report ${newStatus}`,
      description: `Report ${report.id} has been marked as ${newStatus.toLowerCase()}.`,
      variant: newStatus === "Approved" ? "default" : newStatus === "Rejected" ? "destructive" : "default",
    });
  };
  
  const renderGpsLocation = (gpsLocation: string) => {
    const coordsMatch = gpsLocation.match(/Coordinates:\s*([\d.-]+°?\s*[NS]),\s*([\d.-]+°?\s*[EW])/);
    if (coordsMatch) {
      const latStr = coordsMatch[1].replace('° N', 'N').replace('° S', 'S');
      const lonStr = coordsMatch[2].replace('° E', 'E').replace('° W', 'W');
      
      // Convert to decimal if needed, Google Maps can often handle mixed formats
      let lat = parseFloat(latStr);
      let lon = parseFloat(lonStr);

      if (latStr.toUpperCase().includes('S')) lat = -lat;
      if (lonStr.toUpperCase().includes('W')) lon = -lon;
      
      const query = `${lat},${lon}`;
      const url = `https://www.google.com/maps?q=${query}`;
      
      return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center">
          {gpsLocation} <ExternalLink className="ml-1 h-4 w-4" />
        </a>
      );
    }
    return gpsLocation;
  };

  if (role !== "admin") return null;

  if (!report) {
    return <div className="container mx-auto py-8 text-center">Loading report details or report not found...</div>;
  }

  const getStatusChip = (status: DailyReport["status"], timestamp: string) => {
    let bgColor = "bg-gray-200";
    let textColor = "text-gray-800";
    let IconComponent = Timer;

    if (status === "Submitted") { bgColor = "bg-yellow-100"; textColor = "text-yellow-800"; IconComponent = Timer; }
    else if (status === "Reviewed") { bgColor = "bg-blue-100"; textColor = "text-blue-800"; IconComponent = Eye; }
    else if (status === "Approved") { bgColor = "bg-green-100"; textColor = "text-green-800"; IconComponent = CheckCircle; }
    else if (status === "Rejected") { bgColor = "bg-red-100"; textColor = "text-red-800"; IconComponent = AlertTriangle; }
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-full font-medium ${bgColor} ${textColor} cursor-default`}>
              <IconComponent className="h-5 w-5" />
              Status: {status}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Last status update: {format(parseISO(timestamp), "PPP p")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 md:px-6 lg:px-8">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Reports
      </Button>

      <Card className="w-full shadow-lg">
        <CardHeader className="border-b">
           <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <CardTitle className="text-3xl font-bold">Review Report: {report.id}</CardTitle>
             {getStatusChip(report.status, report.timestamp)}
          </div>
          <CardDescription className="mt-1 text-base">Submitted by {report.foremanName} ({report.digitalSignature}) on {format(parseISO(report.timestamp), "PPP")}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
          {/* Special handling for GPS Location */}
          <div>
            <h3 className="text-base font-semibold text-muted-foreground flex items-center mb-1">
              <MapPinIcon className="mr-2 h-5 w-5 text-primary" />
              GPS Location
            </h3>
            <p className="text-lg">{renderGpsLocation(report.gpsLocation)}</p>
          </div>

          {/* Special handling for Weather */}
          <div>
            <h3 className="text-base font-semibold text-muted-foreground flex items-center mb-1">
              <CloudSun className="mr-2 h-5 w-5 text-primary" />
              Weather
            </h3>
            <p className="text-lg">
              {report.weather}
              <span className="block text-sm text-muted-foreground mt-1">
                (Captured approx. {format(parseISO(report.timestamp), "h:mm a")}, Source: Field Observation)
              </span>
            </p>
          </div>
          
          {detailItemsConfig.map(item => (
            <div key={item.key} className={item.isTextArea ? "md:col-span-2" : ""}>
              <h3 className="text-base font-semibold text-muted-foreground flex items-center mb-1">
                <item.icon className="mr-2 h-5 w-5 text-primary" />
                {item.label}
              </h3>
              {item.isTextArea ? (
                 <ScrollArea className="h-32 w-full rounded-md border p-3 bg-slate-50 text-base">
                    <pre className="whitespace-pre-wrap font-sans">{report[item.key as keyof DailyReport] as string || "N/A"}</pre>
                 </ScrollArea>
              ) : (
                 <p className="text-lg">
                   {item.format ? item.format(report[item.key as keyof DailyReport] as string) : report[item.key as keyof DailyReport] as string || "N/A"}
                 </p>
              )}
            </div>
          ))}
          
          {report.photoDataUri && (
            <div className="md:col-span-2">
              <h3 className="text-base font-semibold text-muted-foreground flex items-center mb-1">
                <Camera className="mr-2 h-5 w-5 text-primary" /> Attached Photo
              </h3>
              <div className="mt-2 border rounded-lg overflow-hidden aspect-video relative max-w-lg">
                 <Image 
                    src={report.photoDataUri} 
                    alt={report.photoFileName || "Site photo"} 
                    layout="fill"
                    objectFit="contain"
                    data-ai-hint="site infrastructure"
                 />
              </div>
              {report.photoFileName && <p className="text-xs text-muted-foreground mt-1">{report.photoFileName}</p>}
            </div>
          )}

          {report.reportSummary && (
            <div className="md:col-span-2 p-4 border rounded-md bg-primary/5">
              <h3 className="font-semibold text-lg mb-2 flex items-center text-primary">
                <FileText className="mr-2 h-5 w-5" /> AI Generated Summary
              </h3>
              <ScrollArea className="h-[120px]">
                <p className="text-base">{report.reportSummary}</p>
              </ScrollArea>
            </div>
          )}
          
          {report.generatedReport && (
            <div className="md:col-span-2 p-4 border rounded-md bg-secondary/30">
              <h3 className="font-semibold text-lg mb-2 flex items-center">
                <FileText className="mr-2 h-5 w-5" /> AI Generated Full Report Draft
              </h3>
              <ScrollArea className="h-[250px]">
                <pre className="text-sm whitespace-pre-wrap">{report.generatedReport}</pre>
              </ScrollArea>
            </div>
          )}

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="pmComments" className="text-base font-semibold text-muted-foreground flex items-center">
              <MessageSquare className="mr-2 h-5 w-5 text-primary" />
              Project Manager's Comments
            </Label>
            <Textarea
              id="pmComments"
              value={pmComments}
              onChange={(e) => setPmComments(e.target.value)}
              placeholder="Add comments for the foreman or client..."
              className="min-h-[120px] text-base"
              disabled={report.status === 'Approved' || isSubmittingAction}
            />
          </div>
        </CardContent>

        <CardFooter className="border-t pt-6 flex flex-col md:flex-row justify-end gap-3">
          {report.status !== 'Approved' && report.status !== 'Rejected' && (
            <>
              <Button 
                variant="outline" 
                onClick={() => handleReportAction("Reviewed")} 
                disabled={isSubmittingAction || report.status === 'Reviewed'}
                className="w-full md:w-auto"
              >
                <Eye className="mr-2 h-4 w-4" /> Mark as Reviewed
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => handleReportAction("Rejected")} 
                disabled={isSubmittingAction}
                className="w-full md:w-auto"
              >
                <XCircle className="mr-2 h-4 w-4" /> Reject Report
              </Button>
              <Button 
                onClick={() => handleReportAction("Approved")} 
                disabled={isSubmittingAction}
                className="w-full md:w-auto bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="mr-2 h-4 w-4" /> Approve Report
              </Button>
            </>
          )}
           {(report.status === 'Approved' || report.status === 'Rejected') && (
            <Button 
                onClick={() => { 
                    toast({title: "Action", description: "Client notification functionality not implemented in this demo."});
                }} 
                disabled={isSubmittingAction}
                className="w-full md:w-auto"
              >
                <Send className="mr-2 h-4 w-4" /> Notify Client (Simulated)
              </Button>
           )}
        </CardFooter>
      </Card>
    </div>
  );
}

