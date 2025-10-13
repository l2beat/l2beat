import type { Database } from '@l2beat/database'
import groupBy from 'lodash/groupBy'

type SummedByTimestampTvsPerProject = Record<
  string,
  {
    all: SummedByTimestampTvsValuesRecord[]
    withoutAssociated: SummedByTimestampTvsValuesRecord[]
  }
>

interface SummedByTimestampTvsValuesRecord {
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
}

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

function mapValue(
  v: SummedByTimestampTvsValuesRecord,
): SummedByTimestampTvsValuesRecord {
  return {
    value: v.value,
    canonical: v.canonical,
    external: v.external,
    native: v.native,
    ether: v.ether,
    stablecoin: v.stablecoin,
    btc: v.btc,
    rwaRestricted: v.rwaRestricted,
    rwaPublic: v.rwaPublic,
    other: v.other,
    associated: v.associated,
  }
}

const EMPTY_VALUE: SummedByTimestampTvsValuesRecord = {
  value: 0,
  canonical: 0,
  external: 0,
  native: 0,
  ether: 0,
  stablecoin: 0,
  btc: 0,
  rwaRestricted: 0,
  rwaPublic: 0,
  other: 0,
  associated: 0,
}
