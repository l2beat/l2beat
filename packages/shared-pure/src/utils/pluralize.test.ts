import { expect } from 'earl'

import { pluralize } from './pluralize.js'

describe(pluralize.name, () => {
  it('should return plural form for -1', () => {
    expect(pluralize(-1, 'apple')).toEqual('apple')
  })

  it('should return plural form for 0', () => {
    expect(pluralize(0, 'apple')).toEqual('apples')
  })

  it('should return plural form for 1', () => {
    expect(pluralize(1, 'apple')).toEqual('apple')
  })

  it('should return plural form for 2 or more', () => {
    expect(pluralize(2, 'apple')).toEqual('apples')
    expect(pluralize(23, 'apple')).toEqual('apples')
    expect(pluralize(54, 'apple')).toEqual('apples')
    expect(pluralize(12, 'apple')).toEqual('apples')
  })
})
