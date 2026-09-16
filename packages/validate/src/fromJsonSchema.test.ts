import { describe, expect, it } from 'vitest'
import { fromJsonSchema, type JsonSchema } from './fromJsonSchema.js'
import { toJsonSchema } from './schema.js'
import { v } from './validate.js'

describe('fromJsonSchema', () => {
  describe('primitives', () => {
    it('converts string schema', () => {
      const schema = { type: 'string' }
      const validator = fromJsonSchema(schema)
      expect(validator.parse('hello')).toStrictEqual('hello')
      expect(validator.safeParse(123).success).toStrictEqual(false)
    })

    it('converts number schema', () => {
      const schema = { type: 'number' }
      const validator = fromJsonSchema(schema)
      expect(validator.parse(42)).toStrictEqual(42)
      expect(validator.safeParse('hello').success).toStrictEqual(false)
    })

    it('converts boolean schema', () => {
      const schema = { type: 'boolean' }
      const validator = fromJsonSchema(schema)
      expect(validator.parse(true)).toStrictEqual(true)
      expect(validator.safeParse('true').success).toStrictEqual(false)
    })

    it('converts null schema', () => {
      const schema = { type: 'null' }
      const validator = fromJsonSchema(schema)
      expect(validator.parse(null)).toStrictEqual(null)
      expect(validator.safeParse(undefined).success).toStrictEqual(false)
    })
  })

  describe('literal and enum', () => {
    it('converts const (literal) schema', () => {
      const schema = { const: 'specific-value' }
      const validator = fromJsonSchema(schema)
      expect(validator.parse('specific-value')).toStrictEqual('specific-value')
      expect(validator.safeParse('other-value').success).toStrictEqual(false)
    })

    it('converts enum schema', () => {
      const schema = { enum: ['red', 'green', 'blue'] }
      const validator = fromJsonSchema(schema)
      expect(validator.parse('red')).toStrictEqual('red')
      expect(validator.parse('blue')).toStrictEqual('blue')
      expect(validator.safeParse('yellow').success).toStrictEqual(false)
    })
  })

  describe('arrays', () => {
    it('converts array schema', () => {
      const schema = { type: 'array', items: { type: 'string' } }
      const validator = fromJsonSchema(schema)
      expect(validator.parse(['a', 'b'])).toStrictEqual(['a', 'b'])
      expect(validator.safeParse([1, 2]).success).toStrictEqual(false)
    })

    it('converts tuple schema', () => {
      const schema = {
        type: 'array',
        items: [{ type: 'string' }, { type: 'number' }],
        additionalItems: false,
      }
      const validator = fromJsonSchema(schema)
      expect(validator.parse(['hello', 42])).toStrictEqual(['hello', 42])
      expect(validator.safeParse([42, 'hello']).success).toStrictEqual(false)
    })

    it('converts array with no items constraint', () => {
      const schema = { type: 'array' }
      const validator = fromJsonSchema(schema)
      expect(validator.parse([1, 'a', true])).toStrictEqual([1, 'a', true])
    })
  })

  describe('objects', () => {
    it('converts basic object schema', () => {
      const schema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
          age: { type: 'number' },
        },
        required: ['name'],
      }
      const validator = fromJsonSchema(schema)
      expect(validator.parse({ name: 'Alice', age: 30 })).toStrictEqual({
        name: 'Alice',
        age: 30,
      })
      expect(validator.parse({ name: 'Bob' })).toStrictEqual({ name: 'Bob' })
      expect(validator.safeParse({ age: 25 }).success).toStrictEqual(false)
    })

    it('converts strict object schema', () => {
      const schema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
        },
        required: ['name'],
        additionalProperties: false,
      }
      const validator = fromJsonSchema(schema)
      expect(validator.parse({ name: 'Alice' })).toStrictEqual({
        name: 'Alice',
      })
      expect(
        validator.safeParse({ name: 'Alice', extra: 'data' }).success,
      ).toStrictEqual(false)
    })

    it('converts passthrough object schema', () => {
      const schema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
        },
        required: ['name'],
        additionalProperties: true,
      }
      const validator = fromJsonSchema(schema)
      expect(validator.parse({ name: 'Alice', extra: 'data' })).toStrictEqual({
        name: 'Alice',
        extra: 'data',
      })
    })

    it('converts record schema', () => {
      const schema = {
        type: 'object',
        additionalProperties: { type: 'number' },
      }
      const validator = fromJsonSchema(schema)
      expect(validator.parse({ a: 1, b: 2 })).toStrictEqual({ a: 1, b: 2 })
      expect(validator.safeParse({ a: 'string' }).success).toStrictEqual(false)
    })
  })

  describe('unions', () => {
    it('converts anyOf (union) schema', () => {
      const schema = {
        anyOf: [{ type: 'string' }, { type: 'number' }],
      }
      const validator = fromJsonSchema(schema)
      expect(validator.parse('hello')).toStrictEqual('hello')
      expect(validator.parse(42)).toStrictEqual(42)
      expect(validator.safeParse(true).success).toStrictEqual(false)
    })

    it('converts oneOf schema', () => {
      const schema = {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      }
      const validator = fromJsonSchema(schema)
      expect(validator.parse('hello')).toStrictEqual('hello')
      expect(validator.parse(42)).toStrictEqual(42)
    })
  })

  describe('references and definitions', () => {
    it('converts schema with definitions', () => {
      const schema = {
        definitions: {
          User: {
            type: 'object',
            properties: {
              name: { type: 'string' },
            },
            required: ['name'],
          },
        },
        type: 'array',
        items: { $ref: '#/definitions/User' },
      }
      const validator = fromJsonSchema(schema)
      expect(
        validator.parse([{ name: 'Alice' }, { name: 'Bob' }]),
      ).toStrictEqual([{ name: 'Alice' }, { name: 'Bob' }])
    })

    it('handles circular references', () => {
      const schema = {
        definitions: {
          Node: {
            type: 'object',
            properties: {
              value: { type: 'number' },
              next: { $ref: '#/definitions/Node' },
            },
            required: ['value'],
          },
        },
        $ref: '#/definitions/Node',
      }
      const validator = fromJsonSchema(schema)
      const data = { value: 1, next: { value: 2 } }
      expect(validator.parse(data)).toStrictEqual(data)
    })
  })

  describe('unknown/empty schemas', () => {
    it('converts empty schema as unknown', () => {
      const schema = {}
      const validator = fromJsonSchema(schema)
      expect(validator.parse('anything')).toStrictEqual('anything')
      expect(validator.parse(123)).toStrictEqual(123)
      expect(validator.parse({ any: 'object' })).toStrictEqual({
        any: 'object',
      })
    })
  })

  describe('round-trip conversion', () => {
    it('string validator round-trips', () => {
      const original = v.string()
      const schema = toJsonSchema(original) as JsonSchema
      const restored = fromJsonSchema(schema)
      expect(restored.parse('test')).toStrictEqual('test')
    })

    it('object validator round-trips', () => {
      const original = v.object({
        name: v.string(),
        age: v.number(),
        active: v.boolean().optional(),
      })
      const schema = toJsonSchema(original) as JsonSchema
      const restored = fromJsonSchema(schema)
      const data = { name: 'Alice', age: 30 }
      expect(restored.parse(data)).toStrictEqual(data)
    })

    it('array validator round-trips', () => {
      const original = v.array(v.number())
      const schema = toJsonSchema(original) as JsonSchema
      const restored = fromJsonSchema(schema)
      expect(restored.parse([1, 2, 3])).toStrictEqual([1, 2, 3])
    })

    it('union validator round-trips', () => {
      const original = v.union([v.string(), v.number()])
      const schema = toJsonSchema(original) as JsonSchema
      const restored = fromJsonSchema(schema)
      expect(restored.parse('text')).toStrictEqual('text')
      expect(restored.parse(42)).toStrictEqual(42)
    })

    it('literal validator round-trips', () => {
      const original = v.literal('constant')
      const schema = toJsonSchema(original) as JsonSchema
      const restored = fromJsonSchema(schema)
      expect(restored.parse('constant')).toStrictEqual('constant')
    })

    it('enum validator round-trips', () => {
      const original = v.enum(['red', 'green', 'blue'])
      const schema = toJsonSchema(original) as JsonSchema
      const restored = fromJsonSchema(schema)
      expect(restored.parse('red')).toStrictEqual('red')
      expect(restored.safeParse('yellow').success).toStrictEqual(false)
    })

    it('record validator round-trips', () => {
      const original = v.record(v.string(), v.number())
      const schema = toJsonSchema(original) as JsonSchema
      const restored = fromJsonSchema(schema)
      expect(restored.parse({ a: 1, b: 2 })).toStrictEqual({ a: 1, b: 2 })
    })

    it('tuple validator round-trips', () => {
      const original = v.tuple([v.string(), v.number(), v.boolean()])
      const schema = toJsonSchema(original) as JsonSchema
      const restored = fromJsonSchema(schema)
      expect(restored.parse(['text', 42, true])).toStrictEqual([
        'text',
        42,
        true,
      ])
    })

    it('complex nested validator round-trips', () => {
      const original = v.object({
        users: v.array(
          v.object({
            name: v.string(),
            tags: v.array(v.string()).optional(),
            status: v.enum(['active', 'inactive']),
          }),
        ),
        metadata: v.record(v.string(), v.unknown()),
      })
      const schema = toJsonSchema(original) as JsonSchema
      const restored = fromJsonSchema(schema)
      const data = {
        users: [
          { name: 'Alice', status: 'active', tags: ['admin'] },
          { name: 'Bob', status: 'inactive' },
        ],
        metadata: { created: '2023-01-01', version: 2 },
      }
      expect(restored.parse(data)).toStrictEqual(data)
    })
  })
})
