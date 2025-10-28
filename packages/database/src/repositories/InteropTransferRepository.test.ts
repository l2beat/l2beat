import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type InteropTransferRecord,
  InteropTransferRepository,
} from './InteropTransferRepository'

describeDatabase(InteropTransferRepository.name, (db) => {
  const repository = db.interopTransfer

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(InteropTransferRepository.prototype.insertMany.name, () => {
    it('adds new rows', async () => {
      const records = [
        transfer('plugin1', 'msg1', 'type1', UnixTime(100), 'a', 'b', 1),
        transfer('plugin2', 'msg2', 'type2', UnixTime(200), 'b', 'a', 2),
      ]

      const inserted = await repository.insertMany(records)
      expect(inserted).toEqual(2)

      const result = await repository.getAll()
      expect(result).toEqualUnsorted(records)
    })

    it('handles empty array', async () => {
      const inserted = await repository.insertMany([])
      expect(inserted).toEqual(0)
    })

    it('performs batch insert when more than 1000 records', async () => {
      const records = []
      for (let i = 0; i < 1500; i++) {
        records.push(transfer('plugin', `msg${i}`, 'deposit', UnixTime(i)))
      }

      const inserted = await repository.insertMany(records)
      expect(inserted).toEqual(1500)
    })

    it('handles records with undefined optional fields', async () => {
      const record = {
        plugin: 'test-plugin',
        messageId: 'test-message',
        type: 'deposit',
        duration: undefined,
        timestamp: UnixTime(100),
        srcTime: undefined,
        srcChain: undefined,
        srcTxHash: undefined,
        srcLogIndex: undefined,
        srcEventId: undefined,
        srcTokenAddress: undefined,
        srcRawAmount: undefined,
        srcSymbol: undefined,
        srcAbstractTokenId: undefined,
        srcAmount: undefined,
        srcPrice: undefined,
        srcValueUsd: undefined,
        dstTime: undefined,
        dstChain: undefined,
        dstTxHash: undefined,
        dstLogIndex: undefined,
        dstEventId: undefined,
        dstTokenAddress: undefined,
        dstRawAmount: undefined,
        dstSymbol: undefined,
        dstAbstractTokenId: undefined,
        dstAmount: undefined,
        dstPrice: undefined,
        dstValueUsd: undefined,
        isProcessed: false,
      }

      const inserted = await repository.insertMany([record])
      expect(inserted).toEqual(1)

      const result = await repository.getAll()
      expect(result).toEqual([record])
    })

    it('handles records with ethereum token addresses', async () => {
      const record = transfer(
        'plugin1',
        'msg1',
        'deposit',
        UnixTime(100),
        'ethereum',
        'arbitrum',
        5000,
      )
      record.srcTokenAddress = EthereumAddress.random()
      record.dstTokenAddress = EthereumAddress.random()

      const inserted = await repository.insertMany([record])
      expect(inserted).toEqual(1)

      const result = await repository.getAll()
      expect(result[0]?.srcTokenAddress).toEqual(record.srcTokenAddress)
      expect(result[0]?.dstTokenAddress).toEqual(record.dstTokenAddress)
    })
  })

  describe(InteropTransferRepository.prototype.getByType.name, () => {
    beforeEach(async () => {
      await repository.insertMany([
        transfer(
          'plugin1',
          'msg1',
          'deposit',
          UnixTime(100),
          'ethereum',
          'arbitrum',
          5000,
        ),
        transfer(
          'plugin1',
          'msg2',
          'deposit',
          UnixTime(200),
          'ethereum',
          'optimism',
          6000,
        ),
        transfer(
          'plugin2',
          'msg3',
          'withdraw',
          UnixTime(150),
          'arbitrum',
          'ethereum',
          7000,
        ),
        transfer(
          'plugin2',
          'msg4',
          'deposit',
          UnixTime(300),
          'polygon',
          'ethereum',
          8000,
        ),
      ])
    })

    it('returns transfers for a specific type', async () => {
      const result = await repository.getByType('deposit')

      expect(result).toHaveLength(3)
      expect(result.map((r) => r.messageId)).toEqualUnsorted([
        'msg1',
        'msg2',
        'msg4',
      ])
    })

    it('returns transfers ordered by timestamp descending', async () => {
      const result = await repository.getByType('deposit')

      expect(result.map((r) => r.timestamp)).toEqual([300, 200, 100])
    })

    it('filters by source chain when provided', async () => {
      const result = await repository.getByType('deposit', {
        srcChain: 'ethereum',
      })

      expect(result).toHaveLength(2)
      expect(result.map((r) => r.messageId)).toEqualUnsorted(['msg1', 'msg2'])
    })

    it('filters by destination chain when provided', async () => {
      const result = await repository.getByType('deposit', {
        dstChain: 'ethereum',
      })

      expect(result).toHaveLength(1)
      expect(result[0]?.messageId).toEqual('msg4')
    })

    it('filters by both source and destination chain when provided', async () => {
      const result = await repository.getByType('deposit', {
        srcChain: 'ethereum',
        dstChain: 'arbitrum',
      })

      expect(result).toHaveLength(1)
      expect(result[0]?.messageId).toEqual('msg1')
    })

    it('returns empty array when no transfers match type', async () => {
      const result = await repository.getByType('nonexistent')

      expect(result).toEqual([])
    })

    it('returns empty array when no transfers match chain filters', async () => {
      const result = await repository.getByType('deposit', {
        srcChain: 'nonexistent',
      })

      expect(result).toEqual([])
    })
  })

  describe(InteropTransferRepository.prototype.deleteBefore.name, () => {
    it('deletes transfers before specified timestamp', async () => {
      await repository.insertMany([
        transfer('plugin1', 'msg1', 'deposit', UnixTime(100)),
        transfer('plugin1', 'msg2', 'deposit', UnixTime(200)),
        transfer('plugin1', 'msg3', 'withdraw', UnixTime(300)),
        transfer('plugin1', 'msg4', 'deposit', UnixTime(400)),
      ])

      const deleted = await repository.deleteBefore(UnixTime(250))

      expect(deleted).toEqual(2)

      const remaining = await repository.getAll()
      expect(remaining).toHaveLength(2)
      expect(remaining.map((r) => r.messageId)).toEqualUnsorted([
        'msg3',
        'msg4',
      ])
    })
  })

  describe(InteropTransferRepository.prototype.getUnprocessed.name, () => {
    it('returns only unprocessed transfers', async () => {
      const unprocessedRecord1 = transfer(
        'plugin1',
        'msg1',
        'deposit',
        UnixTime(100),
      )
      const unprocessedRecord2 = transfer(
        'plugin1',
        'msg2',
        'withdraw',
        UnixTime(200),
      )
      const processedRecord = transfer(
        'plugin2',
        'msg3',
        'deposit',
        UnixTime(300),
      )
      processedRecord.isProcessed = true

      await repository.insertMany([
        unprocessedRecord1,
        unprocessedRecord2,
        processedRecord,
      ])

      const result = await repository.getUnprocessed()

      expect(result).toHaveLength(2)
      expect(result.map((r) => r.messageId)).toEqualUnsorted(['msg1', 'msg2'])
      expect(result.every((r) => r.isProcessed === false)).toEqual(true)
    })

    it('returns empty array when no unprocessed transfers exist', async () => {
      const processedRecord1 = transfer(
        'plugin1',
        'msg1',
        'deposit',
        UnixTime(100),
      )
      const processedRecord2 = transfer(
        'plugin1',
        'msg2',
        'withdraw',
        UnixTime(200),
      )
      processedRecord1.isProcessed = true
      processedRecord2.isProcessed = true

      await repository.insertMany([processedRecord1, processedRecord2])

      const result = await repository.getUnprocessed()

      expect(result).toEqual([])
    })

    it('returns empty array when no transfers exist', async () => {
      const result = await repository.getUnprocessed()

      expect(result).toEqual([])
    })
  })

  describe(InteropTransferRepository.prototype.updateFinancials.name, () => {
    it('updates financial data and marks transfer as processed', async () => {
      const record = transfer('plugin1', 'msg1', 'deposit', UnixTime(100))
      record.srcAbstractTokenId = undefined
      record.srcPrice = undefined
      record.srcAmount = undefined
      record.srcValueUsd = undefined
      record.dstAbstractTokenId = undefined
      record.dstPrice = undefined
      record.dstAmount = undefined
      record.dstValueUsd = undefined

      await repository.insertMany([record])

      const update = {
        srcAbstractTokenId: 'ethereum',
        srcPrice: 2000.0,
        srcAmount: 1.5,
        srcValueUsd: 3000.0,
        dstAbstractTokenId: 'arbitrum-one',
        dstPrice: 1999.0,
        dstAmount: 1.4,
        dstValueUsd: 2798.6,
      }

      await repository.updateFinancials('msg1', update)

      const result = await repository.getAll()
      expect(result).toHaveLength(1)

      const updatedRecord = result[0]
      expect(updatedRecord?.srcAbstractTokenId).toEqual('ethereum')
      expect(updatedRecord?.srcPrice).toEqual(2000.0)
      expect(updatedRecord?.srcAmount).toEqual(1.5)
      expect(updatedRecord?.srcValueUsd).toEqual(3000.0)
      expect(updatedRecord?.dstAbstractTokenId).toEqual('arbitrum-one')
      expect(updatedRecord?.dstPrice).toEqual(1999.0)
      expect(updatedRecord?.dstAmount).toEqual(1.4)
      expect(updatedRecord?.dstValueUsd).toEqual(2798.6)
      expect(updatedRecord?.isProcessed).toEqual(true)
    })

    it('updates only provided fields', async () => {
      const record = transfer('plugin1', 'msg1', 'deposit', UnixTime(100))
      record.srcAbstractTokenId = 'original-src'
      record.srcPrice = 1000.0
      record.dstAbstractTokenId = 'original-dst'
      record.dstPrice = 1001.0

      await repository.insertMany([record])

      const partialUpdate = {
        srcPrice: 2000.0,
        dstAmount: 1.5,
      }

      await repository.updateFinancials('msg1', partialUpdate)

      const result = await repository.getAll()
      const updatedRecord = result[0]

      expect(updatedRecord?.srcAbstractTokenId).toEqual('original-src')
      expect(updatedRecord?.srcPrice).toEqual(2000.0)
      expect(updatedRecord?.dstAbstractTokenId).toEqual('original-dst')
      expect(updatedRecord?.dstPrice).toEqual(1001.0)
      expect(updatedRecord?.dstAmount).toEqual(1.5)
      expect(updatedRecord?.isProcessed).toEqual(true)
    })

    it('does not affect other transfers', async () => {
      const records = [
        transfer('plugin1', 'msg1', 'deposit', UnixTime(100)),
        transfer('plugin1', 'msg2', 'withdraw', UnixTime(200)),
        transfer('plugin1', 'msg3', 'deposit', UnixTime(300)),
      ]

      await repository.insertMany(records)

      const update = {
        srcPrice: 3000.0,
        srcAmount: 2.0,
      }

      await repository.updateFinancials('msg2', update)

      const result = await repository.getAll()
      const msg1Record = result.find((r) => r.messageId === 'msg1')
      const msg2Record = result.find((r) => r.messageId === 'msg2')
      const msg3Record = result.find((r) => r.messageId === 'msg3')

      expect(msg1Record?.isProcessed).toEqual(false)
      expect(msg1Record?.srcPrice).not.toEqual(3000.0)

      expect(msg2Record?.isProcessed).toEqual(true)
      expect(msg2Record?.srcPrice).toEqual(3000.0)
      expect(msg2Record?.srcAmount).toEqual(2.0)

      expect(msg3Record?.isProcessed).toEqual(false)
      expect(msg3Record?.srcPrice).not.toEqual(3000.0)
    })

    it('handles non-existent message ID gracefully', async () => {
      const record = transfer('plugin1', 'msg1', 'deposit', UnixTime(100))
      await repository.insertMany([record])

      const update = {
        srcPrice: 2000.0,
      }

      await repository.updateFinancials('nonexistent-msg', update)

      const result = await repository.getAll()
      expect(result).toHaveLength(1)
      expect(result[0]?.isProcessed).toEqual(false)
      expect(result[0]?.srcPrice).not.toEqual(2000.0)
    })

    it('updates with empty update object', async () => {
      const record = transfer('plugin1', 'msg1', 'deposit', UnixTime(100))
      await repository.insertMany([record])

      await repository.updateFinancials('msg1', {})

      const result = await repository.getAll()
      const updatedRecord = result[0]

      expect(updatedRecord?.isProcessed).toEqual(true)
      // All other fields should remain unchanged
      expect(updatedRecord?.messageId).toEqual('msg1')
      expect(updatedRecord?.plugin).toEqual('plugin1')
      expect(updatedRecord?.type).toEqual('deposit')
    })

    it('updates multiple financial fields at once', async () => {
      const record = transfer('plugin1', 'msg1', 'deposit', UnixTime(100))
      await repository.insertMany([record])

      const comprehensiveUpdate = {
        srcAbstractTokenId: 'ethereum',
        srcPrice: 2500.0,
        srcAmount: 0.8,
        srcValueUsd: 2000.0,
        dstAbstractTokenId: 'polygon',
        dstPrice: 2480.0,
        dstAmount: 0.79,
        dstValueUsd: 1959.2,
      }

      await repository.updateFinancials('msg1', comprehensiveUpdate)

      const result = await repository.getAll()
      const updatedRecord = result[0]

      Object.entries(comprehensiveUpdate).forEach(([key, value]) => {
        expect(updatedRecord?.[key as keyof typeof updatedRecord]).toEqual(
          value,
        )
      })
      expect(updatedRecord?.isProcessed).toEqual(true)
    })
  })

  afterEach(async () => {
    await repository.deleteAll()
  })
})

function transfer(
  plugin: string,
  messageId: string,
  type: string,
  timestamp: UnixTime,
  srcChain?: string,
  dstChain?: string,
  duration?: number,
): InteropTransferRecord {
  return {
    plugin,
    messageId,
    type,
    duration,
    timestamp,
    srcTime: srcChain ? timestamp : undefined,
    srcChain,
    srcTxHash: srcChain ? `0x${messageId}src` : undefined,
    srcLogIndex: srcChain ? 1 : undefined,
    srcEventId: srcChain ? `${messageId}-src-event` : undefined,
    srcTokenAddress: srcChain ? EthereumAddress.random() : undefined,
    srcRawAmount: srcChain ? 1000000000000000000n : undefined,
    srcSymbol: undefined,
    srcAbstractTokenId: srcChain ? 'ethereum' : undefined,
    srcAmount: srcChain ? 1.0 : undefined,
    srcPrice: srcChain ? 2000.0 : undefined,
    srcValueUsd: srcChain ? 2000.0 : undefined,
    dstTime: dstChain ? timestamp + (duration ?? 0) : undefined,
    dstChain,
    dstTxHash: dstChain ? `0x${messageId}dst` : undefined,
    dstLogIndex: dstChain ? 2 : undefined,
    dstEventId: dstChain ? `${messageId}-dst-event` : undefined,
    dstTokenAddress: dstChain ? EthereumAddress.random() : undefined,
    dstRawAmount: dstChain ? 1000000000000000000n : undefined,
    dstSymbol: undefined,
    dstAbstractTokenId: dstChain ? 'ethereum' : undefined,
    dstAmount: dstChain ? 1.0 : undefined,
    dstPrice: dstChain ? 2000.0 : undefined,
    dstValueUsd: dstChain ? 2000.0 : undefined,
    isProcessed: false,
  }
}
