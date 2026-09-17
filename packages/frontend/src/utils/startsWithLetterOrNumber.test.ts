import { describe, expect, it } from 'vitest'

import {
  startsWithLetterOrNumber,
  startsWithNumber,
} from './startsWithLetterOrNumber'

describe(startsWithLetterOrNumber.name, () => {
  it('should return true for a string that starts with a letter', () => {
    expect(startsWithLetterOrNumber('a')).toBe(true)
    expect(startsWithLetterOrNumber('A')).toBe(true)
    expect(startsWithLetterOrNumber('abc')).toBe(true)
    expect(startsWithLetterOrNumber('ABC')).toBe(true)
    expect(startsWithLetterOrNumber('a1')).toBe(true)
    expect(startsWithLetterOrNumber('A1')).toBe(true)
    expect(startsWithLetterOrNumber('abc1')).toBe(true)
    expect(startsWithLetterOrNumber('ABC1')).toBe(true)
  })

  it('should return true for a string that starts with a number', () => {
    expect(startsWithLetterOrNumber('1')).toBe(true)
    expect(startsWithLetterOrNumber('123')).toBe(true)
    expect(startsWithLetterOrNumber('1a')).toBe(true)
    expect(startsWithLetterOrNumber('123a')).toBe(true)
  })

  it('should return false for a string that starts with a non-letter', () => {
    expect(startsWithLetterOrNumber('#')).toBe(false)
    expect(startsWithLetterOrNumber('!')).toBe(false)
    expect(startsWithLetterOrNumber(' ')).toBe(false)
    expect(startsWithLetterOrNumber(' 1')).toBe(false)
    expect(startsWithLetterOrNumber(' a')).toBe(false)
    expect(startsWithLetterOrNumber('!1')).toBe(false)
    expect(startsWithLetterOrNumber('!a')).toBe(false)
  })
})

describe(startsWithNumber.name, () => {
  it('should return true for a string that starts with a number', () => {
    expect(startsWithNumber('1')).toBe(true)
    expect(startsWithNumber('123')).toBe(true)
    expect(startsWithNumber('1a')).toBe(true)
    expect(startsWithNumber('123a')).toBe(true)
  })

  it('should return false for a string that starts with a non-number', () => {
    expect(startsWithNumber('a')).toBe(false)
    expect(startsWithNumber('A')).toBe(false)
    expect(startsWithNumber('abc')).toBe(false)
    expect(startsWithNumber('ABC')).toBe(false)
    expect(startsWithNumber('a1')).toBe(false)
    expect(startsWithNumber('A1')).toBe(false)
    expect(startsWithNumber('abc1')).toBe(false)
    expect(startsWithNumber('ABC1')).toBe(false)
    expect(startsWithNumber('#')).toBe(false)
    expect(startsWithNumber('!')).toBe(false)
    expect(startsWithNumber(' ')).toBe(false)
    expect(startsWithNumber(' 1')).toBe(false)
    expect(startsWithNumber(' a')).toBe(false)
    expect(startsWithNumber('!1')).toBe(false)
    expect(startsWithNumber('!a')).toBe(false)
  })
})
