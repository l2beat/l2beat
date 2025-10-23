import { assert, type TokenId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import { TokenValueRepository } from './TokenValueRepository'

describeDatabase(TokenValueRepository.name, (db) => {
  const repository = db.tvsTokenValue

  describe(TokenValueRepository.prototype.insertMany.name, () => {
    it('inserts new records', async () => {
      const records = [
        tokenValue('a', 'ethereum', UnixTime(100), 10, 10000, 8000, 5000, 10),
        tokenValue('b', 'arbitrum', UnixTime(100), 1000, 1000, 800, 500, 20),
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

    it('performs batch insert when more than 1000 records', async () => {
      const records = []
      for (let i = 0; i < 1500; i++) {
        records.push(
          tokenValue(
            'a',
            'ethereum',
            UnixTime(i),
            i + 10,
            (i + 10) * 1000,
            (i + 10) * 800,
            (i + 10) * 500,
            10,
          ),
        )
      }

      const inserted = await repository.insertMany(records)
      expect(inserted).toEqual(1500)

      const result = await repository.getAll()
      expect(result.length).toEqual(1500)
    })
  })

  describe(TokenValueRepository.prototype.getByProject.name, () => {
    beforeEach(async () => {
      await repository.insertMany([
        tokenValue('a', 'ethereum', UnixTime(50), 1, 1000, 800, 500, 10),
        tokenValue('a', 'ethereum', UnixTime(100), 2, 2000, 1600, 1000, 10),
        tokenValue('a', 'ethereum', UnixTime(150), 3, 3000, 2400, 1500, 10),
        tokenValue('a', 'ethereum', UnixTime(200), 4, 4000, 3200, 2000, 10),
        tokenValue('a', 'ethereum', UnixTime(250), 5, 5000, 4000, 2500, 10),
        tokenValue('b', 'arbitrum', UnixTime(100), 10, 10000, 8000, 5000, 20),
        tokenValue('b', 'arbitrum', UnixTime(200), 20, 20000, 16000, 10000, 20),
        tokenValue('c', 'ethereum', UnixTime(150), 30, 30000, 24000, 15000, 30),
      ])
    })

    it('returns records for a project within the specified time range (inclusive)', async () => {
      const result = await repository.getByProject(
        'ethereum',
        UnixTime(100),
        UnixTime(200),
      )

      expect(result).toEqualUnsorted([
        tokenValue('a', 'ethereum', UnixTime(100), 2, 2000, 1600, 1000, 10),
        tokenValue('a', 'ethereum', UnixTime(150), 3, 3000, 2400, 1500, 10),
        tokenValue('a', 'ethereum', UnixTime(200), 4, 4000, 3200, 2000, 10),
        tokenValue('c', 'ethereum', UnixTime(150), 30, 30000, 24000, 15000, 30),
      ])
    })

    it('returns empty array when no records match the time range', async () => {
      const result = await repository.getByProject(
        'ethereum',
        UnixTime(300),
        UnixTime(400),
      )

      expect(result).toEqual([])
    })

    it('returns empty array when project does not exist', async () => {
      const result = await repository.getByProject(
        'non-existent',
        UnixTime(100),
        UnixTime(200),
      )

      expect(result).toEqual([])
    })

    it('handles single-point time range (from = to)', async () => {
      const result = await repository.getByProject(
        'ethereum',
        UnixTime(150),
        UnixTime(150),
      )

      expect(result).toEqualUnsorted([
        tokenValue('a', 'ethereum', UnixTime(150), 3, 3000, 2400, 1500, 10),
        tokenValue('c', 'ethereum', UnixTime(150), 30, 30000, 24000, 15000, 30),
      ])
    })

    it('returns records from multiple configurations for the same project', async () => {
      const result = await repository.getByProject(
        'ethereum',
        UnixTime(150),
        UnixTime(150),
      )

      expect(result).toEqualUnsorted([
        tokenValue('a', 'ethereum', UnixTime(150), 3, 3000, 2400, 1500, 10),
        tokenValue('c', 'ethereum', UnixTime(150), 30, 30000, 24000, 15000, 30),
      ])
    })

    it('respects time boundaries exactly', async () => {
      const result = await repository.getByProject(
        'ethereum',
        UnixTime(100),
        UnixTime(150),
      )

      expect(result).toEqualUnsorted([
        tokenValue('a', 'ethereum', UnixTime(100), 2, 2000, 1600, 1000, 10),
        tokenValue('a', 'ethereum', UnixTime(150), 3, 3000, 2400, 1500, 10),
        tokenValue('c', 'ethereum', UnixTime(150), 30, 30000, 24000, 15000, 30),
      ])
    })
  })

  describe(TokenValueRepository.prototype.getByTokenIdInTimeRange.name, () => {
    beforeEach(async () => {
      await repository.insertMany([
        tokenValue('a', 'ethereum', UnixTime(105), 1, 1000, 800, 500, 10),
        tokenValue('a', 'ethereum', UnixTime(110), 2, 2000, 1600, 1000, 10),
        tokenValue('a', 'ethereum', UnixTime(115), 3, 3000, 2400, 1500, 10),
        tokenValue('a', 'ethereum', UnixTime(120), 4, 4000, 3200, 2000, 10),
        tokenValue('a', 'ethereum', UnixTime(125), 5, 5000, 4000, 2500, 10),
        tokenValue('b', 'ethereum', UnixTime(110), 10, 10000, 8000, 5000, 20),
        tokenValue('b', 'ethereum', UnixTime(120), 20, 20000, 16000, 10000, 20),
        tokenValue('c', 'ethereum', UnixTime(115), 30, 30000, 24000, 15000, 30),
      ])
    })

    it('returns record for a project and token within the specified time range (inclusive) in ascending time order', async () => {
      const result = await repository.getByTokenIdInTimeRange(
        'a' as TokenId,
        UnixTime(105),
        UnixTime(125),
      )

      expect(result).toEqual([
        tokenValue('a', 'ethereum', UnixTime(105), 1, 1000, 800, 500, 10),
        tokenValue('a', 'ethereum', UnixTime(110), 2, 2000, 1600, 1000, 10),
        tokenValue('a', 'ethereum', UnixTime(115), 3, 3000, 2400, 1500, 10),
        tokenValue('a', 'ethereum', UnixTime(120), 4, 4000, 3200, 2000, 10),
        tokenValue('a', 'ethereum', UnixTime(125), 5, 5000, 4000, 2500, 10),
      ])
    })

    it('returns all records for a token when both time ranges are null', async () => {
      const result = await repository.getByTokenIdInTimeRange(
        'a' as TokenId,
        null,
        null,
      )

      expect(result).toEqual([
        tokenValue('a', 'ethereum', UnixTime(105), 1, 1000, 800, 500, 10),
        tokenValue('a', 'ethereum', UnixTime(110), 2, 2000, 1600, 1000, 10),
        tokenValue('a', 'ethereum', UnixTime(115), 3, 3000, 2400, 1500, 10),
        tokenValue('a', 'ethereum', UnixTime(120), 4, 4000, 3200, 2000, 10),
        tokenValue('a', 'ethereum', UnixTime(125), 5, 5000, 4000, 2500, 10),
      ])
    })

    it('returns records from specified time when only fromInclusive is provided', async () => {
      const result = await repository.getByTokenIdInTimeRange(
        'a' as TokenId,
        UnixTime(115),
        null,
      )

      expect(result).toEqual([
        tokenValue('a', 'ethereum', UnixTime(115), 3, 3000, 2400, 1500, 10),
        tokenValue('a', 'ethereum', UnixTime(120), 4, 4000, 3200, 2000, 10),
        tokenValue('a', 'ethereum', UnixTime(125), 5, 5000, 4000, 2500, 10),
      ])
    })

    it('returns records up to specified time when only toInclusive is provided', async () => {
      const result = await repository.getByTokenIdInTimeRange(
        'a' as TokenId,
        null,
        UnixTime(115),
      )

      expect(result).toEqual([
        tokenValue('a', 'ethereum', UnixTime(105), 1, 1000, 800, 500, 10),
        tokenValue('a', 'ethereum', UnixTime(110), 2, 2000, 1600, 1000, 10),
        tokenValue('a', 'ethereum', UnixTime(115), 3, 3000, 2400, 1500, 10),
      ])
    })

    it('returns empty array when no records match the time range', async () => {
      const result = await repository.getByTokenIdInTimeRange(
        'a' as TokenId,
        UnixTime(130),
        UnixTime(140),
      )

      expect(result).toEqual([])
    })

    it('returns empty array when token does not exist', async () => {
      const result = await repository.getByTokenIdInTimeRange(
        'non-existent' as TokenId,
        UnixTime(110),
        UnixTime(120),
      )

      expect(result).toEqual([])
    })

    it('handles single-point time range (from = to)', async () => {
      const result = await repository.getByTokenIdInTimeRange(
        'a' as TokenId,
        UnixTime(115),
        UnixTime(115),
      )

      expect(result).toEqual([
        tokenValue('a', 'ethereum', UnixTime(115), 3, 3000, 2400, 1500, 10),
      ])
    })
  })

  describe(TokenValueRepository.prototype.getByProjectAtOrBefore.name, () => {
    beforeEach(async () => {
      await repository.insertMany([
        // Token A with multiple timestamps
        tokenValue('a', 'ethereum', UnixTime(100), 1, 1000, 800, 500, 10),
        tokenValue('a', 'ethereum', UnixTime(150), 5, 5000, 4000, 2500, 10),
        tokenValue('a', 'ethereum', UnixTime(200), 10, 10000, 8000, 5000, 10),

        // Token B with multiple timestamps
        tokenValue('b', 'ethereum', UnixTime(100), 2, 2000, 1600, 1000, 10),
        tokenValue('b', 'ethereum', UnixTime(180), 8, 8000, 6400, 4000, 10),

        // Token C with a single timestamp
        tokenValue('c', 'ethereum', UnixTime(100), 3, 3000, 2400, 1500, 10),

        // Different project
        tokenValue('d', 'arbitrum', UnixTime(100), 10, 10000, 8000, 5000, 10),
        tokenValue('d', 'arbitrum', UnixTime(200), 20, 20000, 16000, 10000, 10),
      ])
    })

    it('returns latest record for each token at or before timestamp', async () => {
      const result = await repository.getByProjectAtOrBefore(
        'ethereum',
        UnixTime(180),
      )

      expect(result).toEqualUnsorted([
        tokenValue('a', 'ethereum', UnixTime(150), 5, 5000, 4000, 2500, 10),
        tokenValue('b', 'ethereum', UnixTime(180), 8, 8000, 6400, 4000, 10),
        tokenValue('c', 'ethereum', UnixTime(100), 3, 3000, 2400, 1500, 10),
      ])
    })

    it('returns records exactly at the timestamp when available', async () => {
      const result = await repository.getByProjectAtOrBefore(
        'ethereum',
        UnixTime(100),
      )

      expect(result).toEqualUnsorted([
        tokenValue('a', 'ethereum', UnixTime(100), 1, 1000, 800, 500, 10),
        tokenValue('b', 'ethereum', UnixTime(100), 2, 2000, 1600, 1000, 10),
        tokenValue('c', 'ethereum', UnixTime(100), 3, 3000, 2400, 1500, 10),
      ])
    })

    it('returns records before the timestamp when no exact match', async () => {
      const result = await repository.getByProjectAtOrBefore(
        'ethereum',
        UnixTime(170),
      )

      expect(result).toEqualUnsorted([
        tokenValue('a', 'ethereum', UnixTime(150), 5, 5000, 4000, 2500, 10),
        tokenValue('b', 'ethereum', UnixTime(100), 2, 2000, 1600, 1000, 10),
        tokenValue('c', 'ethereum', UnixTime(100), 3, 3000, 2400, 1500, 10),
      ])
    })

    it('returns empty array when no records before or at timestamp', async () => {
      const result = await repository.getByProjectAtOrBefore(
        'ethereum',
        UnixTime(50),
      )

      expect(result).toEqual([])
    })

    it('returns records up to the latest timestamp for each token', async () => {
      const result = await repository.getByProjectAtOrBefore(
        'ethereum',
        UnixTime(250),
      )

      expect(result).toEqualUnsorted([
        tokenValue('a', 'ethereum', UnixTime(200), 10, 10000, 8000, 5000, 10),
        tokenValue('b', 'ethereum', UnixTime(180), 8, 8000, 6400, 4000, 10),
        tokenValue('c', 'ethereum', UnixTime(100), 3, 3000, 2400, 1500, 10),
      ])
    })
  })

  describe(TokenValueRepository.prototype.getLastNonZeroValue.name, () => {
    beforeEach(async () => {
      await repository.insertMany([
        // Token A with multiple timestamps
        tokenValue('a', 'ethereum', UnixTime(100), 1, 1000, 800, 500, 10),
        tokenValue('a', 'ethereum', UnixTime(150), 5, 5000, 4000, 2500, 10),
        tokenValue('a', 'ethereum', UnixTime(200), 10, 10000, 8000, 5000, 10),

        // Token B with zero value at some timestamps
        tokenValue('b', 'ethereum', UnixTime(100), 2, 2000, 1600, 1000, 20),
        tokenValue('b', 'ethereum', UnixTime(130), 0, 0, 0, 0, 20), // zero value

        // Token C with a single timestamp
        tokenValue('c', 'arbitrum', UnixTime(100), 3, 3000, 2400, 1500, 30),
      ])
    })

    it('returns latest non-zero record for each token at or before timestamp', async () => {
      const result = await repository.getLastNonZeroValue(UnixTime(150))

      expect(result).toEqualUnsorted([
        tokenValue('a', 'ethereum', UnixTime(150), 5, 5000, 4000, 2500, 10),
        tokenValue('b', 'ethereum', UnixTime(100), 2, 2000, 1600, 1000, 20),
        tokenValue('c', 'arbitrum', UnixTime(100), 3, 3000, 2400, 1500, 30),
      ])
    })

    it('returns latest non-zero record for each token of given project at or before timestamp', async () => {
      const result = await repository.getLastNonZeroValue(
        UnixTime(150),
        'ethereum',
      )

      expect(result).toEqualUnsorted([
        tokenValue('a', 'ethereum', UnixTime(150), 5, 5000, 4000, 2500, 10),
        tokenValue('b', 'ethereum', UnixTime(100), 2, 2000, 1600, 1000, 20),
      ])
    })
  })

  describe(
    TokenValueRepository.prototype.deleteByConfigInTimeRange.name,
    () => {
      it('deletes data in range for matching config', async () => {
        await repository.insertMany([
          tokenValue('b', 'ethereum', UnixTime(1), 1, 1000, 800, 500, 10),
          tokenValue('b', 'ethereum', UnixTime(2), 2, 2000, 1600, 1000, 20),
          tokenValue('b', 'ethereum', UnixTime(3), 3, 3000, 2400, 1500, 30),
          tokenValue('c', 'arbitrum', UnixTime(2), 1000, 1000, 800, 500, 40),
        ])

        const deleted = await repository.deleteByConfigInTimeRange(
          'b'.repeat(12),
          UnixTime(1),
          UnixTime(2),
        )

        expect(deleted).toEqual(2)

        const results = await repository.getAll()
        expect(results).toEqualUnsorted([
          tokenValue('b', 'ethereum', UnixTime(3), 3, 3000, 2400, 1500, 30),
          tokenValue('c', 'arbitrum', UnixTime(2), 1000, 1000, 800, 500, 40),
        ])
      })

      it('returns 0 if no matching config found', async () => {
        await repository.insertMany([
          tokenValue('b', 'ethereum', UnixTime(1), 1, 1000, 800, 500, 10),
        ])

        const deleted = await repository.deleteByConfigInTimeRange(
          'c'.repeat(12),
          UnixTime(1),
          UnixTime(2),
        )

        expect(deleted).toEqual(0)

        const results = await repository.getAll()
        expect(results).toEqualUnsorted([
          tokenValue('b', 'ethereum', UnixTime(1), 1, 1000, 800, 500, 10),
        ])
      })
    },
  )

  describe(TokenValueRepository.prototype.checkIfExists.name, () => {
    beforeEach(async () => {
      await repository.insertMany([
        tokenValue('a', 'ethereum', UnixTime(100), 1, 1000, 800, 500, 10),
        tokenValue('a', 'ethereum', UnixTime(200), 2, 2000, 1600, 1000, 10),
        tokenValue('b', 'arbitrum', UnixTime(150), 10, 10000, 8000, 5000, 20),
        tokenValue('c', 'optimism', UnixTime(300), 5, 5000, 4000, 2500, 30),
      ])
    })

    it('returns true when project exists', async () => {
      const exists = await repository.checkIfExists('ethereum')
      expect(exists).toEqual(true)
    })

    it('returns false when project does not exist', async () => {
      const exists = await repository.checkIfExists('non-existent')
      expect(exists).toEqual(false)
    })

    it('returns true when project has records from specified timestamp', async () => {
      const exists = await repository.checkIfExists('ethereum', UnixTime(200))
      expect(exists).toEqual(true)
    })

    it('returns false when project has no records from specified timestamp', async () => {
      const exists = await repository.checkIfExists('ethereum', UnixTime(250))
      expect(exists).toEqual(false)
    })
  })

  describe('dal tvs', () => {
    const metadataRepository = db.tvsTokenMetadata

    beforeEach(async () => {
      // Insert token metadata with different sources and categories
      await metadataRepository.insertMany([
        // Ethereum tokens
        {
          projectId: 'ethereum',
          tokenId: 'a', // eth-canonical-ether
          source: 'canonical',
          category: 'ether',
          isAssociated: false,
        },
        {
          projectId: 'ethereum',
          tokenId: 'b', // eth-canonical-stablecoin
          source: 'canonical',
          category: 'stablecoin',
          isAssociated: false,
        },
        {
          projectId: 'ethereum',
          tokenId: 'c', // eth-external-btc
          source: 'external',
          category: 'btc',
          isAssociated: false,
        },
        {
          projectId: 'ethereum',
          tokenId: 'd', // eth-native-other
          source: 'native',
          category: 'other',
          isAssociated: false,
        },
        {
          projectId: 'ethereum',
          tokenId: 'e', // eth-associated-token
          source: 'canonical',
          category: 'ether',
          isAssociated: true,
        },
        // Arbitrum tokens
        {
          projectId: 'arbitrum',
          tokenId: 'f', // arb-canonical-ether
          source: 'canonical',
          category: 'ether',
          isAssociated: false,
        },
        {
          projectId: 'arbitrum',
          tokenId: 'g', // arb-external-rwa-restricted
          source: 'external',
          category: 'rwaRestricted',
          isAssociated: false,
        },
        {
          projectId: 'arbitrum',
          tokenId: 'h', // arb-native-rwa-public
          source: 'native',
          category: 'rwaPublic',
          isAssociated: false,
        },
      ])

      // Insert token values at different timestamps
      await repository.insertMany([
        // Timestamp 100
        tokenValue(
          'a', // eth-canonical-ether
          'ethereum',
          UnixTime(100),
          100.5,
          10000.5,
          8000.5,
          5000.25,
          99.5,
        ),
        tokenValue(
          'b', // eth-canonical-stablecoin
          'ethereum',
          UnixTime(100),
          200.25,
          20000.25,
          16000.25,
          10000.5,
          100.25,
        ),
        tokenValue(
          'c', // eth-external-btc
          'ethereum',
          UnixTime(100),
          50.75,
          5000.75,
          4000.75,
          2500.5,
          98.75,
        ),
        tokenValue(
          'd', // eth-native-other
          'ethereum',
          UnixTime(100),
          30.5,
          3000.5,
          2400.5,
          1500.75,
          98.5,
        ),
        tokenValue(
          'e', // eth-associated-token
          'ethereum',
          UnixTime(100),
          10.25,
          1000.25,
          800.25,
          500.5,
          97.5,
        ),
        tokenValue(
          'f', // arb-canonical-ether
          'arbitrum',
          UnixTime(100),
          150.75,
          15000.5,
          12000.25,
          7500.75,
          99.75,
        ),

        // Timestamp 200
        tokenValue(
          'a', // eth-canonical-ether
          'ethereum',
          UnixTime(200),
          200.5,
          20000.25,
          16000.25,
          10000.5,
          100.25,
        ),
        tokenValue(
          'g', // arb-external-rwa-restricted
          'arbitrum',
          UnixTime(200),
          100.25,
          10000.5,
          8000.5,
          5000.25,
          100.5,
        ),
        tokenValue(
          'h', // arb-native-rwa-public
          'arbitrum',
          UnixTime(200),
          80.75,
          8000.5,
          6400.5,
          4000.5,
          99.25,
        ),

        // Timestamp 300
        tokenValue(
          'a', // eth-canonical-ether
          'ethereum',
          UnixTime(300),
          300.5,
          30000.25,
          24000.25,
          15000.5,
          100.5,
        ),
        tokenValue(
          'f', // arb-canonical-ether
          'arbitrum',
          UnixTime(300),
          250.75,
          25000.5,
          20000.25,
          12500.75,
          99.75,
        ),
      ])
    })

    describe(
      TokenValueRepository.prototype.getSummedByTimestampByProjects.name,
      () => {
        it('sums values by timestamp for multiple projects using valueForProject', async () => {
          const result = await repository.getSummedByTimestampByProjects(
            ['ethereum', 'arbitrum'],
            null,
            null,
            {
              forSummary: false,
              excludeAssociated: false,
              includeRwaRestrictedTokens: true,
            },
          )

          expect(result).toEqualUnsorted([
            {
              timestamp: UnixTime(100),
              value: 8000.5 + 16000.25 + 4000.75 + 2400.5 + 800.25 + 12000.25,
              canonical: 8000.5 + 16000.25 + 800.25 + 12000.25,
              external: 4000.75,
              native: 2400.5,
              ether: 8000.5 + 800.25 + 12000.25,
              stablecoin: 16000.25,
              btc: 4000.75,
              rwaRestricted: 0,
              rwaPublic: 0,
              other: 2400.5,
            },
            {
              timestamp: UnixTime(200),
              value: 16000.25 + 8000.5 + 6400.5,
              canonical: 16000.25,
              external: 8000.5,
              native: 6400.5,
              ether: 16000.25,
              stablecoin: 0,
              btc: 0,
              rwaRestricted: 8000.5,
              rwaPublic: 6400.5,
              other: 0,
            },
            {
              timestamp: UnixTime(300),
              value: 24000.25 + 20000.25,
              canonical: 24000.25 + 20000.25,
              external: 0,
              native: 0,
              ether: 24000.25 + 20000.25,
              stablecoin: 0,
              btc: 0,
              rwaRestricted: 0,
              rwaPublic: 0,
              other: 0,
            },
          ])
        })

        it('sums values by timestamp for multiple projects using valueForSummary', async () => {
          const result = await repository.getSummedByTimestampByProjects(
            ['ethereum', 'arbitrum'],
            null,
            null,
            {
              forSummary: true,
              excludeAssociated: false,
              includeRwaRestrictedTokens: true,
            },
          )

          expect(result).toEqualUnsorted([
            {
              timestamp: UnixTime(100),
              value: 5000.25 + 10000.5 + 2500.5 + 1500.75 + 500.5 + 7500.75,
              canonical: 5000.25 + 10000.5 + 500.5 + 7500.75,
              external: 2500.5,
              native: 1500.75,
              ether: 5000.25 + 500.5 + 7500.75,
              stablecoin: 10000.5,
              btc: 2500.5,
              rwaRestricted: 0,
              rwaPublic: 0,
              other: 1500.75,
            },
            {
              timestamp: UnixTime(200),
              value: 10000.5 + 5000.25 + 4000.5,
              canonical: 10000.5,
              external: 5000.25,
              native: 4000.5,
              ether: 10000.5,
              stablecoin: 0,
              btc: 0,
              rwaRestricted: 5000.25,
              rwaPublic: 4000.5,
              other: 0,
            },
            {
              timestamp: UnixTime(300),
              value: 15000.5 + 12500.75,
              canonical: 15000.5 + 12500.75,
              external: 0,
              native: 0,
              ether: 15000.5 + 12500.75,
              stablecoin: 0,
              btc: 0,
              rwaRestricted: 0,
              rwaPublic: 0,
              other: 0,
            },
          ])
        })

        it('filters by time range with fromInclusive', async () => {
          const result = await repository.getSummedByTimestampByProjects(
            ['ethereum', 'arbitrum'],
            UnixTime(200),
            null,
            {
              forSummary: false,
              excludeAssociated: false,
              includeRwaRestrictedTokens: true,
            },
          )

          expect(result).toEqualUnsorted([
            {
              timestamp: UnixTime(200),
              value: 16000.25 + 8000.5 + 6400.5,
              canonical: 16000.25,
              external: 8000.5,
              native: 6400.5,
              ether: 16000.25,
              stablecoin: 0,
              btc: 0,
              rwaRestricted: 8000.5,
              rwaPublic: 6400.5,
              other: 0,
            },
            {
              timestamp: UnixTime(300),
              value: 24000.25 + 20000.25,
              canonical: 24000.25 + 20000.25,
              external: 0,
              native: 0,
              ether: 24000.25 + 20000.25,
              stablecoin: 0,
              btc: 0,
              rwaRestricted: 0,
              rwaPublic: 0,
              other: 0,
            },
          ])
        })

        it('filters by time range with toInclusive', async () => {
          const result = await repository.getSummedByTimestampByProjects(
            ['ethereum', 'arbitrum'],
            null,
            UnixTime(200),
            {
              forSummary: false,
              excludeAssociated: false,
              includeRwaRestrictedTokens: true,
            },
          )

          expect(result).toEqualUnsorted([
            {
              timestamp: UnixTime(100),
              value: 8000.5 + 16000.25 + 4000.75 + 2400.5 + 800.25 + 12000.25,
              canonical: 8000.5 + 16000.25 + 800.25 + 12000.25,
              external: 4000.75,
              native: 2400.5,
              ether: 8000.5 + 800.25 + 12000.25,
              stablecoin: 16000.25,
              btc: 4000.75,
              rwaRestricted: 0,
              rwaPublic: 0,
              other: 2400.5,
            },
            {
              timestamp: UnixTime(200),
              value: 16000.25 + 8000.5 + 6400.5,
              canonical: 16000.25,
              external: 8000.5,
              native: 6400.5,
              ether: 16000.25,
              stablecoin: 0,
              btc: 0,
              rwaRestricted: 8000.5,
              rwaPublic: 6400.5,
              other: 0,
            },
          ])
        })

        it('excludes associated tokens when excludeAssociated is true', async () => {
          const result = await repository.getSummedByTimestampByProjects(
            ['ethereum', 'arbitrum'],
            UnixTime(100),
            UnixTime(100),
            {
              forSummary: false,
              excludeAssociated: true,
              includeRwaRestrictedTokens: true,
            },
          )

          expect(result).toEqualUnsorted([
            {
              timestamp: UnixTime(100),
              value: 8000.5 + 16000.25 + 4000.75 + 2400.5 + 12000.25,
              canonical: 8000.5 + 16000.25 + 12000.25,
              external: 4000.75,
              native: 2400.5,
              ether: 8000.5 + 12000.25,
              stablecoin: 16000.25,
              btc: 4000.75,
              rwaRestricted: 0,
              rwaPublic: 0,
              other: 2400.5,
            },
          ])
        })

        it('returns empty array when no matching projects', async () => {
          const result = await repository.getSummedByTimestampByProjects(
            ['non-existent'],
            null,
            null,
            {
              forSummary: false,
              excludeAssociated: false,
              includeRwaRestrictedTokens: true,
            },
          )

          expect(result).toEqual([])
        })

        it('excludes rwaRestricted tokens when includeRwaRestrictedTokens is false', async () => {
          const result = await repository.getSummedByTimestampByProjects(
            ['ethereum', 'arbitrum'],
            UnixTime(200),
            UnixTime(200),
            {
              forSummary: false,
              excludeAssociated: false,
              includeRwaRestrictedTokens: false,
            },
          )

          expect(result).toEqualUnsorted([
            {
              timestamp: UnixTime(200),
              // Token 'a' (ethereum) + Token 'h' (arbitrum, rwaPublic)
              // Token 'g' (arbitrum, rwaRestricted) should be excluded
              value: 16000.25 + 6400.5, // 'a' + 'h'
              canonical: 16000.25, // 'a'
              external: 0, // 'g' was external but excluded
              native: 6400.5, // 'h'
              ether: 16000.25, // 'a'
              stablecoin: 0,
              btc: 0,
              rwaRestricted: 0, // excluded
              rwaPublic: 6400.5, // 'h'
              other: 0,
            },
          ])
        })
      },
    )

    afterEach(async () => {
      await repository.deleteAll()
      await metadataRepository.deleteAll()
    })

    describe(
      TokenValueRepository.prototype.getSummedAtTimestampsByProjects.name,
      () => {
        it('returns summed values at specific timestamps for projects', async () => {
          const result = await repository.getSummedAtTimestampsByProjects(
            100, // oldestTimestamp
            300, // latestTimestamp
            {
              excludeAssociated: false,
              includeRwaRestrictedTokens: true,
              cutOffTimestamp: 50,
            },
          )

          expect(result).toEqualUnsorted([
            {
              timestamp: UnixTime(100),
              project: 'ethereum',
              value: 8000.5 + 16000.25 + 4000.75 + 2400.5 + 800.25, // a + b + c + d + e valueForProject
              canonical: 8000.5 + 16000.25 + 800.25, // a + b + e
              external: 4000.75, // c
              native: 2400.5, // d
              ether: 8000.5 + 800.25, // a + e
              stablecoin: 16000.25, // b
              btc: 4000.75, // c
              rwaRestricted: 0,
              rwaPublic: 0,
              other: 2400.5, // d
              associated: 800.25, // e
            },
            {
              timestamp: UnixTime(100),
              project: 'arbitrum',
              value: 12000.25, // f valueForProject
              canonical: 12000.25, // f
              external: 0,
              native: 0,
              ether: 12000.25, // f
              stablecoin: 0,
              btc: 0,
              rwaRestricted: 0,
              rwaPublic: 0,
              other: 0,
              associated: 0,
            },
            {
              timestamp: UnixTime(300),
              project: 'ethereum',
              value: 24000.25, // a valueForProject
              canonical: 24000.25, // a
              external: 0,
              native: 0,
              ether: 24000.25, // a
              stablecoin: 0,
              btc: 0,
              rwaRestricted: 0,
              rwaPublic: 0,
              other: 0,
              associated: 0,
            },
            {
              timestamp: UnixTime(300),
              project: 'arbitrum',
              value: 20000.25, // f valueForProject
              canonical: 20000.25, // f
              external: 0,
              native: 0,
              ether: 20000.25, // f
              stablecoin: 0,
              btc: 0,
              rwaRestricted: 0,
              rwaPublic: 0,
              other: 0,
              associated: 0,
            },
          ])
        })

        it('excludes associated tokens when excludeAssociated is true', async () => {
          const result = await repository.getSummedAtTimestampsByProjects(
            100, // oldestTimestamp
            100, // latestTimestamp (only timestamp 100)
            {
              excludeAssociated: true,
              includeRwaRestrictedTokens: true,
              cutOffTimestamp: 50,
            },
          )

          expect(result).toEqualUnsorted([
            {
              timestamp: UnixTime(100),
              project: 'ethereum',
              value: 8000.5 + 16000.25 + 4000.75 + 2400.5, // a + b + c + d (excluding e)
              canonical: 8000.5 + 16000.25, // a + b (excluding e)
              external: 4000.75, // c
              native: 2400.5, // d
              ether: 8000.5, // a (excluding e)
              stablecoin: 16000.25, // b
              btc: 4000.75, // c
              rwaRestricted: 0,
              rwaPublic: 0,
              other: 2400.5, // d
              associated: 0, // excluded
            },
            {
              timestamp: UnixTime(100),
              project: 'arbitrum',
              value: 12000.25, // f
              canonical: 12000.25, // f
              external: 0,
              native: 0,
              ether: 12000.25, // f
              stablecoin: 0,
              btc: 0,
              rwaRestricted: 0,
              rwaPublic: 0,
              other: 0,
              associated: 0,
            },
          ])
        })

        it('returns empty array when no timestamps match the range', async () => {
          const result = await repository.getSummedAtTimestampsByProjects(
            400, // oldestTimestamp - no data at this timestamp
            500, // latestTimestamp - no data at this timestamp
            {
              excludeAssociated: false,
              includeRwaRestrictedTokens: true,
              cutOffTimestamp: 50,
            },
          )

          expect(result).toEqual([])
        })

        it('correctly categorizes tokens by source and category', async () => {
          // Test specifically timestamp 200 which has different token types
          const result = await repository.getSummedAtTimestampsByProjects(
            200,
            200,
            {
              excludeAssociated: false,
              includeRwaRestrictedTokens: true,
              cutOffTimestamp: 50,
            },
          )

          const arbitrumResult = result.find((r) => r.project === 'arbitrum')
          assert(arbitrumResult)

          // Check source breakdown
          expect(arbitrumResult.canonical).toEqual(0)
          expect(arbitrumResult.external).toEqual(8000.5) // g (rwaRestricted)
          expect(arbitrumResult.native).toEqual(6400.5) // h (rwaPublic)

          // Check category breakdown
          expect(arbitrumResult.rwaRestricted).toEqual(8000.5) // g
          expect(arbitrumResult.rwaPublic).toEqual(6400.5) // h
          expect(arbitrumResult.ether).toEqual(0)
          expect(arbitrumResult.stablecoin).toEqual(0)
          expect(arbitrumResult.btc).toEqual(0)
          expect(arbitrumResult.other).toEqual(0)
        })

        it('includes associated tokens in the associated field', async () => {
          const result = await repository.getSummedAtTimestampsByProjects(
            100,
            100,
            {
              excludeAssociated: false,
              includeRwaRestrictedTokens: true,
              cutOffTimestamp: 50,
            },
          )

          const ethereumResult = result.find((r) => r.project === 'ethereum')
          assert(ethereumResult)

          expect(ethereumResult.associated).toEqual(800.25) // token e
        })

        it('excludes rwaRestricted tokens when includeRwaRestrictedTokens is false', async () => {
          const result = await repository.getSummedAtTimestampsByProjects(
            200, // timestamp where we have rwaRestricted token 'g'
            200,
            {
              excludeAssociated: false,
              includeRwaRestrictedTokens: false,
              cutOffTimestamp: 50,
            },
          )

          const ethereumResult = result.find((r) => r.project === 'ethereum')
          assert(ethereumResult)
          expect(ethereumResult.value).toEqual(16000.25) // only token 'a'

          const arbitrumResult = result.find((r) => r.project === 'arbitrum')
          assert(arbitrumResult)

          // Token 'g' (rwaRestricted) should be excluded, only 'h' (rwaPublic) should be included
          expect(arbitrumResult.value).toEqual(6400.5) // only token 'h' (rwaPublic)
          expect(arbitrumResult.external).toEqual(0) // token 'g' was external but excluded
          expect(arbitrumResult.native).toEqual(6400.5) // token 'h' is native
          expect(arbitrumResult.rwaRestricted).toEqual(0) // excluded
          expect(arbitrumResult.rwaPublic).toEqual(6400.5) // token 'h'
        })
      },
    )
  })

  afterEach(async () => {
    await repository.deleteAll()
  })
})

function tokenValue(
  configId: string,
  projectId: string,
  timestamp: UnixTime,
  amount: number,
  value: number,
  valueForProject: number,
  valueForSummary: number,
  priceUsd: number,
) {
  return {
    configurationId: configId.repeat(12),
    projectId,
    timestamp,
    tokenId: configId,
    amount,
    value,
    valueForProject,
    valueForSummary,
    priceUsd,
  }
}
