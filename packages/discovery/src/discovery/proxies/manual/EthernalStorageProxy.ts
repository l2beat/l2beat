import { ContractValue, ProxyDetails } from '@l2beat/discovery-types'
import { assert, EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { IProvider } from '../../provider/IProvider'
import { DateAddresses } from '../pastUpgrades'
import { utils } from 'ethers'

export async function getPastUpgrades(
  provider: IProvider,
  address: EthereumAddress,
): Promise<DateAddresses[]> {
  const abi = new utils.Interface([
    'event Upgraded(uint256 version, address indexed implementation)',
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

export async function getEternalStorageProxy(
  provider: IProvider,
  address: EthereumAddress,
): Promise<ProxyDetails | undefined> {
  const implementation = await provider.callMethod<EthereumAddress>(
    address,
    'function implementation() view returns (address)',
    [],
  )
  const admin = await provider.callMethod<EthereumAddress>(
    address,
    'function upgradeabilityOwner() view returns (address)',
    [],
  )
  if (!implementation || !admin) {
    return undefined
  }
  const pastUpgrades = await getPastUpgrades(provider, address)
  return {
    type: 'Eternal Storage proxy',
    values: {
      $admin: admin.toString(),
      $implementation: implementation.toString(),
      $pastUpgrades: pastUpgrades as ContractValue,
      $upgradeCount: pastUpgrades.length,
    },
  }
}
