import { Logger } from '@l2beat/backend-tools'
import { ChainId, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { setupDatabaseTestSuite } from '../../../test/database'
import {
  UpdateNotifierRecord,
  UpdateNotifierRepository,
} from './UpdateNotifierRepository'

const PROJECT1 = 'project1'

describe(UpdateNotifierRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  if (!database) {
    return
  }
  const repository = new UpdateNotifierRepository(database, Logger.SILENT)
  const NOW = UnixTime.now()

  beforeEach(async () => {
    await repository.deleteAll()
  })

  it(UpdateNotifierRepository.prototype.findLatestId.name, async () => {
    const record = mockRecord(PROJECT1)

    await repository.add(record)
    await repository.add(record)
    const latestId = await repository.add(record)

    const result = await repository.findLatestId()

    expect(result).toEqual(latestId)
  })

  it(UpdateNotifierRepository.prototype.add.name, async () => {
    const record = mockRecord(PROJECT1)

    const latestId = await repository.add(record)

    const latest = await repository.findLatestId()

    expect(latest).toEqual(latestId)
  })

  describe(UpdateNotifierRepository.prototype.getNewerThan.name, () => {
    it('finds two records newly added', async () => {
      const ethRecord = mockRecord(PROJECT1, ChainId.ETHEREUM)
      const arbRecord1 = mockRecord(PROJECT1, ChainId.ARBITRUM)
      const arbRecord2 = mockRecord(PROJECT1, ChainId.ARBITRUM)

      await repository.add(ethRecord)
      const secondId = await repository.add(arbRecord1)
      const thirdId = await repository.add(arbRecord2)
      const result = await repository.getNewerThan(
        NOW.add(-2, 'days'),
        PROJECT1,
        ChainId.ARBITRUM,
      )

      expect(result.length).toEqual(2)
      expect(result[0]).toHaveSubset({ id: secondId, ...arbRecord1 })
      expect(result[1]).toHaveSubset({ id: thirdId, ...arbRecord2 })
    })

    it('does not return if does not match the range', async () => {
      const ethRecord = mockRecord(PROJECT1, ChainId.ETHEREUM)

      await repository.add(ethRecord)
      const result = await repository.getNewerThan(
        NOW.add(2, 'days'),
        PROJECT1,
        ChainId.ETHEREUM,
      )

      expect(result.length).toEqual(0)
    })

    it('does not return if does not match any chainId', async () => {
      const ethRecord = mockRecord(PROJECT1, ChainId.ETHEREUM)

      await repository.add(ethRecord)
      const result = await repository.getNewerThan(
        NOW.add(-2, 'days'),
        PROJECT1,
        ChainId.ARBITRUM,
      )

      expect(result.length).toEqual(0)
    })
  })
})

function mockRecord(
  projectName: string,
  chainId: ChainId = ChainId.ETHEREUM,
): Omit<UpdateNotifierRecord, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    projectName,
    blockNumber: -1,
    diff: [
      {
        name: 'Contract',
        address: EthereumAddress.random(),
        diff: [
          {
            key: 'key',
            before: 'before',
            after: 'after',
          },
        ],
      },
    ],
    chainId,
  }
}
