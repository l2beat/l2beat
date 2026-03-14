import type { Project, ProjectContracts } from '@l2beat/config'
import {
  ChainSpecificAddress,
  type EthereumAddress,
  notUndefined,
  type ProjectId,
} from '@l2beat/shared-pure'
import isEmpty from 'lodash/isEmpty'
import pickBy from 'lodash/pickBy'
import uniqBy from 'lodash/uniqBy'
import type { StateValidationSectionProps } from '~/components/projects/sections/state-validation/StateValidationSection'
import type { SevenDayTvsBreakdown } from '~/server/features/scaling/tvs/get7dTvsBreakdown'
import { getTrustedSetupsWithVerifiersAndAttesters } from '~/server/features/zk-catalog/utils/getTrustedSetupsWithVerifiersAndAttesters'
import { manifest } from '~/utils/Manifest'
import type { ContractUtils } from '../../contracts-and-permissions/getContractUtils'

export function getProverInfo(
  projectId: ProjectId,
  zkCatalogProjectId: string | undefined,
  zkCatalogProjects: Project<'zkCatalogInfo'>[],
  projectContracts: ProjectContracts | undefined,
  contractUtils: ContractUtils,
  tvs: SevenDayTvsBreakdown,
  allProjects: Project<never, 'daBridge' | 'isScaling' | 'isDaLayer'>[],
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
    projectId,
  )

  // take only trusted setups that are used in this project
  const trustedSetups = pickBy(trustedSetupsByProofSystem, (value) =>
    value.projectsUsedIn.some((p) => p.id === projectId),
  )
  if (isEmpty(trustedSetups)) return undefined

  const trustedSetupsWithOnchainVerifiers = Object.fromEntries(
    Object.entries(trustedSetups).map(([key, value]) => [
      key,
      {
        ...value,
        onchainVerifiers: getOnchainVerifiers(
          zkCatalogProject,
          key,
          projectId,
          projectContracts,
          contractUtils,
        ),
      },
    ]),
  )

  return {
    name: zkCatalogProject.name,
    icon: manifest.getUrl(`/icons/${zkCatalogProject.slug}.png`),
    href: `/zk-catalog/${zkCatalogProject.slug}`,
    trustedSetups: trustedSetupsWithOnchainVerifiers,
  }
}

function getOnchainVerifiers(
  zkCatalogProject: Project<'zkCatalogInfo'>,
  proofSystemKey: string,
  projectId: ProjectId,
  projectContracts: ProjectContracts | undefined,
  contractUtils: ContractUtils,
) {
  const verifiers = zkCatalogProject.zkCatalogInfo.verifierHashes
    .filter(
      (v) => `${v.proofSystem.type}-${v.proofSystem.id}` === proofSystemKey,
    )
    .flatMap((v) => v.knownDeployments)
    .filter((d) =>
      isDeploymentUsedInProject(
        zkCatalogProject.id,
        d,
        projectId,
        contractUtils,
      ),
    )
    .map((d) => getOnchainVerifier(d.chain, d.address, projectContracts))
    .filter(notUndefined)

  return uniqBy(verifiers, (v) => v.href)
}

function isDeploymentUsedInProject(
  zkCatalogProjectId: ProjectId,
  deployment: Project<'zkCatalogInfo'>['zkCatalogInfo']['verifierHashes'][number]['knownDeployments'][number],
  projectId: ProjectId,
  contractUtils: ContractUtils,
) {
  const usedIn = deployment.overrideUsedIn
    ? deployment.overrideUsedIn
    : contractUtils
        .getUsedIn(zkCatalogProjectId, deployment.chain, deployment.address)
        .map((project) => project.id)

  return usedIn.includes(projectId)
}

function getOnchainVerifier(
  chain: string,
  address: EthereumAddress,
  projectContracts: ProjectContracts | undefined,
) {
  const contract = projectContracts?.addresses[chain]?.find(
    (contract) => ChainSpecificAddress.address(contract.address) === address,
  )

  if (!contract?.url) return undefined

  return {
    name: contract.name,
    href: contract.url,
  }
}
