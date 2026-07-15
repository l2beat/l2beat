import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type EcosystemTokenRecord,
  EcosystemTokenRepository,
} from './EcosystemTokenRepository'

describeDatabase(EcosystemTokenRepository.name, (db) => {
  const repository = db.ecosystemToken

  afterEach(async () => {
    await repository.deleteAll()
  })

  describe(EcosystemTokenRepository.prototype.deleteByConfigIds.name, () => {
    it('deletes all rows for given configuration ids', async () => {
      await repository.upsertMany([
        ecosystemToken('project-a', 'coingecko-1', 'config-1'),
        ecosystemToken('project-a', 'coingecko-2', 'config-1'),
        ecosystemToken('project-b', 'coingecko-1', 'config-2'),
        ecosystemToken('project-c', 'coingecko-1', 'config-3'),
      ])

      const deleted = await repository.deleteByConfigIds([
        'config-1',
        'config-2',
      ])

      expect(deleted).toEqual(3)

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        ecosystemToken('project-c', 'coingecko-1', 'config-3'),
      ])
    })

    it('returns 0 for empty ids', async () => {
      await repository.upsertMany([
        ecosystemToken('project-a', 'coingecko-1', 'config-1'),
      ])

      const deleted = await repository.deleteByConfigIds([])
      expect(deleted).toEqual(0)

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        ecosystemToken('project-a', 'coingecko-1', 'config-1'),
      ])
    })

    it('returns 0 when no matching config found', async () => {
      await repository.upsertMany([
        ecosystemToken('project-a', 'coingecko-1', 'config-1'),
      ])

      const deleted = await repository.deleteByConfigIds(['non-existent-id'])
      expect(deleted).toEqual(0)

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        ecosystemToken('project-a', 'coingecko-1', 'config-1'),
      ])
    })
  })
})

function ecosystemToken(
  projectId: string,
  coingeckoId: string,
  configurationId: string,
): EcosystemTokenRecord {
  return {
    projectId,
    coingeckoId,
    configurationId,
    priceUsd: 100,
    price7dChange: 0.1,
    marketCapUsd: 1_000_000,
    marketCap7dChange: 0.05,
    circulatingSupply: 1_000_000,
    circulatingSupply7dChange: 0.02,
    timestamp: UnixTime.now(),
  }
}
