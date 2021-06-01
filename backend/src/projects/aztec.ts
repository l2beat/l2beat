import { Config, queryTVL } from '../tools'

const BRIDGE_ADDRESS = '0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba'

export async function aztec(config: Config) {
  return {
    name: 'Aztec',
    bridges: {
      [BRIDGE_ADDRESS]: await queryTVL(config, {
        address: BRIDGE_ADDRESS,
        sinceBlock: 11967192,
        tokens: ['ETH'],
      }),
    },
  }
}
