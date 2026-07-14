import { getEnv } from '@l2beat/backend-tools'
import {
  ConfigReader,
  type DiscoveryOutput,
  getDiscoveryPaths,
} from '@l2beat/discovery'
import { providers, utils } from 'ethers'

const DAYS_7 = 7
const DAYS_30 = 30
const SECONDS_PER_DAY = 24 * 60 * 60
const ROUTER_WITHDRAW_SELECTOR = '0xb438689f'
const POOL_WITHDRAWAL_EVENT =
  'event Withdrawal(address to, bytes32 nullifierHash, address indexed relayer, uint256 fee)'
const ROUTER_WITHDRAW_ABI =
  'function withdraw(address _tornado, bytes _proof, bytes32 _root, bytes32 _nullifierHash, address _recipient, address _relayer, uint256 _fee, uint256 _refund) payable'

interface TornadoDiscoveryData {
  poolAddresses: string[]
  registeredRelayers: string[]
  routerAddress: string
  routerSinceBlock: number
}

interface WindowStats {
  activeRegisteredRelayers: Map<string, number>
  activeUnregisteredRelayers: Map<string, number>
  label: string
  registeredRoutedWithdrawals: number
  totalRoutedWithdrawals: number
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})

async function main() {
  const env = getEnv()
  const rpcUrl = env.string('RPC_URL')
  const blockChunkSize = env.integer('BLOCK_CHUNK_SIZE', 5_000)
  const txConcurrency = env.integer('TX_CONCURRENCY', 8)

  const provider = new providers.JsonRpcProvider(rpcUrl)
  const discovery = loadDiscovery()
  const { poolAddresses, registeredRelayers, routerAddress, routerSinceBlock } =
    extractTornadoDiscoveryData(discovery)

  const eventInterface = new utils.Interface([POOL_WITHDRAWAL_EVENT])
  const routerInterface = new utils.Interface([ROUTER_WITHDRAW_ABI])
  const withdrawalTopic = eventInterface.getEventTopic('Withdrawal')
  const registeredRelayersByLowerCase = new Map(
    registeredRelayers.map((address) => [address.toLowerCase(), address]),
  )

  const latestBlock = await provider.getBlock('latest')
  const start30Timestamp = latestBlock.timestamp - DAYS_30 * SECONDS_PER_DAY
  const start7Timestamp = latestBlock.timestamp - DAYS_7 * SECONDS_PER_DAY
  const start30Block = await findFirstBlockAtOrAfter(
    provider,
    routerSinceBlock,
    latestBlock.number,
    start30Timestamp,
  )
  const start7Block = await findFirstBlockAtOrAfter(
    provider,
    start30Block,
    latestBlock.number,
    start7Timestamp,
  )
  const [start30BlockData, start7BlockData] = await Promise.all([
    provider.getBlock(start30Block),
    provider.getBlock(start7Block),
  ])

  const last7Days = createWindowStats('Last 7 days')
  const last30Days = createWindowStats('Last 30 days')
  let totalPoolWithdrawalLogs = 0
  let skippedMismatchedLogs = 0
  let skippedMissingTransactions = 0

  console.log(`Latest Ethereum block: ${latestBlock.number}`)
  console.log(
    `Latest Ethereum block time: ${formatTimestamp(latestBlock.timestamp)}`,
  )
  console.log(`Tornado router: ${routerAddress}`)
  console.log(`Pools scanned: ${poolAddresses.length}`)
  console.log(`Current registered relayers: ${registeredRelayers.length}`)
  console.log(
    `30 day window starts at block ${start30Block} (${formatTimestamp(
      start30BlockData.timestamp,
    )})`,
  )
  console.log(
    `7 day window starts at block ${start7Block} (${formatTimestamp(
      start7BlockData.timestamp,
    )})`,
  )
  console.log('')

  for (
    let fromBlock = start30Block;
    fromBlock <= latestBlock.number;
    fromBlock += blockChunkSize
  ) {
    const toBlock = Math.min(latestBlock.number, fromBlock + blockChunkSize - 1)
    console.log(`Scanning logs in blocks ${fromBlock}-${toBlock}...`)

    const logs = (
      await Promise.all(
        poolAddresses.map((address) =>
          provider.getLogs({
            address,
            fromBlock,
            toBlock,
            topics: [withdrawalTopic],
          }),
        ),
      )
    ).flat()

    totalPoolWithdrawalLogs += logs.length
    const uniqueTxHashes = Array.from(
      new Set(logs.map((log) => log.transactionHash)),
    )
    const transactions = await mapTransactionsByHash(
      provider,
      uniqueTxHashes,
      txConcurrency,
    )

    for (const log of logs) {
      const transaction = transactions.get(log.transactionHash)

      if (!transaction) {
        skippedMissingTransactions++
        continue
      }

      if (
        transaction.to?.toLowerCase() !== routerAddress.toLowerCase() ||
        !transaction.data.startsWith(ROUTER_WITHDRAW_SELECTOR)
      ) {
        continue
      }

      const eventRelayer = utils.getAddress(
        String(eventInterface.parseLog(log).args.relayer),
      )
      const decodedWithdraw = routerInterface.decodeFunctionData(
        'withdraw',
        transaction.data,
      )
      const decodedPoolAddress = utils.getAddress(String(decodedWithdraw[0]))
      const decodedRelayerAddress = utils.getAddress(String(decodedWithdraw[5]))

      if (
        decodedPoolAddress.toLowerCase() !== log.address.toLowerCase() ||
        decodedRelayerAddress.toLowerCase() !== eventRelayer.toLowerCase()
      ) {
        skippedMismatchedLogs++
        continue
      }

      recordWithdrawal(last30Days, eventRelayer, registeredRelayersByLowerCase)

      if (log.blockNumber >= start7Block) {
        recordWithdrawal(last7Days, eventRelayer, registeredRelayersByLowerCase)
      }
    }
  }

  console.log('')
  console.log(
    'Counts below are for successful pool Withdrawal logs whose transaction called the Tornado router withdraw() selector.',
  )
  console.log(
    `Pool Withdrawal logs seen in last 30 days: ${totalPoolWithdrawalLogs}`,
  )

  if (skippedMissingTransactions > 0) {
    console.log(
      `Skipped logs with missing transactions: ${skippedMissingTransactions}`,
    )
  }

  if (skippedMismatchedLogs > 0) {
    console.log(`Skipped calldata/log mismatches: ${skippedMismatchedLogs}`)
  }

  console.log('')
  printWindowStats(last7Days)
  console.log('')
  printWindowStats(last30Days)
}

function loadDiscovery(): DiscoveryOutput {
  const paths = getDiscoveryPaths()
  const configReader = new ConfigReader(paths.discovery)
  return configReader.readDiscovery('tornado-cash')
}

function extractTornadoDiscoveryData(
  discovery: DiscoveryOutput,
): TornadoDiscoveryData {
  const routerEntry = discovery.entries.find(
    (entry) => entry.name === 'TornadoRouter',
  )

  if (
    routerEntry === undefined ||
    typeof routerEntry.address !== 'string' ||
    typeof routerEntry.sinceBlock !== 'number'
  ) {
    throw new Error('Cannot find TornadoRouter entry in discovered.json')
  }

  const registeredRelayersEntry = discovery.entries.find((entry) =>
    isStringArray(entry.values?.registeredRelayers),
  )

  if (registeredRelayersEntry === undefined) {
    throw new Error(
      'Cannot find an entry with values.registeredRelayers in discovered.json',
    )
  }

  const registeredRelayersValue =
    registeredRelayersEntry.values?.registeredRelayers

  if (!isStringArray(registeredRelayersValue)) {
    throw new Error(
      'registeredRelayers exists in discovered.json, but it is not a string array',
    )
  }

  const registeredRelayers = registeredRelayersValue
  const poolAddresses = discovery.entries
    .filter((entry) => entry.address !== routerEntry.address)
    .filter((entry) =>
      discovery.abis?.[entry.address]?.includes(POOL_WITHDRAWAL_EVENT),
    )
    .map((entry) => normalizeAddress(entry.address))

  if (poolAddresses.length === 0) {
    throw new Error(
      'Could not derive Tornado pool addresses from discovered.json',
    )
  }

  return {
    poolAddresses,
    registeredRelayers: registeredRelayers.map(normalizeAddress),
    routerAddress: normalizeAddress(routerEntry.address),
    routerSinceBlock: routerEntry.sinceBlock,
  }
}

async function findFirstBlockAtOrAfter(
  provider: providers.JsonRpcProvider,
  low: number,
  high: number,
  targetTimestamp: number,
): Promise<number> {
  let answer = high

  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    const block = await provider.getBlock(mid)

    if (block.timestamp >= targetTimestamp) {
      answer = mid
      high = mid - 1
    } else {
      low = mid + 1
    }
  }

  return answer
}

async function mapTransactionsByHash(
  provider: providers.JsonRpcProvider,
  hashes: string[],
  concurrency: number,
): Promise<Map<string, providers.TransactionResponse | null>> {
  const results = new Map<string, providers.TransactionResponse | null>()
  const chunkCount = Math.max(1, concurrency)
  const chunks: string[][] = Array.from({ length: chunkCount }, () => [])

  hashes.forEach((hash, index) => {
    chunks[index % chunkCount].push(hash)
  })

  await Promise.all(
    chunks.map(async (chunk) => {
      for (const hash of chunk) {
        results.set(hash, await provider.getTransaction(hash))
      }
    }),
  )

  return results
}

function createWindowStats(label: string): WindowStats {
  return {
    activeRegisteredRelayers: new Map(),
    activeUnregisteredRelayers: new Map(),
    label,
    registeredRoutedWithdrawals: 0,
    totalRoutedWithdrawals: 0,
  }
}

function recordWithdrawal(
  stats: WindowStats,
  relayerAddress: string,
  registeredRelayersByLowerCase: Map<string, string>,
) {
  stats.totalRoutedWithdrawals++

  const key = relayerAddress.toLowerCase()
  const registeredRelayer = registeredRelayersByLowerCase.get(key)

  if (registeredRelayer !== undefined) {
    stats.registeredRoutedWithdrawals++
    stats.activeRegisteredRelayers.set(
      registeredRelayer,
      (stats.activeRegisteredRelayers.get(registeredRelayer) ?? 0) + 1,
    )
    return
  }

  stats.activeUnregisteredRelayers.set(
    relayerAddress,
    (stats.activeUnregisteredRelayers.get(relayerAddress) ?? 0) + 1,
  )
}

function printWindowStats(stats: WindowStats) {
  console.log(stats.label)
  console.log(
    `- Successful routed withdrawals: ${stats.totalRoutedWithdrawals}`,
  )
  console.log(
    `- Successful routed withdrawals by current registered relayers: ${stats.registeredRoutedWithdrawals}`,
  )
  console.log(
    `- Active current registered relayers: ${stats.activeRegisteredRelayers.size}`,
  )

  if (stats.activeRegisteredRelayers.size === 0) {
    console.log('  none')
  } else {
    for (const [address, count] of sortRelayers(
      stats.activeRegisteredRelayers,
    )) {
      console.log(`  ${address}: ${count}`)
    }
  }

  if (stats.activeUnregisteredRelayers.size > 0) {
    console.log(
      `- Routed withdrawals by relayers not in current registeredRelayers: ${sumValues(
        stats.activeUnregisteredRelayers,
      )} across ${stats.activeUnregisteredRelayers.size} addresses`,
    )
  }
}

function sortRelayers(relayers: Map<string, number>): [string, number][] {
  return [...relayers.entries()].sort((a, b) => {
    if (b[1] !== a[1]) {
      return b[1] - a[1]
    }
    return a[0].localeCompare(b[0])
  })
}

function sumValues(map: Map<string, number>): number {
  let sum = 0

  for (const value of map.values()) {
    sum += value
  }

  return sum
}

function normalizeAddress(address: string): string {
  return utils.getAddress(address.replace(/^eth:/, ''))
}

function formatTimestamp(timestamp: number): string {
  return new Date(timestamp * 1_000).toISOString()
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every((element) => typeof element === 'string')
  )
}
