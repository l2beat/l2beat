import { describe, expect, it } from 'vitest'
import { type Validator, v } from './validate.js'

describe('validate', () => {
  const NamePosition = v.object({
    name: v.string(),
    position: v.object({
      x: v.number(),
      y: v.number(),
    }),
  })

  it('validate success', () => {
    const input = {
      name: 'bar',
      position: { x: 1, y: 2 },
      otherProp: true,
    }
    expect(NamePosition.validate(input)).toBe(input)
  })

  it('parse success', () => {
    const input = {
      name: 'bar',
      position: { x: 1, y: 2 },
      otherProp: true,
    }
    expect(NamePosition.parse(input)).toStrictEqual({
      name: 'bar',
      position: { x: 1, y: 2 },
    })
  })

  it('validate failure', () => {
    const input = {
      name: 'bar',
      position: { x: true, y: 2 },
    }
    expect(NamePosition.safeValidate(input)).toStrictEqual({
      success: false,
      path: '.position.x',
      message: 'Expected number, got boolean.',
    })
  })

  it('array', () => {
    const Pos = v.object({ x: v.number(), y: v.number() })
    const PosArray = v.array(Pos)

    const input = [
      { x: 1, y: 2 },
      { x: 3, y: 'foo' },
    ]
    expect(PosArray.safeValidate(input)).toStrictEqual({
      success: false,
      path: '[1].y',
      message: 'Expected number, got string.',
    })
  })

  it('literal', () => {
    const Foo = v.literal('Foo')
    expect(Foo.safeValidate('Foo')).toStrictEqual({
      success: true,
      data: 'Foo',
    })
    expect(Foo.safeValidate('x')).toStrictEqual({
      success: false,
      path: '',
      message: 'Expected exactly Foo, got string.',
    })
  })

  it('union', () => {
    const Foo = v.union([v.string(), v.null()])
    expect(Foo.safeValidate(null)).toStrictEqual({ success: true, data: null })
    expect(Foo.safeValidate('foo')).toStrictEqual({
      success: true,
      data: 'foo',
    })
    expect(Foo.safeValidate(1)).toStrictEqual({
      success: false,
      path: '',
      message:
        'None of the union variants matched, got number. Variant 0: Expected string, got number. Variant 1: Expected null, got number.',
    })
  })

  it('union with array', () => {
    const Item = v.union([
      v.null(),
      v.array(v.object({ events: v.array(v.string()) })),
    ])

    expect(Item.safeValidate(null)).toStrictEqual({ success: true, data: null })
    expect(Item.safeValidate([{ events: ['foo', 'foo'] }])).toStrictEqual({
      success: true,
      data: [{ events: ['foo', 'foo'] }],
    })
    expect(Item.safeValidate([{ events: ['foo', 123] }])).toStrictEqual({
      success: false,
      path: '',
      message:
        'None of the union variants matched, got array. Variant 0: Expected null, got array. Variant 1 at [0].events[1]: Expected string, got number.',
    })
  })

  it('record', () => {
    const Foo = v.record(
      v.string().transform((x) => x.toUpperCase()),
      v.number().transform((x) => x * 2),
    )
    const input = { foo: 1, bar: 2, baz: 3 }
    expect(Foo.safeParse(input)).toStrictEqual({
      success: true,
      data: { FOO: 2, BAR: 4, BAZ: 6 },
    })
  })

  it('enum', () => {
    const Foo = v.enum(['foo', 'bar', 'baz'])
    expect(Foo.safeValidate('foo')).toStrictEqual({
      success: true,
      data: 'foo',
    })
    expect(Foo.safeValidate('xxx')).toStrictEqual({
      success: false,
      path: '',
      message:
        'None of the enum variants matched, got string. Possible values: foo, bar, baz.',
    })
  })

  it('enum record', () => {
    const Foo = v.enum(['foo', 'bar'])
    const FooRecord = v.record(Foo, v.number())

    expect(FooRecord.safeValidate({ foo: 1, bar: 2 })).toStrictEqual({
      success: true,
      data: { foo: 1, bar: 2 },
    })
    expect(FooRecord.safeValidate({ foo: 1 })).toStrictEqual({
      success: false,
      path: '',
      message: 'Enum key bar not found.',
    })

    const FooRecordOptional = v.record(Foo, v.number().optional())
    expect(FooRecordOptional.safeValidate({ foo: 1 })).toStrictEqual({
      success: true,
      // TODO: is there a way to type it correctly in FooRecordOptional?
      data: { foo: 1 } as any,
    })
  })

  it('object with enum values and optional', () => {
    const Foo = v.object({
      key1: v.enum(['foo', 'bar']).optional(),
      key2: v.enum(['foo', 'bar']).optional(),
      key3: v.enum(['foo', 'bar']).optional(),
    })

    expect(Foo.safeValidate({ key1: undefined, key3: 'foo' })).toStrictEqual({
      success: true,
      data: { key1: undefined, key3: 'foo' },
    })
  })

  it('strict object', () => {
    const Foo = v.strictObject({
      key1: v.string(),
      key2: v.string().optional(),
    })

    expect(Foo.safeValidate({ key1: 'bar', key3: 'foo' })).toStrictEqual({
      success: false,
      path: '.key3',
      message: 'Strict violation, unexpected key found.',
    })
  })

  it('passthrough object', () => {
    type Foo = v.infer<typeof Foo>
    const Foo = v.passthroughObject({
      key1: v.string(),
      key2: v.string().optional(),
    })

    expect(Foo.safeValidate({ key1: 'bar', key3: 'foo' })).toStrictEqual({
      success: true,
      data: { key1: 'bar', key3: 'foo' } as Foo,
    })

    expect(
      Foo.safeValidate({ key1: 'bar', key2: undefined, key3: 'foo' }),
    ).toStrictEqual({
      success: true,
      data: { key1: 'bar', key2: undefined, key3: 'foo' } as Foo,
    })
  })

  it('default - basic use', () => {
    const Foo = v.union([v.number(), v.null(), v.undefined()]).default(2)
    expect(Foo.safeParse(3)).toStrictEqual({ success: true, data: 3 })
    expect(Foo.safeParse(null)).toStrictEqual({ success: true, data: 2 })
    expect(Foo.safeParse(undefined)).toStrictEqual({ success: true, data: 2 })
  })

  it('tuple', () => {
    const A = v.tuple([v.number(), v.string()])
    expect(A.safeParse([1, 'foo'])).toStrictEqual({
      success: true,
      data: [1, 'foo'],
    })

    const B = v.tuple([
      v.number(),
      v.string().optional(),
      v.string().optional(),
    ])
    expect(B.safeParse([1, 'foo'])).toStrictEqual({
      success: true,
      data: [1, 'foo'],
    })

    const C = v.tuple([
      v.number(),
      v.string().optional(),
      v.string().optional(),
    ])
    expect(C.safeParse([1, undefined, 'foo'])).toStrictEqual({
      success: true,
      data: [1, undefined, 'foo'],
    })
  })

  it('lazy', () => {
    interface List {
      item: number
      next: List | null
    }
    const List: Validator<List> = v.lazy(() =>
      v.object({
        item: v.number(),
        next: v.union([v.null(), List]),
      }),
    )
    const list = { item: 1, next: { item: 2, next: { item: 3, next: null } } }
    expect(List.safeParse(list)).toStrictEqual({
      success: true,
      data: list,
    })
  })

  describe('optional', () => {
    it('object missing key', () => {
      const Schema = v.object({ x: v.number().optional() })
      expect(Schema.validate({})).toStrictEqual({})
      expect(Schema.parse({})).toStrictEqual({})
    })

    it('object undefined key', () => {
      const Schema = v.object({ x: v.number().optional() })
      expect(Schema.validate({ x: undefined })).toStrictEqual({ x: undefined })
      expect(Schema.parse({ x: undefined })).toStrictEqual({})
    })

    it('enum record missing value', () => {
      const Schema = v.record(v.enum(['a', 'b']), v.number().optional())
      expect(Schema.validate({ a: 1 })).toStrictEqual({ a: 1 } as any)
      expect(Schema.parse({ a: 1 })).toStrictEqual({ a: 1 } as any)
    })

    it('tuple missing element', () => {
      const Schema = v.tuple([v.number().optional()])
      expect(Schema.validate([])).toStrictEqual([])
      expect(Schema.parse([])).toStrictEqual([])
    })

    it('tuple undefined element', () => {
      const Schema = v.tuple([v.number().optional()])
      expect(Schema.validate([undefined])).toStrictEqual([undefined])
      expect(Schema.parse([undefined])).toStrictEqual([undefined])
    })
  })

  describe('default', () => {
    it('object missing key', () => {
      const Schema = v.object({ x: v.number().default(42) })
      expect(Schema.parse({})).toStrictEqual({ x: 42 })
    })

    it('object undefined key', () => {
      const Schema = v.object({ x: v.number().default(42) })
      expect(Schema.parse({ x: undefined })).toStrictEqual({ x: 42 })
    })

    it('enum record missing value', () => {
      const Schema = v.record(v.enum(['a', 'b']), v.number().default(42))
      expect(Schema.parse({ a: 1 })).toStrictEqual({ a: 1, b: 42 })
    })

    it('enum record undefined value', () => {
      const Schema = v.record(v.enum(['a', 'b']), v.number().default(42))
      expect(Schema.parse({ a: 1, b: undefined })).toStrictEqual({
        a: 1,
        b: 42,
      })
    })

    it('enum undefined value', () => {
      const Schema = v.record(v.string(), v.number().default(42))
      expect(Schema.parse({ a: 1, b: undefined })).toStrictEqual({
        a: 1,
        b: 42,
      })
    })

    it('tuple missing element', () => {
      const Schema = v.tuple([v.number().default(42)])
      expect(Schema.parse([])).toStrictEqual([42])
    })

    it('tuple undefined element', () => {
      const Schema = v.tuple([v.number().default(42)])
      expect(Schema.parse([undefined])).toStrictEqual([42])
    })

    it('structuredClone', () => {
      const Foo = v.array(v.number()).default([])
      const x = Foo.parse(undefined)
      x.push(1)
      const y = Foo.parse(undefined)
      expect(y).toStrictEqual([])
    })
  })

  describe('catch', () => {
    it('object missing key', () => {
      const Schema = v.object({ x: v.number().catch(42) })
      expect(Schema.parse({})).toStrictEqual({ x: 42 })
    })

    it('object undefined key', () => {
      const Schema = v.object({ x: v.number().catch(42) })
      expect(Schema.parse({ x: undefined })).toStrictEqual({ x: 42 })
    })

    it('object invalid key', () => {
      const Schema = v.object({ x: v.number().catch(42) })
      expect(Schema.parse({ x: 'red' })).toStrictEqual({ x: 42 })
    })

    it('enum record missing value', () => {
      const Schema = v.record(v.enum(['a', 'b']), v.number().catch(42))
      expect(Schema.parse({ a: 1 })).toStrictEqual({ a: 1, b: 42 })
    })

    it('enum record undefined value', () => {
      const Schema = v.record(v.enum(['a', 'b']), v.number().catch(42))
      expect(Schema.parse({ a: 1, b: undefined })).toStrictEqual({
        a: 1,
        b: 42,
      })
    })

    it('enum record invalid value', () => {
      const Schema = v.record(v.enum(['a', 'b']), v.number().catch(42))
      expect(Schema.parse({ a: 1, b: 'red' })).toStrictEqual({ a: 1, b: 42 })
    })

    it('enum undefined value', () => {
      const Schema = v.record(v.string(), v.number().catch(42))
      expect(Schema.parse({ a: 1, b: undefined })).toStrictEqual({
        a: 1,
        b: 42,
      })
    })

    it('enum invalid value', () => {
      const Schema = v.record(v.string(), v.number().catch(42))
      expect(Schema.parse({ a: 1, b: 'red' })).toStrictEqual({ a: 1, b: 42 })
    })

    it('tuple missing element', () => {
      const Schema = v.tuple([v.number().catch(42)])
      expect(Schema.parse([])).toStrictEqual([42])
    })

    it('tuple undefined element', () => {
      const Schema = v.tuple([v.number().catch(42)])
      expect(Schema.parse([undefined])).toStrictEqual([42])
    })

    it('tuple invalid element', () => {
      const Schema = v.tuple([v.number().catch(42)])
      expect(Schema.parse(['red'])).toStrictEqual([42])
    })

    it('structuredClone', () => {
      const Foo = v.array(v.number()).catch([])
      const x = Foo.parse('not array')
      x.push(1)
      const y = Foo.parse('not array')
      expect(y).toStrictEqual([])
    })
  })

  describe('describe', () => {
    it('should add description', () => {
      const Foo = v.object({ x: v.number() })
      expect(Foo.description).toStrictEqual(undefined)
      Foo.describe('Bar')
      expect(Foo.description).toStrictEqual('Bar')
    })
  })

  describe('meta', () => {
    it('should add metadata', () => {
      const Foo = v.object({ x: v.number() })
      expect(Foo.metadata).toStrictEqual(undefined)
      Foo.meta({ description: 'Bar' })
      expect(Foo.metadata).toStrictEqual({ description: 'Bar' })
    })

    it('should merge metadata', () => {
      const Foo = v.object({ x: v.number() })
      Foo.meta({ description: 'Bar' })
      Foo.meta({ owner: 'Baz' })
      expect(Foo.metadata).toStrictEqual({ description: 'Bar', owner: 'Baz' })
    })

    it('should reject reserved schema keys', () => {
      const Foo = v.object({ x: v.number() })
      expect(() => Foo.meta({ anyOf: 'true' })).toThrow(
        'Metadata key "anyOf" is reserved.',
      )
    })
  })
})
