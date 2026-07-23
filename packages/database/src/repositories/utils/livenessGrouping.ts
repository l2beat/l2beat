import { type RawBuilder, sql } from 'kysely'

interface GroupedLivenessRecord {
  configurationId: string
  groupingKey: string
  timestamp: number
  blockNumber: number
}

export function keepEarliestGroupedRecords<T extends GroupedLivenessRecord>(
  records: T[],
): T[] {
  const byConfiguration = new Map<string, Map<string, T>>()

  for (const record of records) {
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

  return [...byConfiguration.values()].flatMap((records) => [
    ...records.values(),
  ])
}

type LivenessTable = 'Liveness' | 'RealTimeLiveness'

export function isEarlierThanStored(table: LivenessTable): RawBuilder<boolean> {
  return sql<boolean>`(
    ${sql.ref('excluded.timestamp')},
    ${sql.ref('excluded.blockNumber')}
  ) < (
    ${sql.ref(`${table}.timestamp`)},
    ${sql.ref(`${table}.blockNumber`)}
  )`
}

function isEarlier(
  candidate: GroupedLivenessRecord,
  current: GroupedLivenessRecord,
): boolean {
  return (
    candidate.timestamp < current.timestamp ||
    (candidate.timestamp === current.timestamp &&
      candidate.blockNumber < current.blockNumber)
  )
}
