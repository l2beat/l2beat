import type { ProxyDetails } from '../types'

export function getImmutableProxy(): Promise<ProxyDetails | undefined> {
  return Promise.resolve({
    type: 'immutable',
    values: {
      $immutable: true,
    },
  })
}
