import {
  SHARP_SUBMISSION_ADDRESS,
  SHARP_SUBMISSION_SELECTOR,
  type TrackedTxConfigEntry,
} from '@l2beat/shared'
import { ProjectId } from '@l2beat/shared-pure'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { badgesCompareFn } from '../common/badges'
import {
  formatChallengeAndExecutionDelay,
  formatChallengePeriod,
  formatExecutionDelay,
} from '../common/formatDelays'
import type {
  Bridge,
  Layer2TxConfig,
  ProjectScalingRiskView,
  ScalingProject,
} from '../internalTypes'
import { asArray, emptyArrayToUndefined } from '../templates/utils'
import {
  type BaseProject,
  type ProjectCostsInfo,
  type ProjectDiscoveryInfo,
  type ProjectLivenessInfo,
  type ProjectRiskView,
  type ProjectScalingCategory,
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
  const tvsConfig = getTvsConfig(p)

  const associatedTokens = p.config.associatedTokens?.map((associated) => ({
    symbol: associated,
    icon: tvsConfig?.find((t) => t.symbol === associated)?.iconUrl,
  }))

  const hostChain = layer2s.find((x) => x.id === p.hostChain)

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
      type: getType(p),
      capability: p.capability,
      hostChain: getHostChain(p.hostChain ?? ProjectId.ETHEREUM),
      reasonsForBeingOther: p.reasonsForBeingOther,
      stacks: p.display.stacks,
      raas: getRaas(p.badges),
      infrastructure: getInfrastructure(p.badges),
      vm: getVM(p.badges),
      daLayer: emptyArrayToUndefined(
        asArray(p.dataAvailability).map((d) => d.layer.value),
      ),
      stage: getStage(p.stage),
      purposes: p.display.purposes,
      scopeOfAssessment: p.scopeOfAssessment,
      proofSystem: p.proofSystem,
    },
    scalingStage: p.stage,
    scalingRisks: {
      self: getProcessedRiskView(p.riskView),
      host:
        p.type === 'layer3' && hostChain
          ? getProcessedRiskView(hostChain.riskView)
          : undefined,
      stacked:
        p.type === 'layer3' && p.stackedRiskView
          ? getProcessedRiskView(p.stackedRiskView)
          : undefined,
    },
    scalingDa: emptyArrayToUndefined(asArray(p.dataAvailability)),
    scalingTechnology: {
      warning: p.display.warning,
      detailedDescription: p.display.detailedDescription,
      architectureImage: p.display.architectureImage,
      ...p.technology,
      dataAvailability: emptyArrayToUndefined(
        asArray(p.technology?.dataAvailability),
      ),
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
      associatedTokens: associatedTokens ?? [],
      warnings: [p.display.tvsWarning].filter((x) => x !== undefined),
    },
    tvsConfig,
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
    hasTestnet: p.hasTestnet,
    escrows: p.config.escrows,
  }
}

function getType(p: ScalingProject): ProjectScalingCategory | undefined {
  if (p.reasonsForBeingOther && p.reasonsForBeingOther.length > 0)
    return 'Other'

  const typesPerDA = new Set(
    asArray(p.dataAvailability).map((da) => {
      // If there's a bridge in DA
      if (da.bridge.value === 'Plasma') return 'Plasma'

      if (p.isUpcoming || !p.proofSystem || !p.dataAvailability)
        return undefined

      const isEthereumBridge =
        da.bridge.value === 'Enshrined' || da.bridge.value === 'Self-attested' // Intmax case
      const proofType = p.proofSystem?.type

      // If there's
      if (proofType === 'Optimistic') {
        return isEthereumBridge ? 'Optimistic Rollup' : 'Optimium'
      }

      if (proofType === 'Validity') {
        return isEthereumBridge ? 'ZK Rollup' : 'Validium'
      }
    }),
  )

  if (typesPerDA.size > 1) {
    throw new Error(
      `Multiple DAs assigned to project ${p.id} lead to different scaling types. Update the logic to support this case.`,
    )
  }
  return Array.from(typesPerDA)[0]
}

function getProcessedRiskView(
  riskView: ProjectScalingRiskView,
): ProjectRiskView {
  const {
    stateValidation: { challengeDelay, executionDelay },
  } = riskView

  let secondLine: string | undefined
  if (challengeDelay !== undefined && executionDelay !== undefined) {
    secondLine = formatChallengeAndExecutionDelay(
      challengeDelay + executionDelay,
    )
  } else if (challengeDelay !== undefined) {
    secondLine = formatChallengePeriod(challengeDelay)
  } else if (executionDelay !== undefined) {
    secondLine = formatExecutionDelay(executionDelay)
  }

  return {
    ...riskView,
    stateValidation: {
      ...riskView.stateValidation,
      secondLine,
    },
  }
}

function getLivenessInfo(p: ScalingProject): ProjectLivenessInfo | undefined {
  if (p.type === 'layer2' && p.config.trackedTxs !== undefined) {
    return p.display.liveness ?? {}
  }
}

function getCostsInfo(p: ScalingProject): ProjectCostsInfo | undefined {
  if (p.type === 'layer2' && p.config.trackedTxs !== undefined) {
    return {
      warning: p.display.costsWarning,
    }
  }
}

function bridgeToProject(p: Bridge): BaseProject {
  const tvsConfig = getTvsConfig(p)
  const associatedTokens = p.config.associatedTokens?.map((associated) => ({
    symbol: associated,
    icon: tvsConfig?.find((t) => t.symbol === associated)?.iconUrl,
  }))

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
      associatedTokens: associatedTokens ?? [],
      warnings: [],
    },
    tvsConfig,
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
              firstParameter: config.query.firstParameter,
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
    baseTimestamp: project.discoveryInfo.baseTimestamp,
    // This is implicit assumption that if there are timestamps per chain, then
    // the project has disco ui. It's cause if there are some keys it means
    // that the project has discovered.json file.
    hasDiscoUi: project.discoveryInfo.baseTimestamp !== undefined,
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
