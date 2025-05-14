"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, CalendarDays, MapPinIcon, CloudSun, Users2, Truck, Package, TrendingUp, AlertTriangle, Camera, PenLine, CheckCircle, Timer, Eye, MessageSquare, FileText } from "lucide-react";
import type { DailyReport } from "@/types";
import { format, parseISO } from "date-fns";
import Image from "next/image";
import { useAppContext } from "@/contexts/AppContext";

// Mock data - in a real app, this would come from an API
const mockReports: DailyReport[] = [
   {
    id: "REP-1678886400000",
    projectId: "PJ-1023",
    gpsLocation: "Site A, Coordinates: 34.0522° N, 118.2437° W",
    date: "2023-03-15T00:00:00.000Z",
    weather: "Sunny, 20°C, Wind: 5mph E",
    manpower: "1 Foreman (J. Doe), 2 Operators (A. Smith, B. Jones), 5 Laborers",
    equipmentHours: "Excavator EX200: 8hrs, Crane TC50: 4hrs",
    materialsUsed: "36inch Steel Pipe: 50m, Welding Rods E7018: 20kg, Gravel Type A: 10 tons",
    progressUpdates: "Laid 50m of pipe in Section Alpha. Completed 3 welds. Site clearing ongoing for Section Bravo. Trench depth achieved: 8ft.",
    risksIssues: "None reported today. All safety checks passed.",
    photoDataUri: "https://placehold.co/600x400.png", // Placeholder
    photoFileName: "site_progress_20230315.jpg",
    digitalSignature: "John Doe",
    timestamp: "2023-03-15T17:00:00.000Z",
    status: "Approved",
    foremanName: "John Doe",
    generatedReport: "Generated full report text will appear here...",
    reportSummary: "Key observations: 50m pipe laid, 3 welds completed. No issues.",
    pmComments: "Good progress, John. Keep up the detailed reporting."
  },
   {
    id: "REP-1678972800000",
    projectId: "PJ-1024",
    gpsLocation: "Site B, Near River Crossing Point X",
    date: "2023-03-16T00:00:00.000Z",
    weather: "Cloudy, 18°C, Intermittent Drizzle",
    manpower: "1 Foreman (J. Doe), 1 Operator (C. Brown), 4 Laborers",
    equipmentHours: "Backhoe BH100: 6hrs, Dewatering Pump DP05: 3hrs",
    materialsUsed: "24inch HDPE Pipe: 30m, Fusion Couplers: 5 units, Silt Fence: 100ft",
    progressUpdates: "Installed 2 valves at station 5. Hydrotesting preparation for pipeline segment Alpha completed. Some delays due to muddy conditions from drizzle. Trenching for next segment at 40% completion.",
    risksIssues: "Minor delay (approx 1.5 hours) due to weather making access difficult. Implemented additional erosion control measures (silt fence).",
    photoDataUri: "https://placehold.co/600x400.png",
    photoFileName: "valve_installation_20230316.jpg",
    digitalSignature: "John Doe",
    timestamp: "2023-03-16T18:00:00.000Z",
    status: "Reviewed",
    foremanName: "John Doe",
    generatedReport: "Full AI generated report for REP-1678972800000...",
    reportSummary: "Key observations: 2 valves installed, hydrotesting prep complete. Minor weather delays.",
    pmComments: "Thanks for the update on weather impact. Please monitor soil stability."
  },
];


const detailItems = [
  { label: "Project ID", key: "projectId", icon: FileText },
  { label: "GPS Location", key: "gpsLocation", icon: MapPinIcon },
  { label: "Date", key: "date", icon: CalendarDays, format: (val: string) => format(parseISO(val), "PPP") },
  { label: "Weather", key: "weather", icon: CloudSun },
  { label: "Manpower", key: "manpower", icon: Users2 },
  { label: "Equipment & Hours", key: "equipmentHours", icon: Truck },
  { label: "Materials Used", key: "materialsUsed", icon: Package },
  { label: "Progress Updates", key: "progressUpdates", icon: TrendingUp, isTextArea: true },
  { label: "Risks & Issues", key: "risksIssues", icon: AlertTriangle, isTextArea: true },
  { label: "Foreman Signature", key: "digitalSignature", icon: PenLine },
  { label: "Submission Time", key: "timestamp", icon: Timer, format: (val: string) => format(parseISO(val), "PPP p") },
];

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<DailyReport | null>(null);
  const { role } = useAppContext();

  useEffect(() => {
    if (role && role !== "foreman") {
      router.push("/"); 
    }
  }, [role, router]);

  useEffect(() => {
    if (params.reportId) {
      const foundReport = mockReports.find(r => r.id === params.reportId);
      setReport(foundReport || null);
    }
  }, [params.reportId]);

  const getStatusChip = (status: DailyReport["status"]) => {
    let bgColor = "bg-gray-200";
    let textColor = "text-gray-800";
    let IconComponent = Timer; // Default Icon

    if (status === "Submitted") { bgColor = "bg-yellow-100"; textColor = "text-yellow-800"; IconComponent = Timer; }
    else if (status === "Reviewed") { bgColor = "bg-blue-100"; textColor = "text-blue-800"; IconComponent = Eye; }
    else if (status === "Approved") { bgColor = "bg-green-100"; textColor = "text-green-800"; IconComponent = CheckCircle; }
    else if (status === "Rejected") { bgColor = "bg-red-100"; textColor = "text-red-800"; IconComponent = AlertTriangle; }
    
    return (
      <div className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-full font-medium ${bgColor} ${textColor}`}>
        <IconComponent className="h-5 w-5" />
        Status: {status}
      </div>
    );
  };

  if (role !== "foreman") return null;

  if (!report) {
    return <div className="container mx-auto py-8 text-center">Loading report details or report not found...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Reports
      </Button>

      <Card className="w-full shadow-lg">
        <CardHeader className="border-b">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <CardTitle className="text-3xl font-bold">Report Details: {report.id}</CardTitle>
            {getStatusChip(report.status)}
          </div>
          <CardDescription className="mt-1">Submitted by {report.foremanName} on {format(parseISO(report.timestamp), "PPP")}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {detailItems.map(item => (
            <div key={item.key} className={item.isTextArea ? "md:col-span-2" : ""}>
              <h3 className="text-sm font-medium text-muted-foreground flex items-center mb-1">
                <item.icon className="mr-2 h-5 w-5 text-primary" />
                {item.label}
              </h3>
              {item.isTextArea ? (
                 <ScrollArea className="h-24 w-full rounded-md border p-3 bg-slate-50 text-sm">
                    <pre className="whitespace-pre-wrap font-sans">{report[item.key as keyof DailyReport] as string || "N/A"}</pre>
                 </ScrollArea>
              ) : (
                 <p className="text-base">
                   {item.format ? item.format(report[item.key as keyof DailyReport] as string) : report[item.key as keyof DailyReport] as string || "N/A"}
                 </p>
              )}
            </div>
          ))}
          
          {report.photoDataUri && (
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center mb-1">
                <Camera className="mr-2 h-5 w-5 text-primary" /> Attached Photo
              </h3>
              <div className="mt-2 border rounded-lg overflow-hidden aspect-video relative max-w-lg">
                 <Image 
                    src={report.photoDataUri} 
                    alt={report.photoFileName || "Site photo"} 
                    layout="fill"
                    objectFit="contain"
                    data-ai-hint="construction site"
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
              <ScrollArea className="h-[100px]">
                <p className="text-sm">{report.reportSummary}</p>
              </ScrollArea>
            </div>
          )}

           {report.generatedReport && (
            <div className="md:col-span-2 p-4 border rounded-md bg-secondary/30">
              <h3 className="font-semibold text-lg mb-2 flex items-center">
                <FileText className="mr-2 h-5 w-5" /> AI Generated Full Report Draft
              </h3>
              <ScrollArea className="h-[200px]">
                <pre className="text-xs whitespace-pre-wrap">{report.generatedReport}</pre>
              </ScrollArea>
            </div>
          )}
          
          {report.pmComments && (
             <div className="md:col-span-2 p-4 border rounded-md bg-amber-50 border-amber-200">
              <h3 className="font-semibold text-lg mb-2 flex items-center text-amber-700">
                <MessageSquare className="mr-2 h-5 w-5" /> Project Manager's Comments
              </h3>
              <ScrollArea className="h-[100px]">
                <p className="text-sm">{report.pmComments}</p>
              </ScrollArea>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-6">
           {/* Potential actions for foreman, e.g., "Request Clarification" if status is Rejected */}
           <p className="text-xs text-muted-foreground">This report is currently {report.status.toLowerCase()}.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
