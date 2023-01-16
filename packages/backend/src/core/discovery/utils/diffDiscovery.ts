import { EthereumAddress } from '@l2beat/types'

import { DiscoveryContract } from '../DiscoveryConfig'
import { ContractParameters } from '../types'
import { diffContracts, FieldDiff } from './diffContracts'

export interface DiscoveryDiff {
  name: string
  address: EthereumAddress
  diff?: FieldDiff[]
  type?: 'created' | 'deleted'
}

export function diffDiscovery(
  committed: unknown[],
  discovered: ContractParameters[],
  overrides: Record<string, DiscoveryContract>,
): DiscoveryDiff[] {
  const modifiedOrDeleted: DiscoveryDiff[] = []

  const committedCasted = committed as ContractParameters[]

  for (const c of committedCasted) {
    const i = discovered.find((d) => d.address === c.address)
    if (i === undefined) {
      modifiedOrDeleted.push({
        name: c.name,
        address: c.address,
        type: 'deleted',
      })
      continue
    }
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const ignored: string[] = overrides[c.address.toString()]
      ? overrides[c.address.toString()].ignoreInWatchMode ?? []
      : []

    const difference = diffContracts(c, i, ignored)

    if (difference.length > 0) {
      modifiedOrDeleted.push({
        name: c.name,
        address: c.address,
        diff: diffContracts(c, i, ignored),
      })
    }
  }

  const created: DiscoveryDiff[] = []

  for (const d of discovered) {
    const i = committedCasted.find((c) => c.address === d.address)
    if (i === undefined) {
      created.push({ name: d.name, address: d.address, type: 'created' })
    }
  }

  return modifiedOrDeleted.concat(created)
}
