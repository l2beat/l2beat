import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { type ValueRecord } from '@l2beat/database'
import { getTvlBreakdown } from './get-tvl-breakdown'

describe(getTvlBreakdown.name, () => {
  it('correctly calculates the breakdown from ValueRecords', () => {
    const values: ValueRecord[] = [
      {
        projectId: ProjectId('first'),
        timestamp: new UnixTime(0),
        dataSource: '',
        canonical: 10n,
        canonicalAssociated: 1n,
        canonicalForTotal: 9n,
        canonicalAssociatedForTotal: 8n,
        external: 100n,
        externalAssociated: 10n,
        externalForTotal: 90n,
        externalAssociatedForTotal: 80n,
        native: 1000n,
        nativeAssociated: 100n,
        nativeForTotal: 900n,
        nativeAssociatedForTotal: 800n,
        ether: 200n,
        stablecoin: 300n,
      },
    ]

    const breakdown = getTvlBreakdown(values)

    expect(breakdown).toEqual({
      associated: 111n,
      ether: 200n,
      stablecoin: 300n,
      total: 1110n,
    })
  })
})
