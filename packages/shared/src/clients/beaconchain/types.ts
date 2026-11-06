import { v } from '@l2beat/validate'

export const BeaconChainError = v.object({
  code: v.number(),
  message: v.string(),
})
