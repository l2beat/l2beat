import { Services } from '../services'

const BRIDGE_ADDRESS = '0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba'

export async function aztec({ valueLockedChecker }: Services) {
  return {
    name: 'Aztec',
    bridges: {
      [BRIDGE_ADDRESS]: await valueLockedChecker.getTVL(
        BRIDGE_ADDRESS,
        11967192,
        ['ETH']
      ),
    },
  }
}
