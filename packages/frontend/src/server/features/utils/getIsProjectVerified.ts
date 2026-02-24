import type { Project } from '@l2beat/config'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { ProjectChanges } from '~/server/features/projects-change-report/getProjectsChangeReport'

const UNVERIFIED_CONTRACTS_WARNING =
  'This project includes unverified contracts.'

const UNSUCCESSFUL_PROGRAM_HASHES_WARNING =
  'The project relies on program hashes that could not be successfully reproduced from their published sources.'

const UNSUCCESSFUL_VERIFIER_IDS_WARNING =
  'This project relies on ZK verifiers with unknown sources'

interface ProjectVerificationWarnings {
  contracts: string | undefined
  programHashes: string | undefined
  verifierIds: string | undefined
}

type ProjectForVerificationWarnings = Project<'statuses', 'contracts'> & {
  scalingInfo?: Project<'scalingInfo'>['scalingInfo']
}

export function getProjectVerificationWarnings(
  project: ProjectForVerificationWarnings,
  changes: ProjectChanges | undefined,
  zkCatalogProjects?: Project<'zkCatalogInfo'>[],
): ProjectVerificationWarnings {
  return {
    contracts: areContractsVerified(
      project.statuses.unverifiedContracts,
      changes,
    )
      ? undefined
      : UNVERIFIED_CONTRACTS_WARNING,
    programHashes: project.contracts?.programHashes?.some(
      (hash) => hash.verificationStatus === 'unsuccessful',
    )
      ? UNSUCCESSFUL_PROGRAM_HASHES_WARNING
      : undefined,
    verifierIds: hasUnsuccessfulVerifierIds(project, zkCatalogProjects)
      ? UNSUCCESSFUL_VERIFIER_IDS_WARNING
      : undefined,
  }
}

function hasUnsuccessfulVerifierIds(
  project: ProjectForVerificationWarnings,
  zkCatalogProjects: Project<'zkCatalogInfo'>[] | undefined,
): boolean {
  const zkCatalogId = project.scalingInfo?.proofSystem?.zkCatalogId
  if (!zkCatalogId || !zkCatalogProjects) {
    return false
  }

  const zkCatalogProject = zkCatalogProjects.find((p) => p.id === zkCatalogId)
  if (!zkCatalogProject) {
    return false
  }

  const contractsByChain = new Map<string, Set<string>>()
  for (const contracts of Object.values(project.contracts?.addresses ?? {})) {
    for (const contract of contracts) {
      const chain = ChainSpecificAddress.longChain(contract.address)
      const address = ChainSpecificAddress.address(
        contract.address,
      ).toLowerCase()
      const knownContracts = contractsByChain.get(chain) ?? new Set<string>()
      knownContracts.add(address)
      contractsByChain.set(chain, knownContracts)
    }
  }

  return zkCatalogProject.zkCatalogInfo.verifierHashes.some((verifier) => {
    if (verifier.verificationStatus !== 'unsuccessful') {
      return false
    }

    return verifier.knownDeployments.some((deployment) => {
      if (deployment.overrideUsedIn?.includes(project.id)) {
        return true
      }

      return (
        contractsByChain
          .get(deployment.chain)
          ?.has(deployment.address.toLowerCase()) === true
      )
    })
  })
}

function areContractsVerified(
  becameVerifiedContracts: ChainSpecificAddress[],
  changes: ProjectChanges | undefined,
): boolean {
  if (becameVerifiedContracts.length === 0) {
    return true
  }
  if (!changes) {
    return false
  }

  return becameVerifiedContracts.every((c) => {
    const chain = ChainSpecificAddress.longChain(c)

    return changes.becameVerifiedContracts[chain]?.includes(
      ChainSpecificAddress.address(c),
    )
  })
}
