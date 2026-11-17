import { UnixTime } from '@l2beat/shared-pure'
import { sql } from 'kysely'
import type { QueryBuilder } from '../kysely'

type AggregatedInteropTable =
  | 'AggregatedInteropTransfer'
  | 'AggregatedInteropToken'
  | 'AggregatedInteropDeployedToken'
  | 'AggregatedInteropTokensPair'

/**
 * Deletes snapshots before `timestamp`, keeping one per UTC day: the earliest
 * promoted one, or the earliest one if none of that day's snapshots is promoted.
 */
export async function deleteAllButEarliestPromotedPerDayBefore(
  db: QueryBuilder,
  tableName: AggregatedInteropTable,
  timestamp: UnixTime,
): Promise<number> {
  const day = sql`date_trunc('day', ${sql.ref('snapshot.timestamp')})`
  const result = await db
    .with('snapshot', (qb) =>
      qb.selectFrom(tableName).select('timestamp').distinct(),
    )
    .with('kept', (qb) =>
      qb
        .selectFrom('snapshot')
        .leftJoin(
          'InteropAggregateStatus',
          'InteropAggregateStatus.timestamp',
          'snapshot.timestamp',
        )
        .distinctOn(day)
        .select('snapshot.timestamp')
        .orderBy(day)
        .orderBy((eb) =>
          eb('InteropAggregateStatus.status', 'is distinct from', 'promoted'),
        )
        .orderBy('snapshot.timestamp'),
    )
    .deleteFrom(tableName)
    .where('timestamp', '<', UnixTime.toDate(timestamp))
    .where('timestamp', 'not in', (qb) =>
      qb.selectFrom('kept').select('kept.timestamp'),
    )
    .executeTakeFirst()
  return Number(result.numDeletedRows)
}
