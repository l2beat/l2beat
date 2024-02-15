import { expect } from 'earl'

import { startsWithLetterOrNumber } from './startsWithLetterOrNumber'

describe(startsWithLetterOrNumber.name, () => {
  it('should return true for a string that starts with a letter', () => {
    expect(startsWithLetterOrNumber('a')).toEqual(true)
    expect(startsWithLetterOrNumber('A')).toEqual(true)
    expect(startsWithLetterOrNumber('abc')).toEqual(true)
    expect(startsWithLetterOrNumber('ABC')).toEqual(true)
    expect(startsWithLetterOrNumber('a1')).toEqual(true)
    expect(startsWithLetterOrNumber('A1')).toEqual(true)
    expect(startsWithLetterOrNumber('abc1')).toEqual(true)
    expect(startsWithLetterOrNumber('ABC1')).toEqual(true)
  })

  it('should return true for a string that starts with a number', () => {
    expect(startsWithLetterOrNumber('1')).toEqual(true)
    expect(startsWithLetterOrNumber('123')).toEqual(true)
    expect(startsWithLetterOrNumber('1a')).toEqual(true)
    expect(startsWithLetterOrNumber('123a')).toEqual(true)
  })

  it('should return false for a string that starts with a non-letter', () => {
    expect(startsWithLetterOrNumber('#')).toEqual(false)
    expect(startsWithLetterOrNumber('!')).toEqual(false)
    expect(startsWithLetterOrNumber(' ')).toEqual(false)
    expect(startsWithLetterOrNumber(' 1')).toEqual(false)
    expect(startsWithLetterOrNumber(' a')).toEqual(false)
    expect(startsWithLetterOrNumber('!1')).toEqual(false)
    expect(startsWithLetterOrNumber('!a')).toEqual(false)
  })
})
