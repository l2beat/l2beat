import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { PROJECT_COUNTDOWNS } from '../../common'
import { isVerified } from '../../verification'
import { Bridge, bridges } from '../bridges'
import { Layer2, ProjectLivenessInfo, layer2s } from '../layer2s'
import { Layer3, layer3s } from '../layer3s'
import { DaLayer, daLayers } from '../other'
import { refactored } from '../refactored'
import { Project, ProjectActivityInfo, ProjectCostsInfo } from './Project'
import { getHostChain } from './utils/getHostChain'
import { getRaas } from './utils/getRaas'
import { getStage } from './utils/getStage'
import { isUnderReview } from './utils/isUnderReview'

export function getProjects(): Project[] {
  return refactored
    .concat(layer2s.map(layer2Or3ToProject))
    .concat(layer3s.map(layer2Or3ToProject))
    .concat(bridges.map(bridgeToProject))
    .concat(daLayers.map(daLayerToProject))
}

function layer2Or3ToProject(p: Layer2 | Layer3): Project {
  const otherMigrationContext = PROJECT_COUNTDOWNS.otherMigration.getContext(p)
  return {
    id: p.id,
    name: p.display.name,
    shortName: p.display.shortName,
    slug: p.display.slug,
    addedAt: p.createdAt,
    // data
    statuses: {
      yellowWarning: p.display.headerWarning,
      redWarning: p.display.redWarning,
      isUnderReview: isUnderReview(p),
      isUnverified: !isVerified(p),
    },
    scalingInfo: {
      layer: p.type,
      type: p.display.category,
      isOther:
        p.display.category === 'Other' ||
        (PROJECT_COUNTDOWNS.otherMigration.expiresAt.lt(UnixTime.now()) &&
          !!p.display.reasonsForBeingOther &&
          p.display.reasonsForBeingOther.length > 0),
      hostChain: getHostChain(
        p.type === 'layer2' ? ProjectId.ETHEREUM : p.hostChain,
      ),
      stack: p.display.provider,
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
    activityInfo: getActivityInfo(p),
    ...getFinality(p),
    proofVerification: p.stateValidation?.proofVerification,
    countdowns: otherMigrationContext
      ? {
          otherMigration: {
            expiresAt: PROJECT_COUNTDOWNS.otherMigration.expiresAt.toNumber(),
            pretendingToBe: p.display.category,
            reasons: otherMigrationContext.reasonsForBeingOther,
          },
        }
      : undefined,
    // tags
    isScaling: true,
    isZkCatalog: p.stateValidation?.proofVerification ? true : undefined,
    isArchived: p.isArchived ? true : undefined,
    isUpcoming: p.isUpcoming ? true : undefined,
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

function getActivityInfo(p: Layer2 | Layer3): ProjectActivityInfo | undefined {
  if (p.config.transactionApi) {
    return { dataSource: p.display.activityDataSource }
  }
}

function getFinality(
  p: Layer2 | Layer3,
): Pick<Project, 'finalityConfig' | 'finalityInfo'> {
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

function bridgeToProject(p: Bridge): Project {
  return {
    id: p.id,
    name: p.display.name,
    shortName: p.display.shortName,
    slug: p.display.slug,
    addedAt: p.createdAt,
    // data
    statuses: {
      yellowWarning: p.display.warning,
      redWarning: undefined,
      isUnderReview: isUnderReview(p),
      isUnverified: !isVerified(p),
    },
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

function daLayerToProject(p: DaLayer): Project {
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
