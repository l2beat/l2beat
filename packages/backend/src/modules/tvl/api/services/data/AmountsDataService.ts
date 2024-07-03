import { Logger } from '@l2beat/backend-tools'

import { AmountConfigEntry, UnixTime } from '@l2beat/shared-pure'
import { Dictionary, groupBy } from 'lodash'
import { Clock } from '../../../../../tools/Clock'
import {
  IndexerConfigurationRecord,
  IndexerConfigurationRepository,
} from '../../../../../tools/uif/IndexerConfigurationRepository'
import {
  AmountRecord,
  AmountRepository,
} from '../../../repositories/AmountRepository'
import { CONSIDER_EXCLUDED_AFTER_DAYS } from '../../utils/getLaggingAndExcluded'

interface Dependencies {
  readonly amountRepository: AmountRepository
  readonly configurationRepository: IndexerConfigurationRepository
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
    const [amountRecords, configurationsState] = await Promise.all([
      this.$.amountRepository.getByConfigIdsInRange(
        configurations.map((c) => c.configId),
        minTimestamp,
        targetTimestamp,
      ),
      this.$.configurationRepository.getByIds(
        configurations.map((c) => c.configId),
      ),
    ])

    const amountsByTimestamp = groupBy(amountRecords, 'timestamp')

    const lagging = this.getLagging(
      configurationsState,
      amountsByTimestamp,
      targetTimestamp,
    )
    const excluded = this.getExcluded(configurationsState, targetTimestamp)

    const timestamps = this.$.clock.getAllTimestampsForApi(targetTimestamp, {
      minTimestampOverride: minTimestamp,
    })

    const aggregatedByTimestamp: Dictionary<bigint> = {}
    for (const timestamp of timestamps) {
      const amounts = amountsByTimestamp[timestamp.toString()] ?? []

      const interpolatedRecords = lagging
        .filter((l) => timestamp.gt(l.latestTimestamp))
        .map((l) => ({ amount: l.latestValue }))

      const aggregatedAmount = [
        ...amounts.filter((a) => !excluded.has(a.configId)),
        ...interpolatedRecords,
      ].reduce((acc, curr) => acc + curr.amount, 0n)

      aggregatedByTimestamp[timestamp.toString()] = aggregatedAmount
    }

    return {
      amounts: aggregatedByTimestamp,
      laggingFrom: new Map<string, UnixTime>(
        lagging.map((l) => [l.id, l.latestTimestamp]),
      ),
      excluded: new Set<string>(excluded),
    }
  }

  async getLatestAmount(
    configurations: (AmountConfigEntry & { configId: string })[],
    targetTimestamp: UnixTime,
  ) {
    const [amounts, configurationsState] = await Promise.all([
      this.$.amountRepository.getByTimestamp(targetTimestamp),
      this.$.configurationRepository.getByIds(
        configurations.map((c) => c.configId),
      ),
    ])

    const excluded = await this.getExcluded(
      configurationsState,
      targetTimestamp,
    )

    const result = {
      amounts,
      lagging: new Map(),
      excluded: new Set(excluded),
    }

    if (amounts.length + excluded.size === configurationsState.length) {
      return result
    }

    const lagging = configurations
      .filter((c) => !excluded.has(c.configId))
      // TODO: perf
      .filter((c) => !amounts.find((p) => p.configId === c.configId))

    await Promise.all(
      lagging.map(async (laggingConfig) => {
        const sortedRecordsForConfig =
          await this.$.amountRepository.getByConfigIdsInRange(
            [laggingConfig.configId],
            laggingConfig.sinceTimestamp,
            targetTimestamp,
          )

        const latest = sortedRecordsForConfig[sortedRecordsForConfig.length - 1]

        if (latest) {
          result.lagging.set(laggingConfig.configId, {
            latestTimestamp: latest.timestamp,
            latestValue: latest,
          })
          amounts.push({ ...latest, timestamp: targetTimestamp })
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
