import { assert, Logger } from '@l2beat/backend-tools'

import { AmountConfigEntry, UnixTime } from '@l2beat/shared-pure'
import { Dictionary, groupBy } from 'lodash'
import { Clock } from '../../../../../tools/Clock'
import {
  AmountRecord,
  AmountRepository,
} from '../../../repositories/AmountRepository'
import {
  CONSIDER_EXCLUDED_AFTER_DAYS,
  getLaggingAndSyncing,
} from '../../utils/getLaggingAndSyncing'

interface Dependencies {
  readonly amountRepository: AmountRepository
  readonly clock: Clock
  logger: Logger
}

export class AmountsDataService {
  constructor(private readonly $: Dependencies) {
    this.$.logger = $.logger.for(this)
  }

  async getAmounts(
    configurations: (AmountConfigEntry & { configId: string })[],
    targetTimestamp: UnixTime,
  ) {
    const records = await this.$.amountRepository.getByConfigIdsInRange(
      configurations.map((c) => c.configId),
      configurations.reduce(
        (a, b) => UnixTime.min(a, b.sinceTimestamp),
        UnixTime.now(),
      ),
      targetTimestamp,
    )

    const result = {
      amounts: {} as Dictionary<Dictionary<bigint>>,
      lagging: new Map<
        string,
        { latestTimestamp: UnixTime; latestValue: AmountRecord }
      >(),
      excluded: new Set<string>(),
    }

    const amountsByConfig = groupBy(records, 'configId')
    for (const [configId, amounts] of Object.entries(amountsByConfig)) {
      const config = configurations.find((c) => c.configId === configId)
      assert(config, 'Config should be defined')

      const amountsByTimestamp = groupBy(amounts, 'timestamp')

      const { lagging, excluded } = getLaggingAndSyncing<AmountRecord>(
        [
          {
            id: configId,
            minTimestamp: config.sinceTimestamp,
          },
        ],
        amountsByTimestamp,
        (value: AmountRecord) => value.configId,
        targetTimestamp,
      )

      lagging.forEach((l) => result.lagging.set(configId, { ...l }))
      excluded.forEach((s) => result.excluded.add(s))

      if (excluded.includes(configId)) {
        continue
      }

      const amountsByTimestampForConfig: Dictionary<bigint> = {}
      const timestamps = this.$.clock.getAllTimestampsForApi(targetTimestamp, {
        minTimestampOverride: config.sinceTimestamp,
      })
      for (const timestamp of timestamps) {
        const amount = amountsByTimestamp[timestamp.toString()]

        if (amount === undefined) {
          const l = lagging[0]

          if (l && l.latestTimestamp.gte(timestamp)) {
            amountsByTimestampForConfig[timestamp.toString()] =
              l.latestValue.amount
          } else {
            // zeroes are not stored in the DB
            amountsByTimestampForConfig[timestamp.toString()] = 0n
          }

          continue
        }

        assert(amount.length === 1, 'There should be one amount')
        amountsByTimestampForConfig[timestamp.toString()] = amount[0].amount
      }

      result.amounts[configId] = amountsByTimestampForConfig
    }

    return result
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

    const recordsForLagging = await this.$.amountRepository.getByConfigIds(
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

      result.amounts.push(latest)
    }

    return result
  }
}
