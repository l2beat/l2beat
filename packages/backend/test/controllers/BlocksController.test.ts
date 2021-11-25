import { expect } from 'chai'

import { BlocksController } from '../../src/controllers/BlocksController'
import { UnixTime } from '../../src/model'
import { BlockNumberRepository } from '../../src/peripherals/database/BlockNumberRepository'
import { mock } from '../mock'

describe('BlocksController', () => {
  it('returns transformed blocks', async () => {
    const blockNumberRepository = mock<BlockNumberRepository>({
      async getAll() {
        return [
          { blockNumber: 123n, timestamp: new UnixTime(1000) },
          { blockNumber: 456n, timestamp: new UnixTime(2000) },
        ]
      },
    })
    const blocksController = new BlocksController(blockNumberRepository)
    expect(await blocksController.getAllBlocks()).to.deep.equal([
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
