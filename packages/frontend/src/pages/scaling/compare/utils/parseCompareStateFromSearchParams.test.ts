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
    })
  })

  it('parses the indexed view mode', () => {
    const result = parse('mode=indexed')

    expect(result.mode).toEqual('indexed')
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
      'metric=bogus&range=yesterday&scale=cubic&unit=gas&mode=sideways',
    )

    expect(result).toEqual({
      metric: 'tvs',
      projects: [],
      range: '1y',
      scale: 'linear',
      mode: 'absolute',
      activityUnit: 'uops',
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
    }

    const url = buildCompareUrl('/scaling/compare', state)
    const search = url.split('?')[1] ?? ''

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
    }

    const url = buildCompareUrl('/scaling/compare', state)
    const search = url.split('?')[1] ?? ''

    expect(parse(search)).toEqual(state)
  })
})
