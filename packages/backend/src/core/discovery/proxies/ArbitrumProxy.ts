import { constants, Contract, providers } from 'ethers'

import { bytes32ToAddress } from '../utils/address'
import { getStorage } from '../utils/getStorage'
import { Eip1967Proxy } from './Eip1967Proxy'
import { extendDetect } from './extendDetect'
import { ProxyDetection } from './types'

// keccak256('eip1967.proxy.implementation.secondary') - 1)
const SECONDARY_IMPLEMENTATION_SLOT =
  '0x2b1dbce74324248c222f0ec2d5ed7bd323cfc425b336f0253c5ccfda7265546d'

export async function getSecondaryImplementation(
  provider: providers.Provider,
  contract: Contract | string,
  blockNumber: number,
) {
  return bytes32ToAddress(
    await getStorage(
      provider,
      contract,
      SECONDARY_IMPLEMENTATION_SLOT,
      blockNumber,
    ),
  )
}

async function detect(
  provider: providers.Provider,
  address: string,
  blockNumber: number,
): Promise<ProxyDetection | undefined> {
  const userImplementation = await getSecondaryImplementation(
    provider,
    address,
    blockNumber,
  )
  if (userImplementation === constants.AddressZero) {
    return
  }
  const [adminImplementation, admin] = await Promise.all([
    Eip1967Proxy.getImplementation(provider, address, blockNumber),
    Eip1967Proxy.getAdmin(provider, address, blockNumber),
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
  ...extendDetect(detect),
}
