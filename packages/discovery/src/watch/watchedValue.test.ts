import type { json } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { isPendingItem, sortDeep, visitObjects } from './watchedValue'

describe(sortDeep.name, () => {
  it('sorts object keys at every level and keeps array order', () => {
    const value = { b: { d: 1, c: [3, { z: 1, y: 2 }, 1] }, a: null }
    const sorted = sortDeep(value)
    expect(JSON.stringify(sorted)).toEqual(
      '{"a":null,"b":{"c":[3,{"y":2,"z":1},1],"d":1}}',
    )
  })

  it('does not mutate its input', () => {
    const value = { b: 1, a: { d: 2, c: 3 } }
    sortDeep(value)
    expect(JSON.stringify(value)).toEqual('{"b":1,"a":{"d":2,"c":3}}')
  })

  it('rejects keys with a newline, undefined and non-finite numbers', () => {
    expect(() => sortDeep({ 'a\nb': 1 })).toThrow('Watched key with a newline')
    expect(() => sortDeep({ 'a\rb': 1 })).toThrow('Watched key with a newline')
    expect(() => sortDeep(JSON.parse('{"a":{"__proto__":1}}'))).toThrow(
      'Watched key named __proto__',
    )
    expect(() => sortDeep({ a: undefined } as unknown as json)).toThrow(
      'Watched value with undefined',
    )
    expect(() => sortDeep({ a: Number.NaN })).toThrow(
      'Watched number not finite',
    )
  })

  it('rejects values deeper than 8 levels', () => {
    let value: json = 1
    for (let i = 0; i < 9; i++) {
      value = { a: value }
    }
    expect(() => sortDeep(value)).toThrow('Watched value too deep')
  })
})

describe(isPendingItem.name, () => {
  it('is an object whose own pending property is true', () => {
    expect(isPendingItem({ pending: true })).toEqual(true)
    expect(isPendingItem({ pending: false })).toEqual(false)
    expect(isPendingItem({ pending: 'true' })).toEqual(false)
    expect(isPendingItem([{ pending: true }])).toEqual(false)
    expect(isPendingItem(null)).toEqual(false)
  })
})

describe(visitObjects.name, () => {
  it('rejects pending items anywhere inside an array subtree', () => {
    expect(() => visitObjects([{ pending: true }], () => {})).toThrow(
      'Pending item inside an array',
    )
    expect(() =>
      visitObjects([{ a: { pending: true }, b: { pending: true } }], () => {}),
    ).toThrow('Pending item inside an array')
  })

  it('rejects nested pending items inside another pending item', () => {
    expect(() =>
      visitObjects(
        { outer: { pending: true, inner: { pending: true } } },
        () => {},
      ),
    ).toThrow('Nested pending item')
  })
})
