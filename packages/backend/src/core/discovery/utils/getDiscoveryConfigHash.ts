import { Hash256 } from '@l2beat/types'

import { hashJson } from '../../../tools/hashJson'
import { DiscoveryConfig } from '../DiscoveryConfig'

export function getDiscoveryConfigHash(config: DiscoveryConfig): Hash256 {
  return hashJson(getDiscoveryConfigEntries(config))
}

export function getDiscoveryConfigEntries(config: DiscoveryConfig): string {
  const sorted = sortByKey(config)
  return JSON.stringify(sorted)
}

function sortByKey(not_sorted: Record<string, any>, nestLevel = 0) {
  const maxNest = 2
  return Object.keys(not_sorted)
    .sort()
    .reduce(function (acc, key) {
      if(typeof not_sorted[key] === 'object') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if(not_sorted[key].length !== undefined) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
          acc[key] = not_sorted[key].sort()
        } else {
          if(nestLevel >= maxNest) {
            acc[key] = not_sorted[key]
          } else {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            acc[key] = sortByKey(not_sorted[key], nestLevel + 1)
          }
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        acc[key] = not_sorted[key]
      }
      return acc
    }, {})
}
