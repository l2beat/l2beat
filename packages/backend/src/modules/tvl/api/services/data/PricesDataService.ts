import { assert, Logger } from '@l2beat/backend-tools'

import { PriceConfigEntry, UnixTime } from '@l2beat/shared-pure'
import { Dictionary } from 'lodash'
import { Clock } from '../../../../../tools/Clock'
import { IndexerConfigurationRepository } from '../../../../../tools/uif/IndexerConfigurationRepository'
import { PriceRepository } from '../../../repositories/PriceRepository'
import { CONSIDER_EXCLUDED_AFTER_DAYS } from '../../utils/getLaggingAndExcluded'

interface Dependencies {
  readonly priceRepository: PriceRepository
  readonly configurationRepository: IndexerConfigurationRepository
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
    const [prices, excluded] = await Promise.all([
      this.$.priceRepository.getByTimestamp(targetTimestamp),
      this.getExcluded(configurations, targetTimestamp),
    ])

    const result = {
      prices,
      lagging: new Map(),
      excluded: new Set(excluded),
    }

    if (prices.length + excluded.size === configurations.length) {
      return result
    }

    const lagging = configurations
      .filter((c) => !excluded.has(c.configId))
      // TODO: perf
      .filter((c) => !prices.find((p) => p.configId === c.configId))

    await Promise.all(
      lagging.map(async (laggingConfig) => {
        const sortedRecordsForConfig =
          await this.$.priceRepository.getByConfigIdsInRange(
            [laggingConfig.configId],
            laggingConfig.sinceTimestamp,
            targetTimestamp,
          )

        const latest = sortedRecordsForConfig[sortedRecordsForConfig.length - 1]

        result.lagging.set(laggingConfig.configId, {
          latestTimestamp: latest.timestamp,
          latestValue: latest,
        })

        result.prices.push({ ...latest, timestamp: targetTimestamp })
      }),
    )
    return result
  }

  private async getExcluded(
    configurations: (PriceConfigEntry & { configId: string })[],
    targetTimestamp: UnixTime,
  ) {
    const excluded = new Set<string>()

    const configurationsState = await this.$.configurationRepository.getByIds(
      configurations.map((c) => c.configId),
    )

    for (const config of configurationsState) {
      const syncStatus = config.currentHeight
        ? new UnixTime(config.currentHeight)
        : undefined

      // newly added configuration
      if (syncStatus === undefined) {
        excluded.add(config.id)
        continue
      }

      // synced configuration
      if (syncStatus.equals(targetTimestamp)) {
        continue
      }

      // phased out configuration - but we still want to display data
      if (config.maxHeight && config.maxHeight === config.currentHeight) {
        continue
      }

      // out of sync configuration
      if (
        syncStatus.lt(
          targetTimestamp.add(-CONSIDER_EXCLUDED_AFTER_DAYS, 'days'),
        )
      ) {
        excluded.add(config.id)
        continue
      }
    }

    return excluded
  }

  async getEthPrices(targetTimestamp: UnixTime) {
    return await this.getPrices(this.$.etherPriceConfig, targetTimestamp)
  }
}
