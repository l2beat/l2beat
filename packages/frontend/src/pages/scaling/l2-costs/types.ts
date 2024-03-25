import {
  DataAvailabilityMode,
  Layer2Provider,
  ScalingProjectCategory,
  ScalingProjectPurpose,
  StageConfig,
} from '@l2beat/config'
import { TvlApiResponse } from '@l2beat/shared-pure'

import {
  L2CostsApiProject,
  L2CostsApiResponse,
} from '../../../build/api/DELETE_THIS_FILE'

export interface L2CostsPagesData {
  tvlApiResponse: TvlApiResponse
  l2CostsApiResponse: L2CostsApiResponse
}

export interface ScalingL2CostsViewEntry {
  name: string
  shortName: string | undefined
  slug: string
  category: ScalingProjectCategory
  dataAvailabilityMode: DataAvailabilityMode | undefined
  provider: Layer2Provider | undefined
  warning: string | undefined
  redWarning: string | undefined
  purposes: ScalingProjectPurpose[]
  stage: StageConfig
  data: L2CostsApiProject
}
