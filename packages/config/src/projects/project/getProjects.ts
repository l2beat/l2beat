import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { bridges } from '../bridges'
import { layer2s } from '../layer2s'
import { layer3s } from '../layer3s'
import { daLayers } from '../other'
import { refactored } from '../refactored'
import { Project } from './Project'

export function getProjects(): Project[] {
  const projects: Project[] = [...refactored]

  for (const p of layer2s) {
    projects.push({
      id: p.id,
      slug: p.display.slug,
      name: p.display.name,
      addedAt: p.createdAt,
      // data
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
      isUnderReview: p.isUnderReview ? true : undefined,
      isUpcoming: p.isUpcoming ? true : undefined,
    })
  }

  for (const p of layer3s) {
    projects.push({
      id: p.id,
      slug: p.display.slug,
      name: p.display.name,
      addedAt: p.createdAt,
      // data
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
      isUnderReview: p.isUnderReview ? true : undefined,
      isUpcoming: p.isUpcoming ? true : undefined,
    })
  }

  for (const p of bridges) {
    projects.push({
      id: p.id,
      slug: p.display.slug,
      name: p.display.name,
      addedAt: p.createdAt,
      // tags
      isBridge: true,
      isArchived: p.isArchived ? true : undefined,
      isUnderReview: p.isUnderReview ? true : undefined,
      isUpcoming: p.isUpcoming ? true : undefined,
    })
  }

  for (const p of daLayers) {
    projects.push({
      id: ProjectId(`${p.id}-da-layer`),
      slug: p.display.slug,
      name: p.display.name,
      addedAt: UnixTime.ZERO,
      // data
      daBridges: p.bridges,
      // tags
      isDaLayer: true,
    })
  }

  return projects
}
