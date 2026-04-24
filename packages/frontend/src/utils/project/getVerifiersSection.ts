import type { Project } from '@l2beat/config'
import { ChainSpecificAddress, type EthereumAddress } from '@l2beat/shared-pure'
import uniqBy from 'lodash/uniqBy'
import type { UsedInProjectWithIcon } from '~/components/ProjectsUsedIn'
import type { VerifiersSectionProps } from '~/components/projects/sections/verifiers/VerifiersSection'
import type { SevenDayTvsBreakdown } from '~/server/features/scaling/tvs/get7dTvsBreakdown'
import { getZkCatalogLogo } from '~/server/features/zk-catalog/getZkCatalogLogo'
import { getProjectsUsedIn } from '~/server/features/zk-catalog/utils/getTrustedSetupsWithVerifiersAndAttesters'
import { ps } from '~/server/projects'
import type { ProjectSectionProps } from '../../components/projects/sections/types'
import type { ContractUtils } from './contracts-and-permissions/getContractUtils'

function plainDeploymentAddress(
  address: EthereumAddress | string,
): EthereumAddress {
  return ChainSpecificAddress.check(address)
    ? ChainSpecificAddress.address(address)
    : (address as EthereumAddress)
}

export async function getVerifiersSection(
  project: Project<'zkCatalogInfo'>,
  contractUtils: ContractUtils,
  allProjects: Project<
    never,
    'display' | 'daBridge' | 'scalingInfo' | 'daLayer'
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

    const attesters = verifier.attesters?.map((attester) => {
      const icon = getZkCatalogLogo(attester.id)
      return {
        ...attester,
        icon: icon.light,
        iconDark: icon.dark,
      }
    })

    const knownDeployments = verifier.knownDeployments.map((d) => {
      const explorerUrl = projects.find(
        (p) => p.id === ChainSpecificAddress.longChain(d.address),
      )?.chainConfig.explorerUrl
      const addressKey = plainDeploymentAddress(d.address)
      return {
        url: explorerUrl
          ? `${explorerUrl}/address/${addressKey}#code`
          : undefined,
        address: addressKey,
        projectsUsedIn: (d.overrideUsedIn
          ? getProjectsUsedIn(d.overrideUsedIn, allProjects)
          : contractUtils.getUsedIn(
              project.id,
              ChainSpecificAddress.longChain(d.address),
              addressKey,
            )
        ).sort(tvsComparator(allProjects, tvs)),
      }
    })

    const projectsUsedIn = uniqBy(
      knownDeployments.flatMap((d) => d.projectsUsedIn),
      (u) => u.id,
    ).sort(tvsComparator(allProjects, tvs))

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
