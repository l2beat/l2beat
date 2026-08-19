import { ChainSpecificAddress, type EthereumAddress } from '@l2beat/shared-pure'
import { ps } from '~/server/projects'

/** How the address relates to the project that was reviewed. */
export type CropsAddressRole = 'proxy' | 'implementation' | 'permission'

export interface CropsAddressMatch {
  projectId: string
  /** Discovery's name for the contract or permission at this address. */
  targetName: string
  role: CropsAddressRole
}

export interface CropsAddressIndex {
  /** Every project match for a chain + address, or an empty list. */
  lookup(chain: string, address: EthereumAddress): CropsAddressMatch[]
}

// Only the fields the index needs, so tests can supply plain fixtures.
interface IndexedContract {
  address: ChainSpecificAddress
  name: string
  upgradeability?:
    | { immutable?: boolean; implementations: ChainSpecificAddress[] }
    | undefined
}

interface IndexedPermission {
  name: string
  accounts: { address: ChainSpecificAddress }[]
}

export interface IndexedProject {
  id: string
  contracts?: { addresses: Record<string, IndexedContract[]> } | undefined
  permissions?:
    | Record<
        string,
        | { actors?: IndexedPermission[]; roles?: IndexedPermission[] }
        | undefined
      >
    | undefined
}

let index: CropsAddressIndex | undefined

/**
 * Address -> reviewed project, built from the contracts and permissions in the
 * built config database. Scoped to projects that declare crops, so a wallet
 * asking about anything else gets a clean empty answer rather than a partial
 * one, and the index stays small enough to hold in memory.
 *
 * Mirrors getContractUtils: keyed by long chain name and checksummed address,
 * memoized for the process, and reading no discovery files at request time.
 */
export async function getCropsAddressIndex(): Promise<CropsAddressIndex> {
  if (index) {
    return index
  }
  const projects = await ps.getProjects({
    where: ['crops'],
    select: ['crops'],
    optional: ['contracts', 'permissions'],
  })
  index = buildCropsAddressIndex(projects)
  return index
}

export function buildCropsAddressIndex(
  projects: IndexedProject[],
): CropsAddressIndex {
  const byChain = new Map<string, Map<EthereumAddress, CropsAddressMatch[]>>()

  function add(
    chain: string,
    address: EthereumAddress,
    match: CropsAddressMatch,
  ) {
    let byAddress = byChain.get(chain)
    if (!byAddress) {
      byAddress = new Map()
      byChain.set(chain, byAddress)
    }
    let matches = byAddress.get(address)
    if (!matches) {
      matches = []
      byAddress.set(address, matches)
    }
    // A shared contract can belong to several projects, but one project should
    // only claim an address once in a given role.
    if (
      !matches.some(
        (x) => x.projectId === match.projectId && x.role === match.role,
      )
    ) {
      matches.push(match)
    }
  }

  for (const project of projects) {
    for (const chain in project.contracts?.addresses ?? {}) {
      for (const contract of project.contracts?.addresses[chain] ?? []) {
        const isMutable =
          contract.upgradeability && !contract.upgradeability.immutable
        add(chain, ChainSpecificAddress.address(contract.address), {
          projectId: project.id,
          targetName: contract.name,
          role: isMutable ? 'proxy' : 'implementation',
        })
        for (const implementation of contract.upgradeability?.implementations ??
          []) {
          add(chain, ChainSpecificAddress.address(implementation), {
            projectId: project.id,
            targetName: contract.name,
            role: 'implementation',
          })
        }
      }
    }

    for (const chain in project.permissions ?? {}) {
      const permissions = [
        ...(project.permissions?.[chain]?.actors ?? []),
        ...(project.permissions?.[chain]?.roles ?? []),
      ]
      for (const permission of permissions) {
        for (const account of permission.accounts) {
          add(chain, ChainSpecificAddress.address(account.address), {
            projectId: project.id,
            targetName: permission.name,
            role: 'permission',
          })
        }
      }
    }
  }

  return {
    lookup(chain, address) {
      return byChain.get(chain)?.get(address) ?? []
    },
  }
}
