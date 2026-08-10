import { v } from '@l2beat/validate'

/** What a denylist command plans to insert. `createdAt` is deliberately
 * absent — the database fills it, keeping plan generation deterministic. */
export type TokenDenylistEntryInsert = v.infer<typeof TokenDenylistEntryInsert>
export const TokenDenylistEntryInsert = v.object({
  chain: v.string(),
  address: v.string(),
  reason: v.string(),
})

export type TokenDenylistEntryRecord = v.infer<typeof TokenDenylistEntryRecord>
export const TokenDenylistEntryRecord = v.object({
  chain: v.string(),
  address: v.string(),
  reason: v.string(),
  createdAt: v.number(),
})
