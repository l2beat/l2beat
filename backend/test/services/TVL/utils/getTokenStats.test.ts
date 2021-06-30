import { expect } from 'chai'
import { BigNumber, utils } from 'ethers'
import { getTokenBySymbol } from '../../../../../config/build/src'
import { ProjectInfo } from '../../../../src/model/ProjectInfo'
import { FetchedBalances, FetchedPrices } from '../../../../src/services/TVL'
import {
  getHolderAddresses,
  getTokenBalance,
  getTokenPrice,
  getTokenStats,
  getTrackedTokens,
  TokenStats,
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

  it('returns stats for tokens', () => {
    const eth = getTokenBySymbol('ETH')
    const dai = getTokenBySymbol('DAI')
    const usdc = getTokenBySymbol('USDC')
    const usdt = getTokenBySymbol('USDT')

    const holderA = '0x' + '1234'.repeat(10)
    const holderB = '0x' + 'abcd'.repeat(10)
    const holderC = '0x' + '12ab'.repeat(10)

    const bridge = (address: string, tokens: string[]) => ({
      address,
      sinceBlock: 1,
      tokens: tokens.map(getTokenBySymbol),
    })

    const project: ProjectInfo = {
      name: 'foo',
      bridges: [
        bridge(holderA, ['ETH', 'DAI']),
        bridge(holderB, ['DAI', 'USDC']),
      ],
    }

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
      },
      eth: utils.parseUnits('4000', 18),
    }

    const stats = getTokenStats(project, balances, prices)
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
    expect(stats).to.deep.equal(expected)
  })
})
