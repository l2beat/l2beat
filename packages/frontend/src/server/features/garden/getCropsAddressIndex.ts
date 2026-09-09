import { ChainSpecificAddress, type EthereumAddress } from '@l2beat/shared-pure'
import { ps } from '~/server/projects'

export interface CropsAddressMatch {
  projectId: string
  /** Discovery's name for the contract or permission at this address. */
  targetName: string
}

export interface CropsAddressIndex {
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
 * Address -> reviewed project, from the contracts and permissions of every
 * project with crops. Keyed by long chain name and checksummed address, and
 * memoized for the process like getContractUtils.
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
    // A shared contract belongs to several projects, but each claims it once.
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
