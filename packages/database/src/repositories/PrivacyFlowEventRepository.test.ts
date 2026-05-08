import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type PrivacyFlowEventRecord,
  PrivacyFlowEventRepository,
} from './PrivacyFlowEventRepository'

describeDatabase(PrivacyFlowEventRepository.name, (db) => {
  const repository = db.privacyFlowEvent

  const START = UnixTime.now()

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(PrivacyFlowEventRepository.prototype.upsertMany.name, () => {
    it('adds new rows', async () => {
      const records = [
        flowEvent('a', START, 100, 'deposit', 1, 100n),
        flowEvent('a', START, 101, 'withdrawal', 1, 50n),
      ]

      const inserted = await repository.upsertMany(records)
      expect(inserted).toEqual(2)

      const result = await repository.getAll()
      expect(result).toEqualUnsorted(records)
    })

    it('handles empty array', async () => {
      const inserted = await repository.upsertMany([])
      expect(inserted).toEqual(0)
    })

    it('updates existing records on conflict', async () => {
      const initialRecords = [flowEvent('a', START, 100, 'deposit', 1, 100n)]

      await repository.upsertMany(initialRecords)

      const updatedRecords = [
        {
          ...initialRecords[0]!,
          count: 2,
          amount: 200n,
        },
      ]

      const inserted = await repository.upsertMany(updatedRecords)
      expect(inserted).toEqual(1)

      const result = await repository.getAll()
      expect(result).toEqualUnsorted(updatedRecords)
    })
  })

  describe(
    PrivacyFlowEventRepository.prototype.getDailyByProjectIds.name,
    () => {
      it('aggregates daily deposits and withdrawals', async () => {
        const records = [
          flowEvent('proj-a', START, 100, 'deposit', 1, 100n),
          flowEvent('proj-a', START, 101, 'deposit', 2, 200n),
          flowEvent('proj-a', START, 102, 'withdrawal', 1, 50n),
          flowEvent('proj-b', START, 103, 'deposit', 1, 300n),
        ]

        await repository.upsertMany(records)

        const result = await repository.getDailyByProjectIds(
          ['proj-a'],
          START,
          START,
        )

        expect(result).toEqualUnsorted([
          {
            projectId: 'proj-a',
            bucketId: 'bucket',
            timestamp: UnixTime.toStartOf(START, 'day'),
            depositCount: 3,
            withdrawalCount: 1,
            depositAmount: 300n,
            withdrawalAmount: 50n,
          },
        ])
      })

      it('returns empty array when no data', async () => {
        const result = await repository.getDailyByProjectIds(
          ['proj-a'],
          START,
          START,
        )
        expect(result).toEqual([])
      })

      it('returns empty array when projectIds is empty', async () => {
        await repository.upsertMany([
          flowEvent('proj-a', START, 100, 'deposit', 1, 100n),
        ])
        const result = await repository.getDailyByProjectIds([], START, START)
        expect(result).toEqual([])
      })
    },
  )

  describe(
    PrivacyFlowEventRepository.prototype.deleteByConfigInBlockRange.name,
    () => {
      it('deletes records in block range', async () => {
        const records = [
          flowEvent('a', START, 100, 'deposit', 1, 100n),
          flowEvent('a', START, 101, 'deposit', 1, 200n),
          flowEvent('a', START, 102, 'deposit', 1, 300n),
          flowEvent('b', START, 101, 'deposit', 1, 400n),
        ]

        await repository.upsertMany(records)

        const deleted = await repository.deleteByConfigInBlockRange(
          'a'.repeat(12),
          100,
          101,
        )

        expect(deleted).toEqual(2)

        const result = await repository.getAll()
        expect(result).toEqualUnsorted([records[2]!, records[3]!])
      })
    },
  )

  describe(PrivacyFlowEventRepository.prototype.deleteAll.name, () => {
    it('deletes all rows', async () => {
      await repository.upsertMany([
        flowEvent('a', START, 100, 'deposit', 1, 100n),
      ])
      await repository.deleteAll()

      const result = await repository.getAll()
      expect(result).toEqual([])
    })
  })

  afterEach(async () => {
    await repository.deleteAll()
  })
})

function flowEvent(
  projectId: string,
  timestamp: UnixTime,
  blockNumber: number,
  direction: 'deposit' | 'withdrawal',
  count: number,
  amount: bigint,
  valueUsd: number | null = null,
): PrivacyFlowEventRecord {
  return {
    configurationId: 'a'.repeat(12),
    projectId,
    bucketId: 'bucket',
    chain: 'ethereum',
    direction,
    timestamp,
    blockNumber,
    txHash: `0x${blockNumber.toString(16).padStart(64, '0')}`,
    logIndex: blockNumber,
    count,
    amount,
    priceId: 'ethereum',
    valueUsd,
  }
}
