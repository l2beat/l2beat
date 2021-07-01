import { getTokenBySymbol } from '@l2beat/config'
import { expect } from 'chai'
import {
  balanceOf,
  ethBalanceOf,
  getMulticallCalls,
} from '../../../../src/services/TVL/utils/getMulticallCalls'

describe('getMulticallCalls', () => {
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
    const expected = {
      [`token-${usdc.address}-${holderA}`]: balanceOf(usdc.address!, holderA),
      [`token-${usdc.address}-${holderB}`]: balanceOf(usdc.address!, holderB),
      [`token-${mkr.address}-${holderC}`]: balanceOf(mkr.address!, holderC),
      [`eth-${holderA}`]: ethBalanceOf(holderA),
      [`eth-${holderC}`]: ethBalanceOf(holderC),
    }
    expect(calls).to.deep.equal(expected)
  })
})
