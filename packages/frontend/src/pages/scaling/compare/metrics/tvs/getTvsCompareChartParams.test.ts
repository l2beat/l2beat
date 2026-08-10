import { expect } from 'earl'
import type { ChartRange } from '~/utils/range/range'
import { getTvsCompareChartParams } from './getTvsCompareChartParams'

const BASE_STATE = {
  chartRange: [1700000000, 1710000000] as ChartRange,
  excludeAssociatedTokens: false,
  excludeRwaRestrictedTokens: true,
}

describe(getTvsCompareChartParams.name, () => {
  it('passes the exclusion toggles through', () => {
    const params = getTvsCompareChartParams([], {
      ...BASE_STATE,
      tvsFilter: 'canonical',
    })

    expect(params.excludeRwaRestrictedTokens).toEqual(true)
  })

  it('overrides the rwa exclusion while the restricted rwa filter is active', () => {
    // Excluding restricted RWAs while comparing them would query an
    // all-zero restricted RWA component for every project.
    const params = getTvsCompareChartParams([], {
      ...BASE_STATE,
      tvsFilter: 'rwaRestricted',
    })

    expect(params.excludeRwaRestrictedTokens).toEqual(false)
  })
})
