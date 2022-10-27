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
          mockCounter({
            projectId: projectA,
            tip: expectedTip,
          }),
          mockCounter({
            projectId: projectC,
            tip: expectedTip,
          }),
        ],
        [
          mockCounter({
            projectId: projectB,
            tip: expectedTip,
          }),
          mockCounter({
            projectId: projectD,
            tip: expectedTip,
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
          mockCounter({
            projectId: projectA,
            tip: expectedTip.add(-1, 'days'),
          }),
          mockCounter({
            projectId: projectB,
            tip: expectedTip,
          }),
        ],
        [
          mockCounter({
            projectId: projectC,
            tip: expectedTip,
          }),
          mockCounter({
            projectId: projectD,
            tip: expectedTip.add(-3, 'days'),
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

function mockCounter({
  projectId,
  tip,
}: {
  projectId: ProjectId
  tip: UnixTime
}) {
  return mock<TransactionCounter>({
    projectId,
    getDailyCounts: async () => [{ count: 0, timestamp: tip }],
  })
}
