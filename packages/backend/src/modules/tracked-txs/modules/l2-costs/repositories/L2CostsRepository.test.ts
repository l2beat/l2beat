import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { range } from 'lodash'

import { describeDatabase } from '../../../../../test/database'
import { TrackedTxsConfigsRepository } from '../../../repositories/TrackedTxsConfigsRepository'
import { TrackedTxId } from '../../../types/TrackedTxId'
import { L2CostsRecord, L2CostsRepository } from './L2CostsRepository'

describeDatabase(L2CostsRepository.name, (database) => {
  const repository = new L2CostsRepository(database, Logger.SILENT)
  const configRepository = new TrackedTxsConfigsRepository(
    database,
    Logger.SILENT,
  )

  const START = UnixTime.now()
  const DATA: L2CostsRecord[] = [
    {
      timestamp: START,
      txHash: '0x1',
      trackedTxId: TrackedTxId.random(),
      data: {
        type: 2,
        gasUsed: 100,
        gasPrice: 1,
        calldataLength: 100,
        calldataGasUsed: 100,
      },
    },
    {
      timestamp: START.add(-1, 'hours'),
      txHash: '0x2',
      trackedTxId: TrackedTxId.random(),
      data: {
        type: 3,
        gasUsed: 200,
        gasPrice: 2,
        calldataLength: 200,
        calldataGasUsed: 200,
        blobGasPrice: 3,
        blobGasUsed: 300,
      },
    },
    {
      timestamp: START.add(-2, 'hours'),
      txHash: '0x3',
      trackedTxId: TrackedTxId.random(),
      data: {
        type: 2,
        gasUsed: 150,
        gasPrice: 2,
        calldataLength: 400,
        calldataGasUsed: 400,
      },
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
          data: {
            type: 2,
            gasUsed: 100,
            gasPrice: 1,
            calldataLength: 100,
            calldataGasUsed: 100,
          },
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
    L2CostsRepository.prototype.findCountByProjectAndTimeRange.name,
    () => {
      it('should return count of rows for given project id and range timestamp', async () => {
        const results = await repository.findCountByProjectAndTimeRange(
          ProjectId('project-2'),
          [START.add(-2, 'hours'), START.add(1, 'hours')],
        )

        expect(results).toEqual({ count: 2 })
      })

      it('should return count of rows equal 0 for given project id and range timestamp', async () => {
        const results = await repository.findCountByProjectAndTimeRange(
          ProjectId('project-2'),
          [START.add(1, 'hours'), START.add(2, 'hours')],
        )

        expect(results).toEqual({ count: 0 })
      })
    },
  )

  describe(
    L2CostsRepository.prototype.getByProjectAndTimeRangePaginated.name,
    () => {
      it('should return limited number of rows', async () => {
        const trackedTxId = TrackedTxId.random()
        await configRepository.deleteAll()
        await configRepository.addMany([
          {
            id: trackedTxId,
            projectId: ProjectId('project-1'),
            type: 'liveness',
            sinceTimestampInclusive: START,
            debugInfo: '',
          },
        ])
        await repository.deleteAll()
        const DATA = range(7).map((i) => ({
          timestamp: START.add(-i, 'hours'),
          txHash: '0x1',
          trackedTxId: trackedTxId,
          data: {
            type: 2 as const,
            gasUsed: 100,
            gasPrice: 1,
            calldataLength: 100,
            calldataGasUsed: 100,
          },
        }))
        await repository.addMany(DATA)

        const results = await repository.getByProjectAndTimeRangePaginated(
          ProjectId('project-1'),
          [START.add(-7, 'hours'), START.add(1, 'hours')],
          0,
          5,
        )

        expect(results).toEqualUnsorted(DATA.slice(2, 8))
      })

      it('should return all rows for given project id and since timestamp with exclusive to', async () => {
        const results = await repository.getByProjectAndTimeRangePaginated(
          ProjectId('project-2'),
          [START.add(-1, 'days'), START],
          0,
          5,
        )

        expect(results).toEqual([DATA[2]])
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

  describe(L2CostsRepository.prototype.getByType.name, () => {
    it('returns all records of type 2 tx', async () => {
      const result = await repository.getByType(2)
      expect(result).toEqual([DATA[0], DATA[2]] as L2CostsRecord<2>[])
    })

    it('returns all records of type 3 tx', async () => {
      const result = await repository.getByType(3)
      expect(result).toEqual([DATA[1]] as L2CostsRecord<3>[])
    })
  })

  describe(L2CostsRepository.prototype.deleteFrom.name, () => {
    it('should delete rows inserted after certain timestamp for given configuration id', async () => {
      await repository.deleteAll()
      const trackedTxId = TrackedTxId.random()

      const records: L2CostsRecord[] = [
        {
          timestamp: START.add(-1, 'hours'),
          txHash: '0x4',
          trackedTxId,
          data: {
            type: 2,
            gasUsed: 150,
            gasPrice: 2,
            calldataLength: 400,
            calldataGasUsed: 400,
          },
        },
        {
          timestamp: START.add(1, 'hours'),
          txHash: '0x4',
          trackedTxId,
          data: {
            type: 2,
            gasUsed: 150,
            gasPrice: 2,
            calldataLength: 400,
            calldataGasUsed: 400,
          },
        },
        {
          timestamp: START.add(2, 'hours'),
          txHash: '0x5',
          trackedTxId,
          data: {
            type: 2,
            gasUsed: 150,
            gasPrice: 2,
            calldataLength: 400,
            calldataGasUsed: 400,
          },
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

      await repository.deleteFrom(trackedTxId, START)

      const result = await repository.getAll()

      expect(result).toEqual([records[0]])
    })
  })
})
