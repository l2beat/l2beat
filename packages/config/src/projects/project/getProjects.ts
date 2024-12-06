import { ProjectId } from '@l2beat/shared-pure'
import { zkCatalogProjects } from '../other'
import { Project } from './Project'
import { layer2s } from '../layer2s'
import { layer3s } from '../layer3s'
import { bridges } from '../bridges'

export async function getProjects(): Promise<Project[]> {
  const projects: Project[] = []

  for (const p of zkCatalogProjects) {
    projects.push({
      id: ProjectId(`${p.display.slug}-zk-catalog`),
      slug: p.display.slug,
      name: p.display.name,
      addedAt: p.createdAt,
      // data
      proofVerification: p.proofVerification,
    })
  }

  for (const p of layer2s) {
    projects.push({
      id: p.id,
      slug: p.display.slug,
      name: p.display.name,
      addedAt: p.createdAt,
      // data
      proofVerification: p.stateValidation?.proofVerification,
      // tags
      isScaling: true,
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
      // tags
      isScaling: true,
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

  return await Promise.resolve(projects)
}
