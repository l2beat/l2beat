import type { Logger } from '@l2beat/backend-tools'

import { daLayers, ethereumDaLayer } from '@l2beat/config'
import type { Database } from '@l2beat/database'
import type { CoingeckoClient } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import { z } from 'zod'
import type { Clock } from '../../tools/Clock'
import { TaskQueue } from '../../tools/queue/TaskQueue'

export class DaBeatPricesRefresher {
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
      { metricsId: 'DaBeatPricesRefresher' },
    )
  }

  start() {
    this.logger.info('Started')
    this.clock.onNewHour(() => this.refreshQueue.addIfEmpty())
    this.refreshQueue.addIfEmpty()
  }

  private async refresh() {
    const coingeckoIds = [
      ...daLayers.filter((x) => x.daLayer.kind === 'PublicBlockchain'),
      ethereumDaLayer,
    ]
      .map((x) => x.daLayer.economicSecurity?.token.coingeckoId)
      .filter((x) => x !== undefined)

    assert(coingeckoIds.length <= 100, 'Too many ids')
    const result = z
      .array(
        z.object({
          id: z.string(),
          current_price: z.number(),
        }),
      )
      .parse(
        await this.coingeckoClient.query('/coins/markets', {
          vs_currency: 'usd',
          ids: coingeckoIds.join(','),
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
