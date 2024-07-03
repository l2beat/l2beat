import { Logger } from '@l2beat/backend-tools'

import { AmountConfigEntry, UnixTime } from '@l2beat/shared-pure'
import { Dictionary, groupBy } from 'lodash'
import { Clock } from '../../../../../tools/Clock'
import { IndexerConfigurationRecord } from '../../../../../tools/uif/IndexerConfigurationRepository'
import { IndexerService } from '../../../../../tools/uif/IndexerService'
import {
  AmountRecord,
  AmountRepository,
} from '../../../repositories/AmountRepository'
import { CONSIDER_EXCLUDED_AFTER_DAYS } from '../../utils/getLaggingAndExcluded'

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
      this.$.indexerService.getConfigurationsStatus(
        configurations,
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
      this.$.indexerService.getConfigurationsStatus(
        configurations,
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

  private getLagging(
    configurations: IndexerConfigurationRecord[],
    amountsByTimestamp: Dictionary<AmountRecord[]>,
    targetTimestamp: UnixTime,
  ) {
    const lagging: {
      id: string
      latestTimestamp: UnixTime
      latestValue: bigint
    }[] = []

    for (const config of configurations) {
      const syncStatus = config.currentHeight
        ? new UnixTime(config.currentHeight)
        : undefined

      // newly added configuration
      if (syncStatus === undefined) {
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

      if (
        syncStatus.gte(
          targetTimestamp.add(-CONSIDER_EXCLUDED_AFTER_DAYS, 'days'),
        )
      ) {
        const latest =
          amountsByTimestamp[syncStatus.toString()]?.find(
            (a) => a.configId === config.id,
          )?.amount ?? 0n

        lagging.push({
          id: config.id,
          latestTimestamp: syncStatus,
          latestValue: latest,
        })
        continue
      }
    }

    return lagging
  }

  private getExcluded(
    configurations: IndexerConfigurationRecord[],
    targetTimestamp: UnixTime,
  ) {
    const excluded = new Set<string>()

    for (const config of configurations) {
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
}
