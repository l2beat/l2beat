import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { Insertable, Selectable } from 'kysely'
import { Finality } from '../kysely/generated/types'

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
    projectId: ProjectId(row.project_id),
    timestamp: UnixTime.fromDate(row.timestamp),
    minimumTimeToInclusion: row.minimum_time_to_inclusion,
    maximumTimeToInclusion: row.maximum_time_to_inclusion,
    averageTimeToInclusion: row.average_time_to_inclusion,
    averageStateUpdate: row.average_state_update,
  }
}

export function toRow(record: FinalityRecord): Insertable<Finality> {
  return {
    project_id: record.projectId.toString(),
    timestamp: record.timestamp.toDate(),
    minimum_time_to_inclusion: record.minimumTimeToInclusion,
    maximum_time_to_inclusion: record.maximumTimeToInclusion,
    average_time_to_inclusion: record.averageTimeToInclusion,
    average_state_update: record.averageStateUpdate,
  }
}

export function toProjectFinalityRecord(
  row: Selectable<Finality>,
): ProjectFinalityRecord {
  return {
    minimumTimeToInclusion: row.minimum_time_to_inclusion,
    maximumTimeToInclusion: row.maximum_time_to_inclusion,
    averageTimeToInclusion: row.average_time_to_inclusion,
  }
}
