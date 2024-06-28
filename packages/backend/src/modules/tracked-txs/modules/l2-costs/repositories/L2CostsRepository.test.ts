import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describe } from 'mocha'

import { createTrackedTxId } from '@l2beat/shared'
import { describeDatabase } from '../../../../../test/database'
import { IndexerConfigurationRepository } from '../../../../../tools/uif/IndexerConfigurationRepository'
import { L2CostsRecord, L2CostsRepository } from './L2CostsRepository'

describeDatabase(L2CostsRepository.name, (knex, kysely) => {
  const oldRepo = new L2CostsRepository(knex, Logger.SILENT)
  const oldConfigRepo = new IndexerConfigurationRepository(knex, Logger.SILENT)
  const newRepo = kysely.l2Cost
  const newConfigRepo = kysely.indexerConfiguration

  // Extracted since we have single describe and two running contexts
  // in tandem with database constraints and data integrity
  // it results in failed constraints and errors - simple race conditions
  const txIdA = createTrackedTxId.random()
  const txIdB = createTrackedTxId.random()
  const txIdC = createTrackedTxId.random()
  const txIdD = createTrackedTxId.random()

  suite(oldRepo, oldConfigRepo)
  suite(newRepo, newConfigRepo)

  function suite(
    repository: typeof oldRepo | typeof newRepo,
    configRepository: typeof oldConfigRepo | typeof newConfigRepo,
  ) {
    const START = UnixTime.now()
    const DATA: L2CostsRecord[] = [
      {
        timestamp: START,
        txHash: '0x1',
        configurationId: txIdA,
        gasUsed: 100,
        gasPrice: 1n,
        calldataLength: 100,
        calldataGasUsed: 100,
        blobGasPrice: null,
        blobGasUsed: null,
      },
      {
        timestamp: START.add(-1, 'hours'),
        txHash: '0x2',
        configurationId: txIdB,
        gasUsed: 200,
        gasPrice: 2n,
        calldataLength: 200,
        calldataGasUsed: 200,
        blobGasPrice: 3n,
        blobGasUsed: 300,
      },
      {
        timestamp: START.add(-2, 'hours'),
        txHash: '0x3',
        configurationId: txIdC,
        gasUsed: 150,
        gasPrice: 2n,
        calldataLength: 400,
        calldataGasUsed: 400,
        blobGasPrice: null,
        blobGasUsed: null,
      },
    ]

    beforeEach(async function () {
      this.timeout(10000)
      await configRepository.deleteAll()
      await configRepository.addOrUpdateMany(
        DATA.map((d, i) => ({
          indexerId: 'indexer',
          id: d.configurationId,
          minHeight: START.toNumber(),
          maxHeight: null,
          currentHeight: null,
          properties: JSON.stringify({ projectId: `project-${i}` }),
        })),
      )
      await repository.deleteAll()
      await repository.addMany(DATA)
    })

    afterEach(async () => {
      await repository.deleteAll()
      await configRepository.deleteAll()
    })

    describe(L2CostsRepository.prototype.addMany.name, () => {
      it('should return only new row', async () => {
        const newRow: L2CostsRecord[] = [
          {
            timestamp: START,
            txHash: '0x4',
            configurationId: DATA[0].configurationId,
            gasUsed: 100,
            gasPrice: 1n,
            calldataLength: 100,
            calldataGasUsed: 100,
            blobGasPrice: null,
            blobGasUsed: null,
          },
        ]
        await repository.addMany(newRow)

        const results = await repository.getAll()
        expect(results).toEqualUnsorted([...DATA, ...newRow])
      })

      it('empty array not to be rejected', async () => {
        await expect(repository.addMany([])).not.toBeRejected()
      })
    })

    describe(
      L2CostsRepository.prototype.getWithProjectIdByTimeRange.name,
      () => {
        it('should return all rows for given time range', async () => {
          const results = await repository.getWithProjectIdByTimeRange([
            START.add(-2, 'hours'),
            START.add(-1, 'minutes'),
          ])

          expect(results).toEqualUnsorted([
            {
              projectId: ProjectId('project-1'),
              ...DATA[1],
            },
            {
              projectId: ProjectId('project-2'),
              ...DATA[2],
            },
          ])
        })

        it('should return empty array', async () => {
          const results = await repository.getWithProjectIdByTimeRange([
            START.add(5, 'hours'),
            START.add(6, 'hours'),
          ])

          expect(results).toEqual([])
        })
      },
    )

    describe(L2CostsRepository.prototype.getAll.name, () => {
      it('should return all rows', async () => {
        const results = await repository.getAll()

        expect(results).toEqualUnsorted(DATA)
      })
    })

    describe(L2CostsRepository.prototype.deleteAll.name, () => {
      it('should delete all rows', async () => {
        await repository.deleteAll()

        const results = await repository.getAll()

        expect(results).toEqual([])
      })
    })

    describe(L2CostsRepository.prototype.deleteFromById.name, () => {
      it('should delete rows inserted after certain timestamp for given configuration id', async () => {
        await repository.deleteAll()

        const records: L2CostsRecord[] = [
          {
            timestamp: START.add(-1, 'hours'),
            txHash: '0x4',
            configurationId: txIdD,
            gasUsed: 150,
            gasPrice: 2n,
            calldataLength: 400,
            calldataGasUsed: 400,
            blobGasPrice: null,
            blobGasUsed: null,
          },
          {
            timestamp: START.add(1, 'hours'),
            txHash: '0x45',
            configurationId: txIdD,
            gasUsed: 150,
            gasPrice: 2n,
            calldataLength: 400,
            calldataGasUsed: 400,
            blobGasPrice: null,
            blobGasUsed: null,
          },
          {
            timestamp: START.add(2, 'hours'),
            txHash: '0x5',
            configurationId: txIdD,
            gasUsed: 150,
            gasPrice: 2n,
            calldataLength: 400,
            calldataGasUsed: 400,
            blobGasPrice: null,
            blobGasUsed: null,
          },
        ]

        await configRepository.addOrUpdateMany([
          {
            id: txIdD,
            indexerId: 'indexer',
            minHeight: START.toNumber(),
            properties: '',
            currentHeight: null,
            maxHeight: null,
          },
        ])
        await repository.addMany(records)

        await repository.deleteFromById(txIdD, START)

        const result = await repository.getAll()

        expect(result).toEqual([records[0]])
      })
    })
  }
})
