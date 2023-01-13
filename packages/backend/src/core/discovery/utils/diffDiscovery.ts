import { EthereumAddress } from '@l2beat/types'
import { diff } from 'deep-diff'

import { DiscoveryContract } from '../DiscoveryConfig'
import { ContractParameters } from '../types'

export interface DiscoveryDiff {
  address: EthereumAddress
  // creation or deletion should not happen in ideal world
  // but AFAIK we do not have any check on CI to validate that discovered.json is and output of config.jsonc
  diff: string[] | 'created' | 'deleted'
}

export function diffDiscovery(
  committed: ContractParameters[],
  discovered: ContractParameters[],
  overrides: Record<string, DiscoveryContract>,
): DiscoveryDiff[] {
  const modifiedOrDeleted: DiscoveryDiff[] = committed.map((c) => {
    const i = discovered.find((d) => d.address === c.address)
    if (i === undefined) {
      return {
        address: c.address,
        diff: 'deleted',
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const ignored: string[] = overrides[c.address.toString()]
      ? overrides[c.address.toString()].ignoreInWatchMode ?? []
      : []

    return {
      address: c.address,
      diff: diffContract(c, i, ignored),
    }
  })

  const created: DiscoveryDiff[] = []

  for (const d of discovered) {
    const i = committed.find((c) => c.address === d.address)
    if (i === undefined) {
      created.push({ address: d.address, diff: 'created' })
    }
  }

  return modifiedOrDeleted.concat(created)
}

export function diffContract(
  before: ContractParameters,
  after: ContractParameters,
  ignoreInWatchMode: string[],
): string[] {
  const differences = diff(before, after)

  if (differences === undefined) {
    return []
  }

  const differentKeys = differences.map((d) => d.path?.join('.') ?? '')

  for (const ignored of ignoreInWatchMode) {
    const index = differentKeys.findIndex((d) =>
      d.includes(`values.${ignored}`),
    )
    if (index > -1) {
      differentKeys.splice(index)
    }
  }

  return differentKeys
}
