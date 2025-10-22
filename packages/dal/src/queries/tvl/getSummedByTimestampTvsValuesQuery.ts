import type { Database } from '@l2beat/database'
import type { ProjectId, UnixTime } from '@l2beat/shared-pure'

export type SummedByTimestampTvsValuesRecord = [
  timestamp: UnixTime,
  value: number,
  canonical: number,
  external: number,
  native: number,
  ether: number,
  stablecoin: number,
  btc: number,
  rwaRestricted: number,
  rwaPublic: number,
  other: number,
]

export async function getSummedByTimestampTvsValuesQuery(
  db: Database,
  projectIds: ProjectId[],
  range: [number | null, number],
  forSummary: boolean,
  excludeAssociated: boolean,
  includeRwaRestrictedTokens: boolean,
): Promise<SummedByTimestampTvsValuesRecord[]> {
  const tvsRecords = await db.tvsTokenValue.getSummedByTimestampByProjects(
    projectIds,
    range[0],
    range[1],
    {
      forSummary,
      excludeAssociated,
      includeRwaRestrictedTokens,
    },
  )

  return tvsRecords.map((v) => [
    v.timestamp,
    v.value,
    v.canonical,
    v.external,
    v.native,
    v.ether,
    v.stablecoin,
    v.btc,
    v.rwaRestricted,
    v.rwaPublic,
    v.other,
  ])
}
