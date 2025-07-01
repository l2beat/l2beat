import type { ContractValueType } from '../config/ColorConfig'
import type { ContractFieldSeverity } from '../config/StructureConfig'
import { normalizeDiffPath } from '../utils/normalizeDiffPath'
import { diff } from './diff'
import type { EntryParameters } from './types'

export interface FieldDiff {
  key: string
  before?: string
  after?: string
  severity?: ContractFieldSeverity
  description?: string
  type?: ContractValueType[] | ContractValueType
}

export function diffContracts(
  before: EntryParameters,
  after: EntryParameters,
  ignore: string[],
): FieldDiff[] {
  const differences = diff(before, after)

  if (differences === undefined) {
    return []
  }

  const result: FieldDiff[] = []

  for (const difference of differences) {
    switch (difference.kind) {
      case 'create':
        result.push({
          key: difference.path?.join('.') ?? '',
          after: JSON.stringify(difference.rhs),
        })
        break
      case 'remove':
        result.push({
          key: difference.path?.join('.') ?? '',
          before: JSON.stringify(difference.lhs),
        })
        break
      case 'change':
        result.push({
          key: difference.path?.join('.') ?? '',
          before: JSON.stringify(difference.lhs),
          after: JSON.stringify(difference.rhs),
        })
        break
    }
  }

  const filteredResult = result.filter((r) => {
    return !ignore.some((i) => r.key.startsWith(i))
  })

  return filteredResult.map((entry) => ({
    ...entry,
    severity: after.fieldMeta?.[normalizeDiffPath(entry.key)]?.severity,
    description: after.fieldMeta?.[normalizeDiffPath(entry.key)]?.description,
    type: after.fieldMeta?.[normalizeDiffPath(entry.key)]?.type,
  }))
}
