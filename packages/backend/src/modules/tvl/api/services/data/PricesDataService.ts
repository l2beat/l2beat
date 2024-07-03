import { assert, Logger } from '@l2beat/backend-tools'

import { PriceConfigEntry, UnixTime } from '@l2beat/shared-pure'
import { Dictionary } from 'lodash'
import { Clock } from '../../../../../tools/Clock'
import { IndexerService } from '../../../../../tools/uif/IndexerService'
import { PriceRepository } from '../../../repositories/PriceRepository'
import { CONSIDER_EXCLUDED_AFTER_DAYS } from '../../utils/getLaggingAndExcluded'

interface Dependencies {
  readonly priceRepository: PriceRepository
  readonly indexerService: IndexerService
  readonly clock: Clock
  etherPriceConfig: PriceConfigEntry & { configId: string }
  logger: Logger
}

export class PricesDataService {
  constructor(private readonly $: Dependencies) {
    this.$.logger = $.logger.for(this)
  }

  async getPrices(
    configuration: PriceConfigEntry & { configId: string },
    targetTimestamp: UnixTime,
  ) {
    const priceRecords = await this.$.priceRepository.getByConfigIdsInRange(
      [configuration.configId],
      configuration.sinceTimestamp,
      targetTimestamp,
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

    if (pricesByTimestamp[targetTimestamp.toString()] !== undefined) {
      return {
        prices: pricesByTimestamp,
        laggingFrom: undefined,
      }
    }

    const latest = priceRecords[priceRecords.length - 1]
    assert(
      latest.timestamp.gte(
        targetTimestamp.add(-CONSIDER_EXCLUDED_AFTER_DAYS, 'days'),
      ),
      'This code should not run when price still syncing',
    )

    const missingTimestamps = this.$.clock.getAllTimestampsForApi(
      targetTimestamp,
      {
        minTimestampOverride: latest.timestamp,
      },
    )

    for (const timestamp of missingTimestamps) {
      pricesByTimestamp[timestamp.toString()] = latest.priceUsd
    }

    return {
      prices: pricesByTimestamp,
      laggingFrom: latest.timestamp,
    }
  }

  async getLatestPrice(
    configurations: (PriceConfigEntry & { configId: string })[],
    targetTimestamp: UnixTime,
  ) {
    const [prices, status] = await Promise.all([
      this.$.priceRepository.getByTimestamp(targetTimestamp),
      this.$.indexerService.getConfigurationsStatus(
        configurations,
        targetTimestamp,
      ),
    ])

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
        const latestRecord =
          await this.$.priceRepository.findByConfigAndTimestamp(
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
