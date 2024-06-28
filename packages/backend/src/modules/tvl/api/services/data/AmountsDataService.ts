import { assert, Logger } from '@l2beat/backend-tools'

import { AmountConfigEntry, UnixTime } from '@l2beat/shared-pure'
import { Dictionary, groupBy } from 'lodash'
import {
  AmountRecord,
  AmountRepository,
} from '../../../repositories/AmountRepository'
import { SyncOptimizer } from '../../../utils/SyncOptimizer'
import { getLaggingAndSyncing } from '../../utils/getLaggingAndSyncing'

interface Dependencies {
  readonly amountRepository: AmountRepository
  readonly syncOptimizer: SyncOptimizer
  logger: Logger
}

export class AmountsDataService {
  constructor(private readonly $: Dependencies) {
    this.$.logger = $.logger.for(this)
  }

  async getAmounts(
    configurations: (AmountConfigEntry & { configId: string })[],
    minTimestamp: UnixTime,
    targetTimestamp: UnixTime,
  ) {
    const amounts = await this.$.amountRepository.getByConfigIdsInRange(
      configurations.map((c) => c.configId),
      minTimestamp,
      targetTimestamp,
    )

    const amountsByTimestamp = groupBy(amounts, 'timestamp')

    const { lagging, excluded } = getLaggingAndSyncing<AmountRecord>(
      configurations.map((c) => ({
        id: c.configId,
        minTimestamp: c.sinceTimestamp,
      })),
      amountsByTimestamp,
      (value: AmountRecord) => value.configId,
      targetTimestamp,
    )

    const result: Dictionary<bigint> = {}

    const timestamps = this.$.syncOptimizer.getAllTimestampsToSync()
    for (const timestamp of timestamps) {
      const amounts = (amountsByTimestamp[timestamp.toString()] ?? []).filter(
        (a) => !excluded.find((e) => e === a.configId),
      )

      const missing = configurations
        .map((a) => a.configId)
        .filter((a) => !amounts.map((f) => f.configId).includes(a))

      if (missing.length > 0) {
        for (const m of missing) {
          const l = lagging.find((l) => l.id === m)
          assert(l, 'Missing lagging value')

          amounts.push(l.latestValue)
        }
      }

      const amount = amounts.reduce((acc, curr) => acc + curr.amount, 0n)
      result[timestamp.toString()] = amount
    }

    return result
  }
}
