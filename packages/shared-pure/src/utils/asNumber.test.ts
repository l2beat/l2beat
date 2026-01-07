import { expect } from 'earl'

import { asNumber } from './asNumber.js'

describe(asNumber.name, () => {
  it('1234567 || 6 precision digits', () => {
    const result = asNumber(1234567n, 6)

    expect(result).toEqual(1.234567)
  })

  it('123 || 2 precision digits', () => {
    const result = asNumber(123n, 2)

    expect(result).toEqual(1.23)
  })

  it('12345 || 6 precision digits', () => {
    const result = asNumber(12345n, 6)

    expect(result).toEqual(0.012345)
  })

  it('1 || 2 precision digits', () => {
    const result = asNumber(1n, 2)

    expect(result).toEqual(0.01)
  })

  it('100123456000000000000 || 18 precision digits', () => {
    const result = asNumber(100123456000000000000n, 18)

    expect(result).toEqual(100.123456)
  })

  it('123456000000000000 || 18 precision digits', () => {
    const result = asNumber(123456000000000000n, 18)

    expect(result).toEqual(0.123456)
  })

  it('123 || 0 precision digits', () => {
    const result = asNumber(123n, 0)

    expect(result).toEqual(123)
  })
})
