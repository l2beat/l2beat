import type { Logger } from '@l2beat/backend-tools'
import type { Block, Log } from '@l2beat/shared-pure'
import type { Log as ViemLog } from 'viem'
import type { BlockProcessor } from '../types'
import type { InteropStore } from './InteropStore'
import {
  Address32,
  type InteropEvent,
  type InteropEventContext,
  type InteropPlugin,
  type LogToCapture,
} from './plugins/types'

export class InteropBlockProcessor implements BlockProcessor {
  lastProcessed: Block | undefined

  constructor(
    public chain: string,
    private plugins: InteropPlugin[],
    private store: InteropStore,
    private logger: Logger,
  ) {
    this.logger = logger.for(this).tag({ chain, tag: chain })
  }

  async processBlock(block: Block, logs: Log[]): Promise<void> {
    const toDecode = getLogsToDecode(this.chain, block, logs)

    const events: InteropEvent[] = []
    const pluginEventCounts: Record<string, number> = {}

    for (const logToDecode of toDecode) {
      for (const plugin of this.plugins) {
        try {
          const networks = plugin.configName
            ? this.store.findConfig(plugin.configName)
            : undefined
          const event = await plugin.capture?.(logToDecode, networks)
          if (event) {
            events.push({ ...event, plugin: plugin.name })
            pluginEventCounts[plugin.name] =
              (pluginEventCounts[plugin.name] || 0) + 1
            break
          }
        } catch (e) {
          this.logger.error('Capture failed', e, {
            plugin: plugin.name,
            blockNumber: block.number,
            tx: logToDecode.ctx.txHash,
            logIndex: logToDecode.ctx.logIndex,
            topic: logToDecode.log.topics[0],
          })
        }
      }
    }

    await this.store.saveNewEvents(events)
    this.lastProcessed = block

    for (const [plugin, count] of Object.entries(pluginEventCounts)) {
      this.logger.info('Events captured', {
        plugin,
        blockNumber: block.number,
        events: count,
      })
    }

    this.logger.info('Block processed', {
      chain: this.chain,
      blockNumber: block.number,
      logs: toDecode.length,
      events: events.length,
    })
  }
}

function getLogsToDecode(chain: string, block: Block, logs: Log[]) {
  const toDecode: LogToCapture[] = []
  const viemLogs = logs.map(logToViemLog)

  const contexts = block.transactions
    .filter((x) => !!x.hash) // TODO: why can this be missing!?
    .map(
      (tx): Omit<InteropEventContext, 'logIndex'> => ({
        timestamp: block.timestamp,
        chain,
        blockHash: block.hash,
        blockNumber: block.number,
        // biome-ignore lint/style/noNonNullAssertion: We know tx is not pending
        txHash: tx.hash!,
        // biome-ignore lint/style/noNonNullAssertion: EVM tx should have it
        value: tx.value!,
        txTo: tx.to !== undefined ? Address32.from(tx.to) : undefined,
      }),
    )

  for (const log of viemLogs) {
    const tx = contexts.find((x) => x.txHash === log.transactionHash)
    if (!tx) {
      continue
    }
    const ctx: InteropEventContext = { ...tx, logIndex: log.logIndex ?? -1 }
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
