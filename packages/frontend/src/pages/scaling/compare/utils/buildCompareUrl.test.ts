import { expect } from 'earl'
import { buildCompareUrl } from './buildCompareUrl'
import type { CompareChartState } from './compareChartState'

const PATH = '/scaling/compare'

const DEFAULT_STATE: CompareChartState = {
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
}

describe(buildCompareUrl.name, () => {
  it('returns a bare path for the default state', () => {
    const url = buildCompareUrl(PATH, DEFAULT_STATE)

    expect(url).toEqual(PATH)
  })

  it('serializes projects as a comma-separated list', () => {
    const url = buildCompareUrl(PATH, {
      ...DEFAULT_STATE,
      projects: ['arbitrum', 'base'],
    })

    expect(url).toEqual('/scaling/compare?projects=arbitrum,base')
  })

  it('omits defaults and serializes non-default range and scale', () => {
    const url = buildCompareUrl(PATH, {
      ...DEFAULT_STATE,
      projects: ['arbitrum'],
      range: '30d',
      scale: 'symlog',
    })

    expect(url).toEqual(
      '/scaling/compare?projects=arbitrum&range=30d&scale=log',
    )
  })

  it('serializes a custom range as from-to', () => {
    const url = buildCompareUrl(PATH, {
      ...DEFAULT_STATE,
      range: { from: 1700000000, to: 1710000000 },
    })

    expect(url).toEqual('/scaling/compare?range=1700000000-1710000000')
  })

  it('serializes the indexed mode', () => {
    const url = buildCompareUrl(PATH, {
      ...DEFAULT_STATE,
      mode: 'indexed',
    })

    expect(url).toEqual('/scaling/compare?mode=indexed')
  })

  it('omits the scale in indexed mode where its toggle is hidden', () => {
    const url = buildCompareUrl(PATH, {
      ...DEFAULT_STATE,
      scale: 'symlog',
      mode: 'indexed',
    })

    expect(url).toEqual('/scaling/compare?mode=indexed')
  })

  it('serializes a non-default metric with its non-default unit', () => {
    const url = buildCompareUrl(PATH, {
      ...DEFAULT_STATE,
      metric: 'activity',
      activityUnit: 'tps',
    })

    expect(url).toEqual('/scaling/compare?metric=activity&unit=tps')
  })

  it('omits the default activity unit', () => {
    const url = buildCompareUrl(PATH, {
      ...DEFAULT_STATE,
      metric: 'activity',
    })

    expect(url).toEqual('/scaling/compare?metric=activity')
  })

  it('omits the activity unit for other metrics', () => {
    const url = buildCompareUrl(PATH, {
      ...DEFAULT_STATE,
      activityUnit: 'tps',
    })

    expect(url).toEqual(PATH)
  })

  it('serializes the costs metric with its non-default unit', () => {
    const url = buildCompareUrl(PATH, {
      ...DEFAULT_STATE,
      metric: 'costs',
      costsUnit: 'gas',
    })

    expect(url).toEqual('/scaling/compare?metric=costs&unit=gas')
  })

  it('omits the default costs unit', () => {
    const url = buildCompareUrl(PATH, {
      ...DEFAULT_STATE,
      metric: 'costs',
    })

    expect(url).toEqual('/scaling/compare?metric=costs')
  })

  it('omits the costs unit for other metrics', () => {
    const url = buildCompareUrl(PATH, {
      ...DEFAULT_STATE,
      costsUnit: 'gas',
    })

    expect(url).toEqual(PATH)
  })

  it('serializes the non-default tvs controls', () => {
    const url = buildCompareUrl(PATH, {
      ...DEFAULT_STATE,
      tvsUnit: 'eth',
      excludeAssociatedTokens: true,
      excludeRwaRestrictedTokens: false,
    })

    expect(url).toEqual(
      '/scaling/compare?unit=eth&excludeAssociated=true&excludeRwa=false',
    )
  })

  it('serializes the non-default tvs filter', () => {
    const url = buildCompareUrl(PATH, {
      ...DEFAULT_STATE,
      tvsFilter: 'canonical',
    })

    expect(url).toEqual('/scaling/compare?filter=canonical')
  })

  it('omits the tvs controls for other metrics', () => {
    const url = buildCompareUrl(PATH, {
      ...DEFAULT_STATE,
      metric: 'activity',
      tvsUnit: 'eth',
      tvsFilter: 'native',
      excludeAssociatedTokens: true,
      excludeRwaRestrictedTokens: false,
    })

    expect(url).toEqual('/scaling/compare?metric=activity')
  })
})
