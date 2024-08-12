import { type WarningWithSentiment } from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import { getCostsProjects } from '../costs/utils/get-costs-projects'
import { getImplementationChangeReport } from '../implementation-change-report/get-implementation-change-report'
import { getLatestTvlUsd } from '../tvl/get-latest-tvl-usd'
import { orderByTvl } from '../tvl/order-by-tvl'
import { getProjectsVerificationStatuses } from '../verification-status/get-projects-verification-statuses'
import {
  type CommonScalingEntry,
  getCommonScalingEntry,
} from './get-common-scaling-entry'

export type ScalingCostsEntry = CommonScalingEntry & {
  entryType: 'costs'
  costsWarning: WarningWithSentiment | undefined
}

export type CostsUnit = 'eth' | 'usd' | 'gas'

export async function getScalingCostsEntries(): Promise<ScalingCostsEntry[]> {
  const [tvl, implementationChange, projectsVerificationStatuses] =
    await Promise.all([
      getLatestTvlUsd(),
      getImplementationChangeReport(),
      getProjectsVerificationStatuses(),
    ])
  const projects = getCostsProjects()
  const orderedProjects = orderByTvl(projects, tvl)

  return orderedProjects
    .map((project) => {
      const isVerified = !!projectsVerificationStatuses[project.id.toString()]
      const hasImplementationChanged =
        !!implementationChange.projects[project.id.toString()]
      return {
        ...getCommonScalingEntry({
          project,
          isVerified,
          hasImplementationChanged,
        }),
        entryType: 'costs' as const,
        costsWarning: project.display.costsWarning,
      }
    })
    .filter(notUndefined)
}
