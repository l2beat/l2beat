import { Hash256 } from '@l2beat/types'

import { hashJson } from '../../../tools/hashJson'
import { DiscoveryConfig } from '../DiscoveryConfig'

export function getDiscoveryConfigHash(config: DiscoveryConfig): Hash256 {
  return hashJson(getDiscoveryConfigEntries(config))
}

export function getDiscoveryConfigEntries(config: DiscoveryConfig): string {
  const sorted = deepSortByKeys(config)
  return JSON.stringify(sorted)
}

const MAX_SEMANTIC_NEST_LEVEL = 2

function deepSortByKeys(object: Record<string, unknown>, nestLevel = 0) {
  return Object.keys(object)
    .sort()
    .reduce(function (acc, key) {
      if (typeof object[key] === 'object') {
        // @ts-expect-error cannot determine type, generic sorting
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        if (object[key].length !== undefined) {
          // @ts-expect-error cannot determine type, generic sorting
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
          acc[key] = object[key].sort()
        } else {
          if (nestLevel >= MAX_SEMANTIC_NEST_LEVEL) {
            // @ts-expect-error cannot determine type, generic sorting
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            acc[key] = object[key]
          } else {
            // @ts-expect-error cannot determine type, generic sorting
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            acc[key] = deepSortByKeys(object[key], nestLevel + 1)
          }
        }
      } else {
        // @ts-expect-error cannot determine type, generic sorting
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        acc[key] = object[key]
      }
      return acc
    }, {})
}
