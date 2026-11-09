import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getExecutionDayQuery } from './getExecutionDayQuery'

describe(getExecutionDayQuery.name, () => {
  it('reads only the day, by partition and by block', () => {
    const sql = getExecutionDayQuery(
      UnixTime.fromDate(new Date('2026-10-01T00:00:00Z')),
      26093738,
      26100913,
    )

    expect(sql).toInclude("date = date '2026-10-01'")
    expect(sql).toInclude("block_date = date '2026-10-01'")
    expect(sql).toInclude('between 26093738 and 26100913')
  })
})
