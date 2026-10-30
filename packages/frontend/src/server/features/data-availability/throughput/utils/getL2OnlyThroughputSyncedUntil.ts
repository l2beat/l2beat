import type { Project } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'

// Matches the syncedUntil of da.projectCharts with includeL2Only: the summed
// L2 series is a subset of the by-project series, so its last timestamp is
// the smaller of the two.
export async function getL2OnlyThroughputSyncedUntil(
  project: Project<'daLayer'>,
): Promise<UnixTime | undefined> {
  if (env.MOCK) {
    return ['ethereum', 'celestia', 'avail', 'eigenda'].includes(project.id)
      ? UnixTime.now()
      : undefined
  }
  const sovereignProjectIds =
    project.daLayer.sovereignProjectsTrackingConfig?.map((p) => p.projectId)
  return await getDb().dataAvailability.getLastTimestampOfSummedProjectsByDaLayers(
    [project.id],
    sovereignProjectIds,
  )
}
