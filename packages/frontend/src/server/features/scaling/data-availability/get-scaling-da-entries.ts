import { type Layer2, type Layer3, layer2s, layer3s } from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import { env } from '~/env'
import { groupByMainCategories } from '~/utils/group-by-main-categories'
import { getImplementationChangeReport } from '../../implementation-change-report/get-implementation-change-report'
import { getProjectsVerificationStatuses } from '../../verification-status/get-projects-verification-statuses'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import { getProjectsLatestTvlUsd } from '../tvl/utils/get-latest-tvl-usd'
import { orderByTvl } from '../tvl/utils/order-by-tvl'
import { orderByStageAndTvl } from '../utils/order-by-stage-and-tvl'

export async function getScalingDaEntries() {
  const activeProjects = [...layer2s, ...layer3s].filter(
    (p) => !p.isUpcoming && !(p.type === 'layer2' && p.isArchived),
  )
  const [tvl, projectsVerificationStatuses, implementationChangeReport] =
    await Promise.all([
      getProjectsLatestTvlUsd(),
      getProjectsVerificationStatuses(),
      getImplementationChangeReport(),
    ])

  const entries = activeProjects
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

  if (env.NEXT_PUBLIC_FEATURE_FLAG_RECATEGORISATION) {
    return {
      type: 'recategorised' as const,
      entries: groupByMainCategories(orderByStageAndTvl(entries, tvl)),
    }
  }

  return { entries: orderByTvl(entries, tvl) }
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
