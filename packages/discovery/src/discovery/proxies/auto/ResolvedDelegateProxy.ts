/* 
Custom proxy introduced originally by Optimism team
It stores (immutable) libAddressManager and implementation name
in addressManager[address(this)] and implementationName[address(this)]

Implementation address is resolved by calling the libAddressManager.getAddress(implementationName)

It does not have an owner

*/
import { assert } from '@l2beat/backend-tools'
import { ProxyDetails } from '@l2beat/discovery-types'
import { utils } from 'ethers'

import { Bytes } from '../../../utils/Bytes'
import { EthereumAddress } from '../../../utils/EthereumAddress'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { bytes32ToAddress } from '../../utils/address'
import { getCallResult } from '../../utils/getCallResult'

async function getAddressManager(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
): Promise<EthereumAddress> {
  // addressManager is stored in libAddressManager[address(this)] (slot 1)
  const slot = Bytes.fromHex(
    utils.keccak256(
      new utils.AbiCoder().encode(['address', 'uint'], [address, 1]),
    ),
  )
  return bytes32ToAddress(await provider.getStorage(address, slot, blockNumber))
}

async function getImplementationName(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
): Promise<string> {
  // implementationName is stored in implementationName[address(this)] (slot 0)
  const slot = Bytes.fromHex(
    utils.keccak256(
      new utils.AbiCoder().encode(['address', 'uint'], [address, 0]),
    ),
  )
  const nameEncoded = (
    await provider.getStorage(address, slot, blockNumber)
  ).toString()
  const length = parseInt(nameEncoded.slice(-2), 16) / 2
  if (length > 31) {
    throw new Error(
      'Unsupported long string. Please add more code to handle this case',
    )
  }
  return utils.toUtf8String(nameEncoded.slice(0, 2 + length * 2))
}

async function getImplementation(
  provider: DiscoveryProvider,
  addressManager: EthereumAddress,
  implementationName: string,
  blockNumber: number,
): Promise<EthereumAddress> {
  const implementation = await getCallResult<string>(
    provider,
    addressManager,
    'function getAddress(string implementationName) view returns(address)',
    [implementationName],
    blockNumber,
  )

  assert(implementation, 'missing implementation')

  return EthereumAddress(implementation)
}

export async function detectResolvedDelegateProxy(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
): Promise<ProxyDetails | undefined> {
  const addressManager = await getAddressManager(provider, address, blockNumber)
  if (addressManager === EthereumAddress.ZERO) {
    return
  }
  const implementationName = await getImplementationName(
    provider,
    address,
    blockNumber,
  )
  if (implementationName === '') {
    return
  }
  const implementation = await getImplementation(
    provider,
    addressManager,
    implementationName,
    blockNumber,
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
