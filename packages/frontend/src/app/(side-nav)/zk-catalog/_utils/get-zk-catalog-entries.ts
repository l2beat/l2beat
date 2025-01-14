import { type ProjectWith } from '@l2beat/config'
import { type VerifiersStatuses } from '~/server/features/zk-catalog/get-verifiers'
import { getProofVerification } from './get-proof-verification'
import { type TrustedSetup, getTrustedSetup } from './get-trusted-setup'
import { type ZkCatalogProofVerification } from './types'

export interface ZkCatalogEntry extends ZkCatalogProofVerification {
  name: string
  slug: string
  trustedSetup: TrustedSetup
}

export function getZkCatalogEntries(
  projects: ProjectWith<'proofVerification'>[],
  verifiersStatuses: VerifiersStatuses,
): ZkCatalogEntry[] {
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
