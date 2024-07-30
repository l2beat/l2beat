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
import { random } from 'lodash'

export interface ScalingCostsEntry {
  type: 'layer2'
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

export type CostsUnit = 'eth' | 'usd' | 'gas'

export interface CostsData {
  total: number
  calldata: number
  blobs: number | undefined
  compute: number
  overhead: number
  txCount: number | undefined
  syncStatus?: never
}

const UPCOMING_PROJECTS = ['paradex']

export async function getScalingCostsEntries(
  tvl: Record<ProjectId, number>,
): Promise<ScalingCostsEntry[]> {
  const implementationChange = await getImplementationChangeReport()

  // for now, later fetch costs from db
  const projects = getIncluded(layer2s, {
    ...tvl,
  })
  const orderedProjects = orderByTvl(projects, tvl)

  return orderedProjects.map((project) => ({
    type: project.type,
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
      total: random(true) * 1000000,
      calldata: random(true) * 10000,
      blobs: random(true) * 100000,
      compute: random(true) * 100,
      overhead: random(true) * 10,
      txCount: random(true) * 1000000000,
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
