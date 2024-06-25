import { VerifiersApiResponse } from '@l2beat/shared-pure'
import { getProofVerification } from '../../../utils/zk-catalog/getProofVerification'
import { getTrustedSetup } from '../../../utils/zk-catalog/getTrustedSetup'
import { Project } from '../../../utils/zk-catalog/types'
import { ZkCatalogViewProps } from '../view/ZkCatalogView'

export const ZK_CATALOG_ASK_FOR_VERIFICATION_LINK =
  'https://l2beat.notion.site/ZK-Catalog-Verification-94e940aa2bff4287bb15a19f66e3cead?pvs=25'

export function getZkCatalogView(
  projects: Project[],
  verifiersApiResponse: VerifiersApiResponse,
): ZkCatalogViewProps {
  return {
    items: projects.map((project) => {
      const proofVerification = getProofVerification(
        project,
        verifiersApiResponse,
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
