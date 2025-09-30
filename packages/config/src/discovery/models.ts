import { v } from '@l2beat/validate'

export const pastUpgradesSchema = v.array(
  v.tuple([v.string(), v.string(), v.array(v.string())]),
)
