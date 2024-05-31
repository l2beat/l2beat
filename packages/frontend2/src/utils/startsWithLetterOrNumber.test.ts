import { expect } from 'earl'

import {
  startsWithLetterOrNumber,
  startsWithNumber,
} from './startsWithLetterOrNumber'

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

describe(startsWithNumber.name, () => {
  it('should return true for a string that starts with a number', () => {
    expect(startsWithNumber('1')).toEqual(true)
    expect(startsWithNumber('123')).toEqual(true)
    expect(startsWithNumber('1a')).toEqual(true)
    expect(startsWithNumber('123a')).toEqual(true)
  })

  it('should return false for a string that starts with a non-number', () => {
    expect(startsWithNumber('a')).toEqual(false)
    expect(startsWithNumber('A')).toEqual(false)
    expect(startsWithNumber('abc')).toEqual(false)
    expect(startsWithNumber('ABC')).toEqual(false)
    expect(startsWithNumber('a1')).toEqual(false)
    expect(startsWithNumber('A1')).toEqual(false)
    expect(startsWithNumber('abc1')).toEqual(false)
    expect(startsWithNumber('ABC1')).toEqual(false)
    expect(startsWithNumber('#')).toEqual(false)
    expect(startsWithNumber('!')).toEqual(false)
    expect(startsWithNumber(' ')).toEqual(false)
    expect(startsWithNumber(' 1')).toEqual(false)
    expect(startsWithNumber(' a')).toEqual(false)
    expect(startsWithNumber('!1')).toEqual(false)
    expect(startsWithNumber('!a')).toEqual(false)
  })
})
