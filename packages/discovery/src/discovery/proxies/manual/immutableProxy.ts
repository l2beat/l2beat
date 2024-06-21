import { ProxyDetails } from '@l2beat/discovery-types'

export function getImmutableProxy(): Promise<ProxyDetails | undefined> {
  return Promise.resolve({
    upgradeability: {
      type: 'immutable',
    },
    implementations: [],
    relatives: [],
  })
}
