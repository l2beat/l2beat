import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { orderByTvl } from './order-by-tvl'

describe(orderByTvl.name, () => {
  it('orders projects by their latest hourly tvl', () => {
    const projects = [
      { id: ProjectId('first') },
      { id: ProjectId('second') },
      { id: ProjectId('third') },
    ]

    const tvlData = {
      first: 1003,
      // second is missing so 0 tvl is implied
      third: 1000,
      fourth: 5000,
    }

    const ordered = orderByTvl(projects, tvlData)

    expect(ordered).toEqual([
      { id: ProjectId('first') },
      { id: ProjectId('third') },
      { id: ProjectId('second') },
    ])
  })
})
