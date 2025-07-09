import type { RealTimeAnomaly } from '../../kysely/generated/types'

export const selectRealtimeAnomaly = [
  'start',
  'projectId',
  'subtype',
  'isOngoing',
  'isApproved',
  'end',
] as const satisfies (keyof RealTimeAnomaly)[]
