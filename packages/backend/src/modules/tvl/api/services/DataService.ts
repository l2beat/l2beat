import { assert, Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'

import { Dictionary, groupBy } from 'lodash'
import { AmountRepository } from '../../repositories/AmountRepository'
import { PriceRepository } from '../../repositories/PriceRepository'
import { SyncOptimizer } from '../../utils/SyncOptimizer'
import { PriceId } from '../../utils/createPriceId'

interface Dependencies {
  readonly amountRepository: AmountRepository
  readonly priceRepository: PriceRepository
  readonly syncOptimizer: SyncOptimizer
  readonly ethPriceId: PriceId
  logger: Logger
}

export class DataService {
  constructor(private readonly $: Dependencies) {
    this.$.logger = $.logger.for(this)
  }

  async getPricesAndAmountsForToken(
    amountConfigIds: string[],
    priceConfigId: string,
    minTimestamp: UnixTime,
    lastHour: UnixTime,
  ) {
    const amounts = await this.$.amountRepository.getByConfigIdsInRange(
      amountConfigIds,
      minTimestamp,
      lastHour,
    )
    const prices = await this.$.priceRepository.getByConfigIdsInRange(
      [priceConfigId],
      minTimestamp,
      lastHour,
    )
    const amountsByTimestamp = groupBy(amounts, 'timestamp')

    const pricesByTimestamp: Dictionary<number> = Object.fromEntries(
      prices.map((p) => [p.timestamp.toString(), p.priceUsd]),
    )

    const hourlyCutOff = this.$.syncOptimizer.hourlyCutOff
    const sixHourlyCutOff = this.$.syncOptimizer.sixHourlyCutOff
    // TODO: move to sync optimizer
    const timestamps = this.$.syncOptimizer.getAllTimestampsToSync()

    const amountsAndPrices: Dictionary<{ amount: bigint; price: number }> = {}
    for (const timestamp of timestamps) {
      const amounts = amountsByTimestamp[timestamp.toString()]
      const price = pricesByTimestamp[timestamp.toString()]
      // TODO: If we interpolate, do it here
      const amount = amounts?.reduce((acc, curr) => acc + curr.amount, 0n)
      amountsAndPrices[timestamp.toString()] = {
        amount: amount ?? 0n,
        price: price ?? 0,
      }
    }

    return {
      amountsAndPrices,
      hourlyStart: UnixTime.max(hourlyCutOff, minTimestamp).toEndOf('hour'),
      sixHourlyStart: UnixTime.max(sixHourlyCutOff, minTimestamp).toEndOf(
        'six hours',
      ),
      dailyStart: minTimestamp.toEndOf('day'),
    }
  }

  async getEthPrices() {
    const records = await this.$.priceRepository.getByConfigId(
      this.$.ethPriceId,
    )
    const prices = new Map(
      records.map((x) => [x.timestamp.toNumber(), x.priceUsd]),
    )
    const timestamps = this.$.syncOptimizer.getAllTimestampsToSync()

    assert(
      timestamps.every((x) => prices.has(x.toNumber())),
      `Missing prices for ethereum`,
    )
    return prices
  }

  async getPricesByConfigIdsAndTimestamp(timestamp: UnixTime) {
    const prices = await this.$.priceRepository.getByTimestamp(timestamp)

    // TODO: interpolate here

    return prices
  }

  async getAmountsByConfigIdsAndTimestamp(timestamp: UnixTime) {
    // TODO: what to do when there are missing values?
    return await this.$.amountRepository.getByTimestamp(timestamp)
  }
}
