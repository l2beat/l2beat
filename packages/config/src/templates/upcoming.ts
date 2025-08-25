import { ProjectId, type UnixTime } from '@l2beat/shared-pure'
import { UPCOMING_RISK_VIEW } from '../common'
import type { ProjectScalingDisplay, ScalingProject } from '../internalTypes'
import type {
  Badge,
  ChainConfig,
  ProjectEcosystemInfo,
  ProjectScalingCapability,
  ProjectScalingProofSystem,
} from '../types'
import { getDiscoveryInfo } from './getDiscoveryInfo'

interface UpcomingConfigCommon {
  id: string
  addedAt: UnixTime
  hasTestnet?: true
  display: ProjectScalingDisplay
  capability: ProjectScalingCapability
  badges?: Badge[]
  ecosystemInfo?: ProjectEcosystemInfo
  proofSystem: ProjectScalingProofSystem | undefined
}
export interface UpcomingConfigL2 extends UpcomingConfigCommon {
  chainConfig?: ChainConfig
}

export interface UpcomingConfigL3 extends UpcomingConfigCommon {
  hostChain: ScalingProject['hostChain']
}

export function upcomingL2(templateVars: UpcomingConfigL2): ScalingProject {
  return {
    isUpcoming: true,
    type: 'layer2',
    id: ProjectId(templateVars.id),
    addedAt: templateVars.addedAt,
    capability: templateVars.capability,
    hasTestnet: templateVars.hasTestnet,
    display: templateVars.display,
    proofSystem: templateVars.proofSystem,
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
    dataAvailability: undefined,
  }
}

export function upcomingL3(templateVars: UpcomingConfigL3): ScalingProject {
  return {
    isUpcoming: true,
    type: 'layer3',
    id: ProjectId(templateVars.id),
    addedAt: templateVars.addedAt,
    hasTestnet: templateVars.hasTestnet,
    capability: templateVars.capability,
    display: {
      ...templateVars.display,
    },
    hostChain: templateVars.hostChain,
    proofSystem: templateVars.proofSystem,
    config: {
      escrows: [],
    },
    stage: { stage: 'NotApplicable' },
    riskView: UPCOMING_RISK_VIEW,
    stackedRiskView: UPCOMING_RISK_VIEW,
    badges: templateVars.badges,
    discoveryInfo: getDiscoveryInfo([]),
    ecosystemInfo: templateVars.ecosystemInfo,
    dataAvailability: undefined,
  }
}
