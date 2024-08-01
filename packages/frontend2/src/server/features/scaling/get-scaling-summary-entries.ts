import {
  layer2s as LAYER_2S,
  layer3s as LAYER_3S,
  type Layer2,
  type Layer3,
} from '@l2beat/config'
import {
  assert,
  type ImplementationChangeReportApiResponse,
  type ProjectsVerificationStatuses,
} from '@l2beat/shared-pure'
import compact from 'lodash/compact'
import { getL2Risks } from '~/app/(new)/(other)/scaling/_utils/get-l2-risks'
import { getImplementationChangeReport } from '../implementation-change-report/get-implementation-change-report'
import { orderByTvl } from '../tvl/order-by-tvl'
import { getProjectsVerificationStatuses } from '../verification-status/get-projects-verification-statuses'
import { getCommonScalingEntry } from './get-common-scaling-entry'
import { type TvlResponse } from './get-tvl'
import {
  type ScalingSummaryLayer2sEntry,
  type ScalingSummaryLayer3sEntry,
} from './types'
import { getTvlStats } from './utils/get-tvl-stats'
import { getTvlWarnings } from './utils/get-tvl-warnings'
import { getTvlWithChange } from './utils/get-tvl-with-change'

export async function getScalingSummaryEntries(tvl: TvlResponse) {
  // NOTE: This is a temporary solution to keep the current behavior & will be removed in L2B-6115.
  const preprocessedTvl = Object.fromEntries(
    Object.entries(tvl.projects).map(([projectId, data]) => [
      projectId,
      data.charts.hourly.data.at(-1)?.[1] ?? 0,
    ]),
  )
  const orderedLayer2s = orderByTvl(LAYER_2S, preprocessedTvl)
  const orderedLayer3s = orderByTvl(LAYER_3S, preprocessedTvl)

  const implementationChangeReport = await getImplementationChangeReport()
  const projectsVerificationStatuses = await getProjectsVerificationStatuses()

  return {
    layer2s: getLayer2s({
      projects: orderedLayer2s,
      tvl,
      implementationChangeReport,
      projectsVerificationStatuses,
    }),
    layer3s: getLayer3s({
      projects: orderedLayer3s,
      tvl,
      implementationChangeReport,
      projectsVerificationStatuses,
    }),
  }
}

interface Params<T> {
  projects: T[]
  tvl: TvlResponse
  implementationChangeReport: ImplementationChangeReportApiResponse
  projectsVerificationStatuses: ProjectsVerificationStatuses
}

function getLayer2s(params: Params<Layer2>): ScalingSummaryLayer2sEntry[] {
  const {
    projects,
    tvl,
    implementationChangeReport,
    projectsVerificationStatuses,
  } = params
  const entries = projects.map((layer2) => {
    const projectTvl = tvl.projects[layer2.id.toString()]

    const associatedTokens = layer2.config.associatedTokens ?? []
    const stats = projectTvl
      ? getTvlStats(projectTvl, layer2.display.name, associatedTokens)
      : undefined
    const { tvl: aggregateTvl } = getTvlWithChange(tvl.layers2s)

    const isVerified = !!projectsVerificationStatuses[layer2.id.toString()]
    const hasImplementationChanged =
      !!implementationChangeReport.projects[layer2.id.toString()]

    const entry: ScalingSummaryLayer2sEntry = {
      entryType: 'summary',
      ...getCommonScalingEntry({
        project: layer2,
        isVerified,
        hasImplementationChanged,
      }),
      risks: getL2Risks(layer2.riskView),
      tvlData:
        stats && projectTvl && escrowsConfigured(layer2)
          ? {
              tvl: stats.latestTvl,
              tvlBreakdown: stats.tvlBreakdown,
              sevenDayChange: stats.sevenDayChange,
              tvlWarnings: getTvlWarnings(projectTvl, layer2, associatedTokens),
              excludedTokens: undefined,
              marketShare: stats.latestTvl / aggregateTvl,
            }
          : undefined,
    }

    return entry
  })

  return compact(entries)
}

function getLayer3s(params: Params<Layer3>): ScalingSummaryLayer3sEntry[] {
  const {
    projects,
    tvl,
    implementationChangeReport,
    projectsVerificationStatuses,
  } = params
  const entries = projects.map((layer3) => {
    const projectTvl = tvl.projects[layer3.id.toString()]
    const associatedTokens = layer3.config.associatedTokens ?? []
    const stats = projectTvl
      ? getTvlStats(projectTvl, layer3.display.name, associatedTokens)
      : undefined

    const hostChainName =
      layer3.hostChain === 'Multiple'
        ? 'Multiple'
        : LAYER_2S.find((l) => l.id === layer3.hostChain)?.display.name
    assert(
      hostChainName !== undefined,
      'Programmer Error: Can not find host chain',
    )

    const isVerified = !!projectsVerificationStatuses[layer3.id.toString()]
    const hasImplementationChanged =
      !!implementationChangeReport.projects[layer3.id.toString()]

    const entry: ScalingSummaryLayer3sEntry = {
      entryType: 'summary',
      ...getCommonScalingEntry({
        project: layer3,
        isVerified,
        hasImplementationChanged,
      }),
      tvlData:
        stats && projectTvl && escrowsConfigured(layer3)
          ? {
              tvl: stats.latestTvl,
              tvlBreakdown: stats.tvlBreakdown,
              sevenDayChange: stats.sevenDayChange,
              tvlWarnings: getTvlWarnings(projectTvl, layer3, associatedTokens),
              excludedTokens: undefined,
            }
          : undefined,
      hostChainName,
    }

    return entry
  })

  return compact(entries)
}

function escrowsConfigured(project: Layer2 | Layer3) {
  return project.config.escrows.length > 0
}
