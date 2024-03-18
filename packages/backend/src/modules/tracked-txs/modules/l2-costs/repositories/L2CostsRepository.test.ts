import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

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
      DATA.map((d) => ({
        id: d.trackedTxId,
        projectId: ProjectId('project'),
        type: 'liveness',
        sinceTimestampInclusive: START,
        debugInfo: '',
      })),
    )
    await repository.deleteAll()
    await repository.addMany(DATA)
  })

  describe(L2CostsRepository.prototype.addMany.name, () => {
    it('only new row', async () => {
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

    it('empty array', async () => {
      await expect(repository.addMany([])).not.toBeRejected()
    })
  })

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

  describe(L2CostsRepository.prototype.deleteAfter.name, () => {
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

      await repository.deleteAfter(trackedTxId, START)

      const result = await repository.getAll()

      expect(result).toEqual([records[0]])
    })
  })
})
