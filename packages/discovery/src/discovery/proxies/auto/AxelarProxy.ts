import { ProxyDetails } from '@l2beat/discovery-types'
import { Bytes, EthereumAddress } from '@l2beat/shared-pure'

import { IProvider } from '../../provider/IProvider'

// keccak256(abi.encode(uint256(keccak256('eip1967.proxy.implementation')) - 1, s))
// where `s` is the slot of the `_addressStorage`, so in this case it's s = 2
const IMPLEMENTATION_SLOT = Bytes.fromHex(
  '0x11141f466c69fd409e1990e063b49cd6d61ed2ecff27a2e402e259ca6b9a01a3',
)

export async function detectAxelarProxy(
  provider: IProvider,
  address: EthereumAddress,
): Promise<ProxyDetails | undefined> {
  const implementation = await provider.getStorageAsAddress(
    address,
    IMPLEMENTATION_SLOT,
  )
  if (implementation === EthereumAddress.ZERO) {
    return
  }

  return {
    implementations: [implementation],
    relatives: [],
    upgradeability: {
      type: 'Axelar proxy',
      implementation,
    },
  }
}
