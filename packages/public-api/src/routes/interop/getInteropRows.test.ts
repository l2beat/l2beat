import type {
  Database,
  InteropMessageRecord,
  InteropTransferRecord,
} from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import {
  getInteropMessagesData,
  getInteropTransfersData,
  type InteropRowsParams,
  interopRowsFingerprint,
  normalizeInteropRowsQuery,
} from './getInteropRows'
import { decodeCursor } from './utils/cursor'

const BASE = UnixTime(1_700_000_000)

describe(normalizeInteropRowsQuery.name, () => {
  it('converts numeric params and applies defaults', () => {
    expect(
      normalizeInteropRowsQuery({
        plugin: 'across',
        from: '1700000000',
        to: '1700000100',
        limit: '250',
      }),
    ).toEqual({
      plugin: 'across',
      type: undefined,
      app: undefined,
      srcChain: undefined,
      dstChain: undefined,
      from: 1_700_000_000,
      to: 1_700_000_100,
      order: 'desc',
      limit: 250,
    })
  })

  it('defaults order to desc and limit to 100', () => {
    const params = normalizeInteropRowsQuery({ plugin: 'across' })

    expect(params.order).toEqual('desc')
    expect(params.limit).toEqual(100)
  })
})

describe(getInteropMessagesData.name, () => {
  it('requests one row beyond the page and trims it off', async () => {
    const getPage = mockFn().resolvesTo([
      message('m3', BASE + 200),
      message('m2', BASE + 100),
      message('m1', BASE),
    ])
    const db = messageDb(getPage)
    const params = paramsOf({ limit: 2 })

    const result = await getInteropMessagesData(db, params, undefined)

    expect(getPage).toHaveBeenOnlyCalledWith({
      filter: {
        plugin: 'across',
        type: undefined,
        app: undefined,
        srcChain: undefined,
        dstChain: undefined,
        from: undefined,
        to: undefined,
      },
      order: 'desc',
      limit: 3,
      cursor: undefined,
    })
    expect(result.data.map((r) => r.messageId)).toEqual(['m3', 'm2'])
  })

  it('returns a cursor pointing at the last row of the page', async () => {
    const db = messageDb(
      mockFn().resolvesTo([
        message('m3', BASE + 200),
        message('m2', BASE + 100),
        message('m1', BASE),
      ]),
    )
    const params = paramsOf({ limit: 2 })

    const result = await getInteropMessagesData(db, params, undefined)

    assert(result.nextCursor !== null)
    expect(
      decodeCursor(
        result.nextCursor,
        interopRowsFingerprint('messages', params),
      ),
    ).toEqual({
      ok: true,
      cursor: { timestamp: BASE + 100, id: 'm2' },
    })
  })

  it('returns a null cursor on the last page', async () => {
    const db = messageDb(
      mockFn().resolvesTo([message('m2', BASE + 100), message('m1', BASE)]),
    )

    const result = await getInteropMessagesData(
      db,
      paramsOf({ limit: 2 }),
      undefined,
    )

    expect(result.data).toHaveLength(2)
    expect(result.nextCursor).toEqual(null)
  })

  it('returns a null cursor for an empty page', async () => {
    const db = messageDb(mockFn().resolvesTo([]))

    const result = await getInteropMessagesData(db, paramsOf(), undefined)

    expect(result).toEqual({ data: [], nextCursor: null })
  })

  it('forwards the cursor as a keyset position', async () => {
    const getPage = mockFn().resolvesTo([])
    const db = messageDb(getPage)

    await getInteropMessagesData(db, paramsOf(), {
      timestamp: BASE,
      id: 'm1',
    })

    expect(getPage.calls[0]?.args[0]?.cursor).toEqual({
      timestamp: BASE,
      messageId: 'm1',
    })
  })

  it('maps absent fields to null instead of dropping them', async () => {
    const db = messageDb(
      mockFn().resolvesTo([
        {
          ...message('m1', BASE),
          duration: undefined,
          srcChain: undefined,
          srcTime: undefined,
          srcTxHash: undefined,
          srcLogIndex: undefined,
          dstChain: undefined,
          dstTime: undefined,
          dstTxHash: undefined,
          dstLogIndex: undefined,
        },
      ]),
    )

    const result = await getInteropMessagesData(db, paramsOf(), undefined)

    expect(result.data[0]).toEqual({
      plugin: 'across',
      type: 'across.Message',
      app: 'app',
      messageId: 'm1',
      timestamp: BASE,
      duration: null,
      srcChain: null,
      srcTime: null,
      srcTxHash: null,
      srcLogIndex: null,
      dstChain: null,
      dstTime: null,
      dstTxHash: null,
      dstLogIndex: null,
    })
  })

  it('does not expose internal event ids', async () => {
    const db = messageDb(mockFn().resolvesTo([message('m1', BASE)]))

    const result = await getInteropMessagesData(db, paramsOf(), undefined)

    expect(Object.keys(result.data[0] ?? {})).not.toInclude('srcEventId')
    expect(Object.keys(result.data[0] ?? {})).not.toInclude('dstEventId')
  })
})

describe(getInteropTransfersData.name, () => {
  it('passes filters through and trims the lookahead row', async () => {
    const getPage = mockFn().resolvesTo([
      transfer('t2', BASE + 100),
      transfer('t1', BASE),
    ])
    const db = transferDb(getPage)

    const result = await getInteropTransfersData(
      db,
      {
        ...paramsOf({ limit: 1 }),
        type: 'across.Transfer',
        srcChain: 'ethereum',
        dstChain: 'base',
        from: BASE,
        to: BASE + 500,
        order: 'asc',
      },
      undefined,
    )

    expect(getPage).toHaveBeenOnlyCalledWith({
      filter: {
        plugin: 'across',
        type: 'across.Transfer',
        srcChain: 'ethereum',
        dstChain: 'base',
        from: BASE,
        to: BASE + 500,
      },
      order: 'asc',
      limit: 2,
      cursor: undefined,
    })
    expect(result.data.map((r) => r.transferId)).toEqual(['t2'])
    expect(result.nextCursor).not.toEqual(null)
  })

  it('serializes raw amounts as decimal strings', async () => {
    const db = transferDb(
      mockFn().resolvesTo([
        {
          ...transfer('t1', BASE),
          srcRawAmount: 12345678901234567890n,
          dstRawAmount: undefined,
        },
      ]),
    )

    const result = await getInteropTransfersData(db, paramsOf(), undefined)

    expect(result.data[0]?.srcRawAmount).toEqual('12345678901234567890')
    expect(result.data[0]?.dstRawAmount).toEqual(null)
  })

  it('keeps the declared bridge type when the plugin set one', async () => {
    const db = transferDb(
      mockFn().resolvesTo([
        { ...transfer('t1', BASE), bridgeType: 'burnAndMint' as const },
      ]),
    )

    const result = await getInteropTransfersData(db, paramsOf(), undefined)

    expect(result.data[0]?.bridgeType).toEqual('burnAndMint')
  })

  it('derives the bridge type from the supply flags when undeclared', async () => {
    const db = transferDb(
      mockFn().resolvesTo([
        {
          ...transfer('t1', BASE),
          bridgeType: undefined,
          srcWasBurned: true,
          dstWasMinted: false,
        },
        {
          ...transfer('t2', BASE),
          bridgeType: undefined,
          srcWasBurned: undefined,
          dstWasMinted: undefined,
        },
      ]),
    )

    const result = await getInteropTransfersData(db, paramsOf(), undefined)

    expect(result.data.map((r) => r.bridgeType)).toEqual([
      'lockAndMint',
      'unknown',
    ])
  })

  it('exposes isProcessed so pending pricing is not read as missing value', async () => {
    const db = transferDb(
      mockFn().resolvesTo([
        {
          ...transfer('t1', BASE),
          isProcessed: false,
          srcValueUsd: undefined,
          dstValueUsd: undefined,
        },
      ]),
    )

    const result = await getInteropTransfersData(db, paramsOf(), undefined)

    expect(result.data[0]?.isProcessed).toEqual(false)
    expect(result.data[0]?.srcValueUsd).toEqual(null)
    expect(result.data[0]?.dstValueUsd).toEqual(null)
  })
})

describe(interopRowsFingerprint.name, () => {
  it('separates messages from transfers', () => {
    const params = paramsOf()

    expect(interopRowsFingerprint('messages', params)).not.toEqual(
      interopRowsFingerprint('transfers', params),
    )
  })

  it('ignores the page size', () => {
    expect(interopRowsFingerprint('messages', paramsOf({ limit: 10 }))).toEqual(
      interopRowsFingerprint('messages', paramsOf({ limit: 500 })),
    )
  })

  it('changes with the order', () => {
    expect(interopRowsFingerprint('messages', paramsOf())).not.toEqual(
      interopRowsFingerprint('messages', {
        ...paramsOf(),
        order: 'asc',
      }),
    )
  })
})

function paramsOf(
  overrides: Partial<InteropRowsParams> = {},
): InteropRowsParams {
  return {
    plugin: 'across',
    type: undefined,
    app: undefined,
    srcChain: undefined,
    dstChain: undefined,
    from: undefined,
    to: undefined,
    order: 'desc',
    limit: 100,
    ...overrides,
  }
}

function messageDb(getPage: Database['interopMessage']['getPage']): Database {
  return mockObject<Database>({
    interopMessage: mockObject<Database['interopMessage']>({ getPage }),
  })
}

function transferDb(getPage: Database['interopTransfer']['getPage']): Database {
  return mockObject<Database>({
    interopTransfer: mockObject<Database['interopTransfer']>({ getPage }),
  })
}

function message(messageId: string, timestamp: UnixTime): InteropMessageRecord {
  return {
    plugin: 'across',
    messageId,
    type: 'across.Message',
    app: 'app',
    duration: 60,
    timestamp,
    srcTime: timestamp - 60,
    srcChain: 'ethereum',
    srcTxHash: `0x${messageId}src`,
    srcLogIndex: 1,
    srcEventId: 'src-event',
    dstTime: timestamp,
    dstChain: 'base',
    dstTxHash: `0x${messageId}dst`,
    dstLogIndex: 2,
    dstEventId: 'dst-event',
  }
}

function transfer(
  transferId: string,
  timestamp: UnixTime,
): InteropTransferRecord {
  return {
    plugin: 'across',
    transferId,
    type: 'across.Transfer',
    bridgeType: 'nonMinting',
    duration: 60,
    timestamp,
    srcTime: timestamp - 60,
    srcChain: 'ethereum',
    srcTxHash: `0x${transferId}src`,
    srcLogIndex: 1,
    srcEventId: 'src-event',
    srcTokenAddress: '0xtoken',
    srcRawAmount: 1_000n,
    srcWasBurned: false,
    srcAbstractTokenId: 'eth',
    srcSymbol: 'ETH',
    srcAmount: 1,
    srcPrice: 2000,
    srcValueUsd: 2000,
    dstTime: timestamp,
    dstChain: 'base',
    dstTxHash: `0x${transferId}dst`,
    dstLogIndex: 2,
    dstEventId: 'dst-event',
    dstTokenAddress: '0xtoken2',
    dstRawAmount: 1_000n,
    dstWasMinted: false,
    dstAbstractTokenId: 'eth',
    dstSymbol: 'ETH',
    dstAmount: 1,
    dstPrice: 2000,
    dstValueUsd: 2000,
    isProcessed: true,
  }
}
