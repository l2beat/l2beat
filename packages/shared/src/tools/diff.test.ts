import { expect } from 'earl'
import { diff } from './diff'

describe('diff', () => {
  it('empty arrays', () => {
    expect(diff([], [])).toEqual([])
  })

  it('same arrays with primitives', () => {
    expect(diff([1, 2, 3], [1, 2, 3])).toEqual([])
    expect(diff([1n, 2n, 3n], [1n, 2n, 3n])).toEqual([])
    expect(diff(['A', 'B', 'C'], ['A', 'B', 'C'])).toEqual([])
    expect(diff([true, false, true], [true, false, true])).toEqual([])
    expect(diff([null, undefined, null], [null, undefined, null])).toEqual([])
  })

  it('same arrays with objects', () => {
    const left = [{ a: 1 }, { b: 2 }, { c: 3 }]
    const right = [{ a: 1 }, { b: 2 }, { c: 3 }]
    expect(diff(left, right)).toEqual([])
  })

  it('same arrays with nested objects', () => {
    const left = [{ a: { x: 1 } }, { b: { y: 2 } }, { c: { z: 3 } }]
    const right = [{ a: { x: 1 } }, { b: { y: 2 } }, { c: { z: 3 } }]
    expect(diff(left, right)).toEqual([])
  })

  it('same arrays with arrays', () => {
    const left = [
      [1, 2],
      [3, 4],
      [5, 6],
    ]
    const right = [
      [1, 2],
      [3, 4],
      [5, 6],
    ]
    expect(diff(left, right)).toEqual([])
  })

  it('same arrays with nested arrays', () => {
    const left = [
      [[1], [2]],
      [[3], [4]],
      [[5], [6]],
    ]
    const right = [
      [[1], [2]],
      [[3], [4]],
      [[5], [6]],
    ]
    expect(diff(left, right)).toEqual([])
  })

  it('removal/creation/change in array on primitives', () => {
    expect(diff([1, 2, 3], [1, 2, 3, 4])).toEqual([
      { kind: 'create', path: [3], rhs: 4 },
    ])

    expect(diff([1, 2, 3, 4], [1, 2, 3])).toEqual([
      { kind: 'remove', path: [3], lhs: 4 },
    ])

    expect(diff([1, 3], [1, 2, 3])).toEqual([
      { kind: 'create', path: [1], rhs: 2 },
    ])

    expect(diff([1, 2, 3], [1, 3])).toEqual([
      { kind: 'remove', path: [1], lhs: 2 },
    ])

    expect(diff([1, 2, 3], [1, 42, 3])).toEqual([
      { kind: 'change', path: [1], lhs: 2, rhs: 42 },
    ])
  })

  it('removal/creation/change in array on objects', () => {
    let left: object[] = [{ a: 1 }, { b: 2 }, { c: 3 }]
    let right: object[] = [{ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 }]
    expect(diff(left, right)).toEqual([
      { kind: 'create', path: [3], rhs: { d: 4 } },
    ])

    expect(diff(right, left)).toEqual([
      { kind: 'remove', path: [3], lhs: { d: 4 } },
    ])

    left = [{ a: 1 }, { c: 3 }]
    right = [{ a: 1 }, { b: 2 }, { c: 3 }]
    expect(diff(left, right)).toEqual([
      { kind: 'create', path: [1], rhs: { b: 2 } },
    ])

    expect(diff(right, left)).toEqual([
      { kind: 'remove', path: [1], lhs: { b: 2 } },
    ])

    left = [{ a: 1 }, { b: 2 }, { c: 3 }]
    right = [{ a: 1 }, { b: 42 }, { c: 3 }]
    expect(diff(left, right)).toEqual([
      { kind: 'change', path: [1, 'b'], lhs: 2, rhs: 42 },
    ])
  })

  it('arrays perform LCS diff on primitives', () => {
    expect(diff(['D', 'A', 'B', 'C'], ['A', 'B', 'C'])).toEqual([
      { kind: 'remove', path: [0], lhs: 'D' },
    ])

    expect(diff(['A', 'B', 'C'], ['D', 'A', 'B', 'C'])).toEqual([
      { kind: 'create', path: [0], rhs: 'D' },
    ])

    expect(diff(['A', 'C'], ['A', 'B', 'C'])).toEqual([
      { kind: 'create', path: [1], rhs: 'B' },
    ])

    expect(diff(['A', 'B', 'C', 'D'], ['B', 'D'])).toEqual([
      { kind: 'remove', path: [0], lhs: 'A' },
      { kind: 'remove', path: [2], lhs: 'C' },
    ])

    expect(diff(['B'], ['A', 'B', 'C', 'D'])).toEqual([
      { kind: 'create', path: [0], rhs: 'A' },
      { kind: 'create', path: [2], rhs: 'C' },
      { kind: 'create', path: [3], rhs: 'D' },
    ])

    expect(diff(['A', 'B', 'D'], ['B', 'C', 'D'])).toEqual([
      { kind: 'remove', path: [0], lhs: 'A' },
      { kind: 'create', path: [1], rhs: 'C' },
    ])

    expect(diff(['X', 'Y', 'Z'], ['A', 'B', 'C'])).toEqual([
      { kind: 'change', path: [0], lhs: 'X', rhs: 'A' },
      { kind: 'change', path: [1], lhs: 'Y', rhs: 'B' },
      { kind: 'change', path: [2], lhs: 'Z', rhs: 'C' },
    ])
  })

  it('arrays perform LCS diff on objects', () => {
    expect(
      diff(
        [{ id: 'D' }, { id: 'A' }, { id: 'B' }, { id: 'C' }],
        [{ id: 'A' }, { id: 'B' }, { id: 'C' }],
      ),
    ).toEqual([{ kind: 'remove', path: [0], lhs: { id: 'D' } }])

    expect(
      diff(
        [{ id: 'A' }, { id: 'B' }, { id: 'C' }],
        [{ id: 'D' }, { id: 'A' }, { id: 'B' }, { id: 'C' }],
      ),
    ).toEqual([{ kind: 'create', path: [0], rhs: { id: 'D' } }])

    expect(
      diff([{ id: 'A' }, { id: 'C' }], [{ id: 'A' }, { id: 'B' }, { id: 'C' }]),
    ).toEqual([{ kind: 'create', path: [1], rhs: { id: 'B' } }])

    expect(
      diff(
        [{ id: 'A' }, { id: 'B' }, { id: 'C' }, { id: 'D' }],
        [{ id: 'B' }, { id: 'D' }],
      ),
    ).toEqual([
      { kind: 'remove', path: [0], lhs: { id: 'A' } },
      { kind: 'remove', path: [2], lhs: { id: 'C' } },
    ])

    expect(
      diff([{ id: 'B' }], [{ id: 'A' }, { id: 'B' }, { id: 'C' }, { id: 'D' }]),
    ).toEqual([
      { kind: 'create', path: [0], rhs: { id: 'A' } },
      { kind: 'create', path: [2], rhs: { id: 'C' } },
      { kind: 'create', path: [3], rhs: { id: 'D' } },
    ])

    expect(
      diff(
        [{ id: 'A' }, { id: 'B' }, { id: 'D' }],
        [{ id: 'B' }, { id: 'C' }, { id: 'D' }],
      ),
    ).toEqual([
      { kind: 'remove', path: [0], lhs: { id: 'A' } },
      { kind: 'create', path: [1], rhs: { id: 'C' } },
    ])

    expect(
      diff(
        [{ id: 'X' }, { id: 'Y' }, { id: 'Z' }],
        [{ id: 'A' }, { id: 'B' }, { id: 'C' }],
      ),
    ).toEqual([
      { kind: 'change', path: [0, 'id'], lhs: 'X', rhs: 'A' },
      { kind: 'change', path: [1, 'id'], lhs: 'Y', rhs: 'B' },
      { kind: 'change', path: [2, 'id'], lhs: 'Z', rhs: 'C' },
    ])
  })

  describe('edge cases', () => {
    it('creates and removes inside arrays of BigInt', () => {
      expect(diff([1n, 2n, 3n], [0n, 1n, 3n, 4n])).toEqual([
        { kind: 'create', path: [0], rhs: 0n },
        { kind: 'remove', path: [1], lhs: 2n },
        { kind: 'create', path: [3], rhs: 4n },
      ])
    })

    it('adds a property inside an object stored in an array', () => {
      const left = [
        { id: 1, value: 1 },
        { id: 2, value: 2 },
      ]
      const right = [
        { id: 1, value: 1 },
        { id: 2, value: 2, extra: true },
      ]
      expect(diff(left, right)).toEqual([
        { kind: 'create', path: [1, 'extra'], rhs: true },
      ])
    })

    it('removes a property inside an object stored in an array', () => {
      const left = [
        { id: 1, value: 1 },
        { id: 2, value: 2, extra: true },
      ]
      const right = [
        { id: 1, value: 1 },
        { id: 2, value: 2 },
      ]
      expect(diff(left, right)).toEqual([
        { kind: 'remove', path: [1, 'extra'], lhs: true },
      ])
    })

    it('deep change inside nested arrays', () => {
      expect(diff([[[1, 2]]], [[[1, 3]]])).toEqual([
        { kind: 'change', path: [0, 0, 1], lhs: 2, rhs: 3 },
      ])
    })

    it('change of Date instances inside an array', () => {
      expect(diff([new Date(1)], [new Date(2)])).toEqual([
        { kind: 'change', path: [0], lhs: new Date(1), rhs: new Date(2) },
      ])
    })

    it('NaN handling with LCS-based insert/remove', () => {
      expect(
        diff([Number.NaN, 'A', Number.NaN], ['A', Number.NaN, 'B']),
      ).toEqual([
        { kind: 'remove', path: [0], lhs: Number.NaN },
        { kind: 'create', path: [2], rhs: 'B' },
      ])
    })

    it('reorder of primitives is expressed as remove + create', () => {
      expect(diff(['A', 'B'], ['B', 'A'])).toEqual([
        { kind: 'remove', path: [0], lhs: 'A' },
        { kind: 'create', path: [1], rhs: 'A' },
      ])
    })

    it('handles identical objects that share reference', () => {
      const shared = { same: true }
      expect(diff([shared, shared], [shared, shared])).toEqual([])
    })

    it('handles sparse arrays (holes treated as undefined)', () => {
      expect(diff([, 1], [undefined, 1])).toEqual([])
    })

    it('object to array transition inside object property', () => {
      expect(diff({ list: { a: 1 } }, { list: [{ a: 1 }] })).toEqual([
        { kind: 'change', path: ['list'], lhs: { a: 1 }, rhs: [{ a: 1 }] },
      ])
    })
  })
})

// NOTE(radomski): Imported from https://github.com/AsyncBanana/microdiff/tree/master/tests
describe('microdiff tests', () => {
  it('new raw value', () => {
    expect(diff({ test: true }, { test: true, test2: true })).toEqual([
      { kind: 'create', path: ['test2'], rhs: true },
    ])
  })
  it('change raw value', () => {
    expect(diff({ test: true }, { test: false })).toEqual([
      { kind: 'change', path: ['test'], rhs: false, lhs: true },
    ])
  })
  it('remove raw value', () => {
    expect(diff({ test: true, test2: true }, { test: true })).toEqual([
      { kind: 'remove', path: ['test2'], lhs: true },
    ])
  })

  it('replace object with null', () => {
    expect(diff({ object: { test: true } }, { object: null })).toEqual([
      { kind: 'change', path: ['object'], rhs: null, lhs: { test: true } },
    ])
  })

  it('replace object with other value', () => {
    expect(diff({ object: { test: true } }, { object: 'string' })).toEqual([
      { kind: 'change', path: ['object'], rhs: 'string', lhs: { test: true } },
    ])
  })

  it('equal null protype objects', () => {
    expect(diff(Object.create(null), Object.create(null))).toEqual([])
  })

  it('unequal null protype objects', () => {
    const obj1 = Object.create(null)
    const obj2 = Object.create(null)
    obj2.test = true
    expect(diff(obj1, obj2)).toEqual([
      { kind: 'create', path: ['test'], rhs: true },
    ])
  })

  it('Handles equal string classes', () => {
    expect(
      diff({ string: new String('hi') }, { string: new String('hi') }),
    ).toEqual([])
  })

  it('Handles equal number classes', () => {
    expect(diff({ number: new Number(1) }, { number: new Number(1) })).toEqual(
      [],
    )
  })

  it('Handles unequal number classes', () => {
    const rhs = new Number(2)
    const lhs = new Number(1)
    expect(diff({ number: lhs }, { number: rhs })).toEqual([
      { kind: 'change', path: ['number'], rhs, lhs },
    ])
  })

  it('Handles equal dates', () => {
    expect(diff({ date: new Date(1) }, { date: new Date(1) })).toEqual([])
  })

  it('Handles unequal dates', () => {
    expect(diff({ date: new Date(1) }, { date: new Date(2) })).toEqual([
      { path: ['date'], kind: 'change', rhs: new Date(2), lhs: new Date(1) },
    ])
  })

  it('Handles value being a date and the other not', () => {
    expect(diff({ date: new Date(1) }, { date: 'not date' })).toEqual([
      { path: ['date'], kind: 'change', rhs: 'not date', lhs: new Date(1) },
    ])

    expect(diff({ date: 'not date' }, { date: new Date(1) })).toEqual([
      { path: ['date'], kind: 'change', rhs: new Date(1), lhs: 'not date' },
    ])
  })

  it('new NaN value in object', () => {
    expect(diff({}, { testNaN: Number.NaN })).toEqual([
      { kind: 'create', path: ['testNaN'], rhs: Number.NaN },
    ])
  })

  it('change NaN value in object', () => {
    expect(diff({ testNaN: Number.NaN }, { testNaN: 0 })).toEqual([
      { kind: 'change', path: ['testNaN'], rhs: 0, lhs: Number.NaN },
    ])
  })

  it('do not change NaN value in object', () => {
    expect(diff({ testNaN: Number.NaN }, { testNaN: Number.NaN })).toEqual([])
  })

  it('remove NaN value in object', () => {
    expect(diff({ testNaN: Number.NaN }, {})).toEqual([
      { kind: 'remove', path: ['testNaN'], lhs: Number.NaN },
    ])
  })

  it('new NaN value in array', () => {
    expect(diff([], [Number.NaN])).toEqual([
      { kind: 'create', path: [0], rhs: Number.NaN },
    ])
  })

  it('change NaN value in object', () => {
    expect(diff([Number.NaN], [0])).toEqual([
      { kind: 'change', path: [0], rhs: 0, lhs: Number.NaN },
    ])
  })

  it('do not change NaN value in array', () => {
    expect(diff([Number.NaN], [Number.NaN])).toEqual([])
  })

  it('Handles equal regex', () => {
    expect(diff({ regex: /a/ }, { regex: /a/ })).toEqual([])
  })

  it('Handles unequal regex', () => {
    expect(diff({ regex: /a/ }, { regex: /b/ })).toEqual([
      { kind: 'change', path: ['regex'], rhs: /b/, lhs: /a/ },
    ])
  })

  it('top level array & array diff', () => {
    expect(diff(['test', 'testing'], ['test'])).toEqual([
      { kind: 'remove', path: [1], lhs: 'testing' },
    ])
  })

  it('nested array', () => {
    expect(diff(['test', ['test']], ['test', ['test', 'test2']])).toEqual([
      { kind: 'create', path: [1, 1], rhs: 'test2' },
    ])
  })

  it('object in array in object', () => {
    const left = { test: ['test', { test2: true }] }
    const right = { test: ['test', { test2: false }] }
    expect(diff(left, right)).toEqual([
      { kind: 'change', path: ['test', 1, 'test2'], rhs: false, lhs: true },
    ])
  })

  it('array to object', () => {
    expect(diff({ data: [] }, { data: { val: 'test' } })).toEqual([
      { kind: 'change', path: ['data'], rhs: { val: 'test' }, lhs: [] },
    ])
  })
})
