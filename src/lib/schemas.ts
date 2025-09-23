import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const HerbFormSchema = z.object({
  herbName: z.string().min(2, 'Herb name must be at least 2 characters.'),
  batchId: z.string().min(2, 'Batch ID must be at least 2 characters.'),
  sourceLocation: z.string().min(5, 'Source location (GPS coordinates) is required.'),
  collectionTimestamp: z.string().datetime({ message: 'Invalid date and time format.' }),
  photo: z
    .any()
    .refine((files) => files?.length == 1, 'Photo is required.')
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      '.jpg, .jpeg, .png and .webp files are accepted.'
    ),
  processingDetails: z.string().min(10, 'Processing details must be at least 10 characters.'),
  supplierDetails: z.string().min(10, 'Supplier details must be at least 10 characters.'),
  manufacturerDetails: z.string().min(10, 'Manufacturer details must be at least 10 characters.'),
});

export type HerbFormValues = z.infer<typeof HerbFormSchema>;
