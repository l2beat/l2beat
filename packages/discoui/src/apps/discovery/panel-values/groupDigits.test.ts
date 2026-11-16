import { expect } from 'earl'
import { groupDigits } from './groupDigits'

describe('groupDigits', () => {
  it('leaves numbers of up to four digits whole', () => {
    expect(groupDigits('0')).toEqual(['0'])
    expect(groupDigits('1234')).toEqual(['1234'])
    expect(groupDigits('-1234')).toEqual(['-1234'])
  })

  it('splits longer numbers into thousands', () => {
    expect(groupDigits('12345')).toEqual(['12', '345'])
    expect(groupDigits('123456')).toEqual(['123', '456'])
    expect(groupDigits('3600000000000000000000')).toEqual([
      '3',
      '600',
      '000',
      '000',
      '000',
      '000',
      '000',
      '000',
    ])
  })

  it('keeps the sign on the first group', () => {
    expect(groupDigits('-1234567')).toEqual(['-1', '234', '567'])
  })

  it('joins back into the original number', () => {
    const integer =
      '115792089237316195423570985008687907853269984665640564039457'
    expect(groupDigits(integer).join('')).toEqual(integer)
  })
})
