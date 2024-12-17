import { type Layer2, type Layer3, layer2s, layer3s } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import { groupByTabs } from '~/utils/group-by-tabs'
import { getCommonScalingEntry } from '../get-common-scaling-entry'

export function getScalingUpcomingEntries() {
  const projects = [...layer2s, ...layer3s].filter((p) => p.isUpcoming)

  const entries = projects
    .sort((a, b) => {
      assert(
        a.createdAt && b.createdAt,
        'Project has no createdAt although it is upcoming',
      )
      return b.createdAt.toNumber() - a.createdAt.toNumber()
    })
    .map((project) => getScalingUpcomingEntry(project))

  return groupByTabs(entries)
}

export type ScalingUpcomingEntry = ReturnType<typeof getScalingUpcomingEntry>
function getScalingUpcomingEntry(project: Layer2 | Layer3) {
  return {
    ...getCommonScalingEntry({
      project,
      changes: undefined,
      syncStatus: undefined,
    }),
    category: project.display.category,
    provider: project.display.provider,
    purposes: project.display.purposes,
  }
}
