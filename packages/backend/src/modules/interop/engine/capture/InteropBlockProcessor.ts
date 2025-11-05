import type { Logger } from '@l2beat/backend-tools'
import type { Block, Log } from '@l2beat/shared-pure'
import type { Log as ViemLog } from 'viem'
import type { BlockProcessor } from '../../../types'
import {
  Address32,
  type InteropEvent,
  type InteropEventContext,
  type InteropPlugin,
  type LogToCapture,
  type TxToCapture,
} from '../../plugins/types'
import type { InteropEventStore } from './InteropEventStore'

export class InteropBlockProcessor implements BlockProcessor {
  lastProcessed: Block | undefined

  constructor(
    public chain: string,
    private plugins: InteropPlugin[],
    private store: InteropEventStore,
    private logger: Logger,
  ) {
    this.logger = logger.for(this).tag({ chain, tag: chain })
  }

  async processBlock(block: Block, logs: Log[]): Promise<void> {
    const toCapture = getItemsToCapture(this.chain, block, logs)

    const events: InteropEvent[] = []
    const pluginEventCounts: Record<string, number> = {}

    for (const txToCapture of toCapture.txsToCapture) {
      for (const plugin of this.plugins) {
        try {
          const captured = plugin.captureTx?.(txToCapture)
          if (captured) {
            events.push(...captured.map((c) => ({ ...c, plugin: plugin.name })))
            pluginEventCounts[plugin.name] =
              (pluginEventCounts[plugin.name] || 0) + captured.length
            break
          }
        } catch (e) {
          this.logger.error('Capture failed', e, {
            plugin: plugin.name,
            blockNumber: block.number,
            tx: txToCapture.tx.txHash,
          })
        }
      }
    }

    for (const logToDecode of toCapture.logsToCapture) {
      for (const plugin of this.plugins) {
        try {
          const captured = plugin.capture?.(logToDecode)
          if (captured) {
            events.push(...captured.map((c) => ({ ...c, plugin: plugin.name })))
            pluginEventCounts[plugin.name] =
              (pluginEventCounts[plugin.name] || 0) + captured.length
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
      txs: toCapture.txsToCapture.length,
      logs: toCapture.logsToCapture.length,
      events: events.length,
    })
  }
}

function getItemsToCapture(chain: string, block: Block, logs: Log[]) {
  const logsToCapture: LogToCapture[] = []
  const txsToCapture: TxToCapture[] = []
  const viemLogs = logs.map(logToViemLog)

  const txs = block.transactions
    .filter((x) => !!x.hash) // TODO: why can this be missing!?
    .map(
      (tx): InteropEventContext => ({
        timestamp: block.timestamp,
        chain,
        blockHash: block.hash,
        blockNumber: block.number,
        // biome-ignore lint/style/noNonNullAssertion: We know tx is not pending
        txHash: tx.hash!,
        // biome-ignore lint/style/noNonNullAssertion: EVM tx should have it
        txValue: tx.value!,
        txTo: tx.to !== undefined ? Address32.from(tx.to) : undefined,
        txFrom: tx.from !== undefined ? Address32.from(tx.from) : undefined,
        // biome-ignore lint/style/noNonNullAssertion: EVM tx should have it
        txData: tx.data! as string,
        logIndex: -1,
      }),
    )

  for (const tx of txs) {
    const txLogs = viemLogs.filter((log) => log.transactionHash === tx.txHash)
    for (const log of txLogs) {
      logsToCapture.push({ log, ctx: tx, txLogs })
    }
    txsToCapture.push({ tx, txLogs })
  }

  return { txsToCapture, logsToCapture }
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
