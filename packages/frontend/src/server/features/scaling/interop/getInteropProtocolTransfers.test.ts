import type { InteropPlugin, Project } from '@l2beat/config'
import type { InteropTransferRecord } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { TOKEN_PLACEHOLDER_ICON_URL } from '~/utils/tokenPlaceholderIconUrl'
import {
  getTransferBridge,
  toInteropProtocolTransferDetailsItem,
} from './getInteropProtocolTransfers'

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
        [
          'ethereum',
          {
            name: 'Ethereum',
            iconUrl: '/icons/ethereum.png',
            explorerUrl: 'https://etherscan.io',
          },
        ],
        [
          'arbitrum',
          {
            name: 'Arbitrum One',
            iconUrl: '/icons/arbitrum.png',
            explorerUrl: 'https://arbiscan.io',
          },
        ],
      ]),
      new Map(),
      { name: 'Across', href: '/interop/protocols/across' },
    )

    expect(result).toEqual({
      transferId: 'transfer-id',
      timestamp: 123,
      srcAmount: undefined,
      srcSymbol: 'Unknown',
      srcAbstractTokenId: 'eth',
      srcTokenIssuer: null,
      srcTokenIconUrl: TOKEN_PLACEHOLDER_ICON_URL,
      dstAmount: 12.34,
      dstSymbol: 'USDC',
      dstAbstractTokenId: 'eth',
      dstTokenIssuer: null,
      dstTokenIconUrl: TOKEN_PLACEHOLDER_ICON_URL,
      valueUsd: 12.34,
      bridge: { name: 'Across', href: '/interop/protocols/across' },
      duration: 60,
      srcChain: 'Ethereum',
      srcChainIconUrl: '/icons/ethereum.png',
      srcTxHash: '0xsrc',
      srcTxHashHref: 'https://etherscan.io/tx/0xsrc',
      dstChain: 'Arbitrum One',
      dstChainIconUrl: '/icons/arbitrum.png',
      dstTxHash: '0xdst',
      dstTxHashHref: 'https://arbiscan.io/tx/0xdst',
    })
  })

  it('adds explorer tx hash links when explorer urls are available', () => {
    const result = toInteropProtocolTransferDetailsItem(
      transfer(),
      new Map([
        [
          'ethereum',
          {
            name: 'Ethereum',
            iconUrl: '/icons/ethereum.png',
            explorerUrl: 'https://etherscan.io',
          },
        ],
        [
          'arbitrum',
          {
            name: 'Arbitrum One',
            iconUrl: '/icons/arbitrum.png',
            explorerUrl: 'https://arbiscan.io',
          },
        ],
      ]),
      new Map([
        [
          'eth',
          { symbol: 'ETH', iconUrl: 'https://token/eth.png', issuer: null },
        ],
      ]),
      { name: 'Across', href: '/interop/protocols/across' },
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
        [
          'ethereum',
          {
            name: 'Ethereum',
            iconUrl: '/icons/ethereum.png',
            explorerUrl: 'https://etherscan.io',
          },
        ],
        [
          'arbitrum',
          {
            name: 'Arbitrum One',
            iconUrl: '/icons/arbitrum.png',
            explorerUrl: 'https://arbiscan.io',
          },
        ],
      ]),
      new Map(),
      { name: 'Across', href: '/interop/protocols/across' },
    )

    expect(result.srcTxHash).toEqual(undefined)
    expect(result.srcTxHashHref).toEqual(undefined)
    expect(result.dstTxHash).toEqual(undefined)
    expect(result.dstTxHashHref).toEqual(undefined)
    expect(result.duration).toEqual(undefined)
  })
})

describe(getTransferBridge.name, () => {
  it('matches the project using the plugin configuration', () => {
    const result = getTransferBridge(transfer({ plugin: 'across' }), [
      project({
        id: 'other',
        slug: 'other',
        name: 'Other',
        plugins: [{ plugin: 'relay', bridgeType: 'nonMinting' }],
      }),
      project({
        id: 'across',
        slug: 'across',
        name: 'Across',
        plugins: [{ plugin: 'across', bridgeType: 'nonMinting' }],
      }),
    ])

    expect(result).toEqual({
      name: 'Across',
      href: '/interop/protocols/across',
    })
  })

  it('uses plugin qualifiers to distinguish projects sharing a plugin', () => {
    const result = getTransferBridge(
      transfer({ plugin: 'opstack', bridgeType: 'lockAndMint' }),
      [
        project({
          id: 'base',
          slug: 'base',
          name: 'Base',
          plugins: [
            { plugin: 'opstack', bridgeType: 'lockAndMint', chain: 'base' },
          ],
        }),
        project({
          id: 'arbitrum',
          slug: 'arbitrum',
          name: 'Arbitrum One',
          plugins: [
            {
              plugin: 'opstack',
              bridgeType: 'lockAndMint',
              chain: 'arbitrum',
            },
          ],
        }),
      ],
    )

    expect(result).toEqual({
      name: 'Arbitrum One',
      href: '/interop/protocols/arbitrum',
    })
  })

  it('prefers a subgroup over an aggregate protocol', () => {
    const result = getTransferBridge(
      transfer({ plugin: 'layerzero-v2-ofts', bridgeType: 'lockAndMint' }),
      [
        project({
          id: 'layerzero',
          slug: 'layerzero',
          name: 'LayerZero',
          isAggregate: true,
          plugins: [{ plugin: 'layerzero-v2-ofts', bridgeType: 'lockAndMint' }],
        }),
        project({
          id: 'usdt0',
          slug: 'usdt0',
          name: 'USDT0',
          plugins: [{ plugin: 'layerzero-v2-ofts', bridgeType: 'lockAndMint' }],
        }),
      ],
    )

    expect(result).toEqual({ name: 'USDT0', href: '/interop/protocols/usdt0' })
  })
})

function project({
  id,
  slug,
  name,
  plugins,
  isAggregate,
}: {
  id: string
  slug: string
  name: string
  plugins: InteropPlugin[]
  isAggregate?: boolean
}): Project<'interopConfig'> {
  return {
    id: ProjectId(id),
    slug,
    name,
    shortName: undefined,
    addedAt: UnixTime(0),
    interopConfig: {
      plugins,
      type: 'multichain' as const,
      isAggregate,
    },
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
