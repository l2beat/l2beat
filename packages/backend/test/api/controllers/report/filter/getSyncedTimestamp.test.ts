import { UnixTime } from '@l2beat/common'
import { expect } from 'earljs'

import { getSyncedTimestamp } from '../../../../../src/api/controllers/report/filter/getSyncedTimestamp'

describe(getSyncedTimestamp.name, () => {
  const TODAY = UnixTime.now().toStartOf('day')

  it('every report synced', async () => {
    const result = getSyncedTimestamp([TODAY, TODAY, TODAY], 'days')

    expect(result).toEqual(TODAY)
  })

  it('one report very out of sync', async () => {
    const result = getSyncedTimestamp(
      [TODAY, TODAY, TODAY.add(-2, 'days')],
      'days'
    )

    expect(result).toEqual(TODAY)
  })

  it('get previous day', async () => {
    const result = getSyncedTimestamp(
      [TODAY, TODAY, TODAY.add(-1, 'days')],
      'days'
    )

    expect(result).toEqual(TODAY.add(-1, 'days'))
  })
})
