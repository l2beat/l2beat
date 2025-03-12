import {
  assert,
  Bytes,
  EthereumAddress,
  Hash256,
  UnixTime,
} from '@l2beat/shared-pure'
import type { ProxyDetails } from '../types'

import { utils } from 'ethers'
import { zip } from 'lodash'
import type { ContractValue } from '../../output/types'
import type { IProvider } from '../../provider/IProvider'
import { getImplementation } from '../auto/Eip1967Proxy'
import type { DateAddresses } from '../pastUpgrades'

// keccak256('settlement_module');
const _SETTLEMENT_MODULE = Bytes.fromHex(
  '0x6dfbf1f9b1b8149b4152d3df1baf2fbb1699371f65f4d524b48d5e0751e0b22a',
)

// keccak256('handler_module');
const _HANDLER_MODULE = Bytes.fromHex(
  '0x5c86e67c717ab9efac1e3dd619c8daf7324c618fac5780a40d1cd2eb60bda58c',
)

// keccak256('message_receiver_module');
const _MESSAGE_RECEIVER_MODULE = Bytes.fromHex(
  '0xc403c812342707d09fd9ef8f6b2d40758844b1257b1382653ceb92aae69e9ca2',
)

// keccak256('manager_module');
const _MANAGER_MODULE = Bytes.fromHex(
  '0xbf068c0764ea506c843c3f32c133889110d2da98699c31460a430f0d0f1b6af4',
)

// keccak256('protocol_payment');
const _PROTOCOL_PAYMENT = Bytes.fromHex(
  '0xfdc4e467dfd44b3d2df27a34df5e575b6e05f23175a191932946ae3397133b73',
)

export const modules = [
  _SETTLEMENT_MODULE,
  _HANDLER_MODULE,
  _MESSAGE_RECEIVER_MODULE,
  _MANAGER_MODULE,
  _PROTOCOL_PAYMENT,
]

async function getModule(
  provider: IProvider,
  address: EthereumAddress,
  module: Bytes,
): Promise<EthereumAddress> {
  const result = await provider.callMethod<EthereumAddress>(
    address,
    'function modules(bytes32 _moduleType) external view returns (address _module)',
    [module.toString()],
  )

  return result ?? EthereumAddress.ZERO
}

async function getPastUpgrades(
  provider: IProvider,
  address: EthereumAddress,
  current: Record<string, EthereumAddress>,
): Promise<DateAddresses[]> {
  const abi = new utils.Interface([
    'event ModuleAddressUpdated(bytes32 type, address previousAddress, address newAddress)',
    'event Upgraded(address indexed implementation)',
  ])
  const logs = await provider.getLogs(address, [
    [abi.getEventTopic('ModuleAddressUpdated'), abi.getEventTopic('Upgraded')],
  ])

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
  const modules = Object.keys(current)
  const addressEvolution: Record<string, EthereumAddress[]> = {}
  for (const log of logs.map((l) => abi.parseLog(l))) {
    if (log.name === 'ModuleAddressUpdated') {
      const module = log.args.type
      addressEvolution[module] ??= []
      addressEvolution[module].push(EthereumAddress(log.args.previousAddress))
    }
  }

  for (const [module, address] of Object.entries(current)) {
    addressEvolution[module] ??= []
    addressEvolution[module].push(address)
  }

  let mainAddress: EthereumAddress | undefined
  return logs.map((l) => {
    const parsed = abi.parseLog(l)

    if (parsed.name === 'ModuleAddressUpdated') {
      addressEvolution[parsed.args.type]?.shift()
    } else if (parsed.name === 'Upgraded') {
      mainAddress = parsed.args.implementation
    }

    assert(mainAddress !== undefined, 'Unexpected event state')
    const implementations = [
      mainAddress,
      ...modules.map((m) => {
        const address = addressEvolution[m]?.[0]
        assert(
          address !== undefined,
          `Missing address for module ${m} at block ${l.blockNumber}. Ensure addressEvolution is properly populated.`,
        )
        return address
      }),
    ]

    return [
      dateMap[l.blockNumber] ?? 'ERROR',
      Hash256(l.transactionHash),
      implementations,
    ]
  })
}

export async function getEverclearProxy(
  provider: IProvider,
  address: EthereumAddress,
): Promise<ProxyDetails | undefined> {
  const mainImplementation = await getImplementation(provider, address)
  const moduleImplementations = await Promise.all(
    modules.map((module) => getModule(provider, address, module)),
  )

  const admin = await provider.callMethod<EthereumAddress>(
    address,
    'function owner() view returns (address)',
    [],
  )

  const implementationsMap = Object.fromEntries(
    zip(modules, moduleImplementations),
  )
  const pastUpgrades = await getPastUpgrades(
    provider,
    address,
    implementationsMap,
  )

  const implementations = [mainImplementation, ...moduleImplementations]
  return {
    type: 'Everclear proxy',
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
