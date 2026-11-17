import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { GAS_FEES_CHAINS } from './chains'
import { getBlocksQuery, getFeesQuery } from './getFeesQueries'

describe('gas fees queries', () => {
  const from = UnixTime.fromDate(new Date('2026-10-01T00:00:00Z'))
  const to = UnixTime.fromDate(new Date('2026-10-10T00:00:00Z'))

  it('reads the fees of the days by literal dates', () => {
    const sql = getFeesQuery(GAS_FEES_CHAINS, from, to)

    expect(sql).toInclude(
      "block_date between date '2026-10-01' and date '2026-10-10'",
    )
    expect(sql).toInclude("'zksync', 'linea'")
    expect(sql).not.toInclude('tx_fee_raw')
  })

  it("reads Arbitrum's gas from its transactions and the others' from blocks", () => {
    const sql = getBlocksQuery(GAS_FEES_CHAINS, from, to)

    expect(sql).toInclude('from arbitrum.transactions')
    expect(sql).not.toInclude('from arbitrum.blocks')
    expect(sql).toInclude(
      "from ethereum.blocks\nwhere date between date '2026-10-01' and date '2026-10-10'",
    )
    expect(sql.match(/union all/g)?.length).toEqual(GAS_FEES_CHAINS.length - 1)
  })
})
