import { divOrZero } from '@l2beat/common'

import { DAI, TEN_TO_18 } from '../../../constants'
import {
  EthBalanceCall,
  MulticallResponse,
  TokenBalanceCall,
  UniV2ReservesCall,
} from '../../multicall'
import { parseTokenPrices } from './parseTokenPrices'

export function parseMulticallResults(
  results: Record<string, MulticallResponse>
) {
  const ethPrice = parseEthPrice(results)
  return {
    token: parseTokenPrices(results, ethPrice),
    eth: ethPrice,
  }
}

function parseEthPrice(results: Record<string, MulticallResponse>) {
  const v1Dai = TokenBalanceCall.decodeOrZero(results[`uniV1-token-${DAI}`])
  const v1Eth = EthBalanceCall.decodeOrZero(results[`uniV1-eth-${DAI}`])
  const reservesResponse = results[`uniV2Weth-${DAI}`]
  const [v2Dai, v2Weth] = UniV2ReservesCall.decodeOrZero(reservesResponse)
  const [dai, eth] = v1Eth.gt(v2Weth) ? [v1Dai, v1Eth] : [v2Dai, v2Weth]
  return divOrZero(dai.mul(TEN_TO_18), eth)
}
