import { Services } from '../services'

const BRIDGE_ADDRESS = '0x674bdf20A0F284D710BC40872100128e2d66Bd3f'

export async function loopring({ valueLockedChecker }: Services) {
  return {
    name: 'Loopring',
    bridges: {
      [BRIDGE_ADDRESS]: await valueLockedChecker.getTVL(
        BRIDGE_ADDRESS,
        11149779,
        ['ETH', 'LRC', 'USDT', 'USDC', 'WBTC', 'DAI', 'LINK', 'MKR']
      ),
    },
  }
}
