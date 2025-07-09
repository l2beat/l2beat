import type { RealTimeAnomaly } from '../../kysely/generated/types'

export const selectRealtimeAnomaly = [
  'start',
  'projectId',
  'subtype',
  'status',
  'isApproved',
  'end',
] as const satisfies (keyof RealTimeAnomaly)[]
