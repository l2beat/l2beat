import type { Project } from '@l2beat/config'
import { assert, type ProjectId } from '@l2beat/shared-pure'
import type { DataAvailabilityUpdate } from '~/content/monthly-updates'
import { ps } from '~/server/projects'

export interface DaMonthlyUpdateEntry extends DataAvailabilityUpdate {
  projects: ProjectId[]
}

export async function getDaMonthlyUpdateEntries(
  daUpdateEntries: DataAvailabilityUpdate[],
): Promise<DaMonthlyUpdateEntry[]> {
  const [daLayers, daBridges] = await Promise.all([
    ps.getProjects({
      select: ['isDaLayer', 'daLayer'],
    }),
    await ps.getProjects({
      select: ['daBridge'],
    }),
  ])

  return daUpdateEntries.map((e) => {
    const daLayer = daLayers.find((p) => p.id === e.daLayerId)
    assert(daLayer, `DA Layer not found for ${e.daLayerId}`)
    return getDaMonthlyUpdateEntry(e, daLayer, daBridges)
  })
}

function getDaMonthlyUpdateEntry(
  daUpdateEntry: DataAvailabilityUpdate,
  daLayer: Project<'isDaLayer' | 'daLayer'>,
  daBridges: Project<'daBridge'>[],
): DaMonthlyUpdateEntry {
  const projectBridges = daBridges.filter(
    (x) => x.daBridge.daLayer === daLayer.id,
  )

  const allUsedIn = daLayer.daLayer.usedWithoutBridgeIn.concat(
    projectBridges.flatMap((x) => x.daBridge.usedIn),
  )

  return {
    ...daUpdateEntry,
    projects: allUsedIn.map((x) => x.id),
  }
}
