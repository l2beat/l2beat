import { getTokenBySymbol } from '@l2beat/config'
import { expect } from 'earljs'
import { BigNumber, utils } from 'ethers'

import { FetchedBalances } from '../../../../../src/old/services/balances/model'
import {
  getHolderAddresses,
  getTokenBalance,
  getTokenPrice,
  getTokenStats,
  getTrackedTokens,
  TokenStats,
} from '../../../../../src/old/services/balances/utils/getTokenStats'
import { FetchedPrices } from '../../../../../src/old/services/prices/model'
import { makeExampleProjects } from './example'

describe(getTokenStats.name, () => {
  describe(getHolderAddresses.name, () => {
    it('returns holder addresses', () => {
      const bridge = (a: string) => ({ address: a, sinceBlock: 1, tokens: [] })
      const project = { name: 'foo', bridges: [bridge('a'), bridge('b')] }
      const holders = getHolderAddresses(project)
      expect(holders).toEqual(['a', 'b'])
    })
  })

  describe(getTrackedTokens.name, () => {
    it('returns de-duplicated tracked tokens', () => {
      const bridge = (tokens: string[]) => ({
        address: '',
        sinceBlock: 1,
        tokens: tokens.map(getTokenBySymbol),
      })
      const project = {
        name: 'foo',
        bridges: [bridge(['ETH', 'DAI']), bridge(['DAI', 'USDC'])],
      }
      const tokens = getTrackedTokens(project)
      const expected = ['ETH', 'DAI', 'USDC'].map(getTokenBySymbol)
      expect(tokens).toEqual(expected)
    })
  })

  describe(getTokenBalance.name, () => {
    it('works for ETH', () => {
      const eth = getTokenBySymbol('ETH')
      const balances: FetchedBalances = {
        token: {},
        eth: {
          a: BigNumber.from(10),
          b: BigNumber.from(5),
        },
      }
      const result = getTokenBalance(['a', 'b', 'c'], eth, balances)
      expect(result).toEqual(BigNumber.from(15))
    })

    it('works for tokens', () => {
      const dai = getTokenBySymbol('DAI')
      const usdc = getTokenBySymbol('USDC')
      const balances: FetchedBalances = {
        token: {
          [dai.address!]: {
            a: BigNumber.from(10),
            b: BigNumber.from(2),
          },
          [usdc.address!]: {
            c: BigNumber.from(50),
          },
        },
        eth: {
          b: BigNumber.from(17),
        },
      }
      const result = getTokenBalance(['a', 'b', 'c'], dai, balances)
      expect(result).toEqual(BigNumber.from(12))
    })

    it('can return 0', () => {
      const eth = getTokenBySymbol('ETH')
      const dai = getTokenBySymbol('DAI')
      const balances: FetchedBalances = {
        token: {
          [dai.address!]: {
            a: BigNumber.from(10),
            b: BigNumber.from(2),
          },
        },
        eth: {
          b: BigNumber.from(17),
        },
      }
      const ethBalance = getTokenBalance(['c', 'd'], eth, balances)
      expect(ethBalance).toEqual(BigNumber.from(0))
      const daiBalance = getTokenBalance(['c', 'd'], dai, balances)
      expect(daiBalance).toEqual(BigNumber.from(0))
    })
  })

  describe(getTokenPrice.name, () => {
    it('returns a token price', () => {
      const dai = getTokenBySymbol('DAI')
      const prices: FetchedPrices = {
        token: {
          [dai.address!]: BigNumber.from(10),
        },
        eth: BigNumber.from(5),
      }
      const price = getTokenPrice(dai, prices)
      expect(price).toEqual(BigNumber.from(10))
    })

    it('returns 0 for missing token price', () => {
      const dai = getTokenBySymbol('DAI')
      const usdc = getTokenBySymbol('USDC')
      const prices: FetchedPrices = {
        token: {
          [dai.address!]: BigNumber.from(10),
        },
        eth: BigNumber.from(5),
      }
      const price = getTokenPrice(usdc, prices)
      expect(price).toEqual(BigNumber.from(0))
    })

    it('returns the eth price', () => {
      const dai = getTokenBySymbol('DAI')
      const eth = getTokenBySymbol('ETH')
      const prices: FetchedPrices = {
        token: {
          [dai.address!]: BigNumber.from(10),
        },
        eth: BigNumber.from(5),
      }
      const price = getTokenPrice(eth, prices)
      expect(price).toEqual(BigNumber.from(5))
    })
  })

  it('returns stats for tokens', () => {
    const { eth, dai, usdc, projects, balances, prices } = makeExampleProjects()

    const stats = getTokenStats(projects[0], balances, prices)
    const expected: TokenStats[] = [
      {
        token: eth,
        balance: utils.parseUnits('3', eth.decimals),
        value: utils.parseUnits('12000', 18),
      },
      {
        token: dai,
        balance: utils.parseUnits('168', dai.decimals),
        value: utils.parseUnits('168', 18),
      },
      {
        token: usdc,
        balance: utils.parseUnits('20', usdc.decimals),
        value: utils.parseUnits('20.2', 18),
      },
    ]
    expect(stats).toEqual(expected)
  })
})
