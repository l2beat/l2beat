import { expect } from 'earl'
import {
  buildInteropTransferIndex,
  type InteropTransferMatch,
  summarizeTransferPlugins,
} from './tokenIngestionUtils'

describe(buildInteropTransferIndex.name, () => {
  it('carries plugin and sample tx hashes onto matches', () => {
    const srcToken = `0x${'a'.repeat(40)}`
    const dstToken = `0x${'b'.repeat(40)}`
    const index = buildInteropTransferIndex([
      {
        plugin: 'cctp',
        srcChain: 'ethereum',
        srcTokenAddress: srcToken,
        dstChain: 'base',
        dstTokenAddress: dstToken,
        bridgeType: 'burnAndMint',
        srcWasBurned: true,
        dstWasMinted: true,
        transferCount: 3,
        sampleTransferId: 'transfer-1',
        sampleSrcTxHash: '0xsrc',
        sampleDstTxHash: '0xdst',
      },
    ])

    const matches = index.findInvolving({
      chain: 'ethereum',
      address: srcToken,
    })

    expect(matches).toEqual([
      {
        plugin: 'cctp',
        bridgeType: 'burnAndMint',
        transferCount: 3,
        sampleTransferId: 'transfer-1',
        sampleSrcTxHash: '0xsrc',
        sampleDstTxHash: '0xdst',
        token: { chain: 'ethereum', address: srcToken },
        otherToken: { chain: 'base', address: dstToken },
      },
    ])
  })
})

describe(summarizeTransferPlugins.name, () => {
  it('sums counts per plugin and sorts by count, then name', () => {
    const summary = summarizeTransferPlugins([
      match({ plugin: 'oft', transferCount: 1 }),
      match({ plugin: 'cctp', transferCount: 2 }),
      match({ plugin: 'cctp', transferCount: 3 }),
      match({ plugin: 'across', transferCount: 1 }),
    ])

    expect(
      summary.map(({ plugin, transferCount }) => ({ plugin, transferCount })),
    ).toEqual([
      { plugin: 'cctp', transferCount: 5 },
      { plugin: 'across', transferCount: 1 },
      { plugin: 'oft', transferCount: 1 },
    ])
  })

  it('prefers a sample with tx hashes over a busier one without', () => {
    const summary = summarizeTransferPlugins([
      match({
        plugin: 'cctp',
        transferCount: 10,
        sampleSrcTxHash: undefined,
        sampleDstTxHash: undefined,
      }),
      match({
        plugin: 'cctp',
        transferCount: 1,
        sampleSrcTxHash: undefined,
        sampleDstTxHash: '0xdst-only',
      }),
    ])

    expect(summary).toEqual([
      {
        plugin: 'cctp',
        transferCount: 11,
        sampleSrcTxHash: undefined,
        sampleDstTxHash: '0xdst-only',
      },
    ])
  })

  it('prefers the busiest route among samples with tx hashes', () => {
    const summary = summarizeTransferPlugins([
      match({
        plugin: 'cctp',
        transferCount: 1,
        sampleSrcTxHash: '0xquiet-src',
        sampleDstTxHash: '0xquiet-dst',
      }),
      match({
        plugin: 'cctp',
        transferCount: 10,
        sampleSrcTxHash: '0xbusy-src',
        sampleDstTxHash: '0xbusy-dst',
      }),
    ])

    expect(summary).toEqual([
      {
        plugin: 'cctp',
        transferCount: 11,
        sampleSrcTxHash: '0xbusy-src',
        sampleDstTxHash: '0xbusy-dst',
      },
    ])
  })
})

function match(overrides: Partial<InteropTransferMatch>): InteropTransferMatch {
  return {
    plugin: 'plugin1',
    bridgeType: 'lockAndMint',
    transferCount: 1,
    sampleTransferId: 'transfer-id',
    sampleSrcTxHash: '0xsrc',
    sampleDstTxHash: '0xdst',
    token: { chain: 'ethereum', address: '0xaaa' },
    otherToken: { chain: 'base', address: '0xbbb' },
    ...overrides,
  }
}
