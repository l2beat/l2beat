import { expect } from 'earl'
import { BigIntWithDecimals } from './bigIntWithDecimals'

describe(BigIntWithDecimals.name, () => {
  describe(BigIntWithDecimals.name, () => {
    it('aligns to the desired precision - from higher', async () => {
      const value = 1001234n
      const decimals = 4

      const result = BigIntWithDecimals(value, decimals)

      expect(result).toEqual(100123400000000000000n)
    })

    it('aligns to the desired precision - from lower', async () => {
      const value = 100n
      const decimals = 0

      const result = BigIntWithDecimals(value, decimals)

      expect(result).toEqual(100000000000000000000n)
    })
  })

  describe(BigIntWithDecimals.fromNumber.name, () => {
    it('converts from number with desired precision', async () => {
      const value = 100.1234

      const result = BigIntWithDecimals.fromNumber(value)

      expect(result).toEqual(100123400000000000000n)
    })
  })

  describe(BigIntWithDecimals.toNumber.name, () => {
    it('converts to number with desired precision', async () => {
      const value = BigIntWithDecimals(10012n, 2)

      const result = BigIntWithDecimals.toNumber(value)

      expect(result).toEqual(100.12)
    })
  })

  describe(BigIntWithDecimals.multiply.name, () => {
    it('multiples two bigints with decimals', async () => {
      const value1 = BigIntWithDecimals.fromNumber(100)

      const value2 = BigIntWithDecimals.fromNumber(5)

      const result = BigIntWithDecimals.toNumber(
        BigIntWithDecimals.multiply(value1, value2),
      )

      expect(result).toEqual(500)
    })
  })
})
