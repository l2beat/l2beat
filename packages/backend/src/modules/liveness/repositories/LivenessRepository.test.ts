import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../../../test/database'
import { TrackedTxsConfigsRepository } from '../../tracked-txs/repositories/TrackedTxsConfigsRepository'
import { TRACKED_TXS_CONFIGS } from '../../tracked-txs/repositories/TrackedTxsConfigsRepository.test'
import { LivenessRecord, LivenessRepository } from './LivenessRepository'

describeDatabase(LivenessRepository.name, (database) => {
  const repository = new LivenessRepository(database, Logger.SILENT)
  const configRepository = new TrackedTxsConfigsRepository(
    database,
    Logger.SILENT,
  )

  const START = UnixTime.now()
  const DATA = [
    {
      timestamp: START.add(-1, 'hours'),
      blockNumber: 12345,
      txHash: '0x1234567890abcdef',
      trackedTxId: TRACKED_TXS_CONFIGS[0].uses[0].id,
    },
    {
      timestamp: START.add(-2, 'hours'),
      blockNumber: 12346,
      txHash: '0xabcdef1234567890',
      trackedTxId: TRACKED_TXS_CONFIGS[1].uses[0].id,
    },
    {
      timestamp: START.add(-3, 'hours'),
      blockNumber: 12347,
      txHash: '0x12345678901abcdef',
      trackedTxId: TRACKED_TXS_CONFIGS[2].uses[0].id,
    },
  ]

  beforeEach(async function () {
    this.timeout(10000)
    await configRepository.deleteAll()
    await configRepository.addMany(TRACKED_TXS_CONFIGS)
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
          trackedTxId: TRACKED_TXS_CONFIGS[0].uses[0].id,
        },
        {
          timestamp: START.add(-6, 'hours'),
          blockNumber: 12350,
          txHash: '0xabcdef1234567892',
          trackedTxId: TRACKED_TXS_CONFIGS[0].uses[0].id,
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
          trackedTxId: TRACKED_TXS_CONFIGS[0].uses[0].id,
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

      const configurationId = TRACKED_TXS_CONFIGS[0].uses[0].id
      const records: LivenessRecord[] = [
        {
          timestamp: START.add(1, 'hours'),
          blockNumber: 12345,
          txHash: '0x1234567890abcdef',
          trackedTxId: configurationId,
        },
        {
          timestamp: START.add(2, 'hours'),
          blockNumber: 12346,
          txHash: '0xabcdef1234567890',
          trackedTxId: configurationId,
        },
        {
          timestamp: START.add(2, 'hours'),
          blockNumber: 12346,
          txHash: '0xabcdef1234567890',
          trackedTxId: TRACKED_TXS_CONFIGS[1].uses[0].id,
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
        TRACKED_TXS_CONFIGS[0].projectId,
        TRACKED_TXS_CONFIGS[0].uses[0].subType,
        START.add(-1, 'hours'),
      )

      expect(results).toEqual([
        {
          timestamp: DATA[0].timestamp,
          subtype: TRACKED_TXS_CONFIGS[0].uses[0].subType,
        },
      ])
    })
  })

  describe(
    LivenessRepository.prototype.findTransactionWithinTimeRange.name,
    () => {
      it('should return tx hash for given project id and timestamp when no exact hour', async () => {
        await repository.deleteAll()

        const configuration = TRACKED_TXS_CONFIGS[0]
        const records: LivenessRecord[] = [
          {
            timestamp: UnixTime.fromDate(new Date('2021-01-01T10:30:00Z')),
            blockNumber: 12345,
            txHash: '0x1234567890abcdef',
            trackedTxId: configuration.uses[0].id,
          },
          {
            timestamp: UnixTime.fromDate(new Date('2021-01-01T10:45:00Z')),
            blockNumber: 12346,
            txHash: '0xabcdef1234567890',
            trackedTxId: configuration.uses[0].id,
          },
          {
            timestamp: UnixTime.fromDate(new Date('2021-01-01T11:01:00Z')),
            blockNumber: 12347,
            txHash: '0xabcdef1234567891',
            trackedTxId: configuration.uses[0].id,
          },
        ]
        await repository.addMany(records)

        const result = await repository.findTransactionWithinTimeRange(
          configuration.projectId,
          configuration.uses[0].subType,
          UnixTime.fromDate(new Date('2021-01-01T11:00:00Z')),
          UnixTime.fromDate(new Date('2021-01-01T10:00:00Z')),
        )

        expect(result).toEqual({
          txHash: records[1].txHash,
          timestamp: records[1].timestamp,
        })
      })

      it('should return tx hash for given project id and timestamp inclusive hour', async () => {
        await repository.deleteAll()

        const configuration = TRACKED_TXS_CONFIGS[0]
        const records: LivenessRecord[] = [
          {
            timestamp: UnixTime.fromDate(new Date('2021-01-01T10:00:00Z')),
            blockNumber: 12345,
            txHash: '0x1234567890abcdef',
            trackedTxId: configuration.uses[0].id,
          },
          {
            timestamp: UnixTime.fromDate(new Date('2021-01-01T11:00:00Z')),
            blockNumber: 12346,
            txHash: '0xabcdef1234567890',
            trackedTxId: configuration.uses[0].id,
          },
          {
            timestamp: UnixTime.fromDate(new Date('2021-01-01T12:00:00Z')),
            blockNumber: 12347,
            txHash: '0xabcdef1234567892',
            trackedTxId: configuration.uses[0].id,
          },
        ]
        await repository.addMany(records)

        const result = await repository.findTransactionWithinTimeRange(
          configuration.projectId,
          configuration.uses[0].subType,
          UnixTime.fromDate(new Date('2021-01-01T11:00:00Z')),
          UnixTime.fromDate(new Date('2021-01-01T10:00:00Z')),
        )

        expect(result).toEqual({
          txHash: records[1].txHash,
          timestamp: records[1].timestamp,
        })
      })

      it('should return undefined when no tx hash for given project id', async () => {
        await repository.addMany([
          {
            timestamp: START.add(-2, 'hours'),
            blockNumber: 12346,
            txHash: '0x1234567890abcdff',
            trackedTxId: TRACKED_TXS_CONFIGS[0].uses[0].id,
          },
        ])
        const result = await repository.findTransactionWithinTimeRange(
          TRACKED_TXS_CONFIGS[0].projectId,
          TRACKED_TXS_CONFIGS[0].uses[0].subType,
          START.add(-8, 'hours'),
          START.add(-9, 'hours'),
        )

        expect(result).toEqual(undefined)
      })
    },
  )

  describe(
    LivenessRepository.prototype.getWithSubtypeDistinctTimestamp.name,
    () => {
      it('join and returns data with type', async () => {
        const result = await repository.getWithSubtypeDistinctTimestamp(
          TRACKED_TXS_CONFIGS[0].projectId,
        )
        const expected = [
          {
            timestamp: DATA[0].timestamp,
            subtype: TRACKED_TXS_CONFIGS[0].uses[0].subType,
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
            trackedTxId: TRACKED_TXS_CONFIGS[2].uses[0].id,
          })),
        )
        const result = await repository.getWithSubtypeDistinctTimestamp(
          TRACKED_TXS_CONFIGS[2].projectId,
        )

        const expected = [
          {
            timestamp: NEW_DATA[1].timestamp,
            subtype: TRACKED_TXS_CONFIGS[2].uses[0].subType,
          },
          {
            timestamp: NEW_DATA[2].timestamp,
            subtype: TRACKED_TXS_CONFIGS[2].uses[0].subType,
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
            trackedTxId: TRACKED_TXS_CONFIGS[2].uses[0].id,
          })),
        )

        const result = await repository.getWithSubtypeDistinctTimestamp(
          TRACKED_TXS_CONFIGS[2].projectId,
        )

        const subtype = TRACKED_TXS_CONFIGS[2].uses[0].subType

        const expected = [
          {
            timestamp: NEW_DATA[2].timestamp,
            subtype,
          },
          {
            timestamp: NEW_DATA[1].timestamp,
            subtype,
          },
          {
            timestamp: NEW_DATA[0].timestamp,
            subtype,
          },
          {
            timestamp: NEW_DATA[3].timestamp,
            subtype,
          },
        ]

        expect(result).toEqual(expected)
      })
    },
  )
})
