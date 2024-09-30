import { ContractValue, ProxyDetails } from '@l2beat/discovery-types'
import { assert, EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { IProvider } from '../../provider/IProvider'
import { getImplementation } from '../auto/Eip1967Proxy'
import { DateAddresses } from '../pastUpgrades'
import { utils } from 'ethers'

async function getRegistryAddress(
  provider: IProvider,
  address: EthereumAddress,
): Promise<EthereumAddress> {
  const registry = await provider.callMethod<string>(
    address,
    'function bridgeRegistry() view returns (address)',
    [],
  )
  if (registry === undefined) {
    // Assume we're the registry
    return address
  }

  return EthereumAddress(registry)
}

async function getAdminMultisig(
  provider: IProvider,
  address: EthereumAddress,
): Promise<EthereumAddress> {
  const registry = await getRegistryAddress(provider, address)
  const multisig = await provider.callMethod<string>(
    registry,
    'function getMultisig() view returns (address)',
    [],
  )
  assert(multisig !== undefined, 'Multisig not found')

  return EthereumAddress(multisig.toString())
}

export async function getPastUpgrades(
  provider: IProvider,
  address: EthereumAddress,
): Promise<DateAddresses[]> {
  const abi = new utils.Interface([
    'event Upgraded(address indexed implementation)',
  ])
  const logs = await provider.getLogs(address, [
    [abi.getEventTopic('Upgraded')],
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
    const implementation = abi.parseLog(l).args.implementation
    return [dateMap[l.blockNumber] ?? 'ERROR', [implementation]]
  })
}

export async function getLightLinkProxy(
  provider: IProvider,
  address: EthereumAddress,
): Promise<ProxyDetails | undefined> {
  const implementation = await getImplementation(provider, address)
  if (implementation === EthereumAddress.ZERO) {
    return
  }
  const admin = await getAdminMultisig(provider, address)
  const pastUpgrades = await getPastUpgrades(provider, address)
  return {
    type: 'LightLink proxy',
    values: {
      $admin: admin.toString(),
      $implementation: implementation.toString(),
      $pastUpgrades: pastUpgrades as ContractValue,
      $upgradeCount: pastUpgrades.length,
    },
  }
}
