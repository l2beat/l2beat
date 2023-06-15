import { ProjectId, TvlApiProject, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { orderByTvl } from '../../src/utils/orderByTvl'

describe(orderByTvl.name, () => {
  it('orders projects by their latest hourly tvl', () => {
    const projects = [
      { id: ProjectId('first') },
      { id: ProjectId('second') },
      { id: ProjectId('third') },
    ]

    const projectWithHourlyUsd = (values: number[]): TvlApiProject => ({
      tokens: [],
      charts: {
        daily: { types: ['timestamp', 'usd', 'eth'], data: [] },
        sixHourly: { types: ['timestamp', 'usd', 'eth'], data: [] },
        hourly: {
          types: ['timestamp', 'usd', 'eth'],
          data: values.map((usd) => [new UnixTime(0), usd, 0]),
        },
      },
    })

    const ordered = orderByTvl(projects, {
      projects: {
        first: projectWithHourlyUsd([1001, 1002, 1003]),
        // second is missing so 0 tvl is implied
        third: projectWithHourlyUsd([2000, 1500, 1000]),
        fourth: projectWithHourlyUsd([5000, 5000, 5000]),
      },
    })

    expect(ordered).toEqual([
      { id: ProjectId('first') },
      { id: ProjectId('third') },
      { id: ProjectId('second') },
    ])
  })
})
