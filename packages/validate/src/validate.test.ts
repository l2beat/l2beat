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
      message: 'None of the variants matched, got number.',
    })
  })
})
