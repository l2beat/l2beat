import type { Database } from '@l2beat/database'
import type { ProjectId, UnixTime } from '@l2beat/shared-pure'

type ProjectWithRanges = {
  projectId: ProjectId
  sinceTimestamp: UnixTime
  untilTimestamp?: UnixTime
}

export type SummedByTimestampTvsValuesPerProjectRecord = [
  projectId: ProjectId,
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

export async function getSummedByTimestampTvsValuesPerProjectQuery(
  db: Database,
  projects: ProjectWithRanges[],
  range: [number | null, number],
  forSummary: boolean,
  excludeAssociated: boolean,
  excludeRwaRestrictedTokens: boolean,
): Promise<SummedByTimestampTvsValuesPerProjectRecord[]> {
  const tvsRecords =
    await db.tvsTokenValue.getSummedByTimestampWithProjectsRangesPerProject(
      projects,
      range[0],
      range[1],
      {
        forSummary,
        excludeAssociated,
        excludeRwaRestrictedTokens,
      },
    )

  return tvsRecords.map((v) => [
    v.projectId as ProjectId,
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
