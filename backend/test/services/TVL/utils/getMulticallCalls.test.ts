import { getTokenBySymbol } from '@l2beat/config'
import { expect } from 'chai'
import { constants } from 'ethers'
import { DAI } from '../../../../src/constants'
import { MulticallRequest } from '../../../../src/services/api/MulticallApi'
import { ExchangeInfo } from '../../../../src/services/ExchangeAddresses'
import {
  addTokenExchanges,
  balanceOf,
  ethBalanceOf,
  getMulticallCalls,
  reservesOf,
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

    const calls = getMulticallCalls(tokenHolders, ethHolders, exchanges)
    const expected: Record<string, MulticallRequest> = {
      [`token-${usdc.address}-${holderA}`]: balanceOf(usdc.address!, holderA),
      [`token-${usdc.address}-${holderB}`]: balanceOf(usdc.address!, holderB),
      [`token-${mkr.address}-${holderC}`]: balanceOf(mkr.address!, holderC),
      [`eth-${holderA}`]: ethBalanceOf(holderA),
      [`eth-${holderC}`]: ethBalanceOf(holderC),
      [`uniV1-token-${DAI}`]: balanceOf(DAI, exchanges[DAI].uniV1!),
      [`uniV1-eth-${DAI}`]: ethBalanceOf(exchanges[DAI].uniV1!),
      [`uniV2Weth-${DAI}`]: reservesOf(exchanges[DAI].uniV2Weth),
    }
    addTokenExchanges(expected, [usdc.address!, mkr.address!], exchanges)
    expect(calls).to.deep.equal(expected)
  })
})
