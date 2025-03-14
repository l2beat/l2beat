import { RateLimiter, getEnv } from '@l2beat/backend-tools'
import { createDatabase } from '@l2beat/database'
import {
  BlockIndexerClient,
  HttpClient,
  type TrackedTxFunctionCallConfig,
} from '@l2beat/shared'
import {
  assert,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { ethers } from 'ethers'
import { z } from 'zod'
import { makeConfig } from '../../src/config/makeConfig'

const DISPUTE_GAME_METHODS = ['0x2810e1d6', '0x03c2924d']

type EtherscanTxs = z.infer<typeof EtherscanTxs>
const EtherscanTxs = z
  .object({
    isError: z.string(),
    gasPrice: z.string(),
    gasUsed: z.string(),
    methodId: z.string(),
  })
  .array()

const env = getEnv()
const db = createDatabase({
  connectionString: env.string(['LOCAL_DB_URL']),
  application_name: 'BE-PROD',
  ssl: { rejectUnauthorized: false },
  min: 20,
  max: 200,
})

const provider = new ethers.providers.JsonRpcProvider(
  env.string(['ETHEREUM_RPC_URL']),
)
const blockTargetClient = new BlockIndexerClient(
  new HttpClient(),
  new RateLimiter({ callsPerMinute: 200 }),
  {
    chain: 'mainnet',
    type: 'etherscan',
    url: 'https://api.etherscan.io/api',
    apiKey: env.string(['ETHEREUM_ETHERSCAN_API_KEY']),
  },
)

const PROJECT_ID = ProjectId('base')

async function main() {
  const to = UnixTime.toStartOf(UnixTime.now(), 'day')
  const from = to - UnixTime.DAY * 33 - UnixTime.HOUR * 12

  const config = await makeConfig(env, {
    name: 'Backend/Local',
    isLocal: true,
  })

  assert(config.trackedTxsConfig)

  const projectTrackedTxsConfig = config.trackedTxsConfig.projects.find(
    (p) => p.id === PROJECT_ID,
  )
  assert(projectTrackedTxsConfig)

  const createConfig = projectTrackedTxsConfig?.configurations.find(
    (c) =>
      c.type === 'l2costs' &&
      c.params.formula === 'functionCall' &&
      c.params.selector === '0x82ecf2f6',
  )?.params as TrackedTxFunctionCallConfig

  const [fromBlock, toBlock] = await Promise.all([
    blockTargetClient.getBlockNumberAtOrBefore(from),
    blockTargetClient.getBlockNumberAtOrBefore(to),
  ])

  const logs = await provider.getLogs({
    address: createConfig?.address,
    topics: [
      '0x5b565efe82411da98814f356d0e7bcb8f0219b8d970307c5afb4a6903a8b2e35',
    ],
    fromBlock,
    toBlock,
  })

  const createdDisputeGames = logs.map((l) =>
    EthereumAddress.from('0x' + l.topics[1].slice(-40)),
  )
  const disputeGameTxs = await Promise.all(
    createdDisputeGames.map(async (game) => {
      try {
        return (await blockTargetClient.call('account', 'txlist', {
          address: game.toString(),
          startblock: fromBlock.toString(),
          endblock: toBlock.toString(),
        })) as EtherscanTxs
      } catch {
        return []
      }
    }),
  )

  const validTxs = EtherscanTxs.parse(disputeGameTxs.flat()).filter(
    (tx) => DISPUTE_GAME_METHODS.includes(tx.methodId) && tx.isError === '0',
  )
  const totalDisputeGameCost = validTxs.reduce((acc, tx) => {
    const gasPrice = weiToEth(BigInt(tx.gasPrice))
    const gasUsed = Number(tx.gasUsed)
    return acc + gasPrice * gasUsed
  }, 0)

  const records = await db.aggregatedL2Cost.getByProjectAndTimeRange(
    PROJECT_ID,
    [to - UnixTime.DAY * 30, to],
  )
  const totalCost = records.reduce((acc, r) => acc + r.totalGasEth, 0)

  const stateUpdatesConfigurations =
    projectTrackedTxsConfig?.configurations.filter(
      (c) => c.subtype === 'stateUpdates' && c.type === 'l2costs',
    )

  const stateUpdatesCost = await db.l2Cost.getGasSumByTimeRangeAndConfigId(
    stateUpdatesConfigurations?.map((c) => c.id) ?? [],
    to - UnixTime.DAY * 30,
    to,
  )

  console.log('Total costs from Dispute Game:', totalDisputeGameCost, 'ETH')
  console.log('Total costs without Dispute Game:', totalCost, 'ETH')
  console.log(
    'Total costs with Dispute Game:',
    totalCost + totalDisputeGameCost,
    'ETH',
  )
  console.log('Difference %:', (totalDisputeGameCost / totalCost) * 100, '%')
  console.log(
    'State updates total cost:',
    weiToEth(stateUpdatesCost.reduce((acc, r) => acc + r.totalCostInWei, 0n)),
    'ETH',
  )

  await db.close()
}

main().catch(console.error)

function weiToEth(wei: bigint): number {
  // Biggest wei we can get from DB is 2^63-1 which divided by 1e9 is safe to parse to Number
  const integerPartGwei = Number(wei / 1_000_000_000n)
  const fractionPartGwei = Number(wei % 1_000_000_000n)
  const gwei = integerPartGwei + fractionPartGwei / 1_000_000_000

  return gwei / 1_000_000_000
}
