import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { Clock } from '../../../tools/Clock'
import { BlockTimestampProvider } from '../../tvl/services/BlockTimestampProvider'
import { BlockTargetIndexer } from './BlockTargetIndexer'

const LAST_HOUR = UnixTime.now().add(-1, 'hours')

describe(BlockTargetIndexer.name, () => {
  describe(BlockTargetIndexer.prototype.start.name, () => {
    it('calls clock.onNewHour', async () => {
      const clock = mockObject<Clock>({
        onNewHour: () => () => {},
        getLastHour: () => LAST_HOUR,
      })

      const indexer = new BlockTargetIndexer(
        Logger.SILENT,
        clock,
        mockBlockTimestampProvider(0),
      )

      await indexer.start()

      expect(clock.onNewHour).toHaveBeenCalled()
    })
  })

  describe(BlockTargetIndexer.prototype.tick.name, () => {
    it('returns block number', async () => {
      const clock = mockObject<Clock>({
        getLastHour: () => LAST_HOUR,
      })

      const BLOCK_NUMBER = 123
      const blockTimestampProvider = mockBlockTimestampProvider(BLOCK_NUMBER)
      const indexer = new BlockTargetIndexer(
        Logger.SILENT,
        clock,
        blockTimestampProvider,
      )

      const result = await indexer.tick()

      expect(result).toEqual(BLOCK_NUMBER)
      expect(
        blockTimestampProvider.getBlockNumberAtOrBefore,
      ).toHaveBeenNthCalledWith(1, new UnixTime(LAST_HOUR.toNumber()))
    })
  })
})

function mockBlockTimestampProvider(blockNumber: number) {
  return mockObject<BlockTimestampProvider>({
    getBlockNumberAtOrBefore: mockFn().resolvesTo(blockNumber),
  })
}
