import { type Database } from '@l2beat/database'
import {
  assert,
  type PriceConfigEntry,
  type UnixTime,
} from '@l2beat/shared-pure'
import { type DataStatusService } from './DataStatusService'

interface Dependencies {
  readonly db: Database
  readonly dataStatusService: DataStatusService
}

export class PricesDataService {
  constructor(private readonly $: Dependencies) {}

  async getLatestPrice(
    configurations: (PriceConfigEntry & { configId: string })[],
    targetTimestamp: UnixTime,
  ) {
    const prices = await this.$.db.price.getByTimestamp(targetTimestamp)
    const status = await this.$.dataStatusService.getConfigurationsStatus(
      configurations,
      targetTimestamp,
    )

    const result = {
      prices,
      lagging: new Map(),
      excluded: new Set(status.excluded),
    }

    if (prices.length + status.excluded.size === configurations.length) {
      return result
    }

    await Promise.all(
      status.lagging.map(async (laggingConfig) => {
        const latestRecord = await this.$.db.price.findByConfigAndTimestamp(
          laggingConfig.id,
          laggingConfig.latestTimestamp,
        )

        assert(latestRecord, `Undefined record for ${laggingConfig.id}`)

        result.lagging.set(laggingConfig.id, {
          latestTimestamp: laggingConfig.latestTimestamp,
          latestValue: latestRecord,
        })

        result.prices.push({ ...latestRecord, timestamp: targetTimestamp })
      }),
    )

    return result
  }
}
