import { expect } from 'earl'
import { isDateOnly, isTimestamp } from './dateStrings.js'

describe(isDateOnly.name, () => {
  it('accepts a real calendar date', () => {
    expect(isDateOnly('2026-08-05')).toEqual(true)
  })

  it('rejects rolled-over calendar dates', () => {
    expect(isDateOnly('2026-02-31')).toEqual(false)
    expect(isDateOnly('2026-13-01')).toEqual(false)
  })

  it('rejects timestamps and non-dates', () => {
    expect(isDateOnly('2026-08-06T08:48:58.389Z')).toEqual(false)
    expect(isDateOnly('not a date')).toEqual(false)
  })
})

describe(isTimestamp.name, () => {
  it('accepts an RFC 3339 timestamp', () => {
    expect(isTimestamp('2026-08-06T08:48:58.389Z')).toEqual(true)
  })

  it('rejects garbage', () => {
    expect(isTimestamp('not a date')).toEqual(false)
  })
})
