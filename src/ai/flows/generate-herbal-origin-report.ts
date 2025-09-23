'use server';
/**
 * @fileOverview Generates a comprehensive herbal origin report using AI.
 *
 * - generateHerbalOriginReport - A function that generates the herbal origin report.
 * - GenerateHerbalOriginReportInput - The input type for the generateHerbalOriginReport function.
 * - GenerateHerbalOriginReportOutput - The return type for the generateHerbalOriginReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateHerbalOriginReportInputSchema = z.object({
  herbName: z.string().describe('The name of the herb.'),
  batchId: z.string().describe('The unique batch ID of the herb.'),
  sourceLocation: z.string().describe('The GPS coordinates of the herb collection site.'),
  collectionTimestamp: z.string().describe('The timestamp of the herb collection.'),
  photoDataUri: z
    .string()
    .describe(
      "A photo of the herb, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  processingDetails: z.string().describe('Details about the herb processing.'),
  supplierDetails: z.string().describe('Details about the supplier.'),
  manufacturerDetails: z.string().describe('Details about the manufacturer.'),
});
export type GenerateHerbalOriginReportInput = z.infer<typeof GenerateHerbalOriginReportInputSchema>;

const GenerateHerbalOriginReportOutputSchema = z.object({
  report: z.string().describe('The comprehensive herbal origin report.'),
});
export type GenerateHerbalOriginReportOutput = z.infer<typeof GenerateHerbalOriginReportOutputSchema>;

export async function generateHerbalOriginReport(
  input: GenerateHerbalOriginReportInput
): Promise<GenerateHerbalOriginReportOutput> {
  return generateHerbalOriginReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHerbalOriginReportPrompt',
  input: {schema: GenerateHerbalOriginReportInputSchema},
  output: {schema: GenerateHerbalOriginReportOutputSchema},
  prompt: `You are an AI assistant specializing in generating herbal origin reports.

  Based on the information provided, create a comprehensive report detailing the origin,
  processing, and supply chain history of the herb.

  Herb Name: {{{herbName}}}
  Batch ID: {{{batchId}}}
  Source Location: {{{sourceLocation}}}
  Collection Timestamp: {{{collectionTimestamp}}}
  Photo: {{media url=photoDataUri}}
  Processing Details: {{{processingDetails}}}
  Supplier Details: {{{supplierDetails}}}
  Manufacturer Details: {{{manufacturerDetails}}}

  Write a detailed report about the herb's journey from origin to manufacturing, including all available details.
  The report should be easy to read and understand by a consumer.
`,
});

const generateHerbalOriginReportFlow = ai.defineFlow(
  {
    name: 'generateHerbalOriginReportFlow',
    inputSchema: GenerateHerbalOriginReportInputSchema,
    outputSchema: GenerateHerbalOriginReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
