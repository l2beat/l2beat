import type {
  Database,
  InteropTransferRecord,
  TokenFactInputRecord,
} from '@l2beat/database'
import { expect } from 'earl'
import { importTransferFacts } from './importTransferFacts'

// Lowercase hex addresses for test use
const ADDR_A = '0xabcdabcd12345678abcdabcd12345678abcdabcd'
const ADDR_B = '0x33d66941465ac776c38096cb1bc496c673ae7390'
const PADDED_ADDR_A = `0x${'0'.repeat(24)}${ADDR_A.slice(2)}`
const PADDED_ADDR_B = `0x${'0'.repeat(24)}${ADDR_B.slice(2)}`

function makeTransfer(
  overrides: Partial<InteropTransferRecord>,
): InteropTransferRecord {
  return {
    plugin: 'testPlugin',
    bridgeType: undefined,
    transferId: 'tx1',
    type: 'transfer',
    duration: undefined,
    timestamp: 0,
    srcTime: undefined,
    srcChain: 'ethereum',
    srcTxHash: undefined,
    srcLogIndex: undefined,
    srcEventId: undefined,
    srcTokenAddress: ADDR_A,
    srcRawAmount: undefined,
    srcWasBurned: undefined,
    srcAbstractTokenId: undefined,
    srcSymbol: undefined,
    srcAmount: undefined,
    srcPrice: undefined,
    srcValueUsd: undefined,
    dstTime: undefined,
    dstChain: 'base',
    dstTxHash: undefined,
    dstLogIndex: undefined,
    dstEventId: undefined,
    dstTokenAddress: ADDR_B,
    dstRawAmount: undefined,
    dstWasMinted: undefined,
    dstAbstractTokenId: undefined,
    dstSymbol: undefined,
    dstAmount: undefined,
    dstPrice: undefined,
    dstValueUsd: undefined,
    isProcessed: false,
    ...overrides,
  }
}

type InsertedFact = Omit<TokenFactInputRecord, 'id'>

function mockDb(
  existingFacts: TokenFactInputRecord[],
  transfers: InteropTransferRecord[],
) {
  const inserted: InsertedFact[] = []
  return {
    db: {
      tokenFactInput: {
        getByName: async () => existingFacts,
        insertMany: async (records: InsertedFact[]) => {
          inserted.push(...records)
        },
      },
      interopTransfer: {
        getAll: async () => transfers,
      },
    } as unknown as Database,
    inserted,
  }
}

describe(importTransferFacts.name, () => {
  it('imports new transfer facts', async () => {
    const { db, inserted } = mockDb(
      [],
      [
        makeTransfer({
          srcChain: 'ethereum',
          srcTokenAddress: ADDR_A,
          dstChain: 'base',
          dstTokenAddress: ADDR_B,
          plugin: 'hop',
          bridgeType: 'lockAndMint',
          srcTxHash: '0xsrctx',
          dstTxHash: '0xdsttx',
        }),
      ],
    )

    const result = await importTransferFacts(db)

    expect(result.imported).toEqual(1)
    expect(result.skipped).toEqual(0)
    expect(inserted.length).toEqual(1)
    expect(inserted[0]!.name).toEqual('transfer')
    expect(inserted[0]!.arguments).toEqual(
      `ethereum,"${ADDR_A}",base,"${ADDR_B}",hop,lockAndMint`,
    )
    expect(inserted[0]!.context).toEqual({
      srcTxHash: '0xsrctx',
      dstTxHash: '0xdsttx',
    })
  })

  it('omits tx hashes from context when missing', async () => {
    const { db, inserted } = mockDb(
      [],
      [
        makeTransfer({
          srcChain: 'ethereum',
          srcTokenAddress: ADDR_A,
          dstChain: 'base',
          dstTokenAddress: ADDR_B,
          plugin: 'hop',
          bridgeType: 'lockAndMint',
          srcTxHash: undefined,
          dstTxHash: undefined,
        }),
      ],
    )

    const result = await importTransferFacts(db)

    expect(result.imported).toEqual(1)
    expect(inserted[0]!.context).toEqual({
      srcTxHash: undefined,
      dstTxHash: undefined,
    })
  })

  it('excludes tx hashes from the dedup key', async () => {
    const base = makeTransfer({
      srcChain: 'ethereum',
      srcTokenAddress: ADDR_A,
      dstChain: 'base',
      dstTokenAddress: ADDR_B,
      plugin: 'hop',
      bridgeType: 'lockAndMint',
    })

    const { db, inserted } = mockDb(
      [],
      [
        { ...base, transferId: 'tx1', srcTxHash: '0xaaa', dstTxHash: '0xbbb' },
        { ...base, transferId: 'tx2', srcTxHash: '0xccc', dstTxHash: '0xddd' },
      ],
    )

    const result = await importTransferFacts(db)

    expect(result.imported).toEqual(1)
    expect(result.skipped).toEqual(1)
    expect(inserted.length).toEqual(1)
  })

  it('lowercases addresses when building facts', async () => {
    const { db, inserted } = mockDb(
      [],
      [
        makeTransfer({
          srcTokenAddress: '0xABCDABCD12345678ABCDABCD12345678ABCDABCD',
          dstTokenAddress: '0x33D66941465AC776C38096CB1BC496C673AE7390',
        }),
      ],
    )

    const result = await importTransferFacts(db)

    expect(result.imported).toEqual(1)
    expect(inserted[0]!.arguments).toInclude(
      '0xabcdabcd12345678abcdabcd12345678abcdabcd',
    )
    expect(inserted[0]!.arguments).toInclude(
      '0x33d66941465ac776c38096cb1bc496c673ae7390',
    )
  })

  it('crops zero-padded EVM addresses when building facts', async () => {
    const { db, inserted } = mockDb(
      [],
      [
        makeTransfer({
          srcTokenAddress: PADDED_ADDR_A,
          dstTokenAddress: PADDED_ADDR_B.toUpperCase(),
        }),
      ],
    )

    const result = await importTransferFacts(db)

    expect(result.imported).toEqual(1)
    expect(inserted[0]!.arguments).toEqual(
      `ethereum,"${ADDR_A}",base,"${ADDR_B}",testPlugin,unknown`,
    )
  })

  it('skips transfers that already exist as facts', async () => {
    const existingFact: TokenFactInputRecord = {
      id: 1,
      name: 'transfer',
      arguments: `"ethereum","${ADDR_A}","base","${ADDR_B}",hop,lockAndMint`,
      context: null,
    }

    const { db, inserted } = mockDb(
      [existingFact],
      [
        makeTransfer({
          srcChain: 'ethereum',
          srcTokenAddress: ADDR_A,
          dstChain: 'base',
          dstTokenAddress: ADDR_B,
          plugin: 'hop',
          bridgeType: 'lockAndMint',
        }),
      ],
    )

    const result = await importTransferFacts(db)

    expect(result.imported).toEqual(0)
    expect(result.skipped).toEqual(1)
    expect(inserted.length).toEqual(0)
  })

  it('treats padded and unpadded addresses as the same fact', async () => {
    const existingFact: TokenFactInputRecord = {
      id: 1,
      name: 'transfer',
      arguments: `"ethereum","${PADDED_ADDR_A}","base","${PADDED_ADDR_B}",hop,lockAndMint`,
      context: null,
    }

    const { db, inserted } = mockDb(
      [existingFact],
      [
        makeTransfer({
          srcTokenAddress: ADDR_A,
          dstTokenAddress: ADDR_B,
          plugin: 'hop',
          bridgeType: 'lockAndMint',
        }),
      ],
    )

    const result = await importTransferFacts(db)

    expect(result.imported).toEqual(0)
    expect(result.skipped).toEqual(1)
    expect(inserted.length).toEqual(0)
  })

  it('treats uppercase and lowercase incoming addresses as the same fact', async () => {
    const existingFact: TokenFactInputRecord = {
      id: 1,
      name: 'transfer',
      arguments: `"ethereum","${ADDR_A}","base","${ADDR_B}",hop,lockAndMint`,
      context: null,
    }

    const { db, inserted } = mockDb(
      [existingFact],
      [
        makeTransfer({
          srcTokenAddress: '0xABCDABCD12345678ABCDABCD12345678ABCDABCD',
          dstTokenAddress: '0x33D66941465AC776C38096CB1BC496C673AE7390',
          plugin: 'hop',
          bridgeType: 'lockAndMint',
        }),
      ],
    )

    const result = await importTransferFacts(db)

    expect(result.imported).toEqual(0)
    expect(result.skipped).toEqual(1)
    expect(inserted.length).toEqual(0)
  })

  it('deduplicates within the same batch of transfers', async () => {
    const transfer = makeTransfer({
      srcChain: 'ethereum',
      srcTokenAddress: ADDR_A,
      dstChain: 'base',
      dstTokenAddress: ADDR_B,
      plugin: 'hop',
      bridgeType: 'lockAndMint',
    })

    const { db, inserted } = mockDb(
      [],
      [
        { ...transfer, transferId: 'tx1' },
        { ...transfer, transferId: 'tx2' },
        { ...transfer, transferId: 'tx3' },
      ],
    )

    const result = await importTransferFacts(db)

    expect(result.imported).toEqual(1)
    expect(result.skipped).toEqual(2)
    expect(inserted.length).toEqual(1)
  })

  it('treats different bridge types as different facts', async () => {
    const base = makeTransfer({
      srcChain: 'ethereum',
      srcTokenAddress: ADDR_A,
      dstChain: 'base',
      dstTokenAddress: ADDR_B,
      plugin: 'hop',
    })

    const { db } = mockDb(
      [],
      [
        { ...base, transferId: 'tx1', bridgeType: 'lockAndMint' },
        { ...base, transferId: 'tx2', bridgeType: 'burnAndMint' },
      ],
    )

    const result = await importTransferFacts(db)

    expect(result.imported).toEqual(2)
    expect(result.skipped).toEqual(0)
  })

  it('skips transfers missing token addresses', async () => {
    const { db, inserted } = mockDb(
      [],
      [
        makeTransfer({ srcTokenAddress: undefined }),
        makeTransfer({ dstTokenAddress: undefined }),
      ],
    )

    const result = await importTransferFacts(db)

    expect(result.imported).toEqual(0)
    expect(result.skipped).toEqual(0)
    expect(inserted.length).toEqual(0)
  })

  it('defaults bridgeType to "unknown"', async () => {
    const { db, inserted } = mockDb(
      [],
      [makeTransfer({ bridgeType: undefined })],
    )

    const result = await importTransferFacts(db)

    expect(result.imported).toEqual(1)
    expect(inserted[0]!.arguments).toInclude('unknown')
  })

  it('preserves native token addresses', async () => {
    const { db, inserted } = mockDb(
      [],
      [
        makeTransfer({
          srcTokenAddress: 'native',
          dstTokenAddress: PADDED_ADDR_B,
        }),
      ],
    )

    const result = await importTransferFacts(db)

    expect(result.imported).toEqual(1)
    expect(inserted[0]!.arguments).toEqual(
      `ethereum,"native",base,"${ADDR_B}",testPlugin,unknown`,
    )
  })

  it('throws when cropping would remove non-zero bytes', async () => {
    const invalidPaddedAddress = `0x${'1'.repeat(24)}${ADDR_A.slice(2)}`
    const { db } = mockDb(
      [],
      [
        makeTransfer({
          srcTokenAddress: invalidPaddedAddress,
        }),
      ],
    )

    await expect(importTransferFacts(db)).toBeRejectedWith(
      'Cannot safely crop non-zero padded token address',
    )
  })
})
