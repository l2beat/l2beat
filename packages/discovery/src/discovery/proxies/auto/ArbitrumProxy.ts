import type { ContractValue, ProxyDetails } from '@l2beat/discovery-types'
import {
  assert,
  Bytes,
  EthereumAddress,
  Hash256,
  UnixTime,
} from '@l2beat/shared-pure'

import { type providers, utils } from 'ethers'
import type { IProvider } from '../../provider/IProvider'
import type { DateAddresses } from '../pastUpgrades'
import { getAdmin, getImplementation } from './Eip1967Proxy'

// keccak256('eip1967.proxy.implementation.secondary') - 1)
const SECONDARY_IMPLEMENTATION_SLOT = Bytes.fromHex(
  '0x2b1dbce74324248c222f0ec2d5ed7bd323cfc425b336f0253c5ccfda7265546d',
)

function mergeLogs(
  abi: utils.Interface,
  dateMap: Record<string, string>,
  lhsUnsorted: providers.Log[],
  rhsUnsorted: providers.Log[],
): DateAddresses[] {
  const lhs = lhsUnsorted.sort((a, b) => a.blockNumber - b.blockNumber)
  const rhs = rhsUnsorted.sort((a, b) => a.blockNumber - b.blockNumber)

  let lhi = 0
  let rhi = 0
  let lastLeftImpl: EthereumAddress | undefined
  let lastRightImpl: EthereumAddress | undefined

  const result: DateAddresses[] = []
  while (lhi < lhs.length && rhi < rhs.length) {
    // biome-ignore lint/style/noNonNullAssertion: we know it's there
    const leftLog = lhs[lhi]!
    // biome-ignore lint/style/noNonNullAssertion: we know it's there
    const rightLog = rhs[rhi]!

    lastLeftImpl = abi.parseLog(leftLog).args.implementation
    lastRightImpl = abi.parseLog(rightLog).args.implementation

    if (leftLog.blockNumber === rightLog.blockNumber) {
      lhi += 1
      rhi += 1
      result.push([
        dateMap[leftLog.blockNumber] ?? 'ERROR',
        Hash256(leftLog.transactionHash),
        [
          lastLeftImpl ?? EthereumAddress.ZERO,
          lastRightImpl ?? EthereumAddress.ZERO,
        ],
      ])
    } else if (leftLog.blockNumber < rightLog.blockNumber) {
      lhi += 1
      result.push([
        dateMap[leftLog.blockNumber] ?? 'ERROR',
        Hash256(leftLog.transactionHash),
        [
          lastLeftImpl ?? EthereumAddress.ZERO,
          lastRightImpl ?? EthereumAddress.ZERO,
        ],
      ])
    } else {
      rhi += 1
      result.push([
        dateMap[rightLog.blockNumber] ?? 'ERROR',
        Hash256(rightLog.transactionHash),
        [
          lastLeftImpl ?? EthereumAddress.ZERO,
          lastRightImpl ?? EthereumAddress.ZERO,
        ],
      ])
    }
  }

  while (lhi < lhs.length) {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const leftLog = lhs[lhi]!
    lhi += 1
    lastLeftImpl = abi.parseLog(leftLog).args.implementation
    result.push([
      dateMap[leftLog.blockNumber] ?? 'ERROR',
      Hash256(leftLog.transactionHash),
      [
        lastLeftImpl ?? EthereumAddress.ZERO,
        lastRightImpl ?? EthereumAddress.ZERO,
      ],
    ])
  }

  while (rhi < rhs.length) {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const rightLog = rhs[rhi]!
    rhi += 1
    lastRightImpl = abi.parseLog(rightLog).args.implementation
    result.push([
      dateMap[rightLog.blockNumber] ?? 'ERROR',
      Hash256(rightLog.transactionHash),
      [
        lastLeftImpl ?? EthereumAddress.ZERO,
        lastRightImpl ?? EthereumAddress.ZERO,
      ],
    ])
  }

  return result
}

async function getPastUpgrades(
  provider: IProvider,
  address: EthereumAddress,
): Promise<DateAddresses[]> {
  const abi = new utils.Interface([
    'event Upgraded(address indexed implementation)',
    'event UpgradedSecondary(address indexed implementation)',
  ])

  const primaryLogs = await provider.getLogs(address, [
    [abi.getEventTopic('Upgraded')],
  ])
  const secondaryLogs = await provider.getLogs(address, [
    [abi.getEventTopic('UpgradedSecondary')],
  ])

  const blockNumbers = [
    ...new Set(
      primaryLogs
        .map((l) => l.blockNumber)
        .concat(secondaryLogs.map((l) => l.blockNumber)),
    ),
  ]
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

  return mergeLogs(abi, dateMap, primaryLogs, secondaryLogs)
}

export async function detectArbitrumProxy(
  provider: IProvider,
  address: EthereumAddress,
): Promise<ProxyDetails | undefined> {
  const userImplementation = await provider.getStorageAsAddress(
    address,
    SECONDARY_IMPLEMENTATION_SLOT,
  )
  if (userImplementation === EthereumAddress.ZERO) {
    return
  }
  const [adminImplementation, admin] = await Promise.all([
    getImplementation(provider, address),
    getAdmin(provider, address),
  ])
  const pastUpgrades = await getPastUpgrades(provider, address)
  return {
    type: 'Arbitrum proxy',
    values: {
      $admin: admin.toString(),
      $implementation: [
        adminImplementation.toString(),
        userImplementation.toString(),
      ],
      $pastUpgrades: pastUpgrades as ContractValue,
      $upgradeCount: pastUpgrades.length,
    },
  }
}
