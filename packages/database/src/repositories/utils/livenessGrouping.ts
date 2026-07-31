import { type Insertable, type RawBuilder, sql } from 'kysely'
import type { QueryBuilder } from '../../kysely'
import type { Liveness, RealTimeLiveness } from '../../kysely/generated/types'

type LivenessTable = 'Liveness' | 'RealTimeLiveness'

interface LivenessLikeRecord {
  configurationId: string
  timestamp: number
  blockNumber: number
  groupingKey?: string
}

/** Keeps the earliest grouped record per (configurationId, groupingKey). */
export function splitLivenessRecords<T extends LivenessLikeRecord>(
  records: T[],
): { ungrouped: T[]; groupedEarliest: T[] } {
  const ungrouped: T[] = []
  const byConfiguration = new Map<string, Map<string, T>>()

  for (const record of records) {
    if (record.groupingKey === undefined) {
      ungrouped.push(record)
      continue
    }

    let byGroupingKey = byConfiguration.get(record.configurationId)
    if (byGroupingKey === undefined) {
      byGroupingKey = new Map()
      byConfiguration.set(record.configurationId, byGroupingKey)
    }

    const current = byGroupingKey.get(record.groupingKey)
    if (current === undefined || isEarlier(record, current)) {
      byGroupingKey.set(record.groupingKey, record)
    }
  }

  const groupedEarliest = [...byConfiguration.values()].flatMap((records) => [
    ...records.values(),
  ])

  return { ungrouped, groupedEarliest }
}

/** Upserts grouped rows, replacing a stored row only with an earlier one. */
export async function insertGroupedKeepingEarliest(
  db: QueryBuilder,
  table: LivenessTable,
  rows: Insertable<Liveness | RealTimeLiveness>[],
): Promise<void> {
  await db
    .insertInto(table)
    .values(rows)
    .onConflict((cb) =>
      cb
        .columns(['configurationId', 'groupingKey'])
        .where('groupingKey', 'is not', null)
        .doUpdateSet((eb) => ({
          timestamp: eb.ref('excluded.timestamp'),
          blockNumber: eb.ref('excluded.blockNumber'),
          txHash: eb.ref('excluded.txHash'),
        }))
        .where(isEarlierThanStored(table)),
    )
    .execute()
}

function isEarlierThanStored(table: LivenessTable): RawBuilder<boolean> {
  return sql<boolean>`(
    ${sql.ref('excluded.timestamp')},
    ${sql.ref('excluded.blockNumber')}
  ) < (
    ${sql.ref(`${table}.timestamp`)},
    ${sql.ref(`${table}.blockNumber`)}
  )`
}

function isEarlier(
  candidate: LivenessLikeRecord,
  current: LivenessLikeRecord,
): boolean {
  return (
    candidate.timestamp < current.timestamp ||
    (candidate.timestamp === current.timestamp &&
      candidate.blockNumber < current.blockNumber)
  )
}
