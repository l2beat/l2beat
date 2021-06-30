import { expect } from 'chai'
import { AggregateTVL } from '../../../../src/services/TVL'
import { getProjectStats } from '../../../../src/services/TVL/utils'
import { getAggregateTVL } from '../../../../src/services/TVL/utils/getAggregateTVL'
import { makeExampleProjects } from './example'

describe('getAggregateTVL', () => {
  it('returns the transformed token stats', () => {
    const { projects, balances, prices } = makeExampleProjects()
    const stats = getProjectStats(projects, balances, prices)
    const tvl = getAggregateTVL(stats, prices)
    const expected: AggregateTVL = {
      usd: 28203.15,
      eth: 7.050788,
    }
    expect(tvl).to.deep.equal(expected)
  })
})
