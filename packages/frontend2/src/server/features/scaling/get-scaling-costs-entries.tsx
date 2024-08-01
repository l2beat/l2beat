import {
  type Layer2,
  type Layer2Provider,
  type ScalingProjectCategory,
  type ScalingProjectPurpose,
  type StageConfig,
  type WarningWithSentiment,
  layer2s,
} from '@l2beat/config'
import { type ProjectId, UnixTime, notUndefined } from '@l2beat/shared-pure'
import { random } from 'lodash'
import { type SyncStatus } from '~/types/SyncStatus'
import { getLatestCosts } from '../costs/get-latest-costs'
import { type LatestCostsProjectResponse } from '../costs/types'
import { type CostsTimeRange } from '../costs/utils/range'
import { getImplementationChangeReport } from '../implementation-change-report/get-implementation-change-report'
import { orderByTvl } from '../tvl/order-by-tvl'

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

interface CostsValues {
  total: number
  calldata: number
  blobs: number | undefined
  compute: number
  overhead: number
}

export type CostsData = Record<CostsUnit, CostsValues> & {
  txCount: number | undefined
  syncStatus: SyncStatus
}

const UPCOMING_PROJECTS = ['paradex']

export async function getScalingCostsEntries(
  tvl: Record<ProjectId, number>,
  timeRange: CostsTimeRange,
): Promise<ScalingCostsEntry[]> {
  const implementationChange = await getImplementationChangeReport()
  const projects = getIncluded(layer2s)
  const latestCosts = await getLatestCosts(projects, timeRange)
  const orderedProjects = orderByTvl(projects, tvl)

  return orderedProjects
    .map((project) => {
      const costs = latestCosts[project.id]

      return {
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
        data: costs
          ? {
              ...withTotal(costs),
              syncStatus: getSyncStatus(costs.syncedUntil),
              txCount: random(true) * 1000000000,
            }
          : undefined,
        costsWarning: project.display.costsWarning,
      }
    })
    .filter(notUndefined)
}

function getSyncStatus(syncedUntil: UnixTime) {
  const isSynced = UnixTime.now()
    .add(-1, 'days')
    .add(-1, 'hours')
    .lte(syncedUntil)

  return { isSynced, syncedUntil: syncedUntil.toNumber() }
}

function withTotal(data: LatestCostsProjectResponse) {
  return {
    gas: {
      ...data.gas,
      total:
        data.gas.overhead +
        data.gas.calldata +
        data.gas.compute +
        (data.gas.blobs ?? 0),
    },
    eth: {
      ...data.eth,
      total:
        data.eth.overhead +
        data.eth.calldata +
        data.eth.compute +
        (data.eth.blobs ?? 0),
    },
    usd: {
      ...data.usd,
      total:
        data.usd.overhead +
        data.usd.calldata +
        data.usd.compute +
        (data.usd.blobs ?? 0),
    },
  }
}

function getIncluded(projects: Layer2[]) {
  return projects.filter(
    (p) =>
      (!p.isArchived &&
        !p.isUpcoming &&
        (p.display.category === 'Optimistic Rollup' ||
          p.display.category === 'ZK Rollup')) ||
      UPCOMING_PROJECTS.includes(p.id.toString()),
  )
}
