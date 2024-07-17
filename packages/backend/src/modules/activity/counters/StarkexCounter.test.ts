import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { install } from '@sinonjs/fake-timers'
import { expect, mockObject } from 'earl'
import waitForExpect from 'wait-for-expect'

import { Database, Transaction } from '@l2beat/database'
import { StarkexClient } from '../../../peripherals/starkex/StarkexClient'
import { Clock } from '../../../tools/Clock'
import { StarkexCounter } from './StarkexCounter'

describe(StarkexCounter.name, () => {
  it('iterates over products', async () => {
    const project = ProjectId('starkex_project')
    const txCount = 1
    const starkexClient = mockObject<StarkexClient>({
      getDailyCount: async () => txCount,
    })
    const starkExTransactionCount = mockObject<
      Database['starkExTransactionCount']
    >({
      addOrUpdateMany: async () => -1,
    })
    const db = mockObject<Database>({
      transaction: (cb) => cb(undefined as unknown as Transaction),
      starkExTransactionCount,
      sequenceProcessor: mockObject<Database['sequenceProcessor']>({
        findById: async () => null,
        addOrUpdate: async () => '',
      }),
    })

    const DAY = UnixTime.fromDate(new Date('2022-05-30'))
    const clock = mockObject<Clock>({
      getLastHour: () => DAY,
    })
    const product = ['apex_usdt', 'apex_usdc']

    const counter = new StarkexCounter(
      project,
      product,
      db,
      starkexClient,
      clock,
      Logger.SILENT,
      1, // irrelevant for this test
      DAY,
      1, // irrelevant for this test
    )

    // start the counter and wait for it to finish
    const time = install()
    await counter.start()
    await time.tickAsync(1)
    time.uninstall()

    // expect to call API twice and sum the results
    await waitForExpect(() => {
      expect(starkexClient.getDailyCount).toHaveBeenCalledTimes(2)
      expect(starkexClient.getDailyCount).toHaveBeenNthCalledWith(
        1,
        DAY.toDays(),
        product[0],
      )
      expect(starkexClient.getDailyCount).toHaveBeenNthCalledWith(
        2,
        DAY.toDays(),
        product[1],
      )
      expect(starkExTransactionCount.addOrUpdateMany).toHaveBeenCalledTimes(1)
      expect(starkExTransactionCount.addOrUpdateMany).toHaveBeenNthCalledWith(
        1,
        [
          {
            count: txCount * 2,
            timestamp: DAY,
            projectId: project,
          },
        ],
        undefined,
      )
    })
  })
})
