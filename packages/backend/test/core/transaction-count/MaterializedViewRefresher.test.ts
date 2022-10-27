import { Logger, mock } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'
import { expect } from 'earljs'

import { Clock } from '../../../src/core/Clock'
import {
  MaterializedViewRefresher,
  MaterializedViewRefresherOpts,
} from '../../../src/core/transaction-count/MaterializedViewRefresher'
import { TransactionCounter } from '../../../src/core/transaction-count/TransactionCounter'
import { BlockTransactionCountRepository } from '../../../src/peripherals/database/BlockTransactionCountRepository'
import { ZksyncTransactionRepository } from '../../../src/peripherals/database/ZksyncTransactionRepository'

const projectA = ProjectId('a')
const projectB = ProjectId('b')
const projectC = ProjectId('c')
const projectD = ProjectId('d')
const startOfDay = UnixTime.fromDays(5)
const delayHours = 3
const lastHour = startOfDay.add(4, 'hours')
const expectedTip = startOfDay.add(-1, 'days')
const blockRepository = mock<BlockTransactionCountRepository>()
const zksyncRepository = mock<ZksyncTransactionRepository>()
const clock = mock<Clock>({
  getLastHour: () => lastHour,
})
const logger = Logger.SILENT

describe(MaterializedViewRefresher.name, () => {
  describe(MaterializedViewRefresher.prototype.checkIfFullySynced.name, () => {
    it('does not log error if fully synced', async () => {
      const opts = mock<MaterializedViewRefresherOpts>({
        logLaggingError: () => {},
      })
      const refresher = new MaterializedViewRefresher(
        blockRepository,
        zksyncRepository,
        [
          mock<TransactionCounter>({
            projectId: projectA,
            getDailyCounts: async () => [
              { count: 0, timestamp: startOfDay.add(-1, 'days') },
            ],
          }),
        ],
        [
          mock<TransactionCounter>({
            projectId: projectB,
            getDailyCounts: async () => [
              { count: 0, timestamp: startOfDay.add(-1, 'days') },
            ],
          }),
        ],
        clock,
        logger,
        delayHours,
        opts,
      )

      await refresher.checkIfFullySynced()

      expect(opts.logLaggingError).toHaveBeenCalledExactlyWith([])
    })

    it('logs error if some projects are not fully synced', async () => {
      const opts = mock<MaterializedViewRefresherOpts>({
        logLaggingError: () => {},
      })
      const refresher = new MaterializedViewRefresher(
        blockRepository,
        zksyncRepository,
        [
          mock<TransactionCounter>({
            projectId: projectA,
            getDailyCounts: async () => [
              { count: 0, timestamp: expectedTip.add(-1, 'days') },
            ],
          }),
          mock<TransactionCounter>({
            projectId: projectB,
            getDailyCounts: async () => [{ count: 0, timestamp: expectedTip }],
          }),
        ],
        [
          mock<TransactionCounter>({
            projectId: projectC,
            getDailyCounts: async () => [{ count: 0, timestamp: expectedTip }],
          }),
          mock<TransactionCounter>({
            projectId: projectD,
            getDailyCounts: async () => [
              { count: 0, timestamp: expectedTip.add(-3, 'days') },
            ],
          }),
        ],
        clock,
        logger,
        delayHours,
        opts,
      )

      await refresher.checkIfFullySynced()

      expect(opts.logLaggingError).toHaveBeenCalledExactlyWith([
        [
          [
            {
              projectId: projectA,
              timestamp: expectedTip.add(-1, 'days'),
            },
            {
              projectId: projectD,
              timestamp: expectedTip.add(-3, 'days'),
            },
          ],
          expectedTip,
        ],
      ])
    })
  })
})
