/*
Custom proxy introduced originally by Optimism team
It stores (immutable) libAddressManager and implementation name
in addressManager[address(this)] and implementationName[address(this)]

Implementation address is resolved by calling the libAddressManager.getAddress(implementationName)

It does not have an owner

*/
import { assert } from '@l2beat/backend-tools'
import { ProxyDetails } from '@l2beat/discovery-types'
import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'

import { IProvider } from '../../provider/IProvider'

async function getAddressManager(
  provider: IProvider,
  address: EthereumAddress,
): Promise<EthereumAddress> {
  // addressManager is stored in libAddressManager[address(this)] (slot 1)
  const slot = Bytes.fromHex(
    utils.keccak256(
      new utils.AbiCoder().encode(['address', 'uint'], [address, 1]),
    ),
  )
  return await provider.getStorageAsAddress(address, slot)
}

async function getImplementationName(
  provider: IProvider,
  address: EthereumAddress,
): Promise<string> {
  // implementationName is stored in implementationName[address(this)] (slot 0)
  const slot = Bytes.fromHex(
    utils.keccak256(
      new utils.AbiCoder().encode(['address', 'uint'], [address, 0]),
    ),
  )
  const nameEncoded = (await provider.getStorage(address, slot)).toString()
  const length = parseInt(nameEncoded.slice(-2), 16) / 2
  if (length > 31) {
    throw new Error(
      'Unsupported long string. Please add more code to handle this case',
    )
  }
  return utils.toUtf8String(nameEncoded.slice(0, 2 + length * 2))
}

async function getImplementation(
  provider: IProvider,
  addressManager: EthereumAddress,
  implementationName: string,
): Promise<EthereumAddress> {
  const implementation = await provider.callMethod<EthereumAddress>(
    addressManager,
    'function getAddress(string implementationName) view returns(address)',
    [implementationName],
  )
  // TODO: This should be handled more gracefully, it's just a heuristic!
  assert(implementation, 'missing implementation')
  return implementation
}

export async function detectResolvedDelegateProxy(
  provider: IProvider,
  address: EthereumAddress,
): Promise<ProxyDetails | undefined> {
  const addressManager = await getAddressManager(provider, address)
  if (addressManager === EthereumAddress.ZERO) {
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
      type: 'resolved delegate proxy',
      addressManager,
      implementationName,
      implementation,
    },
  }
}
