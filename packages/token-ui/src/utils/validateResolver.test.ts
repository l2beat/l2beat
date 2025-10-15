import { type Validator, v } from '@l2beat/validate'
import { expect } from 'earl'
import type { FieldValues } from 'react-hook-form'
import { validateResolver } from './validateResolver'

describe('validateResolver', () => {
  describe('simple object validation', () => {
    it('validates successfully with correct input', () => {
      const schema = v.object({
        name: v.string(),
        age: v.number(),
      })

      const result = validate(schema, { name: 'John', age: 30 })

      expect(result).toEqual({
        values: { name: 'John', age: 30 },
        errors: {},
      })
    })

    it('returns errors for invalid input', () => {
      const schema = v.object({
        name: v.string(),
        age: v.number(),
      })

      const result = validate(schema, { name: 'John', age: 'invalid' })

      expect(result.values).toEqual({})
      expect(result.errors).toEqual({
        age: {
          type: 'validation',
          message: 'Expected number, got string.',
        },
      })
    })

    it('returns multiple errors for multiple invalid fields', () => {
      const schema = v.object({
        name: v.string(),
        age: v.number(),
        email: v.string(),
      })
      const result = validate(schema, {
        name: 123,
        age: 'invalid',
        email: 'test@example.com',
      })

      expect(result.values).toEqual({})
      expect(result.errors).toEqual({
        name: {
          type: 'validation',
          message: 'Expected string, got number.',
        },
        age: {
          type: 'validation',
          message: 'Expected number, got string.',
        },
      })
    })
  })

  describe('nested object validation', () => {
    it('validates nested objects successfully', () => {
      const schema = v.object({
        user: v.object({
          name: v.string(),
          age: v.number(),
        }),
      })
      const result = validate(schema, { user: { name: 'John', age: 30 } })

      expect(result).toEqual({
        values: { user: { name: 'John', age: 30 } },
        errors: {},
      })
    })

    it('returns errors for invalid nested fields', () => {
      const schema = v.object({
        user: v.object({
          name: v.string(),
          age: v.number(),
        }),
      })
      const result = validate(schema, {
        user: { name: 'John', age: 'invalid' },
      })

      expect(result.values).toEqual({})
      expect(result.errors).toEqual({
        'user.age': {
          type: 'validation',
          message: 'Expected number, got string.',
        },
      })
    })

    it('validates deeply nested objects', () => {
      const schema = v.object({
        user: v.object({
          profile: v.object({
            name: v.string(),
            age: v.number(),
          }),
        }),
      })

      const result = validate(schema, {
        user: { profile: { name: 'John', age: 'invalid' } },
      })

      expect(result.values).toEqual({})
      expect(result.errors).toEqual({
        'user.profile.age': {
          type: 'validation',
          message: 'Expected number, got string.',
        },
      })
    })
  })

  describe('array validation', () => {
    it('validates arrays successfully', () => {
      const schema = v.object({
        tags: v.array(v.string()),
      })
      const result = validate(schema, { tags: ['tag1', 'tag2', 'tag3'] })

      expect(result).toEqual({
        values: { tags: ['tag1', 'tag2', 'tag3'] },
        errors: {},
      })
    })

    it('returns errors for invalid array items', () => {
      const schema = v.object({
        tags: v.array(v.string()),
      })
      const result = validate(schema, { tags: ['tag1', 123, 'tag3'] })

      expect(result.values).toEqual({})
      expect(result.errors).toEqual({
        'tags.1': {
          type: 'validation',
          message: 'Expected string, got number.',
        },
      })
    })

    it('returns multiple errors for multiple invalid array items', () => {
      const schema = v.object({
        tags: v.array(v.string()),
      })
      const result = validate(schema, { tags: ['tag1', 123, true] })

      expect(result.values).toEqual({})
      expect(result.errors).toEqual({
        'tags.1': {
          type: 'validation',
          message: 'Expected string, got number.',
        },
        'tags.2': {
          type: 'validation',
          message: 'Expected string, got boolean.',
        },
      })
    })

    it('validates arrays of objects', () => {
      const schema = v.object({
        users: v.array(
          v.object({
            name: v.string(),
            age: v.number(),
          }),
        ),
      })
      const result = validate(schema, {
        users: [
          { name: 'John', age: 30 },
          { name: 'Jane', age: 'invalid' },
        ],
      })

      expect(result.values).toEqual({})
      expect(result.errors).toEqual({
        'users.1.age': {
          type: 'validation',
          message: 'Expected number, got string.',
        },
      })
    })

    it('validates nested arrays', () => {
      const schema = v.object({
        matrix: v.array(v.array(v.number())),
      })
      const result = validate(schema, {
        matrix: [
          [1, 2, 3],
          [4, 'invalid', 6],
        ],
      })

      expect(result.values).toEqual({})
      expect(result.errors).toEqual({
        'matrix.1.1': {
          type: 'validation',
          message: 'Expected number, got string.',
        },
      })
    })
  })

  describe('complex validation scenarios', () => {
    it('validates complex nested structures', () => {
      const schema = v.object({
        title: v.string(),
        author: v.object({
          name: v.string(),
          age: v.number(),
        }),
        tags: v.array(v.string()),
        comments: v.array(
          v.object({
            text: v.string(),
            likes: v.number(),
          }),
        ),
      })
      const result = validate(schema, {
        title: 'My Article',
        author: { name: 'John', age: 30 },
        tags: ['tech', 'programming'],
        comments: [
          { text: 'Great!', likes: 10 },
          { text: 'Nice', likes: 5 },
        ],
      })

      expect(result).toEqual({
        values: {
          title: 'My Article',
          author: { name: 'John', age: 30 },
          tags: ['tech', 'programming'],
          comments: [
            { text: 'Great!', likes: 10 },
            { text: 'Nice', likes: 5 },
          ],
        },
        errors: {},
      })
    })

    it('returns errors for multiple nested invalid fields', () => {
      const schema = v.object({
        title: v.string(),
        author: v.object({
          name: v.string(),
          age: v.number(),
        }),
        tags: v.array(v.string()),
        comments: v.array(
          v.object({
            text: v.string(),
            likes: v.number(),
          }),
        ),
      })
      const result = validate(schema, {
        title: 123,
        author: { name: 'John', age: 'invalid' },
        tags: ['tech', 456],
        comments: [
          { text: 'Great!', likes: 10 },
          { text: true, likes: 'invalid' },
        ],
      })

      expect(result.values).toEqual({})
      expect(result.errors).toEqual({
        title: {
          type: 'validation',
          message: 'Expected string, got number.',
        },
        'author.age': {
          type: 'validation',
          message: 'Expected number, got string.',
        },
        'tags.1': {
          type: 'validation',
          message: 'Expected string, got number.',
        },
        'comments.1.text': {
          type: 'validation',
          message: 'Expected string, got boolean.',
        },
        'comments.1.likes': {
          type: 'validation',
          message: 'Expected number, got string.',
        },
      })
    })
  })

  describe('edge cases', () => {
    it('handles empty objects', () => {
      const schema = v.object({})

      const result = validate(schema, {})

      expect(result).toEqual({
        values: {},
        errors: {},
      })
    })

    it('handles empty arrays', () => {
      const schema = v.object({
        tags: v.array(v.string()),
      })
      const result = validate(schema, { tags: [] })

      expect(result).toEqual({
        values: { tags: [] },
        errors: {},
      })
    })

    it('handles undefined values in optional fields', () => {
      const schema = v.object({
        name: v.string(),
        age: v.number().optional(),
      })
      const result = validate(schema, { name: 'John', age: undefined })

      expect(result).toEqual({
        values: { name: 'John', age: undefined },
        errors: {},
      })
    })
  })

  describe('custom validation with check', () => {
    it('validates with custom check predicate', () => {
      const schema = v.object({
        age: v.number().check((val) => val >= 18, 'Must be at least 18'),
      })
      const result = validate(schema, { age: 16 })

      expect(result.values).toEqual({})
      expect(result.errors).toEqual({
        age: {
          type: 'validation',
          message: 'Must be at least 18',
        },
      })
    })

    it('validates successfully with custom check predicate', () => {
      const schema = v.object({
        age: v.number().check((val) => val >= 18, 'Must be at least 18'),
      })
      const result = validate(schema, { age: 21 })

      expect(result).toEqual({
        values: { age: 21 },
        errors: {},
      })
    })
  })
})

function validate<T extends FieldValues>(
  schema: Validator<T>,
  value: { [K in keyof T]?: any },
):
  | {
      values: T
      errors: Record<string, never>
    }
  | {
      values: Record<string, never>
      errors: Record<string, { type: 'validation'; message: string }>
    } {
  const resolver = validateResolver(schema)
  // @ts-expect-error
  return resolver(value)
}
