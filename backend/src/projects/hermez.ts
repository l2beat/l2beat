import { Services } from '../services'

const BRIDGE_ADDRESS = '0xA68D85dF56E733A06443306A095646317B5Fa633'

export async function hermez({ valueLockedChecker }: Services) {
  return {
    name: 'Hermez',
    bridges: {
      [BRIDGE_ADDRESS]: await valueLockedChecker.getTVL(
        BRIDGE_ADDRESS,
        12093596,
        ['ETH', 'USDT', 'USDC', 'DAI', 'WBTC', 'UNI', 'YFI', 'LINK']
      ),
    },
  }
}
