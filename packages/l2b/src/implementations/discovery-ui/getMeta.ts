import type { DiscoveryOutput } from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { getContractType } from './getContractType'
import type { ApiAddressType } from './types'

export type ContractsMeta = Record<
  string,
  { name?: string; type: ApiAddressType }
>

export function getMeta(discoveries: DiscoveryOutput[]): ContractsMeta {
  const meta: Record<string, { name?: string; type: ApiAddressType }> = {}
  const chains = new Set<string>()
  for (const discovery of discoveries) {
    for (const entry of discovery.entries) {
      const address = entry.address
      chains.add(ChainSpecificAddress.longChain(entry.address))
      if (entry.type === 'EOA') {
        meta[address] = { name: entry.name || undefined, type: 'EOA' }
      } else {
        meta[address] = {
          name: entry.name || undefined,
          type: getContractType(entry),
        }
      }
    }
  }

  for (const chain of chains) {
    const zero = ChainSpecificAddress.ZERO(chain)
    meta[zero] = { name: 'ZERO', type: 'Unknown' }
  }

  return meta
}
