import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { BridgeComparePlugin } from './compare/types'

interface BridgeCompareConfig {
  intervalMs?: number
  timeoutMs?: number
}

export class BridgeComparator {
  private running = false
  private readonly config: Required<BridgeCompareConfig>

  constructor(
    private db: Database,
    private plugins: BridgeComparePlugin[],
    private logger: Logger,
    options: BridgeCompareConfig = {},
  ) {
    this.logger = logger.for(this)
    this.config = {
      intervalMs: options.intervalMs ?? 10 * 60_000,
      timeoutMs: options.timeoutMs ?? 10_000,
    }
  }

  start() {
    const runCompare = async () => {
      if (this.running) {
        return
      }
      this.running = true
      try {
        await this.compare()
      } catch (e) {
        this.logger.error(e)
      }
      this.running = false
    }
    setInterval(runCompare, this.config.intervalMs)
    this.logger.info('Compare schedulded', {
      intervalMs: this.config.intervalMs,
    })
    runCompare()
    this.logger.info('Started')
  }

  async compare() {
    this.logger.info('Running compare', {
      plugins: this.plugins.map((p) => p.name),
    })
    this.logger.info('Fetching items from external explorers...', {
      plugins: this.plugins.map((p) => p.name),
    })
    const items = (
      await Promise.all(
        this.plugins.map(async (plugin) => {
          try {
            return {
              plugin,
              items: await plugin.getExternalItems(),
            }
          } catch (error) {
            this.logger.warn(`Plugin for ${plugin.name} failed`, error)
            return null
          }
        }),
      )
    ).filter((x) => x != null)

    this.logger.info('Setting timeout...', { timeout: this.config.timeoutMs })
    // This timeout is needed to make sure our backend indexes latest events
    await new Promise((resolve) => setTimeout(resolve, this.config.timeoutMs))

    this.logger.info('Comparing...', {
      plugins: items.map((i) => i.plugin.name),
    })
    for (const i of items) {
      const records =
        i.plugin.type === 'message'
          ? await this.db.bridgeMessage.getExistingItems(i.items)
          : await this.db.bridgeTransfer.getExistingItems(i.items)

      let missing = 0
      for (const item of i.items) {
        const record = records.find(
          (r) =>
            r.srcTxHash?.toLowerCase() === item.srcTxHash.toLowerCase() &&
            r.dstTxHash?.toLowerCase() === item.dstTxHash.toLowerCase(),
        )

        if (!record) {
          missing++
          this.logger.warn('Missing item detected', {
            plugin: i.plugin.name,
            item,
          })
        }
      }

      this.logger.info('Plugin compare finished', {
        plugin: i.plugin.name,
        items: i.items.length,
        records: records.length,
        missing,
      })

      this.logger.info('Compare finished', {
        plugins: items.map((i) => i.plugin.name),
      })
    }
  }
}
