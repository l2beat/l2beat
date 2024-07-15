import { Anomaly as AnomalyRow } from '../kysely/generated/types'

export const selectAnomaly = [
  'timestamp',
  'project_id',
  'subtype',
  'duration',
] as const satisfies (keyof AnomalyRow)[]
