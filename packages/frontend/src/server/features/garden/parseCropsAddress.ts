import { ChainSpecificAddress, EthereumAddress } from '@l2beat/shared-pure'
import { ps } from '~/server/projects'

export interface ParsedCropsAddress {
  /** Long chain name, as the address index is keyed. */
  chain: string
  address: EthereumAddress
}

export interface ChainLookup {
  byChainId: Map<number, string>
  longNames: Set<string>
}

let chains: ChainLookup | undefined

async function loadChains(): Promise<ChainLookup> {
  if (!chains) {
    const projects = await ps.getProjects({ select: ['chainConfig'] })
    const byChainId = new Map<number, string>()
    const longNames = new Set<string>()
    for (const project of projects) {
      longNames.add(project.chainConfig.name)
      if (project.chainConfig.chainId !== undefined) {
        byChainId.set(project.chainConfig.chainId, project.chainConfig.name)
      }
    }
    chains = { byChainId, longNames }
  }
  return chains
}

export async function parseCropsAddress(
  input: string,
): Promise<ParsedCropsAddress | undefined> {
  return parseCropsAddressWith(input, await loadChains())
}

/**
 * Accepts what a wallet is likely to have on hand: an ERC-3770 short name
 * (`eth:0x…`), a long chain name (`ethereum:0x…`), or a chain id (`1:0x…`).
 * Returns undefined rather than throwing, so one bad entry in a batch does not
 * fail the whole request.
 */
export function parseCropsAddressWith(
  input: string,
  chains: ChainLookup,
): ParsedCropsAddress | undefined {
  const trimmed = input.trim()
  const separator = trimmed.lastIndexOf(':')
  if (separator <= 0) {
    return undefined
  }
  const chainPart = trimmed.slice(0, separator)
  const addressPart = trimmed.slice(separator + 1)

  let address: EthereumAddress
  try {
    // Lowercase first: a wallet may send a mixed-case address whose checksum
    // does not validate, and we only need the canonical form to key the index.
    address = EthereumAddress(addressPart.toLowerCase())
  } catch {
    return undefined
  }

  const chain = resolveChain(chainPart, address, chains)
  return chain ? { chain, address } : undefined
}

function resolveChain(
  chainPart: string,
  address: EthereumAddress,
  chains: ChainLookup,
): string | undefined {
  if (/^\d+$/.test(chainPart)) {
    return chains.byChainId.get(Number(chainPart))
  }
  if (chains.longNames.has(chainPart)) {
    return chainPart
  }
  // Not a long name, so try it as an ERC-3770 short name. This both validates
  // the short name and gives us the long one.
  try {
    return ChainSpecificAddress.longChain(
      ChainSpecificAddress(`${chainPart}:${address}`),
    )
  } catch {
    return undefined
  }
}
