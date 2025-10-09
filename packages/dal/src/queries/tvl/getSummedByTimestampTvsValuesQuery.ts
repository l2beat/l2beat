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
  range: [number | null, number],
  forSummary: boolean,
  excludeAssociated: boolean,
): Promise<SummedByTimestampTvsValuesRecord[]> {
  const tvsRecords = await db.tvsTokenValue.getSummedByTimestampByProjects(
    projectIds,
    range[0],
    range[1],
    excludeAssociated,
    forSummary,
  )

  return tvsRecords
}
