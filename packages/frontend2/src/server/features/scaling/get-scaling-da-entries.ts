import { type Layer2, type Layer3, layer2s, layer3s } from '@l2beat/config'
import { type ProjectId, notUndefined } from '@l2beat/shared-pure'
import { getImplementationChangeReport } from '../implementation-change-report/get-implementation-change-report'
import { orderByTvl } from '../tvl/order-by-tvl'
import { type ScalingDataAvailabilityEntry } from './types'
import { isAnySectionUnderReview } from './utils/is-any-section-under-review'
import { getCommonScalingEntry } from './get-common-scaling-entry'

export async function getScalingDaEntries(
  tvl: Record<ProjectId, number>,
): Promise<ScalingDataAvailabilityEntry[]> {
  const activeProjects = [...layer2s, ...layer3s].filter(
    (p) => !p.isUpcoming && !(p.type === 'layer2' && p.isArchived),
  )
  const orderedByTvl = orderByTvl(activeProjects, tvl)

  const implementationChangeReport = await getImplementationChangeReport()

  return orderedByTvl
    .map((p) => {
      const hasImplementationChanged =
        !!implementationChangeReport.projects[p.id.toString()]

      return getScalingDataAvailabilityEntry(p, hasImplementationChanged)
    })
    .filter(notUndefined)
}

function getScalingDataAvailabilityEntry(
  project: Layer2 | Layer3,
  hasImplementationChanged: boolean,
): ScalingDataAvailabilityEntry | undefined {
  if (!project.dataAvailability) return

  return {
    ...getCommonScalingEntry({ project, })
    dataAvailability: {
      layer: project.dataAvailability.layer,
      bridge: project.dataAvailability.bridge,
      mode: project.dataAvailability.mode,
    },
  }
}
