import type { Project } from '@l2beat/config'
import type { UsedInProjectWithIcon } from '~/components/ProjectsUsedIn'
import type { VerifiersSectionProps } from '~/components/projects/sections/VerifiersSection'
import type { SevenDayTvsBreakdown } from '~/server/features/scaling/tvs/get7dTvsBreakdown'
import { getProjectIcon } from '~/server/features/utils/getProjectIcon'
import { getProjectsUsedIn } from '~/server/features/zk-catalog/utils/getTrustedSetupsWithVerifiersAndAttesters'
import { ps } from '~/server/projects'
import type { ProjectSectionProps } from '../../components/projects/sections/types'
import type { ContractUtils } from './contracts-and-permissions/getContractUtils'

export async function getVerifiersSection(
  project: Project<'zkCatalogInfo'>,
  contractUtils: ContractUtils,
  allProjects: Project<
    never,
    'daBridge' | 'isBridge' | 'isScaling' | 'isDaLayer'
  >[],
  tvs: SevenDayTvsBreakdown,
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
        projectsUsedIn: (d.overrideUsedIn
          ? getProjectsUsedIn(d.overrideUsedIn, allProjects)
          : contractUtils.getUsedIn(project.id, d.chain, d.address)
        ).sort(tvsComparator(allProjects, tvs)),
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

export function tvsComparator(
  allProjects: Project<never, 'daBridge'>[],
  tvs: SevenDayTvsBreakdown,
) {
  const getTvs = (projectId: string): number => {
    const project = allProjects.find((p) => p.id === projectId)
    if (project?.daBridge) {
      return project.daBridge.usedIn.reduce(
        (acc, p) => acc + (tvs.projects[p.id]?.breakdown.total ?? 0),
        0,
      )
    }
    return tvs.projects[projectId]?.breakdown.total ?? 0
  }

  return (a: UsedInProjectWithIcon, b: UsedInProjectWithIcon) =>
    getTvs(b.id) - getTvs(a.id)
}
