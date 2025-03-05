import { ProjectId, type UnixTime } from '@l2beat/shared-pure'
import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from '../../../common'
import type { Layer3 } from '../../../internalTypes'
import type { Layer2, Layer2Display } from '../../../internalTypes'
import type {
  Badge,
  ChainConfig,
  ScalingProjectCapability,
} from '../../../types'
import type { ScalingProjectDisplay } from '../../../internalTypes'

export interface UpcomingConfigL2 {
  id: string
  addedAt: UnixTime
  display: Layer2Display
  capability: ScalingProjectCapability
  badges?: Badge[]
  chainConfig?: ChainConfig
}

export interface UpcomingConfigL3 {
  id: string
  addedAt: UnixTime
  display: ScalingProjectDisplay
  capability: ScalingProjectCapability
  hostChain: Layer3['hostChain']
  badges?: Badge[]
}

export function upcomingL2(templateVars: UpcomingConfigL2): Layer2 {
  return {
    isUpcoming: true,
    type: 'layer2',
    id: ProjectId(templateVars.id),
    addedAt: templateVars.addedAt,
    capability: templateVars.capability,
    display: templateVars.display,
    stage: {
      stage: 'NotApplicable',
    },
    config: {
      escrows: [],
    },
    chainConfig: templateVars.chainConfig,
    riskView: UPCOMING_RISK_VIEW,
    technology: TECHNOLOGY.UPCOMING,
    contracts: CONTRACTS.EMPTY,
    badges: templateVars.badges,
  }
}

export function upcomingL3(templateVars: UpcomingConfigL3): Layer3 {
  return {
    isUpcoming: true,
    type: 'layer3',
    id: ProjectId(templateVars.id),
    addedAt: templateVars.addedAt,
    capability: templateVars.capability,
    display: {
      ...templateVars.display,
    },
    hostChain: templateVars.hostChain,
    config: {
      escrows: [],
    },
    stage: { stage: 'NotApplicable' },
    riskView: UPCOMING_RISK_VIEW,
    stackedRiskView: UPCOMING_RISK_VIEW,
    technology: TECHNOLOGY.UPCOMING,
    contracts: CONTRACTS.EMPTY,
    badges: templateVars.badges,
  }
}
