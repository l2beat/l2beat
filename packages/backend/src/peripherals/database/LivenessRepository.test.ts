import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../../test/database'
import { LivenessConfigurationRepository } from './LivenessConfigurationRepository'
import { LIVENESS_CONFIGS } from './LivenessConfigurationRepository.test'
import { LivenessRecord, LivenessRepository } from './LivenessRepository'

describeDatabase(LivenessRepository.name, (database) => {
  const repository = new LivenessRepository(database, Logger.SILENT)
  const configRepository = new LivenessConfigurationRepository(
    database,
    Logger.SILENT,
  )

  const START = UnixTime.now()
  const DATA = [
    {
      timestamp: START.add(-1, 'hours'),
      blockNumber: 12345,
      txHash: '0x1234567890abcdef',
      livenessId: LIVENESS_CONFIGS[0].id,
    },
    {
      timestamp: START.add(-2, 'hours'),
      blockNumber: 12346,
      txHash: '0xabcdef1234567890',
      livenessId: LIVENESS_CONFIGS[1].id,
    },
    {
      timestamp: START.add(-3, 'hours'),
      blockNumber: 12347,
      txHash: '0x12345678901abcdef',
      livenessId: LIVENESS_CONFIGS[2].id,
    },
  ]

  beforeEach(async function () {
    this.timeout(10000)
    await configRepository.deleteAll()
    await configRepository.addMany(LIVENESS_CONFIGS)
    await repository.deleteAll()
    await repository.addMany(
      DATA.map((e) => ({
        ...e,
      })),
    )
  })

  describe(LivenessRepository.prototype.addMany.name, () => {
    it('only new rows', async () => {
      const newRows = [
        {
          timestamp: START.add(-5, 'hours'),
          blockNumber: 12349,
          txHash: '0x1234567890abcdef1',
          livenessId: LIVENESS_CONFIGS[0].id,
        },
        {
          timestamp: START.add(-6, 'hours'),
          blockNumber: 12350,
          txHash: '0xabcdef1234567892',
          livenessId: LIVENESS_CONFIGS[0].id,
        },
      ]
      await repository.addMany(newRows)

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        ...DATA.map((e) => ({
          ...e,
        })),
        ...newRows,
      ])
    })

    it('empty array', async () => {
      await expect(repository.addMany([])).not.toBeRejected()
    })

    it('big query', async () => {
      const records: LivenessRecord[] = []
      for (let i = 0; i < 15_000; i++) {
        records.push({
          timestamp: START.add(-i, 'hours'),
          blockNumber: i,
          txHash: `0xabcdef1234567892${i}`,
          livenessId: LIVENESS_CONFIGS[0].id,
        })
      }
      await expect(repository.addMany(records)).not.toBeRejected()
    })
  })

  describe(LivenessRepository.prototype.getAll.name, () => {
    it('should return all rows', async () => {
      const results = await repository.getAll()

      expect(results).toEqualUnsorted(
        DATA.map((e) => ({
          ...e,
        })),
      )
    })
  })

  describe(LivenessRepository.prototype.deleteAll.name, () => {
    it('should delete all rows', async () => {
      await repository.deleteAll()

      const results = await repository.getAll()

      expect(results).toEqual([])
    })
  })

  describe(LivenessRepository.prototype.deleteAfter.name, () => {
    it('should delete rows inserted after certain timestamp for given configuration id', async () => {
      await repository.deleteAll()

      const configurationId = LIVENESS_CONFIGS[0].id
      const records = [
        {
          timestamp: START.add(1, 'hours'),
          blockNumber: 12345,
          txHash: '0x1234567890abcdef',
          livenessId: configurationId,
        },
        {
          timestamp: START.add(2, 'hours'),
          blockNumber: 12346,
          txHash: '0xabcdef1234567890',
          livenessId: configurationId,
        },
        {
          timestamp: START.add(2, 'hours'),
          blockNumber: 12346,
          txHash: '0xabcdef1234567890',
          livenessId: LIVENESS_CONFIGS[1].id,
        },
      ]
      await repository.addMany(records)

      await repository.deleteAfter(configurationId, START.add(1, 'hours'))

      const result = await repository.getAll()

      expect(result).toEqual([records[0], records[2]])
    })
  })

  describe(LivenessRepository.prototype.getByProjectIdAndType.name, () => {
    it('should return rows with given project id and type', async () => {
      const results = await repository.getByProjectIdAndType(
        LIVENESS_CONFIGS[0].projectId,
        LIVENESS_CONFIGS[0].type,
        START.add(-1, 'hours'),
      )

      expect(results).toEqual([
        {
          timestamp: DATA[0].timestamp,
          type: LIVENESS_CONFIGS[0].type,
        },
      ])
    })
  })

  describe(
    LivenessRepository.prototype.findTransactionWithinTimeRange.name,
    () => {
      it('should return tx hash for given project id and timestamp when no exact hour', async () => {
        await repository.deleteAll()

        const configuration = LIVENESS_CONFIGS[0]
        const records = [
          {
            timestamp: UnixTime.fromDate(new Date('2021-01-01T10:30:00Z')),
            blockNumber: 12345,
            txHash: '0x1234567890abcdef',
            livenessId: configuration.id,
          },
          {
            timestamp: UnixTime.fromDate(new Date('2021-01-01T10:45:00Z')),
            blockNumber: 12346,
            txHash: '0xabcdef1234567890',
            livenessId: configuration.id,
          },
          {
            timestamp: UnixTime.fromDate(new Date('2021-01-01T11:01:00Z')),
            blockNumber: 12347,
            txHash: '0xabcdef1234567891',
            livenessId: configuration.id,
          },
        ]
        await repository.addMany(records)

        const result = await repository.findTransactionWithinTimeRange(
          configuration.projectId,
          UnixTime.fromDate(new Date('2021-01-01T11:00:00Z')),
          UnixTime.fromDate(new Date('2021-01-01T10:00:00Z')),
          configuration.type,
        )

        expect(result).toEqual({
          timestamp: records[1].timestamp,
          txHash: records[1].txHash,
        })
      })
      it('should return tx hash for given project id and timestamp inclusive hour', async () => {
        await repository.deleteAll()

        const configuration = LIVENESS_CONFIGS[0]
        const records = [
          {
            timestamp: UnixTime.fromDate(new Date('2021-01-01T10:00:00Z')),
            blockNumber: 12345,
            txHash: '0x1234567890abcdef',
            livenessId: configuration.id,
          },
          {
            timestamp: UnixTime.fromDate(new Date('2021-01-01T11:00:00Z')),
            blockNumber: 12346,
            txHash: '0xabcdef1234567890',
            livenessId: configuration.id,
          },
          {
            timestamp: UnixTime.fromDate(new Date('2021-01-01T12:00:00Z')),
            blockNumber: 12347,
            txHash: '0xabcdef1234567892',
            livenessId: configuration.id,
          },
        ]
        await repository.addMany(records)

        const result = await repository.findTransactionWithinTimeRange(
          configuration.projectId,
          UnixTime.fromDate(new Date('2021-01-01T11:00:00Z')),
          UnixTime.fromDate(new Date('2021-01-01T10:00:00Z')),
          configuration.type,
        )

        expect(result).toEqual({
          timestamp: records[1].timestamp,
          txHash: records[1].txHash,
        })
      })
      it('should return undefined when no tx hash for given project id', async () => {
        await repository.addMany([
          {
            timestamp: START.add(-2, 'hours'),
            blockNumber: 12346,
            txHash: '0x1234567890abcdff',
            livenessId: LIVENESS_CONFIGS[0].id,
          },
        ])
        const result = await repository.findTransactionWithinTimeRange(
          LIVENESS_CONFIGS[0].projectId,
          START.add(-8, 'hours'),
          START.add(-9, 'hours'),
          LIVENESS_CONFIGS[0].type,
        )

        expect(result).toEqual(undefined)
      })
    },
  )

  describe(
    LivenessRepository.prototype.getWithTypeDistinctTimestamp.name,
    () => {
      it('join and returns data with type', async () => {
        const result = await repository.getWithTypeDistinctTimestamp(
          LIVENESS_CONFIGS[0].projectId,
        )
        const expected = [
          {
            timestamp: DATA[0].timestamp,
            type: LIVENESS_CONFIGS[0].type,
          },
        ]

        expect(result).toEqual(expected)
      })

      it('filters out transactions with the same timestamp', async () => {
        await repository.deleteAll()
        const NEW_DATA = [
          {
            timestamp: START.add(-3, 'hours'),
            blockNumber: 12347,
            txHash: '0xabcdef1234567890',
          },
          {
            timestamp: START.add(-3, 'hours'),
            blockNumber: 12347,
            txHash: '0xabcdef1234567891',
          },
          {
            timestamp: START.add(-4, 'hours'),
            blockNumber: 12348,
            txHash: '0xabcdef1234567892',
          },
        ]
        await repository.addMany(
          NEW_DATA.map((e) => ({
            ...e,
            livenessId: LIVENESS_CONFIGS[2].id,
          })),
        )
        const result = await repository.getWithTypeDistinctTimestamp(
          LIVENESS_CONFIGS[2].projectId,
        )

        const expected = [
          {
            timestamp: NEW_DATA[1].timestamp,
            type: LIVENESS_CONFIGS[2].type,
          },
          {
            timestamp: NEW_DATA[2].timestamp,
            type: LIVENESS_CONFIGS[2].type,
          },
        ]
        expect(result).toEqualUnsorted(expected)
      })

      it('returns filtered records', async () => {
        await repository.deleteAll()
        const NEW_DATA = [
          {
            timestamp: START.add(-4, 'hours'),
            blockNumber: 12347,
            txHash: '0xabcdef1234567890',
          },
          {
            timestamp: START.add(-3, 'hours'),
            blockNumber: 12347,
            txHash: '0xabcdef1234567891',
          },
          {
            timestamp: START.add(-2, 'hours'),
            blockNumber: 12348,
            txHash: '0xabcdef1234567892',
          },
          {
            timestamp: START.add(-5, 'hours'),
            blockNumber: 12348,
            txHash: '0xabcdef1234567893',
          },
        ]

        await repository.addMany(
          NEW_DATA.map((e) => ({
            ...e,
            livenessId: LIVENESS_CONFIGS[2].id,
          })),
        )

        const result = await repository.getWithTypeDistinctTimestamp(
          LIVENESS_CONFIGS[2].projectId,
        )

        const type = LIVENESS_CONFIGS[2].type

        const expected = [
          {
            timestamp: NEW_DATA[2].timestamp,
            type,
          },
          {
            timestamp: NEW_DATA[1].timestamp,
            type,
          },
          {
            timestamp: NEW_DATA[0].timestamp,
            type,
          },
          {
            timestamp: NEW_DATA[3].timestamp,
            type,
          },
        ]

        expect(result).toEqual(expected)
      })
    },
  )
})
