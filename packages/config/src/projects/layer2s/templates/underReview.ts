import { ProjectId } from '@l2beat/shared-pure'

import {
  CONTRACTS,
  ChainConfig,
  ScalingProjectEscrow,
  ScalingProjectTransactionApi,
  TECHNOLOGY,
  UNDER_REVIEW_RISK_VIEW,
} from '../../../common'
import { BadgeId } from '../../badges'
import { type Layer3, type Layer3Display } from '../../layer3s'
import { type Layer2, type Layer2Display } from '../types'

export interface UnderReviewConfigCommon {
  id: string
  rpcUrl?: string
  escrows?: ScalingProjectEscrow[]
  chainConfig?: ChainConfig
  transactionApi?: ScalingProjectTransactionApi
  badges?: BadgeId[]
}

export interface UnderReviewConfigL2 extends UnderReviewConfigCommon {
  display: Omit<Layer2Display, 'dataAvailabilityMode'>
  associatedTokens?: string[]
}

export interface UnderReviewConfigL3 extends UnderReviewConfigCommon {
  display: Omit<Layer3Display, 'dataAvailabilityMode'>
  hostChain: Layer3['hostChain']
  associatedTokens?: string[]
}

export function underReviewL2(templateVars: UnderReviewConfigL2): Layer2 {
  return {
    isUnderReview: true,
    type: 'layer2',
    id: ProjectId(templateVars.id),
    display: {
      ...templateVars.display,
    },
    stage: {
      stage:
        templateVars.display.category === 'Optimistic Rollup' ||
        templateVars.display.category === 'ZK Rollup'
          ? 'NotApplicable'
          : 'UnderReview',
    },
    config: {
      associatedTokens: templateVars.associatedTokens,
      escrows: templateVars.escrows ?? [],
      transactionApi:
        templateVars.transactionApi ??
        (templateVars.rpcUrl !== undefined
          ? {
              type: 'rpc',
              startBlock: 1,
              defaultUrl: templateVars.rpcUrl,
              defaultCallsPerMinute: 1500,
            }
          : undefined),
    },
    riskView: UNDER_REVIEW_RISK_VIEW,
    technology: TECHNOLOGY.UNDER_REVIEW,
    contracts: CONTRACTS.UNDER_REVIEW,
    chainConfig: templateVars.chainConfig,
    badges: templateVars.badges,
  }
}

export function underReviewL3(templateVars: UnderReviewConfigL3): Layer3 {
  return {
    type: 'layer3',
    isUnderReview: true,
    id: ProjectId(templateVars.id),
    hostChain: templateVars.hostChain,
    display: {
      ...templateVars.display,
    },
    config: {
      associatedTokens: templateVars.associatedTokens,
      escrows: templateVars.escrows ?? [],
      transactionApi:
        templateVars.transactionApi ??
        (templateVars.rpcUrl !== undefined
          ? {
              type: 'rpc',
              startBlock: 1,
              defaultUrl: templateVars.rpcUrl,
              defaultCallsPerMinute: 1500,
            }
          : undefined),
    },
    riskView: UNDER_REVIEW_RISK_VIEW,
    stackedRiskView: UNDER_REVIEW_RISK_VIEW,
    technology: TECHNOLOGY.UNDER_REVIEW,
    contracts: CONTRACTS.UNDER_REVIEW,
    chainConfig: templateVars.chainConfig,
    badges: templateVars.badges,
  }
}
