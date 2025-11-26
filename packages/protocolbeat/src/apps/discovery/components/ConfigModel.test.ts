import { expect } from 'earl'
import { ConfigModel, ContractConfigModel } from './ConfigModel'

// Helper to convert CommentArray to regular array for testing
function toArray<T>(value: T[] | undefined): T[] {
  return value ? Array.from(value) : []
}

describe('ContractConfigModel', () => {
  describe('comment preservation', () => {
    const jsonc = `{
      // Comment A
      /** Comment B */
      "ignoreInWatchMode": ["methodWM"], // Comment C
      "ignoreRelatives": ["relative1", "relative2"], // Comment D
      "ignoreMethods": ["methodA",
      // Comment E
      "methodB"] /* Comment F */
    }`

    it('preserves comments on round-trip no-op', () => {
      const model = ContractConfigModel.fromRawJsonc(jsonc)
      const text = model.toString()

      expect(text).toInclude('Comment A')
      expect(text).toInclude('Comment B')
      expect(text).toInclude('Comment C')
      expect(text).toInclude('Comment D')
      expect(text).toInclude('Comment E')
      expect(text).toInclude('Comment F')
    })

    it('preserves comments after addToIgnoredMethods', () => {
      const model = ContractConfigModel.fromRawJsonc(jsonc)
      const updated = model.addToIgnoredMethods('methodC')

      const text = updated.toString()
      expect(text).toInclude('Comment A')
      expect(text).toInclude('Comment C')
      expect(text).toInclude('"methodC"')
    })

    it('preserves comments after removeFromIgnoredMethods', () => {
      const model = ContractConfigModel.fromRawJsonc(jsonc)
      const updated = model.removeFromIgnoredMethods('methodB')

      const text = updated.toString()
      expect(text).not.toInclude('"methodB"')
      expect(text).toInclude('Comment A')
    })

    it('preserves comments after setIgnoreMethods', () => {
      const model = ContractConfigModel.fromRawJsonc(jsonc)
      const updated = model.setIgnoreMethods(['newMethod1'])

      const text = updated.toString()
      expect(text).toInclude('Comment A')
      expect(text).toInclude('"newMethod1"')
    })
  })

  describe('data immutability', () => {
    const jsonc = `{
      "ignoreMethods": ["method1", "method2"],
      "ignoreRelatives": ["relative1"]
    }`

    it('does not mutate original model when adding to array', () => {
      const original = ContractConfigModel.fromRawJsonc(jsonc)
      const updated = original.addToIgnoredMethods('method3')

      expect(toArray(original.ignoreMethods)).toEqual(['method1', 'method2'])
      expect(toArray(updated.ignoreMethods)).toEqual([
        'method1',
        'method2',
        'method3',
      ])
    })

    it('does not mutate original model when removing from array', () => {
      const original = ContractConfigModel.fromRawJsonc(jsonc)
      const updated = original.removeFromIgnoredMethods('method1')

      expect(toArray(original.ignoreMethods)).toEqual(['method1', 'method2'])
      expect(toArray(updated.ignoreMethods)).toEqual(['method2'])
    })

    it('does not mutate original model when setting array', () => {
      const original = ContractConfigModel.fromRawJsonc(jsonc)
      const updated = original.setIgnoreMethods(['newMethod'])

      expect(toArray(original.ignoreMethods)).toEqual(['method1', 'method2'])
      expect(toArray(updated.ignoreMethods)).toEqual(['newMethod'])
    })

    it('peek returns cloned data, mutations do not affect original', () => {
      const model = ContractConfigModel.fromRawJsonc(jsonc)
      const peeked = model.peek()

      if (peeked.ignoreMethods) {
        ;(peeked.ignoreMethods as string[]).push('hacker')
      }

      expect(toArray(model.ignoreMethods)).toEqual(['method1', 'method2'])
    })

    it('multiple operations create independent instances', () => {
      const original = ContractConfigModel.fromRawJsonc(jsonc)
      const branch1 = original.addToIgnoredMethods('branch1Method')
      const branch2 = original.addToIgnoredMethods('branch2Method')

      expect(toArray(original.ignoreMethods)).toEqual(['method1', 'method2'])
      expect(toArray(branch1.ignoreMethods)).toEqual([
        'method1',
        'method2',
        'branch1Method',
      ])
      expect(toArray(branch2.ignoreMethods)).toEqual([
        'method1',
        'method2',
        'branch2Method',
      ])
    })
  })

  describe('edge cases', () => {
    it('isEmpty returns true for empty config', () => {
      const model = new ContractConfigModel({} as any)
      expect(model.isEmpty()).toEqual(true)
    })

    it('isEmpty returns false for config with values', () => {
      const model = ContractConfigModel.fromRawJsonc(
        `{ "ignoreMethods": ["m1"] }`,
      )
      expect(model.isEmpty()).toEqual(false)
    })

    it('hasDefinition works correctly', () => {
      const model = ContractConfigModel.fromRawJsonc(
        `{ "ignoreMethods": ["m1"] }`,
      )
      expect(model.hasDefinition('ignoreMethods')).toEqual(true)
      expect(model.hasDefinition('ignoreRelatives')).toEqual(false)
    })

    it('removing last element makes array undefined', () => {
      const model = ContractConfigModel.fromRawJsonc(
        `{ "ignoreMethods": ["m1"] }`,
      )
      const updated = model.removeFromIgnoredMethods('m1')

      expect(updated.ignoreMethods === undefined).toEqual(true)
      expect(updated.isEmpty()).toEqual(true)
    })
  })

  describe('hasComments', () => {
    it('returns true when config has comments', () => {
      const jsonc = `{
        // This is a comment
        "ignoreMethods": ["method1"]
      }`
      const model = ContractConfigModel.fromRawJsonc(jsonc)

      expect(model.hasComments()).toEqual(true)
    })

    it('returns false when config has no comments', () => {
      const jsonc = `{ "ignoreMethods": ["method1"] }`
      const model = ContractConfigModel.fromRawJsonc(jsonc)

      expect(model.hasComments()).toEqual(false)
    })
  })
})

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

      expect(text).toInclude('Top comment')
      expect(text).toInclude('"test-project"')
    })

    it('preserves comments after modifying overrides', () => {
      const model = ConfigModel.fromRawJsonc(jsonc)
      const updated = model.addToIgnoredMethods('0xContract1', 'method2')

      const text = updated.toString()
      expect(text).toInclude('Top comment')
      expect(text).toInclude('"method2"')
    })

    it('preserves comments when pruning empty overrides', () => {
      const model = ConfigModel.fromRawJsonc(jsonc)
      const updated = model.removeFromIgnoredMethods('0xContract1', 'method1')

      const text = updated.toString()
      expect(text).toInclude('Top comment')
      expect(text).not.toInclude('0xContract1')
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

    it('does not mutate original config when adding method', () => {
      const original = ConfigModel.fromRawJsonc(jsonc)
      const updated = original.addToIgnoredMethods('0xContractA', 'method3')

      expect(toArray(original.getIgnoredMethods('0xContractA'))).toEqual([
        'method1',
        'method2',
      ])
      expect(toArray(updated.getIgnoredMethods('0xContractA'))).toEqual([
        'method1',
        'method2',
        'method3',
      ])
    })

    it('does not mutate original config when removing method', () => {
      const original = ConfigModel.fromRawJsonc(jsonc)
      const updated = original.removeFromIgnoredMethods(
        '0xContractA',
        'method1',
      )

      expect(toArray(original.getIgnoredMethods('0xContractA'))).toEqual([
        'method1',
        'method2',
      ])
      expect(toArray(updated.getIgnoredMethods('0xContractA'))).toEqual([
        'method2',
      ])
    })

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

    it('multiple independent branches', () => {
      const original = ConfigModel.fromRawJsonc(jsonc)
      const branch1 = original.addToIgnoredMethods(
        '0xContractA',
        'branch1Method',
      )
      const branch2 = original.addToIgnoredMethods(
        '0xContractA',
        'branch2Method',
      )

      expect(toArray(original.getIgnoredMethods('0xContractA'))).toEqual([
        'method1',
        'method2',
      ])
      expect(toArray(branch1.getIgnoredMethods('0xContractA'))).toEqual([
        'method1',
        'method2',
        'branch1Method',
      ])
      expect(toArray(branch2.getIgnoredMethods('0xContractA'))).toEqual([
        'method1',
        'method2',
        'branch2Method',
      ])
    })

    it('sequential operations maintain immutability chain', () => {
      const v1 = ConfigModel.fromRawJsonc(jsonc)
      const v2 = v1.addToIgnoredMethods('0xContractA', 'm3')
      const v3 = v2.addToIgnoredMethods('0xContractA', 'm4')
      const v4 = v3.removeFromIgnoredMethods('0xContractA', 'method1')

      expect(toArray(v1.getIgnoredMethods('0xContractA'))).toEqual([
        'method1',
        'method2',
      ])
      expect(toArray(v2.getIgnoredMethods('0xContractA'))).toEqual([
        'method1',
        'method2',
        'm3',
      ])
      expect(toArray(v3.getIgnoredMethods('0xContractA'))).toEqual([
        'method1',
        'method2',
        'm3',
        'm4',
      ])
      expect(toArray(v4.getIgnoredMethods('0xContractA'))).toEqual([
        'method2',
        'm3',
        'm4',
      ])
    })
  })

  describe('override management', () => {
    it('creates new override when adding to non-existent contract', () => {
      const model = ConfigModel.fromRawJsonc(`{ "name": "test" }`)
      const updated = model.addToIgnoredMethods('0xNew', 'method1')

      expect(toArray(updated.getIgnoredMethods('0xNew'))).toEqual(['method1'])
    })

    it('prunes empty overrides', () => {
      const jsonc = `{ "name": "test", "overrides": { "0xContract": { "ignoreMethods": ["m1"] } } }`
      const model = ConfigModel.fromRawJsonc(jsonc)
      const updated = model.removeFromIgnoredMethods('0xContract', 'm1')

      expect(updated.toString()).not.toInclude('0xContract')
    })

    it('hasOverrideDefinition works correctly', () => {
      const jsonc = `{ "name": "test", "overrides": { "0xContract": { "ignoreMethods": ["m1"] } } }`
      const model = ConfigModel.fromRawJsonc(jsonc)

      expect(
        model.hasOverrideDefinition('0xContract', 'ignoreMethods'),
      ).toEqual(true)
      expect(
        model.hasOverrideDefinition('0xContract', 'ignoreRelatives'),
      ).toEqual(false)
      expect(
        model.hasOverrideDefinition('0xNonExistent', 'ignoreMethods'),
      ).toEqual(false)
    })

    it('supports all three array types', () => {
      const model = ConfigModel.fromRawJsonc(`{ "name": "test" }`)
      const step1 = model.addToIgnoredMethods('0xContract', 'm1')
      const step2 = step1.addToIgnoredRelatives('0xContract', 'r1')
      const step3 = step2.addToIgnoredInWatchMode('0xContract', 'w1')

      expect(toArray(step3.getIgnoredMethods('0xContract'))).toEqual(['m1'])
      expect(toArray(step3.getIgnoreRelatives('0xContract'))).toEqual(['r1'])
      expect(toArray(step3.getIgnoreInWatchMode('0xContract'))).toEqual(['w1'])
    })
  })

  describe('diff and comparison', () => {
    it('diff detects changes', () => {
      const jsonc = `{ "name": "test", "overrides": { "0xContract": { "ignoreMethods": ["m1"] } } }`
      const model1 = ConfigModel.fromRawJsonc(jsonc)
      const model2 = model1.addToIgnoredMethods('0xContract', 'm2')

      expect(model1.diff(model2)).toEqual(true)
    })

    it('diff returns false for identical models', () => {
      const jsonc = `{ "name": "test" }`
      const model1 = ConfigModel.fromRawJsonc(jsonc)
      const model2 = ConfigModel.fromRawJsonc(jsonc)

      expect(model1.diff(model2)).toEqual(false)
    })
  })

  describe('hasComments', () => {
    it('returns true when config has top-level comments', () => {
      const jsonc = `{
        // Top-level comment
        "name": "test-project"
      }`
      const model = ConfigModel.fromRawJsonc(jsonc)

      expect(model.hasComments()).toEqual(true)
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

      expect(model.hasComments()).toEqual(true)
    })

    it('returns false when config has no comments', () => {
      const jsonc = `{ "name": "test-project", "overrides": { "0xContract": { "ignoreMethods": ["method1"] } } }`
      const model = ConfigModel.fromRawJsonc(jsonc)

      expect(model.hasComments()).toEqual(false)
    })
  })

  describe('complex scenarios', () => {
    it('handles multiple overrides independently', () => {
      const jsonc = `{
        "name": "test",
        "overrides": {
          "0xA": { "ignoreMethods": ["a1"] },
          "0xB": { "ignoreMethods": ["b1"] }
        }
      }`

      const original = ConfigModel.fromRawJsonc(jsonc)
      const updated = original.addToIgnoredMethods('0xA', 'a2')

      expect(toArray(updated.getIgnoredMethods('0xA'))).toEqual(['a1', 'a2'])
      expect(toArray(updated.getIgnoredMethods('0xB'))).toEqual(['b1'])
      expect(toArray(original.getIgnoredMethods('0xA'))).toEqual(['a1'])
      expect(toArray(original.getIgnoredMethods('0xB'))).toEqual(['b1'])
    })
  })
})
