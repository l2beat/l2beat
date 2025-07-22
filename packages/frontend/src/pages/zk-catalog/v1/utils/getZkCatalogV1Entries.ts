import type { Project } from '@l2beat/config'
import { getProjectIcon } from '~/server/features/utils/getProjectIcon'
import type { VerifiersStatuses } from '~/server/features/zk-catalog/getVerifiers'
import { getProofVerification } from './getProofVerification'
import type { TrustedSetup } from './getTrustedSetup'
import { getTrustedSetup } from './getTrustedSetup'
import type { ZkCatalogProofVerification } from './types'

export interface ZkCatalogEntry extends ZkCatalogProofVerification {
  name: string
  slug: string
  icon: string
  trustedSetup: TrustedSetup
}

export function getZkCatalogV1Entries(
  projects: Project<'proofVerification'>[],
  verifiersStatuses: VerifiersStatuses,
): ZkCatalogEntry[] {
  return projects
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((project) => {
      const proofVerification = getProofVerification(project, verifiersStatuses)

      return {
        name: project.name,
        slug: project.slug,
        icon: getProjectIcon(project.slug),
        trustedSetup: getTrustedSetup(proofVerification.verifiers),
        ...proofVerification,
      }
    })
}
