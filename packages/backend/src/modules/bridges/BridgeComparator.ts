import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { BridgeComparePlugin, BridgeExternalItem } from './compare/types'

export class BridgeComparator {
  private running = false
  private pluginData: Record<
    string,
    {
      items: (BridgeExternalItem & { isLatest: boolean })[]
      type: BridgeComparePlugin['type']
    }
  > = {}

  constructor(
    private db: Database,
    private plugins: BridgeComparePlugin[],
    private logger: Logger,
    private intervalMs = 10 * 60_000,
  ) {
    this.logger = logger.for(this)
  }

  start() {
    setInterval(this.runCompare, this.intervalMs)
    this.logger.info('Compare schedulded', {
      intervalMs: this.intervalMs,
    })
    this.runCompare()
    this.logger.info('Started')
  }

  async runCompare() {
    if (this.running) {
      return
    }
    this.running = true
    try {
      await this.fetchExternalItems()
      const missing = await this.compare()
      this.running = false
      return missing
    } catch (e) {
      this.logger.error(e)
    }
    this.running = false
  }

  async fetchExternalItems() {
    this.logger.info('Fetching items from external explorers...', {
      plugins: this.plugins.map((p) => p.name),
    })

    await Promise.all(
      this.plugins.map(async (plugin) => {
        try {
          const items = (await plugin.getExternalItems()).map((i) => ({
            ...i,
            isLatest: true,
          }))

          if (!this.pluginData[plugin.name]) {
            this.pluginData[plugin.name] = {
              type: plugin.type,
              items: items,
            }
          } else {
            this.pluginData[plugin.name].items.push(...items)
          }
        } catch (error) {
          this.logger.warn(
            `Fetching items for plugin ${plugin.name} failed`,
            error,
          )
        }
      }),
    )
  }

  async compare() {
    this.logger.info('Comparing...', {
      plugins: Array.from(Object.keys(this.pluginData)),
    })

    const missingItems = []

    for (const [plugin, { items, type }] of Object.entries(this.pluginData)) {
      if (items.length === 0) continue

      const records =
        type === 'message'
          ? await this.db.bridgeMessage.getExistingItems(items)
          : await this.db.bridgeTransfer.getExistingItems(items)

      const skipped = []
      let missing = 0

      for (const item of items) {
        const record = records.find(
          (r) =>
            r.srcTxHash?.toLowerCase() === item.srcTxHash.toLowerCase() &&
            r.dstTxHash?.toLowerCase() === item.dstTxHash.toLowerCase(),
        )

        if (!record) {
          if (item.isLatest) {
            skipped.push(item)
            continue
          }
          missing++
          missingItems.push({ plugin, item })
          this.logger.warn('Missing item detected', {
            plugin: plugin,
            item: item,
          })
        }
      }

      this.pluginData[plugin].items = skipped.map((s) => ({
        ...s,
        isLatest: false,
      }))

      this.logger.info('Plugin compare finished', {
        plugin: plugin,
        items: items.length,
        records: records.length,
        missing,
        skipped: skipped.length,
      })
    }

    this.logger.info('Compare finished')

    // used for testing only
    return missingItems
  }
}
