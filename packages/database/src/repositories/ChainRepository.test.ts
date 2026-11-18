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

    it('inserts empty array', async () => {
      await repository.insertMany([])

      const all = await repository.getAll()
      expect(all).toEqual([])
    })
  })

  describe(ChainRepository.prototype.getAll.name, () => {
    it('returns empty array when no records exist', async () => {
      const all = await repository.getAll()
      expect(all).toEqual([])
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

  describe(ChainRepository.prototype.updateByName.name, () => {
    it('updates chainId', async () => {
      const record = mockChain({ name: 'ethereum', chainId: 1 })
      await repository.insert(record)

      const updated = await repository.updateByName('ethereum', {
        name: 'ethereum',
        chainId: 2,
      })
      expect(updated).toEqual(1)

      const result = await repository.findByName('ethereum')
      expect(result?.chainId).toEqual(2)
      expect(result?.name).toEqual('ethereum')
    })

    it('updates explorerUrl', async () => {
      const record = mockChain({
        name: 'ethereum',
        chainId: 1,
        explorerUrl: null,
      })
      await repository.insert(record)

      const updated = await repository.updateByName('ethereum', {
        name: 'ethereum',
        explorerUrl: 'https://etherscan.io',
      })
      expect(updated).toEqual(1)

      const result = await repository.findByName('ethereum')
      expect(result?.explorerUrl).toEqual('https://etherscan.io')
    })

    it('updates explorerUrl to null', async () => {
      const record = mockChain({
        name: 'ethereum',
        chainId: 1,
        explorerUrl: 'https://etherscan.io',
      })
      await repository.insert(record)

      const updated = await repository.updateByName('ethereum', {
        name: 'ethereum',
        explorerUrl: null,
      })
      expect(updated).toEqual(1)

      const result = await repository.findByName('ethereum')
      expect(result?.explorerUrl).toEqual(null)
    })

    it('updates aliases', async () => {
      const record = mockChain({
        name: 'ethereum',
        chainId: 1,
        aliases: null,
      })
      await repository.insert(record)

      const updated = await repository.updateByName('ethereum', {
        name: 'ethereum',
        aliases: ['eth', 'mainnet'],
      })
      expect(updated).toEqual(1)

      const result = await repository.findByName('ethereum')
      expect(result?.aliases).toEqual(['eth', 'mainnet'])
    })

    it('updates aliases to null', async () => {
      const record = mockChain({
        name: 'ethereum',
        chainId: 1,
        aliases: ['eth'],
      })
      await repository.insert(record)

      const updated = await repository.updateByName('ethereum', {
        name: 'ethereum',
        aliases: null,
      })
      expect(updated).toEqual(1)

      const result = await repository.findByName('ethereum')
      expect(result?.aliases).toEqual(null)
    })

    it('updates apis', async () => {
      const record = mockChain({
        name: 'ethereum',
        chainId: 1,
        apis: null,
      })
      await repository.insert(record)

      const updated = await repository.updateByName('ethereum', {
        name: 'ethereum',
        apis: [
          { type: 'etherscan' },
          { type: 'rpc', url: 'https://rpc.example.com' },
        ],
      })
      expect(updated).toEqual(1)

      const result = await repository.findByName('ethereum')
      expect(result?.apis).toEqual([
        { type: 'etherscan' },
        { type: 'rpc', url: 'https://rpc.example.com' },
      ])
    })

    it('updates apis to null', async () => {
      const record = mockChain({
        name: 'ethereum',
        chainId: 1,
        apis: [{ type: 'etherscan' }],
      })
      await repository.insert(record)

      const updated = await repository.updateByName('ethereum', {
        name: 'ethereum',
        apis: null,
      })
      expect(updated).toEqual(1)

      const result = await repository.findByName('ethereum')
      expect(result?.apis).toEqual(null)
    })
  })

  describe(ChainRepository.prototype.deleteByName.name, () => {
    it('deletes a chain by name', async () => {
      const records = [
        mockChain({ name: 'ethereum', chainId: 1 }),
        mockChain({ name: 'polygon', chainId: 137 }),
        mockChain({ name: 'arbitrum', chainId: 42161 }),
      ] as const satisfies ChainRecord[]
      await repository.insertMany(records)

      const deleted = await repository.deleteByName('polygon')
      expect(deleted).toEqual(1)

      const all = await repository.getAll()
      expect(all).toEqualUnsorted([records[0], records[2]])
    })

    it('returns 0 when chain does not exist', async () => {
      const deleted = await repository.deleteByName('nonexistent')
      expect(deleted).toEqual(0)
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
    explorerUrl: overrides.explorerUrl ?? null,
    aliases: overrides.aliases ?? null,
    apis: overrides.apis ?? null,
  }
}
