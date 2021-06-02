import { Services } from '../services'

const BRIDGE_ADDRESS = '0xf86FD6735f88d5b6aa709B357AD5Be22CEDf1A05'

export async function layer2finance({ valueLockedChecker }: Services) {
  return {
    name: 'Layer2.Finance',
    bridges: {
      [BRIDGE_ADDRESS]: await valueLockedChecker.getTVL(
        BRIDGE_ADDRESS,
        12283778,
        ['WETH', 'DAI', 'USDC', 'USDT', 'BUSD']
      ),
    },
  }
}
