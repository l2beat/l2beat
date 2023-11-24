import { Logger } from '@l2beat/backend-tools'
import { StarkexProduct } from '@l2beat/config'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { install } from '@sinonjs/fake-timers'
import { expect, mockObject } from 'earl'
import { Knex } from 'knex'
import waitForExpect from 'wait-for-expect'

import { StarkexTransactionCountRepository } from '../../../peripherals/database/activity/StarkexCountRepository'
import { SequenceProcessorRepository } from '../../../peripherals/database/SequenceProcessorRepository'
import { StarkexClient } from '../../../peripherals/starkex'
import { Clock } from '../../Clock'
import {
  createStarkexCounter,
  getStarkexLastDay,
  StarkexProcessorOptions,
} from './StarkexCounter'

describe(getStarkexLastDay.name, () => {
  it('returns current day', () => {
    const now = UnixTime.fromDate(new Date('2021-09-07T03:00:00Z'))

    expect(getStarkexLastDay(now)).toEqual(
      UnixTime.fromDate(new Date('2021-09-07T00:00:00Z')).toDays(),
    )
  })

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
    const product: StarkexProduct[] = ['apex_usdt', 'apex_usdc']
    const options: StarkexProcessorOptions = {
      type: 'starkex',
      product,
      sinceTimestamp: DAY,
      resyncLastDays: 1, // irrelevant for this test
      singleStarkexCPM: 60, // irrelevant for this test
    }

    const counter = createStarkexCounter(
      project,
      starkexRepository,
      starkexClient,
      sequenceProcessorRepository,
      Logger.SILENT,
      clock,
      options,
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
