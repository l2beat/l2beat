import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { Database } from '@l2beat/database'
import { describeDatabase } from '../../../../../test/database'
import {
  AggregatedL2CostsRecord,
  AggregatedL2CostsRepository,
} from './AggregatedL2CostsRepository'

const NOW = UnixTime.now()
describeDatabase(AggregatedL2CostsRepository.name, (knex, kysely) => {
  const oldRepo = new AggregatedL2CostsRepository(knex, Logger.SILENT)
  const newRepo = kysely.aggregatedL2Cost

  function suite(
    repository: AggregatedL2CostsRepository | Database['aggregatedL2Cost'],
  ) {
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
      AggregatedL2CostsRepository.prototype.getByProjectAndTimeRange.name,
      () => {
        it('should return all rows for given project', async () => {
          await repository.deleteAll()
          const records = [
            record({ timestamp: NOW.add(-1, 'hours') }),
            record(),
            record({ timestamp: NOW.add(1, 'hours') }),
          ]
          await repository.addMany(records)

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
          await repository.addMany(records)
          const results = await repository.getByProjectAndTimeRange(
            ProjectId('random'),
            [NOW.add(-1, 'hours'), NOW.add(1, 'hours')],
          )

          expect(results).toEqual(records.slice(0, 2))
        })
      },
    )
  }

  suite(oldRepo)
  suite(newRepo)
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
    overheadGas: 1,
    overheadGasEth: 1,
    overheadGasUsd: 1,
    ...data,
  }
}
