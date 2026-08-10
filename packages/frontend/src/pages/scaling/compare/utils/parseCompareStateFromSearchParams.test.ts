import { expect } from 'earl'
import { buildCompareUrl } from './buildCompareUrl'
import type { CompareChartState } from './compareChartState'
import { parseCompareStateFromSearchParams } from './parseCompareStateFromSearchParams'

const SLUGS = ['arbitrum', 'base', 'optimism']

function parse(search: string) {
  return parseCompareStateFromSearchParams({
    searchParams: new URLSearchParams(search),
    validSlugs: SLUGS,
  })
}

describe(parseCompareStateFromSearchParams.name, () => {
  it('parses a full state', () => {
    const result = parse(
      'metric=activity&projects=arbitrum,base&range=30d&scale=log&unit=tps',
    )

    expect(result).toEqual({
      metric: 'activity',
      projects: ['arbitrum', 'base'],
      range: '30d',
      scale: 'symlog',
      mode: 'absolute',
      activityUnit: 'tps',
      tvsUnit: 'usd',
      tvsFilter: 'all',
      costsUnit: 'usd',
      excludeAssociatedTokens: false,
      excludeRwaRestrictedTokens: true,
    })
  })

  it('returns defaults when params are missing', () => {
    const result = parse('')

    expect(result).toEqual({
      metric: 'tvs',
      projects: [],
      range: '1y',
      scale: 'linear',
      mode: 'absolute',
      activityUnit: 'uops',
      tvsUnit: 'usd',
      tvsFilter: 'all',
      costsUnit: 'usd',
      excludeAssociatedTokens: false,
      excludeRwaRestrictedTokens: true,
    })
  })

  it('parses the indexed view mode', () => {
    const result = parse('mode=indexed')

    expect(result.mode).toEqual('indexed')
  })

  it('parses the data-posted metric', () => {
    const result = parse('metric=data-posted')

    expect(result.metric).toEqual('data-posted')
  })

  it('round-trips the data-posted metric through buildCompareUrl', () => {
    const state: CompareChartState = {
      metric: 'data-posted',
      projects: ['arbitrum', 'base'],
      range: '30d',
      scale: 'symlog',
      mode: 'absolute',
      activityUnit: 'uops',
      tvsUnit: 'usd',
      tvsFilter: 'all',
      costsUnit: 'usd',
      excludeAssociatedTokens: false,
      excludeRwaRestrictedTokens: true,
    }

    const url = buildCompareUrl('/scaling/compare', state)
    const search = url.split('?')[1] ?? ''

    expect(parse(search)).toEqual(state)
  })

  it('parses the tvs unit from the shared unit param', () => {
    const result = parse('unit=eth')

    expect(result.tvsUnit).toEqual('eth')
    expect(result.activityUnit).toEqual('uops')
  })

  it('parses the tvs filter', () => {
    const result = parse('filter=canonical')

    expect(result.tvsFilter).toEqual('canonical')
  })

  it('parses an asset category tvs filter', () => {
    const result = parse('filter=stablecoin')

    expect(result.tvsFilter).toEqual('stablecoin')
  })

  it('keeps bridge type and asset category mutually exclusive by holding a single filter value', () => {
    const result = parse('filter=canonical&filter=stablecoin')

    expect(result.tvsFilter).toEqual('canonical')
  })

  it('applies the shared unit param only to the active metric', () => {
    const result = parse('metric=costs&unit=eth')

    expect(result.costsUnit).toEqual('eth')
    expect(result.tvsUnit).toEqual('usd')
    expect(result.activityUnit).toEqual('uops')
  })

  it('parses the costs unit from the shared unit param', () => {
    const result = parse('metric=costs&unit=gas')

    expect(result.costsUnit).toEqual('gas')
    expect(result.tvsUnit).toEqual('usd')
    expect(result.activityUnit).toEqual('uops')
  })

  it('parses the tvs token exclusion toggles', () => {
    const result = parse('excludeAssociated=true&excludeRwa=false')

    expect(result.excludeAssociatedTokens).toEqual(true)
    expect(result.excludeRwaRestrictedTokens).toEqual(false)
  })

  it('drops unknown slugs and deduplicates', () => {
    const result = parse('projects=arbitrum,ethereum,arbitrum,nonsense,base')

    expect(result.projects).toEqual(['arbitrum', 'base'])
  })

  it('caps the selection at ten projects', () => {
    const slugs = Array.from({ length: 12 }, (_, i) => `project-${i}`)
    const result = parseCompareStateFromSearchParams({
      searchParams: new URLSearchParams(`projects=${slugs.join(',')}`),
      validSlugs: slugs,
    })

    expect(result.projects).toEqual(slugs.slice(0, 10))
  })

  it('parses a custom range', () => {
    const result = parse('range=1700000000-1710000000')

    expect(result.range).toEqual({ from: 1700000000, to: 1710000000 })
  })

  it('falls back to defaults on garbage values', () => {
    const result = parse(
      'metric=bogus&range=yesterday&scale=cubic&unit=beans&mode=sideways&filter=everything&excludeAssociated=maybe&excludeRwa=nonsense',
    )

    expect(result).toEqual({
      metric: 'tvs',
      projects: [],
      range: '1y',
      scale: 'linear',
      mode: 'absolute',
      activityUnit: 'uops',
      tvsUnit: 'usd',
      tvsFilter: 'all',
      costsUnit: 'usd',
      excludeAssociatedTokens: false,
      excludeRwaRestrictedTokens: true,
    })
  })

  it('falls back to the default range when custom bounds are inverted', () => {
    const result = parse('range=1710000000-1700000000')

    expect(result.range).toEqual('1y')
  })

  it('round-trips through buildCompareUrl', () => {
    const state: CompareChartState = {
      metric: 'tvs',
      projects: ['base', 'arbitrum'],
      range: '90d',
      scale: 'symlog',
      mode: 'absolute',
      activityUnit: 'uops',
      tvsUnit: 'usd',
      tvsFilter: 'all',
      costsUnit: 'usd',
      excludeAssociatedTokens: false,
      excludeRwaRestrictedTokens: true,
    }

    const url = buildCompareUrl('/scaling/compare', state)
    const search = url.split('?')[1] ?? ''

    expect(parse(search)).toEqual(state)
  })

  it('round-trips a custom range through buildCompareUrl', () => {
    const state: CompareChartState = {
      metric: 'tvs',
      projects: [],
      range: { from: 1700000000, to: 1710000000 },
      scale: 'linear',
      mode: 'absolute',
      activityUnit: 'uops',
      tvsUnit: 'usd',
      tvsFilter: 'all',
      costsUnit: 'usd',
      excludeAssociatedTokens: false,
      excludeRwaRestrictedTokens: true,
    }

    const url = buildCompareUrl('/scaling/compare', state)
    const search = url.split('?')[1] ?? ''

    expect(parse(search)).toEqual(state)
  })

  it('round-trips the activity metric with its unit through buildCompareUrl', () => {
    const state: CompareChartState = {
      metric: 'activity',
      projects: ['optimism'],
      range: '7d',
      scale: 'linear',
      mode: 'absolute',
      activityUnit: 'tps',
      tvsUnit: 'usd',
      tvsFilter: 'all',
      costsUnit: 'usd',
      excludeAssociatedTokens: false,
      excludeRwaRestrictedTokens: true,
    }

    const url = buildCompareUrl('/scaling/compare', state)
    const search = url.split('?')[1] ?? ''

    expect(parse(search)).toEqual(state)
  })

  it('round-trips the costs metric with its unit through buildCompareUrl', () => {
    const state: CompareChartState = {
      metric: 'costs',
      projects: ['arbitrum', 'base'],
      range: '30d',
      scale: 'linear',
      mode: 'absolute',
      activityUnit: 'uops',
      tvsUnit: 'usd',
      tvsFilter: 'all',
      costsUnit: 'gas',
      excludeAssociatedTokens: false,
      excludeRwaRestrictedTokens: true,
    }

    const url = buildCompareUrl('/scaling/compare', state)
    const search = url.split('?')[1] ?? ''

    expect(parse(search)).toEqual(state)
  })

  it('round-trips the tvs metric with all its controls through buildCompareUrl', () => {
    const state: CompareChartState = {
      metric: 'tvs',
      projects: ['arbitrum'],
      range: '30d',
      scale: 'linear',
      mode: 'absolute',
      activityUnit: 'uops',
      tvsUnit: 'eth',
      tvsFilter: 'external',
      costsUnit: 'usd',
      excludeAssociatedTokens: true,
      excludeRwaRestrictedTokens: false,
    }

    const url = buildCompareUrl('/scaling/compare', state)
    const search = url.split('?')[1] ?? ''

    expect(parse(search)).toEqual(state)
  })

  it('round-trips an asset category filter through buildCompareUrl', () => {
    const state: CompareChartState = {
      metric: 'tvs',
      projects: ['base'],
      range: '90d',
      scale: 'linear',
      mode: 'absolute',
      activityUnit: 'uops',
      tvsUnit: 'usd',
      tvsFilter: 'stablecoin',
      costsUnit: 'usd',
      excludeAssociatedTokens: false,
      excludeRwaRestrictedTokens: true,
    }

    const url = buildCompareUrl('/scaling/compare', state)
    const search = url.split('?')[1] ?? ''

    expect(parse(search)).toEqual(state)
  })

  it('round-trips the restricted rwa filter through buildCompareUrl', () => {
    const state: CompareChartState = {
      metric: 'tvs',
      projects: [],
      range: '1y',
      scale: 'linear',
      mode: 'absolute',
      activityUnit: 'uops',
      tvsUnit: 'usd',
      tvsFilter: 'rwaRestricted',
      costsUnit: 'usd',
      // The stored toggle value stays at the default; while this filter is
      // active it is overridden to false everywhere it is applied.
      excludeRwaRestrictedTokens: true,
      excludeAssociatedTokens: false,
    }

    const url = buildCompareUrl('/scaling/compare', state)
    const search = url.split('?')[1] ?? ''

    expect(url).toEqual('/scaling/compare?filter=rwaRestricted')
    expect(parse(search)).toEqual(state)
  })

  it('round-trips the indexed mode through buildCompareUrl', () => {
    const state: CompareChartState = {
      metric: 'tvs',
      projects: ['arbitrum'],
      range: '30d',
      scale: 'linear',
      mode: 'indexed',
      activityUnit: 'uops',
      tvsUnit: 'usd',
      tvsFilter: 'all',
      costsUnit: 'usd',
      excludeAssociatedTokens: false,
      excludeRwaRestrictedTokens: true,
    }

    const url = buildCompareUrl('/scaling/compare', state)
    const search = url.split('?')[1] ?? ''

    expect(parse(search)).toEqual(state)
  })
})
