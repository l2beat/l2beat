import type { Database } from '@l2beat/database'
import type { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

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

const ProjectWithRanges = v.object({
  projectId: v.string().transform((value) => value as ProjectId),
  sinceTimestamp: v.number(),
  untilTimestamp: v.number().optional(),
})
export type ProjectWithRanges = v.infer<typeof ProjectWithRanges>

export async function getSummedByTimestampTvsValuesQuery(
  db: Database,
  projects: ProjectId[],
  range: [number | null, number],
  forSummary: boolean,
  excludeAssociated: boolean,
  excludeRwaRestrictedTokens: boolean,
): Promise<SummedByTimestampTvsValuesRecord[]> {
  const tvsRecords = await db.tvsTokenValue.getSummedByTimestampByProjects(
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
