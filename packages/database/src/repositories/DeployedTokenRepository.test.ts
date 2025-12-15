import { expect } from 'earl'
import { describeTokenDatabase } from '../test/tokenDatabase'
import type { AbstractTokenRecord } from './AbstractTokenRepository'
import type { ChainRecord } from './ChainRepository'
import {
  type DeployedTokenPrimaryKey,
  type DeployedTokenRecord,
  DeployedTokenRepository,
} from './DeployedTokenRepository'

describeTokenDatabase(DeployedTokenRepository.name, (db) => {
  const repository = db.deployedToken
  const abstractTokens = db.abstractToken
  const chains = db.chain

  afterEach(async () => {
    await repository.deleteAll()
    await abstractTokens.deleteAll()
    await chains.deleteAll()
  })

  describe(DeployedTokenRepository.prototype.insert.name, () => {
    it('inserts record, making address lower-case', async () => {
      const chainRecord = mockChain({ name: 'arbitrum', chainId: 42161 })
      await chains.insert(chainRecord)

      const abstractTokenRecord = abstractToken({ id: 'TK0001' })
      await abstractTokens.insert(abstractTokenRecord)

      const record = deployedToken({
        chain: 'arbitrum',
        address: '0x1111111111111AAAAAAAAAAAAbbbbbbbbbbbbbbb',
        abstractTokenId: abstractTokenRecord.id,
        symbol: 'ARB',
        decimals: 6,
        deploymentTimestamp: 10,
        comment: 'initial deployment',
      })

      await repository.insert(record)

      const stored = await repository.findByChainAndAddress(record)
      expect(stored).toEqual({
        ...record,
        address: record.address.toLowerCase(),
      })
    })

    it('accepts optional fields', async () => {
      const chainRecord = mockChain({ name: 'ethereum', chainId: 1 })
      await chains.insert(chainRecord)

      const record = deployedToken({
        chain: 'ethereum',
        address: '0x2222222222222222222222222222222222222222',
      })

      await repository.insert(record)

      const stored = await repository.findByChainAndAddress(record)
      expect(stored).toEqual(record)
    })
  })

  describe(
    DeployedTokenRepository.prototype.updateByChainAndAddress.name,
    () => {
      it('updates record (even when address is cased differently) and returns number of affected rows', async () => {
        const chainRecord = mockChain({ name: 'ethereum', chainId: 1 })
        await chains.insert(chainRecord)

        const firstAbstractToken = abstractToken({ id: 'TK0001' })
        const secondAbstractToken = abstractToken({ id: 'TK0002' })
        await abstractTokens.insert(firstAbstractToken)
        await abstractTokens.insert(secondAbstractToken)

        const record = deployedToken({
          chain: 'ethereum',
          address: '0x2222222222222222AAAAAAAAbbbbbbbbbbbbbbbb', // mixed-case, will be lowercased in DB
          abstractTokenId: firstAbstractToken.id,
          symbol: 'TOKEN',
          decimals: 18,
          deploymentTimestamp: 10,
          comment: 'initial comment',
        })
        await repository.insert(record) // address becomes lower-case in DB

        const updatedRows = await repository.updateByChainAndAddress(
          {
            chain: record.chain,
            address: record.address, // should be found even when address is in original mix-case
          },
          {
            abstractTokenId: secondAbstractToken.id,
            symbol: 'UPDT',
            decimals: 8,
            deploymentTimestamp: 20,
            comment: 'updated comment',
          },
        )

        expect(updatedRows).toEqual(1)

        const stored = await repository.findByChainAndAddress(record)
        expect(stored).toEqual({
          ...record,
          address: record.address.toLowerCase(),
          abstractTokenId: secondAbstractToken.id,
          symbol: 'UPDT',
          decimals: 8,
          deploymentTimestamp: 20,
          comment: 'updated comment',
        })
      })
    },
  )

  describe(DeployedTokenRepository.prototype.findByChainAndAddress.name, () => {
    it('finds record with case-insensitive address matching', async () => {
      const chainRecord = mockChain({ name: 'ethereum', chainId: 1 })
      await chains.insert(chainRecord)

      const record = deployedToken({
        chain: 'ethereum',
        address: '0xABCDEF1234567890ABCDEF1234567890ABCDEF1234', // uppercase
        symbol: 'TOKEN',
        decimals: 18,
        deploymentTimestamp: 10,
      })
      await repository.insert(record)

      // Query with uppercase address
      const found = await repository.findByChainAndAddress({
        chain: record.chain,
        address: record.address
      })
      expect(found).toEqual({
        ...record,
        address: record.address.toLowerCase(),
      })
    })

    it('finds record when stored address is lowercase and query is uppercase', async () => {
      const chainRecord = mockChain({ name: 'arbitrum', chainId: 42161 })
      await chains.insert(chainRecord)

      const lowercaseAddress = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
      const record = deployedToken({
        chain: 'arbitrum',
        address: lowercaseAddress,
        symbol: 'TOKEN',
        decimals: 18,
        deploymentTimestamp: 10,
      })
      await repository.insert(record)

      // Query with uppercase address
      const found = await repository.findByChainAndAddress({
        chain: record.chain,
        address: lowercaseAddress.toUpperCase(), // find by uppercase
      })
      expect(found).toEqual(record)
    })
  })

  describe(DeployedTokenRepository.prototype.getByChainAndAddress.name, () => {
    it('returns empty array for empty input', async () => {
      const result = await repository.getByChainAndAddress([])
      expect(result).toEqual([])
    })

    it('returns deployed token with abstract token when both exist', async () => {
      const chainRecord = mockChain({ name: 'ethereum', chainId: 1 })
      await chains.insert(chainRecord)

      const abstractTokenRecord = abstractToken({ id: 'TK0001' })
      await abstractTokens.insert(abstractTokenRecord)

      const deployedTokenRecord = deployedToken({
        chain: 'ethereum',
        address: '0x1111111111111111111111111111111111111111',
        abstractTokenId: 'TK0001',
        symbol: 'ETH',
        decimals: 18,
        deploymentTimestamp: 10,
        comment: 'ethereum token',
      })
      await repository.insert(deployedTokenRecord)

      const result = await repository.getByChainAndAddress([
        {
          chain: 'ethereum',
          address: '0x1111111111111111111111111111111111111111',
        },
      ])

      expect(result).toEqual([
        {
          deployedToken: deployedTokenRecord,
          abstractToken: abstractTokenRecord,
        },
      ])
    })

    it('returns deployed token with undefined abstract token when abstract token does not exist', async () => {
      const chainRecord = mockChain({ name: 'arbitrum', chainId: 42161 })
      await chains.insert(chainRecord)

      const deployedTokenRecord = deployedToken({
        chain: 'arbitrum',
        address: '0x2222222222222222222222222222222222222222',
        abstractTokenId: null,
        symbol: 'ARB',
        decimals: 18,
        deploymentTimestamp: 20,
        comment: 'arbitrum token',
      })
      await repository.insert(deployedTokenRecord)

      const result = await repository.getByChainAndAddress([
        {
          chain: 'arbitrum',
          address: '0x2222222222222222222222222222222222222222',
        },
      ])

      expect(result).toEqual([
        {
          deployedToken: deployedTokenRecord,
          abstractToken: undefined,
        },
      ])
    })

    it('returns multiple deployed tokens with their abstract tokens', async () => {
      const chainRecord1 = mockChain({ name: 'ethereum', chainId: 1 })
      const chainRecord2 = mockChain({ name: 'arbitrum', chainId: 42161 })
      const chainRecord3 = mockChain({ name: 'optimism', chainId: 10 })
      await chains.insert(chainRecord1)
      await chains.insert(chainRecord2)
      await chains.insert(chainRecord3)

      const abstractToken1 = abstractToken({ id: 'TK0001', symbol: 'TOKEN1' })
      const abstractToken2 = abstractToken({ id: 'TK0002', symbol: 'TOKEN2' })
      await abstractTokens.insert(abstractToken1)
      await abstractTokens.insert(abstractToken2)

      const deployedToken1 = deployedToken({
        chain: 'ethereum',
        address: '0x1111111111111111111111111111111111111111',
        abstractTokenId: 'TK0001',
        symbol: 'ETH1',
        decimals: 18,
        deploymentTimestamp: 10,
      })
      const deployedToken2 = deployedToken({
        chain: 'arbitrum',
        address: '0x2222222222222222222222222222222222222222',
        abstractTokenId: 'TK0002',
        symbol: 'ARB1',
        decimals: 6,
        deploymentTimestamp: 20,
      })
      const deployedToken3 = deployedToken({
        chain: 'optimism',
        address: '0x3333333333333333333333333333333333333333',
        abstractTokenId: null,
        symbol: 'OP1',
        decimals: 8,
        deploymentTimestamp: 30,
      })

      await repository.insert(deployedToken1)
      await repository.insert(deployedToken2)
      await repository.insert(deployedToken3)

      const result = await repository.getByChainAndAddress([
        {
          chain: 'ethereum',
          address: '0x1111111111111111111111111111111111111111',
        },
        {
          chain: 'arbitrum',
          address: '0x2222222222222222222222222222222222222222',
        },
        {
          chain: 'optimism',
          address: '0x3333333333333333333333333333333333333333',
        },
      ])

      expect(result).toEqual([
        {
          deployedToken: deployedToken1,
          abstractToken: abstractToken1,
        },
        {
          deployedToken: deployedToken2,
          abstractToken: abstractToken2,
        },
        {
          deployedToken: deployedToken3,
          abstractToken: undefined,
        },
      ])
    })

    it('returns empty array when no deployed tokens match', async () => {
      const result = await repository.getByChainAndAddress([
        {
          chain: 'ethereum',
          address: '0x9999999999999999999999999999999999999999',
        },
        {
          chain: 'arbitrum',
          address: '0x8888888888888888888888888888888888888888',
        },
      ])

      expect(result).toEqual([])
    })

    it('returns only matching deployed tokens when some do not exist', async () => {
      const chainRecord1 = mockChain({ name: 'ethereum', chainId: 1 })
      const chainRecord2 = mockChain({ name: 'arbitrum', chainId: 42161 })
      await chains.insert(chainRecord1)
      await chains.insert(chainRecord2)

      const abstractTokenRecord = abstractToken({ id: 'TK0001' })
      await abstractTokens.insert(abstractTokenRecord)

      const deployedTokenRecord = deployedToken({
        chain: 'ethereum',
        address: '0x1111111111111111111111111111111111111111',
        abstractTokenId: 'TK0001',
        symbol: 'ETH',
        decimals: 18,
        deploymentTimestamp: 10,
      })
      await repository.insert(deployedTokenRecord)

      const result = await repository.getByChainAndAddress([
        {
          chain: 'ethereum',
          address: '0x1111111111111111111111111111111111111111',
        },
        {
          chain: 'arbitrum',
          address: '0x9999999999999999999999999999999999999999',
        }, // doesn't exist
      ])

      expect(result).toEqual([
        {
          deployedToken: deployedTokenRecord,
          abstractToken: abstractTokenRecord,
        },
      ])
    })
  })

  describe(
    DeployedTokenRepository.prototype.getByChainsAndAddresses.name,
    () => {
      it('returns empty array for empty input', async () => {
        const result = await repository.getByChainsAndAddresses([])
        expect(result).toEqual([])
      })

      it('returns single matching record', async () => {
        const chainRecord = mockChain({ name: 'ethereum', chainId: 1 })
        await chains.insert(chainRecord)

        const deployedTokenRecord = deployedToken({
          chain: 'ethereum',
          address: '0x1111111111111111111111111111111111111111',
          symbol: 'ETH',
          decimals: 18,
          deploymentTimestamp: 10,
          comment: 'ethereum token',
        })
        await repository.insert(deployedTokenRecord)

        const result = await repository.getByChainsAndAddresses([
          {
            chain: 'ethereum',
            address: '0x1111111111111111111111111111111111111111',
          },
        ])

        expect(result).toEqual([deployedTokenRecord])
      })

      it('returns multiple matching records', async () => {
        const chainRecord1 = mockChain({ name: 'ethereum', chainId: 1 })
        const chainRecord2 = mockChain({ name: 'arbitrum', chainId: 42161 })
        const chainRecord3 = mockChain({ name: 'optimism', chainId: 10 })
        await chains.insert(chainRecord1)
        await chains.insert(chainRecord2)
        await chains.insert(chainRecord3)

        const deployedToken1 = deployedToken({
          chain: 'ethereum',
          address: '0x1111111111111111111111111111111111111111',
          symbol: 'ETH1',
          decimals: 18,
          deploymentTimestamp: 10,
        })
        const deployedToken2 = deployedToken({
          chain: 'arbitrum',
          address: '0x2222222222222222222222222222222222222222',
          symbol: 'ARB1',
          decimals: 6,
          deploymentTimestamp: 20,
        })
        const deployedToken3 = deployedToken({
          chain: 'optimism',
          address: '0x3333333333333333333333333333333333333333',
          symbol: 'OP1',
          decimals: 8,
          deploymentTimestamp: 30,
        })

        await repository.insert(deployedToken1)
        await repository.insert(deployedToken2)
        await repository.insert(deployedToken3)

        const result = await repository.getByChainsAndAddresses([
          {
            chain: 'ethereum',
            address: '0x1111111111111111111111111111111111111111',
          },
          {
            chain: 'arbitrum',
            address: '0x2222222222222222222222222222222222222222',
          },
          {
            chain: 'optimism',
            address: '0x3333333333333333333333333333333333333333',
          },
        ])

        expect(result).toEqualUnsorted([
          deployedToken1,
          deployedToken2,
          deployedToken3,
        ])
      })

      it('returns empty array when no deployed tokens match', async () => {
        const result = await repository.getByChainsAndAddresses([
          {
            chain: 'ethereum',
            address: '0x9999999999999999999999999999999999999999',
          },
          {
            chain: 'arbitrum',
            address: '0x8888888888888888888888888888888888888888',
          },
        ])

        expect(result).toEqual([])
      })

      it('returns only matching deployed tokens when some do not exist', async () => {
        const chainRecord1 = mockChain({ name: 'ethereum', chainId: 1 })
        const chainRecord2 = mockChain({ name: 'arbitrum', chainId: 42161 })
        await chains.insert(chainRecord1)
        await chains.insert(chainRecord2)

        const deployedTokenRecord = deployedToken({
          chain: 'ethereum',
          address: '0x1111111111111111111111111111111111111111',
          symbol: 'ETH',
          decimals: 18,
          deploymentTimestamp: 10,
        })
        await repository.insert(deployedTokenRecord)

        const result = await repository.getByChainsAndAddresses([
          {
            chain: 'ethereum',
            address: '0x1111111111111111111111111111111111111111',
          },
          {
            chain: 'arbitrum',
            address: '0x9999999999999999999999999999999999999999',
          }, // doesn't exist
        ])

        expect(result).toEqual([deployedTokenRecord])
      })

      it('finds records with case-insensitive address matching', async () => {
        const chainRecord = mockChain({ name: 'ethereum', chainId: 1 })
        await chains.insert(chainRecord)

        const mixedCaseAddress = '0xAbCdEf1234567890AbCdEf1234567890AbCdEf1234'
        const record = deployedToken({
          chain: 'ethereum',
          address: mixedCaseAddress,
          symbol: 'TOKEN',
          decimals: 18,
          deploymentTimestamp: 10,
        })

        // Inserting
        await repository.insert(record)

        const foundLower = await repository.getByChainsAndAddresses([
          {
            chain: record.chain,
            address: mixedCaseAddress,
          },
        ])
        expect(foundLower).toEqual([
          { ...record, address: record.address.toLowerCase() },
        ])
      })

      it('handles case-insensitive matching for multiple addresses', async () => {
        const chainRecord1 = mockChain({ name: 'ethereum', chainId: 1 })
        const chainRecord2 = mockChain({ name: 'arbitrum', chainId: 42161 })
        await chains.insert(chainRecord1)
        await chains.insert(chainRecord2)

        const address1 = '0xABCDEF1234567890ABCDEF1234567890ABCDEF1234'
        const address2 = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
        const record1 = deployedToken({
          chain: 'ethereum',
          address: address1,
          symbol: 'TOKEN1',
          decimals: 18,
          deploymentTimestamp: 10,
        })
        const record2 = deployedToken({
          chain: 'arbitrum',
          address: address2,
          symbol: 'TOKEN2',
          decimals: 18,
          deploymentTimestamp: 20,
        })
        await repository.insert(record1)
        await repository.insert(record2)

        const result = await repository.getByChainsAndAddresses([
          { chain: 'ethereum', address: address1 },
          { chain: 'arbitrum', address: address2 },
        ])

        expect(result).toEqualUnsorted([
          { ...record1, address: record1.address.toLowerCase() },
          record2,
        ])
      })
    },
  )

  describe(DeployedTokenRepository.prototype.getByAbstractTokenId.name, () => {
    it('returns matching records', async () => {
      const chainRecord1 = mockChain({ name: 'ethereum', chainId: 1 })
      const chainRecord2 = mockChain({ name: 'arbitrum', chainId: 42161 })
      const chainRecord3 = mockChain({ name: 'optimism', chainId: 10 })
      await chains.insert(chainRecord1)
      await chains.insert(chainRecord2)
      await chains.insert(chainRecord3)

      await abstractTokens.insert(abstractToken({ id: 'TK0001' }))
      await abstractTokens.insert(abstractToken({ id: 'TK0002' }))

      const records = [
        deployedToken({
          abstractTokenId: 'TK0001',
          chain: 'ethereum',
          address: '0x1111111111111111111111111111111111111111',
          deploymentTimestamp: 10,
        }),
        deployedToken({
          abstractTokenId: 'TK0002',
          chain: 'arbitrum',
          address: '0x2222222222222222222222222222222222222222',
          deploymentTimestamp: 20,
        }),
        deployedToken({
          abstractTokenId: null,
          chain: 'optimism',
          address: '0x3333333333333333333333333333333333333333',
        }),
      ]
      await repository.insert(records[0]!)
      await repository.insert(records[1]!)

      const result = await repository.getByAbstractTokenId('TK0001')
      expect(result).toEqual([records[0]!])
    })
  })

  describe(DeployedTokenRepository.prototype.deleteByPrimaryKeys.name, () => {
    it('removes selected records', async () => {
      const chainRecord1 = mockChain({ name: 'ethereum', chainId: 1 })
      const chainRecord2 = mockChain({ name: 'arbitrum', chainId: 42161 })
      const chainRecord3 = mockChain({ name: 'optimism', chainId: 10 })
      await chains.insert(chainRecord1)
      await chains.insert(chainRecord2)
      await chains.insert(chainRecord3)

      const first = deployedToken({
        chain: 'ethereum',
        address: '0x1111111111111111111111111111111111111111',
      })
      const second = deployedToken({
        chain: 'arbitrum',
        address: '0x2222222222222222222222222222222222222222',
      })
      const third = deployedToken({
        chain: 'optimism',
        address: '0x3333333333333333333333333333333333333333',
      })

      await repository.insert(first)
      await repository.insert(second)
      await repository.insert(third)

      const deleted = await repository.deleteByPrimaryKeys([
        toPrimaryKey(first),
        toPrimaryKey(third),
      ])
      expect(deleted).toEqual(2)

      const remaining = await repository.getAll()
      expect(remaining).toEqual([second])
    })
  })
})

function abstractToken(
  overrides: Partial<AbstractTokenRecord> & { id: string },
): AbstractTokenRecord {
  return {
    id: overrides.id,
    issuer: overrides.issuer ?? null,
    symbol: overrides.symbol ?? 'TOKEN',
    category: overrides.category ?? 'other',
    iconUrl: overrides.iconUrl ?? null,
    coingeckoId: overrides.coingeckoId ?? null,
    coingeckoListingTimestamp: overrides.coingeckoListingTimestamp ?? null,
    comment: overrides.comment ?? null,
    reviewed: overrides.reviewed ?? false,
  }
}

function deployedToken(
  overrides: Partial<DeployedTokenRecord> &
    Partial<DeployedTokenPrimaryKey> &
    Required<Pick<DeployedTokenPrimaryKey, 'chain' | 'address'>>,
): DeployedTokenRecord {
  return {
    chain: overrides.chain ?? 'ethereum',
    address: overrides.address,
    abstractTokenId: overrides.abstractTokenId ?? null,
    symbol: overrides.symbol ?? 'TOKEN',
    decimals: overrides.decimals ?? 18,
    deploymentTimestamp: overrides.deploymentTimestamp ?? 0,
    comment: overrides.comment ?? null,
    metadata: overrides.metadata ?? {
      tvs: {
        includeInCalculations: true,
        source: 'external',
        supply: 'circulatingSupply',
        bridgedUsing: [
          {
            name: 'arbitrum',
            slug: 'arbitrum',
          },
        ],
        excludeFromTotal: false,
      },
    },
  }
}

function toPrimaryKey(record: DeployedTokenRecord): DeployedTokenPrimaryKey {
  return {
    chain: record.chain,
    address: record.address,
  }
}

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
