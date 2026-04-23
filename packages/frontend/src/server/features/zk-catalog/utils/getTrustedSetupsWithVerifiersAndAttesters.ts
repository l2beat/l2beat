import type {
  Project,
  ProjectContracts,
  ProjectZkCatalogInfo,
  TrustedSetup,
  ZkCatalogTag,
} from '@l2beat/config'
import {
  ChainSpecificAddress,
  notUndefined,
  type ProjectId,
} from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import uniqBy from 'lodash/uniqBy'
import type { UsedInProjectWithIcon } from '~/components/ProjectsUsedIn'
import { manifest } from '~/utils/Manifest'
import type { ContractUtils } from '~/utils/project/contracts-and-permissions/getContractUtils'
import type { SevenDayTvsBreakdown } from '../../scaling/tvs/get7dTvsBreakdown'
import type { TrustedSetupVerifierData } from '../getZkCatalogEntries'
import { getZkCatalogLogo } from '../getZkCatalogLogo'
import { tvsComparatorWithDaBridges } from './tvsComparatorWithDaBridges'

function toPlainAddress(address: string) {
  return ChainSpecificAddress.check(address)
    ? ChainSpecificAddress.address(address)
    : address
}

function explorerAddressPageUrl(contractUrl: string, plainEthAddress: string) {
  const parsed = new URL(contractUrl)
  return `${parsed.origin}/address/${plainEthAddress}#code`
}

export type TrustedSetupsByProofSystem = Record<
  string,
  {
    onchainVerifiers?: {
      name: string
      href: string
      verifiers: {
        successful?: TrustedSetupVerifierData
        unsuccessful?: TrustedSetupVerifierData
        notVerified?: TrustedSetupVerifierData
      }
    }[]
    trustedSetups: (TrustedSetup & {
      proofSystem: ZkCatalogTag
    })[]
    verifiers: {
      successful?: TrustedSetupVerifierData
      unsuccessful?: TrustedSetupVerifierData
      notVerified?: TrustedSetupVerifierData
    }
    projectsUsedIn: UsedInProjectWithIcon[]
    projectsUsedInByStatus: {
      successful?: UsedInProjectWithIcon[]
      unsuccessful?: UsedInProjectWithIcon[]
      notVerified?: UsedInProjectWithIcon[]
    }
  }
>

interface TargetProject {
  id: ProjectId
  contracts: ProjectContracts | undefined
}

export function getTrustedSetupsWithVerifiersAndAttesters(
  project: Project<'zkCatalogInfo'>,
  contractUtils: ContractUtils,
  tvs: SevenDayTvsBreakdown,
  allProjects: Project<
    never,
    'display' | 'daBridge' | 'scalingInfo' | 'daLayer'
  >[],
  targetProject?: TargetProject,
): TrustedSetupsByProofSystem {
  const grouped = groupBy(
    project.zkCatalogInfo.trustedSetups,
    (e) => `${e.proofSystem.type}-${e.proofSystem.id}`,
  )
  return Object.fromEntries(
    Object.entries(grouped).flatMap(([key, trustedSetups]) => {
      const verifiersWithUsedIn = getVerifiersWithProcessedUsedIn(
        project,
        key,
        contractUtils,
        allProjects,
      )

      const filteredVerifiers = targetProject
        ? verifiersWithUsedIn.filter((v) =>
            v.usedIn.some((u) => u.id === targetProject.id),
          )
        : verifiersWithUsedIn
      if (targetProject && filteredVerifiers.length === 0) return []

      const verifiersByStatus = groupBy(
        filteredVerifiers.map((v) => v.verifier),
        (v) => v.verificationStatus,
      )
      const usedInByStatus = groupBy(
        filteredVerifiers,
        (v) => v.verifier.verificationStatus,
      )

      return [
        [
          key,
          {
            onchainVerifiers: targetProject
              ? getOnchainVerifiersForProject(
                  filteredVerifiers,
                  targetProject.id,
                  targetProject.contracts,
                )
              : undefined,
            trustedSetups,
            verifiers: getVerifierStatuses(verifiersByStatus),
            projectsUsedIn:
              uniqAndSortProjectsUsedIn(
                filteredVerifiers.flatMap((v) => v.usedIn),
                allProjects,
                tvs,
              ) ?? [],
            projectsUsedInByStatus: {
              successful: uniqAndSortProjectsUsedIn(
                usedInByStatus.successful?.flatMap((v) => v.usedIn),
                allProjects,
                tvs,
              ),
              unsuccessful: uniqAndSortProjectsUsedIn(
                usedInByStatus.unsuccessful?.flatMap((v) => v.usedIn),
                allProjects,
                tvs,
              ),
              notVerified: uniqAndSortProjectsUsedIn(
                usedInByStatus.notVerified?.flatMap((v) => v.usedIn),
                allProjects,
                tvs,
              ),
            },
          },
        ] as const,
      ]
    }),
  )
}

function uniqAndSortProjectsUsedIn(
  usedIn: UsedInProjectWithIcon[] | undefined,
  allProjects: Project<
    never,
    'display' | 'daBridge' | 'scalingInfo' | 'daLayer'
  >[],
  tvs: SevenDayTvsBreakdown,
) {
  if (!usedIn) return undefined

  return uniqBy(usedIn, (project) => project.id).sort(
    tvsComparatorWithDaBridges(allProjects, tvs),
  )
}

function getVerifiersWithProcessedUsedIn(
  project: Project<'zkCatalogInfo'>,
  key: string,
  contractUtils: ContractUtils,
  allProjects: Project<
    never,
    'display' | 'daBridge' | 'scalingInfo' | 'daLayer'
  >[],
) {
  return project.zkCatalogInfo.verifierHashes
    .filter((v) => key === `${v.proofSystem.type}-${v.proofSystem.id}`)
    .map((verifier) => {
      const deployments = verifier.knownDeployments.map((deployment) => ({
        deployment,
        usedIn: deployment.overrideUsedIn
          ? getProjectsUsedIn(deployment.overrideUsedIn, allProjects)
          : contractUtils.getUsedIn(
              project.id,
              ChainSpecificAddress.longChain(deployment.address),
              toPlainAddress(deployment.address),
            ),
      }))

      return {
        verifier,
        deployments,
        usedIn: deployments.flatMap((d) => d.usedIn),
      }
    })
}

function getOnchainVerifiersForProject(
  filteredVerifiers: ReturnType<typeof getVerifiersWithProcessedUsedIn>,
  targetProjectId: ProjectId,
  contracts: ProjectContracts | undefined,
) {
  const onchainVerifiers = filteredVerifiers.flatMap(
    ({ verifier, deployments }) =>
      deployments
        .filter((d) => d.usedIn.some((u) => u.id === targetProjectId))
        .map((d) => {
          const onchainVerifier = getOnchainVerifier(
            ChainSpecificAddress.longChain(d.deployment.address),
            ChainSpecificAddress.address(d.deployment.address),
            contracts,
          )

          if (!onchainVerifier) return undefined

          return {
            ...onchainVerifier,
            verifier,
          }
        })
        .filter(notUndefined),
  )

  return Object.values(groupBy(onchainVerifiers, (v) => v.href)).flatMap(
    (entries) => {
      const first = entries[0]
      if (!first) return []

      return {
        name: first.name,
        href: first.href,
        verifiers: getVerifierStatuses(
          groupBy(
            uniqBy(
              entries.map((entry) => entry.verifier),
              (verifier) => verifier.hash,
            ),
            (verifier) => verifier.verificationStatus,
          ),
        ),
      }
    },
  )
}

function getOnchainVerifier(
  chain: string,
  address: string,
  contracts: ProjectContracts | undefined,
) {
  const addressKey = toPlainAddress(address)

  const contract = contracts?.addresses[chain]?.find(
    (c) => ChainSpecificAddress.address(c.address) === addressKey,
  )

  if (!contract?.url) return undefined

  const plainEthAddress = ChainSpecificAddress.address(contract.address)

  return {
    name: contract.name,
    href: explorerAddressPageUrl(contract.url, plainEthAddress),
  }
}

export function getVerifiersWithAttesters(
  verifiers: Record<string, ProjectZkCatalogInfo['verifierHashes']>,
  key: 'successful' | 'unsuccessful' | 'notVerified',
): TrustedSetupVerifierData | undefined {
  const verifiersForStatus = verifiers[key]
  if (!verifiersForStatus || verifiersForStatus.length === 0) return undefined

  return {
    count: verifiersForStatus.length,
    attesters: uniqBy(
      verifiersForStatus.flatMap((v) => v.attesters).filter(notUndefined),
      (a) => a.id,
    ).map((a) => {
      const icon = getZkCatalogLogo(a.id)
      return {
        ...a,
        icon: icon.light,
        iconDark: icon.dark,
      }
    }),
  }
}

function getVerifierStatuses(
  verifiersByStatus: Record<string, ProjectZkCatalogInfo['verifierHashes']>,
) {
  return {
    successful: getVerifiersWithAttesters(verifiersByStatus, 'successful'),
    unsuccessful: getVerifiersWithAttesters(verifiersByStatus, 'unsuccessful'),
    notVerified: getVerifiersWithAttesters(verifiersByStatus, 'notVerified'),
  }
}

export function getProjectsUsedIn(
  projectIds: ProjectId[],
  allProjects: Project<
    never,
    'display' | 'daBridge' | 'scalingInfo' | 'daLayer'
  >[],
): UsedInProjectWithIcon[] {
  return projectIds
    .map((projectId) => {
      const project = allProjects.find((p) => p.id === projectId)
      if (!project) return undefined

      let url = `/scaling/projects/${project.slug}`
      if (project.daBridge) {
        const layer = allProjects
          .filter((x) => x.daLayer)
          .find((x) => x.id === project.daBridge?.daLayer)
        url = `/data-availability/projects/${layer?.slug}/${project.slug}`
      } else if (project.daLayer) {
        url = `/data-availability/projects/${project.slug}/no-bridge`
      }

      return {
        id: project.id,
        name: project.name,
        slug: project.slug,
        icon: manifest.getUrl(`/icons/${project.slug}.png`),
        url,
      }
    })
    .filter(notUndefined)
}
