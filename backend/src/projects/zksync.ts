import { Config, queryTVL } from '../services'

const BRIDGE_ADDRESS = '0xaBEA9132b05A70803a4E85094fD0e1800777fBEF'

export async function zksync(config: Config) {
  return {
    name: 'zkSync',
    bridges: {
      [BRIDGE_ADDRESS]: await queryTVL(config, {
        address: BRIDGE_ADDRESS,
        sinceBlock: 10269890,
        tokens: ['ETH', 'DAI', 'USDC', 'USDT', 'GLM', 'WBTC'],
      }),
    },
  }
}
