import { Bytes, EthereumAddress, ProxyDetection } from '@l2beat/shared'

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
) {
  return bytes32ToAddress(
    await provider.getStorage(address, SECONDARY_IMPLEMENTATION_SLOT),
  )
}

export async function detectArbitrumProxy(
  provider: DiscoveryProvider,
  address: EthereumAddress,
): Promise<ProxyDetection | undefined> {
  const userImplementation = await getSecondaryImplementation(provider, address)
  if (userImplementation === EthereumAddress.ZERO) {
    return
  }
  const [adminImplementation, admin] = await Promise.all([
    getImplementation(provider, address),
    getAdmin(provider, address),
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
