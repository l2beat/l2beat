/*
Custom proxy introduced originally by Optimism team
It stores (immutable) libAddressManager and implementation name
in addressManager[address(this)] and implementationName[address(this)]

Implementation address is resolved by calling the libAddressManager.getAddress(implementationName)

It does not have an owner

*/
import { ContractValue, ProxyDetails } from '@l2beat/discovery-types'
import { assert, Bytes, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { utils } from 'ethers'

import { IProvider } from '../../provider/IProvider'
import { DateAddresses } from '../pastUpgrades'

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

export async function getPastUpgrades(
  provider: IProvider,
  address: EthereumAddress,
  implementationName: string,
): Promise<DateAddresses[]> {
  const abi = new utils.Interface([
    'event AddressSet(string indexed name, address newAddress, address oldAddress)',
  ])
  const encodedImplementationName = utils.id(implementationName);
  const logs = await provider.getLogs(address, [
    [abi.getEventTopic('AddressSet')],
    encodedImplementationName,
  ])

  const blockNumbers = [...new Set(logs.map((l) => l.blockNumber))]
  const blocks = await Promise.all(
    blockNumbers.map(
      async (blockNumber) => await provider.getBlock(blockNumber),
    ),
  )
  assert(blocks.every((b) => b !== undefined))
  const dateMap = Object.fromEntries(
    blocks.map((b) => [
      b.number,
      new UnixTime(b.timestamp).toDate().toISOString(),
    ]),
  )

  return logs.map((l) => {
    const implementation = abi.parseLog(l).args[1]
    console.log(abi.parseLog(l))
    return [dateMap[l.blockNumber] ?? 'ERROR', [implementation]]
  })
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

  const pastUpgrades = await getPastUpgrades(
    provider,
    addressManager,
    implementationName,
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
