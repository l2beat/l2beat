import { expect } from 'earl'
import { v } from './validate'

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

  it('optional', () => {
    type Foo = v.infer<typeof Foo>
    const Foo = v.object({ bar: v.string().optional() })

    const input1 = { baz: 123 }
    expect(Foo.safeValidate(input1)).toEqual({
      success: true,
      data: input1 as Foo,
    })

    const input2 = { bar: 123 }
    expect(Foo.safeValidate(input2)).toEqual({
      success: false,
      path: '.bar',
      message: 'Expected string, got number.',
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
      path: `[1].y`,
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

  it('default - object', () => {
    const Foo = v.object({
      a: v.string(),
      b: v.number().default(2),
    })
    expect(Foo.safeParse({ a: 'hi' })).toEqual({
      success: true,
      data: { a: 'hi', b: 2 },
    })
    expect(Foo.safeParse({ a: 'hi', b: undefined })).toEqual({
      success: true,
      data: { a: 'hi', b: 2 },
    })
  })

  it('default - record', () => {
    const Foo = v.record(v.string(), v.number().default(2))
    expect(
      Foo.safeParse({
        a: 1,
        b: null,
        c: undefined,
      }),
    ).toEqual({ success: true, data: { a: 1, b: 2, c: 2 } })

    const Bar = v.record(v.enum(['a', 'b', 'c']), v.number().default(2))
    expect(Bar.safeParse({ a: 1 })).toEqual({
      success: true,
      data: { a: 1, b: 2, c: 2 },
    })
  })
})
