import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describe } from 'mocha'

import { describeDatabase } from '../../../../../test/database'
import { TrackedTxsConfigsRepository } from '../../../repositories/TrackedTxsConfigsRepository'
import { TrackedTxId } from '../../../types/TrackedTxId'
import { L2CostsRecord, L2CostsRepository } from './L2CostsRepository'

describeDatabase(L2CostsRepository.name, (knex, kysely) => {
  const oldRepo = new L2CostsRepository(knex, Logger.SILENT)
  const oldConfigRepo = new TrackedTxsConfigsRepository(knex, Logger.SILENT)
  const newRepo = kysely.l2Cost
  const newConfigRepo = kysely.trackedTxConfig

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
        trackedTxId: TrackedTxId.random(),
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
        trackedTxId: TrackedTxId.random(),
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
        trackedTxId: TrackedTxId.random(),
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
      await configRepository.addMany(
        DATA.map((d, i) => ({
          id: d.trackedTxId,
          projectId: ProjectId(`project-${i % 2 ? 1 : 2}`),
          type: 'liveness',
          sinceTimestampInclusive: START,
          debugInfo: '',
        })),
      )
      await repository.deleteAll()
      await repository.addMany(DATA)
    })

    describe(L2CostsRepository.prototype.addMany.name, () => {
      it('should return only new row', async () => {
        const newRow: L2CostsRecord[] = [
          {
            timestamp: START,
            txHash: '0x4',
            trackedTxId: DATA[0].trackedTxId,
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
        const trackedTxId = TrackedTxId.random()

        const records: L2CostsRecord[] = [
          {
            timestamp: START.add(-1, 'hours'),
            txHash: '0x4',
            trackedTxId,
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
            trackedTxId,
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
            trackedTxId,
            gasUsed: 150,
            gasPrice: 2n,
            calldataLength: 400,
            calldataGasUsed: 400,
            blobGasPrice: null,
            blobGasUsed: null,
          },
        ]

        await configRepository.addMany([
          {
            id: trackedTxId,
            projectId: ProjectId('project'),
            type: 'liveness',
            sinceTimestampInclusive: START,
            debugInfo: '',
          },
        ])
        await repository.addMany(records)

        await repository.deleteFromById(trackedTxId, START)

        const result = await repository.getAll()

        expect(result).toEqual([records[0]])
      })
    })
  }
})
