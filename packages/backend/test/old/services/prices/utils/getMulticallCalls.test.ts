import { getTokenBySymbol } from '@l2beat/config'
import { expect } from 'earljs'
import { constants } from 'ethers'

import { DAI } from '../../../../../src/old/constants'
import { ExchangeInfo } from '../../../../../src/old/services/ExchangeAddresses'
import {
  EthBalanceCall,
  MulticallRequest,
  TokenBalanceCall,
  UniV2ReservesCall,
} from '../../../../../src/old/services/multicall'
import {
  addTokenExchanges,
  getMulticallCalls,
} from '../../../../../src/old/services/prices/utils'

describe(getMulticallCalls.name, () => {
  it('returns all required calls', () => {
    const usdc = getTokenBySymbol('USDC')
    const mkr = getTokenBySymbol('MKR')

    const alwaysZeroAddress = new Proxy(
      {},
      { get: () => constants.AddressZero }
    )

    const exchanges: Record<string, ExchangeInfo> = {
      [DAI]: {
        uniV1: '0x' + 'da11'.repeat(10),
        uniV2Weth: '0x' + 'da12'.repeat(10),
      } as ExchangeInfo,
      [usdc.address!]: alwaysZeroAddress as ExchangeInfo,
      [mkr.address!]: alwaysZeroAddress as ExchangeInfo,
    }

    const calls = getMulticallCalls(
      [usdc.address!, mkr.address!],
      exchanges,
      Infinity
    )
    const expected: Record<string, MulticallRequest> = {
      [`uniV1-token-${DAI}`]: TokenBalanceCall.encode(
        DAI,
        exchanges[DAI].uniV1!
      ),
      [`uniV1-eth-${DAI}`]: EthBalanceCall.encode(exchanges[DAI].uniV1!),
      [`uniV2Weth-${DAI}`]: UniV2ReservesCall.encode(exchanges[DAI].uniV2Weth),
    }
    addTokenExchanges(
      expected,
      [usdc.address!, mkr.address!],
      exchanges,
      Infinity
    )
    expect(calls).toEqual(expected)
  })
})
