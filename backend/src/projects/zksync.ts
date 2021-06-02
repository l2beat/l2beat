import { Services } from '../services'

const BRIDGE_ADDRESS = '0xaBEA9132b05A70803a4E85094fD0e1800777fBEF'

export async function zksync({ valueLockedChecker }: Services) {
  return {
    name: 'zkSync',
    bridges: {
      [BRIDGE_ADDRESS]: await valueLockedChecker.getTVL(
        BRIDGE_ADDRESS,
        10269890,
        ['ETH', 'DAI', 'USDC', 'USDT', 'GLM', 'WBTC']
      ),
    },
  }
}
