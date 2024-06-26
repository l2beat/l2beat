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
    amountConfigs: (AmountConfigEntry & { configId: string })[],
    minTimestamp: UnixTime,
    targetTimestamp: UnixTime,
  ) {
    const amounts = await this.$.amountRepository.getByConfigIdsInRange(
      amountConfigs.map((c) => c.configId),
      minTimestamp,
      targetTimestamp,
    )

    const amountsByTimestamp = groupBy(amounts, 'timestamp')

    const { lagging, excluded } = getLaggingAndSyncing<AmountRecord>(
      amountConfigs.map((a) => ({
        id: a.configId,
        minTimestamp: a.sinceTimestamp,
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

      const missing = amountConfigs
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
