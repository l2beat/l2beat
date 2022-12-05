/* 
Custom proxy introduced originally by Optimism team
It stores (immutable) libAddressManager and implementation name
in addressManager[address(this)] and implementationName[address(this)]

Implementation address is resolved by calling the libAddressManager.getAddress(implementationName)

It does not have an owner

*/
import { constants, Contract, providers, utils } from 'ethers'

import { bytes32ToAddress } from '../address'
import { getCallResult } from '../getCallResult'
import { getStorage } from '../getStorage'
import { extendDetect } from './extendDetect'
import { ProxyDetection } from './types'

async function getAddressManager(
  provider: providers.Provider,
  contract: Contract | string,
) {
  const address = typeof contract === 'string' ? contract : contract.address
  // addressManager is stored in libAddressManager[address(this)] (slot 1)
  const slot = utils.keccak256(
    new utils.AbiCoder().encode(['address', 'uint'], [address, 1]),
  )
  return bytes32ToAddress(await getStorage(provider, contract, slot))
}

async function getImplementationName(
  provider: providers.Provider,
  contract: Contract | string,
) {
  const address = typeof contract === 'string' ? contract : contract.address
  // implementationName is stored in implementationName[address(this)] (slot 0)
  const slot = utils.keccak256(
    new utils.AbiCoder().encode(['address', 'uint'], [address, 0]),
  )
  const nameEncoded = await getStorage(provider, contract, slot)
  const length = parseInt(nameEncoded.slice(-2), 16) / 2
  if (length > 31) {
    throw new Error(
      'Unsupported long string. Please add more code to handle this case',
    )
  }
  return utils.toUtf8String(nameEncoded.slice(0, 2 + length * 2))
}

async function getImplementation(
  provider: providers.Provider,
  addressManager: string,
  implementationName: string,
) {
  return getCallResult<string>(
    provider,
    addressManager,
    'function getAddress(string implementationName) view returns(address)',
    [implementationName],
  )
}

async function detect(
  provider: providers.Provider,
  address: string,
): Promise<ProxyDetection | undefined> {
  const addressManager = await getAddressManager(provider, address)
  if (addressManager === constants.AddressZero) {
    return
  }
  const implementationName = await getImplementationName(provider, address)
  if (implementationName === '') {
    return
  }
  const implementation = await getImplementation(
    provider,
    addressManager,
    implementationName,
  )
  if (!implementation) {
    return
  }

  return {
    implementations: [implementation],
    relatives: [addressManager],
    upgradeability: {
      type: 'resolved delegate proxy',
      addressManager,
      implementationName,
      implementation,
    },
  }
}

export const ResolvedDelegateProxy = {
  getAddressManager,
  getImplementationName,
  ...extendDetect(detect),
}
