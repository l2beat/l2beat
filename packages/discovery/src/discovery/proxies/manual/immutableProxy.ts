import type { ProxyDetails } from '../types.js'

export function getImmutableProxy(): Promise<ProxyDetails | undefined> {
  return Promise.resolve({
    type: 'immutable',
    values: {
      $immutable: true,
    },
  })
}
