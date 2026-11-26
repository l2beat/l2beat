import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { GAS_FEES_CHAINS } from './chains'
import { getBlocksQuery, getFeesQuery } from './getFeesQueries'

describe('gas fees queries', () => {
  const from = UnixTime.fromDate(new Date('2026-10-01T00:00:00Z'))
  const to = UnixTime.fromDate(new Date('2026-10-10T00:00:00Z'))

  it("computes each chain's fees by its rules, over the days by literal dates", () => {
    const sql = getFeesQuery(GAS_FEES_CHAINS, from, to)

    expect(sql).toInclude(
      "from zksync.transactions as t\n  join zksync.blocks as b\n    on b.number = t.block_number and b.date between date '2026-10-01' and date '2026-10-10'\n  where t.block_date between date '2026-10-01' and date '2026-10-10'",
    )
    expect(sql).toInclude('least(cast(t.gas_price as double)')
    expect(sql).toInclude("'MNT' as token")
    expect(sql.match(/union all/g)?.length).toEqual(GAS_FEES_CHAINS.length - 1)
  })

  it('reads the prices once, for the hours of the days', () => {
    const sql = getFeesQuery(GAS_FEES_CHAINS, from, to)

    expect(sql.match(/prices\.hour/g)?.length).toEqual(1)
    expect(sql).toInclude(
      "timestamp >= timestamp '2026-10-01 00:00'\n    and timestamp < timestamp '2026-10-11 00:00'",
    )
  })

  it("reads every chain's blocks 30 days either side", () => {
    const sql = getBlocksQuery(GAS_FEES_CHAINS, from, to)

    expect(sql).toInclude(
      "from ethereum.blocks\nwhere date between date '2026-09-01' and date '2026-11-09'",
    )
    expect(sql.match(/union all/g)?.length).toEqual(GAS_FEES_CHAINS.length - 1)
  })
})
