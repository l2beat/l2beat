import { ContractParameters } from '@l2beat/shared-pure'
import { diff } from 'deep-diff'

export interface FieldDiff {
  key?: string
  before?: string
  after?: string
}

export function diffContracts(
  before: ContractParameters,
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
            }]`,
          }
          if (difference.item.kind === 'N') {
            r.after = JSON.stringify(difference.item.rhs)
          }
          if (difference.item.kind === 'D') {
            r.before = JSON.stringify(difference.item.lhs)
          }
          if (difference.item.kind === 'E') {
            r.before = JSON.stringify(difference.item.lhs)
            r.after = JSON.stringify(difference.item.rhs)
          }
          result.push(r)
        }
        break
    }
  }

  const filteredResult = result.filter((r) => {
    if (r.key === undefined) {
      return true
    }
    if (r.key.includes('values.')) {
      for (const i of ignoreInWatchMode) {
        if (r.key.includes(`values.${i}`)) {
          return false
        }
      }
    }
    return true
  })

  return filteredResult
}
