import type { Database } from '@l2beat/database'

type SummedByTimestampTvsPerProject = Record<string, number>

export async function getAtTimestampPerProjectQuery(
  db: Database,
  timestamp: number,
): Promise<SummedByTimestampTvsPerProject> {
  const values =
    await db.tvsTokenValue.getSummedAtTimestampPerProject(timestamp)

  return Object.fromEntries(values.map((v) => [v.project, v.value]))
}
