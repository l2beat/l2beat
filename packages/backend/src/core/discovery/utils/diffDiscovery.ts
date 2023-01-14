import { EthereumAddress } from '@l2beat/types'
import { diff } from 'deep-diff'

import { DiscoveryContract } from '../DiscoveryConfig'
import { ContractParameters } from '../types'

export interface DiscoveryDiff {
  name: string
  address: EthereumAddress
  diff: FieldDiff[]
}

export interface FieldDiff {
  key: string | undefined
  before?: string
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
  before: unknown,
  after: ContractParameters,
  ignoreInWatchMode: string[],
): FieldDiff[] {
  const differences = diff(before, after)

  if (differences === undefined) {
    return []
  }

  const result: FieldDiff[] = []

  for (const difference of differences) {
    switch (difference.kind) {
      case 'N':
        result.push({
          key: difference.path?.join('.'),
          after: JSON.stringify(difference.rhs),
        })
        break
      case 'D':
        result.push({
          key: difference.path?.join('.'),
          before: JSON.stringify(difference.lhs),
        })
        break
      case 'E':
        result.push({
          key: difference.path?.join('.'),
          before: JSON.stringify(difference.lhs),
          after: JSON.stringify(difference.rhs),
        })
        break
      case 'A':
        {
          const r: FieldDiff = {
            key: `${difference.path?.join('.') ?? 'undefined'}[${
              difference.index  
            }]`
          }
          if(difference.item.kind === 'N') {
            r.after = JSON.stringify(difference.item.rhs)
          }
          if(difference.item.kind === 'D') {
            r.before = JSON.stringify(difference.item.lhs)
          }
          if(difference.item.kind === 'E') {
            r.before = JSON.stringify(difference.item.lhs)
            r.after = JSON.stringify(difference.item.rhs)
          }
          result.push(r)
        }
        break
    }
  }

  for (const ignored of ignoreInWatchMode) {
    const index = result.findIndex((r) => r.key?.includes(`values.${ignored}`))
    if (index > -1) {
      result.splice(index, 1)
    }
  }

  //ignore

  return result
}
