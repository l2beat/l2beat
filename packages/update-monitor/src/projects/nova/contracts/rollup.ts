import { Contract, providers } from 'ethers'

import { bytes32ToAddress } from '../../../common/address'
import {
  getEip1967Admin,
  getEip1967Implementation,
} from '../../../common/eip1967'
import { ContractParameters } from '../../../types'
import { addresses } from '../constants'

export async function getRollup(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  return {
    name: 'Rollup',
    address: addresses.rollup,
    upgradeability: {
      type: 'arbitrum proxy',
      adminImplementation: await getEip1967Implementation(
        provider,
        addresses.rollup,
      ),
      userImplementation: await getArbitrumSecondaryImplementation(
        provider,
        addresses.rollup,
      ),
    },
    values: {
      admin: await getEip1967Admin(provider, addresses.rollup),
    },
  }
}

// keccak256('eip1967.proxy.implementation.secondary') - 1)
export const ARBITRUM_SECONDARY_IMPLEMENTATION_SLOT =
  '0x2b1dbce74324248c222f0ec2d5ed7bd323cfc425b336f0253c5ccfda7265546d'

export async function getArbitrumSecondaryImplementation(
  provider: providers.Provider,
  contract: Contract | string,
) {
  const address = typeof contract === 'string' ? contract : contract.address
  const value = await provider.getStorageAt(
    address,
    ARBITRUM_SECONDARY_IMPLEMENTATION_SLOT,
  )
  return bytes32ToAddress(value)
}
