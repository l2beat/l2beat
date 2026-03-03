import type { Logger } from '@l2beat/backend-tools'
import type { Block, Log } from '@l2beat/shared-pure'
import type { BlockProcessor } from '../../../types'
import {
  type InteropEvent,
  type InteropPlugin,
  isPluginResyncable,
} from '../../plugins/types'
import { getItemsToCapture } from './getItemsToCapture'
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

    const nonResyncablePlugins = this.plugins.filter(
      (p) => !isPluginResyncable(p),
    )

    for (const txToCapture of toCapture.txsToCapture) {
      for (const plugin of nonResyncablePlugins) {
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
            tx: txToCapture.tx.hash,
          })
        }
      }
    }

    for (const logToDecode of toCapture.logsToCapture) {
      for (const plugin of nonResyncablePlugins) {
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
            tx: logToDecode.tx.hash,
            logIndex: logToDecode.log.logIndex,
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
