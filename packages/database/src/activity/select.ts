import type { Activity } from '../kysely/generated/types'

export const selectActivity = [
  'projectId',
  'timestamp',
  'count',
  'uopsCount',
  'start',
  'end',
] as const satisfies (keyof Activity)[]
