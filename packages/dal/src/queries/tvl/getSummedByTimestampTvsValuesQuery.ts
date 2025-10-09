import type { Database } from '@l2beat/database'
import type { ProjectId, UnixTime } from '@l2beat/shared-pure'

interface SummedByTimestampTvsValuesRecord {
  value: number
  timestamp: UnixTime
  canonical: number
  external: number
  native: number
  ether: number
  stablecoin: number
  btc: number
  rwaRestricted: number
  rwaPublic: number
  other: number
}

export async function getSummedByTimestampTvsValuesQuery(
  db: Database,
  projectIds: ProjectId[],
  range: [number | null, number | null],
  forSummary: boolean,
  excludeAssociated: boolean,
): Promise<SummedByTimestampTvsValuesRecord[]> {
  const tvsRecords = await db.tvsTokenValue.getByProjects(
    projectIds,
    range[0],
    range[1],
    excludeAssociated,
  )

  // TODO: lagging records
  const breakdownMap = new Map<number, SummedByTimestampTvsValuesRecord>()
  for (const record of tvsRecords) {
    let mapItem = breakdownMap.get(record.timestamp)
    if (!mapItem) {
      mapItem = {
        timestamp: record.timestamp,
        value: 0,
        // source
        canonical: 0,
        external: 0,
        native: 0,
        // category
        ether: 0,
        stablecoin: 0,
        btc: 0,
        rwaRestricted: 0,
        rwaPublic: 0,
        other: 0,
      }
    }
    const value = forSummary ? record.valueForSummary : record.valueForProject
    mapItem.value += value
    mapItem[record.source] += value
    mapItem[record.category] += value
    breakdownMap.set(record.timestamp, mapItem)
  }

  return Array.from(breakdownMap.values())
}
