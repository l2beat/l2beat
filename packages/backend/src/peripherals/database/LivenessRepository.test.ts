import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { setupDatabaseTestSuite } from '../../test/database'
import { LivenessConfigurationRepository } from './LivenessConfigurationRepository'
import { LIVENESS_CONFIGS } from './LivenessConfigurationRepository.test'
import { LivenessRecord, LivenessRepository } from './LivenessRepository'

describe(LivenessRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
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
    },
    {
      timestamp: START.add(-2, 'hours'),
      blockNumber: 12346,
      txHash: '0xabcdef1234567890',
    },
    {
      timestamp: START.add(-3, 'hours'),
      blockNumber: 12347,
      txHash: '0x12345678901abcdef',
    },
  ]
  let ids: number[]

  beforeEach(async function () {
    this.timeout(10000)
    await configRepository.deleteAll()
    ids = await configRepository.addMany(LIVENESS_CONFIGS)
    await repository.deleteAll()
    await repository.addMany(
      DATA.map((e, i) => ({
        ...e,
        livenessConfigurationId: ids[i],
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
          livenessConfigurationId: ids[0],
        },
        {
          timestamp: START.add(-6, 'hours'),
          blockNumber: 12350,
          txHash: '0xabcdef1234567892',
          livenessConfigurationId: ids[1],
        },
      ]
      await repository.addMany(newRows)

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        ...DATA.map((e, i) => ({
          ...e,
          livenessConfigurationId: ids[i],
        })),
        ...newRows,
      ])
    })

    it('empty array', async () => {
      await expect(repository.addMany([])).not.toBeRejected()
    })

    it('big query', async () => {
      const records: LivenessRecord[] = []
      for (let i = 5; i < 15_000; i++) {
        records.push({
          timestamp: START.add(-i, 'hours'),
          blockNumber: i,
          txHash: `0xabcdef1234567892${i}`,
          livenessConfigurationId: ids[0],
        })
      }
      await expect(repository.addMany(records)).not.toBeRejected()
    })
  })

  describe(LivenessRepository.prototype.getAll.name, () => {
    it('should return all rows', async () => {
      const results = await repository.getAll()

      expect(results).toEqualUnsorted(
        DATA.map((e, i) => ({
          ...e,
          livenessConfigurationId: ids[i],
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
    it('should delete rows inserted after certain timestamp', async () => {
      await repository.deleteAll()

      const configurationId = ids[0]
      const records = [
        {
          timestamp: START.add(1, 'hours'),
          blockNumber: 12345,
          txHash: '0x1234567890abcdef',
          livenessConfigurationId: configurationId,
        },
        {
          timestamp: START.add(2, 'hours'),
          blockNumber: 12346,
          txHash: '0xabcdef1234567890',
          livenessConfigurationId: configurationId,
        },
        {
          timestamp: START.add(2, 'hours'),
          blockNumber: 12346,
          txHash: '0xabcdef1234567890',
          livenessConfigurationId: ids[1],
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
            livenessConfigurationId: ids[2],
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
    },
  )
})
