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

export const HeaderSchema = v.object({
  data: v.object({
    root: v.string(),
    header: v.object({ message: v.object({ slot: v.string() }) }),
  }),
})

export const ValidatorSchema = v.object({
  balance: v.string(),
  validator: v.object({
    pubkey: v.string(),
    withdrawal_credentials: v.string(),
  }),
})
