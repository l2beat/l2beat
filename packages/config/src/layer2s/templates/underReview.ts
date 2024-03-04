import { ProjectId } from '@l2beat/shared-pure'

import {
  CONTRACTS,
  ScalingProjectEscrow,
  TECHNOLOGY,
  UNDER_REVIEW_RISK_VIEW,
} from '../../common'
import { Layer2, Layer2Display } from '../types'

export interface underReviewConfig {
  id: string
  display: Omit<Layer2Display, 'dataAvailabilityMode'>
  escrows: ScalingProjectEscrow[]
  chainConfig?: Layer2['chainConfig']
}

export function underReview(templateVars: underReviewConfig): Layer2 {
  return {
    isUnderReview: true,
    type: 'layer2',
    id: ProjectId(templateVars.id),
    display: {
      ...templateVars.display,
      dataAvailabilityMode: 'NotApplicable',
    },
    stage: {
      stage: 'UnderReview',
    },
    config: {
      escrows: templateVars.escrows,
    },
    riskView: UNDER_REVIEW_RISK_VIEW,
    technology: TECHNOLOGY.UNDER_REVIEW,
    contracts: CONTRACTS.UNDER_REVIEW,
    chainConfig: templateVars.chainConfig,
  }
}
