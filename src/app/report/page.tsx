import { Suspense } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { QRCode } from '@/components/qr-code';
import { Beaker, Calendar, Factory, Fingerprint, Leaf, MapPin, Package, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="text-primary pt-1">{icon}</div>
      <div>
        <p className="font-semibold text-muted-foreground">{label}</p>
        <p className="font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function ReportPageContents({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const reportText = (searchParams.report as string) || 'No report generated.';
  const herbName = (searchParams.herbName as string) || 'N/A';
  const batchId = (searchParams.batchId as string) || 'N/A';
  const sourceLocation = (searchParams.sourceLocation as string) || 'N/A';
  const collectionTimestamp = (searchParams.collectionTimestamp as string) || '';
  const processingDetails = (searchParams.processingDetails as string) || 'N/A';
  const supplierDetails = (searchParams.supplierDetails as string) || 'N/A';
  const manufacturerDetails = (searchParams.manufacturerDetails as string) || 'N/A';
  const photoUrl = (searchParams.photoUrl as string) || '';

  const formattedTimestamp = collectionTimestamp
    ? new Date(collectionTimestamp).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    : 'N/A';

  const details = [
    { icon: <Leaf size={20} />, label: 'Herb Name', value: herbName },
    { icon: <Fingerprint size={20} />, label: 'Batch ID', value: batchId },
    { icon: <MapPin size={20} />, label: 'Source Location', value: sourceLocation },
    { icon: <Calendar size={20} />, label: 'Collection Timestamp', value: formattedTimestamp },
  ];

  const supplyChain = [
    { icon: <Package size={20} />, label: 'Processing Details', value: processingDetails },
    { icon: <User size={20} />, label: 'Supplier Details', value: supplierDetails },
    { icon: <Factory size={20} />, label: 'Manufacturer Details', value: manufacturerDetails },
  ];

  return (
    <main className="container mx-auto px-4 py-8 md:px-6 lg:py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold font-headline text-primary mb-2">
          Herb Origin Report
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          A transparent and immutable record for <span className="font-bold text-foreground">{herbName}</span> (Batch: {batchId}).
        </p>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader className='flex-row items-center gap-4 space-y-0'>
                <Beaker className="w-8 h-8 text-primary" />
                <CardTitle className='text-2xl font-headline'>AI-Generated Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-base leading-relaxed text-foreground/90">
                  {reportText}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='font-headline'>Batch Details</CardTitle>
                <CardDescription>Core information recorded at the source.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {details.map(item => <DetailItem key={item.label} {...item} />)}
                </div>
                <Separator className="my-6" />
                <div className="space-y-6">
                    {supplyChain.map(item => <DetailItem key={item.label} {...item} />)}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className='font-headline'>Traceability</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center">
                <QRCode />
                <p className="mt-4 text-sm text-muted-foreground">
                  Scan this QR code to view and verify this herb's complete journey on the blockchain.
                </p>
              </CardContent>
            </Card>
             {photoUrl && (
              <Card>
                <CardHeader>
                  <CardTitle className='font-headline'>Collection Photo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video relative rounded-lg overflow-hidden border">
                    <Image src={photoUrl} alt="Herb collection" layout="fill" objectFit="cover" />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ReportPageWrapper({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <Suspense fallback={<div>Loading report...</div>}>
      <ReportPageContents searchParams={searchParams} />
    </Suspense>
  );
}
