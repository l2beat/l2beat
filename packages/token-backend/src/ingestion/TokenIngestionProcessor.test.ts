import type {
  Database,
  InteropTransferRecord,
  TokenDatabase,
} from '@l2beat/database'
import type { ChainRepository } from '@l2beat/database/dist/repositories/ChainRepository'
import type { DeployedTokenRepository } from '@l2beat/database/dist/repositories/DeployedTokenRepository'
import type { TokenIngestionQueueRecord } from '@l2beat/database/dist/repositories/TokenIngestionQueueRepository'
import { Address32, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { CoingeckoClient } from '../chains/clients/coingecko/CoingeckoClient'
import { buildInteropTransferIndex } from './InteropTransferIndex'
import { TokenIngestionProcessor } from './TokenIngestionProcessor'

describe(TokenIngestionProcessor.name, () => {
  describe(TokenIngestionProcessor.prototype.plan.name, () => {
    it('does not count non-swapping transfers without a recorded other side', async () => {
      const address = token('ethereum', '0xaaa')
      const getByPrimaryKeys = mockFn().resolvesTo([])

      const processor = createProcessor({
        tokenDb: mockObject<TokenDatabase>({
          deployedToken: mockObject<DeployedTokenRepository>({
            findByChainAndAddress: mockFn().resolvesTo(undefined),
            getByPrimaryKeys,
          }),
          chain: mockObject<ChainRepository>({
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

      expect(
        trace.steps.find((step) => step.kind === 'transfer-evidence'),
      ).toEqual({
        kind: 'transfer-evidence',
        total: 1,
        nonSwapping: 0,
        abstractTokenIds: [],
      })
      expect(getByPrimaryKeys).toHaveBeenCalledWith([])
    })
  })
})

function createProcessor(deps: {
  db?: Database
  tokenDb?: TokenDatabase
  coingeckoClient?: CoingeckoClient
}) {
  return new TokenIngestionProcessor({
    db: deps.db ?? mockObject<Database>({}),
    tokenDb: deps.tokenDb ?? mockObject<TokenDatabase>({}),
    coingeckoClient: deps.coingeckoClient ?? mockObject<CoingeckoClient>({}),
    etherscanApiKey: undefined,
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
