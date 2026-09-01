import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import type { AggregatedInteropTransferRecord } from './AggregatedInteropTransferRepository'
import { InteropAggregateStatusRepository } from './InteropAggregateStatusRepository'

describeDatabase(InteropAggregateStatusRepository.name, (db) => {
  const repository = db.interopAggregateStatus
  const transfers = db.aggregatedInteropTransfer

  beforeEach(async () => {
    await repository.deleteAll()
    await transfers.deleteAll()
  })

  describe(InteropAggregateStatusRepository.prototype.upsertAuto.name, () => {
    it('inserts then updates an existing auto row (returns true)', async () => {
      const inserted = await repository.upsertAuto({
        timestamp: UnixTime(100),
        status: 'promoted',
      })
      expect(inserted).toEqual(true)
      expect((await repository.getByTimestamp(UnixTime(100)))?.status).toEqual(
        'promoted',
      )

      const updated = await repository.upsertAuto({
        timestamp: UnixTime(100),
        status: 'blocked',
        reasons: [{ rule: 'maxLaneVolume' }],
      })
      expect(updated).toEqual(true)

      const row = await repository.getByTimestamp(UnixTime(100))
      expect(row?.status).toEqual('blocked')
      expect(row?.promotedBy).toEqual('auto')
      expect(row?.reasons).toEqual([{ rule: 'maxLaneVolume' }])
    })

    it('does NOT overwrite a manual (non-auto) verdict (sticky, returns false)', async () => {
      await repository.upsert({
        timestamp: UnixTime(100),
        status: 'promoted',
        promotedBy: 'ops@l2beat.com',
      })

      const applied = await repository.upsertAuto({
        timestamp: UnixTime(100),
        status: 'blocked',
      })

      // the write was a no-op — the caller must not act on a verdict it didn't record
      expect(applied).toEqual(false)
      const row = await repository.getByTimestamp(UnixTime(100))
      expect(row?.status).toEqual('promoted')
      expect(row?.promotedBy).toEqual('ops@l2beat.com')
    })
  })

  describe(
    InteropAggregateStatusRepository.prototype.promoteIfBlocked.name,
    () => {
      it('promotes a blocked snapshot and stamps the operator (returns true)', async () => {
        await repository.upsertAuto({
          timestamp: UnixTime(100),
          status: 'blocked',
          reasons: [{ rule: 'maxLaneVolume' }],
        })

        const applied = await repository.promoteIfBlocked(
          UnixTime(100),
          'ops@l2beat.com',
        )

        expect(applied).toEqual(true)
        const row = await repository.getByTimestamp(UnixTime(100))
        expect(row?.status).toEqual('promoted')
        expect(row?.promotedBy).toEqual('ops@l2beat.com')
        // reasons kept as the audit trail of why it was blocked
        expect(row?.reasons).toEqual([{ rule: 'maxLaneVolume' }])
      })

      it('does NOT manualize an already-promoted snapshot (returns false)', async () => {
        await repository.upsertAuto({
          timestamp: UnixTime(100),
          status: 'promoted',
        })

        const applied = await repository.promoteIfBlocked(
          UnixTime(100),
          'ops@l2beat.com',
        )

        // stays an auto verdict so the engine can still block it if the gate fails
        expect(applied).toEqual(false)
        const row = await repository.getByTimestamp(UnixTime(100))
        expect(row?.status).toEqual('promoted')
        expect(row?.promotedBy).toEqual('auto')
      })

      it('is a no-op when no status row exists (returns false)', async () => {
        const applied = await repository.promoteIfBlocked(
          UnixTime(100),
          'ops@l2beat.com',
        )

        expect(applied).toEqual(false)
        expect(await repository.getByTimestamp(UnixTime(100))).toEqual(
          undefined,
        )
      })
    },
  )

  describe(
    InteropAggregateStatusRepository.prototype.getLatestPromotedTimestamp.name,
    () => {
      it('returns the max promoted timestamp, skipping a newer blocked one', async () => {
        await repository.upsertAuto({
          timestamp: UnixTime(100),
          status: 'promoted',
        })
        await repository.upsertAuto({
          timestamp: UnixTime(200),
          status: 'promoted',
        })
        await repository.upsertAuto({
          timestamp: UnixTime(300),
          status: 'blocked',
        })

        expect(await repository.getLatestPromotedTimestamp()).toEqual(
          UnixTime(200),
        )
      })

      it('returns undefined when nothing is promoted', async () => {
        await repository.upsertAuto({
          timestamp: UnixTime(100),
          status: 'blocked',
        })

        expect(await repository.getLatestPromotedTimestamp()).toEqual(undefined)
      })
    },
  )

  describe(
    InteropAggregateStatusRepository.prototype
      .getEarliestPromotedTimestampForDay.name,
    () => {
      it('returns the earliest promoted timestamp of the day, skipping blocked', async () => {
        const dayEarly = UnixTime(UnixTime.DAY + 100)
        const dayMid = UnixTime(UnixTime.DAY + 200)
        const dayLate = UnixTime(UnixTime.DAY + 300)
        const nextDay = UnixTime(2 * UnixTime.DAY + 100)

        // earliest of the day is blocked → must be skipped
        await repository.upsertAuto({ timestamp: dayEarly, status: 'blocked' })
        await repository.upsertAuto({ timestamp: dayMid, status: 'promoted' })
        await repository.upsertAuto({ timestamp: dayLate, status: 'promoted' })
        await repository.upsertAuto({ timestamp: nextDay, status: 'promoted' })

        expect(
          await repository.getEarliestPromotedTimestampForDay(dayLate),
        ).toEqual(dayMid)
      })

      it('returns undefined for a day with no promoted snapshot', async () => {
        const day = UnixTime(UnixTime.DAY + 100)
        await repository.upsertAuto({ timestamp: day, status: 'blocked' })

        expect(
          await repository.getEarliestPromotedTimestampForDay(day),
        ).toEqual(undefined)
      })
    },
  )

  describe(
    InteropAggregateStatusRepository.prototype.deleteOrphaned.name,
    () => {
      it('removes status rows whose snapshot no longer exists', async () => {
        await transfers.insertMany([
          transfer(UnixTime(100)),
          transfer(UnixTime(300)),
        ])
        await repository.upsertAuto({
          timestamp: UnixTime(100),
          status: 'promoted',
        })
        await repository.upsertAuto({
          timestamp: UnixTime(200),
          status: 'promoted',
        })
        await repository.upsertAuto({
          timestamp: UnixTime(300),
          status: 'blocked',
        })

        const deleted = await repository.deleteOrphaned()

        expect(deleted).toEqual(1)
        expect(await repository.getByTimestamp(UnixTime(100))).not.toEqual(
          undefined,
        )
        expect(await repository.getByTimestamp(UnixTime(200))).toEqual(
          undefined,
        )
        expect(await repository.getByTimestamp(UnixTime(300))).not.toEqual(
          undefined,
        )
      })
    },
  )

  describe(InteropAggregateStatusRepository.prototype.getRecent.name, () => {
    it('returns the most recent rows, newest first', async () => {
      await repository.upsertAuto({
        timestamp: UnixTime(100),
        status: 'promoted',
      })
      await repository.upsertAuto({
        timestamp: UnixTime(200),
        status: 'blocked',
      })
      await repository.upsertAuto({
        timestamp: UnixTime(300),
        status: 'promoted',
      })

      const recent = await repository.getRecent(2)
      expect(recent.map((r) => r.timestamp)).toEqual([
        UnixTime(300),
        UnixTime(200),
      ])
    })
  })
})

function transfer(timestamp: UnixTime): AggregatedInteropTransferRecord {
  return {
    timestamp,
    id: 'p',
    bridgeType: 'unknown',
    srcChain: 'ethereum',
    dstChain: 'arbitrum',
    transferTypeStats: undefined,
    transferCount: 1,
    transfersWithDurationCount: 1,
    identifiedCount: 1,
    totalDurationSum: 0,
    srcValueUsd: undefined,
    dstValueUsd: undefined,
    minTransferValueUsd: undefined,
    maxTransferValueUsd: undefined,
    avgValueInFlight: undefined,
    mintedValueUsd: undefined,
    burnedValueUsd: undefined,
    countUnder100: 0,
    count100To1K: 0,
    count1KTo10K: 0,
    count10KTo100K: 0,
    countOver100K: 0,
  }
}
