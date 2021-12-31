import { getTokenBySymbol } from '@l2beat/config'
import { expect } from 'earljs'
import { utils } from 'ethers'

import { TokenTVL } from '../../../../../src/old/services/balances/model'
import { TokenStats } from '../../../../../src/old/services/balances/utils/getTokenStats'
import { getTokenTVL } from '../../../../../src/old/services/balances/utils/getTokenTVL'

describe('getTokenTVL', () => {
  it('returns the transformed token stats', () => {
    const eth = getTokenBySymbol('ETH')
    const usdc = getTokenBySymbol('USDC')
    const stats: TokenStats[] = [
      {
        token: eth,
        balance: utils.parseUnits('10', eth.decimals),
        value: utils.parseUnits('40000', 18),
      },
      {
        token: usdc,
        balance: utils.parseUnits('100', usdc.decimals),
        value: utils.parseUnits('100', 18),
      },
    ]
    const tvl = getTokenTVL(stats)
    const expected: Record<string, TokenTVL> = {
      ETH: { balance: 10, usd: 40_000 },
      USDC: { balance: 100, usd: 100 },
    }
    expect(tvl).toEqual(expected)
  })
})
