import { ChainId, Hash256 } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../../test/database'
import { FlatSourcesRecord } from './entity'
import { FlatSourcesRepository } from './repository'

const CONTENT_HASH = Hash256.random()

describeDatabase(FlatSourcesRepository.name, (db) => {
  const repository = db.flatSources

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(FlatSourcesRepository.prototype.upsert.name, () => {
    const projectName = 'project'
    const chainId = ChainId.ETHEREUM

    it('basic insert', async () => {
      const flatRecord: FlatSourcesRecord = {
        projectName,
        chainId,
        blockNumber: -1,
        contentHash: CONTENT_HASH,
        flat: {},
      }

      await repository.upsert(flatRecord)
      await repository.upsert(flatRecord)

      const latest = await repository.get(projectName, chainId)
      expect(latest).toEqual(flatRecord)
    })

    it('two inserts, update the blockNumber but not the flat', async () => {
      const flatRecord: FlatSourcesRecord = {
        projectName,
        chainId,
        blockNumber: 1,
        contentHash: CONTENT_HASH,
        flat: { key: 'before' },
      }
      await repository.upsert(flatRecord)

      await repository.upsert(flatRecord)
      let latest = await repository.get(projectName, chainId)
      expect(latest).toEqual(flatRecord)

      await repository.upsert({
        ...flatRecord,
        blockNumber: 2,
        flat: { key: 'after' },
      })

      latest = await repository.get(projectName, chainId)
      expect(latest).toEqual({
        ...flatRecord,
        blockNumber: 2,
      })
    })

    it('two inserts, update the everything', async () => {
      const contentHash2 = Hash256.random()

      const flatRecord: FlatSourcesRecord = {
        projectName,
        chainId,
        blockNumber: 1,
        contentHash: CONTENT_HASH,
        flat: { key: 'before' },
      }
      await repository.upsert(flatRecord)

      await repository.upsert(flatRecord)
      let latest = await repository.get(projectName, chainId)
      expect(latest).toEqual(flatRecord)

      const newRecord = {
        ...flatRecord,
        blockNumber: 2,
        contentHash: contentHash2,
        flat: { key: 'after' },
      }

      await repository.upsert(newRecord)
      latest = await repository.get(projectName, chainId)
      expect(latest).toEqual(newRecord)
    })
  })
})
