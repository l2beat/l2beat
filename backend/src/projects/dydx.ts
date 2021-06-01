import { Config, queryTVL } from '../services'

const BRIDGE_ADDRESS = '0xD54f502e184B6B739d7D27a6410a67dc462D69c8'

export async function dydx(config: Config) {
  return {
    name: 'dYdX',
    bridges: {
      [BRIDGE_ADDRESS]: await queryTVL(config, {
        address: BRIDGE_ADDRESS,
        sinceBlock: 11834295,
        tokens: ['USDC'],
      }),
    },
  }
}
