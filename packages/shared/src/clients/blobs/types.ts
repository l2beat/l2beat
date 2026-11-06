import { v } from '@l2beat/validate'

export const Blob = v.object({
  data: v.string(),
})

export const BlobsSchema = v.object({
  data: v.array(v.string()),
})

export const GenesisSchema = v.object({
  data: v.object({ genesis_time: v.string() }),
})

export const BeaconChainError = v.object({
  code: v.number(),
  message: v.string(),
})
