import { Logger } from '@l2beat/backend-tools'
import type {
  Database,
  DeployedTokenRecord,
  InteropTokenRouteRecord,
  InteropTransferRecord,
  TokenDatabase,
  TokenIngestionQueueRecord,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { mockObject } from '@l2beat/test-utils'
import { describe, expect, it, vi } from 'vitest'
import type { Chain } from '../chains/Chain'
import type { CoingeckoClient } from '../chains/clients/coingecko/CoingeckoClient'
import type { DeployedTokenFacts } from '../chains/fetchDeployedTokenFacts'
import type { IngestionTrace } from './IngestionTrace'
import { TokenIngestionLoop } from './TokenIngestionLoop'
import { TokenIngestionProcessor } from './TokenIngestionProcessor'
import type { TokenRelationIngestion } from './TokenRelationIngestion'

describe(TokenIngestionLoop.name, () => {
  describe(TokenIngestionLoop.prototype.runOnce.name, () => {
    it('runs token relation ingestion before enqueueing and draining', async () => {
      const order: string[] = []
      const relationIngestion = mockObject<TokenRelationIngestion>({
        runOnce: vi.fn().mockImplementation(async () => {
          order.push('relations')
        }),
      })
      const getTokenAddressesAfterSerialId = vi
        .fn()
        .mockImplementation(async () => {
          order.push('enqueue')
          return {
            latestSerialId: undefined,
            transferCount: 0,
            tokenAddresses: [],
          }
        })
      const findNextPending = vi.fn().mockImplementation(async () => {
        order.push('drain')
        return undefined
      })

      const loop = new TokenIngestionLoop(
        mockObject<Database>({
          interopTransfer: mockObject<Database['interopTransfer']>({
            getTokenAddressesAfterSerialId,
            getTokenRoutes: vi.fn().mockResolvedValue([]),
          }),
        }),
        mockObject<TokenDatabase>({
          tokenDbSettings: mockObject<TokenDatabase['tokenDbSettings']>({
            get: vi.fn().mockResolvedValue(undefined),
          }),
          tokenIngestionQueue: mockObject<TokenDatabase['tokenIngestionQueue']>(
            { findNextPending },
          ),
        }),
        mockObject({
          refreshInteropTransferIndex: vi.fn().mockResolvedValue({
            findInvolving: vi.fn().mockReturnValue([]),
          }),
        }) as unknown as TokenIngestionProcessor,
        relationIngestion,
        Logger.SILENT,
        { intervalMs: 60_000 },
      )

      await loop.runOnce()

      expect(order).toStrictEqual(['relations', 'enqueue', 'drain'])
    })

    it('still enqueues and drains when token relation ingestion fails', async () => {
      const order: string[] = []
      const relationIngestion = mockObject<TokenRelationIngestion>({
        runOnce: vi.fn().mockRejectedValue(new Error('poison transfer')),
      })
      const getTokenAddressesAfterSerialId = vi
        .fn()
        .mockImplementation(async () => {
          order.push('enqueue')
          return {
            latestSerialId: undefined,
            transferCount: 0,
            tokenAddresses: [],
          }
        })
      const findNextPending = vi.fn().mockImplementation(async () => {
        order.push('drain')
        return undefined
      })

      const loop = new TokenIngestionLoop(
        mockObject<Database>({
          interopTransfer: mockObject<Database['interopTransfer']>({
            getTokenAddressesAfterSerialId,
            getTokenRoutes: vi.fn().mockResolvedValue([]),
          }),
        }),
        mockObject<TokenDatabase>({
          tokenDbSettings: mockObject<TokenDatabase['tokenDbSettings']>({
            get: vi.fn().mockResolvedValue(undefined),
          }),
          tokenIngestionQueue: mockObject<TokenDatabase['tokenIngestionQueue']>(
            { findNextPending },
          ),
        }),
        mockObject({
          refreshInteropTransferIndex: vi.fn().mockResolvedValue({
            findInvolving: vi.fn().mockReturnValue([]),
          }),
        }) as unknown as TokenIngestionProcessor,
        relationIngestion,
        Logger.SILENT,
        { intervalMs: 60_000 },
      )

      await loop.runOnce()

      expect(order).toStrictEqual(['enqueue', 'drain'])
    })

    it('enqueues addresses after the stored cursor and advances it', async () => {
      const get = vi.fn().mockResolvedValue({
        key: 'interop-transfers:lastSerialId',
        value: '10',
      })
      const set = vi.fn().mockResolvedValue(undefined)
      const enqueue = vi.fn().mockResolvedValue(undefined)
      const findNextPending = vi.fn().mockResolvedValue(undefined)
      const getTokenAddressesAfterSerialId = vi.fn().mockResolvedValue({
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
            getTokenRoutes: vi.fn().mockResolvedValue([]),
          }),
        }),
      })

      await loop.runOnce()

      expect(get).toHaveBeenCalledWith('interop-transfers:lastSerialId')
      expect(getTokenAddressesAfterSerialId).toHaveBeenCalledWith('10')
      expect(enqueue.mock.calls.map((call) => call[0])).toStrictEqual([
        token('ethereum', '0xaaa'),
        token('base', '0xbbb'),
      ])
      expect(set).toHaveBeenCalledWith({
        key: 'interop-transfers:lastSerialId',
        value: '15',
      })
    })

    it('stages newly discovered addresses when auto-approve is disabled', async () => {
      const enqueue = vi.fn().mockResolvedValue(undefined)

      const loop = createLoop({
        newQueueState: 'staged',
        tokenDb: mockObject<TokenDatabase>({
          tokenDbSettings: mockObject<TokenDatabase['tokenDbSettings']>({
            get: vi.fn().mockResolvedValue(undefined),
            set: vi.fn().mockResolvedValue(undefined),
          }),
          tokenIngestionQueue: mockObject<TokenDatabase['tokenIngestionQueue']>(
            {
              enqueue,
              findNextPending: vi.fn().mockResolvedValue(undefined),
            },
          ),
        }),
        db: mockObject<Database>({
          interopTransfer: mockObject<Database['interopTransfer']>({
            getTokenAddressesAfterSerialId: vi.fn().mockResolvedValue({
              latestSerialId: '1',
              transferCount: 1,
              tokenAddresses: [{ chain: 'ethereum', address: '0xaaa' }],
            }),
            getTokenRoutes: vi.fn().mockResolvedValue([]),
          }),
        }),
      })

      await loop.runOnce()

      expect(enqueue).toHaveBeenCalledWith(token('ethereum', '0xaaa'), 'staged')
    })

    it('starts from zero when no cursor exists', async () => {
      const getTokenAddressesAfterSerialId = vi.fn().mockResolvedValue({
        latestSerialId: undefined,
        transferCount: 0,
        tokenAddresses: [],
      })
      const loop = createLoop({
        tokenDb: mockObject<TokenDatabase>({
          tokenDbSettings: mockObject<TokenDatabase['tokenDbSettings']>({
            get: vi.fn().mockResolvedValue(undefined),
          }),
          tokenIngestionQueue: mockObject<TokenDatabase['tokenIngestionQueue']>(
            {
              findNextPending: vi.fn().mockResolvedValue(undefined),
            },
          ),
        }),
        db: mockObject<Database>({
          interopTransfer: mockObject<Database['interopTransfer']>({
            getTokenAddressesAfterSerialId,
            getTokenRoutes: vi.fn().mockResolvedValue([]),
          }),
        }),
      })

      await loop.runOnce()

      expect(getTokenAddressesAfterSerialId).toHaveBeenCalledWith('0')
    })

    it('does not advance the cursor when there are no new transfers', async () => {
      const set = vi.fn().mockResolvedValue(undefined)
      const enqueue = vi.fn().mockResolvedValue(undefined)
      const loop = createLoop({
        tokenDb: mockObject<TokenDatabase>({
          tokenDbSettings: mockObject<TokenDatabase['tokenDbSettings']>({
            get: vi.fn().mockResolvedValue({
              key: 'interop-transfers:lastSerialId',
              value: '10',
            }),
            set,
          }),
          tokenIngestionQueue: mockObject<TokenDatabase['tokenIngestionQueue']>(
            {
              enqueue,
              findNextPending: vi.fn().mockResolvedValue(undefined),
            },
          ),
        }),
        db: mockObject<Database>({
          interopTransfer: mockObject<Database['interopTransfer']>({
            getTokenAddressesAfterSerialId: vi.fn().mockResolvedValue({
              latestSerialId: undefined,
              transferCount: 0,
              tokenAddresses: [],
            }),
            getTokenRoutes: vi.fn().mockResolvedValue([]),
          }),
        }),
      })

      await loop.runOnce()

      expect(enqueue).toHaveBeenCalledTimes(0)
      expect(set).toHaveBeenCalledTimes(0)
    })

    it('stops draining when the processing limit is reached', async () => {
      const address = token('ethereum', '0xaaa')
      const transferIndex = { findInvolving: vi.fn().mockReturnValue([]) }
      const refreshInteropTransferIndex = vi
        .fn()
        .mockResolvedValue(transferIndex)
      const process = vi.fn().mockResolvedValue({
        id: 'ing_test',
        address,
        existingDeployedToken: undefined,
        steps: [],
        outcome: { kind: 'skip', reason: 'test' },
      } satisfies IngestionTrace)
      const findNextPending = vi
        .fn()
        .mockImplementation(async () => queueEntry(address))
      const countPending = vi.fn().mockResolvedValue(1)

      const loop = new TokenIngestionLoop(
        mockObject<Database>({
          interopTransfer: mockObject<Database['interopTransfer']>({
            getTokenAddressesAfterSerialId: vi.fn().mockResolvedValue({
              latestSerialId: undefined,
              transferCount: 0,
              tokenAddresses: [],
            }),
            getTokenRoutes: vi.fn().mockResolvedValue([]),
          }),
        }),
        mockObject<TokenDatabase>({
          tokenDbSettings: mockObject<TokenDatabase['tokenDbSettings']>({
            get: vi.fn().mockResolvedValue(undefined),
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
        stubRelationIngestion(),
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
      const findNextPending = vi
        .fn()
        .mockResolvedValueOnce(queueEntry(address))
        .mockResolvedValueOnce(undefined)
      const updateByChainAndAddress = vi.fn().mockResolvedValue(1)
      const fetchDeployedTokenFacts = vi.fn().mockResolvedValue(completeFacts())

      const loop = createLoop({
        db: mockObject<Database>({
          interopTransfer: mockObject<Database['interopTransfer']>({
            getTokenAddressesAfterSerialId: vi.fn().mockResolvedValue({
              latestSerialId: undefined,
              transferCount: 0,
              tokenAddresses: [],
            }),
            getTokenRoutes: vi.fn().mockResolvedValue([
              route({
                srcChain: address.chain,
                srcTokenAddress: address.address,
                dstChain: otherAddress.chain,
                dstTokenAddress: otherAddress.address,
                bridgeType: 'lockAndMint',
              }),
            ]),
            findByTransferId: vi.fn().mockResolvedValue(
              transfer({
                srcChain: address.chain,
                srcTokenAddress: address.address,
                dstChain: otherAddress.chain,
                dstTokenAddress: otherAddress.address,
                bridgeType: 'lockAndMint',
              }),
            ),
          }),
        }),
        tokenDb: mockObject<TokenDatabase>({
          transaction: async (callback) => await callback(),
          tokenDbSettings: mockObject<TokenDatabase['tokenDbSettings']>({
            get: vi.fn().mockResolvedValue(undefined),
          }),
          tokenIngestionQueue: mockObject<TokenDatabase['tokenIngestionQueue']>(
            {
              findNextPending,
              enqueue: vi.fn().mockResolvedValue(undefined),
              remove: vi.fn().mockResolvedValue(1),
            },
          ),
          tokenDbHistory: mockObject<TokenDatabase['tokenDbHistory']>({
            insert: vi.fn().mockResolvedValue(undefined),
          }),
          deployedToken: mockObject<TokenDatabase['deployedToken']>({
            findByChainAndAddress: vi
              .fn()
              .mockResolvedValue(
                deployedToken({ ...address, abstractTokenId: null }),
              ),
            getByPrimaryKeys: vi.fn().mockResolvedValue([
              deployedToken({
                ...otherAddress,
                abstractTokenId: 'USDC01',
              }),
            ]),
            updateByChainAndAddress,
          }),
          abstractToken: mockObject<TokenDatabase['abstractToken']>({
            getByIds: vi
              .fn()
              .mockResolvedValue([abstractToken('USDC01', 'USDC')]),
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
      const markConflict = vi.fn().mockResolvedValue(1)

      const loop = createLoop({
        db: mockObject<Database>({
          interopTransfer: mockObject<Database['interopTransfer']>({
            getTokenAddressesAfterSerialId: vi.fn().mockResolvedValue({
              latestSerialId: undefined,
              transferCount: 0,
              tokenAddresses: [],
            }),
            getTokenRoutes: vi.fn().mockResolvedValue([
              route({
                srcChain: address.chain,
                srcTokenAddress: address.address,
                dstChain: firstOther.chain,
                dstTokenAddress: firstOther.address,
                bridgeType: 'lockAndMint',
              }),
              route({
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
            get: vi.fn().mockResolvedValue(undefined),
          }),
          tokenIngestionQueue: mockObject<TokenDatabase['tokenIngestionQueue']>(
            {
              findNextPending: vi
                .fn()
                .mockResolvedValueOnce(queueEntry(address))
                .mockResolvedValueOnce(undefined),
              markConflict,
            },
          ),
          deployedToken: mockObject<TokenDatabase['deployedToken']>({
            findByChainAndAddress: vi.fn().mockResolvedValue(undefined),
            getByPrimaryKeys: vi
              .fn()
              .mockResolvedValue([
                deployedToken({ ...firstOther, abstractTokenId: 'FIRST1' }),
                deployedToken({ ...secondOther, abstractTokenId: 'SECOND' }),
              ]),
          }),
          abstractToken: mockObject<TokenDatabase['abstractToken']>({
            getByIds: vi
              .fn()
              .mockResolvedValue([
                abstractToken('FIRST1', 'FOO'),
                abstractToken('SECOND', 'BAR'),
              ]),
          }),
        }),
      })

      await loop.runOnce()

      expect(markConflict.mock.calls[0][1]).toStrictEqual(
        'Non-swapping transfers point to multiple abstract tokens: FIRST1:FOO, SECOND:BAR.',
      )
    })

    it('drops the entry when no abstract token can be resolved', async () => {
      const address = token('ethereum', '0xaaa')
      const remove = vi.fn().mockResolvedValue(1)
      const findByName = vi.fn().mockResolvedValue(undefined)

      const loop = createLoop({
        tokenDb: mockObject<TokenDatabase>({
          tokenDbSettings: mockObject<TokenDatabase['tokenDbSettings']>({
            get: vi.fn().mockResolvedValue(undefined),
          }),
          tokenIngestionQueue: mockObject<TokenDatabase['tokenIngestionQueue']>(
            {
              findNextPending: vi
                .fn()
                .mockResolvedValueOnce(queueEntry(address))
                .mockResolvedValueOnce(undefined),
              remove,
            },
          ),
          deployedToken: mockObject<TokenDatabase['deployedToken']>({
            findByChainAndAddress: vi.fn().mockResolvedValue(undefined),
            getByPrimaryKeys: vi.fn().mockResolvedValue([]),
          }),
          chain: mockObject<TokenDatabase['chain']>({
            getAll: vi.fn().mockResolvedValue([]),
            findByName,
          }),
        }),
        db: mockObject<Database>({
          interopTransfer: mockObject<Database['interopTransfer']>({
            getTokenAddressesAfterSerialId: vi.fn().mockResolvedValue({
              latestSerialId: undefined,
              transferCount: 0,
              tokenAddresses: [],
            }),
            getTokenRoutes: vi.fn().mockResolvedValue([]),
          }),
        }),
        coingeckoClient: mockObject<CoingeckoClient>({
          getCoinList: vi.fn().mockResolvedValue([]),
        }),
      })

      await loop.runOnce()

      expect(remove).toHaveBeenCalledWith(queueEntry(address))
      expect(findByName).toHaveBeenCalledTimes(0)
    })

    it('marks an error when required deployed token facts are missing', async () => {
      const address = token('ethereum', '0xaaa')
      const otherAddress = token('base', '0xbbb')
      const markError = vi.fn().mockResolvedValue(1)

      const loop = createLoop({
        db: mockObject<Database>({
          interopTransfer: mockObject<Database['interopTransfer']>({
            getTokenAddressesAfterSerialId: vi.fn().mockResolvedValue({
              latestSerialId: undefined,
              transferCount: 0,
              tokenAddresses: [],
            }),
            getTokenRoutes: vi.fn().mockResolvedValue([
              route({
                srcChain: address.chain,
                srcTokenAddress: address.address,
                dstChain: otherAddress.chain,
                dstTokenAddress: otherAddress.address,
                bridgeType: 'lockAndMint',
              }),
            ]),
            findByTransferId: vi.fn().mockResolvedValue(
              transfer({
                srcChain: address.chain,
                srcTokenAddress: address.address,
                dstChain: otherAddress.chain,
                dstTokenAddress: otherAddress.address,
                bridgeType: 'lockAndMint',
              }),
            ),
          }),
        }),
        tokenDb: mockObject<TokenDatabase>({
          tokenDbSettings: mockObject<TokenDatabase['tokenDbSettings']>({
            get: vi.fn().mockResolvedValue(undefined),
          }),
          tokenIngestionQueue: mockObject<TokenDatabase['tokenIngestionQueue']>(
            {
              findNextPending: vi
                .fn()
                .mockResolvedValueOnce(queueEntry(address))
                .mockResolvedValueOnce(undefined),
              markError,
            },
          ),
          deployedToken: mockObject<TokenDatabase['deployedToken']>({
            findByChainAndAddress: vi.fn().mockResolvedValue(undefined),
            getByPrimaryKeys: vi
              .fn()
              .mockResolvedValue([
                deployedToken({ ...otherAddress, abstractTokenId: 'USDC01' }),
              ]),
          }),
          abstractToken: mockObject<TokenDatabase['abstractToken']>({
            getByIds: vi
              .fn()
              .mockResolvedValue([abstractToken('USDC01', 'USDC')]),
          }),
          chain: mockObject<TokenDatabase['chain']>({
            findByName: vi.fn().mockResolvedValue({
              name: 'ethereum',
              chainId: 1,
              explorerUrl: null,
              aliases: null,
              apis: null,
            }),
          }),
        }),
        fetchDeployedTokenFacts: vi.fn().mockResolvedValue({
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

      expect(markError.mock.calls[0][1]).toStrictEqual(
        'Missing required deployed-token facts: deploymentTimestamp. RPC lookup returned no value.',
      )
    })

    it('marks a CoinGecko data failure as an entry error and continues draining', async () => {
      const firstAddress = token('ethereum', '0xaaa')
      const secondAddress = token('ethereum', '0xbbb')
      const markError = vi.fn().mockResolvedValue(1)
      const remove = vi.fn().mockResolvedValue(1)

      const loop = createLoop({
        db: mockObject<Database>({
          interopTransfer: mockObject<Database['interopTransfer']>({
            getTokenAddressesAfterSerialId: vi.fn().mockResolvedValue({
              latestSerialId: undefined,
              transferCount: 0,
              tokenAddresses: [],
            }),
            getTokenRoutes: vi.fn().mockResolvedValue([]),
          }),
        }),
        tokenDb: mockObject<TokenDatabase>({
          tokenDbSettings: mockObject<TokenDatabase['tokenDbSettings']>({
            get: vi.fn().mockResolvedValue(undefined),
          }),
          tokenIngestionQueue: mockObject<TokenDatabase['tokenIngestionQueue']>(
            {
              findNextPending: vi
                .fn()
                .mockResolvedValueOnce(queueEntry(firstAddress))
                .mockResolvedValueOnce(queueEntry(secondAddress))
                .mockResolvedValueOnce(undefined),
              markError,
              remove,
            },
          ),
          deployedToken: mockObject<TokenDatabase['deployedToken']>({
            findByChainAndAddress: vi.fn().mockResolvedValue(undefined),
            getByPrimaryKeys: vi.fn().mockResolvedValue([]),
          }),
          abstractToken: mockObject<TokenDatabase['abstractToken']>({
            findByCoingeckoId: vi.fn().mockResolvedValue(undefined),
          }),
          chain: mockObject<TokenDatabase['chain']>({
            getAll: vi.fn().mockResolvedValue([
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
          getCoinList: vi.fn().mockResolvedValue([
            {
              id: 'usd-coin',
              name: 'USD Coin',
              symbol: 'usdc',
              platforms: { eth: firstAddress.address },
            },
          ]),
          getCoinDataById: vi
            .fn()
            .mockRejectedValue(
              new Error('CoinGecko API error: 429 Too Many Requests'),
            ),
        }),
      })

      await loop.runOnce()

      expect(markError).toHaveBeenCalledExactlyOnceWith(
        queueEntry(firstAddress),
        'Failed to fetch CoinGecko data for usd-coin: CoinGecko API error: 429 Too Many Requests.',
      )
      expect(remove).toHaveBeenCalledExactlyOnceWith(queueEntry(secondAddress))
    })

    it('marks an unexpected entry failure as an error and continues draining', async () => {
      const firstAddress = token('ethereum', '0xaaa')
      const secondAddress = token('ethereum', '0xbbb')
      const transferIndex = { findInvolving: vi.fn().mockReturnValue([]) }
      const refreshInteropTransferIndex = vi
        .fn()
        .mockResolvedValue(transferIndex)
      const process = vi
        .fn()
        .mockRejectedValueOnce(new Error('boom'))
        .mockResolvedValueOnce({
          id: 'ing_test',
          address: secondAddress,
          existingDeployedToken: undefined,
          steps: [],
          outcome: { kind: 'skip', reason: 'test' },
        } satisfies IngestionTrace)
      const markError = vi.fn().mockResolvedValue(1)

      const loop = new TokenIngestionLoop(
        mockObject<Database>({
          interopTransfer: mockObject<Database['interopTransfer']>({
            getTokenAddressesAfterSerialId: vi.fn().mockResolvedValue({
              latestSerialId: undefined,
              transferCount: 0,
              tokenAddresses: [],
            }),
            getTokenRoutes: vi.fn().mockResolvedValue([]),
          }),
        }),
        mockObject<TokenDatabase>({
          tokenDbSettings: mockObject<TokenDatabase['tokenDbSettings']>({
            get: vi.fn().mockResolvedValue(undefined),
          }),
          tokenIngestionQueue: mockObject<TokenDatabase['tokenIngestionQueue']>(
            {
              findNextPending: vi
                .fn()
                .mockResolvedValueOnce(queueEntry(firstAddress))
                .mockResolvedValueOnce(queueEntry(secondAddress))
                .mockResolvedValueOnce(undefined),
              markError,
            },
          ),
        }),
        mockObject({
          process,
          refreshInteropTransferIndex,
        }) as unknown as TokenIngestionProcessor,
        stubRelationIngestion(),
        Logger.SILENT,
        { intervalMs: 60_000 },
      )

      await loop.runOnce()

      expect(process).toHaveBeenCalledTimes(2)
      expect(markError).toHaveBeenCalledExactlyOnceWith(
        queueEntry(firstAddress),
        'Unexpected token ingestion error: boom.',
      )
    })

    it('creates an abstract token from CoinGecko before inserting a deployed token', async () => {
      const address = token('ethereum', '0xaaa')
      const abstractInsert = vi.fn().mockResolvedValue('ABC123')
      const deployedInsert = vi.fn().mockResolvedValue(undefined)

      const loop = createLoop({
        db: mockObject<Database>({
          interopTransfer: mockObject<Database['interopTransfer']>({
            getTokenAddressesAfterSerialId: vi.fn().mockResolvedValue({
              latestSerialId: undefined,
              transferCount: 0,
              tokenAddresses: [],
            }),
            getTokenRoutes: vi.fn().mockResolvedValue([]),
          }),
        }),
        tokenDb: mockObject<TokenDatabase>({
          transaction: async (callback) => await callback(),
          tokenDbSettings: mockObject<TokenDatabase['tokenDbSettings']>({
            get: vi.fn().mockResolvedValue(undefined),
          }),
          tokenIngestionQueue: mockObject<TokenDatabase['tokenIngestionQueue']>(
            {
              findNextPending: vi
                .fn()
                .mockResolvedValueOnce(queueEntry(address))
                .mockResolvedValueOnce(undefined),
              remove: vi.fn().mockResolvedValue(1),
            },
          ),
          tokenDbHistory: mockObject<TokenDatabase['tokenDbHistory']>({
            insert: vi.fn().mockResolvedValue(undefined),
          }),
          deployedToken: mockObject<TokenDatabase['deployedToken']>({
            findByChainAndAddress: vi.fn().mockResolvedValue(undefined),
            getByPrimaryKeys: vi.fn().mockResolvedValue([]),
            insert: deployedInsert,
          }),
          abstractToken: mockObject<TokenDatabase['abstractToken']>({
            findByCoingeckoId: vi.fn().mockResolvedValue(undefined),
            findById: vi.fn().mockResolvedValue(undefined),
            insert: abstractInsert,
          }),
          chain: mockObject<TokenDatabase['chain']>({
            getAll: vi.fn().mockResolvedValue([
              {
                name: 'ethereum',
                chainId: 1,
                explorerUrl: null,
                aliases: ['eth'],
                apis: null,
              },
            ]),
            findByName: vi.fn().mockResolvedValue({
              name: 'ethereum',
              chainId: 1,
              explorerUrl: null,
              aliases: null,
              apis: null,
            }),
          }),
        }),
        coingeckoClient: mockObject<CoingeckoClient>({
          getCoinList: vi.fn().mockResolvedValue([
            {
              id: 'usd-coin',
              name: 'USD Coin',
              symbol: 'usdc',
              platforms: { eth: address.address },
            },
          ]),
          getCoinDataById: vi.fn().mockResolvedValue({
            id: 'usd-coin',
            symbol: 'usdc',
            image: { large: 'https://example.com/usdc.png' },
            platforms: {},
          }),
          getCoinMarketChartRange: vi.fn().mockResolvedValue({
            prices: [{ date: new Date('2020-01-01T00:00:00Z'), value: 1 }],
            marketCaps: [],
          }),
        }),
        fetchDeployedTokenFacts: vi.fn().mockResolvedValue(completeFacts()),
        generateAbstractTokenId: () => 'ABC123',
      })

      await loop.runOnce()

      expect(abstractInsert.mock.calls[0][0]).toMatchObject({
        id: 'ABC123',
        symbol: 'USDC',
        coingeckoId: 'usd-coin',
        reviewed: false,
      })
      expect(deployedInsert.mock.calls[0][0]).toMatchObject({
        ...address,
        abstractTokenId: 'ABC123',
        symbol: 'USDC',
        decimals: 6,
      })
    })

    it('adopts the deployed-token casing when CoinGecko symbol differs only in case', async () => {
      const address = token('ethereum', '0xaaa')
      const abstractInsert = vi.fn().mockResolvedValue('ABC123')
      const deployedInsert = vi.fn().mockResolvedValue(undefined)

      const loop = createLoop({
        db: mockObject<Database>({
          interopTransfer: mockObject<Database['interopTransfer']>({
            getTokenAddressesAfterSerialId: vi.fn().mockResolvedValue({
              latestSerialId: undefined,
              transferCount: 0,
              tokenAddresses: [],
            }),
            getTokenRoutes: vi.fn().mockResolvedValue([]),
          }),
        }),
        tokenDb: mockObject<TokenDatabase>({
          transaction: async (callback) => await callback(),
          tokenDbSettings: mockObject<TokenDatabase['tokenDbSettings']>({
            get: vi.fn().mockResolvedValue(undefined),
          }),
          tokenIngestionQueue: mockObject<TokenDatabase['tokenIngestionQueue']>(
            {
              findNextPending: vi
                .fn()
                .mockResolvedValueOnce(queueEntry(address))
                .mockResolvedValueOnce(undefined),
              remove: vi.fn().mockResolvedValue(1),
            },
          ),
          tokenDbHistory: mockObject<TokenDatabase['tokenDbHistory']>({
            insert: vi.fn().mockResolvedValue(undefined),
          }),
          deployedToken: mockObject<TokenDatabase['deployedToken']>({
            findByChainAndAddress: vi.fn().mockResolvedValue(undefined),
            getByPrimaryKeys: vi.fn().mockResolvedValue([]),
            insert: deployedInsert,
          }),
          abstractToken: mockObject<TokenDatabase['abstractToken']>({
            findByCoingeckoId: vi.fn().mockResolvedValue(undefined),
            findById: vi.fn().mockResolvedValue(undefined),
            insert: abstractInsert,
          }),
          chain: mockObject<TokenDatabase['chain']>({
            getAll: vi.fn().mockResolvedValue([
              {
                name: 'ethereum',
                chainId: 1,
                explorerUrl: null,
                aliases: ['eth'],
                apis: null,
              },
            ]),
            findByName: vi.fn().mockResolvedValue({
              name: 'ethereum',
              chainId: 1,
              explorerUrl: null,
              aliases: null,
              apis: null,
            }),
          }),
        }),
        coingeckoClient: mockObject<CoingeckoClient>({
          getCoinList: vi.fn().mockResolvedValue([
            {
              id: 'ethena-staked-usde',
              name: 'Ethena Staked USDe',
              symbol: 'susde',
              platforms: { eth: address.address },
            },
          ]),
          getCoinDataById: vi.fn().mockResolvedValue({
            id: 'ethena-staked-usde',
            symbol: 'susde',
            image: { large: 'https://example.com/susde.png' },
            platforms: {},
          }),
          getCoinMarketChartRange: vi.fn().mockResolvedValue({
            prices: [{ date: new Date('2024-01-01T00:00:00Z'), value: 1 }],
            marketCaps: [],
          }),
        }),
        fetchDeployedTokenFacts: vi.fn().mockResolvedValue({
          isContract: true,
          symbol: 'sUSDe',
          symbolSource: 'rpc',
          decimals: 18,
          deploymentTimestamp: UnixTime(1),
          warnings: [],
        } satisfies DeployedTokenFacts),
        generateAbstractTokenId: () => 'ABC123',
      })

      await loop.runOnce()

      expect(abstractInsert.mock.calls[0][0]).toMatchObject({
        id: 'ABC123',
        symbol: 'sUSDe',
        coingeckoId: 'ethena-staked-usde',
        reviewed: false,
      })
      expect(deployedInsert.mock.calls[0][0]).toMatchObject({
        ...address,
        abstractTokenId: 'ABC123',
        symbol: 'sUSDe',
        decimals: 18,
      })
    })

    it('marks a conflict instead of creating a CoinGecko abstract when symbols differ', async () => {
      const address = token('ethereum', '0xaaa')
      const markConflict = vi.fn().mockResolvedValue(1)
      const abstractInsert = vi.fn().mockResolvedValue('ABC123')
      const deployedInsert = vi.fn().mockResolvedValue(undefined)

      const loop = createLoop({
        db: mockObject<Database>({
          interopTransfer: mockObject<Database['interopTransfer']>({
            getTokenAddressesAfterSerialId: vi.fn().mockResolvedValue({
              latestSerialId: undefined,
              transferCount: 0,
              tokenAddresses: [],
            }),
            getTokenRoutes: vi.fn().mockResolvedValue([]),
          }),
        }),
        tokenDb: mockObject<TokenDatabase>({
          tokenDbSettings: mockObject<TokenDatabase['tokenDbSettings']>({
            get: vi.fn().mockResolvedValue(undefined),
          }),
          tokenIngestionQueue: mockObject<TokenDatabase['tokenIngestionQueue']>(
            {
              findNextPending: vi
                .fn()
                .mockResolvedValueOnce(queueEntry(address))
                .mockResolvedValueOnce(undefined),
              markConflict,
            },
          ),
          deployedToken: mockObject<TokenDatabase['deployedToken']>({
            findByChainAndAddress: vi.fn().mockResolvedValue(undefined),
            getByPrimaryKeys: vi.fn().mockResolvedValue([]),
            insert: deployedInsert,
          }),
          abstractToken: mockObject<TokenDatabase['abstractToken']>({
            findByCoingeckoId: vi.fn().mockResolvedValue(undefined),
            findById: vi.fn().mockResolvedValue(undefined),
            insert: abstractInsert,
          }),
          chain: mockObject<TokenDatabase['chain']>({
            getAll: vi.fn().mockResolvedValue([
              {
                name: 'ethereum',
                chainId: 1,
                explorerUrl: null,
                aliases: ['eth'],
                apis: null,
              },
            ]),
            findByName: vi.fn().mockResolvedValue({
              name: 'ethereum',
              chainId: 1,
              explorerUrl: null,
              aliases: null,
              apis: null,
            }),
          }),
        }),
        coingeckoClient: mockObject<CoingeckoClient>({
          getCoinList: vi.fn().mockResolvedValue([
            {
              id: 'usd-coin',
              name: 'USD Coin',
              symbol: 'usdc',
              platforms: { eth: address.address },
            },
          ]),
          getCoinDataById: vi.fn().mockResolvedValue({
            id: 'usd-coin',
            symbol: 'usdc',
            image: { large: 'https://example.com/usdc.png' },
            platforms: {},
          }),
          getCoinMarketChartRange: vi.fn().mockResolvedValue({
            prices: [{ date: new Date('2020-01-01T00:00:00Z'), value: 1 }],
            marketCaps: [],
          }),
        }),
        fetchDeployedTokenFacts: vi.fn().mockResolvedValue({
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

      expect(markConflict.mock.calls[0][1]).toStrictEqual(
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
  const db = mockObject<Database>({
    interopTransfer: mockObject<Database['interopTransfer']>({
      getTokenAddressesAfterSerialId: vi.fn().mockResolvedValue({
        latestSerialId: undefined,
        transferCount: 0,
        tokenAddresses: [],
      }),
      getTokenRoutes: vi.fn().mockResolvedValue([]),
      findByTransferId: vi
        .fn()
        .mockImplementation(async (transferId: string) =>
          transfer({ transferId }),
        ),
    }),
    ...deps.db,
  })
  const tokenDb = mockObject<TokenDatabase>({
    tokenDbSettings: mockObject<TokenDatabase['tokenDbSettings']>({
      get: vi.fn().mockResolvedValue(undefined),
    }),
    tokenIngestionQueue: mockObject<TokenDatabase['tokenIngestionQueue']>({
      findNextPending: vi.fn().mockResolvedValue(undefined),
    }),
    ...deps.tokenDb,
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

  return new TokenIngestionLoop(
    db,
    tokenDb,
    processor,
    stubRelationIngestion(),
    Logger.SILENT,
    {
      intervalMs: 60_000,
      newQueueState: deps.newQueueState,
    },
  )
}

function stubRelationIngestion() {
  return mockObject<TokenRelationIngestion>({
    runOnce: vi.fn().mockResolvedValue(undefined),
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
    ignored: false,
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
    additionalCoingeckoEntries: null,
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

function route(
  overrides: Partial<InteropTokenRouteRecord>,
): InteropTokenRouteRecord {
  return {
    plugin: 'plugin1',
    srcChain: 'ethereum',
    srcTokenAddress: token('ethereum', '0xaaa').address,
    dstChain: 'base',
    dstTokenAddress: token('base', '0xbbb').address,
    bridgeType: undefined,
    srcWasBurned: false,
    dstWasMinted: true,
    transferCount: 1,
    sampleTransferId: 'transfer-id',
    sampleSrcTxHash: '0xsrc',
    sampleDstTxHash: '0xdst',
    ...overrides,
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
