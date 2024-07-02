import {
  layer2s as LAYER_2S,
  layer3s as LAYER_3S,
  type Layer2,
  type Layer3,
} from '@l2beat/config'
import {
  assert,
  type ImplementationChangeReportApiResponse,
  type VerificationStatus,
} from '@l2beat/shared-pure'
import compact from 'lodash/compact'
import { getL2Risks } from '~/app/(new)/(other)/scaling/_utils/get-l2-risks'
import { getImplementationChangeReport } from '../implementation-change-report/get-implementation-change-report'
import { getVerificationStatus } from '../verification-status/get-verification-status'
import { type TvlResponse } from './get-tvl'
import {
  type ScalingSummaryLayer2sEntry,
  type ScalingSummaryLayer3sEntry,
} from './types'
import { getTvlStats } from './utils/get-tvl-stats'
import { getTvlWarnings } from './utils/get-tvl-warnings'
import { getTvlWithChange } from './utils/get-tvl-with-change'
import { isAnySectionUnderReview } from './utils/is-any-section-under-review'
import { orderByTvl } from './utils/order-by-tvl'

export async function getScalingSummaryEntries(tvl: TvlResponse) {
  const orderedLayer2s = orderByTvl(LAYER_2S, tvl.projects)
  const orderedLayer3s = orderByTvl(LAYER_3S, tvl.projects)

  const implementationChangeReport = await getImplementationChangeReport()
  const verificationStatus = await getVerificationStatus()

  return {
    layer2s: getLayer2s({
      projects: orderedLayer2s,
      tvl,
      implementationChangeReport,
      verificationStatus,
    }),
    layer3s: getLayer3s({
      projects: orderedLayer3s,
      tvl,
      implementationChangeReport,
      verificationStatus,
    }),
  }
}

interface Params<T> {
  projects: T[]
  tvl: TvlResponse
  implementationChangeReport: ImplementationChangeReportApiResponse
  verificationStatus: VerificationStatus
}

function getLayer2s(params: Params<Layer2>): ScalingSummaryLayer2sEntry[] {
  const { projects, tvl, implementationChangeReport, verificationStatus } =
    params
  const entries = projects.map((layer2) => {
    const projectTvl = tvl.projects[layer2.id.toString()]

    const associatedTokens = layer2.config.associatedTokens ?? []
    const stats = projectTvl
      ? getTvlStats(projectTvl, layer2.display.name, associatedTokens)
      : undefined
    const { tvl: aggregateTvl } = getTvlWithChange(tvl.layers2s)

    const isVerified = !!verificationStatus.projects[layer2.id.toString()]
    const hasImplementationChanged =
      !!implementationChangeReport.projects[layer2.id.toString()]

    const entry: ScalingSummaryLayer2sEntry = {
      type: 'layer2',
      name: layer2.display.name,
      shortName: layer2.display.shortName,
      slug: layer2.display.slug,
      href: `/scaling/projects/${layer2.display.slug}`,
      category: layer2.display.category,
      provider: layer2.display.provider,
      warning: layer2.display.warning,
      redWarning: layer2.display.redWarning,
      isVerified,
      showProjectUnderReview: isAnySectionUnderReview(layer2),
      hasImplementationChanged,
      isUpcoming: !!layer2.isUpcoming,
      isArchived: !!layer2.isArchived,
      purposes: layer2.display.purposes,
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
      stage: layer2.stage,
    }

    return entry
  })

  return compact(entries)
}

function getLayer3s(params: Params<Layer3>): ScalingSummaryLayer3sEntry[] {
  const { projects, tvl, implementationChangeReport, verificationStatus } =
    params
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

    const isVerified = !!verificationStatus.projects[layer3.id.toString()]
    const hasImplementationChanged =
      !!implementationChangeReport.projects[layer3.id.toString()]

    const entry: ScalingSummaryLayer3sEntry = {
      type: 'layer3',
      name: layer3.display.name,
      shortName: layer3.display.shortName,
      slug: layer3.display.slug,
      href: `/scaling/projects/${layer3.display.slug}`,
      category: layer3.display.category,
      provider: layer3.display.provider,
      warning: layer3.display.warning,
      redWarning: layer3.display.redWarning,
      isVerified,
      showProjectUnderReview: isAnySectionUnderReview(layer3),
      hasImplementationChanged,
      isUpcoming: !!layer3.isUpcoming,
      isArchived: !!layer3.isArchived,
      purposes: layer3.display.purposes,
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
