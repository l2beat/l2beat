import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { Selectable } from 'kysely'
import type { InteropTransfer } from '../kysely/generated/types'
import { describeDatabase } from '../test/database'
import {
  type InteropTransferRecord,
  InteropTransferRepository,
  toRecord,
  toRow,
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
        transferId: 'test-transfer',
        type: 'deposit',
        bridgeType: undefined,
        duration: 0,
        timestamp: UnixTime(100),
        srcTime: UnixTime(100),
        srcChain: 'ethereum',
        srcTxHash: '0x123',
        srcLogIndex: 1,
        srcEventId: 'event1',
        srcTokenAddress: undefined,
        srcRawAmount: undefined,
        srcWasBurned: undefined,
        srcSymbol: undefined,
        srcAbstractTokenId: undefined,
        srcAmount: undefined,
        srcPrice: undefined,
        srcValueUsd: undefined,
        dstTime: UnixTime(100),
        dstChain: 'arbitrum',
        dstTxHash: '0x456',
        dstLogIndex: 2,
        dstEventId: 'event2',
        dstTokenAddress: undefined,
        dstRawAmount: undefined,
        dstWasMinted: undefined,
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

    it('handles records with custom symbol fields', async () => {
      const record = transfer(
        'plugin1',
        'msg1',
        'deposit',
        UnixTime(100),
        'ethereum',
        'arbitrum',
        5000,
      )
      record.srcSymbol = 'USDC'
      record.dstSymbol = 'USDC.e'

      const inserted = await repository.insertMany([record])
      expect(inserted).toEqual(1)

      const result = await repository.getAll()
      expect(result[0]?.srcSymbol).toEqual('USDC')
      expect(result[0]?.dstSymbol).toEqual('USDC.e')
    })

    it('persists bridgeType field', async () => {
      const record = transfer(
        'plugin1',
        'msg1',
        'deposit',
        UnixTime(100),
        'ethereum',
        'arbitrum',
        5000,
      )
      record.bridgeType = 'lockAndMint'

      const inserted = await repository.insertMany([record])
      expect(inserted).toEqual(1)

      const result = await repository.getAll()
      expect(result[0]?.bridgeType).toEqual('lockAndMint')
    })

    it('preserves symbol fields when they are undefined', async () => {
      const record = transfer(
        'plugin1',
        'msg1',
        'deposit',
        UnixTime(100),
        'ethereum',
        'arbitrum',
        5000,
      )
      record.srcSymbol = undefined
      record.dstSymbol = undefined

      const inserted = await repository.insertMany([record])
      expect(inserted).toEqual(1)

      const result = await repository.getAll()
      expect(result[0]?.srcSymbol).toEqual(undefined)
      expect(result[0]?.dstSymbol).toEqual(undefined)
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
      expect(result.map((r) => r.transferId)).toEqualUnsorted([
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
      expect(result.map((r) => r.transferId)).toEqualUnsorted(['msg1', 'msg2'])
    })

    it('filters by destination chain when provided', async () => {
      const result = await repository.getByType('deposit', {
        dstChain: 'ethereum',
      })

      expect(result).toHaveLength(1)
      expect(result[0]?.transferId).toEqual('msg4')
    })

    it('filters by both source and destination chain when provided', async () => {
      const result = await repository.getByType('deposit', {
        srcChain: 'ethereum',
        dstChain: 'arbitrum',
      })

      expect(result).toHaveLength(1)
      expect(result[0]?.transferId).toEqual('msg1')
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
      expect(remaining.map((r) => r.transferId)).toEqualUnsorted([
        'msg3',
        'msg4',
      ])
    })
  })

  describe(InteropTransferRepository.prototype.deleteForPlugin.name, () => {
    it('deletes transfers for a specific plugin', async () => {
      await repository.insertMany([
        transfer('plugin1', 'msg1', 'deposit', UnixTime(100)),
        transfer('plugin2', 'msg2', 'deposit', UnixTime(200)),
        transfer('plugin1', 'msg3', 'withdraw', UnixTime(300)),
      ])

      const deleted = await repository.deleteForPlugin('plugin1')

      expect(deleted).toEqual(2)

      const remaining = await repository.getAll()
      expect(remaining).toHaveLength(1)
      expect(remaining[0]?.transferId).toEqual('msg2')
      expect(remaining[0]?.plugin).toEqual('plugin2')
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
      expect(result.map((r) => r.transferId)).toEqualUnsorted(['msg1', 'msg2'])
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
      record.srcSymbol = undefined
      record.srcPrice = undefined
      record.srcAmount = undefined
      record.srcValueUsd = undefined
      record.dstAbstractTokenId = undefined
      record.dstSymbol = undefined
      record.dstPrice = undefined
      record.dstAmount = undefined
      record.dstValueUsd = undefined

      await repository.insertMany([record])

      const update = {
        srcAbstractTokenId: 'ethereum',
        srcSymbol: 'ETH',
        srcPrice: 2000.0,
        srcAmount: 1.5,
        srcValueUsd: 3000.0,
        dstAbstractTokenId: 'arbitrum-one',
        dstSymbol: 'ETH',
        dstPrice: 1999.0,
        dstAmount: 1.4,
        dstValueUsd: 2798.6,
      }

      await repository.updateFinancials('msg1', update)

      const result = await repository.getAll()
      expect(result).toHaveLength(1)

      const updatedRecord = result[0]
      expect(updatedRecord?.srcAbstractTokenId).toEqual('ethereum')
      expect(updatedRecord?.srcSymbol).toEqual('ETH')
      expect(updatedRecord?.srcPrice).toEqual(2000.0)
      expect(updatedRecord?.srcAmount).toEqual(1.5)
      expect(updatedRecord?.srcValueUsd).toEqual(3000.0)
      expect(updatedRecord?.dstAbstractTokenId).toEqual('arbitrum-one')
      expect(updatedRecord?.dstSymbol).toEqual('ETH')
      expect(updatedRecord?.dstPrice).toEqual(1999.0)
      expect(updatedRecord?.dstAmount).toEqual(1.4)
      expect(updatedRecord?.dstValueUsd).toEqual(2798.6)
      expect(updatedRecord?.isProcessed).toEqual(true)
    })

    it('updates only provided fields', async () => {
      const record = transfer('plugin1', 'msg1', 'deposit', UnixTime(100))
      record.srcAbstractTokenId = 'original-src'
      record.srcSymbol = 'USDT'
      record.srcPrice = 1000.0
      record.dstAbstractTokenId = 'original-dst'
      record.dstSymbol = 'USDT.e'
      record.dstPrice = 1001.0

      await repository.insertMany([record])

      const partialUpdate = {
        srcPrice: 2000.0,
        dstAmount: 1.5,
        dstSymbol: 'USDT-updated',
      }

      await repository.updateFinancials('msg1', partialUpdate)

      const result = await repository.getAll()
      const updatedRecord = result[0]

      expect(updatedRecord?.srcAbstractTokenId).toEqual('original-src')
      expect(updatedRecord?.srcSymbol).toEqual('USDT')
      expect(updatedRecord?.srcPrice).toEqual(2000.0)
      expect(updatedRecord?.dstAbstractTokenId).toEqual('original-dst')
      expect(updatedRecord?.dstSymbol).toEqual('USDT-updated')
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
      const msg1Record = result.find((r) => r.transferId === 'msg1')
      const msg2Record = result.find((r) => r.transferId === 'msg2')
      const msg3Record = result.find((r) => r.transferId === 'msg3')

      expect(msg1Record?.isProcessed).toEqual(false)
      expect(msg1Record?.srcPrice).not.toEqual(3000.0)

      expect(msg2Record?.isProcessed).toEqual(true)
      expect(msg2Record?.srcPrice).toEqual(3000.0)
      expect(msg2Record?.srcAmount).toEqual(2.0)

      expect(msg3Record?.isProcessed).toEqual(false)
      expect(msg3Record?.srcPrice).not.toEqual(3000.0)
    })

    it('handles non-existent transfer ID gracefully', async () => {
      const record = transfer('plugin1', 'msg1', 'deposit', UnixTime(100))
      await repository.insertMany([record])
      const update = {
        srcPrice: 3000.0,
      }

      await repository.updateFinancials('nonexistent-msg', update)
      const result = await repository.getAll()
      expect(result).toHaveLength(1)
      expect(result[0]?.isProcessed).toEqual(false)
      expect(result[0]?.srcPrice).not.toEqual(3000.0)
    })

    it('updates with empty update object', async () => {
      const record = transfer('plugin1', 'msg1', 'deposit', UnixTime(100))
      await repository.insertMany([record])

      await repository.updateFinancials('msg1', {})

      const result = await repository.getAll()
      const updatedRecord = result[0]

      expect(updatedRecord?.isProcessed).toEqual(true)
      // All other fields should remain unchanged
      expect(updatedRecord?.transferId).toEqual('msg1')
      expect(updatedRecord?.plugin).toEqual('plugin1')
      expect(updatedRecord?.type).toEqual('deposit')
    })

    it('updates multiple financial fields at once', async () => {
      const record = transfer('plugin1', 'msg1', 'deposit', UnixTime(100))
      await repository.insertMany([record])

      const comprehensiveUpdate = {
        srcAbstractTokenId: 'ethereum',
        srcSymbol: 'WETH',
        srcPrice: 2500.0,
        srcAmount: 0.8,
        srcValueUsd: 2000.0,
        dstAbstractTokenId: 'polygon',
        dstSymbol: 'WETH',
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

  describe(InteropTransferRepository.prototype.getByRange.name, () => {
    beforeEach(async () => {
      await repository.insertMany([
        transfer('plugin1', 'msg1', 'deposit', UnixTime(100)),
        transfer('plugin1', 'msg2', 'deposit', UnixTime(200)),
        transfer('plugin2', 'msg3', 'withdraw', UnixTime(300)),
        transfer('plugin2', 'msg4', 'deposit', UnixTime(400)),
        transfer('plugin1', 'msg5', 'withdraw', UnixTime(500)),
      ])
    })

    it('returns transfers within the specified range', async () => {
      const result = await repository.getByRange(UnixTime(200), UnixTime(400))

      expect(result).toHaveLength(2)
      expect(result.map((r) => r.transferId)).toEqualUnsorted(['msg3', 'msg4'])
    })

    it('includes upper boundary but excludes lower boundary', async () => {
      const result = await repository.getByRange(UnixTime(100), UnixTime(500))

      expect(result).toHaveLength(4)
      expect(result.map((r) => r.transferId)).toEqualUnsorted([
        'msg2',
        'msg3',
        'msg4',
        'msg5',
      ])
    })

    it('returns empty array when no transfers in range', async () => {
      const result = await repository.getByRange(UnixTime(600), UnixTime(700))

      expect(result).toEqual([])
    })

    it('does not return transfer when range matches exactly', async () => {
      const result = await repository.getByRange(UnixTime(300), UnixTime(300))

      expect(result).toEqual([])
    })
  })

  afterEach(async () => {
    await repository.deleteAll()
  })
})

describe('InteropTransferRepository toRecord', () => {
  it('throws on invalid bridgeType', () => {
    const record = transfer(
      'plugin1',
      'msg1',
      'deposit',
      UnixTime(100),
      'ethereum',
      'arbitrum',
      5000,
    )
    const row = {
      ...toRow(record),
      bridgeType: 'invalid-category',
    } as Selectable<InteropTransfer>

    expect(() => toRecord(row)).toThrow(
      'Invalid interop transfer bridge type: invalid-category',
    )
  })
})

function transfer(
  plugin: string,
  transferId: string,
  type: string,
  timestamp: UnixTime,
  srcChain?: string,
  dstChain?: string,
  duration?: number,
): InteropTransferRecord {
  return {
    plugin,
    transferId,
    type,
    bridgeType: undefined,
    duration: duration ?? 0,
    timestamp,
    srcTime: timestamp,
    srcChain: srcChain ?? 'ethereum',
    srcTxHash: `0x${transferId}src`,
    srcLogIndex: 1,
    srcEventId: `${transferId}-src-event`,
    srcTokenAddress: EthereumAddress.random(),
    srcRawAmount: 1000000000000000000n,
    srcWasBurned: false,
    srcSymbol: 'ETH',
    srcAbstractTokenId: 'ethereum',
    srcAmount: 1.0,
    srcPrice: 2000.0,
    srcValueUsd: 2000.0,
    dstTime: timestamp + (duration ?? 0),
    dstChain: dstChain ?? 'arbitrum',
    dstTxHash: `0x${transferId}dst`,
    dstLogIndex: 2,
    dstEventId: `${transferId}-dst-event`,
    dstTokenAddress: EthereumAddress.random(),
    dstRawAmount: 1000000000000000000n,
    dstWasMinted: false,
    dstSymbol: 'ETH',
    dstAbstractTokenId: 'ethereum',
    dstAmount: 1.0,
    dstPrice: 2000.0,
    dstValueUsd: 2000.0,
    isProcessed: false,
  }
}
