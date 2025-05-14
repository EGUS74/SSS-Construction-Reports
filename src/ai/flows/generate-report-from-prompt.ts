// src/ai/flows/generate-report-from-prompt.ts
'use server';
/**
 * @fileOverview This file contains a Genkit flow for generating QA-compliant daily reports from a prompt.
 *
 * - generateReportFromPrompt - A function that generates the report from a prompt.
 * - GenerateReportFromPromptInput - The input type for the generateReportFromPrompt function.
 * - GenerateReportFromPromptOutput - The return type for the generateReportFromPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReportFromPromptInputSchema = z.object({
  prompt: z.string().describe('A prompt describing the day\'s activities.'),
  projectID: z.string().describe('The ID of the project.'),
  date: z.string().describe('The date of the report.'),
  location: z.string().describe('The GPS location of the project site.'),
});
export type GenerateReportFromPromptInput = z.infer<typeof GenerateReportFromPromptInputSchema>;

const GenerateReportFromPromptOutputSchema = z.object({
  report: z.string().describe('The generated QA-compliant daily report.'),
  progress: z.string().describe('A one-sentence summary of the project progress.')
});
export type GenerateReportFromPromptOutput = z.infer<typeof GenerateReportFromPromptOutputSchema>;

export async function generateReportFromPrompt(
  input: GenerateReportFromPromptInput
): Promise<GenerateReportFromPromptOutput> {
  return generateReportFromPromptFlow(input);
}

const generateReportFromPromptPrompt = ai.definePrompt({
  name: 'generateReportFromPromptPrompt',
  input: {schema: GenerateReportFromPromptInputSchema},
  output: {schema: GenerateReportFromPromptOutputSchema},
  prompt: `You are an AI assistant specialized in generating QA-compliant daily reports for underground pipeline projects, based on a short prompt describing the day's activities.

  Given the following information and prompt, generate a detailed and well-structured report:

  Project ID: {{{projectID}}}
  Date: {{{date}}}
  Location: {{{location}}}
  Prompt: {{{prompt}}}

  Incorporate the location and time into the report to provide maximum detail with minimum data entry.
  Ensure the report is QA-compliant and includes all necessary information.
  The final report must be well-formatted and easy to read.
  Also add a progress field, which has one sentence summarizing the day's project progress. This must come from the prompt.
  `,
});

const generateReportFromPromptFlow = ai.defineFlow(
  {
    name: 'generateReportFromPromptFlow',
    inputSchema: GenerateReportFromPromptInputSchema,
    outputSchema: GenerateReportFromPromptOutputSchema,
  },
  async input => {
    const {output} = await generateReportFromPromptPrompt(input);
    return output!;
  }
);
