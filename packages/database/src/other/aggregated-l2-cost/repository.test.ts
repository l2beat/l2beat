import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../../test/database'
import type { AggregatedL2CostRecord } from './entity'
import { AggregatedL2CostRepository } from './repository'

const NOW = UnixTime.now()

describeDatabase(AggregatedL2CostRepository.name, (db) => {
  const repository = db.aggregatedL2Cost

  beforeEach(async () => {
    await repository.deleteAll()
  })

  it(AggregatedL2CostRepository.prototype.upsertMany.name, async () => {
    const records = [record({ timestamp: NOW - 1 * UnixTime.HOUR }), record()]

    await repository.upsertMany(records)

    const result = await repository.getAll()
    expect(result).toEqual(records)
  })

  it(AggregatedL2CostRepository.prototype.deleteAfter.name, async () => {
    const records = [
      record({ timestamp: NOW - 1 * UnixTime.HOUR }),
      record(),
      record({ timestamp: NOW + 1 * UnixTime.HOUR }),
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
          record({ timestamp: NOW - 1 * UnixTime.HOUR }),
          record(),
          record({ timestamp: NOW + 1 * UnixTime.HOUR }),
        ]
        await repository.upsertMany(records)

        const results = await repository.getByProjectAndTimeRange(
          ProjectId('random'),
          [NOW - 7 * UnixTime.HOUR, NOW + 2 * UnixTime.HOUR],
        )

        expect(results).toEqualUnsorted(records)
      })

      it('should return all rows for given project id and since timestamp with exclusive to', async () => {
        const records = [
          record({ timestamp: NOW - 1 * UnixTime.HOUR }),
          record(),
          record({ timestamp: NOW + 1 * UnixTime.HOUR }),
        ]
        await repository.upsertMany(records)
        const results = await repository.getByProjectAndTimeRange(
          ProjectId('random'),
          [NOW - 1 * UnixTime.HOUR, NOW + 1 * UnixTime.HOUR],
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
          record({ timestamp: NOW - 1 * UnixTime.HOUR }),
          record(),
          record({ timestamp: NOW + 2 * UnixTime.HOUR }),
          record({ projectId: ProjectId('random2') }),
        ]
        await repository.upsertMany(records)

        const results = await repository.getByProjectsAndTimeRange(
          [ProjectId('random')],
          [NOW - 7 * UnixTime.HOUR, NOW + 2 * UnixTime.HOUR],
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
