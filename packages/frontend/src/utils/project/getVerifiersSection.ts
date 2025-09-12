import type { Project } from '@l2beat/config'
import type { VerifiersSectionProps } from '~/components/projects/sections/VerifiersSection'
import { getProjectsUsedIn } from '~/server/features/zk-catalog/utils/getProjectsUsedIn'
import type { ProjectSectionProps } from '../../components/projects/sections/types'

export function getVerifiersSection(
  project: Project<'zkCatalogInfo'>,
  allProjects: Project<
    never,
    'daBridge' | 'isBridge' | 'isScaling' | 'isDaLayer'
  >[],
): Omit<VerifiersSectionProps, keyof ProjectSectionProps> {
  const byProofSystem: Record<
    string,
    VerifiersSectionProps['proofSystemVerifiers'][number]
  > = {}

  for (const verifier of project.zkCatalogInfo.verifierHashes) {
    const key = `${verifier.proofSystem.type}-${verifier.proofSystem.id}`
    const proofSystemVerifiers = byProofSystem[key]
    const projectsUsedIn = getProjectsUsedIn(verifier.usedBy, allProjects)

    if (!proofSystemVerifiers) {
      byProofSystem[key] = {
        proofSystem: verifier.proofSystem,
        verifierHashes: [
          {
            hash: verifier.hash,
            knownDeployments: verifier.knownDeployments,
            projectsUsedIn,
            verificationSteps: verifier.verificationSteps,
          },
        ],
      }
    } else {
      proofSystemVerifiers.verifierHashes.push({
        hash: verifier.hash,
        knownDeployments: verifier.knownDeployments,
        projectsUsedIn,
        verificationSteps: verifier.verificationSteps,
      })
    }
  }
  return {
    proofSystemVerifiers: Object.values(byProofSystem),
  }
}
