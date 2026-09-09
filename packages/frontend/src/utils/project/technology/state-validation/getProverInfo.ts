import type { Project } from '@l2beat/config'
import isEmpty from 'lodash/isEmpty'
import type { ProverInfoData } from '~/components/projects/sections/state-validation/StateValidationSection'
import type { SevenDayTvsBreakdown } from '~/server/features/layer2s/tvs/get7dTvsBreakdown'
import { getTrustedSetupsWithVerifiersAndAttesters } from '~/server/features/zk-catalog/utils/getTrustedSetupsWithVerifiersAndAttesters'
import { manifest } from '~/utils/Manifest'
import type { ContractUtils } from '../../contracts-and-permissions/getContractUtils'
import type { ProjectWithPageMetadata } from '../../getProjectUrl'
import { getUsedZkCatalogProjects } from '../../getUsedZkCatalogProjects'

export function getProverInfos(
  project: Project<'scalingInfo', 'contracts'>,
  zkCatalogProjects: Project<'zkCatalogInfo'>[],
  contractUtils: ContractUtils,
  tvs: SevenDayTvsBreakdown,
  allProjects: ProjectWithPageMetadata[],
): ProverInfoData[] {
  const usedZkCatalogProjects = getUsedZkCatalogProjects(
    project.scalingInfo.proofSystem,
    zkCatalogProjects,
  )

  return usedZkCatalogProjects.flatMap((zkCatalogProject) => {
    const trustedSetups = getTrustedSetupsWithVerifiersAndAttesters(
      zkCatalogProject,
      contractUtils,
      tvs,
      allProjects,
      {
        id: project.id,
        contracts: project.contracts,
      },
    )
    if (isEmpty(trustedSetups)) return []

    return {
      name: zkCatalogProject.name,
      icon: manifest.getUrl(`/icons/${zkCatalogProject.slug}.png`),
      href: `/zk-catalog/${zkCatalogProject.slug}`,
      quantumResistant: zkCatalogProject.zkCatalogInfo.quantumResistant,
      trustedSetups,
    }
  })
}
