import type { Project } from '@l2beat/config'
import type { VerifiersSectionProps } from '~/components/projects/sections/VerifiersSection'
import { getProjectIcon } from '~/server/features/utils/getProjectIcon'
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

    const attesters = verifier.attesters?.map((attester) => ({
      ...attester,
      icon: getProjectIcon(attester.id),
    }))

    if (!proofSystemVerifiers) {
      byProofSystem[key] = {
        proofSystem: verifier.proofSystem,
        verifierHashes: [
          {
            ...verifier,
            projectsUsedIn,
            attesters,
          },
        ],
      }
    } else {
      proofSystemVerifiers.verifierHashes.push({
        ...verifier,
        projectsUsedIn,
        attesters,
      })
    }
  }
  return {
    proofSystemVerifiers: Object.values(byProofSystem),
  }
}
