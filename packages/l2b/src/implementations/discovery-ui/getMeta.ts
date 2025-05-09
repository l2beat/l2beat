import type { DiscoveryOutput } from '@l2beat/discovery'
import { EthereumAddress } from '@l2beat/shared-pure'
import { getContractType } from './getContractType'
import { toAddress } from './toAddress'
import type { ApiAddressType } from './types'

export type ContractsMeta = Record<
  string,
  { name?: string; type: ApiAddressType }
>

export function getMeta(discoveries: DiscoveryOutput[]): ContractsMeta {
  const meta: Record<string, { name?: string; type: ApiAddressType }> = {}
  for (const discovery of discoveries) {
    for (const entry of discovery.entries) {
      const address = toAddress(discovery.chain, entry.address)
      if (entry.type === 'EOA') {
        meta[address] = { name: entry.name || undefined, type: 'EOA' }
      } else {
        meta[address] = {
          name: entry.name || undefined,
          type: getContractType(entry),
        }
      }
    }
    const zero = toAddress(discovery.chain, EthereumAddress.ZERO)
    meta[zero] = { name: 'ZERO', type: 'Unknown' }
  }
  return meta
}
