import { z } from 'zod'

// All of these are partial! and not always fulfilled
const DataStorageReferenceSchema = z.object({
  storage: z.string(),
  url: z.string(),
})

export const BlobSchema = z.object({
  commitment: z.string(),
  proof: z.string(),
  size: z.number(),
  versionedHash: z.string(),
  dataStorageReferences: z.array(DataStorageReferenceSchema),
  index: z.number(),
  txHash: z.string(),
  txIndex: z.number(),
  blockHash: z.string(),
  blockNumber: z.number(),
  blockTimestamp: z.string(),
  transaction: z.object({
    from: z.string(),
    to: z.string(),
  }),
})

export const GetBlobsResponseSchema = z.object({
  blobs: z.array(BlobSchema),
  totalBlobs: z.number().optional(),
})
export type GetBlobsResponseSchema = z.infer<typeof GetBlobsResponseSchema>

export type BlobSchema = z.infer<typeof BlobSchema>

export const BlobscanErrorSchema = z.object({
  message: z.string(),
  code: z.string(),
  issues: z.array(z.object({ message: z.string() })),
})
export type BlobscanError = z.infer<typeof BlobscanErrorSchema>
