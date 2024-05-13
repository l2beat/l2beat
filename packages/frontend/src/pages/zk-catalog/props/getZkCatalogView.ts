import { Layer2, Layer3, ZkCatalogProject } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import { ZkCatalogViewProps } from '../view/ZkCatalogView'

type Project = Layer2 | Layer3 | ZkCatalogProject

export function getZkCatalogView(projects: Project[]): ZkCatalogViewProps {
  return {
    items: projects.map((project) => ({
      name: project.display.name,
      shortName: project.display.shortName,
      slug: project.display.slug,
      ...getProofVerification(project),
    })),
  }
}

function getProofVerification(project: Project) {
  if (project.type === 'zk-catalog') {
    return project.proofVerification
  }
  assert(project.stateValidation?.proofVerification, 'Invalid project')

  return project.stateValidation.proofVerification
}
