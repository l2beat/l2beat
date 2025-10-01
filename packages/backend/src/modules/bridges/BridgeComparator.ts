import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { BridgeComparisonPlugin } from './comparison/types'

export class BridgeComparator {
  private running = false

  constructor(
    private db: Database,
    private plugins: BridgeComparisonPlugin[],
    private logger: Logger,
    private intervalMs = 10 * 60_000,
    private waitingTimeMs = 60_000,
  ) {
    this.logger = logger.for(this)
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
    setInterval(runCompare, this.intervalMs)
    runCompare()
    this.logger.info('Started')
  }

  async compare() {
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

    // This timeout is needed to make sure our backend indexes latest events
    await new Promise((resolve) => setTimeout(resolve, this.waitingTimeMs))

    for (const i of items) {
      const records =
        i.plugin.type === 'message'
          ? await this.db.bridgeMessage.getExistingItems(
              i.items,
              i.plugin.types,
            )
          : await this.db.bridgeTransfer.getExistingItems(
              i.items,
              i.plugin.types,
            )

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

      this.logger.info('Comparison finished', {
        plugin: i.plugin.name,
        items: i.items.length,
        records: records.length,
        missing,
      })
    }
  }
}
