import { Logger } from '@l2beat/backend-tools'
import type {
  Database,
  InteropTransferRecord,
  TokenDatabase,
  TokenRelationRecord,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { mockObject } from '@l2beat/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { TokenRelationIngestion } from './TokenRelationIngestion'

const CURSOR_KEY = 'token-relations:lastSerialId'

describe(TokenRelationIngestion.name, () => {
  it('creates relations from non-swapping transfers and advances the cursor', async () => {
    const insert = vi.fn().mockResolvedValue(undefined)
    const historyInsert = vi.fn().mockResolvedValue(undefined)
    const set = vi.fn().mockResolvedValue(undefined)
    const getAfterSerialId = vi
      .fn()
      .mockResolvedValueOnce({
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
      .mockResolvedValueOnce(emptyBatch())

    const ingestion = createIngestion({
      getAfterSerialId,
      cursor: '10',
      insert,
      historyInsert,
      set,
    })

    await ingestion.runOnce()

    expect(getAfterSerialId).toHaveBeenCalledWith('10', expect.any(Number))
    expect(insert).toHaveBeenCalledTimes(1)
    const inserted = insert.mock.calls[0][0] as TokenRelationRecord
    // Endpoints are stored in lexicographic order — base sorts before ethereum
    // — so the observed transfer direction is not what orients the row. The
    // locked endpoint (ethereum, whose token was not burned) is named instead.
    expect(inserted).toMatchObject({
      tokenAChain: 'base',
      tokenAAddress: token('0xbbb'),
      tokenBChain: 'ethereum',
      tokenBAddress: token('0xaaa'),
      plugin: 'test',
      bridgeType: 'lockAndMint',
      lockedToken: 'B',
    })
    expect(evidenceTransferId(inserted)).toStrictEqual('lock-mint')
    expect(historyInsert).toHaveBeenCalledTimes(1)
    expect(historyInsert.mock.calls[0][0]).toMatchObject({
      source: 'ingestion',
      commandType: 'AddTokenRelationCommand',
    })
    expect(set).toHaveBeenCalledWith({ key: CURSOR_KEY, value: '12' })
  })

  it('commits all new relations of a batch in a single transaction', async () => {
    const events: string[] = []
    const insert = vi.fn().mockImplementation(async () => {
      events.push('insert')
    })
    const transaction = vi
      .fn()
      .mockImplementation(async (callback: () => Promise<void>) => {
        events.push('begin')
        await callback()
        events.push('commit')
      })
    const getAfterSerialId = vi
      .fn()
      .mockResolvedValueOnce({
        latestSerialId: '12',
        transfers: [
          transfer({
            transferId: 'first',
            bridgeType: 'lockAndMint',
          }),
          transfer({
            transferId: 'second',
            bridgeType: 'burnAndMint',
            srcTokenAddress: token('0xccc'),
            dstTokenAddress: token('0xddd'),
          }),
        ],
      })
      .mockResolvedValueOnce(emptyBatch())

    const ingestion = createIngestion({ getAfterSerialId, insert, transaction })

    await ingestion.runOnce()

    expect(events).toStrictEqual(['begin', 'insert', 'insert', 'commit'])
  })

  it('creates relations without ever consulting the token catalogue', async () => {
    // No deployedToken or tokenIngestionQueue mocks exist on the database
    // object below — any attempt to look up deployed tokens (e.g. to gate
    // relations behind token-level conflicts) would make this test throw.
    const insert = vi.fn().mockResolvedValue(undefined)

    const ingestion = createIngestion({
      getAfterSerialId: vi
        .fn()
        .mockResolvedValueOnce({
          latestSerialId: '2',
          transfers: [
            transfer({ transferId: 'unknown-tokens', srcWasBurned: true }),
          ],
        })
        .mockResolvedValueOnce(emptyBatch()),
      insert,
    })

    await ingestion.runOnce()

    expect(insert).toHaveBeenCalledTimes(1)
  })

  it('records one relation for both observed directions of a lock-and-mint route', async () => {
    // The deposit locks on ethereum and mints on base; the withdrawal burns on
    // base and unlocks on ethereum. Same pair, same locked endpoint, one row.
    const insert = vi.fn().mockResolvedValue(undefined)

    const ingestion = createIngestion({
      getAfterSerialId: vi
        .fn()
        .mockResolvedValueOnce({
          latestSerialId: '3',
          transfers: [
            transfer({
              transferId: 'deposit',
              srcWasBurned: false,
              dstWasMinted: true,
            }),
            transfer({
              transferId: 'withdrawal',
              srcChain: 'base',
              srcTokenAddress: token('0xbbb'),
              srcWasBurned: true,
              dstChain: 'ethereum',
              dstTokenAddress: token('0xaaa'),
              dstWasMinted: false,
            }),
          ],
        })
        .mockResolvedValueOnce(emptyBatch()),
      insert,
    })

    await ingestion.runOnce()

    expect(insert).toHaveBeenCalledTimes(1)
    expect(insert.mock.calls[0][0]).toStrictEqual(
      relationRecord({
        lockedToken: 'B',
        transfer: expect.any(Object),
      }),
    )
  })

  it('leaves the locked token unidentified when the flags do not identify one', async () => {
    const insert = vi.fn().mockResolvedValue(undefined)

    const ingestion = createIngestion({
      getAfterSerialId: vi
        .fn()
        .mockResolvedValueOnce({
          latestSerialId: '3',
          transfers: [
            transfer({
              transferId: 'contradicting-flags',
              bridgeType: 'lockAndMint',
              srcWasBurned: false,
              dstWasMinted: false,
            }),
          ],
        })
        .mockResolvedValueOnce(emptyBatch()),
      insert,
    })

    await ingestion.runOnce()

    expect(insert.mock.calls[0][0]).toMatchObject({
      bridgeType: 'lockAndMint',
      lockedToken: null,
    })
  })

  it('never identifies a locked token for a burn-and-mint pair', async () => {
    // Both sides burn and mint, so the pair is symmetric — nothing is locked.
    const insert = vi.fn().mockResolvedValue(undefined)

    const ingestion = createIngestion({
      getAfterSerialId: vi
        .fn()
        .mockResolvedValueOnce({
          latestSerialId: '3',
          transfers: [
            transfer({
              transferId: 'burn-and-mint',
              bridgeType: 'burnAndMint',
              srcWasBurned: true,
              dstWasMinted: true,
            }),
          ],
        })
        .mockResolvedValueOnce(emptyBatch()),
      insert,
    })

    await ingestion.runOnce()

    expect(insert.mock.calls[0][0]).toMatchObject({
      bridgeType: 'burnAndMint',
      lockedToken: null,
    })
  })

  it('resolves the locked token of a relation that was observed without one', async () => {
    const update = vi.fn().mockResolvedValue(1)
    const insert = vi.fn().mockResolvedValue(undefined)

    const ingestion = createIngestion({
      getAfterSerialId: vi
        .fn()
        .mockResolvedValueOnce({
          latestSerialId: '3',
          transfers: [transfer({ transferId: 'now-with-flags' })],
        })
        .mockResolvedValueOnce(emptyBatch()),
      existingRelations: [relationRecord({ lockedToken: null })],
      insert,
      update,
    })

    await ingestion.runOnce()

    expect(insert).toHaveBeenCalledTimes(0)
    expect(update).toHaveBeenCalledTimes(1)
    expect(update.mock.calls[0][1]).toStrictEqual({ lockedToken: 'B' })
  })

  it('does not overwrite a locked token that is already identified', async () => {
    const update = vi.fn().mockResolvedValue(1)

    const ingestion = createIngestion({
      getAfterSerialId: vi
        .fn()
        .mockResolvedValueOnce({
          latestSerialId: '3',
          transfers: [transfer({ transferId: 'already-known' })],
        })
        .mockResolvedValueOnce(emptyBatch()),
      existingRelations: [relationRecord({ lockedToken: 'B' })],
      update,
    })

    await ingestion.runOnce()

    expect(update).toHaveBeenCalledTimes(0)
  })

  it('ignores transfers whose two endpoints are the same token', async () => {
    // A token is trivially the same asset as itself, so there is nothing to
    // record — and the pair could not be stored in a canonical order anyway.
    const insert = vi.fn().mockResolvedValue(undefined)

    const ingestion = createIngestion({
      getAfterSerialId: vi
        .fn()
        .mockResolvedValueOnce({
          latestSerialId: '3',
          transfers: [
            transfer({
              transferId: 'same-token',
              dstChain: 'ethereum',
              dstTokenAddress: token('0xaaa'),
            }),
          ],
        })
        .mockResolvedValueOnce(emptyBatch()),
      insert,
    })

    await ingestion.runOnce()

    expect(insert).toHaveBeenCalledTimes(0)
  })

  it('infers the bridge type from burn and mint flags when it is not stored', async () => {
    const insert = vi.fn().mockResolvedValue(undefined)

    const ingestion = createIngestion({
      getAfterSerialId: vi
        .fn()
        .mockResolvedValueOnce({
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
        .mockResolvedValueOnce(emptyBatch()),
      insert,
    })

    await ingestion.runOnce()

    expect(insert.mock.calls[0][0]).toMatchObject({
      bridgeType: 'burnAndMint',
    })
  })

  it('trusts a stored bridge type even when the burn and mint flags are unobserved', async () => {
    // One-sided transfers often miss a flag. The plugin-declared bridgeType
    // is authoritative — the relation must be created, and the unobserved
    // flags must NOT be fabricated (they stay absent in the evidence JSON).
    const insert = vi.fn().mockResolvedValue(undefined)

    const ingestion = createIngestion({
      getAfterSerialId: vi
        .fn()
        .mockResolvedValueOnce({
          latestSerialId: '3',
          transfers: [
            transfer({
              transferId: 'one-sided',
              bridgeType: 'lockAndMint',
              srcWasBurned: undefined,
              dstWasMinted: true,
            }),
          ],
        })
        .mockResolvedValueOnce(emptyBatch()),
      insert,
    })

    await ingestion.runOnce()

    expect(insert).toHaveBeenCalledTimes(1)
    const inserted = insert.mock.calls[0][0] as TokenRelationRecord
    expect(inserted.bridgeType).toStrictEqual('lockAndMint')
    const evidence = inserted.transfer as Record<string, unknown>
    expect('srcWasBurned' in evidence).toStrictEqual(false)
    expect(evidence['dstWasMinted']).toStrictEqual(true)
  })

  it('ignores swap-like and unclassifiable transfers', async () => {
    const insert = vi.fn().mockResolvedValue(undefined)
    const set = vi.fn().mockResolvedValue(undefined)

    const ingestion = createIngestion({
      getAfterSerialId: vi
        .fn()
        .mockResolvedValueOnce({
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
        .mockResolvedValueOnce(emptyBatch()),
      insert,
      set,
    })

    await ingestion.runOnce()

    expect(insert).toHaveBeenCalledTimes(0)
    expect(set).toHaveBeenCalledWith({ key: CURSOR_KEY, value: '4' })
  })

  it('ignores transfers missing a token address on either side', async () => {
    const insert = vi.fn().mockResolvedValue(undefined)

    const ingestion = createIngestion({
      getAfterSerialId: vi
        .fn()
        .mockResolvedValueOnce({
          latestSerialId: '5',
          transfers: [
            transfer({ transferId: 'no-src', srcTokenAddress: undefined }),
            transfer({ transferId: 'no-dst', dstTokenAddress: undefined }),
            transfer({ transferId: 'zero-dst', dstTokenAddress: '0x' }),
          ],
        })
        .mockResolvedValueOnce(emptyBatch()),
      insert,
    })

    await ingestion.runOnce()

    expect(insert).toHaveBeenCalledTimes(0)
  })

  it('skips relations that already exist', async () => {
    const insert = vi.fn().mockResolvedValue(undefined)

    const ingestion = createIngestion({
      getAfterSerialId: vi
        .fn()
        .mockResolvedValueOnce({
          latestSerialId: '6',
          transfers: [transfer({ transferId: 'existing' })],
        })
        .mockResolvedValueOnce(emptyBatch()),
      existingRelations: [relationRecord({ lockedToken: 'B' })],
      insert,
    })

    await ingestion.runOnce()

    expect(insert).toHaveBeenCalledTimes(0)
  })

  it('deduplicates transfers of the same route within a batch', async () => {
    const insert = vi.fn().mockResolvedValue(undefined)

    const ingestion = createIngestion({
      getAfterSerialId: vi
        .fn()
        .mockResolvedValueOnce({
          latestSerialId: '7',
          transfers: [
            transfer({ transferId: 'first' }),
            transfer({ transferId: 'second' }),
          ],
        })
        .mockResolvedValueOnce(emptyBatch()),
      insert,
    })

    await ingestion.runOnce()

    expect(insert).toHaveBeenCalledTimes(1)
    const inserted = insert.mock.calls[0][0] as TokenRelationRecord
    expect(evidenceTransferId(inserted)).toStrictEqual('first')
  })

  it('pages through transfers and advances the cursor after every batch', async () => {
    const insert = vi.fn().mockResolvedValue(undefined)
    const set = vi.fn().mockResolvedValue(undefined)
    const getAfterSerialId = vi
      .fn()
      .mockResolvedValueOnce({
        latestSerialId: '100',
        transfers: [transfer({ transferId: 'batch-one' })],
      })
      .mockResolvedValueOnce({
        latestSerialId: '200',
        transfers: [
          transfer({
            transferId: 'batch-two',
            dstChain: 'arbitrum',
            dstTokenAddress: token('0xccc'),
          }),
        ],
      })
      .mockResolvedValueOnce(emptyBatch())

    const ingestion = createIngestion({ getAfterSerialId, insert, set })

    await ingestion.runOnce()

    expect(getAfterSerialId.mock.calls.map((call) => call[0])).toStrictEqual([
      '0',
      '100',
      '200',
    ])
    expect(insert).toHaveBeenCalledTimes(2)
    expect(set.mock.calls.map((call) => call[0])).toStrictEqual([
      { key: CURSOR_KEY, value: '100' },
      { key: CURSOR_KEY, value: '200' },
    ])
  })

  it('stops after the page budget so a backlog cannot monopolize a tick', async () => {
    // Never returns an empty batch — only the page budget can end the run.
    // The cursor persists after every page, so the next run picks up where
    // this one stopped.
    const set = vi.fn().mockResolvedValue(undefined)
    const getAfterSerialId = vi.fn().mockResolvedValue({
      latestSerialId: '1',
      transfers: [transfer({ transferId: 'endless' })],
    })

    const ingestion = createIngestion({ getAfterSerialId, set })

    await ingestion.runOnce()

    expect(getAfterSerialId).toHaveBeenCalledTimes(50)
    expect(set).toHaveBeenCalledTimes(50)
  })

  it('normalizes Address32 token addresses to lowercase Ethereum addresses', async () => {
    const insert = vi.fn().mockResolvedValue(undefined)
    const ethereumAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
    const address32 = `0x000000000000000000000000${ethereumAddress.slice(2)}`

    const ingestion = createIngestion({
      getAfterSerialId: vi
        .fn()
        .mockResolvedValueOnce({
          latestSerialId: '8',
          transfers: [
            transfer({
              transferId: 'address32',
              srcTokenAddress: address32,
            }),
          ],
        })
        .mockResolvedValueOnce(emptyBatch()),
      insert,
    })

    await ingestion.runOnce()

    expect(insert.mock.calls[0][0]).toMatchObject({
      tokenBAddress: ethereumAddress.toLowerCase(),
    })
  })

  it('does not advance the cursor when there are no new transfers', async () => {
    const set = vi.fn().mockResolvedValue(undefined)

    const ingestion = createIngestion({
      getAfterSerialId: vi.fn().mockResolvedValue(emptyBatch()),
      set,
    })

    await ingestion.runOnce()

    expect(set).toHaveBeenCalledTimes(0)
  })
})

function createIngestion(opts: {
  getAfterSerialId: ReturnType<typeof vi.fn>
  cursor?: string
  existingRelations?: TokenRelationRecord[]
  insert?: ReturnType<typeof vi.fn>
  update?: ReturnType<typeof vi.fn>
  historyInsert?: ReturnType<typeof vi.fn>
  set?: ReturnType<typeof vi.fn>
  transaction?: ReturnType<typeof vi.fn>
}) {
  const db = mockObject<Database>({
    interopTransfer: mockObject<Database['interopTransfer']>({
      getAfterSerialId:
        opts.getAfterSerialId as Database['interopTransfer']['getAfterSerialId'],
    }),
  })
  const tokenDb = mockObject<TokenDatabase>({
    transaction: (opts.transaction ??
      (async (callback) => await callback())) as TokenDatabase['transaction'],
    tokenDbSettings: mockObject<TokenDatabase['tokenDbSettings']>({
      get: vi
        .fn()
        .mockResolvedValue(
          opts.cursor ? { key: CURSOR_KEY, value: opts.cursor } : undefined,
        ),
      set: (opts.set ??
        vi
          .fn()
          .mockResolvedValue(
            undefined,
          )) as TokenDatabase['tokenDbSettings']['set'],
    }),
    tokenRelation: mockObject<TokenDatabase['tokenRelation']>({
      getByPrimaryKeys: vi.fn().mockResolvedValue(opts.existingRelations ?? []),
      insert: (opts.insert ??
        vi
          .fn()
          .mockResolvedValue(
            undefined,
          )) as TokenDatabase['tokenRelation']['insert'],
      updateByPrimaryKey: (opts.update ??
        vi
          .fn()
          .mockResolvedValue(
            1,
          )) as TokenDatabase['tokenRelation']['updateByPrimaryKey'],
    }),
    tokenDbHistory: mockObject<TokenDatabase['tokenDbHistory']>({
      insert: (opts.historyInsert ??
        vi
          .fn()
          .mockResolvedValue(
            undefined,
          )) as TokenDatabase['tokenDbHistory']['insert'],
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
    tokenAChain: 'base',
    tokenAAddress: token('0xbbb'),
    tokenBChain: 'ethereum',
    tokenBAddress: token('0xaaa'),
    plugin: 'test',
    bridgeType: 'lockAndMint',
    transfer: {},
    ...overrides,
    lockedToken: overrides.lockedToken ?? null,
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
