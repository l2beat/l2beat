import { Services } from '../services'

const BRIDGE_ADDRESS = '0xD54f502e184B6B739d7D27a6410a67dc462D69c8'

export async function dydx({ valueLockedChecker }: Services) {
  return {
    name: 'dYdX',
    bridges: {
      [BRIDGE_ADDRESS]: await valueLockedChecker.getTVL(
        BRIDGE_ADDRESS,
        11834295,
        ['USDC']
      ),
    },
  }
}
