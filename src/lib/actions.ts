"use server";

import { z } from "zod";
import { generateReport as generateReportFlow, type GenerateReportInput } from "@/ai/flows/report-generation-assistance";
import { generateDailyReportSummary as generateSummaryFlow, type GenerateDailyReportSummaryInput } from "@/ai/flows/daily-report-summary";

// Mimic the DailyReport structure, but for form input. AI flows have their own specific input schemas.
const DailyReportFormSchema = z.object({
  projectId: z.string().min(1, "Project ID is required."),
  gpsLocation: z.string().min(1, "GPS Location is required."),
  date: z.string().min(1, "Date is required."), // Should be validated as date string
  weather: z.string().min(1, "Weather conditions are required."),
  manpower: z.string().min(1, "Manpower details are required."),
  equipmentHours: z.string().min(1, "Equipment hours are required."),
  materialsUsed: z.string().min(1, "Materials used are required."),
  progressUpdates: z.string().min(1, "Progress updates are required."),
  risksIssues: z.string().min(1, "Risks/Issues are required."),
  photoDataUri: z.string().optional().describe("Photo from site as Data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  digitalSignature: z.string().min(1, "Digital signature is required."),
  timestamp: z.string().min(1, "Timestamp is required."), // ISO string
});

export type DailyReportFormData = z.infer<typeof DailyReportFormSchema>;

export interface SubmitReportResult {
  success: boolean;
  message: string;
  reportId?: string;
  generatedReport?: string;
  reportSummary?: string;
  submittedData?: DailyReportFormData;
}

// This placeholder is needed because the AI flow for report generation expects a photo URI.
// In a real app, you'd handle file uploads and convert the image to a base64 data URI.
// For this example, if photoDataUri is not provided, we use a placeholder.
// A 1x1 transparent PNG
const PLACEHOLDER_IMAGE_DATA_URI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";


export async function submitDailyReport(data: DailyReportFormData): Promise<SubmitReportResult> {
  const validation = DailyReportFormSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: "Invalid data: " + validation.error.flatten().fieldErrors };
  }

  try {
    // Prepare data for AI flows
    const reportGenInput: GenerateReportInput = {
      projectID: data.projectId,
      date: data.date, // Assuming date is already in a suitable string format for the AI
      location: data.gpsLocation,
      weather: data.weather,
      manpower: data.manpower,
      equipmentHours: data.equipmentHours,
      materialsUsed: data.materialsUsed,
      progressUpdates: data.progressUpdates,
      risksIssues: data.risksIssues,
      photoDataUri: data.photoDataUri || PLACEHOLDER_IMAGE_DATA_URI,
      signature: data.digitalSignature,
    };

    const summaryGenInput: GenerateDailyReportSummaryInput = {
      location: data.gpsLocation,
      projectId: data.projectId,
      weather: data.weather,
      manpower: data.manpower,
      equipmentHours: data.equipmentHours,
      materialsUsed: data.materialsUsed,
      progressUpdates: data.progressUpdates,
      risksAndIssues: data.risksIssues,
      photoDataUri: data.photoDataUri || PLACEHOLDER_IMAGE_DATA_URI,
      digitalSignature: data.digitalSignature,
      timestamp: data.timestamp,
    };
    
    // Call AI flows
    // Note: These calls might be slow. Consider running them in parallel or a background job in a real app.
    const generatedReportOutput = await generateReportFlow(reportGenInput);
    const summaryOutput = await generateSummaryFlow(summaryGenInput);

    // Simulate saving to a database and getting an ID
    const reportId = `REP-${Date.now()}`; 

    // In a real app, you would store this data in a database.
    // For now, we just return it.
    console.log("Report submitted and AI processing complete:", { reportId, data, generatedReportOutput, summaryOutput });

    return {
      success: true,
      message: "Report submitted and processed successfully!",
      reportId,
      generatedReport: generatedReportOutput.report,
      reportSummary: summaryOutput.summary,
      submittedData: data,
    };

  } catch (error) {
    console.error("Error submitting report or calling AI flows:", error);
    // Check if error is an instance of Error to access message property
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during AI processing.";
    return { success: false, message: `Server error: ${errorMessage}` };
  }
}
