import { HerbForm } from '@/components/herb-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Beaker, Factory, Leaf, Link2, MapPin, Package, ScanLine } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const steps = [
  {
    icon: <MapPin className="h-5 w-5" />,
    title: 'Geo-Tagging & Sourcing',
    description: 'Capture GPS, timestamp, and photos at the source.',
  },
  {
    icon: <Link2 className="h-5 w-5" />,
    title: 'Unique Batch ID',
    description: 'Generate a unique QR code for each herb batch as its digital identity.',
  },
  {
    icon: <Package className="h-5 w-5" />,
    title: 'Processing & Supply',
    description: 'Record details of initial processing and supplier information.',
  },
  {
    icon: <Factory className="h-5 w-5" />,
    title: 'Manufacturing',
    description: 'Log the manufacturer who receives the batch for final formulation.',
  },
  {
    icon: <Beaker className="h-5 w-5" />,
    title: 'AI Origin Report',
    description: "Generate a comprehensive, consumer-friendly report on the herb's journey.",
  },
];

export default function RecordHerbPage() {
  return (
    <main className="container mx-auto flex-1 px-4 py-8 md:px-6 lg:py-12">
      <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold font-headline text-primary md:text-5xl">
            Trace Your Herb's Journey
          </h1>
          <p className="mt-4 text-lg text-foreground/80">
            Create an immutable, transparent record for your Ayurvedic herbs. Our system leverages
            blockchain principles and AI to ensure authenticity and quality from source to final
            product.
          </p>
          <Card className="mt-8 bg-card/90 border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <ScanLine className="h-6 w-6" />
                New: Scan & Identify
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 mb-4">
                Not sure what herb you have? Use your camera to take a picture and search for it online.
              </p>
              <Button asChild variant="outline">
                <Link href="/scan">
                  <ScanLine className="mr-2 h-4 w-4" />
                  Scan & Identify Herb
                </Link>
              </Button>
            </CardContent>
          </Card>
          <div className="mt-10 space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {step.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold font-headline">{step.title}</h3>
                  <p className="mt-1 text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-3">
          <Card className="bg-card/90 border-2 border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-headline">New Batch Record</CardTitle>
              <CardDescription>
                Enter the details for a new batch of herbs to create its origin block.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HerbForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
