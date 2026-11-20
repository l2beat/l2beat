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

  it('numbers the wait buckets the way they are read back', () => {
    expect(sql).toInclude(
      'when delay_ms < 120000 then greatest(delay_ms, 0) / 500\n      when delay_ms < 300000 then 240',
    )
    expect(sql).toInclude('else 243\n    end as bucket')
  })

  it("counts a tip equal to a tier's estimate, so an estimate of 0 has a band", () => {
    expect(sql).toInclude(
      'coalesce(c.tip_wei = e.slow_wei or (c.tip_wei > e.slow_wei and c.tip_wei < e.slow_wei * 1.26), false) as in_slow',
    )
  })

  it('says which kind each row is, for the reader', () => {
    expect(sql).toInclude(
      'cast(grouping(tip_from_wei, bucket) as tinyint) as kind',
    )
    expect(sql).toInclude('having grouping(tip_from_wei, bucket) = 3')
  })

  it('puts round tips at the start of a level', () => {
    expect(sql).toInclude('when tip_wei < 1050000000 then 1000000000')
  })
})
