import { EthereumAddress } from '@l2beat/types'
import { diff } from 'deep-diff'

import { DiscoveryContract } from '../DiscoveryConfig'
import { ContractParameters } from '../types'

export interface DiscoveryDiff {
  name: string,
  address: EthereumAddress
  diff: FieldDiff[]
}

export interface FieldDiff {
    key: string,
    before?: string,
    after?: string
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
): FieldDiff[] {
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
