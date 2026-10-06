import { v } from '@l2beat/validate'

const ReviewedEvent = v.strictObject({
  timestamp: v.number(),
  type: v.union([v.literal('code'), v.literal('state')]),
  contract: v.string(),
  updateId: v.string().optional(),
  transaction: v
    .string()
    .check((value) => value.startsWith('0x'), 'must be a transaction hash'),
  reason: v.string(),
})

export type OssificationPatch = v.infer<typeof OssificationPatch>
export const OssificationPatch = v.strictObject({
  events: v.array(ReviewedEvent).default([]),
  ignoredTransactions: v.array(v.string()).default([]),
  ignoredUpdates: v.array(v.string()).default([]),
  acceptedIntervals: v.array(v.string()).default([]),
})

export const EMPTY_OSSIFICATION_PATCH: OssificationPatch =
  OssificationPatch.parse({})
