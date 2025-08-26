import { ProjectId, type UnixTime } from '@l2beat/shared-pure'
import { CONTRACTS, TECHNOLOGY, UNDER_REVIEW_RISK_VIEW } from '../common'
import type { ProjectScalingDisplay, ScalingProject } from '../internalTypes'
import type {
  Badge,
  ChainConfig,
  ProjectActivityConfig,
  ProjectDiscoveryInfo,
  ProjectEcosystemInfo,
  ProjectEscrow,
  ProjectScalingCapability,
  ProjectScalingDa,
  ProjectScalingProofSystem,
} from '../types'
import { getActivityConfig } from './activity'
import { getDiscoveryInfo } from './getDiscoveryInfo'

interface UnderReviewConfigCommon {
  id: string
  addedAt: UnixTime
  hasTestnet?: true
  capability: ProjectScalingCapability
  ecosystemInfo?: ProjectEcosystemInfo
  activityConfig?: ProjectActivityConfig
  proofSystem: ProjectScalingProofSystem | undefined
  escrows?: ProjectEscrow[]
  chainConfig?: ChainConfig
  badges?: Badge[]
  archivedAt?: UnixTime
  discoveryInfo?: ProjectDiscoveryInfo
  dataAvailability: ProjectScalingDa | undefined
}

export interface UnderReviewConfigL2 extends UnderReviewConfigCommon {
  display: ProjectScalingDisplay
  associatedTokens?: string[]
}

export interface UnderReviewConfigL3 extends UnderReviewConfigCommon {
  display: ProjectScalingDisplay
  hostChain: ScalingProject['hostChain']
  associatedTokens?: string[]
}

export function underReviewL2(
  templateVars: UnderReviewConfigL2,
): ScalingProject {
  return {
    reviewStatus: 'initialReview',
    type: 'layer2',
    id: ProjectId(templateVars.id),
    addedAt: templateVars.addedAt,
    hasTestnet: templateVars.hasTestnet,
    capability: templateVars.capability,
    archivedAt: templateVars.archivedAt ?? undefined,
    display: templateVars.display,
    proofSystem: templateVars.proofSystem,
    stage: {
      stage: 'UnderReview',
    },
    config: {
      associatedTokens: templateVars.associatedTokens,
      escrows: templateVars.escrows ?? [],
      activityConfig: getActivityConfig(
        templateVars.activityConfig,
        templateVars.chainConfig,
        {
          type: 'block',
          startBlock: 1,
        },
      ),
    },
    ecosystemInfo: templateVars.ecosystemInfo,
    riskView: UNDER_REVIEW_RISK_VIEW,
    technology: TECHNOLOGY.UNDER_REVIEW,
    contracts: CONTRACTS.UNDER_REVIEW,
    chainConfig: templateVars.chainConfig,
    badges: templateVars.badges,
    discoveryInfo: templateVars.discoveryInfo ?? getDiscoveryInfo([]),
    dataAvailability: templateVars.dataAvailability,
  }
}

export function underReviewL3(
  templateVars: UnderReviewConfigL3,
): ScalingProject {
  return {
    type: 'layer3',
    reviewStatus: 'initialReview',
    id: ProjectId(templateVars.id),
    addedAt: templateVars.addedAt,
    capability: templateVars.capability,
    archivedAt: templateVars.archivedAt ?? undefined,
    hostChain: templateVars.hostChain,
    hasTestnet: templateVars.hasTestnet,
    display: {
      ...templateVars.display,
    },
    proofSystem: templateVars.proofSystem,
    config: {
      associatedTokens: templateVars.associatedTokens,
      escrows: templateVars.escrows ?? [],
      activityConfig: getActivityConfig(
        templateVars.activityConfig,
        templateVars.chainConfig,
        {
          type: 'block',
          startBlock: 1,
        },
      ),
    },
    stage: {
      stage: 'UnderReview',
    },
    ecosystemInfo: templateVars.ecosystemInfo,
    riskView: UNDER_REVIEW_RISK_VIEW,
    stackedRiskView: UNDER_REVIEW_RISK_VIEW,
    technology: TECHNOLOGY.UNDER_REVIEW,
    contracts: CONTRACTS.UNDER_REVIEW,
    chainConfig: templateVars.chainConfig,
    badges: templateVars.badges,
    discoveryInfo: templateVars.discoveryInfo ?? getDiscoveryInfo([]),
    dataAvailability: templateVars.dataAvailability,
  }
}
