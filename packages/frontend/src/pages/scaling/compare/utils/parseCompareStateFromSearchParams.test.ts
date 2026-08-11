import { expect } from 'earl'
import { buildCompareUrl } from './buildCompareUrl'
import {
  type CompareChartConfig,
  type CompareChartState,
  createDefaultChartConfig,
} from './compareChartState'
import { parseCompareStateFromSearchParams } from './parseCompareStateFromSearchParams'

const SLUGS = ['arbitrum', 'base', 'optimism']

function parse(search: string) {
  return parseCompareStateFromSearchParams({
    searchParams: new URLSearchParams(search),
    validSlugs: SLUGS,
  })
}

function chart(
  overrides: Partial<CompareChartConfig> = {},
): CompareChartConfig {
  return { ...createDefaultChartConfig(), ...overrides }
}

describe(parseCompareStateFromSearchParams.name, () => {
  it('parses a full state', () => {
    const result = parse(
      'projects=arbitrum,base&range=30d&charts=activity:unit=tps',
    )

    expect(result).toEqual({
      projects: ['arbitrum', 'base'],
      range: '30d',
      charts: [chart({ metric: 'activity', activityUnit: 'tps' })],
    })
  })

  it('returns defaults when params are missing', () => {
    const result = parse('')

    expect(result).toEqual({
      projects: [],
      range: '1y',
      charts: [chart()],
    })
  })

  it('parses multiple charts', () => {
    const result = parse('charts=tvs:filter=stablecoin,activity,costs:unit=gas')

    expect(result.charts).toEqual([
      chart({ tvsFilter: 'stablecoin' }),
      chart({ metric: 'activity' }),
      chart({ metric: 'costs', costsUnit: 'gas' }),
    ])
  })

  it('parses duplicate metrics with independent controls', () => {
    const result = parse('charts=tvs,tvs:unit=eth:filter=ether')

    expect(result.charts).toEqual([
      chart(),
      chart({ tvsUnit: 'eth', tvsFilter: 'ether' }),
    ])
  })

  it('caps the number of charts at four', () => {
    const result = parse('charts=tvs,activity,costs,data-posted,tvs,activity')

    expect(result.charts.map((c) => c.metric)).toEqual([
      'tvs',
      'activity',
      'costs',
      'data-posted',
    ])
  })

  it('drops chart tokens with an unknown metric', () => {
    const result = parse('charts=bogus,activity')

    expect(result.charts).toEqual([chart({ metric: 'activity' })])
  })

  it('falls back to the default chart when every token is invalid', () => {
    const result = parse('charts=bogus,nonsense')

    expect(result.charts).toEqual([chart()])
  })

  it('ignores unknown chart fields and invalid values', () => {
    const result = parse('charts=tvs:unit=beans:flavor=mint:filter=everything')

    expect(result.charts).toEqual([chart()])
  })

  it('applies the unit only to the token metric', () => {
    const result = parse('charts=costs:unit=eth')

    expect(result.charts).toEqual([
      chart({ metric: 'costs', costsUnit: 'eth' }),
    ])
  })

  it('parses the tvs token exclusion toggles', () => {
    const result = parse('charts=tvs:excludeAssociated=true:excludeRwa=false')

    expect(result.charts).toEqual([
      chart({
        excludeAssociatedTokens: true,
        excludeRwaRestrictedTokens: false,
      }),
    ])
  })

  it('drops unknown slugs and deduplicates', () => {
    const result = parse('projects=arbitrum,ethereum,arbitrum,nonsense,base')

    expect(result.projects).toEqual(['arbitrum', 'base'])
  })

  it('does not cap the number of selected projects', () => {
    const slugs = Array.from({ length: 12 }, (_, i) => `project-${i}`)
    const result = parseCompareStateFromSearchParams({
      searchParams: new URLSearchParams(`projects=${slugs.join(',')}`),
      validSlugs: slugs,
    })

    expect(result.projects).toEqual(slugs)
  })

  it('parses a custom range', () => {
    const result = parse('range=1700000000-1710000000')

    expect(result.range).toEqual({ from: 1700000000, to: 1710000000 })
  })

  it('falls back to defaults on garbage values', () => {
    const result = parse('metric=bogus&range=yesterday&unit=beans&charts=')

    expect(result).toEqual({
      projects: [],
      range: '1y',
      charts: [chart()],
    })
  })

  it('falls back to the default range when custom bounds are inverted', () => {
    const result = parse('range=1710000000-1700000000')

    expect(result.range).toEqual('1y')
  })

  it('round-trips through buildCompareUrl', () => {
    const state: CompareChartState = {
      projects: ['base', 'arbitrum'],
      range: '90d',
      charts: [chart()],
    }

    const url = buildCompareUrl('/scaling/compare', state)
    const search = url.split('?')[1] ?? ''

    expect(parse(search)).toEqual(state)
  })

  it('round-trips a custom range through buildCompareUrl', () => {
    const state: CompareChartState = {
      projects: [],
      range: { from: 1700000000, to: 1710000000 },
      charts: [chart()],
    }

    const url = buildCompareUrl('/scaling/compare', state)
    const search = url.split('?')[1] ?? ''

    expect(parse(search)).toEqual(state)
  })

  it('round-trips multiple charts with all their controls through buildCompareUrl', () => {
    const state: CompareChartState = {
      projects: ['arbitrum'],
      range: '30d',
      charts: [
        chart({
          tvsUnit: 'eth',
          tvsFilter: 'external',
          excludeAssociatedTokens: true,
          excludeRwaRestrictedTokens: false,
        }),
        chart({ metric: 'activity', activityUnit: 'tps' }),
        chart({ metric: 'costs', costsUnit: 'gas' }),
        chart({ metric: 'data-posted' }),
      ],
    }

    const url = buildCompareUrl('/scaling/compare', state)
    const search = url.split('?')[1] ?? ''

    expect(parse(search)).toEqual(state)
  })

  it('round-trips duplicate tvs charts with different filters through buildCompareUrl', () => {
    const state: CompareChartState = {
      projects: ['base'],
      range: '90d',
      charts: [
        chart({ tvsFilter: 'stablecoin' }),
        chart({ tvsFilter: 'ether' }),
      ],
    }

    const url = buildCompareUrl('/scaling/compare', state)
    const search = url.split('?')[1] ?? ''

    expect(parse(search)).toEqual(state)
  })

  it('round-trips the restricted rwa filter through buildCompareUrl', () => {
    const state: CompareChartState = {
      projects: [],
      range: '1y',
      charts: [
        chart({
          tvsFilter: 'rwaRestricted',
          // The stored toggle value stays at the default; while this filter
          // is active it is overridden to false everywhere it is applied.
          excludeRwaRestrictedTokens: true,
        }),
      ],
    }

    const url = buildCompareUrl('/scaling/compare', state)
    const search = url.split('?')[1] ?? ''

    expect(url).toEqual('/scaling/compare?charts=tvs:filter=rwaRestricted')
    expect(parse(search)).toEqual(state)
  })
})
