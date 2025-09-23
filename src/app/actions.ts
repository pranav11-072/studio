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
    const herbName = rawFormData.herbName as string;
    const batchId = rawFormData.batchId as string;
    const sourceLocation = rawFormData.sourceLocation as string;
    const collectionTimestampInput = rawFormData.collectionTimestamp as string;
    const processingDetails = rawFormData.processingDetails as string;
    const supplierDetails = rawFormData.supplierDetails as string;
    const manufacturerDetails = rawFormData.manufacturerDetails as string;

    if (
      !herbName ||
      !batchId ||
      !sourceLocation ||
      !collectionTimestampInput ||
      !processingDetails ||
      !supplierDetails ||
      !manufacturerDetails ||
      !photoFile ||
      photoFile.size === 0
    ) {
      throw new Error('All fields are required.');
    }

    const collectionTimestamp = new Date(collectionTimestampInput).toISOString();

    const reportInput: GenerateHerbalOriginReportInput = {
      herbName: herbName,
      batchId: batchId,
      sourceLocation: sourceLocation,
      collectionTimestamp: collectionTimestamp,
      processingDetails: processingDetails,
      supplierDetails: supplierDetails,
      manufacturerDetails: manufacturerDetails,
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
