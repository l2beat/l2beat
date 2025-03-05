import {
  SHARP_SUBMISSION_ADDRESS,
  SHARP_SUBMISSION_SELECTOR,
  type TrackedTxConfigEntry,
} from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { PROJECT_COUNTDOWNS } from '../../global/countdowns'
import { tokenList } from '../../tokens/tokens'
import type {
  BaseProject,
  Bridge,
  Layer2,
  Layer2TxConfig,
  Layer3,
  ProjectCostsInfo,
  ProjectDiscoveryInfo,
  ProjectEscrow,
  ProjectLivenessInfo,
  ProjectTvlConfig,
  ProjectTvlEscrow,
} from '../../types'
import {
  areContractsDiscoveryDriven,
  arePermissionsDiscoveryDriven,
} from '../../utils/discoveryDriven'
import { isVerified } from '../../verification/isVerified'
import { badgesCompareFn } from '../badges'
import { bridges } from '../bridges'
import { layer2s } from '../layer2s'
import { layer3s } from '../layer3s'
import { refactored } from '../refactored'
import { getHostChain } from './utils/getHostChain'
import { getRaas } from './utils/getRaas'
import { getStage } from './utils/getStage'
import { isUnderReview } from './utils/isUnderReview'

export function getProjects(): BaseProject[] {
  return refactored
    .concat(layer2s.map((p) => layer2Or3ToProject(p, [])))
    .concat(layer3s.map((p) => layer2Or3ToProject(p, layer2s)))
    .concat(bridges.map(bridgeToProject))
}

function layer2Or3ToProject(
  p: Layer2 | Layer3,
  layer2s: Layer2[],
): BaseProject {
  return {
    id: p.id,
    name: p.display.name,
    shortName: p.display.shortName,
    slug: p.display.slug,
    addedAt: p.addedAt,
    // data
    statuses: {
      yellowWarning: p.display.headerWarning,
      redWarning: p.display.redWarning,
      isUnderReview: isUnderReview(p),
      isUnverified: !isVerified(p),
      // countdowns
      otherMigration:
        p.reasonsForBeingOther && p.display.category !== 'Other'
          ? {
              expiresAt: PROJECT_COUNTDOWNS.otherMigration.toNumber(),
              pretendingToBe: p.display.category,
              reasons: p.reasonsForBeingOther,
            }
          : undefined,
    },
    display: {
      description: p.display.description,
      links: p.display.links,
      badges: p.badges ?? [],
    },
    contracts: p.contracts,
    permissions: p.permissions,
    discoveryInfo: getDiscoveryInfo(p),
    scalingInfo: {
      layer: p.type,
      type: p.display.category,
      capability: p.capability,
      isOther:
        p.display.category === 'Other' ||
        (PROJECT_COUNTDOWNS.otherMigration.lt(UnixTime.now()) &&
          !!p.reasonsForBeingOther),
      hostChain: getHostChain(
        p.type === 'layer2' ? ProjectId.ETHEREUM : p.hostChain,
      ),
      reasonsForBeingOther: p.reasonsForBeingOther,
      stack: p.display.stack,
      raas: getRaas(p.badges),
      daLayer: p.dataAvailability?.layer.value ?? 'Unknown',
      stage: getStage(p.stage),
      purposes: p.display.purposes,
      badges:
        p.badges && p.badges.length > 0
          ? p.badges.sort(badgesCompareFn)
          : undefined,
    },
    scalingStage: p.stage,
    scalingRisks: {
      self: p.riskView,
      host:
        p.type === 'layer3'
          ? layer2s.find((x) => x.id === p.hostChain)?.riskView
          : undefined,
      stacked: p.type === 'layer3' ? p.stackedRiskView : undefined,
    },
    scalingDa: p.dataAvailability,
    scalingTechnology: {
      warning: p.display.warning,
      detailedDescription: p.display.detailedDescription,
      architectureImage: p.display.architectureImage,
      ...p.technology,
      sequencingImage: p.display.sequencingImage,
      stateDerivation: p.stateDerivation,
      stateValidation: p.stateValidation,
      stateValidationImage: p.display.stateValidationImage,
      upgradesAndGovernance:
        p.type === 'layer2' ? p.upgradesAndGovernance : undefined,
      upgradesAndGovernanceImage: p.display.upgradesAndGovernanceImage,
    },
    customDa: p.customDa,
    tvlInfo: {
      associatedTokens: p.config.associatedTokens ?? [],
      warnings: [p.display.tvlWarning].filter((x) => x !== undefined),
    },
    tvlConfig: getTvlConfig(p),
    activityConfig: p.config.activityConfig,
    livenessInfo: getLivenessInfo(p),
    livenessConfig: p.type === 'layer2' ? p.config.liveness : undefined,
    costsInfo: getCostsInfo(p),
    ...getFinality(p),
    trackedTxsConfig: toBackendTrackedTxsConfig(
      p.id,
      p.type === 'layer2' ? p.config.trackedTxs : undefined,
    ),
    proofVerification: p.stateValidation?.proofVerification,
    chainConfig: p.chainConfig,
    milestones: p.milestones,
    daTrackingConfig: p.config.daTracking,
    // tags
    isScaling: true,
    isZkCatalog: p.stateValidation?.proofVerification ? true : undefined,
    isArchived: p.isArchived ? true : undefined,
    isUpcoming: p.isUpcoming ? true : undefined,
    hasActivity: p.config.activityConfig ? true : undefined,
  }
}

function getLivenessInfo(p: Layer2 | Layer3): ProjectLivenessInfo | undefined {
  if (p.type === 'layer2' && p.config.trackedTxs !== undefined) {
    return p.display.liveness ?? {}
  }
}

function getCostsInfo(p: Layer2 | Layer3): ProjectCostsInfo | undefined {
  if (
    p.type === 'layer2' &&
    (p.display.category === 'Optimistic Rollup' ||
      p.display.category === 'ZK Rollup') &&
    p.config.trackedTxs !== undefined
  ) {
    return {
      warning: p.display.costsWarning,
    }
  }
}

function getFinality(
  p: Layer2 | Layer3,
): Pick<BaseProject, 'finalityConfig' | 'finalityInfo'> {
  if (
    p.type === 'layer2' &&
    (p.display.category === 'Optimistic Rollup' ||
      p.display.category === 'ZK Rollup') &&
    p.config.trackedTxs !== undefined &&
    p.config.finality !== undefined
  ) {
    return {
      finalityInfo: p.display.finality ?? {},
      finalityConfig: p.config.finality,
    }
  }
  return {}
}

function bridgeToProject(p: Bridge): BaseProject {
  return {
    id: p.id,
    name: p.display.name,
    shortName: p.display.shortName,
    slug: p.display.slug,
    addedAt: p.addedAt,
    // data
    statuses: {
      yellowWarning: p.display.warning,
      redWarning: undefined,
      isUnderReview: isUnderReview(p),
      isUnverified: !isVerified(p),
    },
    display: {
      description: p.display.description,
      links: p.display.links,
      badges: [],
    },
    bridgeInfo: {
      category: p.display.category,
      destination: p.technology.destination,
      validatedBy: p.riskView.validatedBy.value,
    },
    contracts: p.contracts,
    permissions: p.permissions,
    discoveryInfo: getDiscoveryInfo(p),
    bridgeRisks: p.riskView,
    tvlInfo: {
      associatedTokens: p.config.associatedTokens ?? [],
      warnings: [],
    },
    tvlConfig: getTvlConfig(p),
    chainConfig: p.chainConfig,
    milestones: p.milestones,
    // tags
    isBridge: true,
    isArchived: p.isArchived ? true : undefined,
    isUpcoming: p.isUpcoming ? true : undefined,
  }
}

function toBackendTrackedTxsConfig(
  projectId: ProjectId,
  configs: Layer2TxConfig[] | undefined,
): Omit<TrackedTxConfigEntry, 'id'>[] | undefined {
  if (configs === undefined) return

  return configs.flatMap((config) =>
    config.uses.map((use) => {
      const base = {
        projectId,
        sinceTimestamp: config.query.sinceTimestamp.toNumber(),
        untilTimestamp: config.query.untilTimestamp?.toNumber(),
        type: use.type,
        subtype: use.subtype,
        costMultiplier:
          use.type === 'l2costs' ? config._hackCostMultiplier : undefined,
      }

      switch (config.query.formula) {
        case 'functionCall': {
          return {
            ...base,
            params: {
              formula: 'functionCall',
              address: config.query.address,
              selector: config.query.selector,
              signature: config.query.functionSignature,
            },
          }
        }
        case 'transfer': {
          return {
            ...base,
            params: {
              formula: 'transfer',
              from: config.query.from,
              to: config.query.to,
            },
          }
        }
        case 'sharpSubmission': {
          return {
            ...base,
            params: {
              formula: 'sharpSubmission',
              address: SHARP_SUBMISSION_ADDRESS,
              selector: SHARP_SUBMISSION_SELECTOR,
              programHashes: config.query.programHashes,
            },
          }
        }
        case 'sharedBridge': {
          return {
            ...base,
            params: {
              formula: 'sharedBridge',
              address: config.query.address,
              signature: config.query.functionSignature,
              selector: config.query.selector,
              chainId: config.query.chainId,
            },
          }
        }
      }
    }),
  )
}

function getTvlConfig(project: Layer2 | Layer3 | Bridge): ProjectTvlConfig {
  const tokens = project.chainConfig
    ? tokenList.filter(
        (t) =>
          t.supply !== 'zero' && t.chainId === project.chainConfig?.chainId,
      )
    : []

  return {
    escrows: project.config.escrows.map(toProjectEscrow),
    tokens,
    associatedTokens: project.config.associatedTokens ?? [],
  }
}

export function getDiscoveryInfo(
  project: Layer2 | Layer3 | Bridge,
): ProjectDiscoveryInfo {
  const contractsDiscoDriven = areContractsDiscoveryDriven(project.contracts)
  const permissionsDiscoDriven = arePermissionsDiscoveryDriven(
    project.permissions,
  )

  return {
    contractsDiscoDriven,
    permissionsDiscoDriven,
    isDiscoDriven: contractsDiscoDriven && permissionsDiscoDriven,
  }
}

function toProjectEscrow(escrow: ProjectEscrow): ProjectTvlEscrow {
  return {
    address: escrow.address,
    sinceTimestamp: escrow.sinceTimestamp,
    chain: escrow.chain,
    includeInTotal: escrow.includeInTotal,
    source: escrow.source,
    bridgedUsing: escrow.bridgedUsing,
    sharedEscrow: escrow.sharedEscrow,
    tokens: tokenList
      .filter(
        (token) =>
          token.chainId === escrow.chainId &&
          (escrow.tokens === '*' || escrow.tokens.includes(token.symbol)) &&
          !escrow.excludedTokens?.includes(token.symbol) &&
          !token.untilTimestamp?.lt(escrow.sinceTimestamp),
      )
      .map((token) => ({
        ...token,
        isPreminted: !!escrow.premintedTokens?.includes(token.symbol),
      })),
  }
}
