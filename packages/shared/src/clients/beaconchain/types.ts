import { v } from '@l2beat/validate'

export const Blob = v.object({
  data: v.string(),
})

export const BlobsSchema = v.object({
  data: v.array(v.string()),
})

export const BeaconChainError = v.object({
  code: v.number(),
  message: v.string(),
})

export const ForkSchema = v.object({
  data: v.object({ current_version: v.string() }),
})
