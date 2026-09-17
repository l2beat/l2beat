import { describe, expect, it } from 'vitest'
import { isDateOnly } from './dateStrings.js'

describe(isDateOnly.name, () => {
  it('accepts a real calendar date', () => {
    expect(isDateOnly('2026-08-05')).toBe(true)
  })

  it('rejects rolled-over calendar dates', () => {
    expect(isDateOnly('2026-02-31')).toBe(false)
    expect(isDateOnly('2026-13-01')).toBe(false)
  })

  it('rejects timestamps and non-dates', () => {
    expect(isDateOnly('2026-08-06T08:48:58.389Z')).toBe(false)
    expect(isDateOnly('not a date')).toBe(false)
  })
})
