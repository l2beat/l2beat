import { assert, Logger } from '@l2beat/backend-tools'

import { PriceConfigEntry, UnixTime } from '@l2beat/shared-pure'
import { Dictionary } from 'lodash'
import { Clock } from '../../../../../tools/Clock'
import {
  PriceRecord,
  PriceRepository,
} from '../../../repositories/PriceRepository'
import { CONSIDER_EXCLUDED_AFTER_DAYS } from '../../utils/getLaggingAndSyncing'

interface Dependencies {
  readonly priceRepository: PriceRepository
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
    const prices = await this.$.priceRepository.getByTimestamp(targetTimestamp)

    const result = {
      prices,
      lagging: new Map<
        string,
        { latestTimestamp: UnixTime; latestValue: PriceRecord }
      >(),
      excluded: new Set<string>(),
    }

    if (prices.length === configurations.length) {
      return result
    }

    const missing = configurations.filter(
      (c) => !prices.find((p) => p.configId === c.configId),
    )

    const pricesAtExcludedHeuristic =
      await this.$.priceRepository.getByTimestamp(
        targetTimestamp.add(-CONSIDER_EXCLUDED_AFTER_DAYS, 'days'),
      )

    const excluded = missing.filter(
      (c) => !pricesAtExcludedHeuristic.find((p) => p.configId === c.configId),
    )
    excluded.forEach((e) => result.excluded.add(e.configId))

    if (excluded.length + prices.length === configurations.length) {
      return result
    }

    const lagging = missing.filter((c) =>
      pricesAtExcludedHeuristic.find((p) => p.configId === c.configId),
    )

    const recordsForLagging =
      await this.$.priceRepository.getByConfigIdsInRange(
        lagging.map((l) => l.configId),
        lagging.reduce(
          (a, b) => UnixTime.min(a, b.sinceTimestamp),
          UnixTime.now(),
        ),
        targetTimestamp,
      )

    for (const laggingConfig of lagging) {
      const sortedRecordsForConfig = recordsForLagging
        .filter((r) => r.configId === laggingConfig.configId)
        .sort((a, b) => a.timestamp.toNumber() - b.timestamp.toNumber())

      const latest = sortedRecordsForConfig[sortedRecordsForConfig.length - 1]

      result.lagging.set(laggingConfig.configId, {
        latestTimestamp: latest.timestamp,
        latestValue: latest,
      })

      result.prices.push(latest)
    }
    return result
  }

  async getEthPrices(targetTimestamp: UnixTime) {
    return await this.getPrices(this.$.etherPriceConfig, targetTimestamp)
  }
}
