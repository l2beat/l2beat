import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { setupDatabaseTestSuite } from '../../test/database'
import { LivenessConfigurationRepository } from './LivenessConfigurationRepository'
import { CONFIG_DATA } from './LivenessConfigurationRepository.test'
import { LivenessRecord, LivenessRepository } from './LivenessRepository'

describe(LivenessRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new LivenessRepository(database, Logger.SILENT)
  const configRepository = new LivenessConfigurationRepository(
    database,
    Logger.SILENT,
  )

  const START = UnixTime.now()
  const DATA = [
    {
      timestamp: START.add(-1, 'hours'),
      blockNumber: 12345,
      txHash: '0x1234567890abcdef',
    },
    {
      timestamp: START.add(-2, 'hours'),
      blockNumber: 12346,
      txHash: '0xabcdef1234567890',
    },
    {
      timestamp: START.add(-3, 'hours'),
      blockNumber: 12347,
      txHash: '0x12345678901abcdef',
    },
  ]
  let ids: number[]

  beforeEach(async function () {
    this.timeout(10000)
    await configRepository.deleteAll()
    ids = await configRepository.addMany(CONFIG_DATA)
    await repository.deleteAll()
    await repository.addMany(
      DATA.map((e, i) => ({
        ...e,
        livenessConfigurationId: ids[i],
      })),
    )
  })

  describe(LivenessRepository.prototype.addMany.name, () => {
    it('only new rows', async () => {
      const newRows = [
        {
          timestamp: START.add(-5, 'hours'),
          blockNumber: 12349,
          txHash: '0x1234567890abcdef1',
          livenessConfigurationId: ids[0],
        },
        {
          timestamp: START.add(-6, 'hours'),
          blockNumber: 12350,
          txHash: '0xabcdef1234567892',
          livenessConfigurationId: ids[1],
        },
      ]
      await repository.addMany(newRows)

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        ...DATA.map((e, i) => ({
          ...e,
          livenessConfigurationId: ids[i],
        })),
        ...newRows,
      ])
    })

    it('empty array', async () => {
      await expect(repository.addMany([])).not.toBeRejected()
    })

    it('big query', async () => {
      const records: LivenessRecord[] = []
      for (let i = 5; i < 15_000; i++) {
        records.push({
          timestamp: START.add(-i, 'hours'),
          blockNumber: i,
          txHash: `0xabcdef1234567892${i}`,
          livenessConfigurationId: ids[0],
        })
      }
      await expect(repository.addMany(records)).not.toBeRejected()
    })
  })

  describe(LivenessRepository.prototype.getAll.name, () => {
    it('should return all rows', async () => {
      const results = await repository.getAll()

      expect(results).toEqualUnsorted(
        DATA.map((e, i) => ({
          ...e,
          livenessConfigurationId: ids[i],
        })),
      )
    })
  })

  describe(LivenessRepository.prototype.deleteAll.name, () => {
    it('should delete all rows', async () => {
      await repository.deleteAll()

      const results = await repository.getAll()

      expect(results).toEqual([])
    })
  })
})
