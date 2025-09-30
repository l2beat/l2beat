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
    await Promise.all(
      this.plugins.map(async (plugin) => {
        const items = await plugin.getExternalItems()

        await new Promise((resolve) => setTimeout(resolve, this.waitingTimeMs))

        const records =
          plugin.type === 'message'
            ? await this.db.bridgeMessage.getExistingItems(items, plugin.types)
            : await this.db.bridgeTransfer.getExistingItems(items, plugin.types)

        let missing = 0
        for (const item of items) {
          const record = records.find(
            (r) =>
              r.srcTxHash?.toLowerCase() === item.srcTxHash.toLowerCase() &&
              r.dstTxHash?.toLowerCase() === item.dstTxHash.toLowerCase(),
          )

          if (!record) {
            missing++
            this.logger.info('Missing item detected', {
              plugin: plugin.name,
              item,
            })
          }
        }

        this.logger.info('Comparison finished', {
          plugin: plugin.name,
          items: items.length,
          records: records.length,
          missing,
        })
      }),
    )
  }
}
