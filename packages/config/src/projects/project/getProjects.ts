import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { bridges } from '../bridges'
import { layer2s } from '../layer2s'
import { layer3s } from '../layer3s'
import { daLayers } from '../other'
import { refactored } from '../refactored'
import { Project } from './Project'
import { isUnderReview } from './isUnderReview'

export function getProjects(): Project[] {
  const projects: Project[] = [...refactored]

  for (const p of layer2s) {
    projects.push({
      id: p.id,
      slug: p.display.slug,
      addedAt: p.createdAt,
      // data
      title: {
        name: p.display.name,
        shortName: p.display.shortName,
        yellowWarning: p.display.headerWarning,
        redWarning: p.display.redWarning,
      },
      proofVerification: p.stateValidation?.proofVerification,
      scalingRisks: {
        self: p.riskView,
        host: undefined,
        stacked: undefined,
      },
      // tags
      isScaling: true,
      isZkCatalog: p.stateValidation?.proofVerification ? true : undefined,
      isLayer2: true,
      isArchived: p.isArchived ? true : undefined,
      isUnderReview: isUnderReview(p) ? true : undefined,
      isUpcoming: p.isUpcoming ? true : undefined,
    })
  }

  for (const p of layer3s) {
    projects.push({
      id: p.id,
      slug: p.display.slug,
      addedAt: p.createdAt,
      // data
      title: {
        name: p.display.name,
        shortName: p.display.shortName,
        yellowWarning: p.display.headerWarning,
        redWarning: p.display.redWarning,
      },
      proofVerification: p.stateValidation?.proofVerification,
      scalingRisks: {
        self: p.riskView,
        host: layer2s.find((x) => x.id === p.hostChain)?.riskView,
        stacked: p.stackedRiskView,
      },
      // tags
      isScaling: true,
      isZkCatalog: p.stateValidation?.proofVerification ? true : undefined,
      isLayer3: true,
      isArchived: p.isArchived ? true : undefined,
      isUnderReview: isUnderReview(p) ? true : undefined,
      isUpcoming: p.isUpcoming ? true : undefined,
    })
  }

  for (const p of bridges) {
    projects.push({
      id: p.id,
      slug: p.display.slug,
      addedAt: p.createdAt,
      // data
      title: {
        name: p.display.name,
        shortName: p.display.shortName,
        yellowWarning: p.display.warning,
        redWarning: undefined,
      },
      // tags
      isBridge: true,
      isArchived: p.isArchived ? true : undefined,
      isUnderReview: isUnderReview(p) ? true : undefined,
      isUpcoming: p.isUpcoming ? true : undefined,
    })
  }

  for (const p of daLayers) {
    projects.push({
      id: ProjectId(`${p.id}-da-layer`),
      slug: p.display.slug,
      addedAt: UnixTime.ZERO,
      // data
      title: {
        name: p.display.name,
        shortName: undefined,
        yellowWarning: undefined,
        redWarning: undefined,
      },
      daBridges: p.bridges,
      // tags
      isDaLayer: true,
      isUnderReview: p.isUnderReview ? true : undefined,
      isUpcoming: p.isUpcoming ? true : undefined,
    })
  }

  return projects
}
