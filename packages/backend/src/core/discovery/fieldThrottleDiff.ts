import { DiscoveryDiff } from '@l2beat/discovery'
import { EthereumAddress } from '@l2beat/shared-pure'

import { UpdateNotifierRecord } from '../../peripherals/database/discovery/UpdateNotifierRepository'

const DEFAULT_OCCURRENCE_LIMIT = 3

export function fieldThrottleDiff(
  previousRecords: UpdateNotifierRecord[],
  diff: DiscoveryDiff[],
  occurrenceLimit = DEFAULT_OCCURRENCE_LIMIT,
): DiscoveryDiff[] {
  const previousDiffs = previousRecords.flatMap((r) => r.diff)
  if (previousDiffs.length < occurrenceLimit) {
    return diff
  }

  const counts = countFieldOccurrencesInDiffs(previousDiffs)
  const filteredInside = diff.map((d) => {
    if (d.diff === undefined) {
      return d
    }

    return {
      ...d,
      diff: d.diff.filter((field) => {
        if (field.key === undefined) {
          return field
        }

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        const count = counts[getFieldKey(d.address, field.key)] ?? 0
        return count < occurrenceLimit
      }),
    }
  })

  return filteredInside.filter((d) => {
    if (d.diff === undefined) {
      return true
    }

    return d.diff.length !== 0
  })
}

function countFieldOccurrencesInDiffs(diffs: DiscoveryDiff[]) {
  const result: Record<string, number> = {}

  for (const diff of diffs) {
    if (diff.diff === undefined) {
      continue
    }

    for (const field of diff.diff) {
      if (field.key === undefined) {
        continue
      }

      const key = getFieldKey(diff.address, field.key)
      result[key] ??= 0
      result[key] += 1
    }
  }

  return result
}

function getFieldKey(address: EthereumAddress, fieldKey: string): string {
  return `${address.toString()}:${fieldKey}`
}
