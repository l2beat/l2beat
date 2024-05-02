import { VerifiersApiResponse } from '@l2beat/shared-pure'
import { getProofVerification } from '../../../utils/zk-catalog/getProofVerification'
import { hasTrustedSetup } from '../../../utils/zk-catalog/hasTrustedSetup'
import { Project } from '../../../utils/zk-catalog/types'
import { ZkCatalogViewProps } from '../view/ZkCatalogView'

export const ZK_CATALOG_ASK_FOR_VERIFICATION_LINK =
  'https://forms.gle/Ga3qpd5qnminA5rz5'

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
        hasTrustedSetup: hasTrustedSetup(proofVerification.verifiers),
        ...proofVerification,
      }
    }),
    askForVerificationLink: ZK_CATALOG_ASK_FOR_VERIFICATION_LINK,
  }
}
