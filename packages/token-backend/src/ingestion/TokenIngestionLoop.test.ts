import { Logger } from '@l2beat/backend-tools'
import type {
  Database,
  DeployedTokenRecord,
  InteropTransferRecord,
  TokenDatabase,
} from '@l2beat/database'
import type { AbstractTokenRepository } from '@l2beat/database/dist/repositories/AbstractTokenRepository'
import type { ChainRepository } from '@l2beat/database/dist/repositories/ChainRepository'
import type { DeployedTokenRepository } from '@l2beat/database/dist/repositories/DeployedTokenRepository'
import type { InteropTransferRepository } from '@l2beat/database/dist/repositories/InteropTransferRepository'
import type { TokenDbHistoryRepository } from '@l2beat/database/dist/repositories/TokenDbHistoryRepository'
import type { TokenDbSettingRepository } from '@l2beat/database/dist/repositories/TokenDbSettingRepository'
import type {
  TokenIngestionQueueRecord,
  TokenIngestionQueueRepository,
} from '@l2beat/database/dist/repositories/TokenIngestionQueueRepository'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { Chain } from '../chains/Chain'
import type { CoingeckoClient } from '../chains/clients/coingecko/CoingeckoClient'
import type { DeployedTokenFacts } from '../chains/fetchDeployedTokenFacts'
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
          tokenDbSetting: mockObject<TokenDbSettingRepository>({
            get,
            set,
          }),
          tokenIngestionQueue: mockObject<TokenIngestionQueueRepository>({
            enqueue,
            findNextPending,
          }),
        }),
        db: mockObject<Database>({
          interopTransfer: mockObject<InteropTransferRepository>({
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

    it('stages newly discovered addresses when approval is required', async () => {
      const enqueue = mockFn().resolvesTo(undefined)

      const loop = createLoop({
        newQueueState: 'staged',
        tokenDb: mockObject<TokenDatabase>({
          tokenDbSetting: mockObject<TokenDbSettingRepository>({
            get: mockFn().resolvesTo(undefined),
            set: mockFn().resolvesTo(undefined),
          }),
          tokenIngestionQueue: mockObject<TokenIngestionQueueRepository>({
            enqueue,
            findNextPending: mockFn().resolvesTo(undefined),
          }),
        }),
        db: mockObject<Database>({
          interopTransfer: mockObject<InteropTransferRepository>({
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
          tokenDbSetting: mockObject<TokenDbSettingRepository>({
            get: mockFn().resolvesTo(undefined),
          }),
          tokenIngestionQueue: mockObject<TokenIngestionQueueRepository>({
            findNextPending: mockFn().resolvesTo(undefined),
          }),
        }),
        db: mockObject<Database>({
          interopTransfer: mockObject<InteropTransferRepository>({
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
          tokenDbSetting: mockObject<TokenDbSettingRepository>({
            get: mockFn().resolvesTo({
              key: 'interop-transfers:lastSerialId',
              value: '10',
            }),
            set,
          }),
          tokenIngestionQueue: mockObject<TokenIngestionQueueRepository>({
            enqueue,
            findNextPending: mockFn().resolvesTo(undefined),
          }),
        }),
        db: mockObject<Database>({
          interopTransfer: mockObject<InteropTransferRepository>({
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
          interopTransfer: mockObject<InteropTransferRepository>({
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
            markAsUnprocessedByTokens: mockFn().resolvesTo(1),
          }),
        }),
        tokenDb: mockObject<TokenDatabase>({
          transaction: async (callback) => await callback(),
          tokenDbSetting: mockObject<TokenDbSettingRepository>({
            get: mockFn().resolvesTo(undefined),
          }),
          tokenIngestionQueue: mockObject<TokenIngestionQueueRepository>({
            findNextPending,
            enqueue: mockFn().resolvesTo(undefined),
            remove: mockFn().resolvesTo(1),
          }),
          tokenDbHistory: mockObject<TokenDbHistoryRepository>({
            insert: mockFn().resolvesTo(undefined),
          }),
          deployedToken: mockObject<DeployedTokenRepository>({
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
          abstractToken: mockObject<AbstractTokenRepository>({
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
          interopTransfer: mockObject<InteropTransferRepository>({
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
          tokenDbSetting: mockObject<TokenDbSettingRepository>({
            get: mockFn().resolvesTo(undefined),
          }),
          tokenIngestionQueue: mockObject<TokenIngestionQueueRepository>({
            findNextPending: mockFn()
              .resolvesToOnce(queueEntry(address))
              .resolvesToOnce(undefined),
            markConflict,
          }),
          deployedToken: mockObject<DeployedTokenRepository>({
            findByChainAndAddress: mockFn().resolvesTo(undefined),
            getByPrimaryKeys: mockFn().resolvesTo([
              deployedToken({ ...firstOther, abstractTokenId: 'FIRST1' }),
              deployedToken({ ...secondOther, abstractTokenId: 'SECOND' }),
            ]),
          }),
          abstractToken: mockObject<AbstractTokenRepository>({
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
          tokenDbSetting: mockObject<TokenDbSettingRepository>({
            get: mockFn().resolvesTo(undefined),
          }),
          tokenIngestionQueue: mockObject<TokenIngestionQueueRepository>({
            findNextPending: mockFn()
              .resolvesToOnce(queueEntry(address))
              .resolvesToOnce(undefined),
            remove,
          }),
          deployedToken: mockObject<DeployedTokenRepository>({
            findByChainAndAddress: mockFn().resolvesTo(undefined),
            getByPrimaryKeys: mockFn().resolvesTo([]),
          }),
          chain: mockObject<ChainRepository>({
            getAll: mockFn().resolvesTo([]),
            findByName,
          }),
        }),
        db: mockObject<Database>({
          interopTransfer: mockObject<InteropTransferRepository>({
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
          interopTransfer: mockObject<InteropTransferRepository>({
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
          tokenDbSetting: mockObject<TokenDbSettingRepository>({
            get: mockFn().resolvesTo(undefined),
          }),
          tokenIngestionQueue: mockObject<TokenIngestionQueueRepository>({
            findNextPending: mockFn()
              .resolvesToOnce(queueEntry(address))
              .resolvesToOnce(undefined),
            markError,
          }),
          deployedToken: mockObject<DeployedTokenRepository>({
            findByChainAndAddress: mockFn().resolvesTo(undefined),
            getByPrimaryKeys: mockFn().resolvesTo([
              deployedToken({ ...otherAddress, abstractTokenId: 'USDC01' }),
            ]),
          }),
          abstractToken: mockObject<AbstractTokenRepository>({
            getByIds: mockFn().resolvesTo([abstractToken('USDC01', 'USDC')]),
          }),
          chain: mockObject<ChainRepository>({
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

    it('creates an abstract token from CoinGecko before inserting a deployed token', async () => {
      const address = token('ethereum', '0xaaa')
      const abstractInsert = mockFn().resolvesTo('ABC123')
      const deployedInsert = mockFn().resolvesTo(undefined)

      const loop = createLoop({
        db: mockObject<Database>({
          interopTransfer: mockObject<InteropTransferRepository>({
            getTokenAddressesAfterSerialId: mockFn().resolvesTo({
              latestSerialId: undefined,
              transferCount: 0,
              tokenAddresses: [],
            }),
            getAll: mockFn().resolvesTo([]),
            markAsUnprocessedByTokens: mockFn().resolvesTo(1),
          }),
        }),
        tokenDb: mockObject<TokenDatabase>({
          transaction: async (callback) => await callback(),
          tokenDbSetting: mockObject<TokenDbSettingRepository>({
            get: mockFn().resolvesTo(undefined),
          }),
          tokenIngestionQueue: mockObject<TokenIngestionQueueRepository>({
            findNextPending: mockFn()
              .resolvesToOnce(queueEntry(address))
              .resolvesToOnce(undefined),
            remove: mockFn().resolvesTo(1),
          }),
          tokenDbHistory: mockObject<TokenDbHistoryRepository>({
            insert: mockFn().resolvesTo(undefined),
          }),
          deployedToken: mockObject<DeployedTokenRepository>({
            findByChainAndAddress: mockFn().resolvesTo(undefined),
            getByPrimaryKeys: mockFn().resolvesTo([]),
            insert: deployedInsert,
          }),
          abstractToken: mockObject<AbstractTokenRepository>({
            findByCoingeckoId: mockFn().resolvesTo(undefined),
            findById: mockFn().resolvesTo(undefined),
            insert: abstractInsert,
          }),
          chain: mockObject<ChainRepository>({
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
      interopTransfer: mockObject<InteropTransferRepository>({
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
      tokenDbSetting: mockObject<TokenDbSettingRepository>({
        get: mockFn().resolvesTo(undefined),
      }),
      tokenIngestionQueue: mockObject<TokenIngestionQueueRepository>({
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
