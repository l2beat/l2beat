import { Logger } from '@l2beat/backend-tools'

import {
  AmountConfigEntry,
  CirculatingSupplyEntry,
  UnixTime,
} from '@l2beat/shared-pure'
import { Dictionary, groupBy } from 'lodash'
import { Clock } from '../../../../../tools/Clock'
import { IndexerService } from '../../../../../tools/uif/IndexerService'
import { AmountRepository } from '../../../repositories/AmountRepository'

interface Dependencies {
  readonly amountRepository: AmountRepository
  readonly indexerService: IndexerService
  readonly clock: Clock
  logger: Logger
}

export class AmountsDataService {
  constructor(private readonly $: Dependencies) {
    this.$.logger = $.logger.for(this)
  }

  async getAggregatedAmounts(
    configurations: (AmountConfigEntry & { configId: string })[],
    targetTimestamp: UnixTime,
  ) {
    const minTimestamp = configurations.reduce(
      (a, b) => UnixTime.min(a, b.sinceTimestamp),
      UnixTime.now(),
    )
    const [amountRecords, status] = await Promise.all([
      this.$.amountRepository.getByConfigIdsInRange(
        configurations.map((c) => c.configId),
        minTimestamp,
        targetTimestamp,
      ),
      this.$.indexerService.getAmountsStatus(
        configurations,
        configurations.filter(
          (c): c is CirculatingSupplyEntry & { configId: string } =>
            c.type === 'circulatingSupply',
        ),
        targetTimestamp,
      ),
    ])

    const amountsByTimestamp = groupBy(amountRecords, 'timestamp')

    const timestamps = this.$.clock.getAllTimestampsForApi(targetTimestamp, {
      minTimestampOverride: minTimestamp,
    })

    const aggregatedByTimestamp: Dictionary<bigint> = {}
    for (const timestamp of timestamps) {
      const amounts = amountsByTimestamp[timestamp.toString()] ?? []

      const interpolatedRecords = status.lagging
        .filter((l) => timestamp.gt(l.latestTimestamp))
        .map((l) => {
          const amount =
            amountsByTimestamp[l.latestTimestamp.toString()]?.find(
              (a) => a.configId === l.id,
            )?.amount ?? 0n
          return { amount }
        })

      const aggregatedAmount = [
        ...amounts.filter((a) => !status.excluded.has(a.configId)),
        ...interpolatedRecords,
      ].reduce((acc, curr) => acc + curr.amount, 0n)

      aggregatedByTimestamp[timestamp.toString()] = aggregatedAmount
    }

    return {
      amounts: aggregatedByTimestamp,
      laggingFrom: new Map<string, UnixTime>(
        status.lagging.map((l) => [l.id, l.latestTimestamp]),
      ),
      excluded: status.excluded,
    }
  }

  async getLatestAmount(
    configurations: (AmountConfigEntry & { configId: string })[],
    targetTimestamp: UnixTime,
  ) {
    const [amounts, status] = await Promise.all([
      this.$.amountRepository.getByTimestamp(targetTimestamp),
      this.$.indexerService.getAmountsStatus(
        configurations,
        configurations.filter(
          (c): c is CirculatingSupplyEntry & { configId: string } =>
            c.type === 'circulatingSupply',
        ),
        targetTimestamp,
      ),
    ])

    const result = {
      amounts,
      lagging: new Map(),
      excluded: new Set(status.excluded),
    }

    if (amounts.length + status.excluded.size === configurations.length) {
      return result
    }

    await Promise.all(
      status.lagging.map(async (laggingConfig) => {
        const latestRecord =
          await this.$.amountRepository.findByConfigAndTimestamp(
            laggingConfig.id,
            laggingConfig.latestTimestamp,
          )

        if (latestRecord) {
          result.lagging.set(laggingConfig.id, {
            latestTimestamp: laggingConfig.latestTimestamp,
            latestValue: latestRecord,
          })
          amounts.push({ ...latestRecord, timestamp: targetTimestamp })
        }
      }),
    )

    return result
  }
}
