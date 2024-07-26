import { Activity } from '../../kysely/generated/types'

export const selectActivity = [
  'project_id',
  'timestamp',
  'count',
  'start',
  'end',
] as const satisfies (keyof Activity)[]
