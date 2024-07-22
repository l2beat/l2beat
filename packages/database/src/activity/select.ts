import { Activity } from '../kysely/generated/types'

export const selectActivity = [
  'project_id',
  'timestamp',
  'count',
] as const satisfies (keyof Activity)[]
