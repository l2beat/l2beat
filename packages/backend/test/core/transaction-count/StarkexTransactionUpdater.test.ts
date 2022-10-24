import { Logger, mock } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'
import { expect } from 'earljs'
import waitForExpect from 'wait-for-expect'

import { Clock } from '../../../src/core/Clock'
import { StarkexTransactionUpdater } from '../../../src/core/transaction-count/StarkexTransactionUpdater'
import { StarkexTransactionCountRepository } from '../../../src/peripherals/database/StarkexTransactionCountRepository'
import { StarkexClient } from '../../../src/peripherals/starkex'

describe(StarkexTransactionUpdater.name, () => {
  describe(StarkexTransactionUpdater.prototype.start.name, () => {
    it('skips known blocks', async () => {
      const starkexTransactionCountRepository =
        mock<StarkexTransactionCountRepository>({
          getGapsByProject: async () => [
            [2, 2],
            [5, 6],
          ],
          add: async () => '',
        })
      const starkexClient = mock<StarkexClient>({
        getDailyCount: async () => 1,
      })
      const clock = mock<Clock>({
        onNewHour: (callback) => {
          callback(UnixTime.now())
          return () => {}
        },
        getLastHour: () => UnixTime.fromDays(7),
      })
      const updater = new StarkexTransactionUpdater(
        starkexTransactionCountRepository,
        starkexClient,
        clock,
        Logger.SILENT,
        'dydx',
        ProjectId('dydx'),
        new UnixTime(0),
        { apiDelayHours: 6 },
      )
      updater.start()

      await waitForExpect(() => {
        expect(starkexClient.getDailyCount).toHaveBeenCalledExactlyWith([
          [2, 'dydx'],
          [5, 'dydx'],
          [6, 'dydx'],
        ])
        expect(
          starkexTransactionCountRepository.getGapsByProject,
        ).toHaveBeenCalledExactlyWith([[ProjectId('dydx'), 0, 6]])
      })
    })
  })

  describe(StarkexTransactionUpdater.prototype.updateDay.name, () => {
    it('queries a day and adds to a DB', async () => {
      const starkexTransactionCountRepository =
        mock<StarkexTransactionCountRepository>({
          add: async () => '',
        })
      const starkexClient = mock<StarkexClient>({
        getDailyCount: async () => 1,
      })
      const clock = mock<Clock>()

      const updater = new StarkexTransactionUpdater(
        starkexTransactionCountRepository,
        starkexClient,
        clock,
        Logger.SILENT,
        'dydx',
        ProjectId('dydx'),
        new UnixTime(0),
      )
      await updater.updateDay(10)

      await waitForExpect(() => {
        expect(
          starkexTransactionCountRepository.add,
        ).toHaveBeenCalledExactlyWith([
          [
            {
              projectId: ProjectId('dydx'),
              timestamp: UnixTime.fromDays(10),
              count: 1,
            },
          ],
        ])
      })
    })
  })
})
