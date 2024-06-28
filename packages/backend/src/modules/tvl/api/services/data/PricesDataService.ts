import { Logger, assert } from '@l2beat/backend-tools'

import { PriceConfigEntry, UnixTime } from '@l2beat/shared-pure'
import { Dictionary, groupBy } from 'lodash'
import {
  PriceRecord,
  PriceRepository,
} from '../../../repositories/PriceRepository'
import { SyncOptimizer } from '../../../utils/SyncOptimizer'
import { getLaggingAndSyncing } from '../../utils/getLaggingAndSyncing'

interface Dependencies {
  readonly priceRepository: PriceRepository
  readonly syncOptimizer: SyncOptimizer
  logger: Logger
}

export class PricesDataService {
  constructor(private readonly $: Dependencies) {
    this.$.logger = $.logger.for(this)
  }

  async getPrice(
    configurations: (PriceConfigEntry & { configId: string })[],
    minTimestamp: UnixTime,
    targetTimestamp: UnixTime,
  ) {
    const prices = await this.$.priceRepository.getByConfigIdsInRange(
      configurations.map((c) => c.configId),
      minTimestamp,
      targetTimestamp,
    )

    const pricesByTimestamp = groupBy(prices, 'timestamp')

    const { lagging, excluded } = getLaggingAndSyncing<PriceRecord>(
      configurations.map((c) => ({
        id: c.configId,
        minTimestamp: c.sinceTimestamp,
      })),
      pricesByTimestamp,
      (value: PriceRecord) => value.configId,
      targetTimestamp,
    )

    const result: Dictionary<number> = {}

    const timestamps = this.$.syncOptimizer.getAllTimestampsToSync()
    for (const timestamp of timestamps) {
      const price = pricesByTimestamp[timestamp.toNumber()]

      if (price === undefined) {
        if (lagging.length === 1) {
          result[timestamp.toString()] = lagging[0].latestValue.priceUsd
          continue
        }

        throw new Error('Lagging entry should be defined')
      }

      assert(price.length === 1)
      result[timestamp.toString()] = price[0].priceUsd
    }

    return result
  }
}
