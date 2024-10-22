import { UnixTime } from '@l2beat/shared-pure'
import { StarknetCounter } from './StarknetCounter'
import { Block } from '@l2beat/shared'
import { CountedBlock } from '@/types'
import { expect, mockFn } from 'earl'

describe(StarknetCounter.name, () => {
  describe(StarknetCounter.prototype.countForBlock.name, () => {
    it('should return block with counted operations', () => {
      const mockBlock: Block = createBlock(1)

      const expectedResult: CountedBlock = {
        ...mockBlock,
        transactions: [
          {
            hash: 'tx1.hash',
            operationsCount: 1,
            type: 'INVOKE',
          },
          {
            hash: 'tx2.hash',
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
      //   const end = UnixTime.now()
      //   const start = end.add(-1, 'hours')
      //   const mockBlocks: EVMBlock[] = [
      //     createBlock(1, start),
      //     createBlock(2),
      //     createBlock(3, end),
      //   ]
      //   const counter = new RpcCounter()
      //   const mockSmartAccountUsageForBlock1 = new Map([
      //     ['execute(address,uint256,bytes)', 2],
      //   ])
      //   const mockSmartAccountUsageForBlock2 = new Map([
      //     ['execute(address,uint256,bytes)', 1],
      //     ['executeBatch(address[],bytes[])', 1],
      //   ])
      //   const mockSmartAccountUsageForBlock3 = new Map([
      //     ['execute(address,uint256,bytes)', 1],
      //     ['unknown', 1],
      //   ])
      //   counter.generateSmartAccountUsageForBlock = mockFn()
      //     .returnsOnce(mockSmartAccountUsageForBlock1)
      //     .returnsOnce(mockSmartAccountUsageForBlock2)
      //     .returnsOnce(mockSmartAccountUsageForBlock3)
      //   counter.mapTransaction = mockFn()
      //     .returnsOnce(createCountedTransaction(2, false))
      //     .returnsOnce(createCountedTransaction(1, false))
      //     .returnsOnce(createCountedTransaction(3, true))
      //     .returnsOnce(createCountedTransaction(3, false))
      //     .returnsOnce(createCountedTransaction(1, true))
      //     .returnsOnce(createCountedTransaction(1, false))
      //   const result = counter.countForBlocks(mockBlocks)
      //   expect(result).toEqual({
      //     dateStart: start.toDate(),
      //     dateEnd: end.toDate(),
      //     numberOfTransactions: 6,
      //     numberOfOperations: 11,
      //     topBlocks: [
      //       {
      //         number: 3,
      //         ratio: 1,
      //         includesBatch: true,
      //         includesUnknown: true,
      //       },
      //       {
      //         number: 2,
      //         ratio: 3,
      //         includesBatch: true,
      //         includesUnknown: false,
      //       },
      //       {
      //         number: 1,
      //         ratio: 1.5,
      //         includesBatch: false,
      //         includesUnknown: false,
      //       },
      //     ],
      //     smartAccountUsage: [
      //       { signature: 'execute(address,uint256,bytes)', count: 4 },
      //       { signature: 'executeBatch(address[],bytes[])', count: 1 },
      //       { signature: 'unknown', count: 1 },
      //     ],
      //   })
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
    timestamp: timestamp?.toNumber() ?? UnixTime.now().toNumber(),
    hash: `${number}.hash`,
    transactions: [
      {
        type: 'INVOKE',
        hash: 'tx1.hash',
        data: ['tx1.data'],
      },
      {
        type: 'INVOKE',
        hash: 'tx2.hash',
        data: ['tx2.data'],
      },
    ],
  }
}
