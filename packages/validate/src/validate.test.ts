import { expect } from 'earl'
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
    expect(NamePosition.validate(input)).toExactlyEqual(input)
  })

  it('parse success', () => {
    const input = {
      name: 'bar',
      position: { x: 1, y: 2 },
      otherProp: true,
    }
    expect(NamePosition.parse(input)).toEqual({
      name: 'bar',
      position: { x: 1, y: 2 },
    })
  })

  it('validate failure', () => {
    const input = {
      name: 'bar',
      position: { x: true, y: 2 },
    }
    expect(NamePosition.safeValidate(input)).toEqual({
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
    expect(PosArray.safeValidate(input)).toEqual({
      success: false,
      path: '[1].y',
      message: 'Expected number, got string.',
    })
  })

  it('literal', () => {
    const Foo = v.literal('Foo')
    expect(Foo.safeValidate('Foo')).toEqual({ success: true, data: 'Foo' })
    expect(Foo.safeValidate('x')).toEqual({
      success: false,
      path: '',
      message: 'Expected exactly Foo, got string.',
    })
  })

  it('union', () => {
    const Foo = v.union([v.string(), v.null()])
    expect(Foo.safeValidate(null)).toEqual({ success: true, data: null })
    expect(Foo.safeValidate('foo')).toEqual({ success: true, data: 'foo' })
    expect(Foo.safeValidate(1)).toEqual({
      success: false,
      path: '',
      message: 'None of the union variants matched, got number.',
    })
  })

  it('record', () => {
    const Foo = v.record(
      v.string().transform((x) => x.toUpperCase()),
      v.number().transform((x) => x * 2),
    )
    const input = { foo: 1, bar: 2, baz: 3 }
    expect(Foo.safeParse(input)).toEqual({
      success: true,
      data: { FOO: 2, BAR: 4, BAZ: 6 },
    })
  })

  it('enum', () => {
    const Foo = v.enum(['foo', 'bar', 'baz'])
    expect(Foo.safeValidate('foo')).toEqual({ success: true, data: 'foo' })
    expect(Foo.safeValidate('xxx')).toEqual({
      success: false,
      path: '',
      message: 'None of the enum variants matched, got string.',
    })
  })

  it('enum record', () => {
    const Foo = v.enum(['foo', 'bar'])
    const FooRecord = v.record(Foo, v.number())

    expect(FooRecord.safeValidate({ foo: 1, bar: 2 })).toEqual({
      success: true,
      data: { foo: 1, bar: 2 },
    })
    expect(FooRecord.safeValidate({ foo: 1 })).toEqual({
      success: false,
      path: '',
      message: 'Enum key bar not found.',
    })

    const FooRecordOptional = v.record(Foo, v.number().optional())
    expect(FooRecordOptional.safeValidate({ foo: 1 })).toEqual({
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

    expect(Foo.safeValidate({ key1: undefined, key3: 'foo' })).toEqual({
      success: true,
      data: { key1: undefined, key3: 'foo' },
    })
  })

  it('default - basic use', () => {
    const Foo = v.union([v.number(), v.null(), v.undefined()]).default(2)
    expect(Foo.safeParse(3)).toEqual({ success: true, data: 3 })
    expect(Foo.safeParse(null)).toEqual({ success: true, data: 2 })
    expect(Foo.safeParse(undefined)).toEqual({ success: true, data: 2 })
  })

  it('tuple', () => {
    const A = v.tuple([v.number(), v.string()])
    expect(A.safeParse([1, 'foo'])).toEqual({
      success: true,
      data: [1, 'foo'],
    })

    const B = v.tuple([
      v.number(),
      v.string().optional(),
      v.string().optional(),
    ])
    expect(B.safeParse([1, 'foo'])).toEqual({
      success: true,
      data: [1, 'foo'],
    })

    const C = v.tuple([
      v.number(),
      v.string().optional(),
      v.string().optional(),
    ])
    expect(C.safeParse([1, undefined, 'foo'])).toEqual({
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
    expect(List.safeParse(list)).toEqual({
      success: true,
      data: list,
    })
  })

  describe('optional', () => {
    it('object missing key', () => {
      const Schema = v.object({ x: v.number().optional() })
      expect(Schema.validate({})).toEqual({})
      expect(Schema.parse({})).toEqual({})
    })

    it('object undefined key', () => {
      const Schema = v.object({ x: v.number().optional() })
      expect(Schema.validate({ x: undefined })).toEqual({ x: undefined })
      expect(Schema.parse({ x: undefined })).toEqual({})
    })

    it('enum record missing value', () => {
      const Schema = v.record(v.enum(['a', 'b']), v.number().optional())
      expect(Schema.validate({ a: 1 })).toEqual({ a: 1 } as any)
      expect(Schema.parse({ a: 1 })).toEqual({ a: 1 } as any)
    })

    it('tuple missing element', () => {
      const Schema = v.tuple([v.number().optional()])
      expect(Schema.validate([])).toEqual([])
      expect(Schema.parse([])).toEqual([])
    })

    it('tuple undefined element', () => {
      const Schema = v.tuple([v.number().optional()])
      expect(Schema.validate([undefined])).toEqual([undefined])
      expect(Schema.parse([undefined])).toEqual([undefined])
    })
  })

  describe('default', () => {
    it('object missing key', () => {
      const Schema = v.object({ x: v.number().default(42) })
      expect(Schema.parse({})).toEqual({ x: 42 })
    })

    it('object undefined key', () => {
      const Schema = v.object({ x: v.number().default(42) })
      expect(Schema.parse({ x: undefined })).toEqual({ x: 42 })
    })

    it('enum record missing value', () => {
      const Schema = v.record(v.enum(['a', 'b']), v.number().default(42))
      expect(Schema.parse({ a: 1 })).toEqual({ a: 1, b: 42 })
    })

    it('enum record undefined value', () => {
      const Schema = v.record(v.enum(['a', 'b']), v.number().default(42))
      expect(Schema.parse({ a: 1, b: undefined })).toEqual({ a: 1, b: 42 })
    })

    it('enum undefined value', () => {
      const Schema = v.record(v.string(), v.number().default(42))
      expect(Schema.parse({ a: 1, b: undefined })).toEqual({ a: 1, b: 42 })
    })

    it('tuple missing element', () => {
      const Schema = v.tuple([v.number().default(42)])
      expect(Schema.parse([])).toEqual([42])
    })

    it('tuple undefined element', () => {
      const Schema = v.tuple([v.number().default(42)])
      expect(Schema.parse([undefined])).toEqual([42])
    })

    it('structuredClone', () => {
      const Foo = v.array(v.number()).default([])
      const x = Foo.parse(undefined)
      x.push(1)
      const y = Foo.parse(undefined)
      expect(y).toEqual([])
    })
  })

  describe('catch', () => {
    it('object missing key', () => {
      const Schema = v.object({ x: v.number().catch(42) })
      expect(Schema.parse({})).toEqual({ x: 42 })
    })

    it('object undefined key', () => {
      const Schema = v.object({ x: v.number().catch(42) })
      expect(Schema.parse({ x: undefined })).toEqual({ x: 42 })
    })

    it('object invalid key', () => {
      const Schema = v.object({ x: v.number().catch(42) })
      expect(Schema.parse({ x: 'red' })).toEqual({ x: 42 })
    })

    it('enum record missing value', () => {
      const Schema = v.record(v.enum(['a', 'b']), v.number().catch(42))
      expect(Schema.parse({ a: 1 })).toEqual({ a: 1, b: 42 })
    })

    it('enum record undefined value', () => {
      const Schema = v.record(v.enum(['a', 'b']), v.number().catch(42))
      expect(Schema.parse({ a: 1, b: undefined })).toEqual({ a: 1, b: 42 })
    })

    it('enum record invalid value', () => {
      const Schema = v.record(v.enum(['a', 'b']), v.number().catch(42))
      expect(Schema.parse({ a: 1, b: 'red' })).toEqual({ a: 1, b: 42 })
    })

    it('enum undefined value', () => {
      const Schema = v.record(v.string(), v.number().catch(42))
      expect(Schema.parse({ a: 1, b: undefined })).toEqual({ a: 1, b: 42 })
    })

    it('enum invalid value', () => {
      const Schema = v.record(v.string(), v.number().catch(42))
      expect(Schema.parse({ a: 1, b: 'red' })).toEqual({ a: 1, b: 42 })
    })

    it('tuple missing element', () => {
      const Schema = v.tuple([v.number().catch(42)])
      expect(Schema.parse([])).toEqual([42])
    })

    it('tuple undefined element', () => {
      const Schema = v.tuple([v.number().catch(42)])
      expect(Schema.parse([undefined])).toEqual([42])
    })

    it('tuple invalid element', () => {
      const Schema = v.tuple([v.number().catch(42)])
      expect(Schema.parse(['red'])).toEqual([42])
    })

    it('structuredClone', () => {
      const Foo = v.array(v.number()).catch([])
      const x = Foo.parse('not array')
      x.push(1)
      const y = Foo.parse('not array')
      expect(y).toEqual([])
    })
  })
})
