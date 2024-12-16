import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { PROJECT_COUNTDOWNS } from '../../common'
import { isVerified } from '../../verification'
import { BadgeId, badges } from '../badges'
import { Bridge, bridges } from '../bridges'
import { Layer2, layer2s } from '../layer2s'
import { Layer3, layer3s } from '../layer3s'
import { DaLayer, daLayers } from '../other'
import { refactored } from '../refactored'
import { Project } from './Project'
import { getCurrentEntry } from './utils/getCurrentEntry'
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
      isOther: !!p.display.reasonsForBeingOther,
      hostChain: getHostChain(
        p.type === 'layer2' ? ProjectId.ETHEREUM : p.hostChain,
      ),
      stack: p.display.provider,
      raas: getRaas(p.badges),
      daLayer: getCurrentEntry(p.dataAvailability)?.layer.value ?? 'Unknown',
      stage: getStage(p.stage),
      purposes: p.display.purposes,
    },
    scalingRisks: {
      self: p.riskView,
      host: undefined,
      stacked: undefined,
    },
    proofVerification: p.stateValidation?.proofVerification,
    countdowns: p.display.reasonsForBeingOther
      ? {
          otherMigration: {
            expiresAt: PROJECT_COUNTDOWNS.otherMigration.expiresAt.toNumber(),
            pretendingToBe: p.display.category,
            reasons: p.display.reasonsForBeingOther,
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

function getHostChain(id: ProjectId) {
  if (id === ProjectId.ETHEREUM) {
    return { id, slug: 'ethereum', name: 'Ethereum', shortName: undefined }
  }
  const host = layer2s.find((x) => x.id)
  if (!host) {
    throw new Error(`Invalid host chain: ${host}`)
  }
  return {
    id,
    slug: host.display.slug,
    name: host.display.name,
    shortName: host.display.shortName,
  }
}

function getRaas(projectBadges: BadgeId[] | undefined) {
  const badge = projectBadges?.find((id) => badges[id].type === 'RaaS')
  if (!badge) {
    return undefined
  }
  return badges[badge].display.name
}
