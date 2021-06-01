import { Config, queryTVL } from '../services'

const BRIDGE_ADDRESS = '0x674bdf20A0F284D710BC40872100128e2d66Bd3f'

export async function loopring(config: Config) {
  return {
    name: 'Loopring',
    bridges: {
      [BRIDGE_ADDRESS]: await queryTVL(config, {
        address: BRIDGE_ADDRESS,
        sinceBlock: 11149779,
        tokens: ['ETH', 'LRC', 'USDT', 'USDC', 'WBTC', 'DAI', 'LINK', 'MKR'],
      }),
    },
  }
}
