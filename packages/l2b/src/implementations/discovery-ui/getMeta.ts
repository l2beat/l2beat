import type { EntryParameters } from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { getContractType } from './getContractType'
import type { ApiAddressType } from './types'

export type ContractsMeta = Record<
  string,
  { name?: string; type: ApiAddressType }
>

export function getMeta(entries: EntryParameters[]): ContractsMeta {
  const meta: Record<string, { name?: string; type: ApiAddressType }> = {}
  const chains = new Set<string>()
  for (const entry of entries) {
    const address = entry.address
    chains.add(ChainSpecificAddress.longChain(entry.address))
    if (entry.type === 'EOA') {
      meta[address] = {
        name: entry.name || undefined,
        // Starknet multisig accounts are EOA entries carrying $signers
        type: Array.isArray(entry.values?.$signers) ? 'Multisig' : 'EOA',
      }
    } else {
      meta[address] = {
        name: entry.name || undefined,
        type: getContractType(entry),
      }
    }
  }

  for (const chain of chains) {
    const zero = ChainSpecificAddress.ZERO(chain)
    meta[zero] = { name: 'ZERO', type: 'Unknown' }
  }

  return meta
}
