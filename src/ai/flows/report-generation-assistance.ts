// src/ai/flows/report-generation-assistance.ts
'use server';
/**
 * @fileOverview This file contains a Genkit flow for generating QA-compliant daily reports that include location, time, and weather information.
 *
 * - generateReport - A function that generates the report.
 * - GenerateReportInput - The input type for the generateReport function.
 * - GenerateReportOutput - The return type for the generateReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReportInputSchema = z.object({
  projectID: z.string().describe('The ID of the project.'),
  date: z.string().describe('The date of the report.'),
  location: z.string().describe('The GPS location of the project site.'),
  weather: z.string().describe('The weather conditions at the project site.'),
  manpower: z.string().describe('Details about the manpower present at the site.'),
  equipmentHours: z.string().describe('The number of hours each piece of equipment was used.'),
  materialsUsed: z.string().describe('The materials used during the day.'),
  progressUpdates: z.string().describe('Updates on the progress of the project.'),
  risksIssues: z.string().describe('Any risks or issues encountered during the day.'),
  photoDataUri: z
    .string()
    .describe(
      'A photo from the project site, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
  signature: z.string().describe('The digital signature of the foreman.'),
});
export type GenerateReportInput = z.infer<typeof GenerateReportInputSchema>;

const GenerateReportOutputSchema = z.object({
  report: z.string().describe('The generated QA-compliant daily report.'),
});
export type GenerateReportOutput = z.infer<typeof GenerateReportOutputSchema>;

export async function generateReport(input: GenerateReportInput): Promise<GenerateReportOutput> {
  return generateReportFlow(input);
}

const generateReportPrompt = ai.definePrompt({
  name: 'generateReportPrompt',
  input: {schema: GenerateReportInputSchema},
  output: {schema: GenerateReportOutputSchema},
  prompt: `You are an AI assistant specialized in generating QA-compliant daily reports for underground pipeline projects.

  Given the following information, generate a detailed and well-structured report:

  Project ID: {{{projectID}}}
  Date: {{{date}}}
  Location: {{{location}}}
  Weather Conditions: {{{weather}}}
  Manpower Details: {{{manpower}}}
  Equipment Hours: {{{equipmentHours}}}
  Materials Used: {{{materialsUsed}}}
  Progress Updates: {{{progressUpdates}}}
  Risks/Issues: {{{risksIssues}}}
  Photo: {{media url=photoDataUri}}
  Foreman Signature: {{{signature}}}

  Incorporate the location, time, and weather conditions into the report to provide maximum detail with minimum data entry.
  Ensure the report is QA-compliant and includes all necessary information.
  The final report must be well-formatted and easy to read.
  `,
});

const generateReportFlow = ai.defineFlow(
  {
    name: 'generateReportFlow',
    inputSchema: GenerateReportInputSchema,
    outputSchema: GenerateReportOutputSchema,
  },
  async input => {
    const {output} = await generateReportPrompt(input);
    return output!;
  }
);
