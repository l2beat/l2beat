import { Bytes, EthereumAddress } from '@l2beat/types'

import { DiscoveryProvider } from '../provider/DiscoveryProvider'
import { bytes32ToAddress } from '../utils/address'
import { Eip1967Proxy } from './Eip1967Proxy'
import { ProxyDetection } from './types'

// keccak256('eip1967.proxy.implementation.secondary') - 1)
const SECONDARY_IMPLEMENTATION_SLOT = Bytes.fromHex(
  '0x2b1dbce74324248c222f0ec2d5ed7bd323cfc425b336f0253c5ccfda7265546d',
)

export async function getSecondaryImplementation(
  provider: DiscoveryProvider,
  address: EthereumAddress,
) {
  return bytes32ToAddress(
    await provider.getStorage(address, SECONDARY_IMPLEMENTATION_SLOT),
  )
}

async function detect(
  provider: DiscoveryProvider,
  address: EthereumAddress,
): Promise<ProxyDetection | undefined> {
  const userImplementation = await getSecondaryImplementation(provider, address)
  if (userImplementation === EthereumAddress.ZERO) {
    return
  }
  const [adminImplementation, admin] = await Promise.all([
    Eip1967Proxy.getImplementation(provider, address),
    Eip1967Proxy.getAdmin(provider, address),
  ])
  return {
    implementations: [adminImplementation, userImplementation],
    relatives: [admin],
    upgradeability: {
      type: 'arbitrum proxy',
      admin,
      adminImplementation,
      userImplementation,
    },
  }
}

export const ArbitrumProxy = {
  getAdmin: Eip1967Proxy.getAdmin,
  getAdminImplementation: Eip1967Proxy.getImplementation,
  getUserImplementation: getSecondaryImplementation,
  detect,
}
