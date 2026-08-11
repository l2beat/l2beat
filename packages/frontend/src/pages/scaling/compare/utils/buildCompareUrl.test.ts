import { expect } from 'earl'
import { buildCompareUrl } from './buildCompareUrl'
import {
  type CompareChartConfig,
  type CompareChartState,
  createDefaultChartConfig,
} from './compareChartState'

const PATH = '/scaling/compare'

function state(
  overrides: Partial<CompareChartState> = {},
  chartOverrides: Partial<CompareChartConfig> = {},
): CompareChartState {
  return {
    projects: [],
    range: '1y',
    charts: [{ ...createDefaultChartConfig(), ...chartOverrides }],
    ...overrides,
  }
}

describe(buildCompareUrl.name, () => {
  it('returns a bare path for the default state', () => {
    const url = buildCompareUrl(PATH, state())

    expect(url).toEqual(PATH)
  })

  it('serializes projects as a comma-separated list', () => {
    const url = buildCompareUrl(PATH, state({ projects: ['arbitrum', 'base'] }))

    expect(url).toEqual('/scaling/compare?projects=arbitrum,base')
  })

  it('omits defaults and serializes a non-default range', () => {
    const url = buildCompareUrl(
      PATH,
      state({ projects: ['arbitrum'], range: '30d' }),
    )

    expect(url).toEqual('/scaling/compare?projects=arbitrum&range=30d')
  })

  it('serializes a custom range as from-to', () => {
    const url = buildCompareUrl(
      PATH,
      state({ range: { from: 1700000000, to: 1710000000 } }),
    )

    expect(url).toEqual('/scaling/compare?range=1700000000-1710000000')
  })

  it('serializes a non-default metric with its non-default unit', () => {
    const url = buildCompareUrl(
      PATH,
      state({}, { metric: 'activity', activityUnit: 'tps' }),
    )

    expect(url).toEqual('/scaling/compare?charts=activity:unit=tps')
  })

  it('omits the default activity unit', () => {
    const url = buildCompareUrl(PATH, state({}, { metric: 'activity' }))

    expect(url).toEqual('/scaling/compare?charts=activity')
  })

  it('omits the activity unit for other metrics', () => {
    const url = buildCompareUrl(PATH, state({}, { activityUnit: 'tps' }))

    expect(url).toEqual(PATH)
  })

  it('serializes the costs metric with its non-default unit', () => {
    const url = buildCompareUrl(
      PATH,
      state({}, { metric: 'costs', costsUnit: 'gas' }),
    )

    expect(url).toEqual('/scaling/compare?charts=costs:unit=gas')
  })

  it('serializes the data-posted metric without any unit', () => {
    const url = buildCompareUrl(
      PATH,
      state(
        {},
        {
          metric: 'data-posted',
          activityUnit: 'tps',
          tvsUnit: 'eth',
          costsUnit: 'gas',
        },
      ),
    )

    expect(url).toEqual('/scaling/compare?charts=data-posted')
  })

  it('serializes the non-default tvs controls', () => {
    const url = buildCompareUrl(
      PATH,
      state(
        {},
        {
          tvsUnit: 'eth',
          excludeAssociatedTokens: true,
          excludeRwaRestrictedTokens: false,
        },
      ),
    )

    expect(url).toEqual(
      '/scaling/compare?charts=tvs:unit=eth:excludeAssociated=true:excludeRwa=false',
    )
  })

  it('serializes the non-default tvs filter', () => {
    const url = buildCompareUrl(PATH, state({}, { tvsFilter: 'stablecoin' }))

    expect(url).toEqual('/scaling/compare?charts=tvs:filter=stablecoin')
  })

  it('omits the overridden rwa toggle while the restricted rwa filter is active', () => {
    const url = buildCompareUrl(
      PATH,
      state(
        {},
        { tvsFilter: 'rwaRestricted', excludeRwaRestrictedTokens: false },
      ),
    )

    expect(url).toEqual('/scaling/compare?charts=tvs:filter=rwaRestricted')
  })

  it('omits the tvs controls for other metrics', () => {
    const url = buildCompareUrl(
      PATH,
      state(
        {},
        {
          metric: 'activity',
          tvsUnit: 'eth',
          tvsFilter: 'native',
          excludeAssociatedTokens: true,
          excludeRwaRestrictedTokens: false,
        },
      ),
    )

    expect(url).toEqual('/scaling/compare?charts=activity')
  })

  it('serializes multiple charts joined by commas', () => {
    const url = buildCompareUrl(
      PATH,
      state({
        projects: ['arbitrum'],
        charts: [
          createDefaultChartConfig('tvs'),
          { ...createDefaultChartConfig('activity'), activityUnit: 'tps' },
        ],
      }),
    )

    expect(url).toEqual(
      '/scaling/compare?projects=arbitrum&charts=tvs,activity:unit=tps',
    )
  })

  it('serializes duplicate metrics with their own controls', () => {
    const url = buildCompareUrl(
      PATH,
      state({
        charts: [
          createDefaultChartConfig('tvs'),
          { ...createDefaultChartConfig('tvs'), tvsFilter: 'stablecoin' },
        ],
      }),
    )

    expect(url).toEqual('/scaling/compare?charts=tvs,tvs:filter=stablecoin')
  })

  it('encodes a lone default tvs chart only when accompanied by another chart', () => {
    const url = buildCompareUrl(
      PATH,
      state({
        charts: [
          createDefaultChartConfig('tvs'),
          createDefaultChartConfig('data-posted'),
        ],
      }),
    )

    expect(url).toEqual('/scaling/compare?charts=tvs,data-posted')
  })
})
