'use server';

import { redirect } from 'next/navigation';
import { generateHerbalOriginReport } from '@/ai/flows/generate-herbal-origin-report';
import type { GenerateHerbalOriginReportInput } from '@/ai/flows/generate-herbal-origin-report';

async function fileToDataUri(file: File): Promise<string> {
  const buffer = new Uint8Array(await file.arrayBuffer());
  let binary = '';
  buffer.forEach(byte => {
    binary += String.fromCharCode(byte);
  });
  const base64 = btoa(binary);
  return `data:${file.type};base64,${base64}`;
}

export async function createHerbRecordAndGenerateReport(formData: FormData) {
  try {
    const photoFile = formData.get('photo') as File | null;
    const herbName = formData.get('herbName') as string | null;
    const batchId = formData.get('batchId') as string | null;
    const sourceLocation = formData.get('sourceLocation') as string | null;
    const collectionTimestampInput = formData.get('collectionTimestamp') as string | null;
    const processingDetails = formData.get('processingDetails') as string | null;
    const supplierDetails = formData.get('supplierDetails') as string | null;
    const manufacturerDetails = formData.get('manufacturerDetails') as string | null;

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

    const photoDataUri = await fileToDataUri(photoFile);

    const reportInput: GenerateHerbalOriginReportInput = {
      herbName,
      batchId,
      sourceLocation,
      collectionTimestamp,
      processingDetails,
      supplierDetails,
      manufacturerDetails,
      photoDataUri,
    };

    const { report } = await generateHerbalOriginReport(reportInput);

    if (!report) {
      throw new Error('Failed to generate report from AI model.');
    }

    // ⚠️ Instead of passing full base64 in URL, pass minimal params
    const params = new URLSearchParams({
      herbName,
      batchId,
      sourceLocation,
      collectionTimestamp,
      processingDetails,
      supplierDetails,
      manufacturerDetails,
      report,
      // If needed, save photoDataUri to DB and pass a reference (photoId)
    });

    redirect(`/report?${params.toString()}`);
  } catch (error) {
    console.error('Action Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    redirect(`/error?message=${encodeURIComponent(errorMessage)}`);
  }
}
