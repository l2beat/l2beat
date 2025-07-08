import { ProjectId, type UnixTime } from '@l2beat/shared-pure'
import { UPCOMING_RISK_VIEW } from '../common'
import type { ProjectScalingDisplay, ScalingProject } from '../internalTypes'
import type {
  Badge,
  ChainConfig,
  ProjectEcosystemInfo,
  ProjectScalingCapability,
} from '../types'
import { getDiscoveryInfo } from './getDiscoveryInfo'

export interface UpcomingConfigL2 {
  id: string
  addedAt: UnixTime
  display: ProjectScalingDisplay
  capability: ProjectScalingCapability
  badges?: Badge[]
  chainConfig?: ChainConfig
  ecosystemInfo?: ProjectEcosystemInfo
}

export interface UpcomingConfigL3 {
  id: string
  addedAt: UnixTime
  display: ProjectScalingDisplay
  capability: ProjectScalingCapability
  hostChain: ScalingProject['hostChain']
  badges?: Badge[]
  ecosystemInfo?: ProjectEcosystemInfo
}

export function upcomingL2(templateVars: UpcomingConfigL2): ScalingProject {
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
    badges: templateVars.badges,
    discoveryInfo: getDiscoveryInfo([]),
    ecosystemInfo: templateVars.ecosystemInfo,
  }
}

export function upcomingL3(templateVars: UpcomingConfigL3): ScalingProject {
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
    badges: templateVars.badges,
    discoveryInfo: getDiscoveryInfo([]),
    ecosystemInfo: templateVars.ecosystemInfo,
  }
}
