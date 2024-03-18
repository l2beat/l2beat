import { expect } from 'earl'

import { calculateCallDataGasUsed } from './calculateCallDataGasUsed'

describe(calculateCallDataGasUsed.name, () => {
  it('should return the correct gas used', () => {
    const INPUT = '0x00aa00bbcf'
    // 4 * 2(zero bytes) + 16 * 3(non-zero bytes) = 56

    const result = calculateCallDataGasUsed(INPUT)
    expect(result).toEqual(56)
  })
})
