import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { TimeLoop } from '../../../../tools/TimeLoop'

export interface InteropComparePlugin {
  name: string
  intervalMs?: number
  getExternalItems: () => Promise<InteropExternalItem[]>
}

export interface InteropExternalItem {
  srcTxHash: string
  dstTxHash: string
}

export class InteropCompareLoop extends TimeLoop {
  private items: (InteropExternalItem & { isLatest: boolean })[] = []

  constructor(
    private db: Database,
    private plugin: InteropComparePlugin,
    protected logger: Logger,
  ) {
    super({ intervalMs: plugin.intervalMs ?? 20 * 60_000 })
    this.logger = logger.for(this).tag({ tag: plugin.name })
  }

  async run() {
    await this.fetchExternalItems()
    await this.compare()
  }

  async fetchExternalItems() {
    this.logger.info('Fetching items from external explorer...', {
      plugin: this.plugin.name,
    })

    try {
      const latestItems = (await this.plugin.getExternalItems()).map((i) => ({
        ...i,
        isLatest: true,
      }))

      this.items.push(...latestItems)
    } catch (error) {
      this.logger.warn(
        `Fetching items for plugin ${this.plugin.name} failed`,
        error,
      )
    }
  }

  async compare() {
    this.logger.info('Comparing...', {
      plugin: this.plugin.name,
      items: this.items.length,
    })

    const existing = await this.getExistingItems()

    const skipped = []
    let missing = 0

    for (const item of this.items) {
      if (!existing.has(key(item))) {
        if (item.isLatest) {
          skipped.push(item)
          this.logger.warn('Missing item skipped', {
            plugin: this.plugin.name,
            item,
          })
          continue
        }
        missing++
        this.logger.warn('Missing item detected', {
          plugin: this.plugin.name,
          item,
        })
      }
    }

    this.logger.info('Compare finished', {
      externalItems: this.items.length,
      databaseItems: existing.size,
      missing,
      skipped: skipped.length,
    })

    this.items = skipped.map((s) => ({ ...s, isLatest: false }))
  }

  private async getExistingItems() {
    const [messages, transfers] = await Promise.all([
      await this.db.interopMessage.getExistingItems(this.items),
      await this.db.interopTransfer.getExistingItems(this.items),
    ])

    return new Set([
      ...messages.map((m) => key(m)),
      ...transfers.map((t) => key(t)),
    ])
  }
}

function key(x: { srcTxHash?: string; dstTxHash?: string }) {
  return `${x.srcTxHash?.toLowerCase()}-${x.dstTxHash?.toLowerCase()}`
}
