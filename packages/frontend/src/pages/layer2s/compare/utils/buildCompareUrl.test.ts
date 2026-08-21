import { expect } from 'earl'
import { buildCompareUrl } from './buildCompareUrl'
import {
  type CompareChartConfig,
  type CompareChartState,
  createDefaultChartConfig,
} from './compareChartState'

const PATH = '/layer2s/compare'

interface ChartOverrides {
  metric?: CompareChartConfig['metric']
  activity?: Partial<CompareChartConfig['activity']>
  tvs?: Partial<CompareChartConfig['tvs']>
  costs?: Partial<CompareChartConfig['costs']>
}

function chart(overrides: ChartOverrides = {}): CompareChartConfig {
  const base = createDefaultChartConfig(overrides.metric)
  return {
    ...base,
    activity: { ...base.activity, ...overrides.activity },
    tvs: { ...base.tvs, ...overrides.tvs },
    costs: { ...base.costs, ...overrides.costs },
  }
}

function state(
  overrides: Partial<CompareChartState> = {},
  chartOverrides: ChartOverrides = {},
): CompareChartState {
  return {
    projects: undefined,
    range: '1y',
    charts: [chart(chartOverrides)],
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

    expect(url).toEqual('/layer2s/compare?projects=arbitrum,base')
  })

  it('serializes an explicitly emptied selection as an empty param', () => {
    const url = buildCompareUrl(PATH, state({ projects: [] }))

    expect(url).toEqual('/layer2s/compare?projects=')
  })

  it('omits defaults and serializes a non-default range', () => {
    const url = buildCompareUrl(
      PATH,
      state({ projects: ['arbitrum'], range: '30d' }),
    )

    expect(url).toEqual('/layer2s/compare?projects=arbitrum&range=30d')
  })

  it('serializes a custom range as from-to', () => {
    const url = buildCompareUrl(
      PATH,
      state({ range: { from: 1700000000, to: 1710000000 } }),
    )

    expect(url).toEqual('/layer2s/compare?range=1700000000-1710000000')
  })

  it('serializes a non-default metric with its non-default unit', () => {
    const url = buildCompareUrl(
      PATH,
      state({}, { metric: 'activity', activity: { unit: 'tps' } }),
    )

    expect(url).toEqual('/layer2s/compare?charts=activity:unit=tps')
  })

  it('omits the default activity unit', () => {
    const url = buildCompareUrl(PATH, state({}, { metric: 'activity' }))

    expect(url).toEqual('/layer2s/compare?charts=activity')
  })

  it('omits the activity unit for other metrics', () => {
    const url = buildCompareUrl(PATH, state({}, { activity: { unit: 'tps' } }))

    expect(url).toEqual(PATH)
  })

  it('serializes the costs metric with its non-default unit', () => {
    const url = buildCompareUrl(
      PATH,
      state({}, { metric: 'costs', costs: { unit: 'gas' } }),
    )

    expect(url).toEqual('/layer2s/compare?charts=costs:unit=gas')
  })

  it('serializes the data-posted metric without any unit', () => {
    const url = buildCompareUrl(
      PATH,
      state(
        {},
        {
          metric: 'data-posted',
          activity: { unit: 'tps' },
          tvs: { unit: 'eth' },
          costs: { unit: 'gas' },
        },
      ),
    )

    expect(url).toEqual('/layer2s/compare?charts=data-posted')
  })

  it('serializes the non-default tvs controls', () => {
    const url = buildCompareUrl(
      PATH,
      state(
        {},
        {
          tvs: {
            unit: 'eth',
            excludeAssociatedTokens: true,
            excludeRwaRestrictedTokens: false,
          },
        },
      ),
    )

    expect(url).toEqual(
      '/layer2s/compare?charts=tvs:unit=eth:excludeAssociated=true:excludeRwa=false',
    )
  })

  it('serializes the non-default tvs filter', () => {
    const url = buildCompareUrl(
      PATH,
      state({}, { tvs: { filter: 'stablecoin' } }),
    )

    expect(url).toEqual('/layer2s/compare?charts=tvs:filter=stablecoin')
  })

  it('omits the overridden rwa toggle while the restricted rwa filter is active', () => {
    const url = buildCompareUrl(
      PATH,
      state(
        {},
        { tvs: { filter: 'rwaRestricted', excludeRwaRestrictedTokens: false } },
      ),
    )

    expect(url).toEqual('/layer2s/compare?charts=tvs:filter=rwaRestricted')
  })

  it('omits the tvs controls for other metrics', () => {
    const url = buildCompareUrl(
      PATH,
      state(
        {},
        {
          metric: 'activity',
          tvs: {
            unit: 'eth',
            filter: 'native',
            excludeAssociatedTokens: true,
            excludeRwaRestrictedTokens: false,
          },
        },
      ),
    )

    expect(url).toEqual('/layer2s/compare?charts=activity')
  })

  it('serializes multiple charts joined by commas', () => {
    const url = buildCompareUrl(
      PATH,
      state({
        projects: ['arbitrum'],
        charts: [
          chart(),
          chart({ metric: 'activity', activity: { unit: 'tps' } }),
        ],
      }),
    )

    expect(url).toEqual(
      '/layer2s/compare?projects=arbitrum&charts=tvs,activity:unit=tps',
    )
  })

  it('serializes duplicate metrics with their own controls', () => {
    const url = buildCompareUrl(
      PATH,
      state({
        charts: [chart(), chart({ tvs: { filter: 'stablecoin' } })],
      }),
    )

    expect(url).toEqual('/layer2s/compare?charts=tvs,tvs:filter=stablecoin')
  })

  it('encodes a lone default tvs chart only when accompanied by another chart', () => {
    const url = buildCompareUrl(
      PATH,
      state({
        charts: [chart(), chart({ metric: 'data-posted' })],
      }),
    )

    expect(url).toEqual('/layer2s/compare?charts=tvs,data-posted')
  })
})
