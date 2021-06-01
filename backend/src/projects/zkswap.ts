import { Config, queryTVL } from '../tools'

const BRIDGE_ADDRESS = '0x8eca806aecc86ce90da803b080ca4e3a9b8097ad'

export async function zkswap(config: Config) {
  return {
    name: 'ZKSwap',
    bridges: {
      [BRIDGE_ADDRESS]: await queryTVL(config, {
        address: BRIDGE_ADDRESS,
        sinceBlock: 11841962,
        tokens: [
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
        ],
      }),
    },
  }
}
