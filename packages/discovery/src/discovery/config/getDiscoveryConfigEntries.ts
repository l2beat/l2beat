import { isArray, isObject } from 'lodash'

import type { RawDiscoveryConfig } from './RawDiscoveryConfig'

export function getDiscoveryConfigEntries(
  rawConfig: RawDiscoveryConfig,
): string {
  const sorted = deepSortByKeys(rawConfig)
  return JSON.stringify(sorted)
}

// Inside discovery config there are fields that should not be sorted
// e.g. entries in "fields", where we call function with params in exact order
//  so changing the order of them should change config hash
const MAX_SEMANTIC_NEST_LEVEL = 2

function deepSortByKeys(
  object: Record<string, unknown>,
  nestLevel = 0,
): Record<string, unknown> {
  return Object.keys(object)
    .sort()
    .reduce((acc: Record<string, unknown>, key) => {
      const entry = object[key]

      if (isObject(entry)) {
        if (isArray(entry)) {
          acc[key] = [...entry].sort()
        } else {
          if (nestLevel >= MAX_SEMANTIC_NEST_LEVEL) {
            acc[key] = entry
          } else {
            acc[key] = deepSortByKeys(
              entry as Record<string, unknown>,
              nestLevel + 1,
            )
          }
        }
      } else {
        acc[key] = entry
      }
      return acc
    }, {})
}
