import { ProjectId, type UnixTime } from '@l2beat/shared-pure'
import { CONTRACTS, TECHNOLOGY, UNDER_REVIEW_RISK_VIEW } from '../../../common'
import type {
  ProjectScalingDisplay,
  ScalingProject,
} from '../../../internalTypes'
import type {
  Badge,
  ChainConfig,
  ProjectActivityConfig,
  ProjectEscrow,
  ProjectScalingCapability,
} from '../../../types'
import { getActivityConfig } from './activity'

interface UnderReviewConfigCommon {
  id: string
  addedAt: UnixTime
  capability: ProjectScalingCapability
  activityConfig?: ProjectActivityConfig
  escrows?: ProjectEscrow[]
  chainConfig?: ChainConfig
  badges?: Badge[]
  isArchived?: boolean
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
    isUnderReview: true,
    type: 'layer2',
    id: ProjectId(templateVars.id),
    addedAt: templateVars.addedAt,
    capability: templateVars.capability,
    isArchived: templateVars.isArchived ?? undefined,
    display: templateVars.display,
    stage: {
      stage:
        templateVars.display.category === 'Optimistic Rollup' ||
        templateVars.display.category === 'ZK Rollup'
          ? 'UnderReview'
          : 'NotApplicable',
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
    riskView: UNDER_REVIEW_RISK_VIEW,
    technology: TECHNOLOGY.UNDER_REVIEW,
    contracts: CONTRACTS.UNDER_REVIEW,
    chainConfig: templateVars.chainConfig,
    badges: templateVars.badges,
  }
}

export function underReviewL3(
  templateVars: UnderReviewConfigL3,
): ScalingProject {
  return {
    type: 'layer3',
    isUnderReview: true,
    id: ProjectId(templateVars.id),
    addedAt: templateVars.addedAt,
    capability: templateVars.capability,
    isArchived: templateVars.isArchived ?? undefined,
    hostChain: templateVars.hostChain,
    display: {
      ...templateVars.display,
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
    stage: {
      stage:
        templateVars.display.category === 'Optimistic Rollup' ||
        templateVars.display.category === 'ZK Rollup'
          ? 'UnderReview'
          : 'NotApplicable',
    },
    riskView: UNDER_REVIEW_RISK_VIEW,
    stackedRiskView: UNDER_REVIEW_RISK_VIEW,
    technology: TECHNOLOGY.UNDER_REVIEW,
    contracts: CONTRACTS.UNDER_REVIEW,
    chainConfig: templateVars.chainConfig,
    badges: templateVars.badges,
  }
}
