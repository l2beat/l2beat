import { expect } from 'chai'
import { BigNumber, utils } from 'ethers'
import { getTokenBySymbol, TokenInfo } from '../../../../../config/build/src'
import { ProjectInfo } from '../../../../src/model/ProjectInfo'
import { FetchedBalances, FetchedPrices } from '../../../../src/services/TVL'
import {
  getProjectStats,
  ProjectStats,
} from '../../../../src/services/TVL/utils'

describe('getProjectStats', () => {
  it('returns stats for projects', () => {
    const eth = getTokenBySymbol('ETH')
    const dai = getTokenBySymbol('DAI')
    const usdc = getTokenBySymbol('USDC')
    const usdt = getTokenBySymbol('USDT')

    const holderA = '0x' + '1234'.repeat(10)
    const holderB = '0x' + 'abcd'.repeat(10)
    const holderC = '0x' + '12ab'.repeat(10)

    const bridge = (address: string, tokens: TokenInfo[]) => ({
      address,
      sinceBlock: 1,
      tokens,
    })

    const projects: ProjectInfo[] = [
      {
        name: 'foo',
        bridges: [bridge(holderA, [eth, dai]), bridge(holderB, [dai, usdc])],
      },
      {
        name: 'bar',
        bridges: [bridge(holderC, [eth, usdc, usdt])],
      },
    ]

    const balances: FetchedBalances = {
      token: {
        [dai.address!]: {
          [holderA]: utils.parseUnits('123', dai.decimals),
          [holderB]: utils.parseUnits('45', dai.decimals),
        },
        [usdc.address!]: {
          [holderB]: utils.parseUnits('20', usdc.decimals),
          [holderC]: utils.parseUnits('5', usdc.decimals),
        },
        [usdt.address!]: {
          [holderC]: utils.parseUnits('10', usdt.decimals),
        },
      },
      eth: {
        [holderA]: utils.parseUnits('3', eth.decimals),
        [holderC]: utils.parseUnits('4', eth.decimals),
      },
    }

    const prices: FetchedPrices = {
      token: {
        [dai.address!]: utils.parseUnits('1', 18),
        [usdc.address!]: utils.parseUnits('1.01', 18),
        [usdt.address!]: utils.parseUnits('0.99', 18),
      },
      eth: utils.parseUnits('4000', 18),
    }

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
