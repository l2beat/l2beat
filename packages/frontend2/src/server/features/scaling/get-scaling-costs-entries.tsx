import {
  type ScalingProjectCategory,
  type Layer2Provider,
  type ScalingProjectPurpose,
  type StageConfig,
  type WarningWithSentiment,
  layer2s,
  type Layer2,
} from '@l2beat/config'
import { type ProjectId } from '@l2beat/shared-pure'
import { orderByTvl } from '../tvl/order-by-tvl'
import { getImplementationChangeReport } from '../implementation-change-report/get-implementation-change-report'

export interface ScalingCostsViewEntry {
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
  data: CostsData | undefined
  costsWarning: WarningWithSentiment | undefined
}

interface CostsData {
  total: CostsDataBreakdown
  calldata: CostsDataBreakdown
  blobs: CostsDataBreakdown | undefined
  compute: CostsDataBreakdown
  overhead: CostsDataBreakdown
  txCount: number | undefined
}

export interface CostsDataBreakdown {
  ethCost: number
  usdCost: number
  gas: number
}

const UPCOMING_PROJECTS = ['paradex']

export async function getScalingCostsEntries(
  tvl: Record<ProjectId, number>,
): Promise<ScalingCostsViewEntry[]> {
  const implementationChange = await getImplementationChangeReport()

  // for now, later fetch costs from db
  const projects = getIncluded(layer2s, {
    ...tvl,
  })
  const orderedProjects = orderByTvl(projects, tvl)

  return orderedProjects.map((project) => ({
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
    data: {
      total: {
        ethCost: 400,
        usdCost: 400,
        gas: 400,
      },
      calldata: {
        ethCost: 100,
        usdCost: 100,
        gas: 100,
      },
      blobs: {
        ethCost: 100,
        usdCost: 100,
        gas: 100,
      },
      compute: {
        ethCost: 100,
        usdCost: 100,
        gas: 100,
      },
      overhead: {
        ethCost: 100,
        usdCost: 100,
        gas: 100,
      },
      txCount: 2000,
    },
    costsWarning: project.display.costsWarning,
  }))
}

function getIncluded(projects: Layer2[], l2Costs: Record<ProjectId, unknown>) {
  return projects.filter(
    (p) =>
      (l2Costs[p.id] !== undefined ||
        UPCOMING_PROJECTS.includes(p.id.toString())) &&
      !p.isArchived &&
      !p.isUpcoming &&
      (p.display.category === 'Optimistic Rollup' ||
        p.display.category === 'ZK Rollup'),
  )
}
