import { describe, expect, it } from 'vitest'
import { ConfigModel } from './ConfigModel'
import { toArray } from './toArray'

describe('ConfigModel', () => {
  describe('comment preservation', () => {
    const jsonc = `{
      // Top comment
      "name": "test-project",
      "overrides": {
        "0xContract1": {
          // Methods comment
          "ignoreMethods": ["method1"]
        }
      }
    }`

    it('preserves top-level comments on round-trip', () => {
      const model = ConfigModel.fromRawJsonc(jsonc)
      const text = model.toString()

      expect(text).toContain('Top comment')
      expect(text).toContain('"test-project"')
    })
  })

  describe('data immutability', () => {
    const jsonc = `{
      "name": "test-project",
      "overrides": {
        "0xContractA": {
          "ignoreMethods": ["method1", "method2"]
        }
      }
    }`

    it('peek returns cloned snapshot', () => {
      const model = ConfigModel.fromRawJsonc(jsonc)
      const peeked = model.peek()

      if (peeked.overrides?.['0xContractA']?.ignoreMethods) {
        peeked.overrides['0xContractA'].ignoreMethods.push('hacker')
      }

      expect(toArray(model.getIgnoredMethods('0xContractA'))).toEqual([
        'method1',
        'method2',
      ])
    })
  })

  describe('override management', () => {
    it('hasOverrideDefinition works correctly', () => {
      const jsonc = `{ "name": "test", "overrides": { "0xContract": { "ignoreMethods": ["m1"] } } }`
      const model = ConfigModel.fromRawJsonc(jsonc)

      expect(model.hasOverrideDefinition('0xContract', 'ignoreMethods')).toBe(
        true,
      )
      expect(model.hasOverrideDefinition('0xContract', 'ignoreRelatives')).toBe(
        false,
      )
      expect(
        model.hasOverrideDefinition('0xNonExistent', 'ignoreMethods'),
      ).toBe(false)
    })

    it('removes override when all fields are removed', () => {
      const jsonc = `{ "name": "test", "overrides": { "0xContract": { "fields": { "field1": { "severity": "HIGH" } } } } }`
      const model = ConfigModel.fromRawJsonc(jsonc)
      const updated = model.setFieldSeverity('0xContract', 'field1', undefined)

      expect(updated.toString()).not.toContain('0xContract')
      expect(updated.peek().overrides).toBe(undefined)
    })

    it('keeps override when some fields remain', () => {
      const jsonc = `{ "name": "test", "overrides": { "0xContract": { "fields": { "field1": { "severity": "HIGH" }, "field2": { "severity": "LOW" } } } } }`
      const model = ConfigModel.fromRawJsonc(jsonc)
      const updated = model.setFieldSeverity('0xContract', 'field1', undefined)

      expect(updated.toString()).toContain('0xContract')
      expect(updated.toString()).toContain('field2')
      expect(updated.toString()).not.toContain('field1')
    })

    it('keeps override when it has other properties even if all fields are removed', () => {
      const jsonc = `{ "name": "test", "overrides": { "0xContract": { "ignoreMethods": ["m1"], "fields": { "field1": { "severity": "HIGH" } } } } }`
      const model = ConfigModel.fromRawJsonc(jsonc)
      const updated = model.setFieldSeverity('0xContract', 'field1', undefined)

      expect(updated.toString()).toContain('0xContract')
      expect(updated.toString()).toContain('ignoreMethods')
      expect(updated.toString()).not.toContain('field1')
    })
  })

  describe('diff and comparison', () => {
    it('diff returns false for identical models', () => {
      const jsonc = `{ "name": "test" }`
      const model1 = ConfigModel.fromRawJsonc(jsonc)
      const model2 = ConfigModel.fromRawJsonc(jsonc)

      expect(model1.diff(model2)).toBe(false)
    })
  })

  describe('hasComments', () => {
    it('returns true when config has top-level comments', () => {
      const jsonc = `{
        // Top-level comment
        "name": "test-project"
      }`
      const model = ConfigModel.fromRawJsonc(jsonc)

      expect(model.hasComments()).toBe(true)
    })

    it('returns true when config has nested comments in overrides', () => {
      const jsonc = `{
        "name": "test-project",
        "overrides": {
          "0xContract": {
            // Comment in override
            "ignoreMethods": ["method1"]
          }
        }
      }`
      const model = ConfigModel.fromRawJsonc(jsonc)

      expect(model.hasComments()).toBe(true)
    })

    it('returns false when config has no comments', () => {
      const jsonc = `{ "name": "test-project", "overrides": { "0xContract": { "ignoreMethods": ["method1"] } } }`
      const model = ConfigModel.fromRawJsonc(jsonc)

      expect(model.hasComments()).toBe(false)
    })
  })
})
