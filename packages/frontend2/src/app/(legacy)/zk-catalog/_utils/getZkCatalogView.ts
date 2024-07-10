import { type VerifierStatuses } from '~/server/features/zk-catalog/get-verifiers'
import { type ZkCatalogViewProps } from '../_components/ZkCatalogPage'
import { getProofVerification } from './getProofVerification'
import { getTrustedSetup } from './getTrustedSetup'
import { type Project } from './types'

export const ZK_CATALOG_ASK_FOR_VERIFICATION_LINK =
  'https://l2beat.notion.site/ZK-Catalog-Verification-94e940aa2bff4287bb15a19f66e3cead?pvs=25'

export function getZkCatalogView(
  projects: Project[],
  verifiersStatuses: VerifierStatuses,
): ZkCatalogViewProps {
  return {
    items: projects.map((project) => {
      const proofVerification = getProofVerification(project, verifiersStatuses)

      return {
        name: project.display.name,
        slug: project.display.slug,
        trustedSetup: getTrustedSetup(proofVerification.verifiers),
        ...proofVerification,
      }
    }),
    askForVerificationLink: ZK_CATALOG_ASK_FOR_VERIFICATION_LINK,
  }
}
