import { Services } from '../services'

const BRIDGE_ADDRESS = '0x6880f6Fd960D1581C2730a451A22EED1081cfD72'

export async function fuel({ valueLockedChecker }: Services) {
  return {
    name: 'Fuel',
    bridges: {
      [BRIDGE_ADDRESS]: await valueLockedChecker.getTVL(
        BRIDGE_ADDRESS,
        11787727,
        ['DAI', 'USDT', 'USDC']
      ),
    },
  }
}
