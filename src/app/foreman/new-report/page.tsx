
"use client";

import { DailyReportForm } from "@/components/forms/DailyReportForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, AlertTriangle } from "lucide-react";
import type { SubmitReportResult } from "@/lib/actions";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppContext } from "@/contexts/AppContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NewReportPage() {
  const [submissionResult, setSubmissionResult] = useState<SubmitReportResult | null>(null);
  const { role } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (role && role !== "foreman") {
      router.push("/"); // Redirect if not a foreman
    }
  }, [role, router]);

  const handleFormSuccess = (result: SubmitReportResult) => {
    setSubmissionResult(result);
  };

  if (role !== "foreman") return null;

  if (submissionResult?.success) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <FileText className="mr-2 h-6 w-6 text-green-500" />
              Daily Log Submitted Successfully!
            </CardTitle>
            <CardDescription>
              {submissionResult.message} (Report ID: {submissionResult.reportId || 'N/A'})
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {submissionResult.submittedData && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Submitted Data Overview:</h3>
                <p><strong>Project ID:</strong> {submissionResult.submittedData.projectId}</p>
                <p><strong>Date:</strong> {submissionResult.submittedData.date}</p>
                <p><strong>Progress:</strong> {submissionResult.submittedData.progressUpdates.substring(0, 100)}...</p>
              </div>
            )}
            {submissionResult.reportSummary && (
              <div className="p-4 border rounded-md bg-muted/50">
                <h3 className="font-semibold text-lg mb-2">AI Generated Summary:</h3>
                <ScrollArea className="h-[100px]">
                  <p className="text-sm">{submissionResult.reportSummary}</p>
                </ScrollArea>
              </div>
            )}
            {submissionResult.generatedReport && (
               <div className="p-4 border rounded-md bg-muted/50">
                <h3 className="font-semibold text-lg mb-2">AI Generated Full Report Draft:</h3>
                <ScrollArea className="h-[200px]">
                  <pre className="text-xs whitespace-pre-wrap">{submissionResult.generatedReport}</pre>
                </ScrollArea>
              </div>
            )}
            <Button onClick={() => { setSubmissionResult(null); router.push('/foreman/new-report'); }} className="mt-4">
              Create Another Daily Log
            </Button>
             <Button variant="outline" onClick={() => router.push('/foreman/my-reports')} className="mt-4 ml-2">
              View My Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight flex items-center">
             <FileText className="mr-3 h-8 w-8 text-primary" />
            Daily Log
          </CardTitle>
          <CardDescription className="text-md">
            Fill in the details for today's activities. Ensure all information is accurate and complete.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DailyReportForm onFormSubmitSuccess={handleFormSuccess} />
        </CardContent>
      </Card>
    </div>
  );
}
