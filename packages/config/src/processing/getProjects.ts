import {
  SHARP_SUBMISSION_ADDRESS,
  SHARP_SUBMISSION_SELECTOR,
  type TrackedTxConfigEntry,
} from '@l2beat/shared'
import { ProjectId } from '@l2beat/shared-pure'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { badgesCompareFn } from '../common/badges'
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
import { getProjectUnverifiedContracts } from './getUnverifiedContracts'
import { layer2s } from './layer2s'
import { layer3s } from './layer3s'
import { refactored } from './refactored'
import { getHostChain } from './utils/getHostChain'
import { getInfrastructure } from './utils/getInfrastructure'
import { getRaas } from './utils/getRaas'
import { getStage } from './utils/getStage'
import { getVM } from './utils/getVM'

const daBridges = refactored.filter((p) => p.daBridge)
export function getProjects(): BaseProject[] {
  runConfigAdjustments()

  return refactored
    .concat(layer2s.map(layer2Or3ToProject))
    .concat(layer3s.map(layer2Or3ToProject))
    .concat(bridges.map(bridgeToProject))
    .concat(ecosystems)
}

function layer2Or3ToProject(p: ScalingProject): BaseProject {
  return {
    id: p.id,
    name: p.display.name,
    shortName: p.display.shortName,
    slug: p.display.slug,
    addedAt: p.addedAt,

    // data
    colors: p.colors,
    ecosystemColors: ecosystems.find((e) => e.id === p.ecosystemInfo?.id)
      ?.colors,
    statuses: {
      yellowWarning: p.display.headerWarning,
      redWarning: p.display.redWarning,
      emergencyWarning: p.display.emergencyWarning,
      reviewStatus: p.reviewStatus,
      unverifiedContracts: getProjectUnverifiedContracts(p, daBridges),
    },
    display: {
      description: p.display.description,
      links: p.display.links,
      badges: (p.badges ?? []).sort(badgesCompareFn),
    },
    contracts: p.contracts,
    permissions: p.permissions,
    discoveryInfo: adjustDiscoveryInfo(p),
    scalingInfo: {
      layer: p.type,
      type: p.display.category,
      capability: p.capability,
      hostChain: getHostChain(p.hostChain ?? ProjectId.ETHEREUM),
      reasonsForBeingOther: p.reasonsForBeingOther,
      stacks: p.display.stacks,
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
    p.dataAvailability?.layer.projectId === 'ethereum' &&
    p.config.trackedTxs !== undefined
  ) {
    return {
      warning: p.display.costsWarning,
    }
  }
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
      reviewStatus: p.reviewStatus,
      unverifiedContracts: getProjectUnverifiedContracts(p),
    },
    colors: p.colors,
    display: {
      description: p.display.description,
      links: p.display.links,
      badges: [],
    },
    bridgeInfo: {
      category: p.display.category,
      destination: p.technology.destination,
    },
    bridgeTechnology: {
      ...p.technology,
      detailedDescription: p.display.detailedDescription,
      upgradesAndGovernance: p.upgradesAndGovernance,
      upgradesAndGovernanceImage: p.display.upgradesAndGovernanceImage,
    },
    contracts: p.contracts,
    permissions: p.permissions,
    discoveryInfo: adjustDiscoveryInfo(p),
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
              topics: config.query.topics,
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

export function adjustDiscoveryInfo(
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
    timestampPerChain: project.discoveryInfo.timestampPerChain,
    // This is implicit assumption that if there are timestamps per chain, then
    // the project has disco ui. It's cause if there are some keys it means
    // that the project has discovered.json file.
    hasDiscoUi: Object.keys(project.discoveryInfo.timestampPerChain).length > 0,
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
      `Invalid TVS config for project ${project.id}: ${result.path} : ${result.message}`,
    )
  }

  return result.data.tokens
}
