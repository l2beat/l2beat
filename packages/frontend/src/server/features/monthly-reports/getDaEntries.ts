import type { Project, ProjectColors } from '@l2beat/config'
import { assert, type ProjectId, type UnixTime } from '@l2beat/shared-pure'
import type { DataAvailabilityUpdate } from '~/content/monthly-updates'
import { ps } from '~/server/projects'
import {
  type SevenDayTvsBreakdown,
  get7dTvsBreakdown,
} from '../scaling/tvs/get7dTvsBreakdown'

export interface DaMonthlyUpdateEntry extends DataAvailabilityUpdate {
  colors: ProjectColors
  daProjects: ProjectId[]
  allScalingProjects: {
    tvs: number
  }
}

export async function getDaMonthlyUpdateEntries(
  daUpdateEntries: DataAvailabilityUpdate[],
  to: UnixTime,
): Promise<DaMonthlyUpdateEntry[]> {
  const [daLayers, daBridges, tvs] = await Promise.all([
    ps.getProjects({
      select: ['isDaLayer', 'daLayer', 'colors'],
    }),
    await ps.getProjects({
      select: ['daBridge'],
    }),
    get7dTvsBreakdown({ type: 'layer2' }, to),
  ])

  return daUpdateEntries.map((e) => {
    const daLayer = daLayers.find((p) => p.id === e.daLayerId)
    assert(daLayer, `DA Layer not found for ${e.daLayerId}`)
    return getDaMonthlyUpdateEntry(e, daLayer, daBridges, tvs)
  })
}

function getDaMonthlyUpdateEntry(
  daUpdateEntry: DataAvailabilityUpdate,
  daLayer: Project<'isDaLayer' | 'daLayer' | 'colors'>,
  daBridges: Project<'daBridge'>[],
  tvs: SevenDayTvsBreakdown,
): DaMonthlyUpdateEntry {
  const projectBridges = daBridges.filter(
    (x) => x.daBridge.daLayer === daLayer.id,
  )

  const allUsedIn = daLayer.daLayer.usedWithoutBridgeIn.concat(
    projectBridges.flatMap((x) => x.daBridge.usedIn),
  )

  return {
    ...daUpdateEntry,
    colors: daLayer.colors,
    daProjects: allUsedIn.map((x) => x.id),
    allScalingProjects: {
      tvs: tvs.total,
    },
  }
}
