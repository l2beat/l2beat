import { ChainId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { BlockNumberRepository } from '../../peripherals/database/BlockNumberRepository'
import { BlocksController } from './BlocksController'

describe(BlocksController.name, () => {
  it('returns transformed blocks', async () => {
    const blockNumberRepository = mockObject<BlockNumberRepository>({
      async getAll() {
        return [
          {
            blockNumber: 123,
            timestamp: new UnixTime(1000),
            chainId: ChainId.ETHEREUM,
          },
          {
            blockNumber: 456,
            timestamp: new UnixTime(2000),
            chainId: ChainId.ETHEREUM,
          },
        ]
      },
    })
    const blocksController = new BlocksController(blockNumberRepository)
    expect(await blocksController.getAllBlocks()).toEqual([
      {
        blockNumber: '123',
        timestamp: '1970-01-01T00:16:40.000Z',
      },
      {
        blockNumber: '456',
        timestamp: '1970-01-01T00:33:20.000Z',
      },
    ])
  })
})
