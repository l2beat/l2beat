import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { Finality } from '../../kysely/generated/types'

export interface FinalityRecord {
  projectId: ProjectId
  timestamp: UnixTime
  minimumTimeToInclusion: number
  maximumTimeToInclusion: number
  averageTimeToInclusion: number

  averageStateUpdate: number | null
}

export interface ProjectFinalityRecord {
  minimumTimeToInclusion: number
  maximumTimeToInclusion: number
  averageTimeToInclusion: number
}

export function toRecord(row: Selectable<Finality>): FinalityRecord {
  return {
    ...row,
    projectId: ProjectId(row.projectId),
    timestamp: UnixTime.fromDate(row.timestamp),
  }
}

export function toRow(record: FinalityRecord): Insertable<Finality> {
  return {
    ...record,
    projectId: record.projectId.toString(),
    timestamp: record.timestamp.toDate(),
  }
}

export function toProjectFinalityRecord(
  row: Selectable<Finality>,
): ProjectFinalityRecord {
  return {
    minimumTimeToInclusion: row.minimumTimeToInclusion,
    maximumTimeToInclusion: row.maximumTimeToInclusion,
    averageTimeToInclusion: row.averageTimeToInclusion,
  }
}
