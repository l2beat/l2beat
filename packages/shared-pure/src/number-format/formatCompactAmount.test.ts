import { expect } from 'earl'

import { formatCompactAmount } from './formatCompactAmount.js'

describe(formatCompactAmount.name, () => {
  it('drops padding zeros', () => {
    expect(formatCompactAmount(200_000, 'AZTEC')).toEqual('200K AZTEC')
    expect(formatCompactAmount(332_000_000, 'AZTEC')).toEqual('332M AZTEC')
  })

  it('keeps up to two decimals', () => {
    expect(formatCompactAmount(43_754_321, 'ETH')).toEqual('43.75M ETH')
    expect(formatCompactAmount(0.05, 'ETH')).toEqual('0.05 ETH')
  })
})
