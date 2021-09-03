import { expect } from 'chai'

import { ProjectTVL } from '../../../../src/services/balances/model'
import { getProjectStats } from '../../../../src/services/balances/utils'
import { getProjectTVL } from '../../../../src/services/balances/utils/getProjectTVL'
import { makeExampleProjects } from './example'

describe('getProjectTVL', () => {
  it('returns the transformed token stats', () => {
    const { projects, balances, prices } = makeExampleProjects()
    const stats = getProjectStats(projects, balances, prices)
    const tvl = getProjectTVL(stats)
    const expected: Record<string, ProjectTVL> = {
      foo: {
        TVL: { usd: 12188.2, eth: 3.04705 },
        tokens: {
          ETH: { balance: 3, usd: 12000 },
          DAI: { balance: 168, usd: 168 },
          USDC: { balance: 20, usd: 20.2 },
        },
      },
      bar: {
        TVL: { usd: 16014.95, eth: 4.003737 },
        tokens: {
          ETH: { balance: 4, usd: 16000 },
          USDC: { balance: 5, usd: 5.05 },
          USDT: { balance: 10, usd: 9.9 },
        },
      },
    }
    expect(tvl).to.deep.equal(expected)
  })
})
