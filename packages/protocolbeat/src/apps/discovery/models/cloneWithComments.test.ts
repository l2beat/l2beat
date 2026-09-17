import { parse, stringify } from 'comment-json'
import { describe, expect, it } from 'vitest'
import { clone } from './cloneWithComments'

describe('clone', () => {
  describe('primitives and null/undefined', () => {
    it('clones null', () => {
      const result = clone(null)
      expect(result).toBe(null)
    })

    it('clones undefined', () => {
      const result = clone(undefined)
      expect(result).toBe(undefined)
    })

    it('clones string', () => {
      const result = clone('hello')
      expect(result).toBe('hello')
    })

    it('clones number', () => {
      const result = clone(42)
      expect(result).toBe(42)
    })

    it('clones boolean', () => {
      expect(clone(true)).toBe(true)
      expect(clone(false)).toBe(false)
    })
  })

  describe('simple objects', () => {
    it('clones object without comments', () => {
      const obj = { a: 1, b: 'test', c: true }
      const cloned = clone(obj)

      expect(cloned).toEqual(obj)
      // Verify it's a different reference (deep clone)
      expect(cloned !== obj).toBe(true)
    })

    it('clones object with top-level comments', () => {
      const jsonc = `{
        // This is comment A
        "key": "value"
      }`
      const parsed = parse(jsonc)
      const cloned = clone(parsed)
      const text = stringify(cloned, null, 2)

      expect(text).toContain('comment A')
      expect(text).toContain('"key"')
      expect(text).toContain('"value"')
    })

    it('clones object with inline comments', () => {
      const jsonc = `{
        "foo": "bar", // inline comment
        "baz": 123 /* block comment */
      }`
      const parsed = parse(jsonc)
      const cloned = clone(parsed)
      const text = stringify(cloned, null, 2)

      expect(text).toContain('inline comment')
      expect(text).toContain('block comment')
    })
  })

  describe('simple arrays', () => {
    it('clones array without comments', () => {
      const arr = [1, 2, 3, 'test']
      const cloned = clone(arr)

      // CommentArray has same elements
      expect(Array.from(cloned as unknown[])).toEqual(arr)
      // Verify it's a different reference (deep clone)
      expect(cloned !== arr).toBe(true)
    })

    it('clones array with comments', () => {
      const jsonc = `[
        // Comment before first element
        "item1",
        "item2" // Comment after second element
      ]`
      const parsed = parse(jsonc)
      const cloned = clone(parsed)
      const text = stringify(cloned, null, 2)

      expect(text).toContain('Comment before first element')
      expect(text).toContain('Comment after second element')
      expect(text).toContain('"item1"')
      expect(text).toContain('"item2"')
    })

    it('clones array with block comments', () => {
      const jsonc = `[
        "a",
        /* block comment here */
        "b"
      ]`
      const parsed = parse(jsonc)
      const cloned = clone(parsed)
      const text = stringify(cloned, null, 2)

      expect(text).toContain('block comment here')
    })
  })

  describe('nested objects', () => {
    it('clones nested objects with comments at multiple levels', () => {
      const jsonc = `{
        // Top level comment
        "outer": {
          // Nested comment
          "inner": "value"
        }
      }`
      const parsed = parse(jsonc)
      const cloned = clone(parsed)
      const text = stringify(cloned, null, 2)

      expect(text).toContain('Top level comment')
      expect(text).toContain('Nested comment')
      expect(text).toContain('"inner"')
      expect(text).toContain('"value"')
    })

    it('clones deeply nested objects with comments', () => {
      const jsonc = `{
        // Level 1 comment
        "level1": {
          // Level 2 comment
          "level2": {
            // Level 3 comment
            "level3": "deep value"
          }
        }
      }`
      const parsed = parse(jsonc)
      const cloned = clone(parsed)
      const text = stringify(cloned, null, 2)

      expect(text).toContain('Level 1 comment')
      expect(text).toContain('Level 2 comment')
      expect(text).toContain('Level 3 comment')
      expect(text).toContain('"deep value"')
    })
  })

  describe('nested arrays', () => {
    it('clones nested arrays with comments', () => {
      const jsonc = `{
        // Array property comment
        "items": [
          // Comment in array
          "item1",
          "item2"
        ]
      }`
      const parsed = parse(jsonc)
      const cloned = clone(parsed)
      const text = stringify(cloned, null, 2)

      expect(text).toContain('Array property comment')
      expect(text).toContain('Comment in array')
      expect(text).toContain('"item1"')
    })

    it('clones array of objects with comments', () => {
      const jsonc = `[
        // First object
        {
          "name": "first"
        },
        // Second object
        {
          "name": "second"
        }
      ]`
      const parsed = parse(jsonc)
      const cloned = clone(parsed)
      const text = stringify(cloned, null, 2)

      expect(text).toContain('First object')
      expect(text).toContain('Second object')
      expect(text).toContain('"first"')
      expect(text).toContain('"second"')
    })
  })

  describe('complex nested structures', () => {
    it('clones complex configuration with nested comments preserved', () => {
      const jsonc = `{
        // Main configuration
        "name": "test-project",
        // Discovery overrides
        "overrides": {
          // Contract A
          "0x123": {
            // Methods to ignore
            "ignoreMethods": [
              "method1",
              // This method is noisy
              "method2"
            ]
          },
          // Contract B
          "0x456": {
            "ignoreRelatives": [
              "relative1"
            ] // End of relatives
          }
        }
      }`
      const parsed = parse(jsonc)
      const cloned = clone(parsed)
      const text = stringify(cloned, null, 2)

      // Verify all comments are preserved
      expect(text).toContain('Main configuration')
      expect(text).toContain('Discovery overrides')
      expect(text).toContain('Contract A')
      expect(text).toContain('Contract B')
      expect(text).toContain('Methods to ignore')
      expect(text).toContain('This method is noisy')
      expect(text).toContain('End of relatives')

      // Verify data is intact
      expect(text).toContain('"test-project"')
      expect(text).toContain('"0x123"')
      expect(text).toContain('"0x456"')
      expect(text).toContain('"method1"')
      expect(text).toContain('"method2"')
    })

    it('clones mixed nested structures with comments everywhere', () => {
      const jsonc = `{
        // Top comment
        "config": {
          // Array of configs
          "items": [
            {
              // Item 1 name
              "name": "item1",
              // Item 1 tags
              "tags": ["tag1", "tag2"]
            }
          ],
          // Settings object
          "settings": {
            "enabled": true // Always enabled
          }
        }
      }`
      const parsed = parse(jsonc)
      const cloned = clone(parsed)
      const text = stringify(cloned, null, 2)

      expect(text).toContain('Top comment')
      expect(text).toContain('Array of configs')
      expect(text).toContain('Item 1 name')
      expect(text).toContain('Item 1 tags')
      expect(text).toContain('Settings object')
      expect(text).toContain('Always enabled')
    })
  })

  describe('round-trip stability', () => {
    it('preserves exact formatting through parse -> clone -> stringify', () => {
      const jsonc = `{
        // Important comment
        "key": "value"
      }`
      const parsed = parse(jsonc)
      const cloned = clone(parsed)
      const text1 = stringify(parsed, null, 2)
      const text2 = stringify(cloned, null, 2)

      // Both should produce the same output
      expect(text1).toEqual(text2)
    })

    it('multiple clones preserve comments', () => {
      const jsonc = `{
        // Original comment
        "data": "value"
      }`
      const parsed = parse(jsonc)
      const clone1 = clone(parsed)
      const clone2 = clone(clone1)
      const clone3 = clone(clone2)

      const text = stringify(clone3, null, 2)
      expect(text).toContain('Original comment')
      expect(text).toContain('"data"')
    })
  })

  describe('edge cases', () => {
    it('clones empty object', () => {
      const obj = {}
      const cloned = clone(obj)
      expect(cloned).toEqual({})
      // Verify it's a different reference
      expect(cloned !== obj).toBe(true)
    })

    it('clones empty array', () => {
      const arr: unknown[] = []
      const cloned = clone(arr)
      // CommentArray is still an array
      expect(Array.isArray(cloned)).toBe(true)
      expect((cloned as unknown[]).length).toBe(0)
      // Verify it's a different reference
      expect(cloned !== arr).toBe(true)
    })

    // toStrictEqual, not toEqual: these assertions are about an optional key being present with value undefined, which toEqual ignores.
    it('clones object with undefined values', () => {
      const obj = { a: undefined, b: 'value' }
      const cloned = clone(obj)
      expect(cloned).toStrictEqual({ a: undefined, b: 'value' })
    })

    it('clones object with null values', () => {
      const obj = { a: null, b: 'value' }
      const cloned = clone(obj)
      expect(cloned).toEqual({ a: null, b: 'value' })
    })

    it('handles circular references gracefully (or documents limitation)', () => {
      // Note: This test documents current behavior
      // comment-json itself doesn't handle circular references well
      const obj: Record<string, unknown> = { a: 1 }
      obj.self = obj

      // This will likely cause a stack overflow or infinite loop
      // Documenting that circular references are not supported
      expect(() => clone(obj)).toThrow()
    })
  })

  describe('type preservation', () => {
    it('preserves array type', () => {
      const arr = [1, 2, 3]
      const cloned = clone(arr)
      expect(Array.isArray(cloned)).toBe(true)
    })

    it('preserves object type', () => {
      const obj = { a: 1 }
      const cloned = clone(obj)
      expect(typeof cloned).toBe('object')
      expect(Array.isArray(cloned)).toBe(false)
    })

    it('preserves CommentArray special properties after cloning', () => {
      const jsonc = `[
        // Comment
        "value"
      ]`
      const parsed = parse(jsonc)
      const cloned = clone(parsed)

      // Verify it's still a CommentArray that can be stringified with comments
      const text = stringify(cloned, null, 2)
      expect(text).toContain('Comment')
    })
  })
})
