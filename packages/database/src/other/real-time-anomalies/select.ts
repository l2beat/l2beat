import type { RealTimeAnomaly } from '../../kysely/generated/types'

export const selectRealtimeAnomaly = [
  'start',
  'projectId',
  'subtype',
  'status',
  'end',
] as const satisfies (keyof RealTimeAnomaly)[]
