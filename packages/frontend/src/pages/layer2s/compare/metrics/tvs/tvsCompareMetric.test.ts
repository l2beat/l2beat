import { expect } from 'earl'
import type { ChartRange } from '~/utils/range/range'
import { getTvsCompareChartParams } from './tvsCompareMetric'

const CHART_RANGE: ChartRange = [1700000000, 1710000000]
const BASE_TVS = {
  unit: 'usd' as const,
  excludeAssociatedTokens: false,
  excludeRwaRestrictedTokens: true,
}

describe(getTvsCompareChartParams.name, () => {
  it('passes the exclusion toggles through', () => {
    const params = getTvsCompareChartParams(
      [],
      { tvs: { ...BASE_TVS, filter: 'canonical' } },
      CHART_RANGE,
    )

    expect(params.excludeRwaRestrictedTokens).toEqual(true)
  })

  it('overrides the rwa exclusion while the restricted rwa filter is active', () => {
    // Excluding restricted RWAs while comparing them would query an
    // all-zero restricted RWA component for every project.
    const params = getTvsCompareChartParams(
      [],
      { tvs: { ...BASE_TVS, filter: 'rwaRestricted' } },
      CHART_RANGE,
    )

    expect(params.excludeRwaRestrictedTokens).toEqual(false)
  })
})
