import type { InteropPlugin, Project } from '@l2beat/config'
import type { InteropTransferRecord } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { createTransferBridgeResolver } from './createTransferBridgeResolver'

describe(createTransferBridgeResolver.name, () => {
  it('matches the project using the plugin configuration', () => {
    const resolve = createTransferBridgeResolver([
      project({
        id: 'other',
        plugins: [{ plugin: 'relay', bridgeType: 'nonMinting' }],
      }),
      project({
        id: 'across',
        name: 'Across',
        plugins: [{ plugin: 'across', bridgeType: 'nonMinting' }],
      }),
    ])

    expect(resolve(transfer({ plugin: 'across' }))).toEqual({
      name: 'Across',
      href: '/interop/protocols/across',
    })
  })

  it('uses plugin qualifiers to distinguish projects sharing a plugin', () => {
    const resolve = createTransferBridgeResolver([
      project({
        id: 'base',
        plugins: [
          { plugin: 'opstack', bridgeType: 'lockAndMint', chain: 'base' },
        ],
      }),
      project({
        id: 'optimism',
        name: 'OP Mainnet',
        interopName: 'OP Canonical',
        plugins: [
          { plugin: 'opstack', bridgeType: 'lockAndMint', chain: 'optimism' },
        ],
      }),
    ])

    expect(
      resolve(transfer({ plugin: 'opstack', bridgeType: 'lockAndMint' })),
    ).toEqual({
      name: 'OP Canonical',
      href: '/interop/protocols/optimism',
    })
  })

  it('uses the subgroup when both it and its parent match', () => {
    const resolve = createTransferBridgeResolver([
      project({
        id: 'layerzero',
        plugins: [{ plugin: 'layerzero-v2-ofts', bridgeType: 'lockAndMint' }],
      }),
      project({
        id: 'usdt0',
        name: 'USDT0',
        subgroupId: 'layerzero',
        plugins: [{ plugin: 'layerzero-v2-ofts', bridgeType: 'lockAndMint' }],
      }),
    ])

    expect(
      resolve(
        transfer({ plugin: 'layerzero-v2-ofts', bridgeType: 'lockAndMint' }),
      ),
    ).toEqual({ name: 'USDT0', href: '/interop/protocols/usdt0' })
  })

  it('rejects ambiguous matches', () => {
    const resolve = createTransferBridgeResolver([
      project({
        id: 'first',
        plugins: [{ plugin: 'across', bridgeType: 'nonMinting' }],
      }),
      project({
        id: 'second',
        plugins: [{ plugin: 'across', bridgeType: 'nonMinting' }],
      }),
    ])

    expect(() => resolve(transfer({ plugin: 'across' }))).toThrow(
      /Ambiguous interop projects for plugin across: first, second/,
    )
  })

  it('rejects transfers without a matching project', () => {
    const resolve = createTransferBridgeResolver([
      project({
        id: 'relay',
        plugins: [{ plugin: 'relay', bridgeType: 'nonMinting' }],
      }),
    ])

    expect(() => resolve(transfer({ plugin: 'across' }))).toThrow(
      /No interop project found for plugin across/,
    )
  })
})

function project({
  id,
  name = id,
  interopName,
  plugins,
  subgroupId,
}: {
  id: string
  name?: string
  interopName?: string
  plugins: InteropPlugin[]
  subgroupId?: string
}): Project<'interopConfig'> {
  return {
    id: ProjectId(id),
    slug: id,
    name,
    shortName: undefined,
    addedAt: UnixTime(0),
    interopConfig: {
      name: interopName,
      plugins,
      type: 'multichain',
      subgroupId: subgroupId ? ProjectId(subgroupId) : undefined,
    },
  }
}

function transfer(
  override: Partial<InteropTransferRecord> = {},
): InteropTransferRecord {
  return {
    plugin: 'across',
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
    dstChain: 'optimism',
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
