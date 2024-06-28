import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { orderByTvl } from './order-by-tvl'
import { type TvlProject } from '../get-tvl'

describe(orderByTvl.name, () => {
  it('orders projects by their latest hourly tvl', () => {
    const projects = [
      { id: ProjectId('first') },
      { id: ProjectId('second') },
      { id: ProjectId('third') },
    ]

    const projectWithHourlyUsd = (values: number[]): TvlProject => ({
      tokens: {
        canonical: [],
        external: [],
        native: [],
      },
      charts: {
        daily: {
          types: [
            'timestamp',
            'totalUsd',
            'canonicalUsd',
            'externalUsd',
            'nativeUsd',
            'totalEth',
            'canonicalEth',
            'externalEth',
            'nativeEth',
          ],
          data: [],
        },
        sixHourly: {
          types: [
            'timestamp',
            'totalUsd',
            'canonicalUsd',
            'externalUsd',
            'nativeUsd',
            'totalEth',
            'canonicalEth',
            'externalEth',
            'nativeEth',
          ],
          data: [],
        },
        hourly: {
          types: [
            'timestamp',
            'totalUsd',
            'canonicalUsd',
            'externalUsd',
            'nativeUsd',
            'totalEth',
            'canonicalEth',
            'externalEth',
            'nativeEth',
          ],
          data: values.map((usd) => [0, usd, 0, 0, 0, 0, 0, 0, 0]),
        },
      },
    })

    const ordered = orderByTvl(projects, {
      first: projectWithHourlyUsd([1001, 1002, 1003]),
      // second is missing so 0 tvl is implied
      third: projectWithHourlyUsd([2000, 1500, 1000]),
      fourth: projectWithHourlyUsd([5000, 5000, 5000]),
    })

    expect(ordered).toEqual([
      { id: ProjectId('first') },
      { id: ProjectId('third') },
      { id: ProjectId('second') },
    ])
  })
})
