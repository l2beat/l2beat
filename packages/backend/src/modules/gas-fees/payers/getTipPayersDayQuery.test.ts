import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getTipPayersDayQuery } from './getTipPayersDayQuery'

describe(getTipPayersDayQuery.name, () => {
  const sql = getTipPayersDayQuery({
    day: UnixTime.fromDate(new Date('2026-11-10T00:00:00Z')),
    firstBlock: 7_300,
    lastBlock: 14_500,
    fastTipGwei: 0.099,
  })

  it('reads only the day, by partition and by block', () => {
    expect(sql).toInclude(
      "where date = date '2026-11-10' and number between 7300 and 14500",
    )
    expect(sql).toInclude(
      "where block_date = date '2026-11-10' and block_number between 7300 and 14500",
    )
  })

  it("caps tips at the day's fast tip", () => {
    expect(sql).toInclude('least(tip_wei, 99000000)')
  })
})
