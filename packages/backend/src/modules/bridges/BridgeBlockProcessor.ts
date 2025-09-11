import type { Logger } from '@l2beat/backend-tools'
import { type Block, EthereumAddress, type Log } from '@l2beat/shared-pure'
import type { Log as ViemLog } from 'viem'
import type { BlockProcessor } from '../types'
import type { BridgeStore } from './BridgeStore'
import type {
  BridgeEventContext,
  BridgePlugin,
  LogToCapture,
} from './plugins/types'

export class BridgeBlockProcessor implements BlockProcessor {
  constructor(
    public chain: string,
    private plugins: BridgePlugin[],
    private bridgeStore: BridgeStore,
    private logger: Logger,
  ) {
    this.logger = logger.for(this)
  }

  async processBlock(block: Block, logs: Log[]): Promise<void> {
    const toDecode = getLogsToDecode(this.chain, block, logs)
    let count = 0
    for (const logToDecode of toDecode) {
      for (const plugin of this.plugins) {
        try {
          const event = await plugin.capture?.(logToDecode)
          if (event) {
            count++
            this.bridgeStore.addEvent(event)
          }
        } catch (e) {
          this.logger.error(e)
        }
      }
    }
    await this.bridgeStore.save()
    this.logger.info('Block processed', {
      chain: this.chain,
      blockNumber: block.number,
      events: count,
    })
  }
}

function getLogsToDecode(chain: string, block: Block, logs: Log[]) {
  const toDecode: LogToCapture[] = []
  const viemLogs = logs.map(logToViemLog)

  const contexts = block.transactions
    .filter((x) => !!x.hash) // TODO: why can this be missing!?
    .map(
      (tx): Omit<BridgeEventContext, 'logIndex'> => ({
        timestamp: block.timestamp,
        chain,
        blockHash: block.hash,
        blockNumber: block.number,
        // biome-ignore lint/style/noNonNullAssertion: We just checked
        txHash: tx.hash!,
        txTo: tx.to !== undefined ? EthereumAddress(tx.to) : undefined,
      }),
    )

  for (const log of viemLogs) {
    const tx = contexts.find((x) => x.txHash === log.transactionHash)
    if (!tx) {
      continue
    }
    const ctx: BridgeEventContext = { ...tx, logIndex: log.logIndex ?? -1 }
    toDecode.push({
      log,
      ctx,
      txLogs: viemLogs.filter((x) => x.transactionHash === log.transactionHash),
    })
  }

  return toDecode
}

export function logToViemLog(log: Log): ViemLog {
  return {
    blockNumber: BigInt(log.blockNumber),
    transactionHash: log.transactionHash as `0x${string}`,
    address: log.address as `0x${string}`,
    topics: log.topics as [`0x${string}`, ...`0x${string}`[]] | [],
    data: log.data as `0x${string}`,
    logIndex: log.logIndex,

    // Unsupported values for now
    blockHash: 'UNSUPPORTED' as `0x${string}`,
    transactionIndex: -1,
    removed: false,
  }
}
