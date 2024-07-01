import { assert, Logger } from '@l2beat/backend-tools'

import { PriceConfigEntry, UnixTime } from '@l2beat/shared-pure'
import { Dictionary, groupBy } from 'lodash'
import {
  PriceRecord,
  PriceRepository,
} from '../../../repositories/PriceRepository'
import { SyncOptimizer } from '../../../utils/SyncOptimizer'
import {
  CONSIDER_EXCLUDED_AFTER_DAYS,
  getLaggingAndSyncing,
} from '../../utils/getLaggingAndSyncing'

interface Dependencies {
  readonly priceRepository: PriceRepository
  readonly syncOptimizer: SyncOptimizer
  etherPriceConfig: PriceConfigEntry & { configId: string }
  logger: Logger
}

export class PricesDataService {
  constructor(private readonly $: Dependencies) {
    this.$.logger = $.logger.for(this)
  }

  async getPrices(
    configurations: (PriceConfigEntry & { configId: string })[],
    targetTimestamp: UnixTime,
  ) {
    const records = await this.$.priceRepository.getByConfigIdsInRange(
      configurations.map((c) => c.configId),
      configurations.reduce(
        (a, b) => UnixTime.min(a, b.sinceTimestamp),
        UnixTime.now(),
      ),
      targetTimestamp,
    )

    const result = {
      prices: {} as Dictionary<Dictionary<number>>,
      lagging: new Map<
        string,
        { latestTimestamp: UnixTime; latestValue: PriceRecord }
      >(),
      excluded: new Set<string>(),
    }

    const pricesByConfig = groupBy(records, 'configId')
    for (const [configId, prices] of Object.entries(pricesByConfig)) {
      const config = configurations.find((c) => c.configId === configId)
      assert(config, 'Config should be defined')

      const pricesByTimestamp = groupBy(prices, 'timestamp')

      const { lagging, excluded } = getLaggingAndSyncing<PriceRecord>(
        [
          {
            id: configId,
            minTimestamp: config.sinceTimestamp,
          },
        ],
        pricesByTimestamp,
        (value: PriceRecord) => value.configId,
        targetTimestamp,
      )

      lagging.forEach((l) => result.lagging.set(configId, { ...l }))
      excluded.forEach((s) => result.excluded.add(s))

      if (excluded.includes(configId)) {
        continue
      }

      const pricesByTimestampForConfig: Dictionary<number> = {}

      const timestamps = this.$.syncOptimizer
        .getAllTimestampsForApi()
        .filter((t) => t.gte(config.sinceTimestamp) && t.lte(targetTimestamp))
      for (const timestamp of timestamps) {
        const price = pricesByTimestamp[timestamp.toString()]

        if (price === undefined) {
          if (lagging.length === 1) {
            pricesByTimestampForConfig[timestamp.toString()] =
              lagging[0].latestValue.priceUsd
            continue
          }

          throw new Error(
            `Lagging entry should be defined for ${timestamp.toNumber()} ${JSON.stringify(
              config,
            )}`,
          )
        }

        assert(price.length === 1, 'There should be one price')
        pricesByTimestampForConfig[timestamp.toString()] = price[0].priceUsd
      }

      result.prices[configId] = pricesByTimestampForConfig
    }

    return result
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

    const recordsForLagging = await this.$.priceRepository.getByConfigIds(
      lagging.map((l) => l.configId),
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
    const prices = await this.getPrices(
      [this.$.etherPriceConfig],
      targetTimestamp,
    )

    const ethPrices = prices.prices[this.$.etherPriceConfig.configId]
    assert(ethPrices, 'Missing ETH prices')

    return {
      ...prices,
      prices: ethPrices,
    }
  }
}
