import { describe, expect, it } from 'vitest'

import { pluralize } from './pluralize.js'

describe(pluralize.name, () => {
  it('should return plural form for -1', () => {
    expect(pluralize(-1, 'apple')).toBe('apple')
  })

  it('should return plural form for 0', () => {
    expect(pluralize(0, 'apple')).toBe('apples')
  })

  it('should return plural form for 1', () => {
    expect(pluralize(1, 'apple')).toBe('apple')
  })

  it('should return plural form for 2 or more', () => {
    expect(pluralize(2, 'apple')).toBe('apples')
    expect(pluralize(23, 'apple')).toBe('apples')
    expect(pluralize(54, 'apple')).toBe('apples')
    expect(pluralize(12, 'apple')).toBe('apples')
  })
})
