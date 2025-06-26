import { expect } from 'earl'
import { SCHEMA_VERSION, toJsonSchema } from './schema.js'
import { type Validator, v } from './validate.js'

describe('toJsonSchema', () => {
  it('unknown', () => {
    const input = v.unknown()
    expect(toJsonSchema(input)).toEqual({
      $schema: SCHEMA_VERSION,
    })
  })

  it('boolean', () => {
    const input = v.boolean()
    expect(toJsonSchema(input)).toEqual({
      $schema: SCHEMA_VERSION,
      type: 'boolean',
    })
  })

  it('number', () => {
    const input = v.number()
    expect(toJsonSchema(input)).toEqual({
      $schema: SCHEMA_VERSION,
      type: 'number',
    })
  })

  it('string', () => {
    const input = v.string()
    expect(toJsonSchema(input)).toEqual({
      $schema: SCHEMA_VERSION,
      type: 'string',
    })
  })

  it('null', () => {
    const input = v.null()
    expect(toJsonSchema(input)).toEqual({
      $schema: SCHEMA_VERSION,
      type: 'null',
    })
  })

  it('bigint', () => {
    const input = v.bigint()
    expect(toJsonSchema(input)).toEqual({
      $schema: SCHEMA_VERSION,
    })
  })

  it('undefined', () => {
    const input = v.undefined()
    expect(toJsonSchema(input)).toEqual({
      $schema: SCHEMA_VERSION,
    })
  })

  it('literal', () => {
    const input = v.literal(123)
    expect(toJsonSchema(input)).toEqual({
      $schema: SCHEMA_VERSION,
      const: 123,
    })
  })

  it('literal (bigint)', () => {
    const input = v.literal(123n)
    expect(toJsonSchema(input)).toEqual({
      $schema: SCHEMA_VERSION,
    })
  })

  it('enum', () => {
    const input = v.enum(['abc', 'def'])
    expect(toJsonSchema(input)).toEqual({
      $schema: SCHEMA_VERSION,
      enum: ['abc', 'def'],
    })
  })

  it('check', () => {
    const input = v.string().check((x) => x.length > 0)
    expect(toJsonSchema(input)).toEqual({
      $schema: SCHEMA_VERSION,
      type: 'string',
    })
  })

  it('transform', () => {
    const input = v.string().transform((x) => x.toUpperCase())
    expect(toJsonSchema(input)).toEqual({
      $schema: SCHEMA_VERSION,
      type: 'string',
    })
  })

  it('catch (standalone)', () => {
    const input = v.string().catch('hello')
    expect(toJsonSchema(input)).toEqual({
      $schema: SCHEMA_VERSION,
      type: 'string',
    })
  })

  it('default (standalone)', () => {
    const input = v.string().default('hello')
    expect(toJsonSchema(input)).toEqual({
      $schema: SCHEMA_VERSION,
      type: 'string',
    })
  })

  it('optional (standalone)', () => {
    const input = v.string().optional()
    expect(toJsonSchema(input)).toEqual({
      $schema: SCHEMA_VERSION,
      type: 'string',
    })
  })

  it('array', () => {
    const input = v.array(v.string())
    expect(toJsonSchema(input)).toEqual({
      $schema: SCHEMA_VERSION,
      type: 'array',
      items: { type: 'string' },
    })
  })

  it('tuple', () => {
    const input = v.tuple([v.string(), v.number().optional()])
    expect(toJsonSchema(input)).toEqual({
      $schema: SCHEMA_VERSION,
      type: 'array',
      items: [{ type: 'string' }, { type: 'number' }],
      additionalItems: false,
    })
  })

  it('union', () => {
    const input = v.union([v.string(), v.number()])
    expect(toJsonSchema(input)).toEqual({
      $schema: SCHEMA_VERSION,
      anyOf: [{ type: 'string' }, { type: 'number' }],
    })
  })

  it('object', () => {
    const input = v.object({
      a: v.string(),
      b: v.number().optional(),
      c: v.boolean().default(false),
      d: v.null().catch(null),
    })
    expect(toJsonSchema(input)).toEqual({
      $schema: SCHEMA_VERSION,
      type: 'object',
      properties: {
        a: { type: 'string' },
        b: { type: 'number' },
        c: { type: 'boolean' },
        d: { type: 'null' },
      },
      required: ['a'],
    })
  })

  it('record', () => {
    const input = v.record(v.string(), v.number())
    expect(toJsonSchema(input)).toEqual({
      $schema: SCHEMA_VERSION,
      type: 'object',
      propertyNames: {
        type: 'string',
      },
      additionalProperties: {
        type: 'number',
      },
    })
  })

  it('record (number key)', () => {
    const input = v.record(v.number(), v.number())
    expect(toJsonSchema(input)).toEqual({
      $schema: SCHEMA_VERSION,
      type: 'object',
      propertyNames: {
        type: 'string',
        pattern: '\\d+(\\.\\d*)?',
      },
      additionalProperties: {
        type: 'number',
      },
    })
  })

  it('record (enum key)', () => {
    const input = v.record(v.enum(['a', 'b']), v.number())
    expect(toJsonSchema(input)).toEqual({
      $schema: SCHEMA_VERSION,
      type: 'object',
      propertyNames: {
        enum: ['a', 'b'],
      },
      additionalProperties: {
        type: 'number',
      },
      required: ['a', 'b'],
    })
  })

  it('lazy 1', () => {
    interface List {
      item: number
      next?: List
    }
    const List: Validator<List> = v.lazy(() =>
      v.object({ item: v.number(), next: List.optional() }),
    )
    expect(toJsonSchema(List)).toEqual({
      $schema: SCHEMA_VERSION,
      definitions: {
        __lazy_1: {
          type: 'object',
          properties: {
            item: { type: 'number' },
            next: { $ref: '#/definitions/__lazy_1' },
          },
          required: ['item'],
        },
      },
      $ref: '#/definitions/__lazy_1',
    })
  })

  it('lazy 2', () => {
    interface A {
      b?: B
    }
    interface B {
      a?: A
    }
    const A: Validator<A> = v.lazy(() => v.object({ b: B.optional() }))
    const B: Validator<B> = v.lazy(() => v.object({ a: A.optional() }))
    expect(toJsonSchema(A)).toEqual({
      $schema: SCHEMA_VERSION,
      definitions: {
        __lazy_1: {
          type: 'object',
          properties: {
            b: { $ref: '#/definitions/__lazy_2' },
          },
        },
        __lazy_2: {
          type: 'object',
          properties: {
            a: { $ref: '#/definitions/__lazy_1' },
          },
        },
      },
      $ref: '#/definitions/__lazy_1',
    })
  })

  it('toplevel', () => {
    const Vector = v.object({ x: v.number(), y: v.number() })
    const input = v.object({ position: Vector, velocity: Vector })
    expect(toJsonSchema(input, { Vector })).toEqual({
      $schema: SCHEMA_VERSION,
      definitions: {
        Vector: {
          type: 'object',
          properties: {
            x: { type: 'number' },
            y: { type: 'number' },
          },
          required: ['x', 'y'],
        },
      },
      type: 'object',
      properties: {
        position: { $ref: '#/definitions/Vector' },
        velocity: { $ref: '#/definitions/Vector' },
      },
      required: ['position', 'velocity'],
    })
  })

  it('lazy toplevel', () => {
    interface A {
      b?: B
    }
    interface B {
      a?: A
    }
    const A: Validator<A> = v.lazy(() => v.object({ b: B.optional() }))
    const B: Validator<B> = v.lazy(() => v.object({ a: A.optional() }))
    expect(toJsonSchema(A, { A, B })).toEqual({
      $schema: SCHEMA_VERSION,
      definitions: {
        A: {
          type: 'object',
          properties: {
            b: { $ref: '#/definitions/B' },
          },
        },
        B: {
          type: 'object',
          properties: {
            a: { $ref: '#/definitions/A' },
          },
        },
      },
      $ref: '#/definitions/A',
    })
  })
})
