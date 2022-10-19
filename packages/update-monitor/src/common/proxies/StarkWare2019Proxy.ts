import { constants, Contract, providers } from 'ethers'

import {
  ContractParameters,
  ProxyDetection,
  UpgradeabilityParameters,
} from '../../types'
import { bytes32ToAddress } from '../address'

// keccak256("StarkWare2019.implemntation-slot")
const STARK_WARE_2019_IMPLEMENTATION_SLOT =
  '0x177667240aeeea7e35eabe3a35e18306f336219e1386f7710a6bf8783f761b24'

async function getImplementation(
  provider: providers.Provider,
  contract: Contract | string,
) {
  const address = typeof contract === 'string' ? contract : contract.address
  const value = await provider.getStorageAt(
    address,
    STARK_WARE_2019_IMPLEMENTATION_SLOT,
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
    type: 'StarkWare2019 proxy',
    implementation: await getImplementation(provider, contract),
  }
}

async function detect(
  provider: providers.Provider,
  address: string,
): Promise<ProxyDetection | undefined> {
  const implementation = await getImplementation(provider, address)
  if (implementation === constants.AddressZero) {
    return
  }
  return {
    implementations: [implementation],
    relatives: [],
    upgradeability: {
      type: 'proxy',
      implementation,
    },
  }
}

export const StarkWare2019Proxy = {
  getImplementation,
  getContract,
  getUpgradeability,
  detect,
}
