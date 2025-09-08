import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import { TokenMetadataRepository } from './TokenMetadataRepository'

describeDatabase(TokenMetadataRepository.name, (db) => {
  const repository = db.tvsTokenMetadata

  describe(TokenMetadataRepository.prototype.insertMany.name, () => {
    it('inserts new records', async () => {
      const records = [
        {
          projectId: 'a',
          tokenId: 'a-ETH',
          source: 'canonical' as const,
          category: 'ether' as const,
          isAssociated: true,
        },
        {
          projectId: 'b',
          tokenId: 'b-USDC',
          source: 'external' as const,
          category: 'other' as const,
          isAssociated: false,
        },
      ]

      const inserted = await repository.insertMany(records)
      expect(inserted).toEqual(2)

      const result = await repository.getAll()
      expect(result).toEqualUnsorted(records)
    })

    it('handles empty array', async () => {
      const inserted = await repository.insertMany([])
      expect(inserted).toEqual(0)
    })
  })

  afterEach(async () => {
    await repository.deleteAll()
  })
})
