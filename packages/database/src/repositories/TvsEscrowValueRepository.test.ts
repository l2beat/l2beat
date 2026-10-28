import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import { testDeletingArchivedRecords } from '../utils/deleteArchivedRecords.test'
import {
  type TvsEscrowValueRecord,
  TvsEscrowValueRepository,
} from './TvsEscrowValueRepository'

describeDatabase(TvsEscrowValueRepository.name, (db) => {
  const repository = db.tvsEscrowValue

  describe(TvsEscrowValueRepository.prototype.upsertMany.name, () => {
    it('keeps one row per escrow and overwrites it on conflict', async () => {
      await repository.upsertMany([
        escrowValue({ escrowAddress: '0xa', value: 1 }),
        escrowValue({ escrowAddress: '0xb', value: 2 }),
      ])
      await repository.upsertMany([
        escrowValue({ escrowAddress: '0xa', value: 3 }),
      ])

      expect(await repository.getAll()).toEqualUnsorted([
        escrowValue({ escrowAddress: '0xa', value: 3 }),
        escrowValue({ escrowAddress: '0xb', value: 2 }),
      ])
    })
  })

  describe(TvsEscrowValueRepository.prototype.getByProjectAt.name, () => {
    it('returns the project rows at the given timestamps only', async () => {
      const wanted = escrowValue({ timestamp: UnixTime(200) })
      await repository.upsertMany([
        wanted,
        escrowValue({ timestamp: UnixTime(100) }),
        escrowValue({
          timestamp: UnixTime(200),
          configurationId: 'b'.repeat(12),
          projectId: 'other',
        }),
      ])

      expect(
        await repository.getByProjectAt('project', [UnixTime(200)]),
      ).toEqual([wanted])
    })
  })

  describe(TvsEscrowValueRepository.prototype.deleteByConfigIds.name, () => {
    it('deletes rows of the given configurations', async () => {
      const kept = escrowValue({ configurationId: 'b'.repeat(12) })
      await repository.upsertMany([escrowValue(), kept])

      await repository.deleteByConfigIds(['a'.repeat(12)])

      expect(await repository.getAll()).toEqual([kept])
    })
  })

  describe(
    TvsEscrowValueRepository.prototype.deleteByConfigInTimeRange.name,
    () => {
      it('deletes rows of the configuration inside the range', async () => {
        const kept = [
          escrowValue({ timestamp: UnixTime(300) }),
          escrowValue({
            timestamp: UnixTime(200),
            configurationId: 'b'.repeat(12),
          }),
        ]
        await repository.upsertMany([
          escrowValue({ timestamp: UnixTime(100) }),
          escrowValue({ timestamp: UnixTime(200) }),
          ...kept,
        ])

        await repository.deleteByConfigInTimeRange(
          'a'.repeat(12),
          UnixTime(100),
          UnixTime(200),
        )

        expect(await repository.getAll()).toEqualUnsorted(kept)
      })
    },
  )

  describe('archived records', () => {
    testDeletingArchivedRecords(
      {
        deleteHourlyUntil: (dateRange) =>
          repository.deleteHourlyUntil(dateRange),
        deleteSixHourlyUntil: (dateRange) =>
          repository.deleteSixHourlyUntil(dateRange),
        insertMany: (records) => repository.upsertMany(records),
        getAll: () => repository.getAll(),
      },
      (timestamp) => escrowValue({ timestamp }),
    )
  })

  afterEach(async () => {
    await repository.deleteAll()
  })
})

function escrowValue(
  record: Partial<TvsEscrowValueRecord> = {},
): TvsEscrowValueRecord {
  return {
    timestamp: UnixTime(100),
    configurationId: 'a'.repeat(12),
    projectId: 'project',
    tokenId: 'project-ETH',
    chain: 'ethereum',
    escrowAddress: '0xa',
    amount: 1,
    value: 1,
    ...record,
  }
}
