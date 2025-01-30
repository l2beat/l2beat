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
})

export const GetBlobsResponseSchema = z.object({
  blobs: z.array(BlobSchema),
  totalBlobs: z.number().optional(),
})
export type GetBlobsResponseSchema = z.infer<typeof GetBlobsResponseSchema>

export type BlobSchema = z.infer<typeof BlobSchema>

const TransactionSchema = z.object({
  hash: z.string(),
  blockNumber: z.number(),
  blockTimestamp: z.string(),
  blockHash: z.string(),
  index: z.number(),
  from: z.string(),
  to: z.string(),
  maxFeePerBlobGas: z.string(),
  blobGasUsed: z.string(),
  blobAsCalldataGasUsed: z.string(),
  category: z.string().nullable().optional(),
  rollup: z.string().nullable().optional(),
  blobs: z.array(
    z.object({
      versionedHash: z.string(),
      index: z.number(),
    }),
  ),
  block: z.object({
    blobGasPrice: z.string(),
  }),
  blobAsCalldataGasFee: z.string(),
  blobGasBaseFee: z.string(),
  blobGasMaxFee: z.string(),
})

export const GetTransactionsWithBlobsSchema = z.object({
  transactions: z.array(TransactionSchema),
  totalTransactions: z.number(),
})

export type GetTransactionsWithBlobsSchema = z.infer<
  typeof GetTransactionsWithBlobsSchema
>
