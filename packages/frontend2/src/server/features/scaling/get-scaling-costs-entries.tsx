import {
  type Layer2Provider,
  type ScalingProjectCategory,
  type ScalingProjectPurpose,
  type StageConfig,
  type WarningWithSentiment,
} from '@l2beat/config'
import { type ProjectId, notUndefined } from '@l2beat/shared-pure'
import { getCostsProjects } from '../costs/utils/get-costs-projects'
import { getImplementationChangeReport } from '../implementation-change-report/get-implementation-change-report'
import { getLatestTvlUsd } from '../tvl/get-latest-tvl-usd'
import { orderByTvl } from '../tvl/order-by-tvl'

export interface ScalingCostsEntry {
  type: 'layer2'
  id: ProjectId
  name: string
  shortName: string | undefined
  slug: string
  showProjectUnderReview: boolean
  hasImplementationChanged: boolean
  warning: string | undefined
  redWarning: string | undefined
  category: ScalingProjectCategory
  provider: Layer2Provider | undefined
  purposes: ScalingProjectPurpose[]
  stage: StageConfig
  costsWarning: WarningWithSentiment | undefined
}

export type CostsUnit = 'eth' | 'usd' | 'gas'

export async function getScalingCostsEntries(): Promise<ScalingCostsEntry[]> {
  const tvl = await getLatestTvlUsd({ type: 'layer2' })
  const implementationChange = await getImplementationChangeReport()
  const projects = getCostsProjects()
  const orderedProjects = orderByTvl(projects, tvl)

  return orderedProjects
    .map((project) => {
      return {
        type: project.type,
        id: project.id,
        name: project.display.name,
        shortName: project.display.shortName,
        slug: project.display.slug,
        showProjectUnderReview: !!project.isUnderReview,
        hasImplementationChanged:
          !!implementationChange.projects[project.id.toString()],
        warning: project.display.warning,
        redWarning: project.display.redWarning,
        category: project.display.category,
        provider: project.display.provider,
        purposes: project.display.purposes,
        stage: project.stage,
        costsWarning: project.display.costsWarning,
      }
    })
    .filter(notUndefined)
}
