import type { Database } from '@l2beat/database'
import type { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { SummedByTimestampTvsValuesRecord } from './getSummedByTimestampTvsValuesQuery'

export async function getSummedByTimestampWithProjectsRangesTvsValuesQuery(
  db: Database,
  projectsWithRanges: {
    projectId: ProjectId
    sinceTimestamp: UnixTime
    untilTimestamp?: UnixTime
  }[],
  range: [number | null, number],
  forSummary: boolean,
  excludeAssociated: boolean,
  includeRwaRestrictedTokens: boolean,
): Promise<SummedByTimestampTvsValuesRecord[]> {
  const tvsRecords =
    await db.tvsTokenValue.getSummedByTimestampWithProjectsRanges(
      projectsWithRanges,
      {
        range,
        forSummary,
        excludeAssociated,
        includeRwaRestrictedTokens,
      },
    )

  return tvsRecords.map(
    (v: {
      timestamp: UnixTime
      value: number
      canonical: number
      external: number
      native: number
      ether: number
      stablecoin: number
      btc: number
      rwaRestricted: number
      rwaPublic: number
      other: number
    }) => [
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
    ],
  )
}
