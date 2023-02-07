import { Hash256 } from '@l2beat/types'
import { isArray, isObject } from 'lodash'

import { hashJson } from '../../../tools/hashJson'
import { DiscoveryConfig } from '../DiscoveryConfig'

export function getDiscoveryConfigHash(config: DiscoveryConfig): Hash256 {
  return hashJson(getDiscoveryConfigEntries(config))
}

export function getDiscoveryConfigEntries(config: DiscoveryConfig): string {
  const sorted = deepSortByKeys(config)
  return JSON.stringify(sorted)
}

// Inside discovery config there are fields that should not be sorted
// e.g. entries in "fields", where we call function with params in exact order
//  so changing the order of them should change config hash
const MAX_SEMANTIC_NEST_LEVEL = 2

function deepSortByKeys(object: Record<string, unknown>, nestLevel = 0) {
  return Object.keys(object)
    .sort()
    .reduce(function (acc: Record<string, unknown>, key) {
      const entry = object[key]

      if (isObject(entry)) {
        if (isArray(entry)) {
          acc[key] = entry.sort()
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
