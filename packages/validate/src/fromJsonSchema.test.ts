import { expect } from 'earl'
import { fromJsonSchema, type JsonSchema } from './fromJsonSchema.js'
import { toJsonSchema } from './schema.js'
import { v } from './validate.js'

describe('fromJsonSchema', () => {
  describe('primitives', () => {
    it('converts string schema', () => {
      const schema = { type: 'string' }
      const validator = fromJsonSchema(schema)
      expect(validator.parse('hello')).toEqual('hello')
      expect(validator.safeParse(123).success).toEqual(false)
    })

    it('converts number schema', () => {
      const schema = { type: 'number' }
      const validator = fromJsonSchema(schema)
      expect(validator.parse(42)).toEqual(42)
      expect(validator.safeParse('hello').success).toEqual(false)
    })

    it('converts boolean schema', () => {
      const schema = { type: 'boolean' }
      const validator = fromJsonSchema(schema)
      expect(validator.parse(true)).toEqual(true)
      expect(validator.safeParse('true').success).toEqual(false)
    })

    it('converts null schema', () => {
      const schema = { type: 'null' }
      const validator = fromJsonSchema(schema)
      expect(validator.parse(null)).toEqual(null)
      expect(validator.safeParse(undefined).success).toEqual(false)
    })
  })

  describe('literal and enum', () => {
    it('converts const (literal) schema', () => {
      const schema = { const: 'specific-value' }
      const validator = fromJsonSchema(schema)
      expect(validator.parse('specific-value')).toEqual('specific-value')
      expect(validator.safeParse('other-value').success).toEqual(false)
    })

    it('converts enum schema', () => {
      const schema = { enum: ['red', 'green', 'blue'] }
      const validator = fromJsonSchema(schema)
      expect(validator.parse('red')).toEqual('red')
      expect(validator.parse('blue')).toEqual('blue')
      expect(validator.safeParse('yellow').success).toEqual(false)
    })
  })

  describe('arrays', () => {
    it('converts array schema', () => {
      const schema = { type: 'array', items: { type: 'string' } }
      const validator = fromJsonSchema(schema)
      expect(validator.parse(['a', 'b'])).toEqual(['a', 'b'])
      expect(validator.safeParse([1, 2]).success).toEqual(false)
    })

    it('converts tuple schema', () => {
      const schema = {
        type: 'array',
        items: [{ type: 'string' }, { type: 'number' }],
        additionalItems: false,
      }
      const validator = fromJsonSchema(schema)
      expect(validator.parse(['hello', 42])).toEqual(['hello', 42])
      expect(validator.safeParse([42, 'hello']).success).toEqual(false)
    })

    it('converts array with no items constraint', () => {
      const schema = { type: 'array' }
      const validator = fromJsonSchema(schema)
      expect(validator.parse([1, 'a', true])).toEqual([1, 'a', true])
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
      expect(validator.parse({ name: 'Alice', age: 30 })).toEqual({
        name: 'Alice',
        age: 30,
      })
      expect(validator.parse({ name: 'Bob' })).toEqual({ name: 'Bob' })
      expect(validator.safeParse({ age: 25 }).success).toEqual(false)
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
      expect(validator.parse({ name: 'Alice' })).toEqual({ name: 'Alice' })
      expect(
        validator.safeParse({ name: 'Alice', extra: 'data' }).success,
      ).toEqual(false)
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
      expect(validator.parse({ name: 'Alice', extra: 'data' })).toEqual({
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
      expect(validator.parse({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 })
      expect(validator.safeParse({ a: 'string' }).success).toEqual(false)
    })
  })

  describe('unions', () => {
    it('converts anyOf (union) schema', () => {
      const schema = {
        anyOf: [{ type: 'string' }, { type: 'number' }],
      }
      const validator = fromJsonSchema(schema)
      expect(validator.parse('hello')).toEqual('hello')
      expect(validator.parse(42)).toEqual(42)
      expect(validator.safeParse(true).success).toEqual(false)
    })

    it('converts oneOf schema', () => {
      const schema = {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      }
      const validator = fromJsonSchema(schema)
      expect(validator.parse('hello')).toEqual('hello')
      expect(validator.parse(42)).toEqual(42)
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
      expect(validator.parse([{ name: 'Alice' }, { name: 'Bob' }])).toEqual([
        { name: 'Alice' },
        { name: 'Bob' },
      ])
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
      expect(validator.parse(data)).toEqual(data)
    })
  })

  describe('unknown/empty schemas', () => {
    it('converts empty schema as unknown', () => {
      const schema = {}
      const validator = fromJsonSchema(schema)
      expect(validator.parse('anything')).toEqual('anything')
      expect(validator.parse(123)).toEqual(123)
      expect(validator.parse({ any: 'object' })).toEqual({ any: 'object' })
    })
  })

  describe('round-trip conversion', () => {
    it('string validator round-trips', () => {
      const original = v.string()
      const schema = toJsonSchema(original) as JsonSchema
      const restored = fromJsonSchema(schema)
      expect(restored.parse('test')).toEqual('test')
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
      expect(restored.parse(data)).toEqual(data)
    })

    it('array validator round-trips', () => {
      const original = v.array(v.number())
      const schema = toJsonSchema(original) as JsonSchema
      const restored = fromJsonSchema(schema)
      expect(restored.parse([1, 2, 3])).toEqual([1, 2, 3])
    })

    it('union validator round-trips', () => {
      const original = v.union([v.string(), v.number()])
      const schema = toJsonSchema(original) as JsonSchema
      const restored = fromJsonSchema(schema)
      expect(restored.parse('text')).toEqual('text')
      expect(restored.parse(42)).toEqual(42)
    })

    it('literal validator round-trips', () => {
      const original = v.literal('constant')
      const schema = toJsonSchema(original) as JsonSchema
      const restored = fromJsonSchema(schema)
      expect(restored.parse('constant')).toEqual('constant')
    })

    it('enum validator round-trips', () => {
      const original = v.enum(['red', 'green', 'blue'])
      const schema = toJsonSchema(original) as JsonSchema
      const restored = fromJsonSchema(schema)
      expect(restored.parse('red')).toEqual('red')
      expect(restored.safeParse('yellow').success).toEqual(false)
    })

    it('record validator round-trips', () => {
      const original = v.record(v.string(), v.number())
      const schema = toJsonSchema(original) as JsonSchema
      const restored = fromJsonSchema(schema)
      expect(restored.parse({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 })
    })

    it('tuple validator round-trips', () => {
      const original = v.tuple([v.string(), v.number(), v.boolean()])
      const schema = toJsonSchema(original) as JsonSchema
      const restored = fromJsonSchema(schema)
      expect(restored.parse(['text', 42, true])).toEqual(['text', 42, true])
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
      expect(restored.parse(data)).toEqual(data)
    })
  })
})
