import { Logger } from '@l2beat/backend-tools'

import { Database } from '@l2beat/database'
import { CoingeckoClient } from '@l2beat/shared'
import { toBatches } from '@l2beat/shared-pure'
import { z } from 'zod'
import { Clock } from '../../tools/Clock'
import { TaskQueue } from '../../tools/queue/TaskQueue'

const coinMarketResponseSchema = z.array(
  z.object({
    id: z.string(),
    current_price: z.number(),
  }),
)

// It's similar to DaBeatPricesRefresher, if not the same, only query source is different
// and it will end-up in the token-db once we wire it up.
export class AssetRisksPriceRefresher {
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
      { metricsId: 'AssetRisksPriceRefresher' },
    )
  }

  start() {
    this.logger.info('Started')
    this.clock.onNewHour(() => this.refreshQueue.addIfEmpty())
    this.refreshQueue.addIfEmpty()
  }

  private async refresh() {
    // TBD: constant/tag for query purposes
    const meta = await this.database.tokenMeta.getBySource('CoinGecko')

    const coingeckoIds = meta.flatMap(({ externalId }) => externalId ?? [])

    const uniqueCoingeckoIds = [...new Set(coingeckoIds)]

    // Max per page mentioned in the docs
    // @see https://docs.coingecko.com/reference/coins-markets
    const PER_PAGE = 250

    // Double-check if we really need this and if so, then we need to improve the batch calls
    const batches = toBatches(uniqueCoingeckoIds, PER_PAGE)

    // Also we can either use batches here or use coingecko's pagination - this is simpler
    const result = await Promise.all(
      batches.map((batch) => this.fetchPricesForBatch(batch)),
    )

    await this.database.currentPrice.upsertMany(
      result.flat().map(({ id, current_price }) => ({
        coingeckoId: id,
        priceUsd: current_price,
      })),
    )
  }

  private async fetchPricesForBatch(coingeckoIds: string[]) {
    const result = await this.coingeckoClient.query('/coins/markets', {
      vs_currency: 'usd',
      ids: coingeckoIds.join(','),
    })

    return coinMarketResponseSchema.parse(result)
  }
}
