/* 
Custom proxy introduced originally by Optimism team
It stores (immutable) libAddressManager and implementation name
in addressManager[address(this)] and implementationName[address(this)]

Implementation address is resolved by calling the libAddressManager.getAddress(implementationName)

It does not have an owner

*/
import { constants, Contract, providers } from 'ethers'
import { keccak256, toUtf8String } from 'ethers/lib/utils'

import { Lib_AddressManager__factory } from '../../typechain'
import { bytes32ToAddress } from '../address'
import { getStorage } from '../getStorage'
import { extendDetect } from './extendDetect'
import { ProxyDetection } from './types'

async function getAddressManager(
  provider: providers.Provider,
  contract: Contract | string,
) {
  const slot = '1' // // addressManager is stored in libAddressManager[address(this)]
  const address = contract.toLowerCase().slice(2) // change to lower case and remove trailing 0x
  const s = '0x' + address.padStart(64, 0) + slot.padStart(64, 0)
  return bytes32ToAddress(await getStorage(provider, contract, keccak256(s)))
}

async function getImplementationName(
  provider: providers.Provider,
  contract: Contract | string,
) {
  const slot = '0' // implementationName is stored in implementationName[address(this)]
  const address = contract.toLowerCase().slice(2) // change to lower case and remove leading 0x
  const s = '0x' + address.padStart(64, 0) + slot.padStart(64, 0)
  let implName = await getStorage(provider, contract, keccak256(s))
  implName = implName.slice(0, -2).replace(/0+$/, '') // remove last byte + trailing 00s
  return toUtf8String(implName)
}

async function getImplementation(
  provider: providers.Provider,
  contract: Contract | string,
  implementationName: string,
) {
  const libManager = Lib_AddressManager__factory.connect(
    contract.toString(),
    provider,
  )
  return await libManager.getAddress(implementationName)
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

  return {
    implementations: [implementation],
    relatives: [addressManager],
    upgradeability: {
      type: 'ResolvedDelegateProxy',
      implementation,
    },
  }
}

export const ResolvedDelegateProxy = {
  getImplementation,
  ...extendDetect(detect),
}
