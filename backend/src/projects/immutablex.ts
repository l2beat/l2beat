import { Services } from '../services'

const BRIDGE_ADDRESS = '0x5FDCCA53617f4d2b9134B29090C87D01058e27e9'

export async function immutablex({ valueLockedChecker }: Services) {
  return {
    name: 'ImmutableX',
    bridges: {
      [BRIDGE_ADDRESS]: await valueLockedChecker.getTVL(
        BRIDGE_ADDRESS,
        12011518,
        ['ETH']
      ),
    },
  }
}
