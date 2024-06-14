import {
  Layer2Provider,
  Layer3Provider,
  ScalingProjectCategory,
  ScalingProjectPurpose,
  StageConfig,
  WarningWithSentiment,
} from '@l2beat/config'

import { TokenControl } from '../../../components/chart/TokenControls'
import { RiskValues } from '../../../utils/risks/types'
import { PagesData } from '../../Page'
import { ValueWithDisplayValue } from '../../types'

export interface TvlPagesData
  extends Pick<
    PagesData,
    | 'tvlApiResponse'
    | 'excludedTokensTvlApiResponse'
    | 'implementationChange'
    | 'verificationStatus'
  > {}

export interface ScalingTvlViewEntry {
  type: 'layer2' | 'layer3'
  name: string
  shortName: string | undefined
  slug: string
  riskValues: RiskValues
  category: ScalingProjectCategory
  provider?: Layer2Provider | Layer3Provider
  warning?: string
  redWarning: string | undefined
  tvlWarning?: WarningWithSentiment
  purposes: ScalingProjectPurpose[]
  isArchived?: boolean
  isVerified?: boolean
  hasImplementationChanged?: boolean
  showProjectUnderReview?: boolean
  isUpcoming?: boolean
  data: DetailedTvlData
  stage: StageConfig
}

export interface DetailedTvlData {
  tvl: Omit<TvlDataValue, 'tokens'>
  canonical: TvlDataValue
  external: TvlDataValue
  native: TvlDataValue
  excludedAssociatedTokens: Omit<DetailedTvlData, 'excludedAssociatedTokens'>
  // NOTE: It is never to satisfy the type of the data in ProjectNameCell
  syncStatus?: never
}

interface TvlDataValue extends ValueWithDisplayValue {
  change: string
  tokens: TokenControl[]
}
