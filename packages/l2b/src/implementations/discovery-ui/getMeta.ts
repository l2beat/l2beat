import type { DiscoveryOutput } from '@l2beat/discovery'
import { EthereumAddress } from '@l2beat/shared-pure'
import { getContractType } from './getContractType'
import type { ApiAddressType } from './types'

export type ContractsMeta = Record<
  string,
  { name?: string; type: ApiAddressType }
>

export function getMeta(discoveries: DiscoveryOutput[]): ContractsMeta {
  const meta: Record<string, { name?: string; type: ApiAddressType }> = {}
  for (const discovery of discoveries) {
    for (const contract of discovery.contracts) {
      const address = contract.address.toString()
      meta[address] = {
        name: contract.name || undefined,
        type: getContractType(contract),
      }
    }
    for (const eoa of discovery.eoas) {
      const address = eoa.address.toString()
      meta[address] = { name: eoa.name || undefined, type: 'EOA' }
    }
  }
  meta[EthereumAddress.ZERO] = { name: 'ZERO', type: 'Unknown' }
  return meta
}
