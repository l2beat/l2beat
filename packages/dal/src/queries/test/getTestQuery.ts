import type { Database } from '@l2beat/database'
import { type ProjectId, UnixTime } from '@l2beat/shared-pure'

// This function is only used for testing purposes
export async function getTestQuery(
  db: Database,
  projectIds: ProjectId[],
): Promise<{ projectId: ProjectId; timestamp: UnixTime; value: number }[]> {
  const now = UnixTime.toStartOf(UnixTime.now(), 'hour')
  return Array.from({ length: 24 }, (_, i) => ({
    projectId: projectIds[i % projectIds.length],
    timestamp: now - i * UnixTime.HOUR,
    value: 100 * i,
  }))
}
