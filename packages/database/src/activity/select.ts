import { Activity } from '../kysely/generated/types'

export const selectActivity = [
  'projectId',
  'timestamp',
  'count',
  'uopsCount',
  'ratio',
  'start',
  'end',
] as const satisfies (keyof Activity)[]
