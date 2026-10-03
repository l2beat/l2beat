import { Hash256 } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type FlatSourcesRecord,
  FlatSourcesRepository,
} from './FlatSourcesRepository'

const CONTENT_HASH = Hash256.random()

describeDatabase(FlatSourcesRepository.name, (db) => {
  const repository = db.flatSources

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(FlatSourcesRepository.prototype.upsert.name, () => {
    const projectId = 'project'

    it('basic insert', async () => {
      const flatRecord: FlatSourcesRecord = {
        projectId,
        timestamp: -1,
        contentHash: CONTENT_HASH,
        flat: {},
      }

      await repository.upsert(flatRecord)
      await repository.upsert(flatRecord)

      const latest = await repository.get(projectId)
      expect(latest).toEqual(flatRecord)
    })

    it('two inserts, update the timestamp but not the flat', async () => {
      const flatRecord: FlatSourcesRecord = {
        projectId,
        timestamp: 1,
        contentHash: CONTENT_HASH,
        flat: { key: 'before' },
      }
      await repository.upsert(flatRecord)

      await repository.upsert(flatRecord)
      let latest = await repository.get(projectId)
      expect(latest).toEqual(flatRecord)

      await repository.upsert({
        ...flatRecord,
        timestamp: 2,
        flat: { key: 'after' },
      })

      latest = await repository.get(projectId)
      expect(latest).toEqual({
        ...flatRecord,
        timestamp: 2,
      })
    })

    it('two inserts, update the everything', async () => {
      const contentHash2 = Hash256.random()

      const flatRecord: FlatSourcesRecord = {
        projectId,
        timestamp: 1,
        contentHash: CONTENT_HASH,
        flat: { key: 'before' },
      }
      await repository.upsert(flatRecord)

      await repository.upsert(flatRecord)
      let latest = await repository.get(projectId)
      expect(latest).toEqual(flatRecord)

      const newRecord = {
        ...flatRecord,
        timestamp: 2,
        contentHash: contentHash2,
        flat: { key: 'after' },
      }

      await repository.upsert(newRecord)
      latest = await repository.get(projectId)
      expect(latest).toEqual(newRecord)
    })
  })

  describe(FlatSourcesRepository.prototype.getJson.name, () => {
    it('returns flat as json text', async () => {
      await repository.upsert({
        projectId: 'project',
        timestamp: 1,
        contentHash: CONTENT_HASH,
        flat: { 'A.sol': 'contract "A" {\n}' },
      })

      const result = await repository.getJson('project')

      expect(result).toEqual({
        projectId: 'project',
        timestamp: 1,
        contentHash: CONTENT_HASH,
        flatJson: '{"A.sol": "contract \\"A\\" {\\n}"}',
      })
      expect(JSON.parse(result?.flatJson ?? '')).toEqual({
        'A.sol': 'contract "A" {\n}',
      })
    })

    it('returns undefined for unknown project', async () => {
      const result = await repository.getJson('unknown')

      expect(result).toEqual(undefined)
    })
  })

  describe(FlatSourcesRepository.prototype.getProjectIds.name, () => {
    it('returns sorted project ids', async () => {
      for (const projectId of ['b', 'c', 'a']) {
        await repository.upsert({
          projectId,
          timestamp: 1,
          contentHash: CONTENT_HASH,
          flat: { key: projectId },
        })
      }

      const result = await repository.getProjectIds()

      expect(result).toEqual(['a', 'b', 'c'])
    })
  })
})
