import {
  layer2s as LAYER_2S,
  layer3s as LAYER_3S,
  type Layer3,
  type Layer2,
} from '@l2beat/config'
import { getL2Risks } from '~/app/(new)/scaling/_utils/get-l2-risks'
import { getTvlStats } from './utils/get-tvl-stats'
import { getTvlWarnings } from './utils/get-tvl-warnings'
import { getTvlWithChange } from './utils/get-tvl-with-change'
import compact from 'lodash/compact'
import { type TvlResponse } from './get-tvl'
import { orderByTvl } from './utils/order-by-tvl'
import {
  type ScalingSummaryLayer2sEntry,
  type ScalingSummaryLayer3sEntry,
} from './types'
import { assert } from '@l2beat/shared-pure'

export async function getScalingSummaryEntries(tvl: TvlResponse) {
  const orderedLayer2s = orderByTvl(LAYER_2S, tvl.projects)
  const orderedLayer3s = orderByTvl(LAYER_3S, tvl.projects)

  return {
    layer2s: getLayer2s(orderedLayer2s, tvl),
    layer3s: getLayer3s(orderedLayer3s, tvl),
  }
}

function getLayer2s(
  layer2s: Layer2[],
  tvl: TvlResponse,
): ScalingSummaryLayer2sEntry[] {
  const entries = layer2s.map((layer2) => {
    const projectTvl = tvl.projects[layer2.id.toString()]

    const associatedTokens = layer2.config.associatedTokens ?? []
    const stats = projectTvl
      ? getTvlStats(projectTvl, layer2.display.name, associatedTokens)
      : undefined
    const { tvl: aggregateTvl } = getTvlWithChange(tvl.layers2s)

    const entry: ScalingSummaryLayer2sEntry = {
      name: layer2.display.name,
      shortName: layer2.display.shortName,
      slug: layer2.display.slug,
      href: `/scaling/projects/${layer2.display.slug}`,
      type: {
        category: layer2.display.category,
        provider: layer2.display.provider,
      },
      warning: layer2.display.warning,
      redWarning: layer2.display.redWarning,
      isVerified: true,
      showProjectUnderReview: false,
      hasImplementationChanged: false,
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

function getLayer3s(
  layer3s: Layer3[],
  tvl: TvlResponse,
): ScalingSummaryLayer3sEntry[] {
  const entries = layer3s.map((layer3) => {
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

    const entry: ScalingSummaryLayer3sEntry = {
      name: layer3.display.name,
      shortName: layer3.display.shortName,
      slug: layer3.display.slug,
      href: `/scaling/projects/${layer3.display.slug}`,
      type: {
        category: layer3.display.category,
        provider: layer3.display.provider,
      },
      warning: layer3.display.warning,
      redWarning: layer3.display.redWarning,
      isVerified: true,
      showProjectUnderReview: false,
      hasImplementationChanged: false,
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
