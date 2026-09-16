import { describe, expect, it } from 'vitest'

import {
  startsWithLetterOrNumber,
  startsWithNumber,
} from './startsWithLetterOrNumber'

describe(startsWithLetterOrNumber.name, () => {
  it('should return true for a string that starts with a letter', () => {
    expect(startsWithLetterOrNumber('a')).toStrictEqual(true)
    expect(startsWithLetterOrNumber('A')).toStrictEqual(true)
    expect(startsWithLetterOrNumber('abc')).toStrictEqual(true)
    expect(startsWithLetterOrNumber('ABC')).toStrictEqual(true)
    expect(startsWithLetterOrNumber('a1')).toStrictEqual(true)
    expect(startsWithLetterOrNumber('A1')).toStrictEqual(true)
    expect(startsWithLetterOrNumber('abc1')).toStrictEqual(true)
    expect(startsWithLetterOrNumber('ABC1')).toStrictEqual(true)
  })

  it('should return true for a string that starts with a number', () => {
    expect(startsWithLetterOrNumber('1')).toStrictEqual(true)
    expect(startsWithLetterOrNumber('123')).toStrictEqual(true)
    expect(startsWithLetterOrNumber('1a')).toStrictEqual(true)
    expect(startsWithLetterOrNumber('123a')).toStrictEqual(true)
  })

  it('should return false for a string that starts with a non-letter', () => {
    expect(startsWithLetterOrNumber('#')).toStrictEqual(false)
    expect(startsWithLetterOrNumber('!')).toStrictEqual(false)
    expect(startsWithLetterOrNumber(' ')).toStrictEqual(false)
    expect(startsWithLetterOrNumber(' 1')).toStrictEqual(false)
    expect(startsWithLetterOrNumber(' a')).toStrictEqual(false)
    expect(startsWithLetterOrNumber('!1')).toStrictEqual(false)
    expect(startsWithLetterOrNumber('!a')).toStrictEqual(false)
  })
})

describe(startsWithNumber.name, () => {
  it('should return true for a string that starts with a number', () => {
    expect(startsWithNumber('1')).toStrictEqual(true)
    expect(startsWithNumber('123')).toStrictEqual(true)
    expect(startsWithNumber('1a')).toStrictEqual(true)
    expect(startsWithNumber('123a')).toStrictEqual(true)
  })

  it('should return false for a string that starts with a non-number', () => {
    expect(startsWithNumber('a')).toStrictEqual(false)
    expect(startsWithNumber('A')).toStrictEqual(false)
    expect(startsWithNumber('abc')).toStrictEqual(false)
    expect(startsWithNumber('ABC')).toStrictEqual(false)
    expect(startsWithNumber('a1')).toStrictEqual(false)
    expect(startsWithNumber('A1')).toStrictEqual(false)
    expect(startsWithNumber('abc1')).toStrictEqual(false)
    expect(startsWithNumber('ABC1')).toStrictEqual(false)
    expect(startsWithNumber('#')).toStrictEqual(false)
    expect(startsWithNumber('!')).toStrictEqual(false)
    expect(startsWithNumber(' ')).toStrictEqual(false)
    expect(startsWithNumber(' 1')).toStrictEqual(false)
    expect(startsWithNumber(' a')).toStrictEqual(false)
    expect(startsWithNumber('!1')).toStrictEqual(false)
    expect(startsWithNumber('!a')).toStrictEqual(false)
  })
})
