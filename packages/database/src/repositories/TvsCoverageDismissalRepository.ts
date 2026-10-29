import { UnixTime } from '@l2beat/shared-pure'
import type { Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { TvsCoverageDismissal } from '../kysely/generated/types'

export interface TvsCoverageDismissalRecord {
  projectId: string
  chain: string
  address: string
  reason: string
  comment: string | undefined
  dismissedBy: string
  dismissedAt: UnixTime
}

export type TvsCoverageDismissalKey = Pick<
  TvsCoverageDismissalRecord,
  'projectId' | 'chain' | 'address'
>

function toRecord(
  row: Selectable<TvsCoverageDismissal>,
): TvsCoverageDismissalRecord {
  return {
    projectId: row.projectId,
    chain: row.chain,
    address: row.address,
    reason: row.reason,
    comment: row.comment ?? undefined,
    dismissedBy: row.dismissedBy,
    dismissedAt: UnixTime.fromDate(row.dismissedAt),
  }
}

export class TvsCoverageDismissalRepository extends BaseRepository {
  async getAll(): Promise<TvsCoverageDismissalRecord[]> {
    const rows = await this.db
      .selectFrom('TvsCoverageDismissal')
      .selectAll()
      .execute()
    return rows.map(toRecord)
  }

  async upsert(record: TvsCoverageDismissalRecord): Promise<void> {
    const row = {
      ...record,
      address: record.address.toLowerCase(),
      comment: record.comment ?? null,
      dismissedAt: UnixTime.toDate(record.dismissedAt),
    }
    await this.db
      .insertInto('TvsCoverageDismissal')
      .values(row)
      .onConflict((cb) =>
        cb.columns(['projectId', 'chain', 'address']).doUpdateSet({
          reason: row.reason,
          comment: row.comment,
          dismissedBy: row.dismissedBy,
          dismissedAt: row.dismissedAt,
        }),
      )
      .execute()
  }

  async delete(key: TvsCoverageDismissalKey): Promise<number> {
    const result = await this.db
      .deleteFrom('TvsCoverageDismissal')
      .where('projectId', '=', key.projectId)
      .where('chain', '=', key.chain)
      .where('address', '=', key.address.toLowerCase())
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('TvsCoverageDismissal')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
