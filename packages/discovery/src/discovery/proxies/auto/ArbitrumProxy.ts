import {
  assert,
  Bytes,
  ChainSpecificAddress,
  EthereumAddress,
  Hash256,
  UnixTime,
} from '@l2beat/shared-pure'
import { type providers, utils } from 'ethers'
import type { ContractValue } from '../../output/types'
import type { IProvider } from '../../provider/IProvider'
import type { DateAddresses } from '../pastUpgrades'
import type { ProxyDetails } from '../types'
import { getAdmin, getImplementation } from './Eip1967Proxy'

// keccak256('eip1967.proxy.implementation.secondary') - 1)
const SECONDARY_IMPLEMENTATION_SLOT = Bytes.fromHex(
  '0x2b1dbce74324248c222f0ec2d5ed7bd323cfc425b336f0253c5ccfda7265546d',
)

function mergeLogs(
  chain: string,
  abi: utils.Interface,
  dateMap: Record<string, string>,
  lhsUnsorted: providers.Log[],
  rhsUnsorted: providers.Log[],
): DateAddresses[] {
  const lhs = lhsUnsorted.sort((a, b) => a.blockNumber - b.blockNumber)
  const rhs = rhsUnsorted.sort((a, b) => a.blockNumber - b.blockNumber)

  let lhi = 0
  let rhi = 0
  let lastLeftImpl: ChainSpecificAddress | undefined
  let lastRightImpl: ChainSpecificAddress | undefined

  const result: DateAddresses[] = []
  while (lhi < lhs.length && rhi < rhs.length) {
    // biome-ignore lint/style/noNonNullAssertion: we know it's there
    const leftLog = lhs[lhi]!
    // biome-ignore lint/style/noNonNullAssertion: we know it's there
    const rightLog = rhs[rhi]!

    lastLeftImpl = ChainSpecificAddress.fromLong(
      chain,
      abi.parseLog(leftLog).args.implementation ?? EthereumAddress.ZERO,
    )
    lastRightImpl = ChainSpecificAddress.fromLong(
      chain,
      abi.parseLog(rightLog).args.implementation ?? EthereumAddress.ZERO,
    )

    if (leftLog.blockNumber === rightLog.blockNumber) {
      lhi += 1
      rhi += 1
      result.push([
        dateMap[leftLog.blockNumber] ?? 'ERROR',
        Hash256(leftLog.transactionHash),
        [lastLeftImpl, lastRightImpl],
      ])
    } else if (leftLog.blockNumber < rightLog.blockNumber) {
      lhi += 1
      result.push([
        dateMap[leftLog.blockNumber] ?? 'ERROR',
        Hash256(leftLog.transactionHash),
        [lastLeftImpl, lastRightImpl],
      ])
    } else {
      rhi += 1
      result.push([
        dateMap[rightLog.blockNumber] ?? 'ERROR',
        Hash256(rightLog.transactionHash),
        [lastLeftImpl, lastRightImpl],
      ])
    }
  }

  while (lhi < lhs.length) {
    // biome-ignore lint/style/noNonNullAssertion: we know it's there
    const leftLog = lhs[lhi]!
    lhi += 1
    lastLeftImpl = ChainSpecificAddress.fromLong(
      chain,
      abi.parseLog(leftLog).args.implementation ?? EthereumAddress.ZERO,
    )
    result.push([
      dateMap[leftLog.blockNumber] ?? 'ERROR',
      Hash256(leftLog.transactionHash),
      [lastLeftImpl, lastRightImpl ?? ChainSpecificAddress.ZERO(chain)],
    ])
  }

  while (rhi < rhs.length) {
    // biome-ignore lint/style/noNonNullAssertion: we know it's there
    const rightLog = rhs[rhi]!
    rhi += 1
    lastRightImpl = ChainSpecificAddress.fromLong(
      chain,
      abi.parseLog(rightLog).args.implementation ?? EthereumAddress.ZERO,
    )
    result.push([
      dateMap[rightLog.blockNumber] ?? 'ERROR',
      Hash256(rightLog.transactionHash),
      [lastLeftImpl ?? ChainSpecificAddress.ZERO(chain), lastRightImpl],
    ])
  }

  return result
}

async function getPastUpgrades(
  provider: IProvider,
  address: ChainSpecificAddress,
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
    blocks.map((b) => [b.number, UnixTime.toDate(b.timestamp).toISOString()]),
  )

  return mergeLogs(provider.chain, abi, dateMap, primaryLogs, secondaryLogs)
}

export async function detectArbitrumProxy(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<ProxyDetails | undefined> {
  const userImplementation = await provider.getStorageAsAddress(
    address,
    SECONDARY_IMPLEMENTATION_SLOT,
  )
  if (userImplementation === ChainSpecificAddress.ZERO(provider.chain)) {
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
