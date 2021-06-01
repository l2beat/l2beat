import { Config, queryTVL } from '../tools'

const BRIDGE_ADDRESS = '0xf86FD6735f88d5b6aa709B357AD5Be22CEDf1A05'

export async function layer2finance(config: Config) {
  return {
    name: 'Layer2.Finance',
    bridges: {
      [BRIDGE_ADDRESS]: await queryTVL(config, {
        address: BRIDGE_ADDRESS,
        sinceBlock: 12283778,
        tokens: ['WETH', 'DAI', 'USDC', 'USDT', 'BUSD'],
      }),
    },
  }
}
