import { expect } from 'earljs'

import { NestedDict } from '../../../src'

describe(NestedDict.name, () => {
  it('returns value when present', () => {
    const dict = new NestedDict({})
    dict.set('a', 'b', 123)
    expect(dict.get('a', 'b')).toEqual(123)
  })

  it('returns undefined for known module unknown key', () => {
    const dict = new NestedDict({})
    dict.set('a', 'b', 123)
    expect(dict.get('a', 'c')).toEqual(undefined)
  })

  it('returns undefined for unknown module', () => {
    const dict = new NestedDict({})
    dict.set('a', 'b', 123)
    expect(dict.get('c', 'd')).toEqual(undefined)
  })

  it('can tell if keys are present', () => {
    const dict = new NestedDict({})
    dict.set('a', 'b', 123)
    expect(dict.has('a', 'b')).toEqual(true)
    expect(dict.has('a', 'c')).toEqual(false)
    expect(dict.has('d', 'e')).toEqual(false)
    expect(dict.has('a', 'toString')).toEqual(false)
  })

  it('has correct data', () => {
    const dict = new NestedDict({})
    dict.set('a', 'b', 123)
    dict.set('a', 'c', 456)
    dict.set('b', 'd', true)
    expect(dict.data).toEqual({
      a: {
        b: 123,
        c: 456,
      },
      b: {
        d: true,
      },
    })
  })
})
