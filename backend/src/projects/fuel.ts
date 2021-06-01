import { Config, queryTVL } from '../tools'

const BRIDGE_ADDRESS = '0x6880f6Fd960D1581C2730a451A22EED1081cfD72'

export async function fuel(config: Config) {
  return {
    name: 'Fuel',
    bridges: {
      [BRIDGE_ADDRESS]: await queryTVL(config, {
        address: BRIDGE_ADDRESS,
        sinceBlock: 11787727,
        tokens: ['DAI', 'USDT', 'USDC'],
      }),
    },
  }
}
