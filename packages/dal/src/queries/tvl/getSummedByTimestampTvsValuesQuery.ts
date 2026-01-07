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
  projects: ProjectId[] | ProjectWithRanges[],
  range: [number | null, number],
  forSummary: boolean,
  excludeAssociated: boolean,
  excludeRwaRestrictedTokens: boolean,
): Promise<SummedByTimestampTvsValuesRecord[]> {
  const projectsWithRanges = v.array(ProjectWithRanges).safeParse(projects)

  const tvsRecords = projectsWithRanges.success
    ? await db.tvsTokenValue.getSummedByTimestampWithProjectsRanges(
        projectsWithRanges.data,
        range[0],
        range[1],
        {
          forSummary,
          excludeAssociated,
          excludeRwaRestrictedTokens,
        },
      )
    : await db.tvsTokenValue.getSummedByTimestampByProjects(
        projects as ProjectId[],
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
