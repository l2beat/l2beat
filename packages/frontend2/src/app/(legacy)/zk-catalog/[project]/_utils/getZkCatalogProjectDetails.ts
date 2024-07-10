import { getCollectionEntry } from '~/content/get-collection'
import { type VerifiersStatuses } from '~/server/features/zk-catalog/get-verifiers'
import { getProofVerification } from '../../_utils/getProofVerification'
import { getTrustedSetup } from '../../_utils/getTrustedSetup'
import { type Project } from '../../_utils/types'
import { type ZkCatalogProjectDetails } from '../_components/ZkCatalogProjectPage'

export function getZkCatalogProjectDetails(
  project: Project,
  verifiersStatues: VerifiersStatuses,
): ZkCatalogProjectDetails {
  const descriptionEntry = getCollectionEntry(
    'zkCatalogDescriptions',
    project.display.slug,
  )

  const proofVerification = getProofVerification(project, verifiersStatues)

  return {
    title: project.display.name,
    icon: `/icons/${project.display.slug}.png`,
    linkToMainProjectDetails:
      project.type === 'zk-catalog'
        ? undefined
        : `/scaling/projects/${project.display.slug}`,
    trustedSetup: getTrustedSetup(proofVerification.verifiers),
    description: descriptionEntry.content,
    ...proofVerification,
  }
}
