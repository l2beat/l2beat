import type { ProxyDetails } from '@l2beat/discovery-types'

export function getImmutableProxy(): Promise<ProxyDetails | undefined> {
  return Promise.resolve({
    type: 'immutable',
    values: {
      $immutable: true,
    },
  })
}
