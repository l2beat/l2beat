import { ChainSpecificAddress, type EthereumAddress } from '@l2beat/shared-pure'
import { ps } from '~/server/projects'

export interface CropsAddressMatch {
  projectId: string
  /** Discovery's name for the contract or permission at this address. */
  targetName: string
}

export interface CropsAddressIndex {
  /** Every reviewed project claiming a chain + address, or an empty list. */
  lookup(chain: string, address: EthereumAddress): CropsAddressMatch[]
}

// Only the fields the index needs, so tests can supply plain fixtures.
interface IndexedContract {
  address: ChainSpecificAddress
  name: string
  upgradeability?: { implementations: ChainSpecificAddress[] } | undefined
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
    address: ChainSpecificAddress,
    match: CropsAddressMatch,
  ) {
    let byAddress = byChain.get(chain)
    if (!byAddress) {
      byAddress = new Map()
      byChain.set(chain, byAddress)
    }
    const bare = ChainSpecificAddress.address(address)
    let matches = byAddress.get(bare)
    if (!matches) {
      matches = []
      byAddress.set(bare, matches)
    }
    // A shared contract can belong to several projects, but a project claims
    // an address once, under the first name it was met by - the contract's
    // when it is both a contract and a permission holder.
    if (!matches.some((x) => x.projectId === match.projectId)) {
      matches.push(match)
    }
  }

  for (const project of projects) {
    for (const [chain, contracts] of Object.entries(
      project.contracts?.addresses ?? {},
    )) {
      for (const contract of contracts) {
        const match = { projectId: project.id, targetName: contract.name }
        add(chain, contract.address, match)
        // An implementation is reached through its proxy, so a wallet asking
        // about either should get the same answer.
        for (const implementation of contract.upgradeability?.implementations ??
          []) {
          add(chain, implementation, match)
        }
      }
    }

    for (const [chain, permissions] of Object.entries(
      project.permissions ?? {},
    )) {
      for (const permission of [
        ...(permissions?.actors ?? []),
        ...(permissions?.roles ?? []),
      ]) {
        for (const account of permission.accounts) {
          add(chain, account.address, {
            projectId: project.id,
            targetName: permission.name,
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
