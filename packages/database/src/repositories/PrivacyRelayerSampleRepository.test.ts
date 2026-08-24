import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type PrivacyRelayerSampleRecord,
  PrivacyRelayerSampleRepository,
} from './PrivacyRelayerSampleRepository'

describeDatabase(PrivacyRelayerSampleRepository.name, (db) => {
  const repository = db.privacyRelayerSample
  const START = UnixTime.toStartOf(UnixTime.now(), 'day')

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(PrivacyRelayerSampleRepository.prototype.upsertMany.name, () => {
    it('inserts and updates records', async () => {
      const initial = sample(0, 10)
      expect(await repository.upsertMany([initial])).toEqual(1)

      const updated = { ...initial, relayerCount: 15 }
      expect(await repository.upsertMany([updated])).toEqual(1)

      expect(await repository.getAll()).toEqual([updated])
    })

    it('handles an empty array', async () => {
      expect(await repository.upsertMany([])).toEqual(0)
    })
  })

  describe(
    PrivacyRelayerSampleRepository.prototype.getConfigurationIdsByTimestamp
      .name,
    () => {
      it('returns only configurations with a sample at the timestamp', async () => {
        const configA = 'a'.repeat(12)
        const configB = 'b'.repeat(12)
        await repository.upsertMany([
          sample(0, 10, 'project', configA),
          sample(1, 20, 'project', configB),
        ])

        expect(
          await repository.getConfigurationIdsByTimestamp(
            [configA, configB],
            day(0),
          ),
        ).toEqual([configA])
      })

      it('handles an empty array', async () => {
        expect(
          await repository.getConfigurationIdsByTimestamp([], day(0)),
        ).toEqual([])
      })
    },
  )

  describe(
    PrivacyRelayerSampleRepository.prototype.getAverageRelayerCount.name,
    () => {
      it('averages daily counts in the requested project and time range', async () => {
        await repository.upsertMany([
          sample(0, 10),
          sample(1, 20),
          sample(2, 30),
          sample(1, 100, 'other-project', 'b'.repeat(12)),
          // outside the range: `to` is exclusive
          sample(3, 100),
        ])

        expect(
          await repository.getAverageRelayerCount('project', START, day(3)),
        ).toEqual(20)
      })

      it('returns undefined when there are no samples', async () => {
        expect(
          await repository.getAverageRelayerCount('project', START, day(1)),
        ).toEqual(undefined)
      })
    },
  )

  describe(
    PrivacyRelayerSampleRepository.prototype.deleteByConfigInTimeRange.name,
    () => {
      it('deletes only matching configuration records in the inclusive range', async () => {
        const configA = 'a'.repeat(12)
        const configB = 'b'.repeat(12)
        const records = [
          sample(0, 10, 'project', configA),
          sample(1, 20, 'project', configA),
          sample(2, 30, 'project', configA),
          sample(1, 40, 'project', configB),
        ]
        await repository.upsertMany(records)

        expect(
          await repository.deleteByConfigInTimeRange(configA, day(1), day(2)),
        ).toEqual(2)

        expect(await repository.getAll()).toEqualUnsorted([
          records[0]!,
          records[3]!,
        ])
      })
    },
  )

  describe(
    PrivacyRelayerSampleRepository.prototype.deleteByConfigIds.name,
    () => {
      it('deletes records for the requested configurations', async () => {
        const configA = 'a'.repeat(12)
        const configB = 'b'.repeat(12)
        const records = [
          sample(0, 10, 'project', configA),
          sample(0, 20, 'project', configB),
        ]
        await repository.upsertMany(records)

        expect(await repository.deleteByConfigIds([configA])).toEqual(1)
        expect(await repository.getAll()).toEqual([records[1]!])
      })

      it('handles an empty array', async () => {
        expect(await repository.deleteByConfigIds([])).toEqual(0)
      })
    },
  )

  function day(offset: number): UnixTime {
    return UnixTime(START + offset * UnixTime.DAY)
  }

  function sample(
    dayOffset: number,
    relayerCount: number,
    projectId = 'project',
    configurationId = 'a'.repeat(12),
  ): PrivacyRelayerSampleRecord {
    return {
      configurationId,
      projectId,
      chain: 'ethereum',
      timestamp: day(dayOffset),
      relayerCount,
      messagesReceived: 10,
      messagesParsed: 10,
      messagesAccepted: 10,
    }
  }
})
