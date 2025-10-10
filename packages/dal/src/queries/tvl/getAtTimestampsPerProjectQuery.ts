import type { Database } from '@l2beat/database'
import type { UnixTime } from '@l2beat/shared-pure'

type SummedByTimestampTvsPerProject = Record<
  string,
  {
    all: SummedByTimestampTvsValuesRecord[]
    withoutAssociated: SummedByTimestampTvsValuesRecord[]
  }
>

interface SummedByTimestampTvsValuesRecord {
  timestamp: UnixTime
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
}

export async function getAtTimestampsPerProjectQuery(
  db: Database,
  oldestTimestamp: number,
  latestTimestamp: number,
  projectIds: string[],
  skipWithoutAssociated?: boolean,
  cutOffTimestamp?: number,
): Promise<SummedByTimestampTvsPerProject> {
  const [all, withoutAssociated] = await Promise.all([
    db.tvsTokenValue.getSummedAtTimestampsByProjects(
      oldestTimestamp,
      latestTimestamp,
      false,
      projectIds,
      cutOffTimestamp,
    ),
    skipWithoutAssociated
      ? undefined
      : db.tvsTokenValue.getSummedAtTimestampsByProjects(
          oldestTimestamp,
          latestTimestamp,
          true,
          projectIds,
          cutOffTimestamp,
        ),
  ])

  const values: SummedByTimestampTvsPerProject = {}
  for (const project of projectIds) {
    values[project] = {
      all: all
        .filter((v) => v.project === project)
        .sort((a, b) => a.timestamp - b.timestamp),
      withoutAssociated: withoutAssociated
        ? withoutAssociated
            .filter((v) => v.project === project)
            .sort((a, b) => a.timestamp - b.timestamp)
        : [],
    }
  }

  return values
}
