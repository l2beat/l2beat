import { type ProjectWith } from '@l2beat/config'
import { getCollectionEntry } from '~/content/get-collection'
import { type VerifiersStatuses } from '~/server/features/zk-catalog/get-verifiers'
import { getProofVerification } from '../../_utils/get-proof-verification'
import { getTrustedSetup } from '../../_utils/get-trusted-setup'
import { type ZkCatalogProjectDetails } from '../_components/zk-catalog-project-page'

export function getZkCatalogProjectDetails(
  project: ProjectWith<'proofVerification', 'isScaling'>,
  verifiersStatues: VerifiersStatuses,
): ZkCatalogProjectDetails {
  const descriptionEntry = getCollectionEntry(
    'zk-catalog-descriptions',
    project.slug,
  )

  const proofVerification = getProofVerification(project, verifiersStatues)

  return {
    title: project.name,
    icon: `/icons/${project.slug}.png`,
    linkToMainProjectDetails: project.isScaling
      ? `/scaling/projects/${project.slug}`
      : undefined,
    trustedSetup: getTrustedSetup(proofVerification.verifiers),
    description: descriptionEntry?.content,
    ...proofVerification,
  }
}
