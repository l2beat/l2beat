import { expect } from 'earl'
import {
  getActivityJsonUrl,
  getChartJsonAlternates,
  getTvsJsonUrl,
} from './chartJsonLinks'

describe(getTvsJsonUrl.name, () => {
  it('points at the project TVS endpoint for the chart range', () => {
    expect(getTvsJsonUrl('arbitrum', '1y')).toEqual(
      '/api/scaling/tvs/arbitrum?range=1y',
    )
  })
})

describe(getActivityJsonUrl.name, () => {
  it('points at the project activity endpoint for the chart range', () => {
    expect(getActivityJsonUrl('arbitrum', 'max')).toEqual(
      '/api/scaling/activity/arbitrum?range=max',
    )
  })
})

// The head alternates are derived from the same section props that render the
// visible JSON links, so a page can never advertise one without the other.
describe(getChartJsonAlternates.name, () => {
  it('lists the JSON endpoints of the charts on a project page', () => {
    const alternates = getChartJsonAlternates('Arbitrum One', [
      {
        props: {
          title: 'Value Secured',
          jsonUrl: '/api/scaling/tvs/arbitrum?range=1y',
        },
      },
      { props: { title: 'Onchain costs' } },
      {
        props: {
          title: 'Activity',
          jsonUrl: '/api/scaling/activity/arbitrum?range=1y',
        },
      },
    ])

    expect(alternates).toEqual([
      {
        title: 'Arbitrum One value secured (JSON)',
        href: '/api/scaling/tvs/arbitrum?range=1y',
      },
      {
        title: 'Arbitrum One activity (JSON)',
        href: '/api/scaling/activity/arbitrum?range=1y',
      },
    ])
  })
})
