import { expect } from 'chai'
import { utils } from 'ethers'

import {
  getProjectStats,
  ProjectStats,
} from '../../../../../src/old/services/balances/utils'
import { makeExampleProjects } from './example'

describe('getProjectStats', () => {
  it('returns stats for projects', () => {
    const { projects, balances, prices } = makeExampleProjects()

    const stats = getProjectStats(projects, balances, prices)
    const expected: ProjectStats[] = [
      {
        project: projects[0],
        usdBalance: utils.parseUnits('12188.2', 18),
        ethBalance: utils
          .parseUnits('12188.2', 18)
          .mul(utils.parseUnits('1', 18))
          .div(utils.parseUnits('4000', 18)),
        tokenTVL: {
          ETH: { balance: 3, usd: 12_000 },
          DAI: { balance: 168, usd: 168 },
          USDC: { balance: 20, usd: 20.2 },
        },
      },
      {
        project: projects[1],
        usdBalance: utils.parseUnits('16014.95', 18),
        ethBalance: utils
          .parseUnits('16014.95', 18)
          .mul(utils.parseUnits('1', 18))
          .div(utils.parseUnits('4000', 18)),
        tokenTVL: {
          ETH: { balance: 4, usd: 16_000 },
          USDC: { balance: 5, usd: 5.05 },
          USDT: { balance: 10, usd: 9.9 },
        },
      },
    ]
    expect(stats).to.deep.equal(expected)
  })
})
