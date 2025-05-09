import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import {
  SHARP_SUBMISSION_ADDRESS,
  SHARP_SUBMISSION_SELECTOR,
  type TrackedTxConfigEntry,
} from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { badgesCompareFn } from '../common/badges'
import { PROJECT_COUNTDOWNS } from '../global/countdowns'
import type { Bridge, Layer2TxConfig, ScalingProject } from '../internalTypes'
import {
  type BaseProject,
  type ProjectCostsInfo,
  type ProjectDiscoveryInfo,
  type ProjectLivenessInfo,
  ProjectTvsConfigSchema,
  type TvsToken,
} from '../types'
import {
  areContractsDiscoveryDriven,
  arePermissionsDiscoveryDriven,
} from '../utils/discoveryDriven'
import { runConfigAdjustments } from './adjustments'
import { bridges } from './bridges'
import { ecosystems } from './ecosystems'
import { isVerified } from './isVerified'
import { layer2s } from './layer2s'
import { layer3s } from './layer3s'
import { refactored } from './refactored'
import { getHostChain } from './utils/getHostChain'
import { getInfrastructure } from './utils/getInfrastructure'
import { getRaas } from './utils/getRaas'
import { getStage } from './utils/getStage'
import { getVM } from './utils/getVM'

export function getProjects(): BaseProject[] {
  runConfigAdjustments()

  const daBridges = refactored.filter((p) => p.daBridge)
  return refactored
    .concat(layer2s.map((p) => layer2Or3ToProject(p, [], daBridges)))
    .concat(layer3s.map((p) => layer2Or3ToProject(p, layer2s, daBridges)))
    .concat(bridges.map((p) => bridgeToProject(p)))
    .concat(ecosystems)
}

function layer2Or3ToProject(
  p: ScalingProject,
  layer2s: ScalingProject[],
  daBridges: BaseProject[],
): BaseProject {
  return {
    id: p.id,
    name: p.display.name,
    shortName: p.display.shortName,
    slug: p.display.slug,
    addedAt: p.addedAt,

    // data
    colors: p.colors,
    statuses: {
      yellowWarning: p.display.headerWarning,
      redWarning: p.display.redWarning,
      emergencyWarning: p.display.emergencyWarning,
      isUnderReview: !!p.isUnderReview,
      isUnverified: !isVerified(p, daBridges),
      // countdowns
      otherMigration:
        p.reasonsForBeingOther && p.display.category !== 'Other'
          ? {
              expiresAt: PROJECT_COUNTDOWNS.otherMigration,
              pretendingToBe: p.display.category,
              reasons: p.reasonsForBeingOther,
            }
          : undefined,
    },
    display: {
      description: p.display.description,
      links: p.display.links,
      badges: (p.badges ?? []).sort(badgesCompareFn),
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
        (PROJECT_COUNTDOWNS.otherMigration < UnixTime.now() &&
          !!p.reasonsForBeingOther),
      hostChain: getHostChain(p.hostChain ?? ProjectId.ETHEREUM),
      reasonsForBeingOther: p.reasonsForBeingOther,
      stack: p.display.stack,
      raas: getRaas(p.badges),
      infrastructure: getInfrastructure(p.badges),
      vm: getVM(p.badges),
      daLayer: p.dataAvailability?.layer.value ?? undefined,
      stage: getStage(p.stage),
      purposes: p.display.purposes,
      scopeOfAssessment: p.scopeOfAssessment,
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
    tvsInfo: {
      associatedTokens: p.config.associatedTokens ?? [],
      warnings: [p.display.tvsWarning].filter((x) => x !== undefined),
    },
    tvsConfig: getTvsConfig(p),
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
    ecosystemInfo: p.ecosystemInfo,
    // tags
    isScaling: true,
    isZkCatalog: p.stateValidation?.proofVerification ? true : undefined,
    archivedAt: p.archivedAt,
    isUpcoming: p.isUpcoming ? true : undefined,
    hasActivity: p.config.activityConfig ? true : undefined,
    escrows: p.config.escrows,
  }
}

function getLivenessInfo(p: ScalingProject): ProjectLivenessInfo | undefined {
  if (p.type === 'layer2' && p.config.trackedTxs !== undefined) {
    return p.display.liveness ?? {}
  }
}

function getCostsInfo(p: ScalingProject): ProjectCostsInfo | undefined {
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
  p: ScalingProject,
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
      emergencyWarning: undefined,
      isUnderReview: !!p.isUnderReview,
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
    bridgeTechnology: {
      ...p.technology,
      detailedDescription: p.display.detailedDescription,
      upgradesAndGovernance: p.upgradesAndGovernance,
      upgradesAndGovernanceImage: p.display.upgradesAndGovernanceImage,
    },
    contracts: p.contracts,
    permissions: p.permissions,
    discoveryInfo: getDiscoveryInfo(p),
    bridgeRisks: p.riskView,
    tvsInfo: {
      associatedTokens: p.config.associatedTokens ?? [],
      warnings: [],
    },
    tvsConfig: getTvsConfig(p),
    chainConfig: p.chainConfig,
    milestones: p.milestones,
    // tags
    isBridge: true,
    archivedAt: p.archivedAt,
    isUpcoming: p.isUpcoming ? true : undefined,
    escrows: p.config.escrows,
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
        sinceTimestamp: config.query.sinceTimestamp,
        untilTimestamp: config.query.untilTimestamp,
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

export function getDiscoveryInfo(
  project: ScalingProject | Bridge,
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

function getTvsConfig(
  project: ScalingProject | Bridge,
): TvsToken[] | undefined {
  const fileName = `${project.id.replace('=', '').replace(';', '')}.json`
  const filePath = join(__dirname, `../../src/tvs/json/${fileName}`)

  if (!existsSync(filePath)) {
    return undefined
  }

  const result = ProjectTvsConfigSchema.safeParse(
    JSON.parse(readFileSync(filePath, 'utf8')),
  )

  if (!result.success) {
    throw new Error(
      `Invalid TVS config for project ${project.id}: ${result.error.toString()}`,
    )
  }

  return result.data.tokens
}
