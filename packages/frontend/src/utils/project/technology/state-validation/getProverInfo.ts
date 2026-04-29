import type { Project } from '@l2beat/config'
import isEmpty from 'lodash/isEmpty'
import type { StateValidationSectionProps } from '~/components/projects/sections/state-validation/StateValidationSection'
import type { SevenDayTvsBreakdown } from '~/server/features/scaling/tvs/get7dTvsBreakdown'
import { getTrustedSetupsWithVerifiersAndAttesters } from '~/server/features/zk-catalog/utils/getTrustedSetupsWithVerifiersAndAttesters'
import { manifest } from '~/utils/Manifest'
import type { ContractUtils } from '../../contracts-and-permissions/getContractUtils'

export function getProverInfo(
  project: Project<'scalingInfo', 'contracts'>,
  zkCatalogProjects: Project<'zkCatalogInfo'>[],
  contractUtils: ContractUtils,
  tvs: SevenDayTvsBreakdown,
  allProjects: Project<
    never,
    'display' | 'daBridge' | 'scalingInfo' | 'daLayer'
  >[],
): StateValidationSectionProps['proverInfo'] {
  const zkCatalogProject = zkCatalogProjects.find(
    (x) => x.id === project.scalingInfo.proofSystem?.zkCatalogId,
  )
  if (!zkCatalogProject) return undefined

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
  if (isEmpty(trustedSetups)) return undefined

  return {
    name: zkCatalogProject.name,
    icon: manifest.getUrl(`/icons/${zkCatalogProject.slug}.png`),
    href: `/zk-catalog/${zkCatalogProject.slug}`,
    quantumResistant: zkCatalogProject.zkCatalogInfo.quantumResistant,
    trustedSetups,
  }
}
