import { v } from '@l2beat/validate'

export const Blob = v.object({
  kzg_commitment: v.string(),
  data: v.string(),
})

export const BlockSidecarSchema = v.object({
  data: v.array(
    v.object({
      kzg_commitment: v.string(),
      blob: v.string(),
    }),
  ),
})

export const BeaconChainError = v.object({
  code: v.number(),
  message: v.string(),
})
