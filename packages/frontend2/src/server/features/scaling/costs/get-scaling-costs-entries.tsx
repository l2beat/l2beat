import { type WarningWithSentiment } from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import { getImplementationChangeReport } from '../../implementation-change-report/get-implementation-change-report'
import { getProjectsVerificationStatuses } from '../../verification-status/get-projects-verification-statuses'
import { getCostsProjects } from '../costs/utils/get-costs-projects'
import {
  type CommonScalingEntry,
  getCommonScalingEntry,
} from '../get-common-scaling-entry'
import { getLatestTvlUsd } from '../tvl/utils/get-latest-tvl-usd'
import { orderByTvl } from '../tvl/utils/order-by-tvl'

export type ScalingCostsEntry = CommonScalingEntry & {
  entryType: 'costs'
  costsWarning: WarningWithSentiment | undefined
}

export async function getScalingCostsEntries(): Promise<ScalingCostsEntry[]> {
  const [tvl, implementationChange, projectsVerificationStatuses] =
    await Promise.all([
      getLatestTvlUsd(),
      getImplementationChangeReport(),
      getProjectsVerificationStatuses(),
    ])
  const projects = getCostsProjects()

  const entries = projects
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

  return orderByTvl(entries, tvl)
}
