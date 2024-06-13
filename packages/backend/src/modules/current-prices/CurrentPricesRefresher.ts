import { Logger } from '@l2beat/backend-tools'

import { Clock } from '../../tools/Clock'
import { TaskQueue } from '../../tools/queue/TaskQueue'
import { Database } from '@l2beat/database'
import { CoingeckoClient } from '@l2beat/shared'
import { z } from 'zod'

export class CurrentPricesRefresher {
  private readonly refreshQueue: TaskQueue<void>
  constructor(
    private readonly database: Database,
    private readonly coingeckoClient: CoingeckoClient,
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
      { metricsId: 'CurrentPricesRefresher' },
    )
  }

  start() {
    this.logger.info('Started')
    this.clock.onNewHour(() => this.refreshQueue.addIfEmpty())
  }

  private async refresh() {
    const result = z
      .array(
        z.object({
          id: z.string(),
          current_price: z.number(),
        }),
      )
      .parse(
        await this.coingeckoClient.query('/api/v3/coins/id/tickers', {
          vs_currency: 'usd',
          ids: ['ethereum', 'celestia'].join(','),
        }),
      )
  }
}
