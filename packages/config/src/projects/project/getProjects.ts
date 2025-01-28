import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { PROJECT_COUNTDOWNS } from '../../common'
import { isVerified } from '../../verification/isVerified'
import { type Bridge, bridges } from '../bridges'
import { type DaLayer, daLayers } from '../da-beat'
import { type Layer2, type ProjectLivenessInfo, layer2s } from '../layer2s'
import { type Layer3, layer3s } from '../layer3s'
import { refactored } from '../refactored'
import type { BaseProject, ProjectCostsInfo } from './BaseProject'
import { getHostChain } from './utils/getHostChain'
import { getRaas } from './utils/getRaas'
import { getStage } from './utils/getStage'
import { isUnderReview } from './utils/isUnderReview'

export function getProjects(): BaseProject[] {
  return refactored
    .concat(layer2s.map(layer2Or3ToProject))
    .concat(layer3s.map(layer2Or3ToProject))
    .concat(bridges.map(bridgeToProject))
    .concat(daLayers.map(daLayerToProject))
}

function layer2Or3ToProject(p: Layer2 | Layer3): BaseProject {
  const otherMigrationContext = PROJECT_COUNTDOWNS.otherMigration.getContext(p)
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
      otherMigration: otherMigrationContext
        ? {
            expiresAt: PROJECT_COUNTDOWNS.otherMigration.expiresAt.toNumber(),
            pretendingToBe: p.display.category,
            reasons: otherMigrationContext.reasonsForBeingOther,
          }
        : undefined,
    },
    scalingInfo: {
      layer: p.type,
      type: p.display.category,
      capability: p.capability,
      isOther:
        p.display.category === 'Other' ||
        (PROJECT_COUNTDOWNS.otherMigration.expiresAt.lt(UnixTime.now()) &&
          !!p.reasonsForBeingOther &&
          p.reasonsForBeingOther.length > 0),
      hostChain: getHostChain(
        p.type === 'layer2' ? ProjectId.ETHEREUM : p.hostChain,
      ),
      reasonsForBeingOther: p.reasonsForBeingOther,
      stack: p.display.stack,
      raas: getRaas(p.badges),
      daLayer: p.dataAvailability?.layer.value ?? 'Unknown',
      stage: getStage(p.stage),
      purposes: p.display.purposes,
    },
    scalingStage: p.stage,
    scalingRisks: {
      self: p.riskView,
      host: undefined,
      stacked: undefined,
    },
    scalingDa: p.dataAvailability,
    tvlInfo: {
      associatedTokens: p.config.associatedTokens ?? [],
      warnings: [p.display.tvlWarning].filter((x) => x !== undefined),
    },
    livenessInfo: getLivenessInfo(p),
    costsInfo: getCostsInfo(p),
    ...getFinality(p),
    proofVerification: p.stateValidation?.proofVerification,
    // tags
    isScaling: true,
    isZkCatalog: p.stateValidation?.proofVerification ? true : undefined,
    isArchived: p.isArchived ? true : undefined,
    isUpcoming: p.isUpcoming ? true : undefined,
    hasActivity: p.config.transactionApi ? true : undefined,
  }
}

function getLivenessInfo(p: Layer2 | Layer3): ProjectLivenessInfo | undefined {
  if (
    p.type === 'layer2' &&
    (p.display.category === 'Optimistic Rollup' ||
      p.display.category === 'ZK Rollup') &&
    p.config.trackedTxs !== undefined
  ) {
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
    bridgeInfo: {
      category: p.display.category,
      destination: p.technology.destination,
      validatedBy: p.riskView.validatedBy.value,
    },
    bridgeRisks: p.riskView,
    tvlInfo: {
      associatedTokens: p.config.associatedTokens ?? [],
      warnings: [],
    },
    // tags
    isBridge: true,
    isArchived: p.isArchived ? true : undefined,
    isUpcoming: p.isUpcoming ? true : undefined,
  }
}

function daLayerToProject(p: DaLayer): BaseProject {
  return {
    id: ProjectId(`${p.id}-da-layer`),
    slug: p.display.slug,
    name: p.display.name,
    shortName: undefined,
    addedAt: UnixTime.ZERO,
    // data
    statuses: {
      yellowWarning: undefined,
      redWarning: undefined,
      isUnderReview: !!p.isUnderReview,
      isUnverified: !isVerified(p),
    },
    daBridges: p.bridges,
    // tags
    isDaLayer: true,
    isUpcoming: p.isUpcoming ? true : undefined,
  }
}
