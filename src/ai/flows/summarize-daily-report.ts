// 'use server';

/**
 * @fileOverview Summarizes key observations and issues from daily reports for project managers.
 *
 * - generateDailyReportSummary - A function that generates a summary of the daily report.
 * - GenerateDailyReportSummaryInput - The input type for the generateDailyReportSummary function.
 * - GenerateDailyReportSummaryOutput - The return type for the generateDailyReportSummary function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDailyReportSummaryInputSchema = z.object({
  location: z.string().describe('The GPS location of the project site.'),
  projectId: z.string().describe('The ID of the project.'),
  weather: z.string().describe('The weather conditions on the project site.'),
  manpower: z.string().describe('Details about the manpower present on site.'),
  equipmentHours: z.string().describe('The number of hours each piece of equipment was used.'),
  materialsUsed: z.string().describe('A list of materials used on the project site.'),
  progressUpdates: z.string().describe('Updates on the progress of the project.'),
  risksAndIssues: z.string().describe('Any risks or issues encountered on the project site.'),
  photoDataUri: z
    .string()
    .describe(
      "A photo from the site, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  digitalSignature: z.string().describe('The digital signature of the foreman.'),
  timestamp: z.string().describe('The timestamp of the report submission.'),
});

export type GenerateDailyReportSummaryInput = z.infer<typeof GenerateDailyReportSummaryInputSchema>;

const GenerateDailyReportSummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of the key observations and issues from the daily report.'),
  progress: z.string().describe('A one-sentence summary of the project progress.')
});

export type GenerateDailyReportSummaryOutput = z.infer<typeof GenerateDailyReportSummaryOutputSchema>;

export async function generateDailyReportSummary(
  input: GenerateDailyReportSummaryInput
): Promise<GenerateDailyReportSummaryOutput> {
  return generateDailyReportSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dailyReportSummaryPrompt',
  input: {schema: GenerateDailyReportSummaryInputSchema},
  output: {schema: GenerateDailyReportSummaryOutputSchema},
  prompt: `You are an AI assistant summarizing daily reports for underground pipeline projects.

  Given the following information, generate a summary of the key observations and issues.

  GPS Location: {{{location}}}
  Project ID: {{{projectId}}}
  Weather Conditions: {{{weather}}}
  Manpower Details: {{{manpower}}}
  Equipment Hours: {{{equipmentHours}}}
  Materials Used: {{{materialsUsed}}}
  Progress Updates: {{{progressUpdates}}}
  Risks and Issues: {{{risksAndIssues}}}
  Photo: {{media url=photoDataUri}}
  Digital Signature: {{{digitalSignature}}}
  Timestamp: {{{timestamp}}}

  Please provide a concise summary of the key observations and issues from the daily report, and create a progress field, which has one sentence summarizing the day's project progress.
  `,
});

const generateDailyReportSummaryFlow = ai.defineFlow(
  {
    name: 'generateDailyReportSummaryFlow',
    inputSchema: GenerateDailyReportSummaryInputSchema,
    outputSchema: GenerateDailyReportSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
