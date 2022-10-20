import { constants, Contract, providers } from 'ethers'

import { ContractParameters } from '../../types'
import { bytes32ToAddress } from '../address'
import { Eip1967Proxy } from './Eip1967Proxy'
import { ProxyDetection, UpgradeabilityParameters } from './types'

// keccak256('eip1967.proxy.implementation.secondary') - 1)
export const SECONDARY_IMPLEMENTATION_SLOT =
  '0x2b1dbce74324248c222f0ec2d5ed7bd323cfc425b336f0253c5ccfda7265546d'

export async function getSecondaryImplementation(
  provider: providers.Provider,
  contract: Contract | string,
) {
  const address = typeof contract === 'string' ? contract : contract.address
  const value = await provider.getStorageAt(
    address,
    SECONDARY_IMPLEMENTATION_SLOT,
  )
  return bytes32ToAddress(value)
}

async function getContract(
  provider: providers.Provider,
  address: string,
  name: string,
): Promise<ContractParameters> {
  return {
    name,
    address,
    upgradeability: await getUpgradeability(provider, address),
  }
}

async function getUpgradeability(
  provider: providers.Provider,
  contract: Contract | string,
): Promise<UpgradeabilityParameters> {
  return {
    type: 'arbitrum proxy',
    admin: await Eip1967Proxy.getAdmin(provider, contract),
    adminImplementation: await Eip1967Proxy.getImplementation(
      provider,
      contract,
    ),
    userImplementation: await getSecondaryImplementation(provider, contract),
  }
}

async function detect(
  provider: providers.Provider,
  address: string,
): Promise<ProxyDetection | undefined> {
  const userImplementation = await getSecondaryImplementation(provider, address)
  if (userImplementation === constants.AddressZero) {
    return
  }
  const adminImplementation = await Eip1967Proxy.getImplementation(
    provider,
    address,
  )
  const admin = await Eip1967Proxy.getAdmin(provider, address)
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
  getContract,
  getUpgradeability,
  detect,
}
