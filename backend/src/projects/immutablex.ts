import { Config, queryTVL } from '../services'

const BRIDGE_ADDRESS = '0x5FDCCA53617f4d2b9134B29090C87D01058e27e9'

export async function immutablex(config: Config) {
  return {
    name: 'ImmutableX',
    bridges: {
      [BRIDGE_ADDRESS]: await queryTVL(config, {
        address: BRIDGE_ADDRESS,
        sinceBlock: 12011518,
        tokens: ['ETH'],
      }),
    },
  }
}
