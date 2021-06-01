import { Config, queryTVL } from '../tools'

const BRIDGE_ADDRESS = '0xA68D85dF56E733A06443306A095646317B5Fa633'

export async function hermez(config: Config) {
  return {
    name: 'Hermez',
    bridges: {
      [BRIDGE_ADDRESS]: await queryTVL(config, {
        address: BRIDGE_ADDRESS,
        sinceBlock: 12093596,
        tokens: ['ETH', 'USDT', 'USDC', 'DAI', 'WBTC', 'UNI', 'YFI', 'LINK'],
      }),
    },
  }
}
