import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type AggregatedL2CostRecord,
  AggregatedL2CostRepository,
  type SummedL2CostRecord,
} from './AggregatedL2CostRepository'

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

  describe(
    AggregatedL2CostRepository.prototype.getSummedByProjectsAndTimeRange.name,
    () => {
      const DAY = UnixTime.toStartOf(NOW, 'day')

      it('sums rows of given projects into resolution buckets', async () => {
        await repository.upsertMany([
          record({ projectId: ProjectId('a'), timestamp: DAY - UnixTime.HOUR }),
          record({
            projectId: ProjectId('a'),
            timestamp: DAY + UnixTime.HOUR,
            blobsGas: null,
            blobsGasEth: null,
            blobsGasUsd: null,
            calldataGasUsd: 16_777_216,
          }),
          record({
            projectId: ProjectId('b'),
            timestamp: DAY + 5 * UnixTime.HOUR,
            blobsGas: 2,
            calldataGasUsd: 1,
          }),
          record({ projectId: ProjectId('c'), timestamp: DAY }),
          record({ projectId: ProjectId('a'), timestamp: DAY + UnixTime.DAY }),
        ])

        const result = await repository.getSummedByProjectsAndTimeRange(
          [ProjectId('a'), ProjectId('b')],
          [DAY - UnixTime.DAY, DAY + UnixTime.DAY],
          'day',
        )

        expect(result).toEqual([
          summed({
            timestamp: DAY - UnixTime.DAY,
            lastTimestamp: DAY - UnixTime.HOUR,
          }),
          summed({
            timestamp: DAY,
            lastTimestamp: DAY + 5 * UnixTime.HOUR,
            blobsGas: 2,
            blobsGasEth: 1,
            blobsGasUsd: 1,
            calldataGas: 2,
            calldataGasEth: 2,
            calldataGasUsd: 16_777_217,
            computeGas: 2,
            computeGasEth: 2,
            computeGasUsd: 2,
            overheadGas: 2,
            overheadGasEth: 2,
            overheadGasUsd: 2,
          }),
        ])
      })

      it('keeps blobs null when no row in a bucket has them', async () => {
        await repository.upsertMany([
          record({
            timestamp: DAY,
            blobsGas: null,
            blobsGasEth: null,
            blobsGasUsd: null,
          }),
        ])

        const result = await repository.getSummedByProjectsAndTimeRange(
          [ProjectId('random')],
          [null, DAY + UnixTime.DAY],
          'day',
        )

        expect(result).toEqual([
          summed({
            timestamp: DAY,
            lastTimestamp: DAY,
            blobsGas: null,
            blobsGasEth: null,
            blobsGasUsd: null,
          }),
        ])
      })

      it('buckets by six hours from the epoch', async () => {
        await repository.upsertMany([
          record({ timestamp: DAY + UnixTime.HOUR }),
          record({ timestamp: DAY + 5 * UnixTime.HOUR }),
          record({ timestamp: DAY + 7 * UnixTime.HOUR }),
        ])

        const result = await repository.getSummedByProjectsAndTimeRange(
          [ProjectId('random')],
          [null, DAY + UnixTime.DAY],
          'six hours',
        )

        expect(result.map((r) => [r.timestamp, r.lastTimestamp])).toEqual([
          [DAY, DAY + 5 * UnixTime.HOUR],
          [DAY + 6 * UnixTime.HOUR, DAY + 7 * UnixTime.HOUR],
        ])
      })

      it('returns nothing for an empty project list', async () => {
        await repository.upsertMany([record()])

        const result = await repository.getSummedByProjectsAndTimeRange(
          [],
          [null, NOW + UnixTime.DAY],
          'day',
        )

        expect(result).toEqual([])
      })
    },
  )

  describe(AggregatedL2CostRepository.prototype.checkIfExists.name, () => {
    it('is true when the project has any record', async () => {
      await repository.upsertMany([record({ projectId: ProjectId('a') })])
      expect(await repository.checkIfExists(ProjectId('a'))).toEqual(true)
    })

    it('is scoped to the project', async () => {
      await repository.upsertMany([record({ projectId: ProjectId('a') })])
      expect(await repository.checkIfExists(ProjectId('b'))).toEqual(false)
    })

    it('only counts records at or after fromInclusive', async () => {
      await repository.upsertMany([
        record({ projectId: ProjectId('a'), timestamp: NOW - UnixTime.DAY }),
      ])
      expect(await repository.checkIfExists(ProjectId('a'), NOW)).toEqual(false)
      expect(
        await repository.checkIfExists(ProjectId('a'), NOW - UnixTime.DAY),
      ).toEqual(true)
    })
  })

  describe(
    AggregatedL2CostRepository.prototype.getFirstTimestampByProjects.name,
    () => {
      it('returns the earliest timestamp across the given projects', async () => {
        await repository.upsertMany([
          record({ projectId: ProjectId('a'), timestamp: NOW }),
          record({
            projectId: ProjectId('a'),
            timestamp: NOW - 2 * UnixTime.HOUR,
          }),
          record({
            projectId: ProjectId('b'),
            timestamp: NOW - 5 * UnixTime.HOUR,
          }),
        ])

        const result = await repository.getFirstTimestampByProjects([
          ProjectId('a'),
          ProjectId('b'),
        ])

        expect(result).toEqual(NOW - 5 * UnixTime.HOUR)
      })

      it('is scoped to the given projects', async () => {
        await repository.upsertMany([
          record({ projectId: ProjectId('a'), timestamp: NOW }),
          record({
            projectId: ProjectId('b'),
            timestamp: NOW - 5 * UnixTime.HOUR,
          }),
        ])

        const result = await repository.getFirstTimestampByProjects([
          ProjectId('a'),
        ])

        expect(result).toEqual(NOW)
      })

      it('returns undefined when there are no matching records', async () => {
        const result = await repository.getFirstTimestampByProjects([
          ProjectId('missing'),
        ])

        expect(result).toEqual(undefined)
      })

      it('returns undefined for an empty project list', async () => {
        await repository.upsertMany([record()])

        const result = await repository.getFirstTimestampByProjects([])

        expect(result).toEqual(undefined)
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

function summed(
  data: Partial<SummedL2CostRecord> &
    Pick<SummedL2CostRecord, 'timestamp' | 'lastTimestamp'>,
): SummedL2CostRecord {
  return {
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
