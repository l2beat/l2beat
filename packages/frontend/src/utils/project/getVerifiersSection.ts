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
    const projectsUsedIn = verifier.knownDeployments.flatMap((d) =>
      contractUtils.getUsedIn(project.id, d.chain, d.address),
    )

    const attesters = verifier.attesters?.map((attester) => ({
      ...attester,
      icon: getProjectIcon(attester.id),
    }))

    const knownDeployments = verifier.knownDeployments.map((d) => ({
      url:
        projects.find((p) => p.id === d.chain)?.chainConfig.explorerUrl +
        `/address/${d.address}#code`,
      address: d.address,
    }))

    if (!proofSystemVerifiers) {
      byProofSystem[key] = {
        proofSystem: verifier.proofSystem,
        verifierHashes: [
          {
            ...verifier,
            projectsUsedIn,
            attesters,
            knownDeployments,
          },
        ],
      }
    } else {
      proofSystemVerifiers.verifierHashes.push({
        ...verifier,
        projectsUsedIn,
        attesters,
        knownDeployments,
      })
    }
  }
  return {
    proofSystemVerifiers: Object.values(byProofSystem),
  }
}
