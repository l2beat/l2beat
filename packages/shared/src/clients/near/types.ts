import { v } from '@l2beat/validate'

export const NearError = v.object({
  error: v.object({
    code: v.number(),
    message: v.string(),
    name: v.string(),
  }),
})

export const ValidatorsList = v.object({
  result: v.object({
    current_validators: v.array(v.object({ stake: v.string() })),
  }),
})
