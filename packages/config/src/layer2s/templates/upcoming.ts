import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from '../../common'
import { Layer3, Layer3Display } from '../../layer3s'
import { Layer2, Layer2Display } from '../types'

export interface UpcomingConfigL2 {
  id: string
  display: Omit<Layer2Display, 'dataAvailabilityMode'>
}

export interface UpcomingConfigL3 {
  id: string
  display: Omit<Layer3Display, 'dataAvailabilityMode'>
  hostChain: Layer3['hostChain']
}

export function upcomingL2(templateVars: UpcomingConfigL2): Layer2 {
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

export function upcomingL3(templateVars: UpcomingConfigL3): Layer3 {
  return {
    isUpcoming: true,
    type: 'layer3',
    id: ProjectId(templateVars.id),
    display: {
      ...templateVars.display,
    },
    hostChain: templateVars.hostChain,
    config: {
      escrows: [],
    },
    riskView: UPCOMING_RISK_VIEW,
    technology: TECHNOLOGY.UPCOMING,
    contracts: CONTRACTS.EMPTY,
  }
}
