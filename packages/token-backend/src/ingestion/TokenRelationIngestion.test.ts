import { Logger } from '@l2beat/backend-tools'
import type {
  Database,
  InteropTransferRecord,
  TokenDatabase,
  TokenRelationRecord,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { TokenRelationIngestion } from './TokenRelationIngestion'

const CURSOR_KEY = 'token-relations:lastSerialId'

describe(TokenRelationIngestion.name, () => {
  it('creates relations from non-swapping transfers and advances the cursor', async () => {
    const insert = mockFn().resolvesTo(undefined)
    const historyInsert = mockFn().resolvesTo(undefined)
    const set = mockFn().resolvesTo(undefined)
    const getAfterSerialId = mockFn()
      .resolvesToOnce({
        latestSerialId: '12',
        transfers: [
          transfer({
            transferId: 'lock-mint',
            bridgeType: 'lockAndMint',
            srcWasBurned: false,
            dstWasMinted: true,
          }),
        ],
      })
      .resolvesToOnce(emptyBatch())

    const ingestion = createIngestion({
      getAfterSerialId,
      cursor: '10',
      insert,
      historyInsert,
      set,
    })

    await ingestion.runOnce()

    expect(getAfterSerialId).toHaveBeenCalledWith('10', expect.a(Number))
    expect(insert).toHaveBeenCalledTimes(1)
    const inserted = insert.calls[0]?.args[0] as TokenRelationRecord
    expect(inserted).toHaveSubset({
      tokenFromChain: 'ethereum',
      tokenFromAddress: token('0xaaa'),
      tokenToChain: 'base',
      tokenToAddress: token('0xbbb'),
      plugin: 'test',
      sourceWasBurned: false,
      destinationWasMinted: true,
      bridgeType: 'lockAndMint',
    })
    expect(evidenceTransferId(inserted)).toEqual('lock-mint')
    expect(historyInsert).toHaveBeenCalledTimes(1)
    expect(historyInsert.calls[0]?.args[0]).toHaveSubset({
      source: 'ingestion',
      commandType: 'AddTokenRelationCommand',
    })
    expect(set).toHaveBeenCalledWith({ key: CURSOR_KEY, value: '12' })
  })

  it('creates relations without ever consulting the token catalogue', async () => {
    // No deployedToken or tokenIngestionQueue mocks exist on the database
    // object below — any attempt to look up deployed tokens (e.g. to gate
    // relations behind token-level conflicts) would make this test throw.
    const insert = mockFn().resolvesTo(undefined)

    const ingestion = createIngestion({
      getAfterSerialId: mockFn()
        .resolvesToOnce({
          latestSerialId: '2',
          transfers: [
            transfer({ transferId: 'unknown-tokens', srcWasBurned: true }),
          ],
        })
        .resolvesToOnce(emptyBatch()),
      insert,
    })

    await ingestion.runOnce()

    expect(insert).toHaveBeenCalledTimes(1)
  })

  it('infers the bridge type from burn and mint flags when it is not stored', async () => {
    const insert = mockFn().resolvesTo(undefined)

    const ingestion = createIngestion({
      getAfterSerialId: mockFn()
        .resolvesToOnce({
          latestSerialId: '3',
          transfers: [
            transfer({
              transferId: 'inferred',
              bridgeType: undefined,
              srcWasBurned: true,
              dstWasMinted: true,
            }),
          ],
        })
        .resolvesToOnce(emptyBatch()),
      insert,
    })

    await ingestion.runOnce()

    expect(insert.calls[0]?.args[0]).toHaveSubset({
      bridgeType: 'burnAndMint',
      sourceWasBurned: true,
      destinationWasMinted: true,
    })
  })

  it('ignores swap-like and unclassifiable transfers', async () => {
    const insert = mockFn().resolvesTo(undefined)
    const set = mockFn().resolvesTo(undefined)

    const ingestion = createIngestion({
      getAfterSerialId: mockFn()
        .resolvesToOnce({
          latestSerialId: '4',
          transfers: [
            transfer({
              transferId: 'non-minting',
              bridgeType: 'nonMinting',
            }),
            transfer({
              transferId: 'unclassifiable',
              bridgeType: undefined,
              srcWasBurned: undefined,
              dstWasMinted: undefined,
            }),
          ],
        })
        .resolvesToOnce(emptyBatch()),
      insert,
      set,
    })

    await ingestion.runOnce()

    expect(insert).toHaveBeenCalledTimes(0)
    expect(set).toHaveBeenCalledWith({ key: CURSOR_KEY, value: '4' })
  })

  it('ignores transfers missing a token address on either side', async () => {
    const insert = mockFn().resolvesTo(undefined)

    const ingestion = createIngestion({
      getAfterSerialId: mockFn()
        .resolvesToOnce({
          latestSerialId: '5',
          transfers: [
            transfer({ transferId: 'no-src', srcTokenAddress: undefined }),
            transfer({ transferId: 'no-dst', dstTokenAddress: undefined }),
            transfer({ transferId: 'zero-dst', dstTokenAddress: '0x' }),
          ],
        })
        .resolvesToOnce(emptyBatch()),
      insert,
    })

    await ingestion.runOnce()

    expect(insert).toHaveBeenCalledTimes(0)
  })

  it('skips relations that already exist', async () => {
    const insert = mockFn().resolvesTo(undefined)
    const existing = transfer({ transferId: 'existing' })

    const ingestion = createIngestion({
      getAfterSerialId: mockFn()
        .resolvesToOnce({
          latestSerialId: '6',
          transfers: [existing],
        })
        .resolvesToOnce(emptyBatch()),
      existingRelations: [
        relationRecord({
          tokenFromChain: existing.srcChain,
          tokenFromAddress: existing.srcTokenAddress ?? '',
          tokenToChain: existing.dstChain,
          tokenToAddress: existing.dstTokenAddress ?? '',
          plugin: existing.plugin,
          sourceWasBurned: false,
          destinationWasMinted: true,
        }),
      ],
      insert,
    })

    await ingestion.runOnce()

    expect(insert).toHaveBeenCalledTimes(0)
  })

  it('deduplicates transfers of the same route within a batch', async () => {
    const insert = mockFn().resolvesTo(undefined)

    const ingestion = createIngestion({
      getAfterSerialId: mockFn()
        .resolvesToOnce({
          latestSerialId: '7',
          transfers: [
            transfer({ transferId: 'first' }),
            transfer({ transferId: 'second' }),
          ],
        })
        .resolvesToOnce(emptyBatch()),
      insert,
    })

    await ingestion.runOnce()

    expect(insert).toHaveBeenCalledTimes(1)
    const inserted = insert.calls[0]?.args[0] as TokenRelationRecord
    expect(evidenceTransferId(inserted)).toEqual('first')
  })

  it('pages through transfers and advances the cursor after every batch', async () => {
    const insert = mockFn().resolvesTo(undefined)
    const set = mockFn().resolvesTo(undefined)
    const getAfterSerialId = mockFn()
      .resolvesToOnce({
        latestSerialId: '100',
        transfers: [transfer({ transferId: 'batch-one' })],
      })
      .resolvesToOnce({
        latestSerialId: '200',
        transfers: [
          transfer({
            transferId: 'batch-two',
            dstChain: 'arbitrum',
            dstTokenAddress: token('0xccc'),
          }),
        ],
      })
      .resolvesToOnce(emptyBatch())

    const ingestion = createIngestion({ getAfterSerialId, insert, set })

    await ingestion.runOnce()

    expect(getAfterSerialId.calls.map((call) => call.args[0])).toEqual([
      '0',
      '100',
      '200',
    ])
    expect(insert).toHaveBeenCalledTimes(2)
    expect(set.calls.map((call) => call.args[0])).toEqual([
      { key: CURSOR_KEY, value: '100' },
      { key: CURSOR_KEY, value: '200' },
    ])
  })

  it('normalizes Address32 token addresses to lowercase Ethereum addresses', async () => {
    const insert = mockFn().resolvesTo(undefined)
    const ethereumAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
    const address32 = `0x000000000000000000000000${ethereumAddress.slice(2)}`

    const ingestion = createIngestion({
      getAfterSerialId: mockFn()
        .resolvesToOnce({
          latestSerialId: '8',
          transfers: [
            transfer({
              transferId: 'address32',
              srcTokenAddress: address32,
            }),
          ],
        })
        .resolvesToOnce(emptyBatch()),
      insert,
    })

    await ingestion.runOnce()

    expect(insert.calls[0]?.args[0]).toHaveSubset({
      tokenFromAddress: ethereumAddress.toLowerCase(),
    })
  })

  it('does not advance the cursor when there are no new transfers', async () => {
    const set = mockFn().resolvesTo(undefined)

    const ingestion = createIngestion({
      getAfterSerialId: mockFn().resolvesTo(emptyBatch()),
      set,
    })

    await ingestion.runOnce()

    expect(set).toHaveBeenCalledTimes(0)
  })
})

function createIngestion(opts: {
  getAfterSerialId: ReturnType<typeof mockFn>
  cursor?: string
  existingRelations?: TokenRelationRecord[]
  insert?: ReturnType<typeof mockFn>
  historyInsert?: ReturnType<typeof mockFn>
  set?: ReturnType<typeof mockFn>
}) {
  const db = mockObject<Database>({
    interopTransfer: mockObject<Database['interopTransfer']>({
      getAfterSerialId:
        opts.getAfterSerialId as Database['interopTransfer']['getAfterSerialId'],
    }),
  })
  const tokenDb = mockObject<TokenDatabase>({
    transaction: async (callback) => await callback(),
    tokenDbSettings: mockObject<TokenDatabase['tokenDbSettings']>({
      get: mockFn().resolvesTo(
        opts.cursor ? { key: CURSOR_KEY, value: opts.cursor } : undefined,
      ),
      set: opts.set ?? mockFn().resolvesTo(undefined),
    }),
    tokenRelation: mockObject<TokenDatabase['tokenRelation']>({
      getByPrimaryKeys: mockFn().resolvesTo(opts.existingRelations ?? []),
      insert: opts.insert ?? mockFn().resolvesTo(undefined),
    }),
    tokenDbHistory: mockObject<TokenDatabase['tokenDbHistory']>({
      insert: opts.historyInsert ?? mockFn().resolvesTo(undefined),
    }),
  })

  return new TokenRelationIngestion(db, tokenDb, Logger.SILENT)
}

function emptyBatch() {
  return { latestSerialId: undefined, transfers: [] }
}

function evidenceTransferId(relation: TokenRelationRecord): string {
  return (relation.transfer as { transferId: string }).transferId
}

function token(shortAddress: string) {
  return `0x${shortAddress.slice(2).padStart(40, '0')}`
}

function relationRecord(
  overrides: Partial<TokenRelationRecord>,
): TokenRelationRecord {
  return {
    tokenFromChain: 'ethereum',
    tokenFromAddress: token('0xaaa'),
    tokenToChain: 'base',
    tokenToAddress: token('0xbbb'),
    plugin: 'test',
    sourceWasBurned: false,
    destinationWasMinted: true,
    bridgeType: 'lockAndMint',
    transfer: {},
    ...overrides,
  }
}

function transfer(
  overrides: Partial<InteropTransferRecord>,
): InteropTransferRecord {
  return {
    plugin: 'test',
    bridgeType: 'lockAndMint',
    transferId: 'transfer-id',
    type: 'transfer',
    duration: 1,
    timestamp: UnixTime(1),
    srcTime: UnixTime(1),
    srcChain: 'ethereum',
    srcTxHash: '0xsrc',
    srcLogIndex: 1,
    srcEventId: 'src-event',
    srcTokenAddress: token('0xaaa'),
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
    dstTokenAddress: token('0xbbb'),
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
