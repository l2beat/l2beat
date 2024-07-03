import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { createTrackedTxId } from '@l2beat/shared'
import { describeDatabase } from '../../../../../test/database'
import { IndexerConfigurationRepository } from '../../../../../tools/uif/IndexerConfigurationRepository'
import {
  LivenessRecord,
  LivenessRecordWithSubtype,
  LivenessRepository,
} from './LivenessRepository'

describeDatabase(LivenessRepository.name, (knex, kysely) => {
  const oldRepo = new LivenessRepository(knex, Logger.SILENT)
  const oldConfigRepo = new IndexerConfigurationRepository(knex, Logger.SILENT)
  const newRepo = kysely.liveness
  const newConfigRepo = kysely.indexerConfiguration

  const txIdA = createTrackedTxId.random()
  const txIdB = createTrackedTxId.random()
  const txIdC = createTrackedTxId.random()

  suite(oldRepo, oldConfigRepo)
  suite(newRepo, newConfigRepo)

  function suite(
    repository: typeof oldRepo | typeof newRepo,
    configRepository: typeof oldConfigRepo | typeof newConfigRepo,
  ) {
    const START = UnixTime.now()
    const DATA = [
      {
        timestamp: START.add(-1, 'hours'),
        blockNumber: 12345,
        txHash: '0x1234567890abcdef',
        configurationId: txIdA,
      },
      {
        timestamp: START.add(-2, 'hours'),
        blockNumber: 12340,
        txHash: '0x1234567890abcdef',
        configurationId: txIdA,
      },
      {
        timestamp: START.add(-2, 'hours'),
        blockNumber: 12346,
        txHash: '0xabcdef1234567890',
        configurationId: txIdB,
      },
      {
        timestamp: START.add(-3, 'hours'),
        blockNumber: 12347,
        txHash: '0x12345678901abcdef',
        configurationId: txIdC,
      },
    ]

    const CONFIGS = [
      {
        indexerId: 'indexer',
        id: DATA[0].configurationId,
        minHeight: START.toNumber(),
        maxHeight: null,
        currentHeight: null,
        properties: JSON.stringify({
          projectId: 'project1',
          type: 'liveness',
          subtype: 'batchSubmissions',
        }),
      },
      {
        indexerId: 'indexer',
        id: DATA[2].configurationId,
        minHeight: START.toNumber(),
        maxHeight: null,
        currentHeight: null,
        properties: JSON.stringify({
          projectId: 'project2',
          type: 'liveness',
          subtype: 'batchSubmissions',
        }),
      },
      {
        indexerId: 'indexer',
        id: DATA[3].configurationId,
        minHeight: START.toNumber(),
        maxHeight: null,
        currentHeight: null,
        properties: JSON.stringify({
          projectId: 'project3',
          type: 'liveness',
          subtype: 'batchSubmissions',
        }),
      },
    ]

    beforeEach(async function () {
      this.timeout(10000)
      await configRepository.deleteAll()
      await configRepository.addOrUpdateMany(CONFIGS)

      await repository.deleteAll()
      await repository.addMany(DATA)
    })

    describe(LivenessRepository.prototype.addMany.name, () => {
      it('only new rows', async () => {
        const newRows = [
          {
            timestamp: START.add(-5, 'hours'),
            blockNumber: 12349,
            txHash: '0x1234567890abcdef1',
            configurationId: txIdA,
          },
          {
            timestamp: START.add(-6, 'hours'),
            blockNumber: 12350,
            txHash: '0xabcdef1234567892',
            configurationId: txIdA,
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
            configurationId: txIdA,
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

    describe(LivenessRepository.prototype.deleteFromById.name, () => {
      it('should delete rows inserted after certain timestamp for given configuration id inclusively', async () => {
        await repository.deleteAll()

        const records: LivenessRecord[] = [
          {
            timestamp: START,
            blockNumber: 12345,
            txHash: '0x1234567890abcdef',
            configurationId: txIdA,
          },
          {
            timestamp: START.add(1, 'hours'),
            blockNumber: 12345,
            txHash: '0x1234567890abcdef',
            configurationId: txIdA,
          },
          {
            timestamp: START.add(2, 'hours'),
            blockNumber: 12346,
            txHash: '0xabcdef1234567890',
            configurationId: txIdA,
          },
          {
            timestamp: START.add(2, 'hours'),
            blockNumber: 12346,
            txHash: '0xabcdef1234567890',
            configurationId: txIdB,
          },
        ]
        await repository.addMany(records)

        await repository.deleteFromById(txIdA, START.add(1, 'hours'))

        const result = await repository.getAll()

        expect(result).toEqual([records[0], records[3]])
      })
    })

    describe(LivenessRepository.prototype.getByProjectIdAndType.name, () => {
      it('should return rows with given project id and type', async () => {
        const results = await repository.getByProjectIdAndType(
          ProjectId('project1'),
          'batchSubmissions',
          START.add(-1, 'hours'),
        )

        expect(results).toEqual([
          {
            timestamp: DATA[0].timestamp,
            subtype: 'batchSubmissions',
          },
        ])
      })
    })

    describe(
      LivenessRepository.prototype
        .getTransactionsWithinTimeRangeByConfigurationsIds.name,
      () => {
        it('should return rows within given time range', async () => {
          const results =
            await repository.getTransactionsWithinTimeRangeByConfigurationsIds(
              [DATA[0].configurationId, DATA[1].configurationId],
              START.add(-2, 'hours'),
              START.add(0, 'hours'),
            )

          expect(results).toEqualUnsorted([DATA[0], DATA[1]])
        })
      },
    )

    describe(
      LivenessRepository.prototype.getWithSubtypeDistinctTimestamp.name,
      () => {
        it('join and returns data with type', async () => {
          const result = await repository.getWithSubtypeDistinctTimestamp(
            ProjectId('project1'),
          )
          const expected: LivenessRecordWithSubtype[] = [
            {
              timestamp: DATA[0].timestamp,
              subtype: 'batchSubmissions',
            },
            {
              timestamp: DATA[1].timestamp,
              subtype: 'batchSubmissions',
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
              configurationId: txIdC,
            })),
          )
          const result = await repository.getWithSubtypeDistinctTimestamp(
            ProjectId('project3'),
          )

          const expected: LivenessRecordWithSubtype[] = [
            {
              timestamp: NEW_DATA[1].timestamp,
              subtype: 'batchSubmissions',
            },
            {
              timestamp: NEW_DATA[2].timestamp,
              subtype: 'batchSubmissions',
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
              configurationId: txIdC,
            })),
          )

          const result = await repository.getWithSubtypeDistinctTimestamp(
            ProjectId('project3'),
          )

          const subtype = 'batchSubmissions'

          const expected: LivenessRecordWithSubtype[] = [
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
  }
})
