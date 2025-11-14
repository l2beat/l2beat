import { getEnv, Logger } from '@l2beat/backend-tools'
import { createDatabase, type InteropEventRecord } from '@l2beat/database'
import { type EVMLog, HttpClient, RpcClient } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import { encodeEventTopics, parseAbi } from 'viem'
import { logToViemLog } from './engine/capture/InteropBlockProcessor'
import { OpStackPlugin } from './plugins/opstack/opstack'
import { OpStackStandardBridgePlugin } from './plugins/opstack/opstack-standardbridge'
import { OrbitStackPlugin } from './plugins/orbitstack/orbitstack'
import { OrbitStackCustomGatewayPlugin } from './plugins/orbitstack/orbitstack-customgateway'
import { OrbitStackStandardGatewayPlugin } from './plugins/orbitstack/orbitstack-standardgateway'
import { OrbitStackWethGatewayPlugin } from './plugins/orbitstack/orbitstack-wethgateway'
import {
  Address32,
  type InteropEvent,
  type InteropPlugin,
} from './plugins/types'

const ABI = parseAbi([
  // orbit
  'event L2ToL1Tx(address caller, address indexed destination, uint256 indexed hash, uint256 indexed position, uint256 arbBlockNum, uint256 ethBlockNum, uint256 timestamp, uint256 callvalue, bytes data)',
  'event OutBoxTransactionExecuted(address indexed to, address indexed l2Sender, uint256 indexed zero, uint256 transactionIndex)',
  'event MessageDelivered(uint256 indexed messageIndex, bytes32 indexed beforeInboxAcc, address inbox, uint8 kind, address sender, bytes32 messageDataHash, uint256 baseFeeL1, uint64 timestamp)',
  'event RedeemScheduled(bytes32 indexed ticketId, bytes32 indexed retryTxHash, uint64 indexed sequenceNum, uint64 donatedGas, address gasDonor, uint256 maxRefund, uint256 submissionFeeRefund)',
  // orbit custom
  'event DepositInitiated(address _l1Token, address indexed _from, address indexed _to, uint256 indexed _sequenceNumber, uint256 _amount)',
  'event DepositFinalized(address indexed l1Token, address indexed from, address indexed to, uint256 amount)',
  'event WithdrawalInitiated(address l1Token, address indexed _from, address indexed _to, uint256 indexed _l2ToL1Id, uint256 _exitNum, uint256 _amount)',
  'event WithdrawalFinalized(address l1Token, address indexed _from, address indexed _to, uint256 indexed _exitNum, uint256 _amount)',
  // orbit standard
  'event DepositInitiated(address _l1Token, address indexed _from, address indexed _to, uint256 indexed _sequenceNumber, uint256 _amount)',
  'event DepositFinalized(address indexed l1Token, address indexed from, address indexed to, uint256 amount)',
  //orbit weth
  'event DepositInitiated(address _l1Token, address indexed _from, address indexed _to, uint256 indexed _sequenceNumber, uint256 _amount)',
  'event DepositFinalized(address indexed l1Token, address indexed from, address indexed to, uint256 amount)',
  // opstack
  'event MessagePassed(uint256 indexed nonce, address indexed sender, address indexed target, uint256 value, uint256 gasLimit, bytes data, bytes32 withdrawalHash)',
  'event WithdrawalFinalized(bytes32 indexed withdrawalHash, bool success)',
  'event RelayedMessage(bytes32 indexed msgHash)',
  'event SentMessage(address indexed target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit)',
  'event SentMessageExtension1(address indexed sender, uint256 value)',
  // opstack standard
  'event ERC20BridgeInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)',
  'event ERC20BridgeFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)',
  'event ERC20DepositInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)',
  'event DepositFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)',
  'event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)',
  'event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)',
])

async function main() {
  const env = getEnv()

  const db = createDatabase({
    connectionString:
      'postgresql://postgres:password@localhost:5432/l2beat_local',
    application_name: 'EVENT-SCRIPT',
    min: 2,
    max: 10,
    keepAlive: false,
  })

  const chains = [
    { name: 'ethereum', start: 23682910, end: 23783007 + 100 },
    { name: 'base', start: 37474926, end: 38079726 + 100 },
    { name: 'optimism', start: 143070211, end: 143675011 + 100 },
    { name: 'arbitrum', start: 394622926, end: 399467965 + 100 },
  ]

  for (const chain of chains) {
    const rpc = new RpcClient({
      http: new HttpClient(),
      logger: Logger.INFO,
      retryStrategy: 'RELIABLE',
      url: env.string(`${chain.name.toUpperCase()}_RPC_URL`),
      chain: chain.name,
      callsPerMinute: env.integer(
        `${chain.name.toUpperCase()}_RPC_CALLS_PER_MINUTE`,
      ),
    })

    const uniqueBlocks = new Set<number>()

    await Promise.all(
      ABI.map(async (a) => {
        const topic = encodeEventTopics({ abi: [a] })

        const logs = await getAllLogs(rpc, [topic[0]], chain.start, chain.end)

        console.log('Fetched', chain.name, a.name, logs.length)

        for (const l of logs) {
          uniqueBlocks.add(l.blockNumber)
        }
      }),
    )

    const blocks = Array.from(uniqueBlocks.values()).sort((a, b) => a - b)

    const plugins: InteropPlugin[] = [
      new OrbitStackWethGatewayPlugin(), // should be run before OrbitStackStandardGateway and OrbitStack
      new OrbitStackStandardGatewayPlugin(), // should be run before OrbitStack
      new OrbitStackCustomGatewayPlugin(), // should be run before OrbitStack
      new OrbitStackPlugin(),
      new OpStackStandardBridgePlugin(), // should be run before OpStack
      new OpStackPlugin(),
    ]

    const events: InteropEvent[] = []

    const BATCH_SIZE = 100

    for (let i = 0; i < blocks.length; i += BATCH_SIZE) {
      const batch = blocks.slice(i, i + BATCH_SIZE)

      console.log(
        'Capturing',
        chain.name,
        `batch ${i / BATCH_SIZE + 1} of ${Math.ceil(blocks.length / BATCH_SIZE)}`,
      )

      await Promise.all(
        batch.map(async (b) => {
          const block = await rpc.getBlockWithTransactions(b)
          const logs = await rpc.getLogs(b, b)

          for (const tx of block.transactions) {
            assert(tx.hash)
            const txLogs = logs
              .filter((l) => l.transactionHash === tx.hash)
              .map(logToViemLog)

            const ctx = {
              timestamp: block.timestamp,
              chain: chain.name,
              blockNumber: block.number,
              blockHash: block.hash,
              txHash: tx.hash,
              txValue: tx.value,
              txTo: tx.to ? Address32.from(tx.to) : undefined,
              txFrom: tx.from ? Address32.from(tx.from) : undefined,
              txData: (tx.data ?? '') as string,
              logIndex: -1,
            }

            for (const log of txLogs) {
              for (const plugin of plugins) {
                if (!plugin.capture) {
                  continue
                }
                const captured = plugin.capture({
                  log: log,
                  txLogs: txLogs,
                  ctx: { ...ctx, logIndex: log.logIndex ?? -1 },
                })
                if (captured) {
                  console.log(
                    'Captured',
                    plugin.name,
                    'events: ',
                    captured.length,
                  )

                  events.push(
                    ...captured.map((c) => ({ ...c, plugin: plugin.name })),
                  )
                  break
                }
              }
            }
          }
        }),
      )
    }
    console.log('saving events', chain.name)
    await db.interopEvent.insertMany(events.map(toDbRecord))
  }
}

main().catch((e: unknown) => {
  console.error(e)
})

async function getAllLogs(
  rpc: RpcClient,
  topics: string[],
  from: number,
  to: number,
): Promise<EVMLog[]> {
  if (from === to) {
    return await rpc.getLogs(from, to, undefined, topics)
  }
  try {
    return await rpc.getLogs(from, to, undefined, topics)
  } catch (e) {
    if (
      e instanceof Error &&
      (e.message.includes('Log response size exceeded') ||
        e.message.includes('query exceeds max block range 100000') ||
        e.message.includes('eth_getLogs is limited to a 10,000 range') ||
        e.message.includes('returned more than 10000'))
    ) {
      const midPoint = from + Math.floor((to - from) / 2)
      const [a, b] = await Promise.all([
        getAllLogs(rpc, topics, from, midPoint),
        getAllLogs(rpc, topics, midPoint + 1, to),
      ])
      return a.concat(b)
    }
    throw e
  }
}

function toDbRecord(event: InteropEvent): InteropEventRecord {
  return {
    plugin: event.plugin,
    eventId: event.eventId,
    type: event.type,
    expiresAt: event.expiresAt,
    args: event.args,
    chain: event.ctx.chain,
    blockHash: event.ctx.blockHash,
    blockNumber: event.ctx.blockNumber,
    logIndex: event.ctx.logIndex,
    timestamp: event.ctx.timestamp,
    txHash: event.ctx.txHash,
    value: event.ctx.txValue,
    txTo: event.ctx.txTo,
    calldata: event.ctx.txData,
    matched: false,
    unsupported: false,
  }
}
