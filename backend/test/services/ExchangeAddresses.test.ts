import { expect } from 'chai'
import { DAI, WETH } from '../../src/constants'
import {
  getUniswapV2PairAddress,
  getUniswapV3PoolAddress,
} from '../../src/services/ExchangeAddresses'

describe('ExchangeAddresses', () => {
  describe('getUniswapV2PairAddress', () => {
    it('returns WETH-DAI pair address', () => {
      const pairWD = getUniswapV2PairAddress(WETH, DAI)
      const pairDW = getUniswapV2PairAddress(DAI, WETH)

      expect(pairWD).to.equal(pairDW)
      expect(pairWD).to.equal('0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11')
    })
  })

  describe('getUniswapV3PoolAddress', () => {
    it('returns WETH-DAI-3000 pair address', () => {
      const poolWD3000 = getUniswapV3PoolAddress(WETH, DAI, 3000)
      const poolDW3000 = getUniswapV3PoolAddress(DAI, WETH, 3000)

      expect(poolWD3000).to.equal(poolDW3000)
      expect(poolWD3000).to.equal('0xC2e9F25Be6257c210d7Adf0D4Cd6E3E881ba25f8')
    })
  })
})
