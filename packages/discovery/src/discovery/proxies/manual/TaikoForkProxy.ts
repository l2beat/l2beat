import { assert, EthereumAddress, Hash256, UnixTime } from '@l2beat/shared-pure'
import type { ProxyDetails } from '../types'

import { utils } from 'ethers'
import type { ContractValue } from '../../output/types'
import type { IProvider } from '../../provider/IProvider'
import { getImplementation } from '../auto/Eip1967Proxy'
import type { DateAddresses } from '../pastUpgrades'

async function getPastUpgrades(
  provider: IProvider,
  address: EthereumAddress,
): Promise<DateAddresses[]> {
  const abi = new utils.Interface([
    'event Upgraded(address indexed implementation)',
  ])
  const topics = Object.values(abi.events).map((e) => abi.getEventTopic(e.name))
  const logs = await provider.getLogs(address, [topics])

  const blockNumbers = [...new Set(logs.map((l) => l.blockNumber))]
  const blocks = await Promise.all(
    blockNumbers.map(
      async (blockNumber) => await provider.getBlock(blockNumber),
    ),
  )
  assert(blocks.every((b) => b !== undefined))
  const dateMap = Object.fromEntries(
    blocks.map((b) => [b.number, UnixTime.toDate(b.timestamp).toISOString()]),
  )

  return await Promise.all(
    logs.map(async (l) => {
      const parsed = abi.parseLog(l)
      let implementation: EthereumAddress | undefined
      parsed.eventFragment.inputs.forEach((input, index) => {
        if (input.name === 'implementation') {
          implementation = parsed.args[index]
        }
      })
      assert(implementation !== undefined)

      const providerAtBlock = provider.switchBlock(l.blockNumber)
      const oldFork =
        (await providerAtBlock.callMethod<EthereumAddress>(
          address,
          'function oldFork() view returns (address)',
          [],
        )) ?? EthereumAddress.ZERO
      const newFork =
        (await providerAtBlock.callMethod<EthereumAddress>(
          address,
          'function newFork() view returns (address)',
          [],
        )) ?? EthereumAddress.ZERO

      return [
        dateMap[l.blockNumber] ?? 'ERROR',
        Hash256(l.transactionHash),
        [implementation, oldFork, newFork],
      ]
    }),
  )
}

export async function gatTaikoForkProxy(
  provider: IProvider,
  address: EthereumAddress,
): Promise<ProxyDetails | undefined> {
  const mainImplementation = await getImplementation(provider, address)
  const oldFork =
    (await provider.callMethod<EthereumAddress>(
      address,
      'function oldFork() view returns (address)',
      [],
    )) ?? EthereumAddress.ZERO
  const newFork =
    (await provider.callMethod<EthereumAddress>(
      address,
      'function newFork() view returns (address)',
      [],
    )) ?? EthereumAddress.ZERO

  const admin = await provider.callMethod<EthereumAddress>(
    address,
    'function owner() view returns (address)',
    [],
  )

  const pastUpgrades = await getPastUpgrades(provider, address)
  const implementations = [...new Set([mainImplementation, oldFork, newFork])]
  return {
    type: 'TaikoFork proxy',
    values: {
      $admin: (admin ?? EthereumAddress.ZERO).toString(),
      $implementation: implementations.filter(
        (i) => i !== EthereumAddress.ZERO,
      ),
      $pastUpgrades: pastUpgrades as ContractValue,
      $upgradeCount: pastUpgrades.length,
    },
  }
}
