import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  InteropAggregationQualityRepository,
  type NewInteropAggregationQualityRecord,
} from './InteropAggregationQualityRepository'

describeDatabase(InteropAggregationQualityRepository.name, (db) => {
  const repository = db.interopAggregationQuality

  afterEach(async () => {
    await repository.deleteAll()
  })

  describe(InteropAggregationQualityRepository.prototype.upsert.name, () => {
    it('inserts a new quality snapshot', async () => {
      const input = qualityRecord({
        timestamp: UnixTime.fromDate(new Date('2026-03-01T00:00:00Z')),
      })

      await repository.upsert(input)

      const stored = await repository.findByTimestamp(input.timestamp)
      expect(stored).not.toEqual(undefined)
      expect(stored?.timestamp).toEqual(input.timestamp)
      expect(stored?.autoPromoted).toEqual(input.autoPromoted)
      expect(stored?.isPromoted).toEqual(input.isPromoted)
      expect(stored?.promotionRequired).toEqual(input.promotionRequired)
      expect(stored?.reasons).toEqual(input.reasons)
      expect(stored?.checkedGroups).toEqual(input.checkedGroups)
      expect(stored?.failingGroups).toEqual(input.failingGroups)
    })

    it('updates an existing snapshot for the same timestamp', async () => {
      const timestamp = UnixTime.fromDate(new Date('2026-03-01T00:00:00Z'))
      const initial = qualityRecord({
        timestamp,
        reasons: [],
        autoPromoted: true,
        isPromoted: true,
        promotionRequired: false,
      })
      const updated = qualityRecord({
        timestamp,
        reasons: ['Count spike vs baseline: x8.50'],
        autoPromoted: false,
        isPromoted: false,
        promotionRequired: true,
      })

      await repository.upsert(initial)
      await repository.upsert(updated)

      const all = await repository.getAll()
      expect(all).toHaveLength(1)
      expect(all[0]?.reasons).toEqual(updated.reasons)
      expect(all[0]?.autoPromoted).toEqual(updated.autoPromoted)
      expect(all[0]?.isPromoted).toEqual(updated.isPromoted)
      expect(all[0]?.promotionRequired).toEqual(updated.promotionRequired)
    })
  })

  describe(
    InteropAggregationQualityRepository.prototype.findLatest.name,
    () => {
      it('returns the latest quality snapshot by timestamp', async () => {
        const older = qualityRecord({
          timestamp: UnixTime.fromDate(new Date('2026-03-01T00:00:00Z')),
        })
        const newer = qualityRecord({
          timestamp: UnixTime.fromDate(new Date('2026-03-02T00:00:00Z')),
        })

        await repository.upsert(older)
        await repository.upsert(newer)

        const latest = await repository.findLatest()
        expect(latest?.timestamp).toEqual(newer.timestamp)
      })
    },
  )

  describe(
    InteropAggregationQualityRepository.prototype.findLatestPromoted.name,
    () => {
      it('returns the latest promoted snapshot by timestamp', async () => {
        const olderPromoted = qualityRecord({
          timestamp: UnixTime.fromDate(new Date('2026-03-01T00:00:00Z')),
          isPromoted: true,
        })
        const newerNotPromoted = qualityRecord({
          timestamp: UnixTime.fromDate(new Date('2026-03-02T00:00:00Z')),
          isPromoted: false,
        })
        const newestPromoted = qualityRecord({
          timestamp: UnixTime.fromDate(new Date('2026-03-03T00:00:00Z')),
          isPromoted: true,
        })

        await repository.upsert(olderPromoted)
        await repository.upsert(newerNotPromoted)
        await repository.upsert(newestPromoted)

        const latestPromoted = await repository.findLatestPromoted()
        expect(latestPromoted?.timestamp).toEqual(newestPromoted.timestamp)
      })
    },
  )

  describe(
    InteropAggregationQualityRepository.prototype
      .findLatestPromotedTimestampsPerDay.name,
    () => {
      it('returns latest promoted timestamp per day in descending day order', async () => {
        const day1Early = qualityRecord({
          timestamp: UnixTime.fromDate(new Date('2026-03-01T01:00:00Z')),
          isPromoted: true,
        })
        const day1Late = qualityRecord({
          timestamp: UnixTime.fromDate(new Date('2026-03-01T18:00:00Z')),
          isPromoted: true,
        })
        const day2Promoted = qualityRecord({
          timestamp: UnixTime.fromDate(new Date('2026-03-02T09:00:00Z')),
          isPromoted: true,
        })
        const day2LaterNotPromoted = qualityRecord({
          timestamp: UnixTime.fromDate(new Date('2026-03-02T21:00:00Z')),
          isPromoted: false,
        })
        const day3NotPromoted = qualityRecord({
          timestamp: UnixTime.fromDate(new Date('2026-03-03T12:00:00Z')),
          isPromoted: false,
        })

        await repository.upsert(day1Early)
        await repository.upsert(day1Late)
        await repository.upsert(day2Promoted)
        await repository.upsert(day2LaterNotPromoted)
        await repository.upsert(day3NotPromoted)

        const result = await repository.findLatestPromotedTimestampsPerDay()

        expect(result).toEqual([day2Promoted.timestamp, day1Late.timestamp])
      })
    },
  )
})

function qualityRecord(
  partial: Partial<NewInteropAggregationQualityRecord> = {},
): NewInteropAggregationQualityRecord {
  return {
    timestamp: partial.timestamp ?? UnixTime.now(),
    autoPromoted: partial.autoPromoted ?? true,
    isPromoted: partial.isPromoted ?? true,
    promotionRequired: partial.promotionRequired ?? false,
    reasons: partial.reasons ?? [],
    checkedGroups: partial.checkedGroups ?? 1000,
    failingGroups: partial.failingGroups ?? 0,
  }
}
