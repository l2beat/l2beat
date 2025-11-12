import { expect } from 'earl'
import { describeTokenDatabase } from '../test/tokenDatabase'
import { type ChainRecord, ChainRepository } from './ChainRepository'

describeTokenDatabase(ChainRepository.name, (db) => {
  const repository = db.chain

  afterEach(async () => {
    await repository.deleteAll()
  })

  describe(ChainRepository.prototype.insert.name, () => {
    it('inserts a chain record', async () => {
      const record = mockChain({
        name: 'ethereum',
        chainId: 1,
      })

      await repository.insert(record)

      const all = await repository.getAll()
      expect(all).toEqual([record])
    })

    it('inserts a chain record with aliases', async () => {
      const record = mockChain({
        name: 'ethereum',
        chainId: 1,
        aliases: ['eth', 'mainnet'],
      })

      await repository.insert(record)

      const all = await repository.getAll()
      expect(all).toEqual([record])
    })

    it('inserts a chain record with null aliases', async () => {
      const record = mockChain({
        name: 'ethereum',
        chainId: 1,
        aliases: null,
      })

      await repository.insert(record)

      const all = await repository.getAll()
      expect(all).toEqual([record])
    })

    it('inserts a chain record with apis', async () => {
      const record = mockChain({
        name: 'ethereum',
        chainId: 1,
        apis: [
          { type: 'etherscan' },
          { type: 'rpc', url: 'https://rpc.example.com' },
        ],
      })

      await repository.insert(record)

      const all = await repository.getAll()
      expect(all).toEqual([record])
    })

    it('inserts a chain record with all api types', async () => {
      const record = mockChain({
        name: 'ethereum',
        chainId: 1,
        apis: [
          { type: 'etherscan' },
          { type: 'rpc', url: 'https://rpc.example.com' },
          { type: 'blockscout', url: 'https://blockscout.example.com' },
          { type: 'routescan', url: 'https://routescan.example.com' },
          {
            type: 'rpc',
            url: 'https://rpc2.example.com',
            callsPerMinute: 100,
          },
        ],
      })

      await repository.insert(record)

      const all = await repository.getAll()
      expect(all).toEqual([record])
    })

    it('inserts a chain record with null apis', async () => {
      const record = mockChain({
        name: 'ethereum',
        chainId: 1,
        apis: null,
      })

      await repository.insert(record)

      const all = await repository.getAll()
      expect(all).toEqual([record])
    })

    it('inserts a chain record with all fields', async () => {
      const record = mockChain({
        name: 'polygon',
        chainId: 137,
        aliases: ['matic', 'polygon-mainnet'],
        apis: [
          { type: 'etherscan' },
          { type: 'rpc', url: 'https://polygon-rpc.example.com' },
        ],
      })

      await repository.insert(record)

      const all = await repository.getAll()
      expect(all).toEqual([record])
    })

    it('throws error when inserting duplicate name', async () => {
      const record1 = mockChain({ name: 'ethereum', chainId: 1 })
      const record2 = mockChain({ name: 'ethereum', chainId: 2 })

      await repository.insert(record1)

      await expect(repository.insert(record2)).toBeRejected()
    })

    it('throws error when inserting duplicate chainId', async () => {
      const record1 = mockChain({ name: 'ethereum', chainId: 1 })
      const record2 = mockChain({ name: 'mainnet', chainId: 1 })

      await repository.insert(record1)

      await expect(repository.insert(record2)).toBeRejected()
    })
  })

  describe(ChainRepository.prototype.insertMany.name, () => {
    it('inserts multiple chain records', async () => {
      const records = [
        mockChain({ name: 'ethereum', chainId: 1 }),
        mockChain({ name: 'polygon', chainId: 137 }),
        mockChain({ name: 'arbitrum', chainId: 42161 }),
      ]

      await repository.insertMany(records)

      const all = await repository.getAll()
      expect(all).toEqualUnsorted(records)
    })

    it('inserts multiple chain records with different configurations', async () => {
      const records = [
        mockChain({
          name: 'ethereum',
          chainId: 1,
          aliases: ['eth'],
          apis: [{ type: 'etherscan' }],
        }),
        mockChain({
          name: 'polygon',
          chainId: 137,
          aliases: null,
          apis: null,
        }),
        mockChain({
          name: 'arbitrum',
          chainId: 42161,
          aliases: ['arb'],
          apis: [{ type: 'rpc', url: 'https://arb-rpc.example.com' }],
        }),
      ]

      await repository.insertMany(records)

      const all = await repository.getAll()
      expect(all).toEqualUnsorted(records)
    })

    it('inserts empty array', async () => {
      await repository.insertMany([])

      const all = await repository.getAll()
      expect(all).toEqual([])
    })

    it('throws error when inserting duplicate names', async () => {
      const records = [
        mockChain({ name: 'ethereum', chainId: 1 }),
        mockChain({ name: 'ethereum', chainId: 2 }),
      ]

      await expect(repository.insertMany(records)).toBeRejected()
    })

    it('throws error when inserting duplicate chainIds', async () => {
      const records = [
        mockChain({ name: 'ethereum', chainId: 1 }),
        mockChain({ name: 'mainnet', chainId: 1 }),
      ]

      await expect(repository.insertMany(records)).toBeRejected()
    })
  })

  describe(ChainRepository.prototype.getAll.name, () => {
    it('returns empty array when no records exist', async () => {
      const all = await repository.getAll()
      expect(all).toEqual([])
    })

    it('returns all inserted records', async () => {
      const records = [
        mockChain({ name: 'ethereum', chainId: 1 }),
        mockChain({ name: 'polygon', chainId: 137 }),
        mockChain({ name: 'arbitrum', chainId: 42161 }),
      ]

      await repository.insertMany(records)

      const all = await repository.getAll()
      expect(all).toEqualUnsorted(records)
    })

    it('returns records with correct JSON parsing', async () => {
      const record = mockChain({
        name: 'ethereum',
        chainId: 1,
        aliases: ['eth', 'mainnet'],
        apis: [
          { type: 'etherscan' },
          { type: 'rpc', url: 'https://rpc.example.com' },
        ],
      })

      await repository.insert(record)

      const all = await repository.getAll()
      expect(all).toEqual([record])
      expect(all[0]?.aliases).toEqual(['eth', 'mainnet'])
      expect(all[0]?.apis).toEqual([
        { type: 'etherscan' },
        { type: 'rpc', url: 'https://rpc.example.com' },
      ])
    })
  })

  describe(ChainRepository.prototype.findByName.name, () => {
    it('returns undefined when chain does not exist', async () => {
      const result = await repository.findByName('nonexistent')
      expect(result).toEqual(undefined)
    })

    it('finds a chain by name', async () => {
      const records = [
        mockChain({ name: 'ethereum', chainId: 1 }),
        mockChain({ name: 'polygon', chainId: 137 }),
        mockChain({ name: 'arbitrum', chainId: 42161 }),
      ]

      await repository.insertMany(records)

      const result = await repository.findByName('polygon')
      expect(result).toEqual(records[1])
    })
  })

  describe(ChainRepository.prototype.deleteAll.name, () => {
    it('deletes all records', async () => {
      await repository.insertMany([
        mockChain({ name: 'ethereum', chainId: 1 }),
        mockChain({ name: 'polygon', chainId: 137 }),
      ])

      const deleted = await repository.deleteAll()
      expect(deleted).toEqual(2)

      const all = await repository.getAll()
      expect(all).toEqual([])
    })

    it('returns 0 when no records exist', async () => {
      const deleted = await repository.deleteAll()
      expect(deleted).toEqual(0)
    })
  })
})

function mockChain(
  overrides: Partial<ChainRecord> & { name: string; chainId: number },
): ChainRecord {
  return {
    name: overrides.name,
    chainId: overrides.chainId,
    aliases: overrides.aliases ?? null,
    explorerUrl: overrides.explorerUrl ?? null,
    apis: overrides.apis ?? null,
  }
}
