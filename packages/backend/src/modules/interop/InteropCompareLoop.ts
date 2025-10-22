import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { TimeLoop } from '../../tools/TimeLoop'

export interface InteropComparePlugin {
  name: string
  type: 'message' | 'transfer'
  getExternalItems: () => Promise<InteropExternalItem[]>
}

export interface InteropExternalItem {
  srcTxHash: string
  dstTxHash: string
}

export class InteropCompareLoop extends TimeLoop {
  private items: {
    plugin: string
    type: InteropComparePlugin['type']
    item: InteropExternalItem & { isLatest: boolean }
  }[] = []

  constructor(
    private db: Database,
    private plugins: InteropComparePlugin[],
    protected logger: Logger,
    intervalMs = 20 * 60_000,
  ) {
    super({ intervalMs })
    this.logger = logger.for(this)
  }

  async run() {
    await this.fetchExternalItems()
    await this.compare()
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

    const existing = await this.getExistingItems()

    const skipped = []
    let missing = 0

    for (const { plugin, type, item } of this.items) {
      if (!existing[type].has(key(item))) {
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
      externalItems: this.items.length,
      databaseItems: existing.message.size + existing.transfer.size,
      missing,
      skipped: skipped.length,
    })

    this.items = skipped.map((s) => ({
      ...s,
      item: { ...s.item, isLatest: false },
    }))
  }

  private async getExistingItems() {
    const messages = await this.db.interopMessage.getExistingItems(
      this.items
        .filter((i) => i.type === 'message')
        .map((i) => ({ ...i.item })),
    )

    const transfers = await this.db.interopTransfer.getExistingItems(
      this.items
        .filter((i) => i.type === 'transfer')
        .map((i) => ({ ...i.item })),
    )

    const existing = {
      message: new Set(messages.map((m) => key(m))),
      transfer: new Set(transfers.map((t) => key(t))),
    }
    return existing
  }
}

function key(x: { srcTxHash?: string; dstTxHash?: string }) {
  return `${x.srcTxHash?.toLowerCase()}-${x.dstTxHash?.toLowerCase()}`
}
