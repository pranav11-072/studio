'use server';

import { redirect } from 'next/navigation';
import { generateHerbalOriginReport } from '@/ai/flows/generate-herbal-origin-report';
import type { GenerateHerbalOriginReportInput } from '@/ai/flows/generate-herbal-origin-report';

async function fileToDataUri(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  return `data:${file.type};base64,${base64}`;
}

export async function createHerbRecordAndGenerateReport(formData: FormData) {
  try {
    const rawFormData = Object.fromEntries(formData.entries());
    const photoFile = rawFormData.photo as File;

    if (!photoFile || photoFile.size === 0) {
      throw new Error('Photo is required.');
    }

    const collectionTimestamp = new Date(rawFormData.collectionTimestamp as string).toISOString();

    const reportInput: GenerateHerbalOriginReportInput = {
      herbName: rawFormData.herbName as string,
      batchId: rawFormData.batchId as string,
      sourceLocation: rawFormData.sourceLocation as string,
      collectionTimestamp: collectionTimestamp,
      processingDetails: rawFormData.processingDetails as string,
      supplierDetails: rawFormData.supplierDetails as string,
      manufacturerDetails: rawFormData.manufacturerDetails as string,
      photoDataUri: await fileToDataUri(photoFile),
    };

    const { report } = await generateHerbalOriginReport(reportInput);

    if (!report) {
      throw new Error('Failed to generate report from AI model.');
    }

    const params = new URLSearchParams();
    for (const key in reportInput) {
      if (key !== 'photoDataUri') {
        params.set(key, reportInput[key as keyof typeof reportInput]);
      }
    }
    params.set('report', report);
    params.set('photoUrl', reportInput.photoDataUri);

    redirect(`/report?${params.toString()}`);
  } catch (error) {
    console.error('Action Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    redirect(`/error?message=${encodeURIComponent(errorMessage)}`);
  }
}
