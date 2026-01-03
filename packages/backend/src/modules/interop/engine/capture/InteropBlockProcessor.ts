import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { Block, Log } from '@l2beat/shared-pure'
import type { BlockProcessor } from '../../../types'
import type {
  InteropEvent,
  InteropPlugin,
  InteropPluginResyncable,
} from '../../plugins/types'
import type { InteropSyncModes } from '../sync/InteropPluginSyncModes'
import { isPluginResyncable } from '../sync/isPluginResyncable'
import { getItemsToCapture } from './getItemsToCapture'
import type { InteropEventStore } from './InteropEventStore'

export class InteropBlockProcessor implements BlockProcessor {
  lastProcessed: Block | undefined

  constructor(
    public chain: string,
    private plugins: InteropPlugin[],
    private store: InteropEventStore,
    private syncModes: InteropSyncModes,
    private db: Database,
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
            tx: txToCapture.tx.hash,
          })
        }
      }
    }

    const pluginsForStatusUpdate = new Set<string>()

    for (const logToDecode of toCapture.logsToCapture) {
      for (const plugin of this.plugins) {
        try {
          if (isPluginResyncable(plugin)) {
            const canUpdate = await this.canUpdatePlugin(
              plugin,
              BigInt(block.number),
            )
            if (!canUpdate) {
              continue
            }
            pluginsForStatusUpdate.add(plugin.name)
          }

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

    await this.db.transaction(async () => {
      await this.store.saveNewEvents(events)
      for (const pluginName of pluginsForStatusUpdate) {
        await this.db.interopPluginSyncedRange.updateByPluginNameAndChain(
          pluginName,
          this.chain,
          {
            toBlock: BigInt(block.number),
            toTimestamp: block.timestamp,
            lastError: null,
          },
        )
      }
    })
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

  async canUpdatePlugin(
    plugin: InteropPluginResyncable,
    blockNumber: bigint,
  ): Promise<boolean> {
    if (
      this.syncModes.getForPlugin(plugin.name).getForChain(this.chain) !==
      'follow'
    ) {
      // This plugin is not in 'follow' mode
      return false
    }

    const lastSynced =
      await this.db.interopPluginSyncedRange.findByPluginNameAndChain(
        plugin.name,
        this.chain,
      )

    const syncedToBlock = lastSynced?.toBlock
    if (syncedToBlock === undefined || syncedToBlock < blockNumber - 1n) {
      // ask to catch up
      this.syncModes
        .getForPlugin(plugin.name)
        .setForChain(this.chain, 'catchUp')
      return false
    }

    if (syncedToBlock >= blockNumber) {
      // skip, we're already synced further than this block
      return false
    }
    return true
  }
}
