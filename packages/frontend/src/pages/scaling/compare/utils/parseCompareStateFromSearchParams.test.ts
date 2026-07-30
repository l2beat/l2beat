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
    const result = parse('projects=arbitrum,base&range=30d&scale=log')

    expect(result).toEqual({
      metric: 'tvs',
      projects: ['arbitrum', 'base'],
      range: '30d',
      scale: 'symlog',
    })
  })

  it('returns defaults when params are missing', () => {
    const result = parse('')

    expect(result).toEqual({
      metric: 'tvs',
      projects: [],
      range: '1y',
      scale: 'linear',
    })
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
    const result = parse('metric=bogus&range=yesterday&scale=cubic')

    expect(result).toEqual({
      metric: 'tvs',
      projects: [],
      range: '1y',
      scale: 'linear',
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
    }

    const url = buildCompareUrl('/scaling/compare', state)
    const search = url.split('?')[1] ?? ''

    expect(parse(search)).toEqual(state)
  })
})
