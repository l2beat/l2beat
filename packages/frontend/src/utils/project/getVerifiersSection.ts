import type { Project } from '@l2beat/config'
import type { VerifiersSectionProps } from '~/components/projects/sections/VerifiersSection'
import { getProjectIcon } from '~/server/features/utils/getProjectIcon'
import { ps } from '~/server/projects'
import type { ProjectSectionProps } from '../../components/projects/sections/types'
import type { ContractUtils } from './contracts-and-permissions/getContractUtils'

export async function getVerifiersSection(
  project: Project<'zkCatalogInfo'>,
  contractUtils: ContractUtils,
): Promise<Omit<VerifiersSectionProps, keyof ProjectSectionProps>> {
  const projects = await ps.getProjects({
    select: ['chainConfig'],
  })
  const byProofSystem: Record<
    string,
    VerifiersSectionProps['proofSystemVerifiers'][number]
  > = {}

  for (const verifier of project.zkCatalogInfo.verifierHashes) {
    const key = `${verifier.proofSystem.type}-${verifier.proofSystem.id}`
    const proofSystemVerifiers = byProofSystem[key]

    const attesters = verifier.attesters?.map((attester) => ({
      ...attester,
      icon: getProjectIcon(attester.id),
    }))

    const knownDeployments = verifier.knownDeployments.map((d) => {
      const explorerUrl = projects.find((p) => p.id === d.chain)?.chainConfig
        .explorerUrl
      return {
        url: explorerUrl
          ? `${explorerUrl}/address/${d.address}#code`
          : undefined,
        address: d.address,
        projectsUsedIn: contractUtils.getUsedIn(project.id, d.chain, d.address),
      }
    })

    const projectsUsedIn = knownDeployments.flatMap((d) => d.projectsUsedIn)

    if (!proofSystemVerifiers) {
      byProofSystem[key] = {
        proofSystem: verifier.proofSystem,
        verifierHashes: [
          {
            ...verifier,
            projectsUsedIn,
            attesters,
            knownDeployments,
            description: verifier.description,
          },
        ],
      }
    } else {
      proofSystemVerifiers.verifierHashes.push({
        ...verifier,
        projectsUsedIn,
        attesters,
        knownDeployments,
        description: verifier.description,
      })
    }
  }
  return {
    proofSystemVerifiers: Object.values(byProofSystem),
  }
}
