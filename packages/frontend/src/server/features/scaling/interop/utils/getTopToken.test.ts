import type { Project } from '@l2beat/config'
import { ProjectId, type ProjectId as ProjectIdType } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { AggregatedInteropTransferWithTokens } from '../types'
import { getTopToken } from './getTopToken'

describe(getTopToken.name, () => {
  it('aggregates top token across records and protocols', () => {
    const interopProjects = [
      project({ id: 'p1', name: 'Relay', slug: 'relay' }),
      project({ id: 'p2', name: 'Wormhole', slug: 'wormhole' }),
    ]

    const result = getTopToken({
      records: [
        record({
          projectId: 'p1',
          tokens: [{ id: 'eth', volume: 100, transferCount: 10 }],
        }),
        record({
          projectId: 'p1',
          tokens: [{ id: 'eth', volume: 40, transferCount: 4 }],
        }),
        record({
          projectId: 'p2',
          tokens: [{ id: 'eth', volume: 200, transferCount: 5 }],
        }),
        record({
          projectId: 'p2',
          tokens: [{ id: 'usdc', volume: 50, transferCount: 50 }],
        }),
      ],
      tokensDetailsMap: new Map([
        ['eth', { symbol: 'ETH', iconUrl: '/eth.png' }],
        ['usdc', { symbol: 'USDC', iconUrl: '/usdc.png' }],
      ]),
      interopProjects,
      subgroupProjects: new Set(),
    })

    expect(result).toEqual({
      symbol: 'ETH',
      iconUrl: '/eth.png',
      volume: 340,
      transferCount: 19,
      topProtocol: {
        name: 'Wormhole',
        iconUrl: '/icons/wormhole.png',
      },
    })
  })

  it('ignores subgroup project records', () => {
    const interopProjects = [
      project({ id: 'main', name: 'Main protocol', slug: 'main' }),
      project({ id: 'sub', name: 'Sub protocol', slug: 'sub' }),
    ]

    const result = getTopToken({
      records: [
        record({
          projectId: 'sub',
          tokens: [{ id: 'eth', volume: 1000, transferCount: 100 }],
        }),
        record({
          projectId: 'main',
          tokens: [{ id: 'usdc', volume: 100, transferCount: 10 }],
        }),
      ],
      tokensDetailsMap: new Map([
        ['eth', { symbol: 'ETH', iconUrl: '/eth.png' }],
        ['usdc', { symbol: 'USDC', iconUrl: '/usdc.png' }],
      ]),
      interopProjects,
      subgroupProjects: new Set([ProjectId('sub')]),
    })

    expect(result).toEqual({
      symbol: 'USDC',
      iconUrl: '/usdc.png',
      volume: 100,
      transferCount: 10,
      topProtocol: {
        name: 'Main protocol',
        iconUrl: '/icons/main.png',
      },
    })
  })

  it('selects top protocol by token volume, not transfer count', () => {
    const interopProjects = [
      project({ id: 'p1', name: 'Relay', slug: 'relay' }),
      project({ id: 'p2', name: 'Wormhole', slug: 'wormhole' }),
    ]

    const result = getTopToken({
      records: [
        record({
          projectId: 'p1',
          tokens: [{ id: 'eth', volume: 10, transferCount: 1000 }],
        }),
        record({
          projectId: 'p2',
          tokens: [{ id: 'eth', volume: 20, transferCount: 1 }],
        }),
      ],
      tokensDetailsMap: new Map([
        ['eth', { symbol: 'ETH', iconUrl: '/eth.png' }],
      ]),
      interopProjects,
      subgroupProjects: new Set(),
    })

    expect(result?.topProtocol).toEqual({
      name: 'Wormhole',
      iconUrl: '/icons/wormhole.png',
    })
  })

  it('breaks top-token ties by transfer count', () => {
    const interopProjects = [project({ id: 'p1', name: 'Relay', slug: 'relay' })]

    const result = getTopToken({
      records: [
        record({
          projectId: 'p1',
          tokens: [
            { id: 'eth', volume: 100, transferCount: 10 },
            { id: 'usdc', volume: 100, transferCount: 20 },
          ],
        }),
      ],
      tokensDetailsMap: new Map([
        ['eth', { symbol: 'ETH', iconUrl: '/eth.png' }],
        ['usdc', { symbol: 'USDC', iconUrl: '/usdc.png' }],
      ]),
      interopProjects,
      subgroupProjects: new Set(),
    })

    expect(result?.symbol).toEqual('USDC')
    expect(result?.transferCount).toEqual(20)
  })

  it('skips tokens missing metadata', () => {
    const interopProjects = [project({ id: 'p1', name: 'Relay', slug: 'relay' })]

    const result = getTopToken({
      records: [
        record({
          projectId: 'p1',
          tokens: [
            { id: 'missing', volume: 1000, transferCount: 100 },
            { id: 'eth', volume: 10, transferCount: 1 },
          ],
        }),
      ],
      tokensDetailsMap: new Map([
        ['eth', { symbol: 'ETH', iconUrl: '/eth.png' }],
      ]),
      interopProjects,
      subgroupProjects: new Set(),
    })

    expect(result?.symbol).toEqual('ETH')
  })

  it('skips unknown token ids and tokens without icon metadata', () => {
    const interopProjects = [project({ id: 'p1', name: 'Relay', slug: 'relay' })]

    const result = getTopToken({
      records: [
        record({
          projectId: 'p1',
          tokens: [
            { id: 'unknown', volume: 5000, transferCount: 500 },
            { id: 'eth', volume: 1000, transferCount: 100 },
            { id: 'usdc', volume: 10, transferCount: 1 },
          ],
        }),
      ],
      tokensDetailsMap: new Map([
        ['eth', { symbol: 'ETH', iconUrl: null }],
        ['usdc', { symbol: 'USDC', iconUrl: '/usdc.png' }],
      ]),
      interopProjects,
      subgroupProjects: new Set(),
    })

    expect(result).toEqual({
      symbol: 'USDC',
      iconUrl: '/usdc.png',
      volume: 10,
      transferCount: 1,
      topProtocol: {
        name: 'Relay',
        iconUrl: '/icons/relay.png',
      },
    })
  })

  it('returns undefined for empty or fully invalid records', () => {
    const interopProjects = [project({ id: 'p1', name: 'Relay', slug: 'relay' })]

    const emptyResult = getTopToken({
      records: [],
      tokensDetailsMap: new Map(),
      interopProjects,
      subgroupProjects: new Set(),
    })

    const invalidResult = getTopToken({
      records: [
        record({
          projectId: 'p1',
          tokens: [{ id: 'missing', volume: 100, transferCount: 1 }],
        }),
      ],
      tokensDetailsMap: new Map(),
      interopProjects,
      subgroupProjects: new Set(),
    })

    expect(emptyResult).toEqual(undefined)
    expect(invalidResult).toEqual(undefined)
  })
})

function project({
  id,
  name,
  slug,
}: {
  id: string
  name: string
  slug: string
}): Project<'interopConfig'> {
  return {
    id: ProjectId(id),
    name,
    slug,
    interopConfig: {
      bridgeType: 'nonMinting',
      isAggregate: false,
    },
  } as unknown as Project<'interopConfig'>
}

function record({
  projectId,
  tokens,
}: {
  projectId: string
  tokens: { id: string; volume: number; transferCount: number }[]
}): AggregatedInteropTransferWithTokens {
  return {
    id: projectId as ProjectIdType,
    tokens: tokens.map((token) => ({
      abstractTokenId: token.id,
      transferCount: token.transferCount,
      totalDurationSum: 0,
      volume: token.volume,
      mintedValueUsd: undefined,
      burnedValueUsd: undefined,
    })),
  } as unknown as AggregatedInteropTransferWithTokens
}
