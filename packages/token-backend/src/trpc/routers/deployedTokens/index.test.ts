import type {
  AbstractTokenRecord,
  Database,
  DeployedTokenRecord,
  InteropTransferRecord,
  TokenDatabase,
  TokenRelationLockedToken,
  TokenRelationRecord,
} from '@l2beat/database'
import { Address32 } from '@l2beat/shared-pure'
import { describe, expect, it, vi } from 'vitest'
import type { CoingeckoClient } from '../../../chains/clients/coingecko/CoingeckoClient'
import type { TokenIngestionProcessor } from '../../../ingestion/TokenIngestionProcessor'
import { createCallerFactory } from '../../trpc'
import { type DeployedTokensRouterDeps, deployedTokensRouter } from './index'

describe('deployedTokensRouter', () => {
  describe('findByChainAndAddress', () => {
    it('returns null when token is not found', async () => {
      const mockFindByChainAndAddress = vi.fn().mockResolvedValue(undefined)
      const mockDb = {} as unknown as Database
      const mockTokenDb = {
        deployedToken: {
          findByChainAndAddress: mockFindByChainAndAddress,
        } as unknown as TokenDatabase['deployedToken'],
      } as unknown as TokenDatabase
      const mockCoingeckoClient = {} as unknown as CoingeckoClient

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.findByChainAndAddress({
        chain: 'ethereum',
        address: '0x123',
      })
      expect(result).toEqual(null)
      expect(mockFindByChainAndAddress).toHaveBeenCalledWith({
        chain: 'ethereum',
        address: '0x123',
      })
    })

    it('returns token when found', async () => {
      const token = {
        chain: 'ethereum',
        address: '0x123',
        symbol: 'USDC',
        decimals: 6,
        comment: null,
        ignored: false,
        abstractTokenId: null,
        deploymentTimestamp: 0,
        metadata: {
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
      } satisfies DeployedTokenRecord
      const mockTokenDb = {
        deployedToken: {
          findByChainAndAddress: vi.fn().mockResolvedValue(token),
        } as unknown as TokenDatabase['deployedToken'],
      } as unknown as TokenDatabase
      const mockDb = {} as unknown as Database
      const mockCoingeckoClient = {} as unknown as CoingeckoClient

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.findByChainAndAddress({
        chain: 'ethereum',
        address: '0x123',
      })

      expect(result).toEqual(token)
    })
  })

  describe('checkIfExists', () => {
    it('returns false when token does not exist', async () => {
      const mockTokenDb = {
        deployedToken: {
          findByChainAndAddress: vi.fn().mockResolvedValue(undefined),
        } as unknown as TokenDatabase['deployedToken'],
      } as unknown as TokenDatabase
      const mockDb = {} as unknown as Database
      const mockCoingeckoClient = {} as unknown as CoingeckoClient

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.checkIfExists({
        chain: 'ethereum',
        address: '0x123',
      })

      expect(result).toEqual(false)
    })

    it('returns true when token exists', async () => {
      const token = {
        id: 1,
        chain: 'ethereum',
        address: '0x123',
      }
      const mockTokenDb = {
        deployedToken: {
          findByChainAndAddress: vi.fn().mockResolvedValue(token),
        } as unknown as TokenDatabase['deployedToken'],
      } as unknown as TokenDatabase
      const mockDb = {} as unknown as Database
      const mockCoingeckoClient = {} as unknown as CoingeckoClient

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.checkIfExists({
        chain: 'ethereum',
        address: '0x123',
      })

      expect(result).toEqual(true)
    })
  })

  describe('getByChainAndAddress', () => {
    it('returns tokens for multiple chain-address pairs', async () => {
      const tokens = [
        {
          deployedToken: {
            chain: 'ethereum',
            address: '0x123',
            symbol: 'USDC',
            decimals: 6,
            comment: null,
            ignored: false,
            abstractTokenId: null,
            deploymentTimestamp: 0,
            metadata: {
              tvs: {
                includeInCalculations: true,
                source: 'external',
                supply: 'circulatingSupply',
                bridgedUsing: [],
                excludeFromTotal: false,
              },
            },
          },
          abstractToken: undefined,
        },
        {
          deployedToken: {
            chain: 'arbitrum',
            address: '0x456',
            symbol: 'USDT',
            decimals: 6,
            comment: null,
            ignored: false,
            abstractTokenId: null,
            deploymentTimestamp: 0,
            metadata: {
              tvs: {
                includeInCalculations: true,
                source: 'canonical',
                supply: 'zero',
                bridgedUsing: [],
                excludeFromTotal: false,
              },
            },
          },
          abstractToken: undefined,
        },
      ] satisfies {
        deployedToken: DeployedTokenRecord
        abstractToken: AbstractTokenRecord | undefined
      }[]
      const mockGetByChainAndAddress = vi.fn().mockResolvedValue(tokens)
      const mockTokenDb = {
        deployedToken: {
          getByChainAndAddress: mockGetByChainAndAddress,
        } as unknown as TokenDatabase['deployedToken'],
      } as unknown as TokenDatabase
      const mockDb = {} as unknown as Database
      const mockCoingeckoClient = {} as unknown as CoingeckoClient

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.getByChainAndAddress([
        { chain: 'ethereum', address: '0x123' },
        { chain: 'arbitrum', address: '0x456' },
      ])

      expect(result).toEqual(tokens)
      expect(mockGetByChainAndAddress).toHaveBeenCalledWith([
        { chain: 'ethereum', address: '0x123' },
        { chain: 'arbitrum', address: '0x456' },
      ])
    })
  })

  describe('getRelationsGraphNodeDetails', () => {
    it('returns one deployed token and its abstract token', async () => {
      const token = deployedToken({
        chain: 'ethereum',
        address: '0xaaa',
        symbol: 'USDC',
        abstractTokenId: 'USDC',
      })
      const abstractToken = {
        id: 'USDC',
        symbol: 'USDC',
        issuer: 'Circle',
        category: 'stablecoin',
        iconUrl: null,
        coingeckoId: 'usd-coin',
        coingeckoListingTimestamp: null,
        additionalCoingeckoEntries: null,
        comment: null,
        reviewed: true,
        isPriceUnreliable: false,
      } satisfies AbstractTokenRecord
      const findDeployedToken = vi.fn().mockResolvedValue(token)
      const findAbstractToken = vi.fn().mockResolvedValue(abstractToken)
      const mockTokenDb = {
        deployedToken: {
          findByChainAndAddress: findDeployedToken,
        } as unknown as TokenDatabase['deployedToken'],
        abstractToken: {
          findById: findAbstractToken,
        } as unknown as TokenDatabase['abstractToken'],
      } as unknown as TokenDatabase

      const caller = createRouter(
        mockTokenDb,
        {} as unknown as Database,
        {} as unknown as CoingeckoClient,
      )

      expect(
        await caller.getRelationsGraphNodeDetails({
          chain: token.chain,
          address: token.address,
        }),
      ).toEqual({ deployedToken: token, abstractToken })
      expect(findAbstractToken).toHaveBeenCalledWith('USDC')
    })

    it('returns null details for an uncatalogued endpoint', async () => {
      const mockTokenDb = {
        deployedToken: {
          findByChainAndAddress: vi.fn().mockResolvedValue(undefined),
        } as unknown as TokenDatabase['deployedToken'],
      } as unknown as TokenDatabase
      const caller = createRouter(
        mockTokenDb,
        {} as unknown as Database,
        {} as unknown as CoingeckoClient,
      )

      expect(
        await caller.getRelationsGraphNodeDetails({
          chain: 'optimism',
          address: '0xccc',
        }),
      ).toEqual({ deployedToken: null, abstractToken: null })
    })
  })

  describe('getRelations', () => {
    it("reports the token's role in every relation that mentions it", async () => {
      const token = { chain: 'base', address: '0xbbb' }
      const locked = {
        ...tokenRelationRoute({
          tokenAChain: 'base',
          tokenAAddress: '0xbbb',
          tokenBChain: 'ethereum',
          tokenBAddress: '0xaaa',
          plugin: 'a-plugin',
          lockedToken: 'A',
        }),
        transfer: {},
      } satisfies TokenRelationRecord
      const minted = {
        ...tokenRelationRoute({
          tokenAChain: 'arbitrum',
          tokenAAddress: '0xccc',
          tokenBChain: 'base',
          tokenBAddress: '0xbbb',
          plugin: 'b-plugin',
          lockedToken: 'A',
        }),
        transfer: {},
      } satisfies TokenRelationRecord
      const unknownRole = {
        ...tokenRelationRoute({
          tokenAChain: 'base',
          tokenAAddress: '0xbbb',
          tokenBChain: 'optimism',
          tokenBAddress: '0xddd',
          plugin: 'c-plugin',
        }),
        transfer: {},
      } satisfies TokenRelationRecord
      const symmetric = {
        ...tokenRelationRoute({
          tokenAChain: 'base',
          tokenAAddress: '0xbbb',
          tokenBChain: 'linea',
          tokenBAddress: '0xeee',
          plugin: 'd-plugin',
        }),
        bridgeType: 'burnAndMint' as const,
        transfer: {},
      } satisfies TokenRelationRecord

      const getRelationsFor = vi
        .fn()
        .mockResolvedValue([locked, minted, unknownRole, symmetric])
      const mockTokenDb = {
        tokenRelation: {
          getRelationsFor,
        } as unknown as TokenDatabase['tokenRelation'],
        deployedToken: {
          getByPrimaryKeys: vi.fn().mockResolvedValue([
            deployedToken({
              chain: 'ethereum',
              address: '0xaaa',
              symbol: 'USDC',
            }),
          ]),
        } as unknown as TokenDatabase['deployedToken'],
      } as unknown as TokenDatabase

      const caller = createRouter(
        mockTokenDb,
        {} as unknown as Database,
        {} as unknown as CoingeckoClient,
      )
      const result = await caller.getRelations(token)

      expect(getRelationsFor).toHaveBeenCalledWith(token)
      expect(
        result.map((entry) => ({
          plugin: entry.relation.plugin,
          role: entry.role,
          otherToken: entry.otherToken?.chain ?? null,
        })),
      ).toEqual([
        // This token is the escrowed original of the ethereum representation.
        { plugin: 'a-plugin', role: 'locked', otherToken: 'ethereum' },
        // ...and itself a representation of the arbitrum original, which is not
        // catalogued as a deployed token.
        { plugin: 'b-plugin', role: 'minted', otherToken: null },
        { plugin: 'c-plugin', role: 'unknown', otherToken: null },
        // A burnAndMint pair is symmetric — both endpoints are minted, and
        // the bridge type is what carries the symmetry — so the role says
        // minted, never symmetric.
        { plugin: 'd-plugin', role: 'minted', otherToken: null },
      ])
    })
  })

  describe('getMintingPlugins', () => {
    it('returns the plugin names straight from the repository', async () => {
      const getMintingPluginsFor = vi
        .fn()
        .mockResolvedValue(['canonicalbridge', 'superbridge'])
      const mockTokenDb = {
        tokenRelation: {
          getMintingPluginsFor,
        } as unknown as TokenDatabase['tokenRelation'],
      } as unknown as TokenDatabase
      const caller = createRouter(
        mockTokenDb,
        {} as unknown as Database,
        {} as unknown as CoingeckoClient,
      )

      expect(
        await caller.getMintingPlugins({ chain: 'base', address: '0xbbb' }),
      ).toEqual(['canonicalbridge', 'superbridge'])
      expect(getMintingPluginsFor).toHaveBeenCalledWith({
        chain: 'base',
        address: '0xbbb',
      })
    })
  })

  describe('getRelationsGraphRelationDetails', () => {
    it('loads transfer evidence only for the selected relation', async () => {
      const primaryKey = {
        tokenAChain: 'base',
        tokenAAddress: '0xbbb',
        tokenBChain: 'ethereum',
        tokenBAddress: '0xaaa',
        plugin: 'test-plugin',
        bridgeType: 'lockAndMint' as const,
      }
      const relation = {
        ...primaryKey,
        lockedToken: 'B' as const,
        transfer: {
          transferId: 'transfer-1',
          srcTxHash: '0xsrc',
          dstTxHash: '0xdst',
        },
      } satisfies TokenRelationRecord
      const findRelation = vi.fn().mockResolvedValue(relation)
      const mockTokenDb = {
        tokenRelation: {
          findByPrimaryKey: findRelation,
        } as unknown as TokenDatabase['tokenRelation'],
      } as unknown as TokenDatabase
      const caller = createRouter(
        mockTokenDb,
        {} as unknown as Database,
        {} as unknown as CoingeckoClient,
      )

      expect(await caller.getRelationsGraphRelationDetails(primaryKey)).toEqual(
        relation,
      )
      expect(findRelation).toHaveBeenCalledWith(primaryKey)
    })
  })

  describe('getRelationsGraph', () => {
    it('returns deployed relation endpoints and lightweight edges', async () => {
      const relations = [
        tokenRelationRoute({
          tokenAChain: 'base',
          tokenAAddress: '0xbbb',
          tokenBChain: 'ethereum',
          tokenBAddress: '0xaaa',
          plugin: 'test-plugin',
        }),
        tokenRelationRoute({
          tokenAChain: 'ethereum',
          tokenAAddress: '0xaaa',
          tokenBChain: 'base',
          tokenBAddress: '0xbbb',
          plugin: 'test-plugin',
        }),
      ]
      const tokens = [
        deployedToken({
          chain: 'base',
          address: '0xbbb',
          symbol: 'USDC',
          abstractTokenId: 'USDC',
        }),
        deployedToken({
          chain: 'ethereum',
          address: '0xaaa',
          symbol: 'USDC',
          abstractTokenId: 'USDC',
        }),
      ]
      const mockGetAllRelations = vi.fn().mockResolvedValue(relations)
      const mockGetTokens = vi.fn().mockResolvedValue(tokens)
      const mockTokenDb = {
        tokenRelation: {
          getAllRoutes: mockGetAllRelations,
        } as unknown as TokenDatabase['tokenRelation'],
        deployedToken: {
          getByPrimaryKeys: mockGetTokens,
          getAll: vi.fn().mockResolvedValue([]),
        } as unknown as TokenDatabase['deployedToken'],
      } as unknown as TokenDatabase
      const mockDb = {} as unknown as Database
      const mockCoingeckoClient = {} as unknown as CoingeckoClient

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.getRelationsGraph()

      expect(result).toEqual({
        nodes: [
          {
            id: 'base:0xbbb',
            chain: 'base',
            address: '0xbbb',
            symbol: 'USDC',
            abstractTokenId: 'USDC',
            isDeployed: true,
            hasRelations: true,
          },
          {
            id: 'ethereum:0xaaa',
            chain: 'ethereum',
            address: '0xaaa',
            symbol: 'USDC',
            abstractTokenId: 'USDC',
            isDeployed: true,
            hasRelations: true,
          },
        ],
        relations: relations.map((relation) => ({
          ...relation,
          isConflict: false,
        })),
      })
      expect(mockGetAllRelations).toHaveBeenCalledTimes(1)
      expect(mockGetTokens).toHaveBeenCalledWith([
        { chain: 'base', address: '0xbbb' },
        { chain: 'ethereum', address: '0xaaa' },
      ])
    })

    it('includes missing endpoints and marks different abstract tokens as conflicts', async () => {
      const conflict = tokenRelationRoute({
        tokenAChain: 'ethereum',
        tokenAAddress: '0xaaa',
        tokenBChain: 'base',
        tokenBAddress: '0xbbb',
        plugin: 'test-plugin',
      })
      const unresolved = tokenRelationRoute({
        tokenAChain: 'ethereum',
        tokenAAddress: '0xaaa',
        tokenBChain: 'optimism',
        tokenBAddress: '0xccc',
        plugin: 'test-plugin',
      })
      const tokens = [
        deployedToken({
          chain: 'ethereum',
          address: '0xaaa',
          symbol: 'USDC',
          abstractTokenId: 'USDC',
        }),
        deployedToken({
          chain: 'base',
          address: '0xbbb',
          symbol: 'USDC',
          abstractTokenId: 'USDC-BASE',
        }),
      ]
      const mockTokenDb = {
        tokenRelation: {
          getAllRoutes: vi.fn().mockResolvedValue([conflict, unresolved]),
        } as unknown as TokenDatabase['tokenRelation'],
        deployedToken: {
          getByPrimaryKeys: vi.fn().mockResolvedValue(tokens),
          getAll: vi.fn().mockResolvedValue([]),
        } as unknown as TokenDatabase['deployedToken'],
      } as unknown as TokenDatabase

      const caller = createRouter(
        mockTokenDb,
        {} as unknown as Database,
        {} as unknown as CoingeckoClient,
      )

      expect(await caller.getRelationsGraph()).toEqual({
        nodes: [
          {
            id: 'ethereum:0xaaa',
            chain: 'ethereum',
            address: '0xaaa',
            symbol: 'USDC',
            abstractTokenId: 'USDC',
            isDeployed: true,
            hasRelations: true,
          },
          {
            id: 'base:0xbbb',
            chain: 'base',
            address: '0xbbb',
            symbol: 'USDC',
            abstractTokenId: 'USDC-BASE',
            isDeployed: true,
            hasRelations: true,
          },
          {
            id: 'optimism:0xccc',
            chain: 'optimism',
            address: '0xccc',
            symbol: null,
            abstractTokenId: null,
            isDeployed: false,
            hasRelations: true,
          },
        ],
        relations: [
          { ...conflict, isConflict: true },
          { ...unresolved, isConflict: false },
        ],
      })
    })

    it('excludes ignored tokens and their relations', async () => {
      const relation = tokenRelationRoute({
        tokenAChain: 'ethereum',
        tokenAAddress: '0xaaa',
        tokenBChain: 'base',
        tokenBAddress: '0xbbb',
        plugin: 'test-plugin',
      })
      const mockTokenDb = {
        tokenRelation: {
          getAllRoutes: vi.fn().mockResolvedValue([relation]),
        } as unknown as TokenDatabase['tokenRelation'],
        deployedToken: {
          getByPrimaryKeys: vi.fn().mockResolvedValue([
            deployedToken({
              chain: 'ethereum',
              address: '0xaaa',
              symbol: 'TEST',
              ignored: true,
            }),
            deployedToken({
              chain: 'base',
              address: '0xbbb',
              symbol: 'OP',
            }),
          ]),
          getAll: vi.fn().mockResolvedValue([]),
        } as unknown as TokenDatabase['deployedToken'],
      } as unknown as TokenDatabase

      const caller = createRouter(
        mockTokenDb,
        {} as unknown as Database,
        {} as unknown as CoingeckoClient,
      )

      expect(await caller.getRelationsGraph()).toEqual({
        nodes: [],
        relations: [],
      })
    })

    it('excludes bridge types the graph does not render', async () => {
      const supported = tokenRelationRoute({
        tokenAChain: 'ethereum',
        tokenAAddress: '0xaaa',
        tokenBChain: 'base',
        tokenBAddress: '0xbbb',
        plugin: 'supported',
      })
      const unsupported = {
        ...tokenRelationRoute({
          tokenAChain: 'arbitrum',
          tokenAAddress: '0xccc',
          tokenBChain: 'optimism',
          tokenBAddress: '0xddd',
          plugin: 'unsupported',
        }),
        bridgeType: 'nonMinting' as const,
      }
      const getTokens = vi.fn().mockResolvedValue([])
      const mockTokenDb = {
        tokenRelation: {
          getAllRoutes: vi.fn().mockResolvedValue([supported, unsupported]),
        } as unknown as TokenDatabase['tokenRelation'],
        deployedToken: {
          getByPrimaryKeys: getTokens,
          getAll: vi.fn().mockResolvedValue([]),
        } as unknown as TokenDatabase['deployedToken'],
      } as unknown as TokenDatabase

      const caller = createRouter(
        mockTokenDb,
        {} as unknown as Database,
        {} as unknown as CoingeckoClient,
      )

      expect(await caller.getRelationsGraph()).toEqual({
        nodes: [
          {
            id: 'ethereum:0xaaa',
            chain: 'ethereum',
            address: '0xaaa',
            symbol: null,
            abstractTokenId: null,
            isDeployed: false,
            hasRelations: true,
          },
          {
            id: 'base:0xbbb',
            chain: 'base',
            address: '0xbbb',
            symbol: null,
            abstractTokenId: null,
            isDeployed: false,
            hasRelations: true,
          },
        ],
        relations: [{ ...supported, isConflict: false }],
      })
      expect(getTokens).toHaveBeenCalledWith([
        { chain: 'ethereum', address: '0xaaa' },
        { chain: 'base', address: '0xbbb' },
      ])
    })

    it('appends assigned tokens without relations when their abstract token has endpoints', async () => {
      const relation = tokenRelationRoute({
        tokenAChain: 'base',
        tokenAAddress: '0xbbb',
        tokenBChain: 'ethereum',
        tokenBAddress: '0xaaa',
        plugin: 'test-plugin',
      })
      const endpointTokens = [
        deployedToken({
          chain: 'base',
          address: '0xbbb',
          symbol: 'USDC',
          abstractTokenId: 'USDC',
        }),
        deployedToken({
          chain: 'ethereum',
          address: '0xaaa',
          symbol: 'USDC',
          abstractTokenId: 'USDC',
        }),
      ]
      const withoutRelations = deployedToken({
        chain: 'arbitrum',
        address: '0xddd',
        symbol: 'USDC.e',
        abstractTokenId: 'USDC',
      })
      const mockTokenDb = {
        tokenRelation: {
          getAllRoutes: vi.fn().mockResolvedValue([relation]),
        } as unknown as TokenDatabase['tokenRelation'],
        deployedToken: {
          getByPrimaryKeys: vi.fn().mockResolvedValue(endpointTokens),
          getAll: vi.fn().mockResolvedValue([
            ...endpointTokens,
            withoutRelations,
            // A different abstract token with no endpoints — nowhere to go.
            deployedToken({
              chain: 'polygon',
              address: '0xeee',
              symbol: 'DAI',
              abstractTokenId: 'DAI',
            }),
            // Ignored tokens stay hidden even when assigned.
            deployedToken({
              chain: 'optimism',
              address: '0xfff',
              symbol: 'USDC',
              abstractTokenId: 'USDC',
              ignored: true,
            }),
            // Assignment missing — nothing says where it belongs.
            deployedToken({
              chain: 'linea',
              address: '0x999',
              symbol: 'USDC',
            }),
          ]),
        } as unknown as TokenDatabase['deployedToken'],
      } as unknown as TokenDatabase

      const caller = createRouter(
        mockTokenDb,
        {} as unknown as Database,
        {} as unknown as CoingeckoClient,
      )

      expect(await caller.getRelationsGraph()).toEqual({
        nodes: [
          {
            id: 'base:0xbbb',
            chain: 'base',
            address: '0xbbb',
            symbol: 'USDC',
            abstractTokenId: 'USDC',
            isDeployed: true,
            hasRelations: true,
          },
          {
            id: 'ethereum:0xaaa',
            chain: 'ethereum',
            address: '0xaaa',
            symbol: 'USDC',
            abstractTokenId: 'USDC',
            isDeployed: true,
            hasRelations: true,
          },
          {
            id: 'arbitrum:0xddd',
            chain: 'arbitrum',
            address: '0xddd',
            symbol: 'USDC.e',
            abstractTokenId: 'USDC',
            isDeployed: true,
            hasRelations: false,
          },
        ],
        relations: [{ ...relation, isConflict: false }],
      })
    })
  })

  describe('checks', () => {
    it('returns already-exists error when token already exists', async () => {
      const existingToken = {
        id: 1,
        chain: 'ethereum',
        address: '0x123',
      }
      const mockTokenDb = {
        deployedToken: {
          findByChainAndAddress: vi.fn().mockResolvedValue(existingToken),
        } as unknown as TokenDatabase['deployedToken'],
      } as unknown as TokenDatabase
      const mockDb = {} as unknown as Database
      const mockCoingeckoClient = {} as unknown as CoingeckoClient

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.checks({
        chain: 'ethereum',
        address: '0x123',
      })

      expect(result).toEqual({
        error: {
          type: 'already-exists',
          message:
            'Deployed token with given address and chain already exists.',
        },
        data: undefined,
        warnings: [],
      })
    })

    it('returns undefined error and data when address does not start with 0x', async () => {
      const mockTokenDb = {
        deployedToken: {
          findByChainAndAddress: vi.fn().mockResolvedValue(undefined),
        } as unknown as TokenDatabase['deployedToken'],
      } as unknown as TokenDatabase
      const mockDb = {} as unknown as Database
      const mockCoingeckoClient = {} as unknown as CoingeckoClient

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.checks({
        chain: 'ethereum',
        address: 'invalid-address',
      })

      expect(result).toEqual({
        error: undefined,
        data: undefined,
        warnings: [],
      })
    })

    it('returns chain-not-found error when chain does not exist', async () => {
      const mockTokenDb = {
        deployedToken: {
          findByChainAndAddress: vi.fn().mockResolvedValue(undefined),
        } as unknown as TokenDatabase['deployedToken'],
        chain: {
          findByName: vi.fn().mockResolvedValue(undefined),
        } as unknown as TokenDatabase['chain'],
      } as unknown as TokenDatabase
      const mockDb = {} as unknown as Database
      const mockCoingeckoClient = {} as unknown as CoingeckoClient

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.checks({
        chain: 'nonexistent',
        address: '0x123',
      })

      expect(result).toEqual({
        error: {
          type: 'chain-not-found',
          message: 'Chain not found.',
        },
        data: undefined,
        warnings: [],
      })
    })

    it('returns not-a-token error when address has no contract code', async () => {
      const chainRecord = {
        id: 1,
        name: 'monad',
        chainId: 143,
        aliases: [],
        apis: [],
      }
      const mockGetCode = vi.fn().mockResolvedValue('0x')
      const mockCreateChain = vi.fn().mockReturnValue({
        rpc: {
          getCode: mockGetCode,
        },
      })
      const mockDb = {} as unknown as Database
      const mockGetCoinList = vi.fn().mockResolvedValue([])
      const mockTokenDb = {
        deployedToken: {
          findByChainAndAddress: vi.fn().mockResolvedValue(undefined),
        } as unknown as TokenDatabase['deployedToken'],
        chain: {
          findByName: vi.fn().mockResolvedValue(chainRecord),
        } as unknown as TokenDatabase['chain'],
      } as unknown as TokenDatabase
      const mockCoingeckoClient = {
        getCoinList: mockGetCoinList,
      } as unknown as CoingeckoClient

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient, {
        createChain: mockCreateChain,
      })
      const result = await caller.checks({
        chain: 'monad',
        address: '0x6fe981dbd557f81ff66836af0932cba535cbc343',
      })

      expect(result).toEqual({
        error: {
          type: 'not-a-token',
          message:
            'Address does not point to a deployed contract on this chain, so it cannot be a token.',
        },
        data: undefined,
        warnings: [],
      })
      expect(mockGetCode).toHaveBeenCalledWith(
        '0x6fe981dbd557f81ff66836af0932cba535cbc343',
        'latest',
      )
      expect(mockGetCoinList).toHaveBeenCalledTimes(0)
    })

    it('includes rpc symbol and decimals in success response when available', async () => {
      const chainRecord = {
        id: 1,
        name: 'ethereum',
        chainId: 1,
        aliases: [],
        apis: [],
      }
      const mockGetDecimals = vi.fn().mockResolvedValue(18)
      const mockGetSymbol = vi.fn().mockResolvedValue('RPC-TKN')
      const mockCreateChain = vi.fn().mockReturnValue({
        rpc: {
          getDecimals: mockGetDecimals,
          getSymbol: mockGetSymbol,
        },
      })
      const mockDb = {} as unknown as Database
      const mockTokenDb = {
        deployedToken: {
          findByChainAndAddress: vi.fn().mockResolvedValue(undefined),
          getByChainsAndAddresses: vi.fn().mockResolvedValue([]),
        } as unknown as TokenDatabase['deployedToken'],
        chain: {
          findByName: vi.fn().mockResolvedValue(chainRecord),
          getAll: vi.fn().mockResolvedValue([chainRecord]),
        } as unknown as TokenDatabase['chain'],
        abstractToken: {
          findByCoingeckoId: vi.fn().mockResolvedValue(undefined),
        } as unknown as TokenDatabase['abstractToken'],
      } as unknown as TokenDatabase
      const mockCoingeckoClient = {
        getCoinList: vi.fn().mockResolvedValue([
          {
            id: 'token-id',
            name: 'Token',
            symbol: 'TKN',
            platforms: {
              ethereum: '0x123',
            },
          },
        ]),
      } as unknown as CoingeckoClient

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient, {
        createChain: mockCreateChain,
      })
      const result = await caller.checks({
        chain: 'ethereum',
        address: '0x123',
      })

      expect(result.error).toEqual(undefined)
      expect(result.data).toEqual({
        symbol: 'RPC-TKN',
        symbolSource: 'rpc',
        suggestions: [],
        decimals: 18,
        deploymentTimestamp: undefined,
        abstractTokenId: undefined,
        coingeckoId: 'token-id',
        abstractTokenSuggestions: [],
      })
      expect(mockCreateChain).toHaveBeenCalledWith(chainRecord)
      expect(mockGetDecimals).toHaveBeenCalledWith('0x123')
      expect(mockGetSymbol).toHaveBeenCalledWith('0x123')
    })

    it('includes deployment timestamp when etherscan returns contract creation', async () => {
      const chainRecord = {
        id: 1,
        name: 'ethereum',
        chainId: 1,
        aliases: [],
        apis: [],
      }
      const deploymentTimestamp = 1234567890
      const mockCreateChain = vi.fn().mockReturnValue({
        rpc: {
          getDecimals: vi.fn().mockResolvedValue(18),
          getSymbol: vi.fn().mockResolvedValue('TKN'),
        },
        etherscan: {
          getContractCreation: vi
            .fn()
            .mockResolvedValue([{ timestamp: deploymentTimestamp }]),
        },
      })
      const mockDb = {} as unknown as Database
      const mockTokenDb = {
        deployedToken: {
          findByChainAndAddress: vi.fn().mockResolvedValue(undefined),
          getByChainsAndAddresses: vi.fn().mockResolvedValue([]),
        } as unknown as TokenDatabase['deployedToken'],
        chain: {
          findByName: vi.fn().mockResolvedValue(chainRecord),
          getAll: vi.fn().mockResolvedValue([chainRecord]),
        } as unknown as TokenDatabase['chain'],
        abstractToken: {
          findByCoingeckoId: vi.fn().mockResolvedValue(undefined),
        } as unknown as TokenDatabase['abstractToken'],
      } as unknown as TokenDatabase
      const mockCoingeckoClient = {
        getCoinList: vi.fn().mockResolvedValue([
          {
            id: 'token-id',
            name: 'Token',
            symbol: 'TKN',
            platforms: {
              ethereum: '0x123',
            },
          },
        ]),
      } as unknown as CoingeckoClient

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient, {
        createChain: mockCreateChain,
      })
      const result = await caller.checks({
        chain: 'ethereum',
        address: '0x123',
      })

      expect(result.error).toEqual(undefined)
      expect(result.data).toEqual({
        symbol: 'TKN',
        symbolSource: 'rpc',
        suggestions: [],
        decimals: 18,
        deploymentTimestamp,
        abstractTokenId: undefined,
        coingeckoId: 'token-id',
        abstractTokenSuggestions: [],
      })
    })

    it('falls back to rpc when no block explorer is configured', async () => {
      const chainRecord = {
        id: 1,
        name: 'ethereum',
        chainId: 1,
        aliases: [],
        apis: [],
      }
      const deploymentTimestamp = 1700000000
      const mockCreateChain = vi.fn().mockReturnValue({
        rpc: {
          getDecimals: vi.fn().mockResolvedValue(18),
          getSymbol: vi.fn().mockResolvedValue('TKN'),
          getBlockNumber: vi.fn().mockResolvedValue(100),
          getCode: vi
            .fn()
            .mockImplementation(async (_: string, block: 'latest' | number) =>
              block === 'latest' || block >= 50 ? '0xdead' : '0x',
            ),
          getBlockTimestamp: vi.fn().mockResolvedValue(deploymentTimestamp),
        },
      })
      const mockDb = {} as unknown as Database
      const mockTokenDb = {
        deployedToken: {
          findByChainAndAddress: vi.fn().mockResolvedValue(undefined),
          getByChainsAndAddresses: vi.fn().mockResolvedValue([]),
        } as unknown as TokenDatabase['deployedToken'],
        chain: {
          findByName: vi.fn().mockResolvedValue(chainRecord),
          getAll: vi.fn().mockResolvedValue([chainRecord]),
        } as unknown as TokenDatabase['chain'],
        abstractToken: {
          findByCoingeckoId: vi.fn().mockResolvedValue(undefined),
        } as unknown as TokenDatabase['abstractToken'],
      } as unknown as TokenDatabase
      const mockCoingeckoClient = {
        getCoinList: vi.fn().mockResolvedValue([
          {
            id: 'token-id',
            name: 'Token',
            symbol: 'TKN',
            platforms: { ethereum: '0x123' },
          },
        ]),
      } as unknown as CoingeckoClient

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient, {
        createChain: mockCreateChain,
      })
      const result = await caller.checks({
        chain: 'ethereum',
        address: '0x123',
      })

      expect(result.data?.deploymentTimestamp).toEqual(deploymentTimestamp)
    })

    it('falls back to rpc when etherscan and blockscout throw', async () => {
      const chainRecord = {
        id: 1,
        name: 'ethereum',
        chainId: 1,
        aliases: [],
        apis: [],
      }
      const deploymentTimestamp = 1700000001
      const mockCreateChain = vi.fn().mockReturnValue({
        rpc: {
          getDecimals: vi.fn().mockResolvedValue(18),
          getSymbol: vi.fn().mockResolvedValue('TKN'),
          getBlockNumber: vi.fn().mockResolvedValue(100),
          getCode: vi
            .fn()
            .mockImplementation(async (_: string, block: 'latest' | number) =>
              block === 'latest' || block >= 50 ? '0xdead' : '0x',
            ),
          getBlockTimestamp: vi.fn().mockResolvedValue(deploymentTimestamp),
        },
        etherscan: {
          getContractCreation: vi
            .fn()
            .mockRejectedValue(new Error('etherscan 500')),
        },
        blockscout: {
          getContractCreation: vi
            .fn()
            .mockRejectedValue(new Error('blockscout 500')),
        },
      })
      const mockDb = {} as unknown as Database
      const mockTokenDb = {
        deployedToken: {
          findByChainAndAddress: vi.fn().mockResolvedValue(undefined),
          getByChainsAndAddresses: vi.fn().mockResolvedValue([]),
        } as unknown as TokenDatabase['deployedToken'],
        chain: {
          findByName: vi.fn().mockResolvedValue(chainRecord),
          getAll: vi.fn().mockResolvedValue([chainRecord]),
        } as unknown as TokenDatabase['chain'],
        abstractToken: {
          findByCoingeckoId: vi.fn().mockResolvedValue(undefined),
        } as unknown as TokenDatabase['abstractToken'],
      } as unknown as TokenDatabase
      const mockCoingeckoClient = {
        getCoinList: vi.fn().mockResolvedValue([
          {
            id: 'token-id',
            name: 'Token',
            symbol: 'TKN',
            platforms: { ethereum: '0x123' },
          },
        ]),
      } as unknown as CoingeckoClient

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient, {
        createChain: mockCreateChain,
      })
      const result = await caller.checks({
        chain: 'ethereum',
        address: '0x123',
      })

      expect(result.data?.deploymentTimestamp).toEqual(deploymentTimestamp)
    })

    it('includes rpc symbol and decimals in not-found-on-coingecko response', async () => {
      const chainRecord = {
        id: 1,
        name: 'ethereum',
        chainId: 1,
        aliases: [],
        apis: [],
      }
      const mockGetDecimals = vi.fn().mockResolvedValue(6)
      const mockGetSymbol = vi.fn().mockResolvedValue('USDC-RPC')
      const mockCreateChain = vi.fn().mockReturnValue({
        rpc: {
          getDecimals: mockGetDecimals,
          getSymbol: mockGetSymbol,
        },
      })
      const mockDb = {} as unknown as Database
      const mockTokenDb = {
        deployedToken: {
          findByChainAndAddress: vi.fn().mockResolvedValue(undefined),
        } as unknown as TokenDatabase['deployedToken'],
        chain: {
          findByName: vi.fn().mockResolvedValue(chainRecord),
          getAll: vi.fn().mockResolvedValue([chainRecord]),
        } as unknown as TokenDatabase['chain'],
        abstractToken: {
          getAll: vi.fn().mockResolvedValue([]),
        } as unknown as TokenDatabase['abstractToken'],
      } as unknown as TokenDatabase
      const mockCoingeckoClient = {
        getCoinList: vi.fn().mockResolvedValue([]),
      } as unknown as CoingeckoClient

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient, {
        createChain: mockCreateChain,
      })
      const result = await caller.checks({
        chain: 'ethereum',
        address: '0x123',
      })

      expect(result.error).toEqual({
        type: 'not-found-on-coingecko',
        message: 'Coin not found on Coingecko.',
      })
      expect(result.data).toEqual({
        symbol: 'USDC-RPC',
        symbolSource: 'rpc',
        suggestions: undefined,
        decimals: 6,
        deploymentTimestamp: undefined,
        abstractTokenId: undefined,
        coingeckoId: undefined,
        abstractTokenSuggestions: [],
      })
      expect(mockCreateChain).toHaveBeenCalledWith(chainRecord)
      expect(mockGetDecimals).toHaveBeenCalledWith('0x123')
      expect(mockGetSymbol).toHaveBeenCalledWith('0x123')
    })

    it('returns not-found-on-coingecko error when coin is not found', async () => {
      const chainRecord = {
        id: 1,
        name: 'ethereum',
        chainId: 1,
        aliases: [],
        apis: [],
      }
      const mockDb = {} as unknown as Database
      const mockTokenDb = {
        deployedToken: {
          findByChainAndAddress: vi.fn().mockResolvedValue(undefined),
        } as unknown as TokenDatabase['deployedToken'],
        chain: {
          findByName: vi.fn().mockResolvedValue(chainRecord),
          getAll: vi.fn().mockResolvedValue([
            {
              id: 1,
              name: 'ethereum',
              chainId: 1,
              aliases: [],
              apis: [],
            },
          ]),
        } as unknown as TokenDatabase['chain'],
      } as unknown as TokenDatabase
      const mockCoingeckoClient = {
        getCoinList: vi.fn().mockResolvedValue([]),
      } as unknown as CoingeckoClient

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.checks({
        chain: 'ethereum',
        address: '0x123',
      })

      expect(result.error).toEqual({
        type: 'not-found-on-coingecko',
        message: 'Coin not found on Coingecko.',
      })
      expect(result.data).toEqual({
        symbol: undefined,
        symbolSource: undefined,
        suggestions: undefined,
        decimals: undefined,
        deploymentTimestamp: undefined,
        abstractTokenId: undefined,
        coingeckoId: undefined,
        abstractTokenSuggestions: [],
      })
    })

    it('suggests abstract tokens from partial transfers for the checked deployed token', async () => {
      const chainRecord = {
        id: 1,
        name: 'ethereum',
        chainId: 1,
        aliases: [],
        apis: [],
      }
      const targetAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
      const mockGetWithPartialAbstractTokenIds = vi.fn().mockResolvedValue([
        {
          plugin: 'test-plugin',
          bridgeType: undefined,
          transferId: 'transfer-1',
          type: 'transfer',
          duration: 10,
          timestamp: 1000,
          srcTime: 1000,
          srcChain: 'ethereum',
          srcTxHash: '0xsrc',
          srcLogIndex: 0,
          srcEventId: 'src-event',
          srcTokenAddress:
            '0x000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          srcRawAmount: undefined,
          srcWasBurned: false,
          srcAbstractTokenId: undefined,
          srcSymbol: undefined,
          srcAmount: undefined,
          srcPrice: undefined,
          srcValueUsd: undefined,
          dstTime: 1000,
          dstChain: 'arbitrum',
          dstTxHash: '0xdst',
          dstLogIndex: 0,
          dstEventId: 'dst-event',
          dstTokenAddress:
            '0x000000000000000000000000af88d065e77c8cc2239327c5edb3a432268e5831',
          dstRawAmount: undefined,
          dstWasMinted: true,
          dstAbstractTokenId: 'abstract-usdc',
          dstSymbol: undefined,
          dstAmount: undefined,
          dstPrice: undefined,
          dstValueUsd: undefined,
          isProcessed: false,
        } satisfies InteropTransferRecord,
      ])
      const mockDb = {
        interopTransfer: {
          getWithPartialAbstractTokenIdsForToken:
            mockGetWithPartialAbstractTokenIds,
        } as unknown as Database['interopTransfer'],
      } as unknown as Database
      const mockTokenDb = {
        deployedToken: {
          findByChainAndAddress: vi.fn().mockResolvedValue(undefined),
        } as unknown as TokenDatabase['deployedToken'],
        chain: {
          findByName: vi.fn().mockResolvedValue(chainRecord),
          getAll: vi.fn().mockResolvedValue([
            chainRecord,
            {
              id: 2,
              name: 'arbitrum',
              chainId: 42161,
              aliases: [],
              apis: [],
            },
          ]),
        } as unknown as TokenDatabase['chain'],
        abstractToken: {
          getAll: vi.fn().mockResolvedValue([
            {
              id: 'abstract-usdc',
              symbol: 'USDC',
              issuer: 'circle',
              category: 'stablecoin',
              iconUrl: null,
              coingeckoId: 'usd-coin',
              coingeckoListingTimestamp: null,
              additionalCoingeckoEntries: null,
              comment: null,
              reviewed: true,
              isPriceUnreliable: false,
            },
          ]),
        } as unknown as TokenDatabase['abstractToken'],
      } as unknown as TokenDatabase
      const mockCoingeckoClient = {
        getCoinList: vi.fn().mockResolvedValue([]),
      } as unknown as CoingeckoClient

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.checks({
        chain: 'ethereum',
        address: targetAddress,
      })

      expect(result.data?.abstractTokenSuggestions).toEqual([
        {
          id: 'abstract-usdc',
          symbol: 'USDC',
          issuer: 'circle',
        },
      ])
      expect(mockGetWithPartialAbstractTokenIds).toHaveBeenCalledWith({
        chain: 'ethereum',
        address: Address32.from(targetAddress),
      })
    })

    it('does not suggest abstract tokens from symbol matches when no transfer suggestions exist', async () => {
      const chainRecord = {
        id: 1,
        name: 'ethereum',
        chainId: 1,
        aliases: [],
        apis: [],
      }
      const mockGetAll = vi.fn().mockResolvedValue([
        {
          id: 'abc123',
          symbol: 'USDC',
          issuer: 'circle',
          category: 'stablecoin',
          iconUrl: null,
          coingeckoId: 'usd-coin',
          coingeckoListingTimestamp: null,
          additionalCoingeckoEntries: null,
          comment: null,
          reviewed: true,
          isPriceUnreliable: false,
        },
      ])
      const mockCreateChain = vi.fn().mockReturnValue({
        rpc: {
          getDecimals: vi.fn().mockResolvedValue(18),
          getSymbol: vi.fn().mockResolvedValue('USDC'),
        },
      })
      const mockDb = {} as unknown as Database
      const mockTokenDb = {
        deployedToken: {
          findByChainAndAddress: vi.fn().mockResolvedValue(undefined),
        } as unknown as TokenDatabase['deployedToken'],
        chain: {
          findByName: vi.fn().mockResolvedValue(chainRecord),
          getAll: vi.fn().mockResolvedValue([chainRecord]),
        } as unknown as TokenDatabase['chain'],
        abstractToken: {
          getAll: mockGetAll,
        } as unknown as TokenDatabase['abstractToken'],
      } as unknown as TokenDatabase
      const mockCoingeckoClient = {
        getCoinList: vi.fn().mockResolvedValue([]),
      } as unknown as CoingeckoClient

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient, {
        createChain: mockCreateChain,
      })
      const result = await caller.checks({
        chain: 'ethereum',
        address: '0x123',
      })

      expect(result.data?.abstractTokenSuggestions).toEqual([])
      expect(mockGetAll).toHaveBeenCalledTimes(0)
    })

    it('does not suggest abstract tokens when no symbol is available', async () => {
      const chainRecord = {
        id: 1,
        name: 'ethereum',
        chainId: 1,
        aliases: [],
        apis: [],
      }
      const mockGetAll = vi.fn().mockResolvedValue([])
      const mockDb = {} as unknown as Database
      const mockTokenDb = {
        deployedToken: {
          findByChainAndAddress: vi.fn().mockResolvedValue(undefined),
        } as unknown as TokenDatabase['deployedToken'],
        chain: {
          findByName: vi.fn().mockResolvedValue(chainRecord),
          getAll: vi.fn().mockResolvedValue([chainRecord]),
        } as unknown as TokenDatabase['chain'],
        abstractToken: {
          getAll: mockGetAll,
        } as unknown as TokenDatabase['abstractToken'],
      } as unknown as TokenDatabase
      const mockCoingeckoClient = {
        getCoinList: vi.fn().mockResolvedValue([]),
      } as unknown as CoingeckoClient

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.checks({
        chain: 'ethereum',
        address: '0x123',
      })

      expect(result.data?.abstractTokenSuggestions).toEqual([])
      expect(mockGetAll).toHaveBeenCalledTimes(0)
    })

    it('suggests abstract tokens from partial transfers when coingecko coin exists but abstract token is missing', async () => {
      const chainRecord = {
        id: 1,
        name: 'ethereum',
        chainId: 1,
        aliases: [],
        apis: [],
      }
      const targetAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
      const mockDb = {
        interopTransfer: {
          getWithPartialAbstractTokenIdsForToken: vi.fn().mockResolvedValue([
            {
              plugin: 'test-plugin',
              bridgeType: undefined,
              transferId: 'transfer-1',
              type: 'transfer',
              duration: 10,
              timestamp: 1000,
              srcTime: 1000,
              srcChain: 'ethereum',
              srcTxHash: '0xsrc',
              srcLogIndex: 0,
              srcEventId: 'src-event',
              srcTokenAddress:
                '0x000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
              srcRawAmount: undefined,
              srcWasBurned: false,
              srcAbstractTokenId: undefined,
              srcSymbol: undefined,
              srcAmount: undefined,
              srcPrice: undefined,
              srcValueUsd: undefined,
              dstTime: 1000,
              dstChain: 'arbitrum',
              dstTxHash: '0xdst',
              dstLogIndex: 0,
              dstEventId: 'dst-event',
              dstTokenAddress:
                '0x000000000000000000000000af88d065e77c8cc2239327c5edb3a432268e5831',
              dstRawAmount: undefined,
              dstWasMinted: true,
              dstAbstractTokenId: 'abstract-usdc',
              dstSymbol: undefined,
              dstAmount: undefined,
              dstPrice: undefined,
              dstValueUsd: undefined,
              isProcessed: false,
            } satisfies InteropTransferRecord,
          ]),
        } as unknown as Database['interopTransfer'],
      } as unknown as Database
      const mockTokenDb = {
        deployedToken: {
          findByChainAndAddress: vi.fn().mockResolvedValue(undefined),
          getByChainsAndAddresses: vi.fn().mockResolvedValue([]),
        } as unknown as TokenDatabase['deployedToken'],
        chain: {
          findByName: vi.fn().mockResolvedValue(chainRecord),
          getAll: vi.fn().mockResolvedValue([chainRecord]),
        } as unknown as TokenDatabase['chain'],
        abstractToken: {
          findByCoingeckoId: vi.fn().mockResolvedValue(undefined),
          getAll: vi.fn().mockResolvedValue([
            {
              id: 'abstract-usdc',
              symbol: 'USDC',
              issuer: 'circle',
              category: 'stablecoin',
              iconUrl: null,
              coingeckoId: 'usd-coin',
              coingeckoListingTimestamp: null,
              additionalCoingeckoEntries: null,
              comment: null,
              reviewed: true,
              isPriceUnreliable: false,
            },
          ]),
        } as unknown as TokenDatabase['abstractToken'],
      } as unknown as TokenDatabase
      const mockCoingeckoClient = {
        getCoinList: vi.fn().mockResolvedValue([
          {
            id: 'usd-coin',
            symbol: 'USDC',
            name: 'USD Coin',
            platforms: {
              ethereum: targetAddress,
            },
          },
        ]),
      } as unknown as CoingeckoClient

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.checks({
        chain: 'ethereum',
        address: targetAddress,
      })

      expect(result.error).toEqual(undefined)
      expect(result.data?.abstractTokenSuggestions).toEqual([
        {
          id: 'abstract-usdc',
          symbol: 'USDC',
          issuer: 'circle',
        },
      ])
    })

    it('returns success with token data when all checks pass', async () => {
      const chainRecord = {
        id: 1,
        name: 'ethereum',
        chainId: 1,
        aliases: ['eth'],
        apis: [],
      }
      const mockDb = {} as unknown as Database
      const mockTokenDb = {
        deployedToken: {
          findByChainAndAddress: vi.fn().mockResolvedValue(undefined),
          getByChainsAndAddresses: vi.fn().mockResolvedValue([]),
        } as unknown as TokenDatabase['deployedToken'],
        chain: {
          findByName: vi.fn().mockResolvedValue(chainRecord),
          getAll: vi.fn().mockResolvedValue([
            {
              id: 1,
              name: 'ethereum',
              chainId: 1,
              aliases: ['eth'],
              apis: [],
            },
          ]),
        } as unknown as TokenDatabase['chain'],
        abstractToken: {
          findByCoingeckoId: vi.fn().mockResolvedValue({
            id: '1',
            coingeckoId: 'usd-coin',
            symbol: 'USDC',
            name: 'USD Coin',
            issuer: null,
            comment: null,
          }),
        } as unknown as TokenDatabase['abstractToken'],
      } as unknown as TokenDatabase
      const mockCoingeckoClient = {
        getCoinList: vi.fn().mockResolvedValue([
          {
            id: 'usd-coin',
            symbol: 'USDC',
            name: 'USD Coin',
            platforms: {
              ethereum: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
              eth: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            },
          },
        ]),
      } as unknown as CoingeckoClient

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.checks({
        chain: 'ethereum',
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      })

      expect(result.error).toEqual(undefined)
      expect(result.data).toEqual({
        symbol: 'USDC',
        symbolSource: 'coingecko',
        decimals: undefined,
        deploymentTimestamp: undefined,
        abstractTokenId: '1',
        suggestions: [],
        coingeckoId: 'usd-coin',
        abstractTokenSuggestions: [],
      })
    })

    it('returns warnings for missing autofill data on successful checks', async () => {
      const chainRecord = {
        id: 1,
        name: 'ethereum',
        chainId: 1,
        aliases: [],
        apis: [],
      }
      const mockDb = {} as unknown as Database
      const mockTokenDb = {
        deployedToken: {
          findByChainAndAddress: vi.fn().mockResolvedValue(undefined),
          getByChainsAndAddresses: vi.fn().mockResolvedValue([]),
        } as unknown as TokenDatabase['deployedToken'],
        chain: {
          findByName: vi.fn().mockResolvedValue(chainRecord),
          getAll: vi.fn().mockResolvedValue([chainRecord]),
        } as unknown as TokenDatabase['chain'],
        abstractToken: {
          findByCoingeckoId: vi.fn().mockResolvedValue(undefined),
        } as unknown as TokenDatabase['abstractToken'],
      } as unknown as TokenDatabase
      const mockCoingeckoClient = {
        getCoinList: vi.fn().mockResolvedValue([
          {
            id: 'usd-coin',
            symbol: 'USDC',
            name: 'USD Coin',
            platforms: {
              ethereum: '0x123',
            },
          },
        ]),
      } as unknown as CoingeckoClient

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.checks({
        chain: 'ethereum',
        address: '0x123',
      })

      expect(result.error).toEqual(undefined)
      expect(result.data?.symbol).toEqual('USDC')
      expect(result.warnings).toEqual([
        {
          field: 'decimals',
          message:
            'No RPC configured for ethereum, so decimals were not autofilled.',
        },
        {
          field: 'deploymentTimestamp',
          message:
            'No Etherscan, Blockscout, or RPC configured for ethereum. Deployment timestamp was not autofilled.',
        },
        {
          field: 'abstractTokenId',
          message: 'No abstract token found with CoinGecko id usd-coin.',
        },
      ])
    })

    it('handles chain aliases correctly', async () => {
      const chainRecord = {
        id: 1,
        name: 'ethereum',
        chainId: 1,
        aliases: ['eth'],
        apis: [],
      }
      const mockDb = {} as unknown as Database
      const mockTokenDb = {
        deployedToken: {
          findByChainAndAddress: vi.fn().mockResolvedValue(undefined),
          getByChainsAndAddresses: vi.fn().mockResolvedValue([]),
        } as unknown as TokenDatabase['deployedToken'],
        chain: {
          findByName: vi.fn().mockResolvedValue(chainRecord),
          getAll: vi.fn().mockResolvedValue([
            {
              id: 1,
              name: 'ethereum',
              chainId: 1,
              aliases: ['eth'],
              apis: [],
            },
          ]),
        } as unknown as TokenDatabase['chain'],
        abstractToken: {
          findByCoingeckoId: vi.fn().mockResolvedValue(undefined),
        } as unknown as TokenDatabase['abstractToken'],
      } as unknown as TokenDatabase
      const mockCoingeckoClient = {
        getCoinList: vi.fn().mockResolvedValue([
          {
            id: 'usd-coin',
            symbol: 'USDC',
            name: 'USD Coin',
            platforms: {
              eth: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            },
          },
        ]),
      } as unknown as CoingeckoClient

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.checks({
        chain: 'ethereum',
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      })

      expect(result.error).toEqual(undefined)
      expect(result.data?.symbol).toEqual('USDC')
    })

    it('returns otherChains information', async () => {
      const chainRecord = {
        id: 1,
        name: 'ethereum',
        chainId: 1,
        aliases: ['eth'],
        apis: [],
      }
      // Arbitrum is the only chain this token is already deployed on; every
      // other lookup misses.
      const arbitrumUsdc = {
        chain: 'arbitrum',
        address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
        symbol: 'USDC',
        decimals: 6,
        comment: null,
        ignored: false,
        abstractTokenId: null,
        deploymentTimestamp: 0,
        metadata: null,
      } satisfies DeployedTokenRecord
      const mockDb = {} as unknown as Database
      const mockTokenDb = {
        deployedToken: {
          findByChainAndAddress: vi.fn(async (pk) =>
            pk.chain === arbitrumUsdc.chain &&
            pk.address === arbitrumUsdc.address
              ? arbitrumUsdc
              : undefined,
          ),
          getByChainsAndAddresses: vi.fn().mockResolvedValue([]),
        } as unknown as TokenDatabase['deployedToken'],
        chain: {
          findByName: vi.fn().mockResolvedValue(chainRecord),
          getAll: vi.fn().mockResolvedValue([
            {
              id: 1,
              name: 'ethereum',
              chainId: 1,
              aliases: ['eth'],
              apis: [],
            },
            {
              id: 2,
              name: 'arbitrum',
              chainId: 42161,
              aliases: ['arb'],
              apis: [],
            },
          ]),
        } as unknown as TokenDatabase['chain'],
        abstractToken: {
          findByCoingeckoId: vi.fn().mockResolvedValue(undefined),
        } as unknown as TokenDatabase['abstractToken'],
      } as unknown as TokenDatabase
      const mockCoingeckoClient = {
        getCoinList: vi.fn().mockResolvedValue([
          {
            id: 'usd-coin',
            symbol: 'USDC',
            name: 'USD Coin',
            platforms: {
              eth: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
              arb: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
            },
          },
        ]),
      } as unknown as CoingeckoClient

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.checks({
        chain: 'ethereum',
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      })

      expect(result.error).toEqual(undefined)
      expect(result.data?.suggestions).toEqual([
        {
          chain: 'arbitrum',
          address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
        },
      ])
    })

    it('handles case-insensitive address matching', async () => {
      const chainRecord = {
        id: 1,
        name: 'ethereum',
        chainId: 1,
        aliases: ['eth'],
        apis: [],
      }
      const mockDb = {} as unknown as Database
      const mockTokenDb = {
        deployedToken: {
          findByChainAndAddress: vi.fn().mockResolvedValue(undefined),
          getByChainsAndAddresses: vi.fn().mockResolvedValue([]),
        } as unknown as TokenDatabase['deployedToken'],
        chain: {
          findByName: vi.fn().mockResolvedValue(chainRecord),
          getAll: vi.fn().mockResolvedValue([
            {
              id: 1,
              name: 'ethereum',
              chainId: 1,
              aliases: ['eth'],
              apis: [],
            },
          ]),
        } as unknown as TokenDatabase['chain'],
        abstractToken: {
          findByCoingeckoId: vi.fn().mockResolvedValue(undefined),
        } as unknown as TokenDatabase['abstractToken'],
      } as unknown as TokenDatabase
      const mockCoingeckoClient = {
        getCoinList: vi.fn().mockResolvedValue([
          {
            id: 'usd-coin',
            symbol: 'USDC',
            name: 'USD Coin',
            platforms: {
              eth: '0xA0B86991C6218B36C1D19D4A2E9EB0CE3606EB48',
            },
          },
        ]),
      } as unknown as CoingeckoClient

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.checks({
        chain: 'ethereum',
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      })

      expect(result.error).toEqual(undefined)
      expect(result.data?.symbol).toEqual('USDC')
    })
  })

  describe('getSuggestionsByCoingeckoId', () => {
    it('returns empty array when coin is not found', async () => {
      const mockTokenDb = {} as unknown as TokenDatabase
      const mockCoingeckoClient = {
        getCoinDataById: vi.fn().mockResolvedValue(null),
      } as unknown as CoingeckoClient
      const mockDb = {} as unknown as Database
      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result =
        await caller.getSuggestionsByCoingeckoId('nonexistent-coin')

      expect(result).toEqual([])
    })

    it('returns suggestions for platforms that do not have deployed tokens', async () => {
      const chains = [
        {
          id: 1,
          name: 'ethereum',
          chainId: 1,
          aliases: ['eth'],
          apis: [],
        },
        {
          id: 2,
          name: 'arbitrum',
          chainId: 42161,
          aliases: ['arb'],
          apis: [],
        },
        {
          id: 3,
          name: 'optimism',
          chainId: 10,
          aliases: ['op'],
          apis: [],
        },
      ]
      const deployedTokens = [
        {
          chain: 'ethereum',
          address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          symbol: 'USDC',
          decimals: 6,
          comment: null,
          ignored: false,
          abstractTokenId: null,
          deploymentTimestamp: 0,
        },
      ]
      const mockDb = {} as unknown as Database
      const mockTokenDb = {
        chain: {
          getAll: vi.fn().mockResolvedValue(chains),
        } as unknown as TokenDatabase['chain'],
        deployedToken: {
          getByChainsAndAddresses: vi.fn().mockResolvedValue(deployedTokens),
        } as unknown as TokenDatabase['deployedToken'],
      } as unknown as TokenDatabase
      const mockCoingeckoClient = {
        getCoinDataById: vi.fn().mockResolvedValue({
          id: 'usd-coin',
          image: { large: 'https://example.com/image.png' },
          platforms: {
            eth: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            arb: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
            op: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
          },
        }),
      } as unknown as CoingeckoClient

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.getSuggestionsByCoingeckoId('usd-coin')

      expect(result).toHaveLength(2)
      expect(result).toEqual(
        expect.arrayContaining([
          {
            chain: 'arbitrum',
            address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
            isInterop: true,
          },
          {
            chain: 'optimism',
            address: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
            isInterop: true,
          },
        ]),
      )
    })

    it('returns empty array when all platforms already have deployed tokens', async () => {
      const chains = [
        {
          id: 1,
          name: 'ethereum',
          chainId: 1,
          aliases: ['eth'],
          apis: [],
        },
        {
          id: 2,
          name: 'arbitrum',
          chainId: 42161,
          aliases: ['arb'],
          apis: [],
        },
      ]
      const deployedTokens = [
        {
          chain: 'ethereum',
          address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          symbol: 'USDC',
          decimals: 6,
          comment: null,
          ignored: false,
          abstractTokenId: null,
          deploymentTimestamp: 0,
        },
        {
          chain: 'arbitrum',
          address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
          symbol: 'USDC',
          decimals: 6,
          comment: null,
          ignored: false,
          abstractTokenId: null,
          deploymentTimestamp: 0,
        },
      ]
      const mockDb = {} as unknown as Database
      const mockTokenDb = {
        chain: {
          getAll: vi.fn().mockResolvedValue(chains),
        } as unknown as TokenDatabase['chain'],
        deployedToken: {
          getByChainsAndAddresses: vi.fn().mockResolvedValue(deployedTokens),
        } as unknown as TokenDatabase['deployedToken'],
      } as unknown as TokenDatabase
      const mockCoingeckoClient = {
        getCoinDataById: vi.fn().mockResolvedValue({
          id: 'usd-coin',
          image: { large: 'https://example.com/image.png' },
          platforms: {
            eth: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            arb: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
          },
        }),
      } as unknown as CoingeckoClient

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.getSuggestionsByCoingeckoId('usd-coin')

      expect(result).toEqual([])
    })

    it('filters out platforms with empty address', async () => {
      const chains = [
        {
          id: 1,
          name: 'ethereum',
          chainId: 1,
          aliases: ['eth'],
          apis: [],
        },
      ]
      const mockDb = {} as unknown as Database
      const mockTokenDb = {
        chain: {
          getAll: vi.fn().mockResolvedValue(chains),
        } as unknown as TokenDatabase['chain'],
        deployedToken: {
          getByChainsAndAddresses: vi.fn().mockResolvedValue([]),
        } as unknown as TokenDatabase['deployedToken'],
      } as unknown as TokenDatabase
      const mockCoingeckoClient = {
        getCoinDataById: vi.fn().mockResolvedValue({
          id: 'usd-coin',
          image: { large: 'https://example.com/image.png' },
          platforms: {
            eth: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            polygon: '',
          },
        }),
      } as unknown as CoingeckoClient

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.getSuggestionsByCoingeckoId('usd-coin')

      expect(result).toEqual([
        {
          chain: 'ethereum',
          address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          isInterop: true,
        },
      ])
    })

    it('filters out platforms that do not match any chain', async () => {
      const chains = [
        {
          id: 1,
          name: 'ethereum',
          chainId: 1,
          aliases: ['eth'],
          apis: [],
        },
      ]
      const mockDb = {} as unknown as Database
      const mockTokenDb = {
        chain: {
          getAll: vi.fn().mockResolvedValue(chains),
        } as unknown as TokenDatabase['chain'],
        deployedToken: {
          getByChainsAndAddresses: vi.fn().mockResolvedValue([]),
        } as unknown as TokenDatabase['deployedToken'],
      } as unknown as TokenDatabase
      const mockCoingeckoClient = {
        getCoinDataById: vi.fn().mockResolvedValue({
          id: 'usd-coin',
          image: { large: 'https://example.com/image.png' },
          platforms: {
            eth: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            unknown: '0x1234567890123456789012345678901234567890',
          },
        }),
      } as unknown as CoingeckoClient

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.getSuggestionsByCoingeckoId('usd-coin')

      expect(result).toEqual([
        {
          chain: 'ethereum',
          address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          isInterop: true,
        },
      ])
    })

    it('handles chain aliases correctly', async () => {
      const chains = [
        {
          id: 1,
          name: 'ethereum',
          chainId: 1,
          aliases: ['eth'],
          apis: [],
        },
      ]
      const mockDb = {} as unknown as Database
      const mockTokenDb = {
        chain: {
          getAll: vi.fn().mockResolvedValue(chains),
        } as unknown as TokenDatabase['chain'],
        deployedToken: {
          getByChainsAndAddresses: vi.fn().mockResolvedValue([]),
        } as unknown as TokenDatabase['deployedToken'],
      } as unknown as TokenDatabase
      const mockCoingeckoClient = {
        getCoinDataById: vi.fn().mockResolvedValue({
          id: 'usd-coin',
          image: { large: 'https://example.com/image.png' },
          platforms: {
            eth: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          },
        }),
      } as unknown as CoingeckoClient

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.getSuggestionsByCoingeckoId('usd-coin')

      expect(result).toEqual([
        {
          chain: 'ethereum',
          address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          isInterop: true,
        },
      ])
    })

    it('handles case-insensitive address matching when checking existing tokens', async () => {
      const chains = [
        {
          id: 1,
          name: 'ethereum',
          chainId: 1,
          aliases: ['eth'],
          apis: [],
        },
        {
          id: 2,
          name: 'arbitrum',
          chainId: 42161,
          aliases: ['arb'],
          apis: [],
        },
      ]
      const deployedTokens = [
        {
          chain: 'ethereum',
          address: '0xA0B86991C6218B36C1D19D4A2E9EB0CE3606EB48',
          symbol: 'USDC',
          decimals: 6,
          comment: null,
          ignored: false,
          abstractTokenId: null,
          deploymentTimestamp: 0,
        },
      ]
      const mockDb = {} as unknown as Database
      const mockTokenDb = {
        chain: {
          getAll: vi.fn().mockResolvedValue(chains),
        } as unknown as TokenDatabase['chain'],
        deployedToken: {
          getByChainsAndAddresses: vi.fn().mockResolvedValue(deployedTokens),
        } as unknown as TokenDatabase['deployedToken'],
      } as unknown as TokenDatabase
      const mockCoingeckoClient = {
        getCoinDataById: vi.fn().mockResolvedValue({
          id: 'usd-coin',
          image: { large: 'https://example.com/image.png' },
          platforms: {
            eth: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            arb: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
          },
        }),
      } as unknown as CoingeckoClient

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.getSuggestionsByCoingeckoId('usd-coin')

      expect(result).toEqual([
        {
          chain: 'arbitrum',
          address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
          isInterop: true,
        },
      ])
    })
  })

  describe('getSuggestionsByPartialTransfers', () => {
    const ABSTRACT_USDC: AbstractTokenRecord = {
      id: 'abstract-usdc',
      symbol: 'USDC',
      issuer: null,
      category: 'stablecoin',
      iconUrl: null,
      coingeckoId: 'usd-coin',
      coingeckoListingTimestamp: null,
      additionalCoingeckoEntries: null,
      comment: null,
      reviewed: true,
      isPriceUnreliable: false,
    }

    function makeTransfer(
      overrides: Partial<InteropTransferRecord>,
    ): InteropTransferRecord {
      return {
        plugin: 'test-plugin',
        bridgeType: undefined,
        transferId: 'transfer-1',
        type: 'transfer',
        duration: 10,
        timestamp: 1000,
        srcTime: 1000,
        srcChain: 'ethereum',
        srcTxHash: '0xsrc',
        srcLogIndex: 0,
        srcEventId: 'src-event',
        srcTokenAddress:
          '0x000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        srcRawAmount: undefined,
        srcWasBurned: false,
        srcAbstractTokenId: undefined,
        srcSymbol: undefined,
        srcAmount: undefined,
        srcPrice: undefined,
        srcValueUsd: undefined,
        dstTime: 1000,
        dstChain: 'arbitrum',
        dstTxHash: '0xdst',
        dstLogIndex: 0,
        dstEventId: 'dst-event',
        dstTokenAddress:
          '0x000000000000000000000000af88d065e77c8cc2239327c5edb3a432268e5831',
        dstRawAmount: undefined,
        dstWasMinted: true,
        dstAbstractTokenId: 'abstract-usdc',
        dstSymbol: undefined,
        dstAmount: undefined,
        dstPrice: undefined,
        dstValueUsd: undefined,
        isProcessed: false,
        ...overrides,
      }
    }

    const mockTokenDbForSuggestions = (abstractTokens: AbstractTokenRecord[]) =>
      ({
        abstractToken: {
          getAll: vi.fn().mockResolvedValue(abstractTokens),
        } as unknown as TokenDatabase['abstractToken'],
        deployedToken: {
          getAll: vi.fn().mockResolvedValue([]),
        } as unknown as TokenDatabase['deployedToken'],
        chain: {
          getAll: vi.fn().mockResolvedValue([]),
        } as unknown as TokenDatabase['chain'],
      }) as unknown as TokenDatabase

    it('returns empty array when no partial transfers exist', async () => {
      const mockDb = {
        interopTransfer: {
          getWithPartialAbstractTokenIds: vi.fn().mockResolvedValue([]),
        } as unknown as Database['interopTransfer'],
      } as unknown as Database
      const mockTokenDb = mockTokenDbForSuggestions([])
      const mockCoingeckoClient = {} as unknown as CoingeckoClient

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.getSuggestionsByPartialTransfers()

      expect(result).toEqual([])
    })

    it('returns suggestion for src side when srcAbstractTokenId is missing', async () => {
      const transfer = makeTransfer({
        srcAbstractTokenId: undefined,
        dstAbstractTokenId: 'abstract-usdc',
        srcWasBurned: false,
        dstWasMinted: true,
      })

      const mockDb = {
        interopTransfer: {
          getWithPartialAbstractTokenIds: vi.fn().mockResolvedValue([transfer]),
        } as unknown as Database['interopTransfer'],
      } as unknown as Database
      const mockTokenDb = mockTokenDbForSuggestions([ABSTRACT_USDC])
      const mockCoingeckoClient = {} as unknown as CoingeckoClient

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.getSuggestionsByPartialTransfers()

      expect(result).toEqual([
        {
          chain: 'ethereum',
          address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          explorerUrl: undefined,
          abstractToken: ABSTRACT_USDC,
          txs: [
            {
              srcTxHash: '0xsrc',
              srcChain: 'ethereum',
              srcExplorerUrl: undefined,
              dstTxHash: '0xdst',
              dstChain: 'arbitrum',
              dstExplorerUrl: undefined,
              transferId: 'transfer-1',
              plugin: 'test-plugin',
            },
          ],
        },
      ])
    })

    it('returns suggestion for dst side when dstAbstractTokenId is missing', async () => {
      const transfer = makeTransfer({
        srcAbstractTokenId: 'abstract-usdc',
        srcWasBurned: true,
        dstAbstractTokenId: undefined,
        dstWasMinted: true,
      })

      const mockDb = {
        interopTransfer: {
          getWithPartialAbstractTokenIds: vi.fn().mockResolvedValue([transfer]),
        } as unknown as Database['interopTransfer'],
      } as unknown as Database
      const mockTokenDb = mockTokenDbForSuggestions([ABSTRACT_USDC])
      const mockCoingeckoClient = {} as unknown as CoingeckoClient

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.getSuggestionsByPartialTransfers()

      expect(result).toEqual([
        {
          chain: 'arbitrum',
          address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
          explorerUrl: undefined,
          abstractToken: ABSTRACT_USDC,
          txs: [
            {
              srcTxHash: '0xsrc',
              srcChain: 'ethereum',
              srcExplorerUrl: undefined,
              dstTxHash: '0xdst',
              dstChain: 'arbitrum',
              dstExplorerUrl: undefined,
              transferId: 'transfer-1',
              plugin: 'test-plugin',
            },
          ],
        },
      ])
    })

    it('groups multiple transfers for the same chain/address/abstractTokenId', async () => {
      const transfer1 = makeTransfer({
        transferId: 'transfer-1',
        srcTxHash: '0xsrc1',
        dstTxHash: '0xdst1',
        srcAbstractTokenId: undefined,
        dstAbstractTokenId: 'abstract-usdc',
        srcWasBurned: false,
        dstWasMinted: true,
      })
      const transfer2 = makeTransfer({
        transferId: 'transfer-2',
        srcTxHash: '0xsrc2',
        dstTxHash: '0xdst2',
        srcAbstractTokenId: undefined,
        dstAbstractTokenId: 'abstract-usdc',
        srcWasBurned: false,
        dstWasMinted: true,
      })

      const mockDb = {
        interopTransfer: {
          getWithPartialAbstractTokenIds: vi
            .fn()
            .mockResolvedValue([transfer1, transfer2]),
        } as unknown as Database['interopTransfer'],
      } as unknown as Database
      const mockTokenDb = mockTokenDbForSuggestions([ABSTRACT_USDC])
      const mockCoingeckoClient = {} as unknown as CoingeckoClient

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.getSuggestionsByPartialTransfers()

      expect(result).toEqual([
        {
          chain: 'ethereum',
          address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          explorerUrl: undefined,
          abstractToken: ABSTRACT_USDC,
          txs: [
            {
              srcTxHash: '0xsrc1',
              srcChain: 'ethereum',
              srcExplorerUrl: undefined,
              dstTxHash: '0xdst1',
              dstChain: 'arbitrum',
              dstExplorerUrl: undefined,
              transferId: 'transfer-1',
              plugin: 'test-plugin',
            },
            {
              srcTxHash: '0xsrc2',
              srcChain: 'ethereum',
              srcExplorerUrl: undefined,
              dstTxHash: '0xdst2',
              dstChain: 'arbitrum',
              dstExplorerUrl: undefined,
              transferId: 'transfer-2',
              plugin: 'test-plugin',
            },
          ],
        },
      ])
    })

    it('skips suggestion when abstract token is not found', async () => {
      const transfer = makeTransfer({
        srcAbstractTokenId: undefined,
        dstAbstractTokenId: 'unknown-abstract',
        srcWasBurned: false,
        dstWasMinted: true,
      })

      const mockDb = {
        interopTransfer: {
          getWithPartialAbstractTokenIds: vi.fn().mockResolvedValue([transfer]),
        } as unknown as Database['interopTransfer'],
      } as unknown as Database
      const mockTokenDb = mockTokenDbForSuggestions([ABSTRACT_USDC])
      const mockCoingeckoClient = {} as unknown as CoingeckoClient

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.getSuggestionsByPartialTransfers()

      expect(result).toEqual([])
    })

    it('excludes suggestions for chain/address that already has deployed token', async () => {
      const transfer = makeTransfer({
        srcAbstractTokenId: undefined,
        dstAbstractTokenId: 'abstract-usdc',
        srcWasBurned: false,
        dstWasMinted: true,
      })

      const mockDb = {
        interopTransfer: {
          getWithPartialAbstractTokenIds: vi.fn().mockResolvedValue([transfer]),
        } as unknown as Database['interopTransfer'],
      } as unknown as Database
      const mockTokenDb = {
        abstractToken: {
          getAll: vi.fn().mockResolvedValue([ABSTRACT_USDC]),
        } as unknown as TokenDatabase['abstractToken'],
        deployedToken: {
          getAll: vi.fn().mockResolvedValue([
            {
              chain: 'ethereum',
              address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            } as DeployedTokenRecord,
          ]),
        } as unknown as TokenDatabase['deployedToken'],
        chain: {
          getAll: vi.fn().mockResolvedValue([]),
        } as unknown as TokenDatabase['chain'],
      } as unknown as TokenDatabase
      const mockCoingeckoClient = {} as unknown as CoingeckoClient

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.getSuggestionsByPartialTransfers()

      expect(result).toEqual([])
    })

    it('excludes nonMinting and unknown transfers from suggestions', async () => {
      const nonMintingTransfer = makeTransfer({
        srcAbstractTokenId: undefined,
        dstAbstractTokenId: 'abstract-usdc',
        srcWasBurned: false,
        dstWasMinted: false,
      })

      const mockDb = {
        interopTransfer: {
          getWithPartialAbstractTokenIds: vi
            .fn()
            .mockResolvedValue([nonMintingTransfer]),
        } as unknown as Database['interopTransfer'],
      } as unknown as Database
      const mockTokenDb = mockTokenDbForSuggestions([ABSTRACT_USDC])
      const mockCoingeckoClient = {} as unknown as CoingeckoClient

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.getSuggestionsByPartialTransfers()

      expect(result).toEqual([])
    })

    it('returns suggestions from both lockAndMint and burnAndMint transfers', async () => {
      const lockAndMintTransfer = makeTransfer({
        transferId: 'lock-mint-1',
        srcTxHash: '0xsrcLM',
        dstTxHash: '0xdstLM',
        srcAbstractTokenId: undefined,
        dstAbstractTokenId: 'abstract-usdc',
        srcWasBurned: false,
        dstWasMinted: true,
      })
      const burnAndMintTransfer = makeTransfer({
        transferId: 'burn-mint-1',
        srcTxHash: '0xsrcBM',
        dstTxHash: '0xdstBM',
        srcChain: 'optimism',
        srcTokenAddress:
          '0x0000000000000000000000000b2c639c533813f4aa9d7837caf62653d097ff85',
        srcAbstractTokenId: undefined,
        dstAbstractTokenId: 'abstract-usdc',
        srcWasBurned: true,
        dstWasMinted: true,
      })

      const mockDb = {
        interopTransfer: {
          getWithPartialAbstractTokenIds: vi
            .fn()
            .mockResolvedValue([lockAndMintTransfer, burnAndMintTransfer]),
        } as unknown as Database['interopTransfer'],
      } as unknown as Database
      const mockTokenDb = mockTokenDbForSuggestions([ABSTRACT_USDC])
      const mockCoingeckoClient = {} as unknown as CoingeckoClient

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.getSuggestionsByPartialTransfers()

      expect(result).toEqual([
        {
          chain: 'ethereum',
          address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          explorerUrl: undefined,
          abstractToken: ABSTRACT_USDC,
          txs: [
            {
              srcTxHash: '0xsrcLM',
              srcChain: 'ethereum',
              srcExplorerUrl: undefined,
              dstTxHash: '0xdstLM',
              dstChain: 'arbitrum',
              dstExplorerUrl: undefined,
              transferId: 'lock-mint-1',
              plugin: 'test-plugin',
            },
          ],
        },
        {
          chain: 'optimism',
          address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
          explorerUrl: undefined,
          abstractToken: ABSTRACT_USDC,
          txs: [
            {
              srcTxHash: '0xsrcBM',
              srcChain: 'optimism',
              srcExplorerUrl: undefined,
              dstTxHash: '0xdstBM',
              dstChain: 'arbitrum',
              dstExplorerUrl: undefined,
              transferId: 'burn-mint-1',
              plugin: 'test-plugin',
            },
          ],
        },
      ])
    })
  })

  describe('getCoingeckoSuggestions', () => {
    it('returns a flat list of suggestions, skipping missing coins and deployed tokens', async () => {
      const usdc = {
        id: 'abstract-usdc',
        symbol: 'USDC',
        issuer: 'circle',
        category: 'stablecoin' as const,
        iconUrl: null,
        coingeckoId: 'usd-coin',
        coingeckoListingTimestamp: null,
        additionalCoingeckoEntries: null,
        comment: null,
        reviewed: true,
        isPriceUnreliable: false,
      }

      const mockDb = {} as unknown as Database
      const mockTokenDb = {
        abstractToken: {
          getAll: vi.fn().mockResolvedValue([
            usdc,
            {
              id: 'abstract-missing',
              symbol: 'MISS',
              issuer: null,
              category: null,
              iconUrl: null,
              coingeckoId: 'missing-coin',
              coingeckoListingTimestamp: null,
              additionalCoingeckoEntries: null,
              comment: null,
              reviewed: true,
              isPriceUnreliable: false,
            },
            {
              id: 'abstract-no-coingecko',
              symbol: 'NOCG',
              issuer: null,
              category: null,
              iconUrl: null,
              coingeckoId: null,
              coingeckoListingTimestamp: null,
              additionalCoingeckoEntries: null,
              comment: null,
              reviewed: true,
              isPriceUnreliable: false,
            },
          ]),
        } as unknown as TokenDatabase['abstractToken'],
        chain: {
          getAll: vi.fn().mockResolvedValue([
            {
              name: 'ethereum',
              chainId: 1,
              explorerUrl: 'https://etherscan.io',
              aliases: ['eth'],
              apis: [],
            },
            {
              name: 'arbitrum',
              chainId: 42161,
              explorerUrl: null,
              aliases: ['arb'],
              apis: [],
            },
            {
              name: 'blast',
              chainId: 81457,
              explorerUrl: null,
              aliases: [],
              apis: [],
            },
          ]),
        } as unknown as TokenDatabase['chain'],
        deployedToken: {
          getAll: vi
            .fn()
            .mockResolvedValue([{ chain: 'arbitrum', address: '0x222' }]),
        } as unknown as TokenDatabase['deployedToken'],
      } as unknown as TokenDatabase
      const mockCoingeckoClient = {
        getCoinList: vi.fn().mockResolvedValue([
          {
            id: 'usd-coin',
            symbol: 'usdc',
            name: 'USD Coin',
            platforms: {
              eth: '0x111',
              arb: '0x222',
              blast: '0x333',
            },
          },
        ]),
      } as unknown as CoingeckoClient

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.getCoingeckoSuggestions()

      expect(result).toEqual([
        {
          chain: 'ethereum',
          address: '0x111',
          explorerUrl: 'https://etherscan.io',
          abstractToken: usdc,
          isInterop: true,
        },
        {
          chain: 'blast',
          address: '0x333',
          explorerUrl: undefined,
          abstractToken: usdc,
          isInterop: false,
        },
      ])
    })
  })
})

function deployedToken(input: {
  chain: string
  address: string
  symbol: string
  abstractTokenId?: string | null
  ignored?: boolean
}): DeployedTokenRecord {
  return {
    chain: input.chain,
    address: input.address,
    symbol: input.symbol,
    ignored: input.ignored ?? false,
    decimals: 18,
    comment: null,
    abstractTokenId: input.abstractTokenId ?? null,
    deploymentTimestamp: 0,
    metadata: null,
  }
}

function tokenRelationRoute(input: {
  tokenAChain: string
  tokenAAddress: string
  tokenBChain: string
  tokenBAddress: string
  plugin: string
  lockedToken?: TokenRelationLockedToken
}): Omit<TokenRelationRecord, 'transfer'> {
  return {
    ...input,
    bridgeType: 'lockAndMint',
    lockedToken: input.lockedToken ?? null,
  }
}

function createRouter(
  mockTokenDb: TokenDatabase,
  mockDb: Database,
  mockCoingeckoClient: CoingeckoClient,
  deps: Partial<Pick<DeployedTokensRouterDeps, 'createChain'>> = {},
) {
  const router = deployedTokensRouter({
    coingeckoClient: mockCoingeckoClient,
    etherscanApiKey: 'test-api-key',
    ...deps,
  })

  const callerFactory = createCallerFactory(router)
  let mockInteropTransfer: Database['interopTransfer'] | undefined
  try {
    mockInteropTransfer = mockDb.interopTransfer
  } catch {
    mockInteropTransfer = undefined
  }

  const dbShape = {
    ...mockDb,
    interopTransfer:
      mockInteropTransfer ??
      ({
        getWithPartialAbstractTokenIds: vi.fn().mockResolvedValue([]),
        getWithPartialAbstractTokenIdsForToken: vi.fn().mockResolvedValue([]),
      } as unknown as Database['interopTransfer']),
  } satisfies Partial<Database>
  const db = dbShape as unknown as Database
  return callerFactory({
    headers: new Headers(),
    session: {
      email: 'test@example.com',
      permissions: ['read', 'write'],
    },
    db,
    tokenDb: mockTokenDb,
    tokenIngestionProcessor: {} as unknown as TokenIngestionProcessor,
  })
}
