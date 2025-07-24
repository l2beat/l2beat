import {
  assert,
  ChainSpecificAddress,
  EthereumAddress,
  Hash256,
  UnixTime,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type { ContractValue } from '../../output/types'
import type { IProvider } from '../../provider/IProvider'
import { getImplementation } from '../auto/Eip1967Proxy'
import type { DateAddresses } from '../pastUpgrades'
import type { ProxyDetails } from '../types'

async function getPastUpgrades(
  provider: IProvider,
  address: ChainSpecificAddress,
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
      let implementation: ChainSpecificAddress | undefined
      parsed.eventFragment.inputs.forEach((input, index) => {
        if (input.name === 'implementation') {
          implementation = ChainSpecificAddress.fromLong(
            provider.chain,
            parsed.args[index],
          )
        }
      })
      assert(implementation !== undefined)

      const providerAtBlock = await provider.switchBlock(l.blockNumber)
      const oldFork = await providerAtBlock.callMethod<EthereumAddress>(
        address,
        'function oldFork() view returns (address)',
        [],
      )
      const newFork = await providerAtBlock.callMethod<EthereumAddress>(
        address,
        'function newFork() view returns (address)',
        [],
      )

      return [
        dateMap[l.blockNumber] ?? 'ERROR',
        Hash256(l.transactionHash),
        [
          implementation,
          ChainSpecificAddress.fromLong(
            provider.chain,
            oldFork ?? EthereumAddress.ZERO,
          ),
          ChainSpecificAddress.fromLong(
            provider.chain,
            newFork ?? EthereumAddress.ZERO,
          ),
        ],
      ]
    }),
  )
}

export async function gatTaikoForkProxy(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<ProxyDetails | undefined> {
  const mainImplementation = await getImplementation(provider, address)
  const oldFork = await provider.callMethod<EthereumAddress>(
    address,
    'function oldFork() view returns (address)',
    [],
  )
  const newFork = await provider.callMethod<EthereumAddress>(
    address,
    'function newFork() view returns (address)',
    [],
  )

  const admin = await provider.callMethod<EthereumAddress>(
    address,
    'function owner() view returns (address)',
    [],
  )

  const pastUpgrades = await getPastUpgrades(provider, address)
  const implementations = [
    ...new Set([
      mainImplementation,
      ChainSpecificAddress.fromLong(
        provider.chain,
        oldFork ?? EthereumAddress.ZERO,
      ),
      ChainSpecificAddress.fromLong(
        provider.chain,
        newFork ?? EthereumAddress.ZERO,
      ),
    ]),
  ]
  return {
    type: 'TaikoFork proxy',
    values: {
      $admin: ChainSpecificAddress.fromLong(
        provider.chain,
        admin ?? EthereumAddress.ZERO,
      ).toString(),
      $implementation: implementations.filter(
        (i) => i !== ChainSpecificAddress.ZERO(provider.chain),
      ),
      $pastUpgrades: pastUpgrades as ContractValue,
      $upgradeCount: pastUpgrades.length,
    },
  }
}
