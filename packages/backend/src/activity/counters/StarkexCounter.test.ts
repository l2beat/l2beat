import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { install } from '@sinonjs/fake-timers'
import { expect, mockObject } from 'earl'
import { Knex } from 'knex'
import waitForExpect from 'wait-for-expect'

import { StarkexClient } from '../../peripherals/starkex'
import { Clock } from '../../tools/Clock'
import { SequenceProcessorRepository } from '../repositories/SequenceProcessorRepository'
import { StarkexTransactionCountRepository } from '../repositories/StarkexCountRepository'
import { StarkexCounter } from './StarkexCounter'

describe(StarkexCounter.name, () => {
  it('iterates over products', async () => {
    const project = ProjectId('starkex_project')
    const starkexRepository = mockObject<StarkexTransactionCountRepository>({
      addOrUpdateMany: async () => -1,
    })
    const txCount = 1
    const starkexClient = mockObject<StarkexClient>({
      getDailyCount: async () => txCount,
    })
    const transaction = mockObject<Knex.Transaction>({})
    const sequenceProcessorRepository = mockObject<SequenceProcessorRepository>(
      {
        findById: async () => undefined,
        addOrUpdate: async () => '',
        runInTransaction: async (
          fun: (trx: Knex.Transaction) => Promise<void>,
        ) => {
          await fun(transaction)
        },
      },
    )

    const DAY = UnixTime.fromDate(new Date('2022-05-30'))
    const clock = mockObject<Clock>({
      getLastHour: () => DAY,
    })
    const product = ['apex_usdt', 'apex_usdc']

    const counter = new StarkexCounter(
      project,
      product,
      sequenceProcessorRepository,
      starkexRepository,
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
      expect(starkexRepository.addOrUpdateMany).toHaveBeenCalledTimes(1)
      expect(starkexRepository.addOrUpdateMany).toHaveBeenNthCalledWith(
        1,
        [
          {
            count: txCount * 2,
            timestamp: DAY,
            projectId: project,
          },
        ],
        transaction,
      )
    })
  })
})
