import type { Database } from '@l2beat/database'
import groupBy from 'lodash/groupBy'

type SummedByTimestampTvsPerProject = Record<
  string,
  SummedByTimestampTvsValuesRecord[]
>

export type SummedByTimestampTvsValuesRecord = [
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
  associated: number,
]

export async function getAtTimestampsPerProjectQuery(
  db: Database,
  oldestTimestamp: number,
  latestTimestamp: number,
  excludeAssociated: boolean,
  includeRwaRestrictedTokens: boolean,
  cutOffTimestamp?: number,
): Promise<SummedByTimestampTvsPerProject> {
  const allValues = await db.tvsTokenValue.getSummedAtTimestampsByProjects(
    oldestTimestamp,
    latestTimestamp,
    {
      excludeAssociated,
      includeRwaRestrictedTokens,
      cutOffTimestamp,
    },
  )

  const allValuesByProject = groupBy(
    allValues.sort((a, b) => a.timestamp - b.timestamp),
    (v) => v.project,
  )

  const values: SummedByTimestampTvsPerProject = {}
  for (const [project, allValues] of Object.entries(allValuesByProject)) {
    values[project] = allValues.map(mapValue)
  }

  return values
}

function mapValue(v: {
  project: string
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
  associated: number
}): SummedByTimestampTvsValuesRecord {
  return [
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
    v.associated,
  ]
}
