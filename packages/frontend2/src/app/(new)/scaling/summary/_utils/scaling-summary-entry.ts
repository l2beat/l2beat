import {
  type Layer2,
  type ScalingProjectCategory,
  type ScalingProjectPurpose,
  type StageConfig,
  type WarningWithSentiment,
} from '@l2beat/config'
import { type TokenBreakdownProps } from '~/app/_components/breakdown/TokenBreakdown'
import { type RosetteValue } from '~/app/_components/rosette/types'
import { getL2Risks } from '../../_utils/get-l2-risks'

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

export interface TvlData {
  tvl: number
  tvlBreakdown: TokenBreakdownProps
  tvlWarnings: WarningWithSentiment[]
  sevenDayChange: string
  marketShare: number
  excludedTokens: Omit<TvlData, 'excludedTokens'> | undefined
}

export function toScalingSummaryEntry(
  layer2: Layer2,
): ScalingSummaryLayer2sEntry {
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
    tvlData: undefined,
    stage: layer2.stage,
  }
}
