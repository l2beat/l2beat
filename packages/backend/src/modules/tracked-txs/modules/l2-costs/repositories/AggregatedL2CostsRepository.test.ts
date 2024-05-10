import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../../../../../test/database'
import {
  AggregatedL2CostsRecord,
  AggregatedL2CostsRepository,
} from './AggregatedL2CostsRepository'

const NOW = UnixTime.now()
describeDatabase(AggregatedL2CostsRepository.name, (database) => {
  const repository = new AggregatedL2CostsRepository(database, Logger.SILENT)

  beforeEach(async () => {
    await repository.deleteAll()
  })

  it(AggregatedL2CostsRepository.prototype.addMany.name, async () => {
    const records = [record(), record()]

    await repository.addMany(records)

    const result = await repository.getAll()
    expect(result).toEqual(records)
  })

  it(AggregatedL2CostsRepository.prototype.deleteAfter.name, async () => {
    const records = [
      record({ timestamp: NOW.add(-1, 'hours') }),
      record(),
      record({ timestamp: NOW.add(1, 'hours') }),
    ]
    await repository.addMany(records)

    await repository.deleteAfter(NOW)

    const result = await repository.getAll()
    expect(result).toEqual([records[0], records[1]])
  })

  describe(
    AggregatedL2CostsRepository.prototype.findCountByProjectAndTimeRange.name,
    () => {
      it('should return count of rows for given project id and range timestamp', async () => {
        const records = [
          record({ timestamp: NOW.add(-1, 'hours') }),
          record(),
          record({ timestamp: NOW.add(1, 'hours') }),
        ]
        await repository.addMany(records)

        const results = await repository.findCountByProjectAndTimeRange(
          ProjectId('random'),
          [NOW.add(-2, 'hours'), NOW.add(1, 'hours')],
        )

        expect(results).toEqual({ count: 2 })
      })

      it('should return count of rows equal 0 for given project id and range timestamp', async () => {
        const records = [
          record({ timestamp: NOW.add(-1, 'hours') }),
          record(),
          record({ timestamp: NOW.add(1, 'hours') }),
        ]
        await repository.addMany(records)

        const results = await repository.findCountByProjectAndTimeRange(
          ProjectId('random2'),
          [NOW.add(1, 'hours'), NOW.add(2, 'hours')],
        )

        expect(results).toEqual({ count: 0 })
      })
    },
  )

  describe(
    AggregatedL2CostsRepository.prototype.getByProjectAndTimeRangePaginated
      .name,
    () => {
      it('should return limited number of rows', async () => {
        await repository.deleteAll()
        const records = [
          record({ timestamp: NOW.add(-1, 'hours') }),
          record(),
          record({ timestamp: NOW.add(1, 'hours') }),
        ]
        await repository.addMany(records)

        const results = await repository.getByProjectAndTimeRangePaginated(
          ProjectId('random'),
          [NOW.add(-7, 'hours'), NOW.add(2, 'hours')],
          0,
          2,
        )

        expect(results).toEqualUnsorted(records.slice(0, 2))
      })

      it('should return all rows for given project id and since timestamp with exclusive to', async () => {
        const records = [
          record({ timestamp: NOW.add(-1, 'hours') }),
          record(),
          record({ timestamp: NOW.add(1, 'hours') }),
        ]
        await repository.addMany(records)
        const results = await repository.getByProjectAndTimeRangePaginated(
          ProjectId('random'),
          [NOW.add(-1, 'hours'), NOW.add(1, 'hours')],
          0,
          5,
        )

        expect(results).toEqual(records.slice(0, 2))
      })
    },
  )
})

function record(
  data?: Partial<AggregatedL2CostsRecord>,
): AggregatedL2CostsRecord {
  return {
    timestamp: NOW,
    projectId: ProjectId('random'),
    totalGas: 1,
    totalGasEth: 1,
    totalGasUsd: 1,
    blobsGas: 1,
    blobsGasEth: 1,
    blobsGasUsd: 1,
    calldataGas: 1,
    calldataGasEth: 1,
    calldataGasUsd: 1,
    computeGas: 1,
    computeGasEth: 1,
    computeGasUsd: 1,
    overheadGasEth: 1,
    overheadGasUsd: 1,
    ...data,
  }
}
