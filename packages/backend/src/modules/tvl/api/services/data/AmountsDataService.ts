import { Logger } from '@l2beat/backend-tools'

import { AmountConfigEntry, UnixTime } from '@l2beat/shared-pure'
import { Dictionary, groupBy } from 'lodash'
import { Clock } from '../../../../../tools/Clock'
import { IndexerConfigurationRepository } from '../../../../../tools/uif/IndexerConfigurationRepository'
import {
  AmountRecord,
  AmountRepository,
} from '../../../repositories/AmountRepository'
import {
  CONSIDER_EXCLUDED_AFTER_DAYS,
  getLaggingAndExcluded,
} from '../../utils/getLaggingAndExcluded'

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
    const amountRecords = await this.$.amountRepository.getByConfigIdsInRange(
      configurations.map((c) => c.configId),
      minTimestamp,
      targetTimestamp,
    )

    const amountsByTimestamp = groupBy(amountRecords, 'timestamp')

    const { lagging, excluded } = getLaggingAndExcluded<AmountRecord>(
      configurations.map((c) => ({
        minTimestamp: c.sinceTimestamp,
        id: c.configId,
      })),
      amountsByTimestamp,
      (value: AmountRecord) => value.configId,
      targetTimestamp,
    )

    const doubleCheckedExcluded = await this.doubleCheckExcluded(
      targetTimestamp,
      excluded,
    )

    const timestamps = this.$.clock.getAllTimestampsForApi(targetTimestamp, {
      minTimestampOverride: minTimestamp,
    })

    const aggregatedByTimestamp: Dictionary<bigint> = {}
    for (const timestamp of timestamps) {
      const amounts = amountsByTimestamp[timestamp.toString()] ?? []

      if (!this.$.clock.shouldTimestampBeIncluded(targetTimestamp, timestamp)) {
        continue
      }

      const interpolatedRecords = lagging
        .filter((l) => timestamp.gt(l.latestTimestamp))
        .map((l) => l.latestValue)

      const aggregatedAmount = [...amounts, ...interpolatedRecords]
        .filter((a) => !doubleCheckedExcluded.includes(a.configId))
        .reduce((acc, curr) => acc + curr.amount, 0n)

      if (aggregatedAmount === 0n) {
        console.log('zero')
      }

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
    const amounts =
      await this.$.amountRepository.getByTimestamp(targetTimestamp)

    const result = {
      amounts,
      lagging: new Map<
        string,
        { latestTimestamp: UnixTime; latestValue: AmountRecord }
      >(),
      excluded: new Set<string>(),
    }

    if (amounts.length === configurations.length) {
      return result
    }

    const missing = configurations.filter(
      (c) => !amounts.find((p) => p.configId === c.configId),
    )

    const amountsAtExcludedHeuristic =
      await this.$.amountRepository.getByTimestamp(
        targetTimestamp.add(-CONSIDER_EXCLUDED_AFTER_DAYS, 'days'),
      )

    const excluded = missing.filter(
      (c) => !amountsAtExcludedHeuristic.find((p) => p.configId === c.configId),
    )
    excluded.forEach((e) => result.excluded.add(e.configId))

    if (excluded.length + amounts.length === configurations.length) {
      return result
    }

    const lagging = missing.filter((c) =>
      amountsAtExcludedHeuristic.find((p) => p.configId === c.configId),
    )

    const recordsForLagging =
      await this.$.amountRepository.getByConfigIdsInRange(
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

      result.amounts.push(latest)
    }

    return result
  }

  // Configs marked as excluded have to be double checked -
  // due to the logic of amount that we are not storing zeros
  // there can be configurations with no amounts for latest X days
  // but they used to have amounts in the past -
  // so we do not want to exclude them
  private async doubleCheckExcluded(
    targetTimestamp: UnixTime,
    potentiallyExcludedIds: string[],
  ) {
    const excluded = []

    const configurations = await this.$.configurationRepository.getByIds(
      potentiallyExcludedIds,
    )

    for (const config of configurations) {
      const syncStatus = config.currentHeight
        ? new UnixTime(config.currentHeight)
        : undefined

      // newly added configuration
      if (syncStatus === undefined) {
        excluded.push(config.id)
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
        excluded.push(config.id)
        continue
      }
    }

    return excluded
  }
}
