import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { beforeEach, describe, expect, it } from 'vitest'
import { describeDatabase } from '../test/database'
import {
  type PrivacyRelayerActivityRecord,
  PrivacyRelayerActivityRepository,
} from './PrivacyRelayerActivityRepository'

describeDatabase(PrivacyRelayerActivityRepository.name, (db) => {
  const repository = db.privacyRelayerActivity
  const START = UnixTime.now()

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(PrivacyRelayerActivityRepository.prototype.upsertMany.name, () => {
    it('inserts and updates records', async () => {
      const initial = activity(1, START)
      expect(await repository.upsertMany([initial])).toStrictEqual(1)

      const updated = {
        ...initial,
        relayerAddress: EthereumAddress(
          '0x4444444444444444444444444444444444444444',
        ),
      }
      expect(await repository.upsertMany([updated])).toStrictEqual(1)

      expect(await repository.getAll()).toStrictEqual([updated])
    })

    it('handles an empty array', async () => {
      expect(await repository.upsertMany([])).toStrictEqual(0)
    })
  })

  describe(
    PrivacyRelayerActivityRepository.prototype.getActiveRelayerCount.name,
    () => {
      it('counts distinct relayers in the requested project and time range', async () => {
        const relayerA = EthereumAddress(
          '0x1111111111111111111111111111111111111111',
        )
        const relayerB = EthereumAddress(
          '0x2222222222222222222222222222222222222222',
        )
        const to = UnixTime(START + 3)

        await repository.upsertMany([
          activity(1, START, relayerA),
          activity(2, UnixTime(START + 1), relayerA),
          activity(3, UnixTime(START + 2), relayerB),
          activity(4, UnixTime(START + 1), relayerB, 'other-project'),
          activity(5, to, relayerB),
        ])

        expect(
          await repository.getActiveRelayerCount('project', START, to),
        ).toStrictEqual(2)
      })
    },
  )

  describe(
    PrivacyRelayerActivityRepository.prototype.deleteByConfigInTimeRange.name,
    () => {
      it('deletes only matching configuration records in the inclusive range', async () => {
        const configA = 'a'.repeat(12)
        const configB = 'b'.repeat(12)
        const records = [
          activity(1, START, undefined, 'project', configA),
          activity(2, UnixTime(START + 1), undefined, 'project', configA),
          activity(3, UnixTime(START + 2), undefined, 'project', configA),
          activity(4, UnixTime(START + 1), undefined, 'project', configB),
        ]
        await repository.upsertMany(records)

        expect(
          await repository.deleteByConfigInTimeRange(
            configA,
            UnixTime(START + 1),
            UnixTime(START + 2),
          ),
        ).toStrictEqual(2)

        const actual = await repository.getAll()
        expect(actual).toHaveLength(2)
        expect(actual).toStrictEqual(
          expect.arrayContaining([records[0]!, records[3]!]),
        )
      })
    },
  )

  describe(
    PrivacyRelayerActivityRepository.prototype.deleteByConfigIds.name,
    () => {
      it('deletes records for the requested configurations', async () => {
        const configA = 'a'.repeat(12)
        const configB = 'b'.repeat(12)
        const records = [
          activity(1, START, undefined, 'project', configA),
          activity(2, START, undefined, 'project', configB),
        ]
        await repository.upsertMany(records)

        expect(await repository.deleteByConfigIds([configA])).toStrictEqual(1)
        expect(await repository.getAll()).toStrictEqual([records[1]!])
      })

      it('handles an empty array', async () => {
        expect(await repository.deleteByConfigIds([])).toStrictEqual(0)
      })
    },
  )
})

function activity(
  id: number,
  timestamp: UnixTime,
  relayerAddress = EthereumAddress(
    '0x1111111111111111111111111111111111111111',
  ),
  projectId = 'project',
  configurationId = 'a'.repeat(12),
): PrivacyRelayerActivityRecord {
  return {
    configurationId,
    projectId,
    chain: 'ethereum',
    timestamp,
    blockNumber: 1_000 + id,
    txHash: `0x${id.toString(16).padStart(64, '0')}`,
    logIndex: 0,
    relayerAddress,
  }
}
