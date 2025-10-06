import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { BridgeComparePlugin, BridgeExternalItem } from './compare/types'

export class BridgeComparator {
  private running = false
  private items: {
    plugin: string
    type: BridgeComparePlugin['type']
    item: BridgeExternalItem & { isLatest: boolean }
  }[] = []

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
    this.logger.info('Compare scheduled', {
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
      await this.compare()
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
          const pluginItems = (await plugin.getExternalItems()).map((i) => ({
            plugin: plugin.name,
            type: plugin.type,
            item: { ...i, isLatest: true },
          }))

          this.items.push(...pluginItems)
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
      plugins: Array.from(new Set(this.items.map((i) => i.plugin)).keys()),
      items: this.items.length,
    })

    const messages = await this.db.bridgeMessage.getExistingItems(
      this.items
        .filter((i) => i.type === 'message')
        .map((i) => ({ ...i.item })),
    )

    const transfers = await this.db.bridgeTransfer.getExistingItems(
      this.items
        .filter((i) => i.type === 'transfer')
        .map((i) => ({ ...i.item })),
    )

    const existing = new Set([
      ...messages.map((m) => key(m)),
      ...transfers.map((t) => key(t)),
    ])

    const skipped = []
    let missing = 0

    for (const { plugin, type, item } of this.items) {
      if (!existing.has(key(item))) {
        if (item.isLatest) {
          skipped.push({ plugin, type, item })
          this.logger.warn('Missing item skipped', { plugin, item })
          continue
        }
        missing++
        this.logger.warn('Missing item detected', { plugin, item })
      }
    }

    this.logger.info('Compare finished', {
      items: this.items.length,
      existing: existing.size,
      missing,
      skipped: skipped.length,
    })

    this.items = skipped.map((s) => ({
      ...s,
      isLatest: false,
    }))
  }
}

function key(x: { srcTxHash?: string; dstTxHash?: string }) {
  return `${x.srcTxHash?.toLowerCase()}-${x.dstTxHash?.toLowerCase()}`
}
