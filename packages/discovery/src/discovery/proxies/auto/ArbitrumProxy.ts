import { ProxyDetails } from '@l2beat/discovery-types'
import { Bytes, EthereumAddress } from '@l2beat/shared-pure'

import { IProvider } from '../../provider/IProvider'
import { getAdmin, getImplementation } from './Eip1967Proxy'

// keccak256('eip1967.proxy.implementation.secondary') - 1)
const SECONDARY_IMPLEMENTATION_SLOT = Bytes.fromHex(
  '0x2b1dbce74324248c222f0ec2d5ed7bd323cfc425b336f0253c5ccfda7265546d',
)

export async function detectArbitrumProxy(
  provider: IProvider,
  address: EthereumAddress,
): Promise<ProxyDetails | undefined> {
  const userImplementation = await provider.getStorageAsAddress(
    address,
    SECONDARY_IMPLEMENTATION_SLOT,
  )
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
