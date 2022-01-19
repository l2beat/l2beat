import { expect } from 'earljs'

import { DAI, WETH } from '../../../src/old/constants'
import {
  ExchangeAddresses,
  getUniswapV2PairAddress,
  getUniswapV3PoolAddress,
} from '../../../src/old/services/ExchangeAddresses'

describe(ExchangeAddresses.name, () => {
  describe(getUniswapV2PairAddress.name, () => {
    it('returns WETH-DAI pair address', () => {
      const pairWD = getUniswapV2PairAddress(WETH, DAI)
      const pairDW = getUniswapV2PairAddress(DAI, WETH)

      expect(pairWD).toEqual(pairDW)
      expect(pairWD).toEqual('0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11')
    })
  })

  describe(getUniswapV3PoolAddress.name, () => {
    it('returns WETH-DAI-3000 pair address', () => {
      const poolWD3000 = getUniswapV3PoolAddress(WETH, DAI, 3000)
      const poolDW3000 = getUniswapV3PoolAddress(DAI, WETH, 3000)

      expect(poolWD3000).toEqual(poolDW3000)
      expect(poolWD3000).toEqual('0xC2e9F25Be6257c210d7Adf0D4Cd6E3E881ba25f8')
    })
  })
})
