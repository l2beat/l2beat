import type {
  Database,
  InteropTransferRecord,
  TokenDatabase,
  TokenIngestionQueueRecord,
} from '@l2beat/database'
import { Address32, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { Chain } from '../chains/Chain'
import type { CoingeckoClient } from '../chains/clients/coingecko/CoingeckoClient'
import type { DeployedTokenFacts } from '../chains/fetchDeployedTokenFacts'
import type { IngestionTrace } from './IngestionTrace'
import { TokenIngestionProcessor } from './TokenIngestionProcessor'
import { buildInteropTransferIndex } from './tokenIngestionUtils'

describe(TokenIngestionProcessor.name, () => {
  describe(TokenIngestionProcessor.prototype.plan.name, () => {
    it('does not count non-swapping transfers without a recorded other side', async () => {
      const address = token('ethereum', '0xaaa')
      const getByPrimaryKeys = mockFn().resolvesTo([])

      const processor = createProcessor({
        tokenDb: mockObject<TokenDatabase>({
          deployedToken: mockObject<TokenDatabase['deployedToken']>({
            findByChainAndAddress: mockFn().resolvesTo(undefined),
            getByPrimaryKeys,
          }),
          chain: mockObject<TokenDatabase['chain']>({
            getAll: mockFn().resolvesTo([]),
          }),
        }),
        coingeckoClient: mockObject<CoingeckoClient>({
          getCoinList: mockFn().resolvesTo([]),
        }),
      })

      const trace = await processor.plan(
        queueEntry(address),
        buildInteropTransferIndex([
          transfer({
            srcChain: address.chain,
            srcTokenAddress: `0x${address.address.slice(2).padStart(64, '0')}`,
            dstChain: 'base',
            dstTokenAddress: Address32.ZERO,
            bridgeType: 'burnAndMint',
          }),
        ]),
      )

      expect(trace.id).toMatchRegex(/^ing_[0-9a-f-]{36}$/)
      expect(trace.existingDeployedToken).toEqual(undefined)
      expect(
        trace.steps.find((step) => step.kind === 'transfer-evidence'),
      ).toEqual({
        kind: 'transfer-evidence',
        total: 1,
        nonSwapping: 0,
        abstractTokens: [],
      })
      expect(getByPrimaryKeys).toHaveBeenCalledWith([])
    })

    it('records the existing deployed token on the trace', async () => {
      const address = token('ethereum', '0xaaa')
      const existing = {
        ...address,
        abstractTokenId: 'USDC01',
        symbol: 'USDC',
        comment: null,
        decimals: 6,
        deploymentTimestamp: UnixTime(1),
        metadata: null,
      }

      const processor = createProcessor({
        tokenDb: mockObject<TokenDatabase>({
          deployedToken: mockObject<TokenDatabase['deployedToken']>({
            findByChainAndAddress: mockFn().resolvesTo(existing),
            getByPrimaryKeys: mockFn().resolvesTo([]),
          }),
          abstractToken: mockObject<TokenDatabase['abstractToken']>({
            getByIds: mockFn().resolvesTo([
              abstractTokenRecord('USDC01', 'USDC'),
            ]),
            findById: mockFn().resolvesTo(
              abstractTokenRecord('USDC01', 'USDC'),
            ),
          }),
        }),
      })

      const trace = await processor.plan(
        queueEntry(address),
        buildInteropTransferIndex([]),
      )

      expect(trace.existingDeployedToken).toEqual(existing)
      expect(trace.outcome).toEqual({ kind: 'noop', deployedToken: existing })
    })

    it('returns pending-insert without fetching deployed-token facts for a new address', async () => {
      const address = token('ethereum', '0xaaa')
      const otherAddress = token('base', '0xbbb')
      const fetchDeployedTokenFacts = mockFn().resolvesTo({
        isContract: true,
        symbol: 'USDC',
        symbolSource: 'rpc',
        decimals: 6,
        deploymentTimestamp: UnixTime(1),
        warnings: [],
      })
      const findByName = mockFn().resolvesTo(undefined)

      const processor = createProcessor({
        tokenDb: mockObject<TokenDatabase>({
          deployedToken: mockObject<TokenDatabase['deployedToken']>({
            findByChainAndAddress: mockFn().resolvesTo(undefined),
            getByPrimaryKeys: mockFn().resolvesTo([
              {
                ...otherAddress,
                abstractTokenId: 'USDC01',
                symbol: 'USDC',
                comment: null,
                decimals: 6,
                deploymentTimestamp: UnixTime(1),
                metadata: null,
              },
            ]),
          }),
          abstractToken: mockObject<TokenDatabase['abstractToken']>({
            getByIds: mockFn().resolvesTo([
              abstractTokenRecord('USDC01', 'USDC'),
            ]),
          }),
          chain: mockObject<TokenDatabase['chain']>({ findByName }),
        }),
        fetchDeployedTokenFacts,
      })

      const trace = await processor.plan(
        queueEntry(address),
        buildInteropTransferIndex([
          transfer({
            srcChain: address.chain,
            srcTokenAddress: address.address,
            srcRawAmount: 0n,
            dstChain: otherAddress.chain,
            dstTokenAddress: otherAddress.address,
            dstRawAmount: 123n,
            bridgeType: 'lockAndMint',
          }),
        ]),
      )

      expect(trace.outcome.kind).toEqual('pending')
      if (trace.outcome.kind !== 'pending') return
      expect(trace.outcome.abstract).toEqual({
        kind: 'existing',
        token: { id: 'USDC01', symbol: 'USDC' },
      })
      expect(trace.outcome.neighborsToEnqueue).toEqual([otherAddress])
      expect(trace.outcome.proof.kind).toEqual('non-swapping-transfer')
      if (trace.outcome.proof.kind !== 'non-swapping-transfer') return
      const proof = trace.outcome.proof
      expect(proof.transfer.transferId).toEqual('transfer-id')
      expect(proof.transfer.srcRawAmount).toEqual('0')
      expect(proof.transfer.dstRawAmount).toEqual('123')
      expect(() => JSON.stringify(proof)).not.toThrow()
      expect(trace.steps.some((step) => step.kind === 'fetched-facts')).toEqual(
        false,
      )
      expect(fetchDeployedTokenFacts).toHaveBeenCalledTimes(0)
      expect(findByName).toHaveBeenCalledTimes(0)
    })

    it('records the first supporting transfer as proof and ignores transfers whose other side has no abstract', async () => {
      const address = token('ethereum', '0xaaa')
      const knownOther = token('base', '0xbbb')
      const unknownOther = token('arbitrum', '0xccc')

      const processor = createProcessor({
        tokenDb: mockObject<TokenDatabase>({
          deployedToken: mockObject<TokenDatabase['deployedToken']>({
            findByChainAndAddress: mockFn().resolvesTo(undefined),
            getByPrimaryKeys: mockFn().resolvesTo([
              {
                ...knownOther,
                abstractTokenId: 'USDC01',
                symbol: 'USDC',
                comment: null,
                decimals: 6,
                deploymentTimestamp: UnixTime(1),
                metadata: null,
              },
            ]),
          }),
          abstractToken: mockObject<TokenDatabase['abstractToken']>({
            getByIds: mockFn().resolvesTo([
              abstractTokenRecord('USDC01', 'USDC'),
            ]),
          }),
          chain: mockObject<TokenDatabase['chain']>({
            findByName: mockFn().resolvesTo(undefined),
          }),
        }),
      })

      const trace = await processor.plan(
        queueEntry(address),
        buildInteropTransferIndex([
          transfer({
            transferId: 'transfer-known-1',
            srcChain: address.chain,
            srcTokenAddress: address.address,
            dstChain: knownOther.chain,
            dstTokenAddress: knownOther.address,
            bridgeType: 'lockAndMint',
          }),
          transfer({
            transferId: 'transfer-known-2',
            srcChain: address.chain,
            srcTokenAddress: address.address,
            dstChain: knownOther.chain,
            dstTokenAddress: knownOther.address,
            bridgeType: 'burnAndMint',
          }),
          transfer({
            transferId: 'transfer-unknown',
            srcChain: address.chain,
            srcTokenAddress: address.address,
            dstChain: unknownOther.chain,
            dstTokenAddress: unknownOther.address,
            bridgeType: 'lockAndMint',
          }),
        ]),
      )

      expect(trace.outcome.kind).toEqual('pending')
      if (trace.outcome.kind !== 'pending') return
      expect(trace.outcome.proof.kind).toEqual('non-swapping-transfer')
      if (trace.outcome.proof.kind !== 'non-swapping-transfer') return
      expect(trace.outcome.proof.transfer.transferId).toEqual(
        'transfer-known-1',
      )
    })

    it('downgrades a transfer-driven update of an existing token to conflict when symbols differ', async () => {
      const address = token('ethereum', '0xaaa')
      const otherAddress = token('base', '0xbbb')

      const processor = createProcessor({
        tokenDb: mockObject<TokenDatabase>({
          deployedToken: mockObject<TokenDatabase['deployedToken']>({
            findByChainAndAddress: mockFn().resolvesTo({
              ...address,
              abstractTokenId: null,
              symbol: 'WETH',
              comment: null,
              decimals: 18,
              deploymentTimestamp: UnixTime(1),
              metadata: null,
            }),
            getByPrimaryKeys: mockFn().resolvesTo([
              {
                ...otherAddress,
                abstractTokenId: 'USDC01',
                symbol: 'USDC',
                comment: null,
                decimals: 6,
                deploymentTimestamp: UnixTime(1),
                metadata: null,
              },
            ]),
          }),
          abstractToken: mockObject<TokenDatabase['abstractToken']>({
            getByIds: mockFn().resolvesTo([
              abstractTokenRecord('USDC01', 'USDC'),
            ]),
          }),
        }),
      })

      const trace = await processor.plan(
        queueEntry(address),
        buildInteropTransferIndex([
          transfer({
            srcChain: address.chain,
            srcTokenAddress: address.address,
            dstChain: otherAddress.chain,
            dstTokenAddress: otherAddress.address,
            bridgeType: 'lockAndMint',
          }),
        ]),
      )

      expect(trace.outcome).toEqual({
        kind: 'conflict',
        message:
          'Non-swapping transfers point to abstract token USDC01:USDC, but the deployed token symbol is WETH.',
      })
    })

    it('updates an existing token from a transfer when symbols match case-insensitively', async () => {
      const address = token('ethereum', '0xaaa')
      const otherAddress = token('base', '0xbbb')

      const processor = createProcessor({
        tokenDb: mockObject<TokenDatabase>({
          deployedToken: mockObject<TokenDatabase['deployedToken']>({
            findByChainAndAddress: mockFn().resolvesTo({
              ...address,
              abstractTokenId: null,
              symbol: 'usdc',
              comment: null,
              decimals: 6,
              deploymentTimestamp: UnixTime(1),
              metadata: null,
            }),
            getByPrimaryKeys: mockFn().resolvesTo([
              {
                ...otherAddress,
                abstractTokenId: 'USDC01',
                symbol: 'USDC',
                comment: null,
                decimals: 6,
                deploymentTimestamp: UnixTime(1),
                metadata: null,
              },
            ]),
          }),
          abstractToken: mockObject<TokenDatabase['abstractToken']>({
            getByIds: mockFn().resolvesTo([
              abstractTokenRecord('USDC01', 'USDC'),
            ]),
          }),
        }),
      })

      const trace = await processor.plan(
        queueEntry(address),
        buildInteropTransferIndex([
          transfer({
            srcChain: address.chain,
            srcTokenAddress: address.address,
            dstChain: otherAddress.chain,
            dstTokenAddress: otherAddress.address,
            bridgeType: 'lockAndMint',
          }),
        ]),
      )

      expect(trace.outcome.kind).toEqual('write')
      if (trace.outcome.kind !== 'write') return
      expect(trace.outcome.deployedToken.type).toEqual('update')
      if (trace.outcome.deployedToken.type !== 'update') return
      expect(trace.outcome.deployedToken.update.abstractTokenId).toEqual(
        'USDC01',
      )
    })

    it('returns pending with new-coingecko abstract without calling CoinGecko coin endpoints', async () => {
      const address = token('ethereum', '0xaaa')
      const getCoinDataById = mockFn().resolvesTo(undefined)
      const getCoinMarketChartRange = mockFn().resolvesTo(undefined)

      const processor = createProcessor({
        tokenDb: mockObject<TokenDatabase>({
          deployedToken: mockObject<TokenDatabase['deployedToken']>({
            findByChainAndAddress: mockFn().resolvesTo(undefined),
            getByPrimaryKeys: mockFn().resolvesTo([]),
          }),
          abstractToken: mockObject<TokenDatabase['abstractToken']>({
            findByCoingeckoId: mockFn().resolvesTo(undefined),
          }),
          chain: mockObject<TokenDatabase['chain']>({
            getAll: mockFn().resolvesTo([
              {
                name: 'ethereum',
                chainId: 1,
                explorerUrl: null,
                aliases: ['eth'],
                apis: null,
              },
            ]),
          }),
        }),
        coingeckoClient: mockObject<CoingeckoClient>({
          getCoinList: mockFn().resolvesTo([
            {
              id: 'usd-coin',
              name: 'USD Coin',
              symbol: 'usdc',
              platforms: { eth: address.address },
            },
          ]),
          getCoinDataById,
          getCoinMarketChartRange,
        }),
      })

      const trace = await processor.plan(
        queueEntry(address),
        buildInteropTransferIndex([]),
      )

      expect(trace.outcome).toEqual({
        kind: 'pending',
        operation: 'insert',
        existing: undefined,
        abstract: {
          kind: 'new-coingecko',
          coingeckoId: 'usd-coin',
          symbol: 'usdc',
        },
        symbolFallback: 'USDC',
        neighborsToEnqueue: [],
        proof: { kind: 'coingecko' },
      })
      expect(getCoinDataById).toHaveBeenCalledTimes(0)
      expect(getCoinMarketChartRange).toHaveBeenCalledTimes(0)
    })
  })

  describe(TokenIngestionProcessor.prototype.fetch.name, () => {
    it('passes non-pending traces through unchanged', async () => {
      const processor = createProcessor({})
      const trace = {
        id: 'ing_test',
        address: token('ethereum', '0xaaa'),
        existingDeployedToken: undefined,
        steps: [],
        outcome: { kind: 'skip', reason: 'whatever' } as const,
      }
      const result = await processor.fetch(trace)
      expect(result).toEqual(trace)
    })

    it('upgrades pending insert with existing abstract to write/insert when facts are complete', async () => {
      const address = token('ethereum', '0xaaa')
      const fetchDeployedTokenFacts = mockFn().resolvesTo({
        isContract: true,
        symbol: 'USDC',
        symbolSource: 'rpc' as const,
        decimals: 6,
        deploymentTimestamp: UnixTime(1),
        warnings: [],
      })

      const processor = createProcessor({
        tokenDb: mockObject<TokenDatabase>({
          chain: mockObject<TokenDatabase['chain']>({
            findByName: mockFn().resolvesTo({
              name: 'ethereum',
              chainId: 1,
              explorerUrl: null,
              aliases: null,
              apis: null,
            }),
          }),
        }),
        fetchDeployedTokenFacts,
      })

      const result = await processor.fetch({
        id: 'ing_test',
        address,
        existingDeployedToken: undefined,
        steps: [],
        outcome: {
          kind: 'pending',
          operation: 'insert',
          existing: undefined,
          abstract: {
            kind: 'existing',
            token: { id: 'USDC01', symbol: 'USDC' },
          },
          symbolFallback: undefined,
          neighborsToEnqueue: [],
          proof: { kind: 'coingecko' },
        },
      })

      expect(result.outcome).toEqual({
        kind: 'write',
        newAbstractToken: undefined,
        deployedToken: {
          type: 'insert',
          record: {
            ...address,
            abstractTokenId: 'USDC01',
            symbol: 'USDC',
            decimals: 6,
            deploymentTimestamp: UnixTime(1),
            comment: null,
            metadata: null,
            abstractTokenAssignmentProof: { kind: 'coingecko' },
          },
        },
        neighborsToEnqueue: [],
      })
    })

    it('builds the abstract from CoinGecko and inserts a deployed token for new-coingecko pending', async () => {
      const address = token('ethereum', '0xaaa')
      const getCoinDataById = mockFn().resolvesTo({
        id: 'usd-coin',
        symbol: 'usdc',
        image: { large: 'https://example.com/usdc.png' },
        platforms: {},
      })
      const getCoinMarketChartRange = mockFn().resolvesTo({
        prices: [{ date: new Date('2020-01-01T00:00:00Z'), value: 1 }],
        marketCaps: [],
      })

      const processor = createProcessor({
        tokenDb: mockObject<TokenDatabase>({
          chain: mockObject<TokenDatabase['chain']>({
            findByName: mockFn().resolvesTo({
              name: 'ethereum',
              chainId: 1,
              explorerUrl: null,
              aliases: null,
              apis: null,
            }),
          }),
          abstractToken: mockObject<TokenDatabase['abstractToken']>({
            findById: mockFn().resolvesTo(undefined),
          }),
        }),
        coingeckoClient: mockObject<CoingeckoClient>({
          getCoinDataById,
          getCoinMarketChartRange,
        }),
        fetchDeployedTokenFacts: mockFn().resolvesTo({
          isContract: true,
          symbol: 'USDC',
          symbolSource: 'rpc' as const,
          decimals: 6,
          deploymentTimestamp: UnixTime(1),
          warnings: [],
        }),
      })

      const result = await processor.fetch({
        id: 'ing_test',
        address,
        existingDeployedToken: undefined,
        steps: [],
        outcome: {
          kind: 'pending',
          operation: 'insert',
          existing: undefined,
          abstract: {
            kind: 'new-coingecko',
            coingeckoId: 'usd-coin',
            symbol: 'usdc',
          },
          symbolFallback: 'USDC',
          neighborsToEnqueue: [],
          proof: { kind: 'coingecko' },
        },
      })

      expect(result.outcome.kind).toEqual('write')
      expect(getCoinDataById).toHaveBeenCalledWith('usd-coin')
      expect(
        result.steps.some((step) => step.kind === 'fetched-coingecko-abstract'),
      ).toEqual(true)
    })

    it('adopts deployed-token casing on the new CoinGecko abstract when symbols match case-insensitively', async () => {
      const address = token('ethereum', '0xaaa')

      const processor = createProcessor({
        tokenDb: mockObject<TokenDatabase>({
          chain: mockObject<TokenDatabase['chain']>({
            findByName: mockFn().resolvesTo({
              name: 'ethereum',
              chainId: 1,
              explorerUrl: null,
              aliases: null,
              apis: null,
            }),
          }),
          abstractToken: mockObject<TokenDatabase['abstractToken']>({
            findById: mockFn().resolvesTo(undefined),
          }),
        }),
        coingeckoClient: mockObject<CoingeckoClient>({
          getCoinDataById: mockFn().resolvesTo({
            id: 'ethena-staked-usde',
            symbol: 'susde',
            image: { large: 'https://example.com/susde.png' },
            platforms: {},
          }),
          getCoinMarketChartRange: mockFn().resolvesTo({
            prices: [{ date: new Date('2024-01-01T00:00:00Z'), value: 1 }],
            marketCaps: [],
          }),
        }),
        fetchDeployedTokenFacts: mockFn().resolvesTo({
          isContract: true,
          symbol: 'sUSDe',
          symbolSource: 'rpc' as const,
          decimals: 18,
          deploymentTimestamp: UnixTime(1),
          warnings: [],
        }),
        generateAbstractTokenId: () => 'ABC123',
      })

      const result = await processor.fetch({
        id: 'ing_test',
        address,
        existingDeployedToken: undefined,
        steps: [],
        outcome: {
          kind: 'pending',
          operation: 'insert',
          existing: undefined,
          abstract: {
            kind: 'new-coingecko',
            coingeckoId: 'ethena-staked-usde',
            symbol: 'susde',
          },
          symbolFallback: 'SUSDE',
          neighborsToEnqueue: [],
          proof: { kind: 'coingecko' },
        },
      })

      expect(result.outcome.kind).toEqual('write')
      if (result.outcome.kind !== 'write') return
      expect(result.outcome.newAbstractToken?.symbol).toEqual('sUSDe')
      expect(
        result.outcome.deployedToken.type === 'insert' &&
          result.outcome.deployedToken.record.symbol,
      ).toEqual('sUSDe')
      const correctionStep = result.steps.find(
        (step) => step.kind === 'corrected-coingecko-symbol-casing',
      )
      expect(correctionStep).toEqual({
        kind: 'corrected-coingecko-symbol-casing',
        from: 'SUSDE',
        to: 'sUSDe',
      })
    })

    it('downgrades pending insert with a new CoinGecko abstract to conflict when symbols differ', async () => {
      const address = token('ethereum', '0xaaa')

      const processor = createProcessor({
        tokenDb: mockObject<TokenDatabase>({
          chain: mockObject<TokenDatabase['chain']>({
            findByName: mockFn().resolvesTo({
              name: 'ethereum',
              chainId: 1,
              explorerUrl: null,
              aliases: null,
              apis: null,
            }),
          }),
          abstractToken: mockObject<TokenDatabase['abstractToken']>({
            findById: mockFn().resolvesTo(undefined),
          }),
        }),
        coingeckoClient: mockObject<CoingeckoClient>({
          getCoinDataById: mockFn().resolvesTo({
            id: 'usd-coin',
            symbol: 'usdc',
            image: { large: 'https://example.com/usdc.png' },
            platforms: {},
          }),
          getCoinMarketChartRange: mockFn().resolvesTo({
            prices: [{ date: new Date('2020-01-01T00:00:00Z'), value: 1 }],
            marketCaps: [],
          }),
        }),
        fetchDeployedTokenFacts: mockFn().resolvesTo({
          isContract: true,
          symbol: 'DAI',
          symbolSource: 'rpc' as const,
          decimals: 18,
          deploymentTimestamp: UnixTime(1),
          warnings: [],
        }),
        generateAbstractTokenId: () => 'ABC123',
      })

      const result = await processor.fetch({
        id: 'ing_test',
        address,
        existingDeployedToken: undefined,
        steps: [],
        outcome: {
          kind: 'pending',
          operation: 'insert',
          existing: undefined,
          abstract: {
            kind: 'new-coingecko',
            coingeckoId: 'usd-coin',
            symbol: 'usdc',
          },
          symbolFallback: 'USDC',
          neighborsToEnqueue: [],
          proof: { kind: 'coingecko' },
        },
      })

      expect(result.outcome).toEqual({
        kind: 'conflict',
        message:
          'CoinGecko would create abstract token ABC123:USDC, but the deployed token symbol is DAI.',
      })
      expect(
        result.steps.some((step) => step.kind === 'fetched-coingecko-abstract'),
      ).toEqual(true)
      expect(
        result.steps.some((step) => step.kind === 'fetched-facts'),
      ).toEqual(true)
    })

    it('downgrades pending insert with a transfer-resolved abstract to conflict when symbols differ', async () => {
      const address = token('ethereum', '0xaaa')

      const processor = createProcessor({
        tokenDb: mockObject<TokenDatabase>({
          chain: mockObject<TokenDatabase['chain']>({
            findByName: mockFn().resolvesTo({
              name: 'ethereum',
              chainId: 1,
              explorerUrl: null,
              aliases: null,
              apis: null,
            }),
          }),
        }),
        fetchDeployedTokenFacts: mockFn().resolvesTo({
          isContract: true,
          symbol: 'WETH',
          symbolSource: 'rpc' as const,
          decimals: 18,
          deploymentTimestamp: UnixTime(1),
          warnings: [],
        }),
      })

      const result = await processor.fetch({
        id: 'ing_test',
        address,
        steps: [],
        outcome: {
          kind: 'pending',
          operation: 'insert',
          existing: undefined,
          abstract: {
            kind: 'existing',
            token: { id: 'USDC01', symbol: 'USDC' },
          },
          symbolFallback: undefined,
          neighborsToEnqueue: [],
          proof: nonSwappingProof(),
        },
      })

      expect(result.outcome).toEqual({
        kind: 'conflict',
        message:
          'Non-swapping transfers point to abstract token USDC01:USDC, but the deployed token symbol is WETH.',
      })
      expect(
        result.steps.some((step) => step.kind === 'fetched-facts'),
      ).toEqual(true)
    })

    it('keeps a transfer-resolved insert on write when symbols match case-insensitively', async () => {
      const address = token('ethereum', '0xaaa')

      const processor = createProcessor({
        tokenDb: mockObject<TokenDatabase>({
          chain: mockObject<TokenDatabase['chain']>({
            findByName: mockFn().resolvesTo({
              name: 'ethereum',
              chainId: 1,
              explorerUrl: null,
              aliases: null,
              apis: null,
            }),
          }),
        }),
        fetchDeployedTokenFacts: mockFn().resolvesTo({
          isContract: true,
          symbol: 'SUSDE',
          symbolSource: 'rpc' as const,
          decimals: 18,
          deploymentTimestamp: UnixTime(1),
          warnings: [],
        }),
      })

      const result = await processor.fetch({
        id: 'ing_test',
        address,
        steps: [],
        outcome: {
          kind: 'pending',
          operation: 'insert',
          existing: undefined,
          abstract: {
            kind: 'existing',
            token: { id: 'SUSDE1', symbol: 'sUSDe' },
          },
          symbolFallback: undefined,
          neighborsToEnqueue: [],
          proof: nonSwappingProof(),
        },
      })

      expect(result.outcome.kind).toEqual('write')
      if (result.outcome.kind !== 'write') return
      expect(result.outcome.newAbstractToken).toEqual(undefined)
      expect(
        result.outcome.deployedToken.type === 'insert' &&
          result.outcome.deployedToken.record.symbol,
      ).toEqual('SUSDE')
      expect(
        result.steps.some(
          (step) => step.kind === 'corrected-coingecko-symbol-casing',
        ),
      ).toEqual(false)
    })

    it('does not use the new CoinGecko abstract symbol as deployed-token fallback', async () => {
      const address = token('ethereum', '0xaaa')

      const processor = createProcessor({
        tokenDb: mockObject<TokenDatabase>({
          chain: mockObject<TokenDatabase['chain']>({
            findByName: mockFn().resolvesTo({
              name: 'ethereum',
              chainId: 1,
              explorerUrl: null,
              aliases: null,
              apis: null,
            }),
          }),
          abstractToken: mockObject<TokenDatabase['abstractToken']>({
            findById: mockFn().resolvesTo(undefined),
          }),
        }),
        coingeckoClient: mockObject<CoingeckoClient>({
          getCoinDataById: mockFn().resolvesTo({
            id: 'usd-coin',
            symbol: 'usdc',
            image: { large: 'https://example.com/usdc.png' },
            platforms: {},
          }),
          getCoinMarketChartRange: mockFn().resolvesTo({
            prices: [{ date: new Date('2020-01-01T00:00:00Z'), value: 1 }],
            marketCaps: [],
          }),
        }),
        fetchDeployedTokenFacts: mockFn().resolvesTo({
          isContract: true,
          symbol: undefined,
          symbolSource: undefined,
          decimals: 6,
          deploymentTimestamp: UnixTime(1),
          warnings: [],
        }),
        generateAbstractTokenId: () => 'ABC123',
      })

      const result = await processor.fetch({
        id: 'ing_test',
        address,
        existingDeployedToken: undefined,
        steps: [],
        outcome: {
          kind: 'pending',
          operation: 'insert',
          existing: undefined,
          abstract: {
            kind: 'new-coingecko',
            coingeckoId: 'usd-coin',
            symbol: 'usdc',
          },
          symbolFallback: 'USDC',
          neighborsToEnqueue: [],
          proof: { kind: 'coingecko' },
        },
      })

      expect(result.outcome).toEqual({
        kind: 'error',
        message: 'Missing required deployed-token facts: symbol.',
      })
    })

    it('downgrades pending update with a new CoinGecko abstract to conflict when symbols differ', async () => {
      const address = token('ethereum', '0xaaa')

      const processor = createProcessor({
        tokenDb: mockObject<TokenDatabase>({
          abstractToken: mockObject<TokenDatabase['abstractToken']>({
            findById: mockFn().resolvesTo(undefined),
          }),
        }),
        coingeckoClient: mockObject<CoingeckoClient>({
          getCoinDataById: mockFn().resolvesTo({
            id: 'usd-coin',
            symbol: 'usdc',
            image: { large: 'https://example.com/usdc.png' },
            platforms: {},
          }),
          getCoinMarketChartRange: mockFn().resolvesTo({
            prices: [{ date: new Date('2020-01-01T00:00:00Z'), value: 1 }],
            marketCaps: [],
          }),
        }),
        generateAbstractTokenId: () => 'ABC123',
      })

      const existing = {
        ...address,
        abstractTokenId: null,
        symbol: 'DAI',
        decimals: 18,
        deploymentTimestamp: UnixTime(1),
        comment: null,
        metadata: null,
      }

      const result = await processor.fetch({
        id: 'ing_test',
        address,
        existingDeployedToken: existing,
        steps: [],
        outcome: {
          kind: 'pending',
          operation: 'update',
          existing,
          abstract: {
            kind: 'new-coingecko',
            coingeckoId: 'usd-coin',
            symbol: 'usdc',
          },
          symbolFallback: 'USDC',
          neighborsToEnqueue: [],
          proof: { kind: 'coingecko' },
        },
      })

      expect(result.outcome).toEqual({
        kind: 'conflict',
        message:
          'CoinGecko would create abstract token ABC123:USDC, but the deployed token symbol is DAI.',
      })
    })

    it('downgrades pending insert to error when facts are missing', async () => {
      const address = token('ethereum', '0xaaa')
      const processor = createProcessor({
        tokenDb: mockObject<TokenDatabase>({
          chain: mockObject<TokenDatabase['chain']>({
            findByName: mockFn().resolvesTo({
              name: 'ethereum',
              chainId: 1,
              explorerUrl: null,
              aliases: null,
              apis: null,
            }),
          }),
        }),
        fetchDeployedTokenFacts: mockFn().resolvesTo({
          isContract: true,
          symbol: 'USDC',
          symbolSource: 'rpc' as const,
          decimals: 6,
          deploymentTimestamp: undefined,
          warnings: [],
        }),
      })

      const result = await processor.fetch({
        id: 'ing_test',
        address,
        existingDeployedToken: undefined,
        steps: [],
        outcome: {
          kind: 'pending',
          operation: 'insert',
          existing: undefined,
          abstract: {
            kind: 'existing',
            token: { id: 'USDC01', symbol: 'USDC' },
          },
          symbolFallback: undefined,
          neighborsToEnqueue: [],
          proof: { kind: 'coingecko' },
        },
      })

      expect(result.outcome.kind).toEqual('error')
    })
  })

  describe(TokenIngestionProcessor.prototype.apply.name, () => {
    it('applies writes, propagates neighbors, and removes the queue entry', async () => {
      const address = token('ethereum', '0xaaa')
      const neighbor = token('base', '0xbbb')
      const insert = mockFn().resolvesTo(undefined)
      const enqueue = mockFn().resolvesTo(undefined)
      const remove = mockFn().resolvesTo(1)

      const processor = createProcessor({
        tokenDb: mockObject<TokenDatabase>({
          transaction: async (callback) => await callback(),
          deployedToken: mockObject<TokenDatabase['deployedToken']>({
            insert,
          }),
          tokenDbHistory: mockObject<TokenDatabase['tokenDbHistory']>({
            insert: mockFn().resolvesTo(undefined),
          }),
          tokenIngestionQueue: mockObject<TokenDatabase['tokenIngestionQueue']>(
            {
              enqueue,
              remove,
            },
          ),
        }),
      })

      const trace: IngestionTrace = {
        id: 'ing_test',
        address,
        existingDeployedToken: undefined,
        steps: [],
        outcome: {
          kind: 'write',
          newAbstractToken: undefined,
          deployedToken: {
            type: 'insert',
            record: {
              ...address,
              abstractTokenId: 'USDC01',
              symbol: 'USDC',
              decimals: 6,
              deploymentTimestamp: UnixTime(1),
              comment: null,
              metadata: null,
              abstractTokenAssignmentProof: { kind: 'coingecko' },
            },
          },
          neighborsToEnqueue: [neighbor],
        },
      }

      await processor.apply(queueEntry(address), trace)

      expect(insert).toHaveBeenCalledTimes(1)
      expect(enqueue).toHaveBeenCalledWith(neighbor, 'pending')
      expect(remove).toHaveBeenCalledWith(queueEntry(address))
    })

    it('throws when called with a pending outcome', async () => {
      const processor = createProcessor({})
      const trace: IngestionTrace = {
        id: 'ing_test',
        address: token('ethereum', '0xaaa'),
        existingDeployedToken: undefined,
        steps: [],
        outcome: {
          kind: 'pending',
          operation: 'insert',
          existing: undefined,
          abstract: {
            kind: 'existing',
            token: { id: 'USDC01', symbol: 'USDC' },
          },
          symbolFallback: undefined,
          neighborsToEnqueue: [],
          proof: { kind: 'coingecko' },
        },
      }
      await expect(
        processor.apply(queueEntry(trace.address), trace),
      ).toBeRejected()
    })
  })

  describe(
    TokenIngestionProcessor.prototype.getInteropTransferIndex.name,
    () => {
      it('builds the interop transfer index on first use and reuses it', async () => {
        const address = token('ethereum', '0xaaa')
        const getAll = mockFn().resolvesTo([
          transfer({
            srcChain: address.chain,
            srcTokenAddress: address.address,
          }),
        ])
        const processor = createProcessor({
          db: mockObject<Database>({
            interopTransfer: mockObject<Database['interopTransfer']>({
              getAll,
            }),
          }),
        })

        const first = await processor.getInteropTransferIndex()
        const second = await processor.getInteropTransferIndex()

        expect(first.findInvolving(address).length).toEqual(1)
        expect(second.findInvolving(address).length).toEqual(1)
        expect(getAll).toHaveBeenCalledTimes(1)
      })

      it('refreshes the cached interop transfer index from the database', async () => {
        const firstAddress = token('ethereum', '0xaaa')
        const secondAddress = token('base', '0xbbb')
        const getAll = mockFn()
          .resolvesToOnce([
            transfer({
              srcChain: firstAddress.chain,
              srcTokenAddress: firstAddress.address,
            }),
          ])
          .resolvesToOnce([
            transfer({
              srcChain: secondAddress.chain,
              srcTokenAddress: secondAddress.address,
            }),
          ])
        const processor = createProcessor({
          db: mockObject<Database>({
            interopTransfer: mockObject<Database['interopTransfer']>({
              getAll,
            }),
          }),
        })

        await processor.getInteropTransferIndex()
        const refreshed = await processor.refreshInteropTransferIndex()

        expect(refreshed.findInvolving(firstAddress).length).toEqual(0)
        expect(refreshed.findInvolving(secondAddress).length).toEqual(1)
        expect(getAll).toHaveBeenCalledTimes(2)
      })
    },
  )
})

function createProcessor(deps: {
  db?: Database
  tokenDb?: TokenDatabase
  coingeckoClient?: CoingeckoClient
  fetchDeployedTokenFacts?: (
    chain: Chain,
    address: string,
  ) => Promise<DeployedTokenFacts>
  generateAbstractTokenId?: () => string
}) {
  return new TokenIngestionProcessor({
    db: deps.db ?? mockObject<Database>({}),
    tokenDb: deps.tokenDb ?? mockObject<TokenDatabase>({}),
    coingeckoClient: deps.coingeckoClient ?? mockObject<CoingeckoClient>({}),
    etherscanApiKey: undefined,
    fetchDeployedTokenFacts: deps.fetchDeployedTokenFacts,
    generateAbstractTokenId: deps.generateAbstractTokenId,
  })
}

function abstractTokenRecord(id: string, symbol: string) {
  return {
    id,
    issuer: null,
    symbol,
    category: null,
    iconUrl: null,
    coingeckoId: null,
    coingeckoListingTimestamp: null,
    comment: null,
    reviewed: false,
  }
}

function token(chain: string, shortAddress: string) {
  return {
    chain,
    address: `0x${shortAddress.slice(2).padStart(40, '0')}`,
  }
}

function queueEntry(
  address: ReturnType<typeof token>,
): TokenIngestionQueueRecord {
  return {
    ...address,
    state: 'pending',
    message: null,
    createdAt: UnixTime(1),
    updatedAt: UnixTime(1),
  }
}

function nonSwappingProof() {
  return {
    kind: 'non-swapping-transfer' as const,
    transfer: {
      ...transfer({ bridgeType: 'lockAndMint' }),
      srcRawAmount: '1',
      dstRawAmount: '1',
    },
  }
}

function transfer(
  overrides: Partial<InteropTransferRecord>,
): InteropTransferRecord {
  return {
    plugin: 'test',
    bridgeType: undefined,
    transferId: 'transfer-id',
    type: 'transfer',
    duration: 1,
    timestamp: UnixTime(1),
    srcTime: UnixTime(1),
    srcChain: 'ethereum',
    srcTxHash: '0xsrc',
    srcLogIndex: 1,
    srcEventId: 'src-event',
    srcTokenAddress: undefined,
    srcRawAmount: 1n,
    srcWasBurned: false,
    srcAbstractTokenId: undefined,
    srcSymbol: undefined,
    srcAmount: undefined,
    srcPrice: undefined,
    srcValueUsd: undefined,
    dstTime: UnixTime(2),
    dstChain: 'base',
    dstTxHash: '0xdst',
    dstLogIndex: 2,
    dstEventId: 'dst-event',
    dstTokenAddress: undefined,
    dstRawAmount: 1n,
    dstWasMinted: true,
    dstAbstractTokenId: undefined,
    dstSymbol: undefined,
    dstAmount: undefined,
    dstPrice: undefined,
    dstValueUsd: undefined,
    isProcessed: true,
    ...overrides,
  }
}
