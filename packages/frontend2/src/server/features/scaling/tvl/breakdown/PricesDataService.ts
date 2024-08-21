import { type Database } from '@l2beat/database'
import {
  assert,
  type PriceConfigEntry,
  type UnixTime,
} from '@l2beat/shared-pure'
import { type Dictionary } from 'lodash'
import { type Clock } from './Clock'
import { type DataStatusService } from './DataStatusService'

interface Dependencies {
  readonly db: Database
  readonly dataStatusService: DataStatusService
  readonly clock: Clock
  etherPriceConfig: PriceConfigEntry & { configId: string }
}

export class PricesDataService {
  constructor(private readonly $: Dependencies) {}

  async getPrices(
    configuration: PriceConfigEntry & { configId: string },
    targetTimestamp: UnixTime,
  ) {
    const priceRecords = await this.$.db.price.getByConfigIdsInRange(
      [configuration.configId],
      configuration.sinceTimestamp,
      targetTimestamp,
    )
    const status = await this.$.dataStatusService.getConfigurationsStatus(
      [configuration],
      targetTimestamp,
    )

    assert(
      !status.excluded.has(configuration.configId),
      `This code should not run when price still syncing id ${configuration.configId}`,
    )

    const pricesByTimestamp: Dictionary<number> = {}

    for (const price of priceRecords) {
      if (
        !this.$.clock.shouldTimestampBeIncluded(
          targetTimestamp,
          price.timestamp,
        )
      ) {
        continue
      }

      pricesByTimestamp[price.timestamp.toString()] = price.priceUsd
    }

    if (status.lagging.length === 0) {
      return {
        prices: pricesByTimestamp,
      }
    }

    const latest = priceRecords[priceRecords.length - 1]

    const options = latest?.timestamp
      ? { minTimestampOverride: latest.timestamp }
      : undefined
    const missingTimestamps = this.$.clock.getAllTimestampsForApi(
      targetTimestamp,
      options,
    )

    for (const timestamp of missingTimestamps) {
      if (latest) {
        pricesByTimestamp[timestamp.toString()] = latest.priceUsd
      }
    }

    return {
      prices: pricesByTimestamp,
      laggingFrom: latest?.timestamp,
    }
  }

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

  async getEthPrices(targetTimestamp: UnixTime) {
    return await this.getPrices(this.$.etherPriceConfig, targetTimestamp)
  }
}
