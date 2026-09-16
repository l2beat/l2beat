import { describe, expect, it } from 'vitest'
import { ContractConfigModel } from './ContractConfigModel'
import { toArray } from './toArray'

describe('ContractConfigModel', () => {
  describe('comment preservation', () => {
    const jsonc = `{
      // Comment A
      /** Comment B */
      "ignoreInWatchMode": ["methodWM"], // Comment C
      "ignoreRelatives": ["relative1", "relative2"], // Comment D
      "ignoreMethods": ["methodA",
      // Comment E
      "methodB"], /* Comment F */
      "fields": {
        // Comment G
        "exampleField": {
          "permissions": [{ "type": "sequence" }],
        }
      },
      "description": "new description"
      }`

    it('preserves comments on round-trip no-op', () => {
      const model = ContractConfigModel.fromRawJsonc(jsonc)
      const text = model.toString()

      expect(text).toContain('Comment A')
      expect(text).toContain('Comment B')
      expect(text).toContain('Comment C')
      expect(text).toContain('Comment D')
      expect(text).toContain('Comment E')
      expect(text).toContain('Comment F')
    })

    it('preserves comments after setIgnoreMethods', () => {
      const model = ContractConfigModel.fromRawJsonc(jsonc)
      const updated = model.setIgnoreMethods(['newMethod1'])

      const text = updated.toString()
      expect(text).toContain('Comment A')
      expect(text).toContain('"newMethod1"')
    })

    it('preserves comments when setting description', () => {
      const model = ContractConfigModel.fromRawJsonc(jsonc)

      expect(model.toString()).toContain('Comment G')
      model.setDescription('new description')
      expect(model.toString()).toContain('Comment G')
    })
  })

  describe('data immutability', () => {
    const jsonc = `{
      "ignoreMethods": ["method1", "method2"],
      "ignoreRelatives": ["relative1"]
    }`

    it('does not mutate original model when setting array', () => {
      const original = ContractConfigModel.fromRawJsonc(jsonc)
      const updated = original.setIgnoreMethods(['newMethod'])

      expect(toArray(original.ignoreMethods)).toStrictEqual([
        'method1',
        'method2',
      ])
      expect(toArray(updated.ignoreMethods)).toStrictEqual(['newMethod'])
    })

    it('peek returns cloned data, mutations do not affect original', () => {
      const model = ContractConfigModel.fromRawJsonc(jsonc)
      const peeked = model.peek()

      if (peeked.ignoreMethods) {
        ;(peeked.ignoreMethods as string[]).push('hacker')
      }

      expect(toArray(model.ignoreMethods)).toStrictEqual(['method1', 'method2'])
    })
  })

  describe('edge cases', () => {
    it('isEmpty returns true for empty config', () => {
      const model = new ContractConfigModel({} as any)
      expect(model.isEmpty()).toStrictEqual(true)
    })

    it('isEmpty returns false for config with values', () => {
      const model = ContractConfigModel.fromRawJsonc(
        `{ "ignoreMethods": ["m1"] }`,
      )
      expect(model.isEmpty()).toStrictEqual(false)
    })

    it('hasDefinition works correctly', () => {
      const model = ContractConfigModel.fromRawJsonc(
        `{ "ignoreMethods": ["m1"] }`,
      )
      expect(model.hasDefinition('ignoreMethods')).toStrictEqual(true)
      expect(model.hasDefinition('ignoreRelatives')).toStrictEqual(false)
    })
  })

  describe('hasComments', () => {
    it('returns true when config has comments', () => {
      const jsonc = `{
        // This is a comment
        "ignoreMethods": ["method1"]
      }`
      const model = ContractConfigModel.fromRawJsonc(jsonc)

      expect(model.hasComments()).toStrictEqual(true)
    })

    it('returns false when config has no comments', () => {
      const jsonc = `{ "ignoreMethods": ["method1"] }`
      const model = ContractConfigModel.fromRawJsonc(jsonc)

      expect(model.hasComments()).toStrictEqual(false)
    })
  })

  describe('setDescription', () => {
    it('sets description', () => {
      const model = ContractConfigModel.fromRawJsonc(
        `{ "description": "test" }`,
      )
      expect(model.description).toStrictEqual('test')
      const updated = model.setDescription('new description')
      expect(updated.description).toStrictEqual('new description')
    })

    it('removes description when setting to undefined', () => {
      const model = ContractConfigModel.fromRawJsonc(
        `{ "description": "test" }`,
      )
      expect(model.description).toStrictEqual('test')
      const updated = model.setDescription(undefined)
      expect(updated.description).toStrictEqual(undefined)
      const string = updated.toString()
      expect(string).not.toContain('description')
    })
  })
})
