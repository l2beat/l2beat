import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { CompareProjectEntry } from '~/server/features/layer2s/compare/getCompareProjectEntries'
import type { ChartRange } from '~/utils/range/range'
import { getActivityCompareChartParams } from './activityCompareMetric'

const CHART_RANGE: ChartRange = [1700000000, 1710000000]

describe(getActivityCompareChartParams.name, () => {
  it('drops projects without activity tracking from the query', () => {
    const params = getActivityCompareChartParams(
      [entry('tracked', true), entry('untracked', false)],
      CHART_RANGE,
    )

    expect(params.projects).toEqual([ProjectId('tracked')])
  })
})

function entry(id: string, hasActivityTracking: boolean): CompareProjectEntry {
  return {
    id: ProjectId(id),
    slug: id,
    name: id,
    shortName: undefined,
    iconUrl: '',
    tvsSinceTimestamp: undefined,
    costsSinceTimestamp: undefined,
    tvs: 0,
    hasDaTracking: false,
    hasActivityTracking,
  }
}
