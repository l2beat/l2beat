import { Bytes, EthereumAddress, ProxyDetails } from '@l2beat/shared-pure'

import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { bytes32ToAddress } from '../../utils/address'
import { getAdmin, getImplementation } from './Eip1967Proxy'

// keccak256('eip1967.proxy.implementation.secondary') - 1)
const SECONDARY_IMPLEMENTATION_SLOT = Bytes.fromHex(
  '0x2b1dbce74324248c222f0ec2d5ed7bd323cfc425b336f0253c5ccfda7265546d',
)

async function getSecondaryImplementation(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
) {
  return bytes32ToAddress(
    await provider.getStorage(
      address,
      SECONDARY_IMPLEMENTATION_SLOT,
      blockNumber,
    ),
  )
}

export async function detectArbitrumProxy(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
): Promise<ProxyDetails | undefined> {
  const userImplementation = await getSecondaryImplementation(
    provider,
    address,
    blockNumber,
  )
  if (userImplementation === EthereumAddress.ZERO) {
    return
  }
  const [adminImplementation, admin] = await Promise.all([
    getImplementation(provider, address, blockNumber),
    getAdmin(provider, address, blockNumber),
  ])
  return {
    implementations: [adminImplementation, userImplementation],
    relatives: [admin],
    upgradeability: {
      type: 'Arbitrum proxy',
      admin,
      adminImplementation,
      userImplementation,
    },
  }
}
