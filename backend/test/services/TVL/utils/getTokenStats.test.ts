import { expect } from 'chai'
import { BigNumber } from 'ethers'
import { getTokenBySymbol } from '../../../../../config/build/src'
import { FetchedBalances, FetchedPrices } from '../../../../src/services/TVL'
import {
  getHolderAddresses,
  getTokenBalance,
  getTokenPrice,
  getTrackedTokens,
} from '../../../../src/services/TVL/utils/getTokenStats'

describe('getTokenStats', () => {
  describe('getHolderAddresses', () => {
    it('returns holder addresses', () => {
      const bridge = (a: string) => ({ address: a, sinceBlock: 1, tokens: [] })
      const project = { name: 'foo', bridges: [bridge('a'), bridge('b')] }
      const holders = getHolderAddresses(project)
      expect(holders).to.deep.equal(['a', 'b'])
    })
  })

  describe('getTrackedTokens', () => {
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
      expect(tokens).to.deep.equal(expected)
    })
  })

  describe('getTokenBalance', () => {
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
      expect(result).to.deep.equal(BigNumber.from(15))
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
      expect(result).to.deep.equal(BigNumber.from(12))
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
      expect(ethBalance).to.deep.equal(BigNumber.from(0))
      const daiBalance = getTokenBalance(['c', 'd'], dai, balances)
      expect(daiBalance).to.deep.equal(BigNumber.from(0))
    })
  })

  describe('getTokenPrice', () => {
    it('returns a token price', () => {
      const dai = getTokenBySymbol('DAI')
      const prices: FetchedPrices = {
        token: {
          [dai.address!]: BigNumber.from(10),
        },
        eth: BigNumber.from(5),
      }
      const price = getTokenPrice(dai, prices)
      expect(price).to.deep.equal(BigNumber.from(10))
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
      expect(price).to.deep.equal(BigNumber.from(0))
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
      expect(price).to.deep.equal(BigNumber.from(5))
    })
  })
})
