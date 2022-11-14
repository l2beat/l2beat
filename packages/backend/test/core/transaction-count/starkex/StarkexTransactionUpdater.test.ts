import { Logger, mock } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'
import { expect } from 'earljs'
import waitForExpect from 'wait-for-expect'

import { Clock } from '../../../../src/core/Clock'
import { StarkexTransactionUpdater } from '../../../../src/core/transaction-count/starkex/StarkexTransactionUpdater'
import { StarkexTransactionCountRepository } from '../../../../src/peripherals/database/StarkexTransactionCountRepository'
import { StarkexClient } from '../../../../src/peripherals/starkex'

describe(StarkexTransactionUpdater.name, () => {
  describe(StarkexTransactionUpdater.prototype.start.name, () => {
    it('skips known blocks', async () => {
      const firstDay = UnixTime.fromDays(0)
      const lastDay = UnixTime.fromDays(7)
      const apiDelayHours = 6
      const lastHour = lastDay.add(apiDelayHours, 'hours')
      const starkexTransactionCountRepository =
        mock<StarkexTransactionCountRepository>({
          getGapsByProject: async () => [
            [2, 2],
            [4, 6],
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
        getLastHour: () => lastHour,
      })
      const updater = new StarkexTransactionUpdater(
        starkexTransactionCountRepository,
        starkexClient,
        clock,
        Logger.SILENT,
        'dydx',
        ProjectId('dydx'),
        firstDay,
        { apiDelayHours },
      )
      updater.start()

      await waitForExpect(() => {
        expect(starkexClient.getDailyCount).toHaveBeenCalledExactlyWith([
          [2, 'dydx'],
          [4, 'dydx'],
          [5, 'dydx'],
          [6, 'dydx'],
        ])
        expect(
          starkexTransactionCountRepository.getGapsByProject,
        ).toHaveBeenCalledExactlyWith([
          [ProjectId('dydx'), 0, lastDay.toDays() - 1],
        ])
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
