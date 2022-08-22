import {
  EthereumAddress,
  Logger,
  mock,
  ProjectId,
  UnixTime,
} from '@l2beat/common'
import { expect } from 'earljs'
import { providers } from 'ethers'

import { Clock } from '../../../src/core/Clock'
import { EventUpdater } from '../../../src/core/events/EventUpdater'
import { EventRepository } from '../../../src/peripherals/database/EventRepository'
import { EthereumClient } from '../../../src/peripherals/ethereum/EthereumClient'
import { setupDatabaseTestSuite } from '../../peripherals/database/shared/setup'

const START = UnixTime.fromDate(new Date('2022-08-09T00:00:00Z'))

describe(EventUpdater.name, () => {
  describe(EventUpdater.prototype.getAllLogs.name, () => {
    it('two calls', async () => {
      const fromBlock = 1000
      const toBlock = 2000

      const ethereum = mock<EthereumClient>({
        getLogs: async (
          address: EthereumAddress,
          topics: string[],
          from: number,
          to: number,
        ): Promise<providers.Log[]> => {
          if (fromBlock === from && toBlock === to) {
            throw new Error('Log response size exceeded')
          }
          return [1n]
        },
      })

      const { database } = setupDatabaseTestSuite()
      const eventsRepository = new EventRepository(database, Logger.SILENT)

      const blockNumberUpdater = mock<BlockNumberUpdater>({})

      const eventUpdater = new EventUpdater(
        ethereum,
        blockNumberUpdater,
        eventsRepository,
        mock<Clock>(),
        [],
        Logger.SILENT,
      )
      const result = await eventUpdater.getAllLogs(
        EthereumAddress.random(),
        'aaaa',
        fromBlock,
        toBlock,
      )
      expect(result).toEqual([1n, 1n])
    })
  })
})
