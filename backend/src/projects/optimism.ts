import { Config, queryTVL } from '../tools'

const BRIDGE_ADDRESS_1 = '0x045e507925d2e05D114534D0810a1abD94aca8d6'
const BRIDGE_ADDRESS_2 = '0x674bdf20A0F284D710BC40872100128e2d66Bd3f'

export async function optimism(config: Config) {
  return {
    name: 'Optimism',
    bridges: {
      [BRIDGE_ADDRESS_1]: await queryTVL(config, {
        address: BRIDGE_ADDRESS_1,
        sinceBlock: 11656238,
        tokens: ['SNX'],
      }),
      [BRIDGE_ADDRESS_2]: await queryTVL(config, {
        address: BRIDGE_ADDRESS_2,
        sinceBlock: 12409015,
        tokens: ['SNX'],
      }),
    },
  }
}
