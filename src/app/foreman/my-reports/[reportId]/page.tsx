
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare } from "lucide-react";
import type { DailyReport } from "@/types";
import { useAppContext } from "@/contexts/AppContext";
import { DetailedReportView } from "@/components/report/DetailedReportView";
import { handleDownloadPdf, handleDownloadExcel } from "@/lib/reportUtils";

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
    photoDataUri: "https://placehold.co/600x400.png", 
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
      // This mock data assumes "John Doe" is the current foreman for demo purposes.
      const foundReport = mockReports.find(r => r.id === params.reportId && r.foremanName === "John Doe");
      setReport(foundReport || null);
    }
  }, [params.reportId]);


  if (role !== "foreman") return null;

  if (!report) {
    return <div className="container mx-auto py-8 text-center">Loading report details or report not found...</div>;
  }

  return (
    <div className="container mx-auto py-4 px-2 md:px-4">
      <Button variant="outline" onClick={() => router.back()} className="mb-4 print:hidden">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Reports
      </Button>

      <DetailedReportView 
        report={report}
        onDownloadPdf={() => handleDownloadPdf(report.id)}
        onDownloadExcel={() => handleDownloadExcel(report)}
      />
      
      {/* PM Comments Section for Foreman View */}
      {report.pmComments && (
         <Card className="w-full max-w-4xl mx-auto mt-6 shadow-lg print:hidden">
            <CardHeader>
                <CardTitle className="flex items-center text-amber-700">
                    <MessageSquare className="mr-2 h-5 w-5" /> Project Manager's Comments
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-base">{report.pmComments}</p>
            </CardContent>
            <CardFooter>
                <p className="text-sm text-muted-foreground">This report is currently {report.status.toLowerCase()}. If you have questions, contact your project manager.</p>
            </CardFooter>
         </Card>
      )}
       {!report.pmComments && (
         <Card className="w-full max-w-4xl mx-auto mt-6 shadow-lg print:hidden">
            <CardFooter>
                <p className="text-sm text-muted-foreground">This report is currently {report.status.toLowerCase()}. No comments from project manager yet. If you have questions, contact your project manager.</p>
            </CardFooter>
         </Card>
       )}
    </div>
  );
}
