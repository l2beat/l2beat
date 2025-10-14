import type { Database } from '@l2beat/database'
import groupBy from 'lodash/groupBy'

type SummedByTimestampTvsPerProject = Record<
  string,
  {
    all: SummedByTimestampTvsValuesRecord[]
    withoutAssociated: SummedByTimestampTvsValuesRecord[]
  }
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
  skipWithoutAssociated?: boolean,
  cutOffTimestamp?: number,
): Promise<SummedByTimestampTvsPerProject> {
  const [all, withoutAssociated] = await Promise.all([
    db.tvsTokenValue.getSummedAtTimestampsByProjects(
      oldestTimestamp,
      latestTimestamp,
      false,
      cutOffTimestamp,
    ),
    skipWithoutAssociated
      ? undefined
      : db.tvsTokenValue.getSummedAtTimestampsByProjects(
          oldestTimestamp,
          latestTimestamp,
          true,
          cutOffTimestamp,
        ),
  ])

  const allValuesByProject = groupBy(all, (v) => v.project)
  const withoutAssociatedValuesByProject = groupBy(
    withoutAssociated,
    (v) => v.project,
  )

  const values: SummedByTimestampTvsPerProject = {}
  for (const [project, allValues] of Object.entries(allValuesByProject)) {
    const withoutAssociatedValues = withoutAssociatedValuesByProject[project]
    values[project] = {
      all: allValues.sort((a, b) => a.timestamp - b.timestamp).map(mapValue),
      withoutAssociated: withoutAssociatedValues
        ? withoutAssociatedValues
            .sort((a, b) => a.timestamp - b.timestamp)
            .map(mapValue)
        : [EMPTY_VALUE, EMPTY_VALUE],
    }
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

const EMPTY_VALUE: SummedByTimestampTvsValuesRecord = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
]
