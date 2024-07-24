import { Finality } from '../../kysely/generated/types'

export const selectFinality = [
  'average_state_update',
  'average_time_to_inclusion',
  'maximum_time_to_inclusion',
  'minimum_time_to_inclusion',
  'project_id',
  'timestamp',
] as const satisfies (keyof Finality)[]
