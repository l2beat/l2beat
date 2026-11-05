import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { ActivityHeadBlock } from '../kysely/generated/types'

export interface ActivityHeadBlockRecord {
  projectId: ProjectId
  number: number
  timestamp: UnixTime
  count: number
  uopsCount: number | null
}

function toRecord(row: Selectable<ActivityHeadBlock>): ActivityHeadBlockRecord {
  return {
    projectId: ProjectId(row.projectId),
    number: row.number,
    timestamp: UnixTime.fromDate(row.timestamp),
    count: row.count,
    uopsCount: row.uopsCount,
  }
}

export class ActivityHeadBlockRepository extends BaseRepository {
  /** A reorg can change any of them, so the project's blocks go as a whole */
  async replaceForProject(
    projectId: ProjectId,
    records: Omit<ActivityHeadBlockRecord, 'projectId'>[],
  ): Promise<void> {
    await this.transaction(async () => {
      await this.db
        .deleteFrom('ActivityHeadBlock')
        .where('projectId', '=', projectId.toString())
        .execute()
      if (records.length === 0) return
      await this.db
        .insertInto('ActivityHeadBlock')
        .values(
          records.map((record) => ({
            projectId: projectId.toString(),
            number: record.number,
            timestamp: UnixTime.toDate(record.timestamp),
            count: record.count,
            uopsCount: record.uopsCount,
          })),
        )
        .execute()
    })
  }

  async getByProject(projectId: ProjectId): Promise<ActivityHeadBlockRecord[]> {
    const rows = await this.db
      .selectFrom('ActivityHeadBlock')
      .selectAll()
      .where('projectId', '=', projectId.toString())
      .orderBy('number', 'asc')
      .execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('ActivityHeadBlock')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
