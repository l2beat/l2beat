import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getMempoolDayQuery } from './getMempoolDayQuery'

describe(getMempoolDayQuery.name, () => {
  const day = UnixTime.fromDate(new Date('2026-11-10T00:00:00Z'))
  const sql = getMempoolDayQuery({
    day,
    previousDayFirstBlock: 100,
    firstBlock: 7_300,
    lastBlock: 14_500,
    hourlyTips: [
      {
        timestamp: day,
        slowTipGwei: 0.000002,
        mediumTipGwei: 0.0064,
        fastTipGwei: 0.099,
      },
    ],
  })

  it('reads the mempool table by one literal range of landing blocks', () => {
    expect(sql).toInclude(
      'where included_at_block_height between 7300 and 14500\n',
    )
    expect(sql.match(/included_at_block_height between/g)?.length).toEqual(1)
  })

  it('reads blocks and transactions from the day before', () => {
    expect(sql).toInclude(
      "where date between date '2026-11-09' and date '2026-11-11'\n    and number between 100 and 14560",
    )
    expect(sql).toInclude(
      "where block_date between date '2026-11-09' and date '2026-11-10'\n    and block_number between 100 and 14500",
    )
  })

  it("passes our hourly tips in wei, keyed by the hour's start in ms", () => {
    expect(sql).toInclude('(1794268800000, 2000, 6400000, 99000000)')
  })

  it('puts round tips at the start of a level', () => {
    expect(sql).toInclude('when tip_wei < 1050000000 then 1000000000')
  })
})
