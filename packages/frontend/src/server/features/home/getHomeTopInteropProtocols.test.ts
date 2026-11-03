import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { ProtocolEntry } from '../layer2s/interop/types'
import type { InteropProtocolData } from '../layer2s/interop/utils/getTopProtocols'
import { selectHomeTopInteropProtocols } from './getHomeTopInteropProtocols'

// Method: feed the selector full dashboard entries (with heavy tokens/chains
// payloads) and assert on the exact rows it returns, so both the ranking and
// the dropped fields are pinned down.
describe(selectHomeTopInteropProtocols.name, () => {
  it('keeps the five protocols with the highest volume, stripped to the rendered fields', () => {
    const slugs = ['a', 'b', 'c', 'd', 'e', 'f']
    const entries = slugs.map((slug, i) => entry(slug, (i + 1) * 100))
    const topProtocols = slugs.map((slug, i) =>
      topProtocol(slug, (i + 1) * 100),
    )

    const result = selectHomeTopInteropProtocols({ entries, topProtocols })

    expect(result).toEqual(
      ['f', 'e', 'd', 'c', 'b'].map((slug) => ({
        slug,
        iconUrl: `/icons/${slug}.png`,
        name: slug.toUpperCase(),
        description: `${slug} description`,
        type: 'multichain',
        isAggregate: undefined,
        subgroup: undefined,
        volume: (slugs.indexOf(slug) + 1) * 100,
      })),
    )
  })

  it('falls back to entries by volume and skips protocols without volume', () => {
    const result = selectHomeTopInteropProtocols({
      entries: [entry('a', 0), entry('b', 50), entry('c', 300)],
      topProtocols: [],
    })

    expect(result.map((row) => row.slug)).toEqual(['c', 'b'])
  })

  it('returns no rows when there is no dashboard data', () => {
    expect(selectHomeTopInteropProtocols(null)).toEqual([])
  })
})

function entry(slug: string, volume: number): ProtocolEntry {
  return {
    id: ProjectId(slug),
    slug,
    iconUrl: `/icons/${slug}.png`,
    name: slug.toUpperCase(),
    shortName: undefined,
    description: `${slug} description`,
    type: 'multichain',
    bridgeTypes: ['nonMinting'],
    isAggregate: undefined,
    subgroup: undefined,
    volume,
    tokens: { items: [], remainingCount: 42 },
    chains: { items: [], remainingCount: 42 },
    transferCount: 10,
    averageValue: 1,
    minTransferValueUsd: 1,
    maxTransferValueUsd: 1,
    averageDuration: null,
    byBridgeType: undefined,
    averageValueInFlight: undefined,
    netMintedValue: undefined,
    topRoute: undefined,
    snapshotTimestamp: undefined,
    filterable: [],
  }
}

function topProtocol(slug: string, volume: number): InteropProtocolData {
  return {
    name: slug.toUpperCase(),
    slug,
    iconUrl: `/icons/${slug}.png`,
    volume: { value: volume, share: 0 },
    transfers: { value: 0, share: 0 },
  }
}
