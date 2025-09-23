'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState, useTransition } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { HerbFormSchema, type HerbFormValues } from '@/lib/schemas';
import { createHerbRecordAndGenerateReport } from '@/app/actions';
import { Loader2, MapPin } from 'lucide-react';

export function HerbForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<HerbFormValues>({
    resolver: zodResolver(HerbFormSchema),
    defaultValues: {
      herbName: '',
      batchId: '',
      sourceLocation: '',
      collectionTimestamp: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      photo: undefined,
      processingDetails: '',
      supplierDetails: '',
      manufacturerDetails: '',
    },
  });

  const photoRef = form.register('photo');

  function onSubmit(data: HerbFormValues) {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'photo') {
          formData.append(key, value[0]);
        } else {
          formData.append(key, value as string);
        }
      });

      try {
        await createHerbRecordAndGenerateReport(formData);
        toast({
          title: 'Generating Report',
          description: 'Please wait while we create the herb origin report.',
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Submission Failed',
          description: error instanceof Error ? error.message : 'An unknown error occurred.',
        });
      }
    });
  }

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          form.setValue('sourceLocation', `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`, {
            shouldValidate: true,
          });
          toast({
            title: 'Location Captured',
            description: 'GPS coordinates have been successfully recorded.',
          });
        },
        (error) => {
          toast({
            variant: 'destructive',
            title: 'Location Error',
            description: `Could not get location: ${error.message}`,
          });
        }
      );
    } else {
      toast({
        variant: 'destructive',
        title: 'Unsupported',
        description: 'Geolocation is not supported by this browser.',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="herbName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Herb Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Ashwagandha" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="batchId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Batch ID</FormLabel>
                <FormControl>
                  <Input placeholder="Unique identifier for the batch" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="sourceLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source Location (GPS)</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input placeholder="e.g., 18.5204, 73.8567" {...field} />
                </FormControl>
                <Button type="button" variant="outline" onClick={handleGetLocation}>
                  <MapPin className="mr-2 h-4 w-4" /> Get
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="collectionTimestamp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Collection Timestamp</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="photo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Herb Photo</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  {...photoRef}
                  onChange={(e) => {
                    field.onChange(e.target.files);
                    if (e.target.files && e.target.files[0]) {
                      setPreview(URL.createObjectURL(e.target.files[0]));
                    } else {
                      setPreview(null);
                    }
                  }}
                />
              </FormControl>
              <FormDescription>Upload a clear photo of the collected herb batch.</FormDescription>
              <FormMessage />
              {preview && (
                <div className="mt-4 relative w-full h-64 rounded-lg border overflow-hidden">
                  <Image src={preview} alt="Herb preview" layout="fill" objectFit="cover" />
                </div>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="processingDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Processing Details</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the initial processing steps (drying, cleaning, etc.)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="supplierDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supplier Details</FormLabel>
              <FormControl>
                <Textarea placeholder="Information about the supplier or distributor" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="manufacturerDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Manufacturer Details</FormLabel>
              <FormControl>
                <Textarea placeholder="Information about the final product manufacturer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" size="lg" disabled={isPending} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          {isPending ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Report...</>
          ) : (
            'Create Record & Generate Report'
          )}
        </Button>
      </form>
    </Form>
  );
}
