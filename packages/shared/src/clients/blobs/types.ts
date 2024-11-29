import { z } from 'zod'

const Blob = z.object({
  kzg_commitment: z.string(),
  data: z.string(),
})
export type Blob = z.infer<typeof Blob>

export const BlockSidecarSchema = z.object({
  data: z.array(
    z.object({
      kzg_commitment: z.string(),
      blob: z.string(),
    }),
  ),
})

export interface BlobsInBlock {
  blobs: Blob[]
  blockNumber: number
}

export const RpcErrorSchema = z.object({
  error: z.object({
    message: z.string(),
  }),
})

export const BeaconChainErrorSchema = z.object({
  code: z.number(),
  message: z.string(),
})

export const ErrorSchema = z.union([RpcErrorSchema, BeaconChainErrorSchema])

export const TxWithBlobsSchema = z.object({
  blockNumber: z.string(),
  type: z.string(),
  blobVersionedHashes: z.array(z.string()).optional(),
})

export const BlockWithParentBeaconBlockRootSchema = z.object({
  parentBeaconBlockRoot: z.string(),
})
