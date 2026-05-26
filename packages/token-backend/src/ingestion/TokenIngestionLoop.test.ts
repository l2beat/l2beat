import { Logger } from '@l2beat/backend-tools'
import type {
  Database,
  DeployedTokenRecord,
  InteropTransferRecord,
  TokenDatabase,
  TokenIngestionQueueRecord,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { Chain } from '../chains/Chain'
import type { CoingeckoClient } from '../chains/clients/coingecko/CoingeckoClient'
import type { DeployedTokenFacts } from '../chains/fetchDeployedTokenFacts'
import type { IngestionTrace } from './IngestionTrace'
import { TokenIngestionLoop } from './TokenIngestionLoop'
import { TokenIngestionProcessor } from './TokenIngestionProcessor'

describe(TokenIngestionLoop.name, () => {
  describe(TokenIngestionLoop.prototype.runOnce.name, () => {
    it('enqueues addresses after the stored cursor and advances it', async () => {
      const get = mockFn().resolvesTo({
        key: 'interop-transfers:lastSerialId',
        value: '10',
      })
      const set = mockFn().resolvesTo(undefined)
      const enqueue = mockFn().resolvesTo(undefined)
      const findNextPending = mockFn().resolvesTo(undefined)
      const getTokenAddressesAfterSerialId = mockFn().resolvesTo({
        latestSerialId: '15',
        transferCount: 3,
        tokenAddresses: [
          { chain: 'ethereum', address: '0xaaa' },
          { chain: 'base', address: '0xbbb' },
        ],
      })

      const loop = createLoop({
        tokenDb: mockObject<TokenDatabase>({
          tokenDbSettings: mockObject<TokenDatabase['tokenDbSettings']>({
            get,
            set,
          }),
          tokenIngestionQueue: mockObject<TokenDatabase['tokenIngestionQueue']>(
            {
              enqueue,
              findNextPending,
            },
          ),
        }),
        db: mockObject<Database>({
          interopTransfer: mockObject<Database['interopTransfer']>({
            getTokenAddressesAfterSerialId,
            getAll: mockFn().resolvesTo([]),
          }),
        }),
      })

      await loop.runOnce()

      expect(get).toHaveBeenCalledWith('interop-transfers:lastSerialId')
      expect(getTokenAddressesAfterSerialId).toHaveBeenCalledWith('10')
      expect(enqueue.calls.map((call) => call.args[0])).toEqual([
        token('ethereum', '0xaaa'),
        token('base', '0xbbb'),
      ])
      expect(set).toHaveBeenCalledWith({
        key: 'interop-transfers:lastSerialId',
        value: '15',
      })
    })

    it('stages newly discovered addresses when auto-approve is disabled', async () => {
      const enqueue = mockFn().resolvesTo(undefined)

      const loop = createLoop({
        newQueueState: 'staged',
        tokenDb: mockObject<TokenDatabase>({
          tokenDbSettings: mockObject<TokenDatabase['tokenDbSettings']>({
            get: mockFn().resolvesTo(undefined),
            set: mockFn().resolvesTo(undefined),
          }),
          tokenIngestionQueue: mockObject<TokenDatabase['tokenIngestionQueue']>(
            {
              enqueue,
              findNextPending: mockFn().resolvesTo(undefined),
            },
          ),
        }),
        db: mockObject<Database>({
          interopTransfer: mockObject<Database['interopTransfer']>({
            getTokenAddressesAfterSerialId: mockFn().resolvesTo({
              latestSerialId: '1',
              transferCount: 1,
              tokenAddresses: [{ chain: 'ethereum', address: '0xaaa' }],
            }),
            getAll: mockFn().resolvesTo([]),
          }),
        }),
      })

      await loop.runOnce()

      expect(enqueue).toHaveBeenCalledWith(token('ethereum', '0xaaa'), 'staged')
    })

    it('starts from zero when no cursor exists', async () => {
      const getTokenAddressesAfterSerialId = mockFn().resolvesTo({
        latestSerialId: undefined,
        transferCount: 0,
        tokenAddresses: [],
      })
      const loop = createLoop({
        tokenDb: mockObject<TokenDatabase>({
          tokenDbSettings: mockObject<TokenDatabase['tokenDbSettings']>({
            get: mockFn().resolvesTo(undefined),
          }),
          tokenIngestionQueue: mockObject<TokenDatabase['tokenIngestionQueue']>(
            {
              findNextPending: mockFn().resolvesTo(undefined),
            },
          ),
        }),
        db: mockObject<Database>({
          interopTransfer: mockObject<Database['interopTransfer']>({
            getTokenAddressesAfterSerialId,
            getAll: mockFn().resolvesTo([]),
          }),
        }),
      })

      await loop.runOnce()

      expect(getTokenAddressesAfterSerialId).toHaveBeenCalledWith('0')
    })

    it('does not advance the cursor when there are no new transfers', async () => {
      const set = mockFn().resolvesTo(undefined)
      const enqueue = mockFn().resolvesTo(undefined)
      const loop = createLoop({
        tokenDb: mockObject<TokenDatabase>({
          tokenDbSettings: mockObject<TokenDatabase['tokenDbSettings']>({
            get: mockFn().resolvesTo({
              key: 'interop-transfers:lastSerialId',
              value: '10',
            }),
            set,
          }),
          tokenIngestionQueue: mockObject<TokenDatabase['tokenIngestionQueue']>(
            {
              enqueue,
              findNextPending: mockFn().resolvesTo(undefined),
            },
          ),
        }),
        db: mockObject<Database>({
          interopTransfer: mockObject<Database['interopTransfer']>({
            getTokenAddressesAfterSerialId: mockFn().resolvesTo({
              latestSerialId: undefined,
              transferCount: 0,
              tokenAddresses: [],
            }),
            getAll: mockFn().resolvesTo([]),
          }),
        }),
      })

      await loop.runOnce()

      expect(enqueue).toHaveBeenCalledTimes(0)
      expect(set).toHaveBeenCalledTimes(0)
    })

    it('stops draining when the processing limit is reached', async () => {
      const address = token('ethereum', '0xaaa')
      const transferIndex = { findInvolving: mockFn().returns([]) }
      const refreshInteropTransferIndex = mockFn().resolvesTo(transferIndex)
      const process = mockFn().resolvesTo({
        id: 'ing_test',
        address,
        steps: [],
        outcome: { kind: 'skip', reason: 'test' },
      } satisfies IngestionTrace)
      const findNextPending = mockFn().executes(async () => queueEntry(address))
      const countPending = mockFn().resolvesTo(1)

      const loop = new TokenIngestionLoop(
        mockObject<Database>({
          interopTransfer: mockObject<Database['interopTransfer']>({
            getTokenAddressesAfterSerialId: mockFn().resolvesTo({
              latestSerialId: undefined,
              transferCount: 0,
              tokenAddresses: [],
            }),
            getAll: mockFn().resolvesTo([]),
          }),
        }),
        mockObject<TokenDatabase>({
          tokenDbSettings: mockObject<TokenDatabase['tokenDbSettings']>({
            get: mockFn().resolvesTo(undefined),
          }),
          tokenIngestionQueue: mockObject<TokenDatabase['tokenIngestionQueue']>(
            {
              findNextPending,
              countPending,
            },
          ),
        }),
        mockObject({
          process,
          refreshInteropTransferIndex,
        }) as unknown as TokenIngestionProcessor,
        Logger.SILENT,
        { intervalMs: 60_000, maxProcessedPerRun: 3 },
      )

      await loop.runOnce()

      expect(process).toHaveBeenCalledTimes(3)
      expect(refreshInteropTransferIndex).toHaveBeenCalledTimes(1)
      expect(findNextPending).toHaveBeenCalledTimes(4)
      expect(countPending).toHaveBeenCalledTimes(1)
    })

    it('updates an existing token from a non-swapping transfer without fetching deployed facts', async () => {
      const address = token('ethereum', '0xaaa')
      const otherAddress = token('base', '0xbbb')
      const findNextPending = mockFn()
        .resolvesToOnce(queueEntry(address))
        .resolvesToOnce(undefined)
      const updateByChainAndAddress = mockFn().resolvesTo(1)
      const fetchDeployedTokenFacts = mockFn().resolvesTo(completeFacts())

      const loop = createLoop({
        db: mockObject<Database>({
          interopTransfer: mockObject<Database['interopTransfer']>({
            getTokenAddressesAfterSerialId: mockFn().resolvesTo({
              latestSerialId: undefined,
              transferCount: 0,
              tokenAddresses: [],
            }),
            getAll: mockFn().resolvesTo([
              transfer({
                srcChain: address.chain,
                srcTokenAddress: address.address,
                dstChain: otherAddress.chain,
                dstTokenAddress: otherAddress.address,
                bridgeType: 'lockAndMint',
              }),
            ]),
          }),
        }),
        tokenDb: mockObject<TokenDatabase>({
          transaction: async (callback) => await callback(),
          tokenDbSettings: mockObject<TokenDatabase['tokenDbSettings']>({
            get: mockFn().resolvesTo(undefined),
          }),
          tokenIngestionQueue: mockObject<TokenDatabase['tokenIngestionQueue']>(
            {
              findNextPending,
              enqueue: mockFn().resolvesTo(undefined),
              remove: mockFn().resolvesTo(1),
            },
          ),
          tokenDbHistory: mockObject<TokenDatabase['tokenDbHistory']>({
            insert: mockFn().resolvesTo(undefined),
          }),
          deployedToken: mockObject<TokenDatabase['deployedToken']>({
            findByChainAndAddress: mockFn().resolvesTo(
              deployedToken({ ...address, abstractTokenId: null }),
            ),
            getByPrimaryKeys: mockFn().resolvesTo([
              deployedToken({
                ...otherAddress,
                abstractTokenId: 'USDC01',
              }),
            ]),
            updateByChainAndAddress,
          }),
          abstractToken: mockObject<TokenDatabase['abstractToken']>({
            getByIds: mockFn().resolvesTo([abstractToken('USDC01', 'USDC')]),
          }),
        }),
        fetchDeployedTokenFacts,
      })

      await loop.runOnce()

      expect(updateByChainAndAddress).toHaveBeenCalledWith(address, {
        abstractTokenId: 'USDC01',
        abstractTokenAssignmentProof: {
          kind: 'non-swapping-transfer',
          transfer: expect.anything(),
        },
      })
      expect(fetchDeployedTokenFacts).toHaveBeenCalledTimes(0)
    })

    it('marks a conflict when non-swapping transfers disagree', async () => {
      const address = token('ethereum', '0xaaa')
      const firstOther = token('base', '0xbbb')
      const secondOther = token('arbitrum', '0xccc')
      const markConflict = mockFn().resolvesTo(1)

      const loop = createLoop({
        db: mockObject<Database>({
          interopTransfer: mockObject<Database['interopTransfer']>({
            getTokenAddressesAfterSerialId: mockFn().resolvesTo({
              latestSerialId: undefined,
              transferCount: 0,
              tokenAddresses: [],
            }),
            getAll: mockFn().resolvesTo([
              transfer({
                srcChain: address.chain,
                srcTokenAddress: address.address,
                dstChain: firstOther.chain,
                dstTokenAddress: firstOther.address,
                bridgeType: 'lockAndMint',
              }),
              transfer({
                srcChain: address.chain,
                srcTokenAddress: address.address,
                dstChain: secondOther.chain,
                dstTokenAddress: secondOther.address,
                bridgeType: 'burnAndMint',
              }),
            ]),
          }),
        }),
        tokenDb: mockObject<TokenDatabase>({
          tokenDbSettings: mockObject<TokenDatabase['tokenDbSettings']>({
            get: mockFn().resolvesTo(undefined),
          }),
          tokenIngestionQueue: mockObject<TokenDatabase['tokenIngestionQueue']>(
            {
              findNextPending: mockFn()
                .resolvesToOnce(queueEntry(address))
                .resolvesToOnce(undefined),
              markConflict,
            },
          ),
          deployedToken: mockObject<TokenDatabase['deployedToken']>({
            findByChainAndAddress: mockFn().resolvesTo(undefined),
            getByPrimaryKeys: mockFn().resolvesTo([
              deployedToken({ ...firstOther, abstractTokenId: 'FIRST1' }),
              deployedToken({ ...secondOther, abstractTokenId: 'SECOND' }),
            ]),
          }),
          abstractToken: mockObject<TokenDatabase['abstractToken']>({
            getByIds: mockFn().resolvesTo([
              abstractToken('FIRST1', 'FOO'),
              abstractToken('SECOND', 'BAR'),
            ]),
          }),
        }),
      })

      await loop.runOnce()

      expect(markConflict.calls[0]?.args[1]).toEqual(
        'Non-swapping transfers point to multiple abstract tokens: FIRST1:FOO, SECOND:BAR.',
      )
    })

    it('drops the entry when no abstract token can be resolved', async () => {
      const address = token('ethereum', '0xaaa')
      const remove = mockFn().resolvesTo(1)
      const findByName = mockFn().resolvesTo(undefined)

      const loop = createLoop({
        tokenDb: mockObject<TokenDatabase>({
          tokenDbSettings: mockObject<TokenDatabase['tokenDbSettings']>({
            get: mockFn().resolvesTo(undefined),
          }),
          tokenIngestionQueue: mockObject<TokenDatabase['tokenIngestionQueue']>(
            {
              findNextPending: mockFn()
                .resolvesToOnce(queueEntry(address))
                .resolvesToOnce(undefined),
              remove,
            },
          ),
          deployedToken: mockObject<TokenDatabase['deployedToken']>({
            findByChainAndAddress: mockFn().resolvesTo(undefined),
            getByPrimaryKeys: mockFn().resolvesTo([]),
          }),
          chain: mockObject<TokenDatabase['chain']>({
            getAll: mockFn().resolvesTo([]),
            findByName,
          }),
        }),
        db: mockObject<Database>({
          interopTransfer: mockObject<Database['interopTransfer']>({
            getTokenAddressesAfterSerialId: mockFn().resolvesTo({
              latestSerialId: undefined,
              transferCount: 0,
              tokenAddresses: [],
            }),
            getAll: mockFn().resolvesTo([]),
          }),
        }),
        coingeckoClient: mockObject<CoingeckoClient>({
          getCoinList: mockFn().resolvesTo([]),
        }),
      })

      await loop.runOnce()

      expect(remove).toHaveBeenCalledWith(queueEntry(address))
      expect(findByName).toHaveBeenCalledTimes(0)
    })

    it('marks an error when required deployed token facts are missing', async () => {
      const address = token('ethereum', '0xaaa')
      const otherAddress = token('base', '0xbbb')
      const markError = mockFn().resolvesTo(1)

      const loop = createLoop({
        db: mockObject<Database>({
          interopTransfer: mockObject<Database['interopTransfer']>({
            getTokenAddressesAfterSerialId: mockFn().resolvesTo({
              latestSerialId: undefined,
              transferCount: 0,
              tokenAddresses: [],
            }),
            getAll: mockFn().resolvesTo([
              transfer({
                srcChain: address.chain,
                srcTokenAddress: address.address,
                dstChain: otherAddress.chain,
                dstTokenAddress: otherAddress.address,
                bridgeType: 'lockAndMint',
              }),
            ]),
          }),
        }),
        tokenDb: mockObject<TokenDatabase>({
          tokenDbSettings: mockObject<TokenDatabase['tokenDbSettings']>({
            get: mockFn().resolvesTo(undefined),
          }),
          tokenIngestionQueue: mockObject<TokenDatabase['tokenIngestionQueue']>(
            {
              findNextPending: mockFn()
                .resolvesToOnce(queueEntry(address))
                .resolvesToOnce(undefined),
              markError,
            },
          ),
          deployedToken: mockObject<TokenDatabase['deployedToken']>({
            findByChainAndAddress: mockFn().resolvesTo(undefined),
            getByPrimaryKeys: mockFn().resolvesTo([
              deployedToken({ ...otherAddress, abstractTokenId: 'USDC01' }),
            ]),
          }),
          abstractToken: mockObject<TokenDatabase['abstractToken']>({
            getByIds: mockFn().resolvesTo([abstractToken('USDC01', 'USDC')]),
          }),
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
          symbolSource: 'rpc',
          decimals: 6,
          deploymentTimestamp: undefined,
          warnings: [
            {
              field: 'deploymentTimestamp',
              message: 'RPC lookup returned no value.',
            },
          ],
        } satisfies DeployedTokenFacts),
      })

      await loop.runOnce()

      expect(markError.calls[0]?.args[1]).toEqual(
        'Missing required deployed-token facts: deploymentTimestamp. RPC lookup returned no value.',
      )
    })

    it('marks a CoinGecko data failure as an entry error and continues draining', async () => {
      const firstAddress = token('ethereum', '0xaaa')
      const secondAddress = token('ethereum', '0xbbb')
      const markError = mockFn().resolvesTo(1)
      const remove = mockFn().resolvesTo(1)

      const loop = createLoop({
        db: mockObject<Database>({
          interopTransfer: mockObject<Database['interopTransfer']>({
            getTokenAddressesAfterSerialId: mockFn().resolvesTo({
              latestSerialId: undefined,
              transferCount: 0,
              tokenAddresses: [],
            }),
            getAll: mockFn().resolvesTo([]),
          }),
        }),
        tokenDb: mockObject<TokenDatabase>({
          tokenDbSettings: mockObject<TokenDatabase['tokenDbSettings']>({
            get: mockFn().resolvesTo(undefined),
          }),
          tokenIngestionQueue: mockObject<TokenDatabase['tokenIngestionQueue']>(
            {
              findNextPending: mockFn()
                .resolvesToOnce(queueEntry(firstAddress))
                .resolvesToOnce(queueEntry(secondAddress))
                .resolvesToOnce(undefined),
              markError,
              remove,
            },
          ),
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
              platforms: { eth: firstAddress.address },
            },
          ]),
          getCoinDataById: mockFn().rejectsWith(
            new Error('CoinGecko API error: 429 Too Many Requests'),
          ),
        }),
      })

      await loop.runOnce()

      expect(markError).toHaveBeenOnlyCalledWith(
        queueEntry(firstAddress),
        'Failed to fetch CoinGecko data for usd-coin: CoinGecko API error: 429 Too Many Requests.',
      )
      expect(remove).toHaveBeenOnlyCalledWith(queueEntry(secondAddress))
    })

    it('creates an abstract token from CoinGecko before inserting a deployed token', async () => {
      const address = token('ethereum', '0xaaa')
      const abstractInsert = mockFn().resolvesTo('ABC123')
      const deployedInsert = mockFn().resolvesTo(undefined)

      const loop = createLoop({
        db: mockObject<Database>({
          interopTransfer: mockObject<Database['interopTransfer']>({
            getTokenAddressesAfterSerialId: mockFn().resolvesTo({
              latestSerialId: undefined,
              transferCount: 0,
              tokenAddresses: [],
            }),
            getAll: mockFn().resolvesTo([]),
          }),
        }),
        tokenDb: mockObject<TokenDatabase>({
          transaction: async (callback) => await callback(),
          tokenDbSettings: mockObject<TokenDatabase['tokenDbSettings']>({
            get: mockFn().resolvesTo(undefined),
          }),
          tokenIngestionQueue: mockObject<TokenDatabase['tokenIngestionQueue']>(
            {
              findNextPending: mockFn()
                .resolvesToOnce(queueEntry(address))
                .resolvesToOnce(undefined),
              remove: mockFn().resolvesTo(1),
            },
          ),
          tokenDbHistory: mockObject<TokenDatabase['tokenDbHistory']>({
            insert: mockFn().resolvesTo(undefined),
          }),
          deployedToken: mockObject<TokenDatabase['deployedToken']>({
            findByChainAndAddress: mockFn().resolvesTo(undefined),
            getByPrimaryKeys: mockFn().resolvesTo([]),
            insert: deployedInsert,
          }),
          abstractToken: mockObject<TokenDatabase['abstractToken']>({
            findByCoingeckoId: mockFn().resolvesTo(undefined),
            findById: mockFn().resolvesTo(undefined),
            insert: abstractInsert,
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
            findByName: mockFn().resolvesTo({
              name: 'ethereum',
              chainId: 1,
              explorerUrl: null,
              aliases: null,
              apis: null,
            }),
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
        fetchDeployedTokenFacts: mockFn().resolvesTo(completeFacts()),
        generateAbstractTokenId: () => 'ABC123',
      })

      await loop.runOnce()

      expect(abstractInsert.calls[0]?.args[0]).toHaveSubset({
        id: 'ABC123',
        symbol: 'USDC',
        coingeckoId: 'usd-coin',
        reviewed: false,
      })
      expect(deployedInsert.calls[0]?.args[0]).toHaveSubset({
        ...address,
        abstractTokenId: 'ABC123',
        symbol: 'USDC',
        decimals: 6,
      })
    })

    it('marks a conflict instead of creating a CoinGecko abstract when symbols differ', async () => {
      const address = token('ethereum', '0xaaa')
      const markConflict = mockFn().resolvesTo(1)
      const abstractInsert = mockFn().resolvesTo('ABC123')
      const deployedInsert = mockFn().resolvesTo(undefined)

      const loop = createLoop({
        db: mockObject<Database>({
          interopTransfer: mockObject<Database['interopTransfer']>({
            getTokenAddressesAfterSerialId: mockFn().resolvesTo({
              latestSerialId: undefined,
              transferCount: 0,
              tokenAddresses: [],
            }),
            getAll: mockFn().resolvesTo([]),
          }),
        }),
        tokenDb: mockObject<TokenDatabase>({
          tokenDbSettings: mockObject<TokenDatabase['tokenDbSettings']>({
            get: mockFn().resolvesTo(undefined),
          }),
          tokenIngestionQueue: mockObject<TokenDatabase['tokenIngestionQueue']>(
            {
              findNextPending: mockFn()
                .resolvesToOnce(queueEntry(address))
                .resolvesToOnce(undefined),
              markConflict,
            },
          ),
          deployedToken: mockObject<TokenDatabase['deployedToken']>({
            findByChainAndAddress: mockFn().resolvesTo(undefined),
            getByPrimaryKeys: mockFn().resolvesTo([]),
            insert: deployedInsert,
          }),
          abstractToken: mockObject<TokenDatabase['abstractToken']>({
            findByCoingeckoId: mockFn().resolvesTo(undefined),
            findById: mockFn().resolvesTo(undefined),
            insert: abstractInsert,
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
            findByName: mockFn().resolvesTo({
              name: 'ethereum',
              chainId: 1,
              explorerUrl: null,
              aliases: null,
              apis: null,
            }),
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
          symbolSource: 'rpc',
          decimals: 18,
          deploymentTimestamp: UnixTime(1),
          warnings: [],
        } satisfies DeployedTokenFacts),
        generateAbstractTokenId: () => 'ABC123',
      })

      await loop.runOnce()

      expect(markConflict.calls[0]?.args[1]).toEqual(
        'CoinGecko would create abstract token ABC123:USDC, but the deployed token symbol is DAI.',
      )
      expect(abstractInsert).toHaveBeenCalledTimes(0)
      expect(deployedInsert).toHaveBeenCalledTimes(0)
    })
  })
})

function createLoop(deps: {
  db?: Database
  tokenDb?: TokenDatabase
  coingeckoClient?: CoingeckoClient
  newQueueState?: 'staged' | 'pending'
  fetchDeployedTokenFacts?: (
    chain: Chain,
    address: string,
  ) => Promise<DeployedTokenFacts>
  generateAbstractTokenId?: () => string
}) {
  const db =
    deps.db ??
    mockObject<Database>({
      interopTransfer: mockObject<Database['interopTransfer']>({
        getTokenAddressesAfterSerialId: mockFn().resolvesTo({
          latestSerialId: undefined,
          transferCount: 0,
          tokenAddresses: [],
        }),
        getAll: mockFn().resolvesTo([]),
      }),
    })
  const tokenDb =
    deps.tokenDb ??
    mockObject<TokenDatabase>({
      tokenDbSettings: mockObject<TokenDatabase['tokenDbSettings']>({
        get: mockFn().resolvesTo(undefined),
      }),
      tokenIngestionQueue: mockObject<TokenDatabase['tokenIngestionQueue']>({
        findNextPending: mockFn().resolvesTo(undefined),
      }),
    })
  const coingeckoClient =
    deps.coingeckoClient ?? mockObject<CoingeckoClient>({})
  const processor = new TokenIngestionProcessor({
    db,
    tokenDb,
    coingeckoClient,
    etherscanApiKey: undefined,
    fetchDeployedTokenFacts: deps.fetchDeployedTokenFacts,
    generateAbstractTokenId: deps.generateAbstractTokenId,
    newQueueState: deps.newQueueState,
  })

  return new TokenIngestionLoop(db, tokenDb, processor, Logger.SILENT, {
    intervalMs: 60_000,
    newQueueState: deps.newQueueState,
  })
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

function deployedToken(
  overrides: Partial<DeployedTokenRecord> &
    Pick<DeployedTokenRecord, 'chain' | 'address'>,
): DeployedTokenRecord {
  return {
    symbol: 'USDC',
    comment: null,
    abstractTokenId: null,
    decimals: 6,
    deploymentTimestamp: UnixTime(1),
    metadata: null,
    ...overrides,
  }
}

function abstractToken(id: string, symbol: string) {
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

function completeFacts(): DeployedTokenFacts {
  return {
    isContract: true,
    symbol: 'USDC',
    symbolSource: 'rpc',
    decimals: 6,
    deploymentTimestamp: UnixTime(1),
    warnings: [],
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
    srcTokenAddress: token('ethereum', '0xaaa').address,
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
    dstTokenAddress: token('base', '0xbbb').address,
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
