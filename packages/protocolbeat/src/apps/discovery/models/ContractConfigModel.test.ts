import { expect } from 'earl'
import { toArray } from './ConfigModel.test'
import { ContractConfigModel } from './ContractConfigModel'

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
