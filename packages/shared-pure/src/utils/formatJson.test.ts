import { expect } from 'earl'
import { formatJson } from './formatJson'

describe(formatJson.name, () => {
  it('primitives', () => {
    expect(formatJson(null).trimEnd()).toEqual('null')
    expect(formatJson(true).trimEnd()).toEqual('true')
    expect(formatJson(false).trimEnd()).toEqual('false')
    expect(formatJson(1).trimEnd()).toEqual('1')
    expect(formatJson(-1).trimEnd()).toEqual('-1')
    expect(formatJson(3.14).trimEnd()).toEqual('3.14')
    expect(formatJson(1e9).trimEnd()).toEqual('1000000000')
    expect(formatJson('string').trimEnd()).toEqual('"string"')
  })

  it('edge cases', () => {
    expect(formatJson(() => {}).trimEnd()).toEqual('null')
  })

  it('numbers – edge cases', () => {
    expect(formatJson(0).trimEnd()).toEqual('0')
    expect(formatJson(-0).trimEnd()).toEqual('0')
    expect(formatJson(Number.MAX_SAFE_INTEGER).trimEnd()).toEqual(
      '9007199254740991',
    )
    expect(formatJson(Number.MIN_SAFE_INTEGER).trimEnd()).toEqual(
      '-9007199254740991',
    )
    expect(formatJson(1e-9).trimEnd()).toEqual('1e-9')
    expect(formatJson(-1e-9).trimEnd()).toEqual('-1e-9')
    expect(formatJson(Number.NaN).trimEnd()).toEqual('null')
    expect(formatJson(Number.POSITIVE_INFINITY).trimEnd()).toEqual('null')
    expect(formatJson(Number.NEGATIVE_INFINITY).trimEnd()).toEqual('null')
    expect(() => formatJson(1n)).toThrow()
  })

  it('strings – edge cases', () => {
    expect(formatJson('').trimEnd()).toEqual('""')
    expect(formatJson('"').trimEnd()).toEqual('"\\""')
    expect(formatJson('back\\slash').trimEnd()).toEqual('"back\\\\slash"')
    expect(formatJson('line\nbreak').trimEnd()).toEqual('"line\\nbreak"')
    expect(formatJson('emoji 😊').trimEnd()).toEqual('"emoji 😊"')
  })

  it('basic arrays', () => {
    expect(formatJson([]).trimEnd()).toEqual('[]')
    expect(formatJson([1, 2, 3]).trimEnd()).toEqual('[1, 2, 3]')
    expect(formatJson(['string1', 'string2']).trimEnd()).toEqual(
      '["string1", "string2"]',
    )
  })

  it('arrays – edge cases', () => {
    expect(formatJson([null, true, 'str', 0]).trimEnd().trimEnd()).toEqual(
      '[null, true, "str", 0]',
    )
    expect(formatJson([[]]).trimEnd().trimEnd()).toEqual('[[]]')
    expect(
      formatJson([[1], [2, 3]])
        .trimEnd()
        .trimEnd(),
    ).toEqual('[[1], [2, 3]]')
    expect(
      formatJson([[1, [2]], 3])
        .trimEnd()
        .trimEnd(),
    ).toEqual('[[1, [2]], 3]')
    expect(formatJson([0, -0]).trimEnd().trimEnd()).toEqual('[0, 0]')
    expect(formatJson([1, undefined, 3]).trimEnd().trimEnd()).toEqual(
      '[1, null, 3]',
    )
  })

  it('arrays breaking lines', () => {
    const array = [
      '0xd2a530170D71a9Cfe1651Fb468E2B98F7Ed7456b',
      '0x888888435FDe8e7d4c54cAb67f206e4199454c60',
      '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      '0x94025780a1aB58868D9B2dBBB775f44b32e8E6e5',
    ]

    const expected = String.raw`
[
  "0xd2a530170D71a9Cfe1651Fb468E2B98F7Ed7456b",
  "0x888888435FDe8e7d4c54cAb67f206e4199454c60",
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  "0x94025780a1aB58868D9B2dBBB775f44b32e8E6e5"
]`.trim()
    expect(formatJson(array).trimEnd()).toEqual(expected)
  })

  it('arrays are concise for numbers', () => {
    const array = [
      1634886255, 6450786, 6778479, 1818848877, 1869640809, 1886350457, 6648936,
      1635148152, 1835365481, 1835101812, 2020368761, 1887071085, 1836016741,
      1650553709,
    ]

    const expected = String.raw`
[
  1634886255, 6450786, 6778479, 1818848877, 1869640809, 1886350457, 6648936,
  1635148152, 1835365481, 1835101812, 2020368761, 1887071085, 1836016741,
  1650553709
]`.trim()

    expect(formatJson(array).trimEnd()).toEqual(expected)
  })

  it('basic objects', () => {
    expect(formatJson({}).trimEnd()).toEqual('{}')
    expect(formatJson({ name: 'John' }).trimEnd()).toEqual('{ "name": "John" }')
    expect(
      formatJson({
        name: 'John',
        age: 42,
        hobbies: ['fishing', 'drawing'],
      }).trimEnd(),
    ).toEqual(
      '{ "name": "John", "age": 42, "hobbies": ["fishing", "drawing"] }',
    )
  })

  it('objects – edge cases', () => {
    expect(formatJson({ a: { b: 1 } }).trimEnd()).toEqual('{ "a": { "b": 1 } }')
    expect(formatJson({ mixed: [1, { x: 'y' }], empty: {} }).trimEnd()).toEqual(
      '{ "mixed": [1, { "x": "y" }], "empty": {} }',
    )
    expect(
      formatJson({ nullish: null, truthy: true, num: 0, str: '' }).trimEnd(),
    ).toEqual('{ "nullish": null, "truthy": true, "num": 0, "str": "" }')
    expect(formatJson({ 'weird key': 1, 'quote"key': 2 }).trimEnd()).toEqual(
      '{ "weird key": 1, "quote\\"key": 2 }',
    )

    expect(formatJson({ a: 123, b: 234, c: undefined }).trimEnd()).toEqual(
      '{ "a": 123, "b": 234 }',
    )
  })

  it('objects breaking lines', () => {
    const obj = {
      address: '0xd2a530170D71a9Cfe1651Fb468E2B98F7Ed7456b',
      balance: 123456789,
      active: true,
      tags: ['tag1', 'tag2'],
    }

    const expected = String.raw`
{
  "address": "0xd2a530170D71a9Cfe1651Fb468E2B98F7Ed7456b",
  "balance": 123456789,
  "active": true,
  "tags": ["tag1", "tag2"]
}`.trim()

    expect(formatJson(obj).trimEnd()).toEqual(expected)
  })

  it('breaking lines across groups', () => {
    const obj = {
      somethingsomething: [
        'Lorem ipsum dolor sit amet, consectetur adipiscing e',
      ],
      somethingElse: 123,
    }

    const expected = String.raw`
{
  "somethingsomething": [
    "Lorem ipsum dolor sit amet, consectetur adipiscing e"
  ],
  "somethingElse": 123
}`.trim()

    expect(formatJson(obj).trimEnd()).toEqual(expected)
  })

  it('deeply nested mixed structures', () => {
    const complex = {
      users: [
        { id: 1, name: 'Alice', roles: ['admin', 'editor'] },
        { id: 2, name: 'Bob', roles: [] },
      ],
      meta: { count: 2, active: true },
    }

    const expected = String.raw`
{
  "users": [
    { "id": 1, "name": "Alice", "roles": ["admin", "editor"] },
    { "id": 2, "name": "Bob", "roles": [] }
  ],
  "meta": { "count": 2, "active": true }
}`.trim()

    expect(formatJson(complex).trimEnd()).toEqual(expected)
  })

  it('large heterogeneous array – multi-line', () => {
    const arr = [0, { a: 1, b: [true, false] }, ['x', { y: 'z' }], null]
    const expected =
      '[0, { "a": 1, "b": [true, false] }, ["x", { "y": "z" }], null]'

    expect(formatJson(arr).trimEnd()).toEqual(expected)
  })

  it('strings with multiple escape sequences', () => {
    expect(formatJson('tab\tnewline\ncarriage\rreturn').trimEnd()).toEqual(
      '"tab\\tnewline\\ncarriage\\rreturn"',
    )
  })

  it('deeply nested arrays', () => {
    expect(formatJson([[[[[1]]]]]).trimEnd()).toEqual('[[[[[1]]]]]')
  })
})
