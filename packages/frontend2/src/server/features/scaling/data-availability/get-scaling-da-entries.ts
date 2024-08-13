import { type Layer2, type Layer3, layer2s, layer3s } from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import { getImplementationChangeReport } from '../../implementation-change-report/get-implementation-change-report'
import { getLatestTvlUsd } from '../tvl/utils/get-latest-tvl-usd'
import { orderByTvl } from '../tvl/utils/order-by-tvl'
import { getProjectsVerificationStatuses } from '../../verification-status/get-projects-verification-statuses'
import { getCommonScalingEntry } from '../get-common-scaling-entry'

export async function getScalingDaEntries() {
  const activeProjects = [...layer2s, ...layer3s].filter(
    (p) => !p.isUpcoming && !(p.type === 'layer2' && p.isArchived),
  )
  const tvl = await getLatestTvlUsd()
  const orderedByTvl = orderByTvl(activeProjects, tvl)
  const projectsVerificationStatuses = await getProjectsVerificationStatuses()
  const implementationChangeReport = await getImplementationChangeReport()

  return orderedByTvl
    .map((p) => {
      const hasImplementationChanged =
        !!implementationChangeReport.projects[p.id.toString()]
      const isVerified = !!projectsVerificationStatuses[p.id.toString()]
      return getScalingDataAvailabilityEntry(
        p,
        hasImplementationChanged,
        isVerified,
      )
    })
    .filter(notUndefined)
}

function getScalingDataAvailabilityEntry(
  project: Layer2 | Layer3,
  hasImplementationChanged: boolean,
  isVerified: boolean,
) {
  if (!project.dataAvailability) return

  return {
    entryType: 'data-availability' as const,
    ...getCommonScalingEntry({ project, isVerified, hasImplementationChanged }),
    dataAvailability: {
      layer: project.dataAvailability.layer,
      bridge: project.dataAvailability.bridge,
      mode: project.dataAvailability.mode,
    },
  }
}

export type ScalingDataAvailabilityEntry = Exclude<
  ReturnType<typeof getScalingDataAvailabilityEntry>,
  undefined
>
