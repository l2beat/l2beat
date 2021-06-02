import { Services } from '../services'

const BRIDGE_ADDRESS_1 = '0x045e507925d2e05D114534D0810a1abD94aca8d6'
const BRIDGE_ADDRESS_2 = '0x674bdf20A0F284D710BC40872100128e2d66Bd3f'

export async function optimism({ valueLockedChecker }: Services) {
  return {
    name: 'Optimism',
    bridges: {
      [BRIDGE_ADDRESS_1]: await valueLockedChecker.getTVL(
        BRIDGE_ADDRESS_1,
        11656238,
        ['SNX']
      ),
      [BRIDGE_ADDRESS_2]: await valueLockedChecker.getTVL(
        BRIDGE_ADDRESS_2,
        12409015,
        ['SNX']
      ),
    },
  }
}
