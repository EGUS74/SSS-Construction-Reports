import { config } from 'dotenv';
config();

import '@/ai/flows/daily-report-summary.ts';
import '@/ai/flows/report-generation-assistance.ts';
import '@/ai/flows/summarize-daily-report.ts';
import '@/ai/flows/generate-report-from-prompt.ts';