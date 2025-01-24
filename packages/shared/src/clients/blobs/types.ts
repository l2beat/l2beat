import { z } from 'zod'

export const Blob = z.object({
  kzg_commitment: z.string(),
  data: z.string(),
})

export const BlockSidecarSchema = z.object({
  data: z.array(
    z.object({
      kzg_commitment: z.string(),
      blob: z.string(),
    }),
  ),
})

export const BeaconChainError = z.object({
  code: z.number(),
  message: z.string(),
})

export const TxWithBlobsSchema = z.object({
  blockNumber: z.string(),
  type: z.string(),
  blobVersionedHashes: z.array(z.string()).optional(),
})

export const BlockWithParentBeaconBlockRootSchema = z.object({
  parentBeaconBlockRoot: z.string(),
})

export const RpcResponseSchema = z.object({
  result: z.unknown(),
})
