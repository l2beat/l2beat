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

function mockDb(
  existingFacts: TokenFactInputRecord[],
  transfers: InteropTransferRecord[],
) {
  const inserted: { name: string; arguments: string }[] = []
  return {
    db: {
      tokenFactInput: {
        getByName: async () => existingFacts,
        insertMany: async (records: { name: string; arguments: string }[]) => {
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
        }),
      ],
    )

    const result = await importTransferFacts(db)

    expect(result.imported).toEqual(1)
    expect(result.skipped).toEqual(0)
    expect(inserted.length).toEqual(1)
    expect(inserted[0]!.name).toEqual('transfer')
    expect(inserted[0]!.arguments).toEqual(
      `"ethereum","${ADDR_A}","base","${ADDR_B}",hop,lockAndMint`,
    )
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

  it('skips transfers that already exist as facts', async () => {
    const existingFact: TokenFactInputRecord = {
      id: 1,
      name: 'transfer',
      arguments: `"ethereum","${ADDR_A}","base","${ADDR_B}",hop,lockAndMint`,
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

  it('treats uppercase and lowercase incoming addresses as the same fact', async () => {
    const existingFact: TokenFactInputRecord = {
      id: 1,
      name: 'transfer',
      arguments: `"ethereum","${ADDR_A}","base","${ADDR_B}",hop,lockAndMint`,
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
})
