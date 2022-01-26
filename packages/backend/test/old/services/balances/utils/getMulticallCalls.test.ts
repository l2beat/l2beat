import { getTokenBySymbol } from '@l2beat/config'
import { expect } from 'earljs'

import { getMulticallCalls } from '../../../../../src/old/services/balances/utils/getMulticallCalls'
import {
  EthBalanceCall,
  MulticallRequest,
  TokenBalanceCall,
} from '../../../../../src/old/services/multicall'

describe(getMulticallCalls.name, () => {
  it('returns all required calls', () => {
    const holderA = '0x' + 'a'.repeat(40)
    const holderB = '0x' + 'b'.repeat(40)
    const holderC = '0x' + 'c'.repeat(40)

    const usdc = getTokenBySymbol('USDC')
    const mkr = getTokenBySymbol('MKR')

    const tokenHolders = {
      [usdc.address!]: [holderA, holderB],
      [mkr.address!]: [holderC],
    }
    const ethHolders = [holderA, holderC]
    const calls = getMulticallCalls(tokenHolders, ethHolders)
    const expected: Record<string, MulticallRequest> = {
      [`token-${usdc.address}-${holderA}`]: TokenBalanceCall.encode(
        usdc.address!,
        holderA
      ),
      [`token-${usdc.address}-${holderB}`]: TokenBalanceCall.encode(
        usdc.address!,
        holderB
      ),
      [`token-${mkr.address}-${holderC}`]: TokenBalanceCall.encode(
        mkr.address!,
        holderC
      ),
      [`eth-${holderA}`]: EthBalanceCall.encode(holderA),
      [`eth-${holderC}`]: EthBalanceCall.encode(holderC),
    }
    expect(calls).toEqual(expected)
  })
})
