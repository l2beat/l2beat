import { Services } from '../services'

const BRIDGE_ADDRESS = '0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad'

export async function zkswap({ valueLockedChecker }: Services) {
  return {
    name: 'ZKSwap',
    bridges: {
      [BRIDGE_ADDRESS]: await valueLockedChecker.getTVL(
        BRIDGE_ADDRESS,
        11841962,
        [
          'ETH',
          'USDC',
          'WBTC',
          'SUSHI',
          'UNI',
          '1INCH',
          'AAVE',
          'LRC',
          'YFI',
          'SNX',
          'RUNE',
          'MKR',
          'LINK',
          'REN',
          'DAI',
          'USDT',
          'BUSD',
        ]
      ),
    },
  }
}
