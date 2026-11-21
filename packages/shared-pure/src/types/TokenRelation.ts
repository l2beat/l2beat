import { v } from '@l2beat/validate'

export const MANUAL_RELATION_PLUGIN = 'manual'

export type ManualRelationBridge = v.infer<typeof ManualRelationBridge>
export const ManualRelationBridge = v.object({
  name: v.string(),
  chain: v.union([v.string(), v.null()]),
  address: v.union([v.string(), v.null()]),
})

export type ManualRelationEvidence = v.infer<typeof ManualRelationEvidence>
export const ManualRelationEvidence = v.object({
  kind: v.literal('manual'),
  user: v.string(),
  comment: v.union([v.string(), v.null()]),
  bridge: v.union([ManualRelationBridge, v.null()]),
})
