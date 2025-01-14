import { type ProjectWith } from '@l2beat/config'
import { type VerifiersStatuses } from '~/server/features/zk-catalog/get-verifiers'
import { getProofVerification } from './get-proof-verification'
import { getTrustedSetup } from './get-trusted-setup'

export const ZK_CATALOG_ASK_FOR_VERIFICATION_LINK =
  'https://l2beat.notion.site/ZK-Catalog-Verification-94e940aa2bff4287bb15a19f66e3cead?pvs=25'

export type ZkCatalogView = ReturnType<typeof getZkCatalogView>

export function getZkCatalogView(
  projects: ProjectWith<'proofVerification'>[],
  verifiersStatuses: VerifiersStatuses,
) {
  return {
    items: projects
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((project) => {
        const proofVerification = getProofVerification(
          project,
          verifiersStatuses,
        )

        return {
          name: project.name,
          slug: project.slug,
          trustedSetup: getTrustedSetup(proofVerification.verifiers),
          ...proofVerification,
        }
      }),
    askForVerificationLink: ZK_CATALOG_ASK_FOR_VERIFICATION_LINK,
  }
}
