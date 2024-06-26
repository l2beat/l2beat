import { ProxyDetails } from '@l2beat/discovery-types'
import { Bytes, EthereumAddress } from '@l2beat/shared-pure'

import { IProvider } from '../../provider/IProvider'

// keccak256("matic.network.proxy.implementation")
const IMPLEMENTATION_SLOT = Bytes.fromHex(
  '0xbaab7dbf64751104133af04abc7d9979f0fda3b059a322a8333f533d3f32bf7f',
)

// keccak256("matic.network.proxy.owner")
const ADMIN_SLOT = Bytes.fromHex(
  '0x44f6e2e8884cba1236b7f22f351fa5d88b17292b7e0225ca47e5ecdf6055cdd6',
)

export async function detectPolygonProxy(
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
  const admin = await provider.getStorageAsAddress(address, ADMIN_SLOT)
  return {
    implementations: [implementation],
    relatives: [admin],
    upgradeability: {
      type: 'Polygon proxy',
      implementation,
      admin,
    },
  }
}
