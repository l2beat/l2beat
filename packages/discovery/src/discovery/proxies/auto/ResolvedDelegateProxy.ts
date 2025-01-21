/*
Custom proxy introduced originally by Optimism team
It stores (immutable) libAddressManager and implementation name
in addressManager[address(this)] and implementationName[address(this)]

Implementation address is resolved by calling the libAddressManager.getAddress(implementationName)

It does not have an owner

*/
import type { ContractValue, ProxyDetails } from '@l2beat/discovery-types'
import { assert, Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'

import type { Indexed, LogDescription } from 'ethers/lib/utils'
import type { IProvider } from '../../provider/IProvider'
import { getPastUpgradesSingleEvent } from '../pastUpgrades'

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

  const pastUpgrades = await getPastUpgradesSingleEvent(
    provider,
    addressManager,
    'event AddressSet(string indexed name, address implementation, address oldAddress)',
    (log: LogDescription) => {
      let name: Indexed | undefined
      log.eventFragment.inputs.forEach((input, index) => {
        if (input.name === 'name') {
          name = log.args[index] as Indexed
        }
      })
      return name?.hash === utils.id(implementationName)
    },
  )

  return {
    type: 'resolved delegate proxy',
    values: {
      $immutable: false,
      $implementation: implementation.toString(),
      $pastUpgrades: pastUpgrades as ContractValue,
      $upgradeCount: pastUpgrades.length,
      ResolvedDelegateProxy_addressManager: addressManager.toString(),
      ResolvedDelegateProxy_implementationName: implementationName,
    },
  }
}
