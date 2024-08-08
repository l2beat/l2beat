import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../../test/database'
import { AggregatedL2CostRecord } from './entity'
import { AggregatedL2CostRepository } from './repository'

const NOW = UnixTime.now()

describeDatabase(AggregatedL2CostRepository.name, (db) => {
  const repository = db.aggregatedL2Cost

  beforeEach(async () => {
    await repository.deleteAll()
  })

  it(AggregatedL2CostRepository.prototype.upsertMany.name, async () => {
    const records = [record({ timestamp: NOW.add(-1, 'hours') }), record()]

    await repository.upsertMany(records)

    const result = await repository.getAll()
    expect(result).toEqual(records)
  })

  it(AggregatedL2CostRepository.prototype.deleteAfter.name, async () => {
    const records = [
      record({ timestamp: NOW.add(-1, 'hours') }),
      record(),
      record({ timestamp: NOW.add(1, 'hours') }),
    ]
    await repository.upsertMany(records)

    await repository.deleteAfter(NOW)

    const result = await repository.getAll()
    expect(result).toEqual([records[0]!, records[1]!])
  })

  describe(
    AggregatedL2CostRepository.prototype.getByProjectAndTimeRange.name,
    () => {
      it('should return all rows for given project', async () => {
        await repository.deleteAll()
        const records = [
          record({ timestamp: NOW.add(-1, 'hours') }),
          record(),
          record({ timestamp: NOW.add(1, 'hours') }),
        ]
        await repository.upsertMany(records)

        const results = await repository.getByProjectAndTimeRange(
          ProjectId('random'),
          [NOW.add(-7, 'hours'), NOW.add(2, 'hours')],
        )

        expect(results).toEqualUnsorted(records)
      })

      it('should return all rows for given project id and since timestamp with exclusive to', async () => {
        const records = [
          record({ timestamp: NOW.add(-1, 'hours') }),
          record(),
          record({ timestamp: NOW.add(1, 'hours') }),
        ]
        await repository.upsertMany(records)
        const results = await repository.getByProjectAndTimeRange(
          ProjectId('random'),
          [NOW.add(-1, 'hours'), NOW.add(1, 'hours')],
        )

        expect(results).toEqual(records.slice(0, 2))
      })
    },
  )

  describe(
    AggregatedL2CostRepository.prototype.getByProjectsAndTimeRange.name,
    () => {
      it('should return all rows for given projects and time range', async () => {
        const records = [
          record({ timestamp: NOW.add(-1, 'hours') }),
          record(),
          record({ timestamp: NOW.add(2, 'hours') }),
          record({ projectId: ProjectId('random2') }),
        ]
        await repository.upsertMany(records)

        const results = await repository.getByProjectsAndTimeRange(
          [ProjectId('random')],
          [NOW.add(-7, 'hours'), NOW.add(2, 'hours')],
        )

        expect(results).toEqual(records.slice(0, 2))
      })
    },
  )
})

function record(
  data?: Partial<AggregatedL2CostRecord>,
): AggregatedL2CostRecord {
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
    overheadGas: 1,
    overheadGasEth: 1,
    overheadGasUsd: 1,
    ...data,
  }
}
