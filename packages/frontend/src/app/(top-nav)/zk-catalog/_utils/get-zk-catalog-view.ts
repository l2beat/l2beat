import { type VerifiersStatuses } from '~/server/features/zk-catalog/get-verifiers'
import { type ZkCatalogViewProps } from '../_components/zk-catalog-page'
import { getProofVerification } from './get-proof-verification'
import { getTrustedSetup } from './get-trusted-setup'
import { type Project } from './types'

export const ZK_CATALOG_ASK_FOR_VERIFICATION_LINK =
  'https://l2beat.notion.site/ZK-Catalog-Verification-94e940aa2bff4287bb15a19f66e3cead?pvs=25'

export function getZkCatalogView(
  projects: Project[],
  verifiersStatuses: VerifiersStatuses,
): ZkCatalogViewProps {
  return {
    items: projects
      .sort((a, b) => a.display.name.localeCompare(b.display.name))
      .map((project) => {
        const proofVerification = getProofVerification(
          project,
          verifiersStatuses,
        )

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
