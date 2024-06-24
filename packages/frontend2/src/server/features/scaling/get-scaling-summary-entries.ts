import {
  type ScalingProjectPurpose,
  layer2s as LAYER_2S,
  type ScalingProjectCategory,
  type StageConfig,
  type WarningWithSentiment,
  type Layer2,
} from '@l2beat/config'
import { getL2Risks } from '~/app/(new)/scaling/_utils/get-l2-risks'
import { type RosetteValue } from '~/app/_components/rosette/types'
import { getTvlStats } from './utils/get-tvl-stats'
import { getTvlWarnings } from './utils/get-tvl-warnings'
import { getTvlWithChange } from './utils/get-tvl-with-change'
import compact from 'lodash/compact'
import { type TvlResponse } from './get-tvl'
import { orderByTvl } from './utils/order-by-tvl'
import { type TokenBreakdownProps } from '~/app/_components/breakdown/token-breakdown'

export interface ScalingSummaryLayer2sEntry {
  name: string
  shortName: string | undefined
  slug: string
  category: ScalingProjectCategory
  warning: string | undefined
  redWarning: string | undefined
  isVerified: boolean
  showProjectUnderReview: boolean
  hasImplementationChanged: boolean
  purposes: ScalingProjectPurpose[]
  risks: RosetteValue[]
  tvlData: TvlData | undefined
  stage: StageConfig
  // NOTE: It is never to satisfy the type of the data in ProjectNameCell
  syncStatus?: never
}

interface TvlData {
  tvl: number
  tvlBreakdown: TokenBreakdownProps
  tvlWarnings: WarningWithSentiment[]
  sevenDayChange: string
  marketShare: number
  excludedTokens: Omit<TvlData, 'excludedTokens'> | undefined
}

export async function getScalingSummaryEntries(tvl: TvlResponse) {
  const orderedLayer2s = orderByTvl(LAYER_2S, tvl.projects)

  return {
    layer2s: getLayer2s(orderedLayer2s, tvl),
  }
}

function getLayer2s(
  layer2s: Layer2[],
  tvl: TvlResponse,
): ScalingSummaryLayer2sEntry[] {
  const entries = layer2s
    .filter(
      (layer2) =>
        !layer2.isArchived &&
        !layer2.isUpcoming &&
        layer2.config.escrows.length > 0,
    )
    .map((layer2) => {
      const projectTvl = tvl.projects[layer2.id.toString()]
      if (!projectTvl) return undefined

      const associatedTokens = layer2.config.associatedTokens ?? []
      const stats = getTvlStats(
        projectTvl,
        layer2.display.name,
        associatedTokens,
      )
      const { tvl: aggregateTvl } = getTvlWithChange(tvl.layers2s)

      return {
        name: layer2.display.name,
        shortName: layer2.display.shortName,
        slug: layer2.display.slug,
        category: layer2.display.category,
        warning: layer2.display.warning,
        redWarning: layer2.display.redWarning,
        isVerified: true,
        showProjectUnderReview: false,
        hasImplementationChanged: false,
        purposes: layer2.display.purposes,
        risks: getL2Risks(layer2.riskView),
        tvlData: stats
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
    })

  return compact(entries)
}
