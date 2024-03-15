import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from '../../common'
import { Layer2, Layer2Display } from '../types'

export interface UpcomingConfig {
  id: string
  display: Omit<Layer2Display, 'dataAvailabilityMode'>
}

export function upcoming(templateVars: UpcomingConfig): Layer2 {
  return {
    isUpcoming: true,
    type: 'layer2',
    id: ProjectId(templateVars.id),
    display: {
      ...templateVars.display,
    },
    stage: {
      stage: 'NotApplicable',
    },
    config: {
      escrows: [],
    },
    riskView: UPCOMING_RISK_VIEW,
    technology: TECHNOLOGY.UPCOMING,
    contracts: CONTRACTS.EMPTY,
  }
}
