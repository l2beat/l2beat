import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import { BridgeMessageRepository } from './BridgeMessageRepository'

describeDatabase(BridgeMessageRepository.name, (db) => {
  const repository = db.bridgeMessage

  describe(BridgeMessageRepository.prototype.insertMany.name, () => {
    it('adds new rows', async () => {
      const records = [
        bridgeMessage('plugin1', 'msg1', 'type1', UnixTime(100)),
        bridgeMessage('plugin2', 'msg2', 'type2', UnixTime(200)),
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

    it('performs batch insert when more than 2000 records', async () => {
      const records = []
      for (let i = 0; i < 2500; i++) {
        records.push(bridgeMessage('plugin', `msg${i}`, 'type1', UnixTime(i)))
      }

      const inserted = await repository.insertMany(records)
      expect(inserted).toEqual(2500)
    })

    it('handles records with undefined optional fields', async () => {
      const record = {
        plugin: 'test-plugin',
        messageId: 'test-message',
        type: 'type1',
        duration: undefined,
        timestamp: UnixTime(100),
        srcTime: undefined,
        srcChain: undefined,
        srcTxHash: undefined,
        srcLogIndex: undefined,
        srcEventId: undefined,
        dstTime: undefined,
        dstChain: undefined,
        dstTxHash: undefined,
        dstLogIndex: undefined,
        dstEventId: undefined,
      }

      const inserted = await repository.insertMany([record])
      expect(inserted).toEqual(1)

      const result = await repository.getAll()
      expect(result).toEqual([record])
    })
  })

  describe(BridgeMessageRepository.prototype.getByType.name, () => {
    beforeEach(async () => {
      await repository.insertMany([
        bridgeMessage('plugin1', 'msg1', 'type1', UnixTime(100), 'ethereum'),
        bridgeMessage('plugin1', 'msg2', 'type1', UnixTime(200), 'ethereum'),
        bridgeMessage('plugin2', 'msg3', 'type2', UnixTime(150), 'optimism'),
        bridgeMessage(
          'plugin2',
          'msg4',
          'type1',
          UnixTime(300),
          'base',
          'ethereum',
        ),
      ])
    })

    it('returns messages for a specific type', async () => {
      const result = await repository.getByType('type1')

      expect(result).toHaveLength(3)
      expect(result.map((r) => r.messageId)).toEqualUnsorted([
        'msg1',
        'msg2',
        'msg4',
      ])
    })

    it('returns messages ordered by timestamp descending', async () => {
      const result = await repository.getByType('type1')

      expect(result.map((r) => r.timestamp)).toEqual([300, 200, 100])
    })

    it('filters by source chain when provided', async () => {
      const result = await repository.getByType('type1', {
        srcChain: 'ethereum',
      })

      expect(result).toHaveLength(2)
      expect(result.map((r) => r.messageId)).toEqualUnsorted(['msg1', 'msg2'])
    })

    it('filters by destination chain when provided', async () => {
      const result = await repository.getByType('type1', {
        dstChain: 'ethereum',
      })

      expect(result).toHaveLength(1)
      expect(result[0]?.messageId).toEqual('msg4')
    })

    it('filters by both source and destination chain when provided', async () => {
      const result = await repository.getByType('type1', {
        srcChain: 'base',
        dstChain: 'ethereum',
      })

      expect(result).toHaveLength(1)
      expect(result[0]?.messageId).toEqual('msg4')
    })

    it('returns empty array when no messages match type', async () => {
      const result = await repository.getByType('nonexistent')

      expect(result).toEqual([])
    })
  })

  describe(BridgeMessageRepository.prototype.deleteBefore.name, () => {
    it('deletes messages before specified timestamp', async () => {
      await repository.insertMany([
        bridgeMessage('plugin1', 'msg1', 'deposit', UnixTime(100)),
        bridgeMessage('plugin1', 'msg2', 'deposit', UnixTime(200)),
        bridgeMessage('plugin1', 'msg3', 'withdraw', UnixTime(300)),
        bridgeMessage('plugin1', 'msg4', 'deposit', UnixTime(400)),
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

function bridgeMessage(
  plugin: string,
  messageId: string,
  type: string,
  timestamp: UnixTime,
  srcChain?: string,
  dstChain?: string,
  duration?: number,
) {
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
    dstTime: dstChain ? timestamp + (duration ?? 0) : undefined,
    dstChain,
    dstTxHash: dstChain ? `0x${messageId}dst` : undefined,
    dstLogIndex: dstChain ? 2 : undefined,
    dstEventId: dstChain ? `${messageId}-dst-event` : undefined,
  }
}
