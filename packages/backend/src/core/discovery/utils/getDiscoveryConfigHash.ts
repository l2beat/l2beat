import { Hash256 } from '@l2beat/types'

import { hashJson } from '../../../tools/hashJson'
import { DiscoveryConfig } from '../DiscoveryConfig'

export function getDiscoveryConfigHash(config: DiscoveryConfig): Hash256 {
  return hashJson(getDiscoveryConfigEntries(config))
}

export function getDiscoveryConfigEntries(config: DiscoveryConfig): string {
  const not_sorted = config
  console.log(not_sorted)

  const sorted = Object.keys(not_sorted)
    .sort()
    .reduce((acc, key) => {
      if (key === 'overrides') {
        const not_sorted2 = not_sorted[key]

        const sorted2 = Object.keys(not_sorted2)
          .sort()
          .reduce((acc, key) => {
            const not_sorted3 = not_sorted2[key]
            const sorted3 = Object.keys(not_sorted3)
            .sort()
            .reduce((acc, key) => ({
                ...acc, [key]: not_sorted3[key]
            }), {})

            return {
              ...acc,
              [key]: sorted3,
            }
          }, {})

        return { ...acc, [key]: sorted2 }
      } else {
        return { ...acc, [key]: not_sorted[key] }
      }
    }, {})

  console.log(sorted) //{a: true, b: false}
  return JSON.stringify(sorted)
}
