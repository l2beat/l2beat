import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { CoingeckoClient } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { DaBeatConfig } from '../../config/Config'
import type { Clock } from '../../tools/Clock'
import { TaskQueue } from '../../tools/queue/TaskQueue'

export class DaBeatPricesRefresher {
  private readonly refreshQueue: TaskQueue<void>
  constructor(
    private readonly database: Database,
    private readonly coingeckoClient: CoingeckoClient,
    private readonly config: DaBeatConfig,
    private readonly clock: Clock,
    private readonly logger: Logger,
  ) {
    this.logger = logger.for(this)
    this.refreshQueue = new TaskQueue<void>(
      async () => {
        this.logger.info('Refresh started')
        await this.refresh()
        this.logger.info('Refresh finished')
      },
      this.logger.for('refreshQueue'),
      { metricsId: 'DaBeatPricesRefresher' },
    )
  }

  start() {
    this.logger.info('Started')
    this.clock.onNewHour(() => this.refreshQueue.addIfEmpty())
    this.refreshQueue.addIfEmpty()
  }

  private async refresh() {
    assert(this.config.coingeckoIds.length <= 100, 'Too many ids')
    const result = v
      .array(v.object({ id: v.string(), current_price: v.number() }))
      .parse(
        await this.coingeckoClient.query('/coins/markets', {
          vs_currency: 'usd',
          ids: this.config.coingeckoIds.join(','),
        }),
      )

    await this.database.currentPrice.upsertMany(
      result.map(({ id, current_price }) => ({
        coingeckoId: id,
        priceUsd: current_price,
      })),
    )
  }
}
