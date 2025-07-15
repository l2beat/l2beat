import { type Block, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn } from 'earl'
import type { CountedBlock } from '@/types'
import { StarknetCounter } from './StarknetCounter'

describe(StarknetCounter.name, () => {
  describe(StarknetCounter.prototype.countForBlock.name, () => {
    it('should return block with counted operations', () => {
      const mockBlock: Block = createBlock(1)

      const expectedResult: CountedBlock = {
        ...mockBlock,
        transactions: [
          {
            hash: 'tx1.hash',
            from: 'tx1.from',
            operationsCount: 1,
            type: 'INVOKE',
          },
          {
            hash: 'tx2.hash',
            from: 'tx2.from',
            operationsCount: 2,
            type: 'INVOKE',
          },
        ],
      }

      const counter = new StarknetCounter()

      counter.getOperationsCount = mockFn()
        .returnsOnce(expectedResult.transactions[0].operationsCount)
        .returnsOnce(expectedResult.transactions[1].operationsCount)

      const result = counter.countForBlock(mockBlock)
      expect(result).toEqual(expectedResult)
    })
  })

  describe(StarknetCounter.prototype.countForBlocks.name, () => {
    it('should return correct stats', () => {
      const end = UnixTime.now()
      const start = end - 1 * UnixTime.HOUR
      const mockBlocks: Block[] = [
        createBlock(1, start),
        createBlock(2),
        createBlock(3, end),
      ]
      const counter = new StarknetCounter()

      counter.getOperationsCount = mockFn()
        .returnsOnce(1)
        .returnsOnce(2)
        .returnsOnce(2)
        .returnsOnce(3)
        .returnsOnce(3)
        .returnsOnce(4)

      const result = counter.countForBlocks(mockBlocks)
      expect(result).toEqual({
        dateStart: UnixTime.toDate(start),
        dateEnd: UnixTime.toDate(end),
        numberOfTransactions: 6,
        numberOfOperations: 15,
        topBlocks: [
          {
            number: 3,
            ratio: 3.5,
          },
          {
            number: 2,
            ratio: 2.5,
          },
          {
            number: 1,
            ratio: 1.5,
          },
        ],
      })
    })
  })

  describe(StarknetCounter.prototype.getOperationsCount.name, () => {
    it('should properly count user operations for block number lower than 3000', () => {
      const counter = new StarknetCounter()
      const tx = {
        hash: 'tx.hash',
        data: ['8'],
        type: 'INVOKE',
        to: '0x123',
        from: '0x456',
      }
      const blockNumber = 2999
      const result = counter.getOperationsCount(tx, blockNumber)
      expect(result).toEqual(1)
    })

    it('should properly count user operations for type INVOKE', () => {
      const counter = new StarknetCounter()
      const tx = {
        hash: 'tx.hash',
        data: ['0x3'],
        type: 'INVOKE',
        to: '0x123',
        from: '0x456',
      }
      const blockNumber = 3001
      const result = counter.getOperationsCount(tx, blockNumber)
      expect(result).toEqual(3)
    })

    it('should properly count user operations for types other than INVOKE', () => {
      const counter = new StarknetCounter()
      const tx = {
        hash: 'tx.hash',
        data: ['8'],
        type: 'DECLARE',
        to: '0x123',
        from: '0x456',
      }
      const blockNumber = 3001
      const result = counter.getOperationsCount(tx, blockNumber)
      expect(result).toEqual(1)
    })

    it('should properly count user operations when data is missing', () => {
      const counter = new StarknetCounter()
      const tx = {
        hash: 'tx.hash',
        data: [],
        type: 'INVOKE',
        to: '0x123',
        from: '0x456',
      }
      const blockNumber = 3001
      const result = counter.getOperationsCount(tx, blockNumber)
      expect(result).toEqual(1)
    })
  })
})

function createBlock(number: number, timestamp?: UnixTime): Block {
  return {
    number,
    timestamp: timestamp ?? UnixTime.now(),
    hash: `${number}.hash`,
    transactions: [
      {
        type: 'INVOKE',
        hash: 'tx1.hash',
        data: ['tx1.data'],
        to: 'tx1.to',
        from: 'tx1.from',
      },
      {
        type: 'INVOKE',
        hash: 'tx2.hash',
        data: ['tx2.data'],
        to: 'tx2.to',
        from: 'tx2.from',
      },
    ],
  }
}
