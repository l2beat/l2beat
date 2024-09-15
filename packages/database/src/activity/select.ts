import { Activity } from '../kysely/generated/types'

export const selectActivity = [
  'projectId',
  'timestamp',
  'count',
  'start',
  'end',
] as const satisfies (keyof Activity)[]
