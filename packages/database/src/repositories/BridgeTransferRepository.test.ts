import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type BridgeTransferRecord,
  BridgeTransferRepository,
} from './BridgeTransferRepository'

describeDatabase(BridgeTransferRepository.name, (db) => {
  const repository = db.bridgeTransfer

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(BridgeTransferRepository.prototype.insertMany.name, () => {
    it('adds new rows', async () => {
      const records = [
        bridgeTransfer('plugin1', 'msg1', 'type1', UnixTime(100), 'a', 'b', 1),
        bridgeTransfer('plugin2', 'msg2', 'type2', UnixTime(200), 'b', 'a', 2),
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
        records.push(
          bridgeTransfer('plugin', `msg${i}`, 'deposit', UnixTime(i)),
        )
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
        dstAmount: undefined,
        dstPrice: undefined,
        dstValueUsd: undefined,
      }

      const inserted = await repository.insertMany([record])
      expect(inserted).toEqual(1)

      const result = await repository.getAll()
      expect(result).toEqual([record])
    })

    it('handles records with native token addresses', async () => {
      const record = bridgeTransfer(
        'plugin1',
        'msg1',
        'deposit',
        UnixTime(100),
        'ethereum',
        'arbitrum',
        5000,
      )

      record.srcTokenAddress = 'native'
      record.dstTokenAddress = 'native'

      const inserted = await repository.insertMany([record])
      expect(inserted).toEqual(1)

      const result = await repository.getAll()
      expect(result[0]?.srcTokenAddress).toEqual('native')
      expect(result[0]?.dstTokenAddress).toEqual('native')
    })

    it('handles records with ethereum token addresses', async () => {
      const record = bridgeTransfer(
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

  describe(BridgeTransferRepository.prototype.getByType.name, () => {
    beforeEach(async () => {
      await repository.insertMany([
        bridgeTransfer(
          'plugin1',
          'msg1',
          'deposit',
          UnixTime(100),
          'ethereum',
          'arbitrum',
          5000,
        ),
        bridgeTransfer(
          'plugin1',
          'msg2',
          'deposit',
          UnixTime(200),
          'ethereum',
          'optimism',
          6000,
        ),
        bridgeTransfer(
          'plugin2',
          'msg3',
          'withdraw',
          UnixTime(150),
          'arbitrum',
          'ethereum',
          7000,
        ),
        bridgeTransfer(
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

  describe(BridgeTransferRepository.prototype.deleteBefore.name, () => {
    it('deletes transfers before specified timestamp', async () => {
      await repository.insertMany([
        bridgeTransfer('plugin1', 'msg1', 'deposit', UnixTime(100)),
        bridgeTransfer('plugin1', 'msg2', 'deposit', UnixTime(200)),
        bridgeTransfer('plugin1', 'msg3', 'withdraw', UnixTime(300)),
        bridgeTransfer('plugin1', 'msg4', 'deposit', UnixTime(400)),
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

  afterEach(async () => {
    await repository.deleteAll()
  })
})

function bridgeTransfer(
  plugin: string,
  messageId: string,
  type: string,
  timestamp: UnixTime,
  srcChain?: string,
  dstChain?: string,
  duration?: number,
): BridgeTransferRecord {
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
    srcRawAmount: srcChain ? '1000000000000000000' : undefined,
    srcSymbol: srcChain ? 'ETH' : undefined,
    srcAmount: srcChain ? 1.0 : undefined,
    srcPrice: srcChain ? 2000.0 : undefined,
    srcValueUsd: srcChain ? 2000.0 : undefined,
    dstTime: dstChain ? timestamp + (duration ?? 0) : undefined,
    dstChain,
    dstTxHash: dstChain ? `0x${messageId}dst` : undefined,
    dstLogIndex: dstChain ? 2 : undefined,
    dstEventId: dstChain ? `${messageId}-dst-event` : undefined,
    dstTokenAddress: dstChain ? EthereumAddress.random() : undefined,
    dstRawAmount: dstChain ? '1000000000000000000' : undefined,
    dstSymbol: dstChain ? 'ETH' : undefined,
    dstAmount: dstChain ? 1.0 : undefined,
    dstPrice: dstChain ? 2000.0 : undefined,
    dstValueUsd: dstChain ? 2000.0 : undefined,
  }
}
