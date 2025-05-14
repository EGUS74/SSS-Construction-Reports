
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle, XCircle, Eye, Send, MessageSquare } from "lucide-react";
import type { DailyReport } from "@/types";
import { format, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/contexts/AppContext";
import { DetailedReportView } from "@/components/report/DetailedReportView";
import { handleDownloadPdf, handleDownloadExcel } from "@/lib/reportUtils";

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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    const updatedReport = { ...report, status: newStatus, pmComments: pmComments || report.pmComments };
    // Update mock data
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
  

  if (role !== "admin") return null;

  if (!report) {
    return <div className="container mx-auto py-8 text-center">Loading report details or report not found...</div>;
  }


  return (
    <div className="container mx-auto py-4 px-2 md:px-4">
      <Button variant="outline" onClick={() => router.back()} className="mb-4 print:hidden">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Reports
      </Button>

      <DetailedReportView 
        report={report} 
        onDownloadPdf={() => handleDownloadPdf(report.id)}
        onDownloadExcel={() => handleDownloadExcel(report)}
      />

      {/* PM Comments and Actions Section - outside DetailedReportView for admin page specific logic */}
      <Card className="w-full max-w-4xl mx-auto mt-6 shadow-lg print:hidden">
        <CardHeader>
          <CardTitle>Project Manager Actions</CardTitle>
          <CardDescription>Review the report and provide comments or change its status.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
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
