import { Bytes, EthereumAddress, ProxyDetails } from '@l2beat/shared-pure'

import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { bytes32ToAddress } from '../../utils/address'

// keccak256("matic.network.proxy.implementation")
const IMPLEMENTATION_SLOT = Bytes.fromHex(
  '0xbaab7dbf64751104133af04abc7d9979f0fda3b059a322a8333f533d3f32bf7f',
)

export async function getImplementation(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
) {
  return bytes32ToAddress(
    await provider.getStorage(address, IMPLEMENTATION_SLOT, blockNumber),
  )
}

// keccak256("matic.network.proxy.owner")
const ADMIN_SLOT = Bytes.fromHex(
  '0x44f6e2e8884cba1236b7f22f351fa5d88b17292b7e0225ca47e5ecdf6055cdd6',
)

export async function getAdmin(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
) {
  return bytes32ToAddress(
    await provider.getStorage(address, ADMIN_SLOT, blockNumber),
  )
}

export async function detectPolygonProxy(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
): Promise<ProxyDetails | undefined> {
  const implementation = await getImplementation(provider, address, blockNumber)
  if (implementation === EthereumAddress.ZERO) {
    return
  }
  const admin = await getAdmin(provider, address, blockNumber)
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
