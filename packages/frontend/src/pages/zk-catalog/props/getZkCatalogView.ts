import { VerifiersApiResponse } from '@l2beat/shared-pure'
import { getProofVerification } from '../../../utils/zk-catalog/getProofVerification'
import { hasTrustedSetup } from '../../../utils/zk-catalog/hasTrustedSetup'
import { Project } from '../../../utils/zk-catalog/types'
import { ZkCatalogViewProps } from '../view/ZkCatalogView'

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
        shortName: project.display.shortName,
        slug: project.display.slug,
        hasTrustedSetup: hasTrustedSetup(proofVerification.verifiers),
        ...proofVerification,
      }
    }),
  }
}
