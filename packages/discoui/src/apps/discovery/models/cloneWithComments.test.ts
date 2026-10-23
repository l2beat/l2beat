import { parse, stringify } from 'comment-json'
import { expect } from 'earl'
import { clone } from './cloneWithComments'

describe('clone', () => {
  describe('primitives and null/undefined', () => {
    it('clones null', () => {
      const result = clone(null)
      expect(result).toEqual(null)
    })

    it('clones undefined', () => {
      const result = clone(undefined)
      expect(result).toEqual(undefined)
    })

    it('clones string', () => {
      const result = clone('hello')
      expect(result).toEqual('hello')
    })

    it('clones number', () => {
      const result = clone(42)
      expect(result).toEqual(42)
    })

    it('clones boolean', () => {
      expect(clone(true)).toEqual(true)
      expect(clone(false)).toEqual(false)
    })
  })

  describe('simple objects', () => {
    it('clones object without comments', () => {
      const obj = { a: 1, b: 'test', c: true }
      const cloned = clone(obj)

      expect(cloned).toEqual(obj)
      // Verify it's a different reference (deep clone)
      expect(cloned !== obj).toEqual(true)
    })

    it('clones object with top-level comments', () => {
      const jsonc = `{
        // This is comment A
        "key": "value"
      }`
      const parsed = parse(jsonc)
      const cloned = clone(parsed)
      const text = stringify(cloned, null, 2)

      expect(text).toInclude('comment A')
      expect(text).toInclude('"key"')
      expect(text).toInclude('"value"')
    })

    it('clones object with inline comments', () => {
      const jsonc = `{
        "foo": "bar", // inline comment
        "baz": 123 /* block comment */
      }`
      const parsed = parse(jsonc)
      const cloned = clone(parsed)
      const text = stringify(cloned, null, 2)

      expect(text).toInclude('inline comment')
      expect(text).toInclude('block comment')
    })
  })

  describe('simple arrays', () => {
    it('clones array without comments', () => {
      const arr = [1, 2, 3, 'test']
      const cloned = clone(arr)

      // CommentArray has same elements
      expect(Array.from(cloned as unknown[])).toEqual(arr)
      // Verify it's a different reference (deep clone)
      expect(cloned !== arr).toEqual(true)
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

      expect(text).toInclude('Comment before first element')
      expect(text).toInclude('Comment after second element')
      expect(text).toInclude('"item1"')
      expect(text).toInclude('"item2"')
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

      expect(text).toInclude('block comment here')
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

      expect(text).toInclude('Top level comment')
      expect(text).toInclude('Nested comment')
      expect(text).toInclude('"inner"')
      expect(text).toInclude('"value"')
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

      expect(text).toInclude('Level 1 comment')
      expect(text).toInclude('Level 2 comment')
      expect(text).toInclude('Level 3 comment')
      expect(text).toInclude('"deep value"')
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

      expect(text).toInclude('Array property comment')
      expect(text).toInclude('Comment in array')
      expect(text).toInclude('"item1"')
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

      expect(text).toInclude('First object')
      expect(text).toInclude('Second object')
      expect(text).toInclude('"first"')
      expect(text).toInclude('"second"')
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
      expect(text).toInclude('Main configuration')
      expect(text).toInclude('Discovery overrides')
      expect(text).toInclude('Contract A')
      expect(text).toInclude('Contract B')
      expect(text).toInclude('Methods to ignore')
      expect(text).toInclude('This method is noisy')
      expect(text).toInclude('End of relatives')

      // Verify data is intact
      expect(text).toInclude('"test-project"')
      expect(text).toInclude('"0x123"')
      expect(text).toInclude('"0x456"')
      expect(text).toInclude('"method1"')
      expect(text).toInclude('"method2"')
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

      expect(text).toInclude('Top comment')
      expect(text).toInclude('Array of configs')
      expect(text).toInclude('Item 1 name')
      expect(text).toInclude('Item 1 tags')
      expect(text).toInclude('Settings object')
      expect(text).toInclude('Always enabled')
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
      expect(text).toInclude('Original comment')
      expect(text).toInclude('"data"')
    })
  })

  describe('edge cases', () => {
    it('clones empty object', () => {
      const obj = {}
      const cloned = clone(obj)
      expect(cloned).toEqual({})
      // Verify it's a different reference
      expect(cloned !== obj).toEqual(true)
    })

    it('clones empty array', () => {
      const arr: unknown[] = []
      const cloned = clone(arr)
      // CommentArray is still an array
      expect(Array.isArray(cloned)).toEqual(true)
      expect((cloned as unknown[]).length).toEqual(0)
      // Verify it's a different reference
      expect(cloned !== arr).toEqual(true)
    })

    it('clones object with undefined values', () => {
      const obj = { a: undefined, b: 'value' }
      const cloned = clone(obj)
      expect(cloned).toEqual({ a: undefined, b: 'value' })
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
      expect(Array.isArray(cloned)).toEqual(true)
    })

    it('preserves object type', () => {
      const obj = { a: 1 }
      const cloned = clone(obj)
      expect(typeof cloned).toEqual('object')
      expect(Array.isArray(cloned)).toEqual(false)
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
      expect(text).toInclude('Comment')
    })
  })
})
