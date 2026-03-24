import type { InteropTransferRecord } from '@l2beat/database'
import { InMemoryCache, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  getInteropProtocolTransfers,
  toInteropProtocolTransferDetailsItem,
} from './getInteropProtocolTransfers'
import type { InteropProtocolTransfersParams } from './types'

describe(toInteropProtocolTransferDetailsItem.name, () => {
  it('maps transfer details with source and destination token amounts', () => {
    const result = toInteropProtocolTransferDetailsItem(
      transfer({
        srcAmount: undefined,
        dstAmount: 12.34,
        srcSymbol: undefined,
        dstSymbol: 'USDC',
        srcValueUsd: undefined,
        dstValueUsd: 12.34,
      }),
      new Map([
        ['ethereum', 'https://etherscan.io'],
        ['arbitrum', 'https://arbiscan.io'],
      ]),
      new Map(),
    )

    expect(result).toEqual({
      transferId: 'transfer-id',
      timestamp: 123,
      srcAmount: undefined,
      srcSymbol: undefined,
      srcTokenIconUrl: '/images/token-placeholder.png',
      dstAmount: 12.34,
      dstSymbol: 'USDC',
      dstTokenIconUrl: '/images/token-placeholder.png',
      valueUsd: 12.34,
      duration: 60,
      srcChain: 'ethereum',
      srcTxHash: '0xsrc',
      srcTxHashHref: 'https://etherscan.io/tx/0xsrc',
      dstChain: 'arbitrum',
      dstTxHash: '0xdst',
      dstTxHashHref: 'https://arbiscan.io/tx/0xdst',
    })
  })

  it('adds explorer tx hash links when explorer urls are available', () => {
    const result = toInteropProtocolTransferDetailsItem(
      transfer(),
      new Map([
        ['ethereum', 'https://etherscan.io'],
        ['arbitrum', 'https://arbiscan.io'],
      ]),
      new Map([
        [
          'eth',
          { symbol: 'ETH', iconUrl: 'https://token/eth.png', issuer: null },
        ],
      ]),
    )

    expect(result.srcTxHashHref).toEqual('https://etherscan.io/tx/0xsrc')
    expect(result.dstTxHashHref).toEqual('https://arbiscan.io/tx/0xdst')
    expect(result.srcTokenIconUrl).toEqual('https://token/eth.png')
    expect(result.dstTokenIconUrl).toEqual('https://token/eth.png')
  })

  it('keeps transfer item valid when tx hashes are missing', () => {
    const result = toInteropProtocolTransferDetailsItem(
      transfer({
        srcTxHash: undefined,
        dstTxHash: undefined,
        duration: undefined,
      }),
      new Map([
        ['ethereum', 'https://etherscan.io'],
        ['arbitrum', 'https://arbiscan.io'],
      ]),
      new Map(),
    )

    expect(result.srcTxHash).toEqual(undefined)
    expect(result.srcTxHashHref).toEqual(undefined)
    expect(result.dstTxHash).toEqual(undefined)
    expect(result.dstTxHashHref).toEqual(undefined)
    expect(result.duration).toEqual(undefined)
  })
})

describe(getInteropProtocolTransfers.name, () => {
  it('returns an empty response when from/to selection is empty', async () => {
    let getProjectCalls = 0
    const deps = createDeps({
      getProject: async () => {
        getProjectCalls += 1
        return PROJECT_WITH_PLUGIN
      },
    })

    const emptyFromResult = await getInteropProtocolTransfers(
      params({ from: [] }),
      deps,
    )
    const emptyToResult = await getInteropProtocolTransfers(
      params({ to: [] }),
      deps,
    )

    expect(emptyFromResult).toEqual({
      items: [],
      hasIntegrityMismatch: false,
      nextCursor: undefined,
    })
    expect(emptyToResult).toEqual({
      items: [],
      hasIntegrityMismatch: false,
      nextCursor: undefined,
    })
    expect(getProjectCalls).toEqual(0)
  })

  it('returns mismatch response when transfer stats differ from expected', async () => {
    const deps = createDeps({
      getFilteredTransfersWithStats: async () => ({
        items: [transfer()],
        transferStats: { transferCount: 1, volume: 100 },
        tokensDetailsMap: new Map(),
      }),
    })

    const result = await getInteropProtocolTransfers(
      params({
        expectedTransferCount: 2,
        expectedVolume: 100,
      }),
      deps,
    )

    expect(result).toEqual({
      items: [],
      hasIntegrityMismatch: true,
      nextCursor: undefined,
    })
  })

  it('supports cursor pagination across pages', async () => {
    const transfers = Array.from({ length: 101 }, (_, i) =>
      transfer({
        transferId: `transfer-${i}`,
        srcTxHash: `0xsrc${i}`,
        dstTxHash: `0xdst${i}`,
      }),
    )
    const deps = createDeps({
      getFilteredTransfersWithStats: async () => ({
        items: transfers,
        transferStats: { transferCount: transfers.length, volume: 101 },
        tokensDetailsMap: new Map([
          [
            'eth',
            { symbol: 'ETH', iconUrl: 'https://token/eth.png', issuer: null },
          ],
        ]),
      }),
    })

    const firstPage = await getInteropProtocolTransfers(
      params({
        expectedTransferCount: 101,
        expectedVolume: 101,
      }),
      deps,
    )

    expect(firstPage.hasIntegrityMismatch).toEqual(false)
    expect(firstPage.items.length).toEqual(100)
    expect(firstPage.nextCursor).toEqual(100)
    expect(firstPage.items[0]?.transferId).toEqual('transfer-0')
    expect(firstPage.items[99]?.transferId).toEqual('transfer-99')

    const secondPage = await getInteropProtocolTransfers(
      params({
        expectedTransferCount: 101,
        expectedVolume: 101,
        cursor: 100,
      }),
      deps,
    )

    expect(secondPage.items.length).toEqual(1)
    expect(secondPage.nextCursor).toEqual(undefined)
    expect(secondPage.items[0]?.transferId).toEqual('transfer-100')
  })

  it('reuses cached result for equivalent chain selections in different order', async () => {
    let fetchCalls = 0
    const deps = createDeps({
      getFilteredTransfersWithStats: async () => {
        fetchCalls += 1
        return {
          items: [transfer()],
          transferStats: { transferCount: 1, volume: 1 },
          tokensDetailsMap: new Map(),
        }
      },
    })

    await getInteropProtocolTransfers(
      params({
        from: ['ethereum', 'arbitrum'],
        to: ['optimism', 'base'],
        expectedTransferCount: 1,
        expectedVolume: 1,
      }),
      deps,
    )
    await getInteropProtocolTransfers(
      params({
        from: ['arbitrum', 'ethereum'],
        to: ['base', 'optimism'],
        expectedTransferCount: 1,
        expectedVolume: 1,
      }),
      deps,
    )

    expect(fetchCalls).toEqual(1)
  })
})

const PROJECT_WITH_PLUGIN = {
  interopConfig: {
    plugins: [{ plugin: 'plugin', bridgeType: 'nonMinting' as const }],
  },
}

type TransfersDeps = NonNullable<
  Parameters<typeof getInteropProtocolTransfers>[1]
>

function createDeps(overrides: Partial<TransfersDeps> = {}): TransfersDeps {
  return {
    getProject: async () => PROJECT_WITH_PLUGIN,
    cache: new InMemoryCache({}),
    getFilteredTransfersWithStats: async () => ({
      items: [transfer()],
      transferStats: { transferCount: 1, volume: 2000 },
      tokensDetailsMap: new Map(),
    }),
    ...overrides,
  }
}

function params(
  override: Partial<InteropProtocolTransfersParams> = {},
): InteropProtocolTransfersParams {
  return {
    id: ProjectId('test-project'),
    from: ['ethereum'],
    to: ['arbitrum'],
    type: undefined,
    expectedTransferCount: 1,
    expectedVolume: 2000,
    snapshotTimestamp: UnixTime(123),
    cursor: undefined,
    ...override,
  }
}

function transfer(
  override: Partial<InteropTransferRecord> = {},
): InteropTransferRecord {
  return {
    plugin: 'plugin',
    bridgeType: 'nonMinting',
    transferId: 'transfer-id',
    type: 'deposit',
    duration: 60,
    timestamp: UnixTime(123),
    srcTime: UnixTime(100),
    srcChain: 'ethereum',
    srcTxHash: '0xsrc',
    srcLogIndex: 1,
    srcEventId: 'src-event',
    srcTokenAddress: undefined,
    srcRawAmount: 1n,
    srcWasBurned: false,
    srcAbstractTokenId: 'eth',
    srcSymbol: 'ETH',
    srcAmount: 1,
    srcPrice: 2000,
    srcValueUsd: 2000,
    dstTime: UnixTime(160),
    dstChain: 'arbitrum',
    dstTxHash: '0xdst',
    dstLogIndex: 2,
    dstEventId: 'dst-event',
    dstTokenAddress: undefined,
    dstRawAmount: 1n,
    dstWasMinted: false,
    dstAbstractTokenId: 'eth',
    dstSymbol: 'ETH',
    dstAmount: 1,
    dstPrice: 2000,
    dstValueUsd: 2000,
    isProcessed: true,
    ...override,
  }
}
