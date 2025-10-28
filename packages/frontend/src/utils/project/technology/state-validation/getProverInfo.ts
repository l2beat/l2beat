import type { Project } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import isEmpty from 'lodash/isEmpty'
import pickBy from 'lodash/pickBy'
import type { StateValidationSectionProps } from '~/components/projects/sections/state-validation/StateValidationSection'
import type { SevenDayTvsBreakdown } from '~/server/features/scaling/tvs/get7dTvsBreakdown'
import { getProjectIcon } from '~/server/features/utils/getProjectIcon'
import { getTrustedSetupsWithVerifiersAndAttesters } from '~/server/features/zk-catalog/utils/getTrustedSetupsWithVerifiersAndAttesters'
import type { ContractUtils } from '../../contracts-and-permissions/getContractUtils'

export function getProverInfo(
  projectId: ProjectId,
  zkCatalogProjectId: string | undefined,
  zkCatalogProjects: Project<'zkCatalogInfo'>[],
  contractUtils: ContractUtils,
  tvs: SevenDayTvsBreakdown,
  allProjects: Project<
    never,
    'daBridge' | 'isBridge' | 'isScaling' | 'isDaLayer'
  >[],
): StateValidationSectionProps['proverInfo'] {
  const zkCatalogProject = zkCatalogProjects.find(
    (x) => x.id === zkCatalogProjectId,
  )
  if (!zkCatalogProject) return undefined

  const trustedSetupsByProofSystem = getTrustedSetupsWithVerifiersAndAttesters(
    zkCatalogProject,
    contractUtils,
    tvs,
    allProjects,
  )

  // take only trusted setups that are used in this project
  const trustedSetups = pickBy(trustedSetupsByProofSystem, (value) =>
    value.projectsUsedIn.some((p) => p.id === projectId),
  )
  if (isEmpty(trustedSetups)) return undefined

  return {
    name: zkCatalogProject.name,
    icon: getProjectIcon(zkCatalogProject.slug),
    href: `/zk-catalog/${zkCatalogProject.slug}`,
    trustedSetups,
  }
}
