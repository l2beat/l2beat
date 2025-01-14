import { type ProjectWith } from '@l2beat/config'
import { type VerifiersStatuses } from '~/server/features/zk-catalog/get-verifiers'
import { getProofVerification } from './get-proof-verification'
import { getTrustedSetup } from './get-trusted-setup'

export type ZkCatalogEntry = ReturnType<typeof getZkCatalogEntries>[number]

export function getZkCatalogEntries(
  projects: ProjectWith<'proofVerification'>[],
  verifiersStatuses: VerifiersStatuses,
) {
  return projects
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((project) => {
      const proofVerification = getProofVerification(project, verifiersStatuses)

      return {
        name: project.name,
        slug: project.slug,
        trustedSetup: getTrustedSetup(proofVerification.verifiers),
        ...proofVerification,
      }
    })
}
